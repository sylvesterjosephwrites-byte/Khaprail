import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"

interface CategoryTabListProps {
  categories: Category[]
  activeId: string | null
  onSelect: (id: string) => void
}

// Pill-styled wrapper around the shared Base UI `Tabs` primitive (already
// used by the admin blog editor's Content/SEO/AEO-GEO/FAQ tabs) — reuses its
// tested WAI-ARIA tablist behavior (role="tablist"/"tab", roving tabindex,
// arrow-key nav, Home/End) instead of a second hand-rolled implementation,
// just restyled from a segmented control into terracotta pill buttons.
// `activateOnFocus` makes arrow-key movement select immediately (matching a
// click) rather than requiring a separate Enter/Space press, per the
// "tab switching should feel instant" requirement.
export function CategoryTabList({ categories, activeId, onSelect }: CategoryTabListProps) {
  return (
    <Tabs value={activeId} onValueChange={(value) => onSelect(value as string)} className="w-full">
      <TabsList
        activateOnFocus
        aria-label="Product categories"
        className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-none bg-transparent p-0 scrollbar-fade"
      >
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className={cn(
              "h-auto flex-none rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground/70",
              "hover:text-foreground",
              "data-active:border-transparent data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none"
            )}
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
