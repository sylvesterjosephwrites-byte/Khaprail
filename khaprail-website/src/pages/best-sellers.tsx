import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/products/product-card"
import { useFeaturedProducts } from "@/hooks/use-featured-products"

// /best-sellers (01-SITE-MAP.md) — admin-curated via the real `is_featured`
// flag, same honest-data source as the homepage rail (catalog-highlights.tsx).
export function BestSellers() {
  const { products, isLoading, error } = useFeaturedProducts()

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl">Best Sellers</h1>
          <p className="mt-2 text-muted-foreground">Hand-picked by our team.</p>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : error || products.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Best sellers are hand-picked by our team as real sales data builds up — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
