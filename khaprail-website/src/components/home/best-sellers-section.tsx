import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProductRail } from "@/components/shared/product-rail"
import { useBestSellers } from "@/hooks/use-best-sellers"
import { useCategories } from "@/hooks/use-categories"
import { getRootCategories, getRootCategoryId } from "@/lib/category-tree"
import { cn } from "@/lib/utils"

const RAIL_LIMIT = 24
const ALL_TAB = "all" as const

// "Best Sellers" (10-HOMEPAGE-SPEC.md) — ranked by real `sample_inquiries`
// volume, never a manually-curated flag (honest-data rule). Hides itself
// entirely until at least one real inquiry exists, rather than showing an
// empty carousel. Category tabs (added on top of the original spec) only
// list categories that actually have a qualifying real best-seller — a tab
// is never shown empty, and the whole tab row is skipped if fewer than two
// categories qualify (a single tab plus "All" would just duplicate itself).
export function BestSellersSection() {
  const { products, isLoading, error } = useBestSellers(RAIL_LIMIT)
  const { categories } = useCategories()
  const [selected, setSelected] = useState<string>(ALL_TAB)

  const roots = getRootCategories(categories)
  // Products are usually assigned to a subcategory (e.g. Floor Tiles →
  // Terracotta Floor Tiles), so tabs group by each product's root-level
  // ancestor rather than requiring an exact category_id match against roots.
  const productRootId = (categoryId: string | null) =>
    categoryId ? getRootCategoryId(categories, categoryId) : null
  const tabCategories = roots.filter((c) => products.some((p) => productRootId(p.category_id) === c.id))
  const activeId = selected === ALL_TAB || tabCategories.some((c) => c.id === selected) ? selected : ALL_TAB
  const filteredProducts =
    activeId === ALL_TAB ? products : products.filter((p) => productRootId(p.category_id) === activeId)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <ProductRail
        title="Best Sellers"
        emptyCopy="Best sellers are ranked by real customer sample requests — check back once a few more come in."
        viewAllTo="/best-sellers"
        products={filteredProducts}
        isLoading={isLoading}
        error={error}
        hideWhenEmpty
        tone="navy"
        align="center"
        tabs={
          tabCategories.length > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={activeId === ALL_TAB ? "default" : "ghost"}
                className={cn("rounded-full", activeId !== ALL_TAB && "text-foreground/70 hover:text-foreground")}
                onClick={() => setSelected(ALL_TAB)}
              >
                All
              </Button>
              {tabCategories.map((category) => (
                <Button
                  key={category.id}
                  type="button"
                  size="sm"
                  variant={activeId === category.id ? "default" : "ghost"}
                  className={cn("rounded-full", activeId !== category.id && "text-foreground/70 hover:text-foreground")}
                  onClick={() => setSelected(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          ) : undefined
        }
      />
    </div>
  )
}
