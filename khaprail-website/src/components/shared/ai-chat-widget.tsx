import { useRef, useState, type FormEvent } from "react"
import { useMatch } from "react-router-dom"
import { MessageCircleIcon, XIcon, SendIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProduct } from "@/hooks/use-product"
import { useCategory } from "@/hooks/use-category"
import { useFilterTypes } from "@/hooks/use-filter-types"
import {
  streamChatReply,
  ChatRateLimitError,
  type ChatAiContext,
  type ChatHistoryMessage,
} from "@/lib/ai-chat-client"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  /** A locally-shown notice (rate limit / error) — never sent to the API as conversation history. */
  isNotice?: boolean
}

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content: "Hi! I'm the Khaprail Tiles assistant. Ask me about a product, a category, or anything on the site.",
}

// Site-wide floating chat widget (every page). Bottom-left, so it never
// collides with the WhatsApp button (bottom-right on desktop) or the
// mobile bottom tab bar's elevated "Get a Sample" button (center). Grounds
// every reply in real page context — see `buildContext()` — and never
// calls Anthropic directly from the browser (goes through /api/ai-chat).
export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const productMatch = useMatch("/products/:slug")
  const categoryMatch = useMatch("/categories/:slug")
  const { product } = useProduct(productMatch?.params.slug)
  const { category } = useCategory(categoryMatch?.params.slug)
  const { filterGroups } = useFilterTypes()

  function buildContext(): ChatAiContext {
    if (productMatch && product) {
      const material = product.product_attributes.find((a) => a.attribute_type.toLowerCase() === "material")?.value
      const applications = product.product_attributes
        .filter((a) => a.attribute_type.toLowerCase() === "application")
        .map((a) => a.value)
      return {
        type: "product",
        product: {
          name: product.name,
          material,
          finish: product.finish,
          size: product.size,
          thickness: product.thickness,
          country_of_origin: product.country_of_origin,
          price: product.price,
          applications,
        },
      }
    }
    if (categoryMatch && category) {
      const filters = Object.fromEntries(
        Object.entries(filterGroups).map(([type, options]) => [type, options.map((o) => o.value)])
      )
      return { type: "category", category: { name: category.name, filters } }
    }
    return { type: "general" }
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    })
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const text = input.trim()
    if (!text || isStreaming) return

    const history: ChatHistoryMessage[] = messages
      .filter((m) => !m.isNotice)
      .map((m) => ({ role: m.role, content: m.content }))

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text }
    const assistantId = crypto.randomUUID()
    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "" }])
    setInput("")
    setIsStreaming(true)
    scrollToBottom()

    try {
      await streamChatReply({ message: text, history, context: buildContext() }, (chunk) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m))
        )
        scrollToBottom()
      })
    } catch (err) {
      const message =
        err instanceof ChatRateLimitError
          ? err.message
          : "The AI assistant is temporarily unavailable — try WhatsApp instead."
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: message, isNotice: true } : m))
      )
    } finally {
      setIsStreaming(false)
      scrollToBottom()
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Chat with Khaprail Tiles AI assistant"}
        aria-expanded={isOpen}
        className="fixed left-5 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform outline-none hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] lg:bottom-[max(1.25rem,calc(env(safe-area-inset-bottom)+1rem))]"
      >
        {isOpen ? <XIcon className="size-6" /> : <MessageCircleIcon className="size-6" />}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Khaprail Tiles AI assistant"
          className="fixed inset-x-4 z-40 flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl bottom-[calc(env(safe-area-inset-bottom)+9.5rem)] sm:inset-x-auto sm:left-5 sm:w-96 lg:bottom-24"
        >
          <div className="flex items-center gap-2 border-b border-border p-3">
            <SparklesIcon className="size-4 text-primary" />
            <span className="font-heading text-sm font-semibold">Khaprail Assistant</span>
            <span className="ml-auto text-[0.65rem] text-muted-foreground">AI-generated, may be imperfect</span>
          </div>

          <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : m.isNotice
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-foreground"
                )}
              >
                {m.content || (isStreaming && m.role === "assistant" ? "…" : "")}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                productMatch
                  ? "Ask about this product…"
                  : categoryMatch
                    ? "Ask about this category…"
                    : "Ask about Khaprail Tiles…"
              }
              disabled={isStreaming}
              className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            />
            <Button type="submit" size="icon" className="size-10 shrink-0 rounded-full" disabled={isStreaming || !input.trim()}>
              <SendIcon className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
