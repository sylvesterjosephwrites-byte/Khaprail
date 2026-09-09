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

export class ChatRateLimitError extends Error {}

/** Streams a chat reply, invoking `onChunk` as text arrives. Throws `ChatRateLimitError` with the friendly fallback message when the visitor has hit the cap. */
export async function streamChatReply(
  options: {
    message: string
    history: ChatHistoryMessage[]
    context: ChatAiContext
  },
  onChunk: (text: string) => void
): Promise<void> {
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
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    onChunk(decoder.decode(value, { stream: true }))
  }
}
