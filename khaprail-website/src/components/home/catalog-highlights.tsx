import { Link } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/products/product-card"
import { useFeaturedProducts } from "@/hooks/use-featured-products"
import { useNewArrivals } from "@/hooks/use-new-arrivals"

const RAIL_LIMIT = 4

// Best Sellers and New Arrivals (04-PRODUCT-LISTING-FILTERS.md,
// 02-DESIGN-SYSTEM.md Von Restorff badge treatment). Best Sellers is
// admin-curated via the real `is_featured` flag (no orders/inquiry data rich
// enough yet to rank by), New Arrivals is real `created_at` — never a
// fabricated ranking either way.
export function CatalogHighlights() {
  const featured = useFeaturedProducts(RAIL_LIMIT)
  const newArrivals = useNewArrivals(RAIL_LIMIT)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-4 sm:px-6">
      <ProductRail
        title="Best Sellers"
        emptyCopy="Best sellers are hand-picked by our team as real sales data builds up — check back soon."
        viewAllTo="/best-sellers"
        {...featured}
      />
      <ProductRail
        title="New Arrivals"
        emptyCopy="New arrivals will appear here as soon as they're added to the catalog."
        viewAllTo="/new-arrivals"
        {...newArrivals}
      />
    </div>
  )
}

interface ProductRailProps {
  title: string
  emptyCopy: string
  viewAllTo: string
  products: ReturnType<typeof useFeaturedProducts>["products"]
  isLoading: boolean
  error: string | null
}

function ProductRail({ title, emptyCopy, viewAllTo, products, isLoading, error }: ProductRailProps) {
  const hasProducts = !isLoading && !error && products.length > 0

  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-heading text-3xl font-semibold sm:text-4xl">{title}</h2>
        {hasProducts && (
          <Link to={viewAllTo} className="text-sm font-medium text-primary hover:underline">
            View All
          </Link>
        )}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {Array.from({ length: RAIL_LIMIT }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : hasProducts ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-4 text-sm text-muted-foreground">{emptyCopy}</p>
      )}
    </section>
  )
}
