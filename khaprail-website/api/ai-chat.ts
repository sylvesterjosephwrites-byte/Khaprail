import { createClient } from "@supabase/supabase-js"

// Vercel serverless function (Node.js runtime, Web Fetch API handler
// signature) — proxies the Anthropic API. `ANTHROPIC_API_KEY` and
// `SUPABASE_SERVICE_ROLE_KEY` are server-only env vars, never sent to the
// browser; the client never talks to Anthropic directly. See
// 00-PROGRESS.md for the manual setup steps (both keys must be added in
// the Vercel dashboard before this actually works).

// No `config`/`runtime` export — Node.js is already the default for a
// plain (non-Next.js) Vercel Function; `{ runtime: "nodejs" }` isn't a
// recognized value for this convention (only `"edge"` is a real opt-in
// here) and risked being silently misinterpreted.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
const MODEL = "claude-haiku-4-5-20251001"
const CHAT_MAX_TOKENS = 300
const SUMMARY_MAX_TOKENS = 200
const RATE_LIMIT_PER_HOUR = 20
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
// Nothing in this function should ever hang past these — a stuck Supabase
// or Anthropic call previously caused the whole request to hang forever
// with no response, discovered by actually testing chat live in-browser.
const RATE_LIMIT_CHECK_TIMEOUT_MS = 5000
const ANTHROPIC_FETCH_TIMEOUT_MS = 45000

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer!)
  }
}

// Shared, cacheable core instructions — identical across every request
// regardless of mode/page, so Anthropic's prompt caching (cache_control on
// this block) only bills full price for the first call in the cache
// window, not every summary/chat call. Real, always-true grounding rules
// only — the model is instructed to defer to WhatsApp/the sample flow for
// anything it wasn't actually given.
const STATIC_SYSTEM_PROMPT = `You are the AI assistant for Khaprail Tiles, a clay roof tile and terracotta tile manufacturer based in Lahore, Pakistan, established in 1982. You help website visitors understand real products and categories using only the factual data given to you in this conversation's context — never invent specifications, prices, stock levels, delivery timelines, product names, category names, tile styles/profiles, or any other company fact you were not explicitly given.

Do not name a specific product, category, tile style, or profile unless it appears verbatim in the context given to you below. If you weren't given a real list of categories/products for this conversation, speak only in general terms about clay roof tiles and terracotta tiles and explicitly say you don't have the specific catalog in front of you right now — do not list example tile types, styles, or profiles from general knowledge, since Khaprail's actual range may not include them.

If asked something you don't have real data for (exact delivery timelines, current stock, discounts, anything not listed in your context), say so plainly and suggest contacting Khaprail Tiles via WhatsApp or the "Get a Sample" flow already on the site, rather than guessing or inventing an answer.

If a visitor expresses purchase intent (wanting to order, buy, or check out), do not attempt to complete a transaction yourself — point them to the existing "Get a Sample" WhatsApp flow.

Keep responses concise (a few sentences), warm, and specific to the real data given. Plain conversational text — no markdown headers or heavy formatting, this renders in a small chat widget.`

interface ProductContext {
  name: string
  material?: string | null
  finish?: string | null
  size?: string | null
  thickness?: string | null
  country_of_origin?: string | null
  price?: number | null
  applications?: string[]
}

interface CategoryContext {
  name: string
  filters?: Record<string, string[]>
}

type ChatContext =
  | { type: "product"; product: ProductContext }
  | { type: "category"; category: CategoryContext }
  | { type: "general"; categoryNames?: string[] }

interface ChatRequestBody {
  mode: "summary" | "chat"
  product?: ProductContext
  context?: ChatContext
  messages?: { role: "user" | "assistant"; content: string }[]
  message?: string
  sessionId?: string
}

function formatProductContext(product: ProductContext): string {
  const lines = [
    `Product name: ${product.name}`,
    product.material && `Material: ${product.material}`,
    product.finish && `Finish: ${product.finish}`,
    product.size && `Size: ${product.size}`,
    product.thickness && `Thickness: ${product.thickness}`,
    product.country_of_origin && `Country of origin: ${product.country_of_origin}`,
    product.price != null && `Price: PKR ${product.price.toLocaleString()}`,
    product.applications?.length && `Suitable for: ${product.applications.join(", ")}`,
  ].filter(Boolean)
  return lines.join("\n")
}

