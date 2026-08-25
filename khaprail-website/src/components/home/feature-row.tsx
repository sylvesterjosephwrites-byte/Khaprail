import { Link } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategories } from "@/hooks/use-categories"
import { getRootCategories } from "@/lib/category-tree"

const FEATURE_COUNT = 3

// "3-image feature row" (10-HOMEPAGE-SPEC.md) — three large photo cards,
// each linking to a category. Uses the first 3 root categories by
// `sort_order`, so admins control which 3 appear here by reordering
// categories in /admin/categories.
export function FeatureRow() {
  const { categories, isLoading, error } = useCategories()
  const featured = getRootCategories(categories).slice(0, FEATURE_COUNT)

  if (error || (!isLoading && featured.length === 0)) return null

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {isLoading
          ? Array.from({ length: FEATURE_COUNT }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
            ))
          : featured.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group relative flex aspect-[4/3] w-full items-end overflow-hidden rounded-xl bg-muted shadow-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {category.cover_image_url && (
                  <img
                    src={category.cover_image_url}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
                <span className="relative z-10 p-5 font-heading text-xl font-semibold text-background">
                  Shop {category.name}
                </span>
              </Link>
            ))}
      </div>
    </section>
  )
}
