import { useRef } from "react"
import { Link } from "react-router-dom"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Category } from "@/types/category"

interface CategoryIconRailProps {
  categories: Category[]
  isLoading?: boolean
}

// Circular category-icon row (10-HOMEPAGE-SPEC.md "Featured Categories",
// 11-CATEGORY-LISTING-SPEC.md subcategory row) — horizontally scrollable
// with arrow controls, image inside a circle + label underneath
// (02-DESIGN-SYSTEM.md "recognition over recall").
export function CategoryIconRail({ categories, isLoading }: CategoryIconRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scrollBy(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <div className="flex gap-6 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex w-24 shrink-0 flex-col items-center gap-2">
            <Skeleton className="size-20 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (categories.length === 0) return null

  return (
    <div className="relative flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="hidden size-8 shrink-0 sm:inline-flex"
        onClick={() => scrollBy(-320)}
      >
        <ChevronLeftIcon className="size-4" />
        <span className="sr-only">Scroll left</span>
      </Button>
      <div ref={scrollRef} className="flex flex-1 snap-x gap-6 overflow-x-auto py-1">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.slug}`}
            className="flex w-24 shrink-0 snap-start flex-col items-center gap-2 text-center outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-lg p-1"
          >
            <span className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-muted shadow-sm">
              {category.cover_image_url && (
                <img src={category.cover_image_url} alt="" className="h-full w-full object-cover" />
              )}
            </span>
            <span className="text-xs font-medium text-foreground">{category.name}</span>
          </Link>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="hidden size-8 shrink-0 sm:inline-flex"
        onClick={() => scrollBy(320)}
      >
        <ChevronRightIcon className="size-4" />
        <span className="sr-only">Scroll right</span>
      </Button>
    </div>
  )
}
