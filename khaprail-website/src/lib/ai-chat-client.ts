// Thin client for /api/ai-chat (the Anthropic proxy — see api/ai-chat.ts).
// The Anthropic API key never touches this file or the browser at all;
// every call here is a same-origin POST to our own serverless function.

export interface ProductAiContext {
  name: string
  material?: string | null
  finish?: string | null
  size?: string | null
  thickness?: string | null
  country_of_origin?: string | null
  price?: number | null
  applications?: string[]
}

export interface CategoryAiContext {
  name: string
  filters?: Record<string, string[]>
}

export type ChatAiContext =
  | { type: "product"; product: ProductAiContext }
  | { type: "category"; category: CategoryAiContext }
  | { type: "general"; categoryNames?: string[] }

export interface ChatHistoryMessage {
  role: "user" | "assistant"
  content: string
}

/** A real row returned by the backend's `search_products` tool call — never model-generated (see api/ai-chat.ts). */
export interface ChatProductCard {
  name: string
  slug: string
  price: number | null
  cover_image_url: string | null
  category_name: string | null
}

export interface ChatReplyResult {
  products: ChatProductCard[]
  /** Real `filter_types` values only — empty until Sylvester populates that table (see api/ai-chat.ts). */
  chips: string[]
}

const SESSION_STORAGE_KEY = "khaprail-chat-session-id"

/** A persistent (localStorage-backed) per-browser id used only for chat rate-limit bookkeeping — not an auth identity. */
export function getChatSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(SESSION_STORAGE_KEY, id)
    }
    return id
  } catch {
    // Storage unavailable (private mode, blocked) — fall back to a
    // per-page-load id; rate limiting still applies, just less durably.
    return crypto.randomUUID()
  }
}

/** Admin-only — generates a summary for one product. Requires the caller's Supabase access token (verified server-side). */
export async function generateProductSummary(
  product: ProductAiContext,
  accessToken: string
): Promise<string> {
  const res = await fetch("/api/ai-chat", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ mode: "summary", product }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error === "unauthorized" ? "You must be signed in to generate a summary." : (data.detail ?? "Failed to generate summary."))
  return data.summary as string
}

export type SummaryTone = "architectural" | "commercial" | "minimal"

/**
 * Admin-only — generates a static product summary via the dedicated
 * `/api/ai/generate-summary` endpoint. Tone-aware: the selected tone
 * (architectural / commercial / minimal) shapes the Claude Haiku prompt.
 * The result is meant to be saved to the DB by the admin form — customer
 * page views never trigger any AI API calls.
 */
export async function generateStaticSummary(
  product: ProductAiContext,
  tone: SummaryTone,
  accessToken: string,
  categoryName?: string,
): Promise<string> {
  const res = await fetch("/api/ai/generate-summary", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: product.name,
      category: categoryName ?? null,
      finish: product.finish ?? null,
      size: product.size ?? null,
      thickness: product.thickness ?? null,
      country_of_origin: product.country_of_origin ?? null,
      price: product.price ?? null,
      material: product.material ?? null,
      applications: product.applications ?? [],
      tone,
    }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(
      data.error === "unauthorized"
        ? "You must be signed in to generate a summary."
        : data.error === "server_config"
          ? "AI service is not configured on the server yet."
          : (data.detail ?? data.message ?? "Failed to generate summary.")
    )
  }
  return data.summary as string
}

export class ChatRateLimitError extends Error {}

// NUL never appears in real assistant text — the backend appends it once
// before the structured product-card/chip JSON payload (see api/ai-chat.ts's
// `DATA_DELIMITER`), so splitting on it is unambiguous regardless of how the
// stream happens to chunk.
const DATA_DELIMITER = String.fromCharCode(0)

/**
 * Streams a chat reply, invoking `onChunk` with prose text as it arrives,
 * and resolves with any real product cards / quick-refine chips the
 * backend's `search_products` tool call turned up this turn (empty arrays
 * for an ordinary text-only reply). Throws `ChatRateLimitError` with the
 * friendly fallback message when the visitor has hit the cap.
 */
export async function streamChatReply(
  options: {
    message: string
    history: ChatHistoryMessage[]
    context: ChatAiContext
  },
  onChunk: (text: string) => void
): Promise<ChatReplyResult> {
  const res = await fetch("/api/ai-chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      mode: "chat",
      message: options.message,
      messages: options.history,
      context: options.context,
      sessionId: getChatSessionId(),
    }),
  })

  if (res.status === 429) {
    const data = await res.json().catch(() => null)
    throw new ChatRateLimitError(
      data?.message ?? "You've reached the chat limit for now — try again in a bit, or reach us on WhatsApp."
    )
  }
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? data?.detail ?? "The AI assistant is temporarily unavailable — try WhatsApp instead.")
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let sawDelimiter = false
  let trailingJson = ""
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    if (!sawDelimiter) {
      const delimiterIndex = chunk.indexOf(DATA_DELIMITER)
      if (delimiterIndex === -1) {
        onChunk(chunk)
      } else {
        sawDelimiter = true
        const before = chunk.slice(0, delimiterIndex)
        if (before) onChunk(before)
        trailingJson += chunk.slice(delimiterIndex + 1)
      }
    } else {
      trailingJson += chunk
    }
  }

  if (!trailingJson) return { products: [], chips: [] }
  try {
    const parsed = JSON.parse(trailingJson)
    return {
      products: Array.isArray(parsed.products) ? parsed.products : [],
      chips: Array.isArray(parsed.chips) ? parsed.chips : [],
    }
  } catch {
    return { products: [], chips: [] }
  }
}
