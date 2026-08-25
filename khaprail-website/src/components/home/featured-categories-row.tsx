import { CategoryIconRail } from "@/components/shared/category-icon-rail"
import { useCategories } from "@/hooks/use-categories"
import { getRootCategories } from "@/lib/category-tree"

// "Featured Categories" (10-HOMEPAGE-SPEC.md) — circular category-icon row,
// immediately after the hero. Admin-orderable via `categories.sort_order`.
export function FeaturedCategoriesRow() {
  const { categories, isLoading, error } = useCategories()
  const roots = getRootCategories(categories)

  if (error || (!isLoading && roots.length === 0)) return null

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <CategoryIconRail categories={roots} isLoading={isLoading} />
    </section>
  )
}