function buildDynamicSystemBlock(input: { mode: string; product?: ProductContext; context?: ChatContext }): string {
  if (input.mode === "summary" && input.product) {
    return `Here is the real data for the product you're summarizing:\n${formatProductContext(input.product)}\n\nWrite a concise, appealing 2-3 sentence summary for this product's detail page, using only the facts above. Do not invent details not listed. Do not mention that you are an AI or that this is a summary — just write the summary text itself.`
  }

  const ctx = input.context
  if (!ctx || ctx.type === "general") {
    const names = ctx?.type === "general" ? ctx.categoryNames : undefined
    return names?.length
      ? `The visitor is browsing the Khaprail Tiles website generally — no specific product or category page is open right now. These are Khaprail's real category names (the only ones you may reference by name): ${names.join(", ")}.`
      : "The visitor is browsing the Khaprail Tiles website generally — no specific product or category page is open right now, and no real category/product list was provided for this conversation. Do not name specific tile types, styles, or categories."
  }
  if (ctx.type === "product") {
    return `The visitor is currently looking at this product page:\n${formatProductContext(ctx.product)}`
  }
  // category
  const filterLines = ctx.category.filters
    ? Object.entries(ctx.category.filters)
        .filter(([, values]) => values.length > 0)
        .map(([type, values]) => `- ${type}: ${values.join(", ")}`)
        .join("\n")
    : ""
  return `The visitor is currently browsing the "${ctx.category.name}" category page.${
    filterLines ? `\n\nReal filter values available on this page:\n${filterLines}` : ""
  }`
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || "unknown"
}

function getServiceClient() {
  const url = process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

/**
 * Rate limiting is required, not optional (00-PROGRESS.md) — so if
 * `SUPABASE_SERVICE_ROLE_KEY` isn't configured yet, chat is refused
 * outright rather than silently allowed unlimited/unmetered (which would
 * defeat the entire point of the cap while looking like it worked).
 */
async function checkAndRecordRateLimit(sessionId: string, ip: string): Promise<boolean> {
  const client = getServiceClient()
  if (!client) return false

  // Any failure here (network hiccup, bad key, slow Supabase) fails
  // closed — chat refused rather than silently unmetered — but never
  // hangs the whole request past `RATE_LIMIT_CHECK_TIMEOUT_MS`.
  try {
    return await withTimeout(
      (async () => {
        const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
        const { count, error: countError } = await client
          .from("chat_usage")
          .select("*", { count: "exact", head: true })
          .eq("session_id", sessionId)
          .gte("created_at", since)

        if (countError) throw countError
        if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) return false

        await client.from("chat_usage").insert({ session_id: sessionId, ip_address: ip })
        return true
      })(),
      RATE_LIMIT_CHECK_TIMEOUT_MS,
      "Rate limit check"
    )
  } catch {
    return false
  }
}

async function verifyAdminToken(authHeader: string | null): Promise<boolean> {
  if (!authHeader?.startsWith("Bearer ")) return false
  const url = process.env.VITE_SUPABASE_URL
  const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !publishableKey) return false
  try {
    const client = createClient(url, publishableKey)
    const { data, error } = await withTimeout(
      client.auth.getUser(authHeader.slice("Bearer ".length)),
      RATE_LIMIT_CHECK_TIMEOUT_MS,
      "Admin token check"
    )
    return !error && !!data.user
  } catch {
    return false
  }
}

function streamAnthropicText(anthropicResponse: Response): ReadableStream<Uint8Array> {
  const reader = anthropicResponse.body!.getReader()
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ""

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read()
      if (done) {
        controller.close()
        return
      }
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue
        const payload = line.slice(6).trim()
        if (!payload || payload === "[DONE]") continue
        try {
          const event = JSON.parse(payload)
          if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text as string))
          }
        } catch {
          // Ignore a malformed/partial SSE line — the next pull will
          // pick up the rest once buffered.
        }
      }
    },
  })
}

