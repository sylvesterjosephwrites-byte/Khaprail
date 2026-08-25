import { useRef } from "react"
import { Link } from "react-router-dom"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/products/product-card"
import type { Product } from "@/types/product"

interface ProductRailProps {
  title: string
  emptyCopy: string
  viewAllTo?: string
  products: Product[]
  isLoading: boolean
  error?: string | null
  /** Return null (render nothing) instead of the empty-state copy when there's no real data yet. */
  hideWhenEmpty?: boolean
}

const SKELETON_COUNT = 4

// Shared horizontal-scroll product carousel — Best Sellers, New Arrivals,
// Top Picks Today, Similar Products, Explore More Products all use this so
// the "real data or an honest empty state, never fabricated" pattern only
// lives in one place (02-DESIGN-SYSTEM.md).
export function ProductRail({ title, emptyCopy, viewAllTo, products, isLoading, error, hideWhenEmpty }: ProductRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasProducts = !isLoading && !error && products.length > 0

  if (!isLoading && !hasProducts && hideWhenEmpty) return null

  function scrollBy(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" })
  }

  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-heading text-3xl font-semibold sm:text-4xl">{title}</h2>
        <div className="flex items-center gap-2">
          {hasProducts && viewAllTo && (
            <Link to={viewAllTo} className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          )}
          {hasProducts && (
            <div className="hidden gap-1 sm:flex">
              <Button type="button" variant="outline" size="icon" className="size-8" onClick={() => scrollBy(-320)}>
                <ChevronLeftIcon className="size-4" />
                <span className="sr-only">Scroll left</span>
              </Button>
              <Button type="button" variant="outline" size="icon" className="size-8" onClick={() => scrollBy(320)}>
                <ChevronRightIcon className="size-4" />
                <span className="sr-only">Scroll right</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="flex w-48 shrink-0 flex-col gap-2">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : hasProducts ? (
        <div ref={scrollRef} className="flex snap-x gap-6 overflow-x-auto pb-2">
          {products.map((product) => (
            <div key={product.id} className="w-48 shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <p className="py-4 text-sm text-muted-foreground">{emptyCopy}</p>
      )}
    </section>
  )
}
