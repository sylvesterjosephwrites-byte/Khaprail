import { Link } from "react-router-dom"
import type { ChatProductCard } from "@/lib/ai-chat-client"

interface AiChatProductCardProps {
  product: ChatProductCard
}

// A compact card for the chat panel's horizontally-scrollable recommendation
// row — always built directly from a real `search_products` tool result
// (api/ai-chat.ts), never from model-generated text. Smaller than the
// full-size `ProductCard` used on /products (no "Get a Sample" button —
// tapping just opens the real PDP, matching the spec's "tappable" card).
export function AiChatProductCard({ product }: AiChatProductCardProps) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="flex w-32 shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-card outline-none transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-white">
        {product.cover_image_url ? (
          <img src={product.cover_image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground">No photo</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-2">
        {product.category_name && (
          <span className="truncate text-[0.65rem] tracking-wide text-muted-foreground uppercase">{product.category_name}</span>
        )}
        <span className="line-clamp-2 text-sm font-medium text-foreground">{product.name}</span>
        {product.price != null && <span className="text-sm font-semibold text-price">PKR {product.price.toLocaleString()}</span>}
      </div>
    </Link>
  )
}