async function callAnthropic(options: {
  system: { type: "text"; text: string; cache_control?: { type: "ephemeral" } }[]
  messages: { role: "user" | "assistant"; content: string }[]
  maxTokens: number
  stream: boolean
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured on the server yet.")
  }

  // Bounds how long we wait for Anthropic to start responding (headers),
  // not the full streamed duration — `fetch()` resolves once the response
  // begins, before the body is fully read.
  return fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "prompt-caching-2024-07-31",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: options.maxTokens,
      system: options.system,
      messages: options.messages,
      stream: options.stream,
    }),
    signal: AbortSignal.timeout(ANTHROPIC_FETCH_TIMEOUT_MS),
  })
}

// Vercel's convention for a plain (non-Next.js) project is a default
// export whose `fetch` METHOD handles the request — `export default async
// function handler(request)` (a bare function) is the wrong shape and was
// the actual cause of every request hanging with zero bytes ever sent
// back, confirmed live: even a plain GET (which returns synchronously,
// before touching Supabase or Anthropic) hung identically, and curl -v
// showed the request fully sent with the connection open but nothing ever
// received. https://vercel.com/docs/functions/functions-api-reference
//
// Also wraps every request in a top-level try/catch — a hang or uncaught
// throw anywhere below would otherwise leave the client waiting forever
// with no response at all.
export default {
  async fetch(request: Request): Promise<Response> {
    try {
      return await handleRequest(request)
    } catch (err) {
      return Response.json({ error: "unhandled_error", detail: (err as Error).message }, { status: 500 })
    }
  },
}

async function handleRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "method_not_allowed" }, { status: 405 })
  }

  let body: ChatRequestBody
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 })
  }

  const staticBlock = { type: "text" as const, text: STATIC_SYSTEM_PROMPT, cache_control: { type: "ephemeral" as const } }

  if (body.mode === "summary") {
    const isAdmin = await verifyAdminToken(request.headers.get("authorization"))
    if (!isAdmin) {
      return Response.json({ error: "unauthorized" }, { status: 401 })
    }
    if (!body.product?.name) {
      return Response.json({ error: "missing_product" }, { status: 400 })
    }

    const dynamicBlock = { type: "text" as const, text: buildDynamicSystemBlock({ mode: "summary", product: body.product }) }

    try {
      const response = await callAnthropic({
        system: [staticBlock, dynamicBlock],
        messages: [{ role: "user", content: "Write the summary now." }],
        maxTokens: SUMMARY_MAX_TOKENS,
        stream: false,
      })
      if (!response.ok) {
        const detail = await response.text()
        return Response.json({ error: "anthropic_error", detail }, { status: 502 })
      }
      const data = await response.json()
      const summary = data.content?.[0]?.type === "text" ? data.content[0].text.trim() : ""
      return Response.json({ summary })
    } catch (err) {
      return Response.json({ error: "server_error", detail: (err as Error).message }, { status: 500 })
    }
  }

  if (body.mode === "chat") {
    const sessionId = body.sessionId
    if (!sessionId) {
      return Response.json({ error: "missing_session" }, { status: 400 })
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json(
        { error: "not_configured", message: "The AI assistant isn't fully set up yet — please use WhatsApp instead." },
        { status: 503 }
      )
    }
    const ip = getClientIp(request)

    const allowed = await checkAndRecordRateLimit(sessionId, ip)
    if (!allowed) {
      return Response.json(
        {
          error: "rate_limited",
          message: "You've reached the chat limit for now — try again in a bit, or reach us on WhatsApp.",
        },
        { status: 429 }
      )
    }

    if (!body.message) {
      return Response.json({ error: "missing_message" }, { status: 400 })
    }

    const dynamicBlock = { type: "text" as const, text: buildDynamicSystemBlock({ mode: "chat", context: body.context }) }
    const history = (body.messages ?? []).slice(-20)

    try {
      const response = await callAnthropic({
        system: [staticBlock, dynamicBlock],
        messages: [...history, { role: "user", content: body.message }],
        maxTokens: CHAT_MAX_TOKENS,
        stream: true,
      })
      if (!response.ok || !response.body) {
        const detail = await response.text()
        return Response.json({ error: "anthropic_error", detail }, { status: 502 })
      }
      return new Response(streamAnthropicText(response), {
        headers: { "content-type": "text/plain; charset=utf-8" },
      })
    } catch (err) {
      return Response.json({ error: "server_error", detail: (err as Error).message }, { status: 500 })
    }
  }

  return Response.json({ error: "invalid_mode" }, { status: 400 })
}
