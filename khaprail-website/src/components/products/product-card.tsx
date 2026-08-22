import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import type { Product } from "@/types/product"

const NEW_ARRIVAL_WINDOW_DAYS = 60

function isNewArrival(createdAt: string): boolean {
  const ageMs = Date.now() - new Date(createdAt).getTime()
  return ageMs < NEW_ARRIVAL_WINDOW_DAYS * 24 * 60 * 60 * 1000
}

interface ProductCardProps {
  product: Product
}

// Listing card per 04-PRODUCT-LISTING-FILTERS.md: photo, name, starting size,
// quick "Get a Sample" action. "New Arrival" is computed from the real
// `created_at` column, never manually curated (02-DESIGN-SYSTEM.md "honest
// data only").
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="p-0">
      <Link to={`/products/${product.slug}`} className="group/link outline-none">
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-muted">
          {product.cover_image_url && (
            <img src={product.cover_image_url} alt="" className="h-full w-full object-cover" />
          )}
          {isNewArrival(product.created_at) && (
            <Badge className="absolute top-2 left-2">New Arrival</Badge>
          )}
        </div>
        <CardContent className="flex flex-col gap-1 pt-3 pb-3">
          <h3 className="font-medium text-foreground group-hover/link:underline">{product.name}</h3>
          {product.size && <p className="text-sm text-muted-foreground">{product.size}</p>}
        </CardContent>
      </Link>
      <CardContent className="pb-4">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          nativeButton={false}
          render={
            <a
              href={buildWhatsAppUrl(`Hi, I'd like to request a sample of ${product.name}.`)}
              target="_blank"
              rel="noreferrer"
            />
          }
        >
          Get a Sample
        </Button>
      </CardContent>
    </Card>
  )
}
