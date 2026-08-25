import { ProductRail } from "@/components/shared/product-rail"
import { useBestSellers } from "@/hooks/use-best-sellers"

const RAIL_LIMIT = 8

// "Best Sellers" (10-HOMEPAGE-SPEC.md) — ranked by real `sample_inquiries`
// volume, never a manually-curated flag (honest-data rule). Hides itself
// entirely until at least one real inquiry exists, rather than showing an
// empty carousel.
export function BestSellersSection() {
  const { products, isLoading, error } = useBestSellers(RAIL_LIMIT)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <ProductRail
        title="Best Sellers"
        emptyCopy="Best sellers are ranked by real customer sample requests — check back once a few more come in."
        viewAllTo="/best-sellers"
        products={products}
        isLoading={isLoading}
        error={error}
        hideWhenEmpty
      />
    </div>
  )
}
