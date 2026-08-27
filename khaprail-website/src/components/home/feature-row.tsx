import { Link } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategories } from "@/hooks/use-categories"
import { getRootCategories } from "@/lib/category-tree"

const FEATURE_COUNT = 3

// "3-image feature row" (10-HOMEPAGE-SPEC.md) — rounded-corner photo cards
// with a plain white caption underneath (2026-08-25 restyle), each linking
// to a category. Uses the first 3 root categories by `sort_order`, so
// admins control which 3 appear here by reordering categories in
// /admin/categories.
export function FeatureRow() {
  const { categories, isLoading, error } = useCategories()
  const featured = getRootCategories(categories).slice(0, FEATURE_COUNT)

  if (error || (!isLoading && featured.length === 0)) return null

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {isLoading
          ? Array.from({ length: FEATURE_COUNT }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ))
          : featured.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group flex flex-col gap-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-panel-navy shadow-sm">
                  {category.cover_image_url && (
                    <img
                      src={category.cover_image_url}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <span className="font-heading text-2xl font-semibold text-foreground">
                  Shop {category.name}
                </span>
              </Link>
            ))}
      </div>
    </section>
  )
}
