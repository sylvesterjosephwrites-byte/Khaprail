import { Link } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CategoryTile } from "@/components/categories/category-tile"
import { useCategories } from "@/hooks/use-categories"
import { getRootCategories } from "@/lib/category-tree"

const FEATURE_ROW_COUNT = 3
const GRID_COUNT = 4
const NEW_WINDOW_DAYS = 30

function isNew(createdAt: string): boolean {
  const ageMs = Date.now() - new Date(createdAt).getTime()
  return ageMs < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000
}

// "Trending/Collections grid" (10-HOMEPAGE-SPEC.md) — 2x2-ish photo grid of
// categories, picking up after the 3-image feature row's picks so the
// homepage doesn't repeat the same categories twice. "NEW" badge is real
// (`created_at` within a short window), never decorative (02-DESIGN-SYSTEM.md
// Von Restorff isolation effect + "honest data only").
export function TrendingCategoriesGrid() {
  const { categories, isLoading, error } = useCategories()
  const trending = getRootCategories(categories).slice(FEATURE_ROW_COUNT, FEATURE_ROW_COUNT + GRID_COUNT)

  if (error || (!isLoading && trending.length === 0)) return null

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-3xl font-semibold sm:text-4xl">Trending Categories</h2>
        <p className="mt-2 text-muted-foreground">Roof, floor, and wall tiles grouped the way you'd ask for them.</p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {isLoading
          ? Array.from({ length: GRID_COUNT }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-[16/10] w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))
          : trending.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group/card relative flex flex-col items-center gap-2 rounded-lg p-2 text-center outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {isNew(category.created_at) && <Badge className="absolute top-2 left-2 z-10">NEW</Badge>}
                <CategoryTile category={category} />
              </Link>
            ))}
      </div>
      <div className="mt-8 text-center">
        <Link to="/categories" className="text-sm font-medium text-primary hover:underline">
          View All Categories
        </Link>
      </div>
    </section>
  )
}
