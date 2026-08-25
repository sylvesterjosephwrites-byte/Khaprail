import { ProductRail } from "@/components/shared/product-rail"
import { useNewArrivals } from "@/hooks/use-new-arrivals"

const RAIL_LIMIT = 8

// "New Arrivals" (10-HOMEPAGE-SPEC.md) — real `created_at`, newest first.
export function NewArrivalsSection() {
  const { products, isLoading, error } = useNewArrivals(RAIL_LIMIT)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <ProductRail
        title="New Arrivals"
        emptyCopy="New arrivals will appear here as soon as they're added to the catalog."
        viewAllTo="/new-arrivals"
        products={products}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}
