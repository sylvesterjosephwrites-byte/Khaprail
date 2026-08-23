import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/products/product-card"
import { useNewArrivals } from "@/hooks/use-new-arrivals"

// /new-arrivals (01-SITE-MAP.md) — real `created_at`, newest first, same
// honest-data source as the homepage rail (catalog-highlights.tsx).
export function NewArrivals() {
  const { products, isLoading, error } = useNewArrivals()

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-5xl font-semibold sm:text-6xl">New Arrivals</h1>
          <p className="mt-2 text-muted-foreground">Our latest additions to the catalog.</p>
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
          <p className="py-16 text-center text-sm text-muted-foreground">New arrivals coming soon.</p>
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
