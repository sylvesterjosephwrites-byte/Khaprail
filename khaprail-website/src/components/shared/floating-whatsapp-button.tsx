import { useMatch } from "react-router-dom"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { useProduct } from "@/hooks/use-product"
import { buildSampleRequestMessage, buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp"

// Persistent site-wide "chat on WhatsApp" affordance (Fitts's Law —
// 02-DESIGN-SYSTEM.md — a large, thumb-reachable CTA on every page). On a
// product page the message names the product, reusing the same wording
// helper as the PDP sample dialog and product cards instead of duplicating it.
export function FloatingWhatsAppButton() {
  const productMatch = useMatch("/products/:slug")
  const { product } = useProduct(productMatch?.params.slug)

  const message = product ? buildSampleRequestMessage(product.name) : DEFAULT_WHATSAPP_MESSAGE

  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Khaprail Tiles on WhatsApp"
      className="fixed right-5 z-50 flex size-14 items-center justify-center rounded-full bg-navy text-navy-foreground shadow-lg transition-transform outline-none hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95"
      style={{ bottom: "max(1.25rem, calc(env(safe-area-inset-bottom) + 1rem))" }}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  )
}
