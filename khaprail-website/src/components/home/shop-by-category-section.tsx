import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryTabList } from "@/components/shared/category-tab-list"
import { ProductRail } from "@/components/shared/product-rail"
import { useFeaturedCategoryTabs } from "@/hooks/use-featured-category-tabs"
import { useProductsByCategory } from "@/hooks/use-products-by-category"

const TAB_SKELETON_COUNT = 4

// "Shop by Category" — new homepage section, not part of
// 10-HOMEPAGE-SPEC.md's confirmed section order (see 00-PROGRESS.md for how
// this request was scoped). Tabs are admin-toggled `categories.is_featured`
// (category-editor.tsx), filtered to only categories that actually have real
// products (`useFeaturedCategoryTabs`) — a tab never opens onto a category
// with nothing in it. Switching tabs re-fetches that category's real
// products (`useProductsByCategory`, exact `category_id` match, same
// convention as `/categories/[slug]`) rather than filtering an
// already-loaded list, so it behaves like a real client-side navigation
// with its own loading state, not a cached client-side filter.
export function ShopByCategorySection() {
  const { categories: tabs, isLoading: tabsLoading, error: tabsError } = useFeaturedCategoryTabs()
  const [activeId, setActiveId] = useState<string | null>(null)

  // Default tab: first featured category by sort_order (tie-broken
  // alphabetically) — `useFeaturedCategoryTabs` already returns them in that
  // order, so the first item in the resolved list is always correct.
  useEffect(() => {
    if (!activeId && tabs.length > 0) setActiveId(tabs[0].id)
  }, [tabs, activeId])

  const activeCategory = tabs.find((c) => c.id === activeId) ?? null
  const {
    products,
    isLoading: productsLoading,
    error: productsError,
  } = useProductsByCategory(activeCategory?.id ?? null)

  if (tabsError || (!tabsLoading && tabs.length === 0)) return null

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h2 className="font-heading text-4xl font-semibold text-foreground sm:text-5xl">Shop by Category</h2>
        <p className="max-w-xl text-muted-foreground">Find the right tile for every space in your home.</p>
      </div>

      <ProductRail
        emptyCopy={activeCategory ? `More ${activeCategory.name} coming soon.` : ""}
        products={products}
        isLoading={tabsLoading || !activeCategory || productsLoading}
        error={productsError}
        hideArrows
        tabs={
          tabsLoading ? (
            <div className="flex w-full gap-2">
              {Array.from({ length: TAB_SKELETON_COUNT }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />
              ))}
            </div>
          ) : (
            <CategoryTabList categories={tabs} activeId={activeId} onSelect={setActiveId} />
          )
        }
      />
    </section>
  )
}
