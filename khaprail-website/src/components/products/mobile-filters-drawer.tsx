import { useState } from "react"
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { XIcon, CheckIcon } from "lucide-react"
import { orderFilterTypes, filterTypeLabel, type ActiveFilters } from "@/lib/product-filters"
import { cn } from "@/lib/utils"
import type { FilterType } from "@/types/product"

interface MobileFiltersDrawerProps {
  open: boolean
  onClose: () => void
  filterGroups: Record<string, FilterType[]>
  facetCounts: Record<string, Record<string, number>>
  activeFilters: ActiveFilters
  onToggle: (filterType: string, value: string) => void
  onClearAll: () => void
}

// Mobile-only filters UI for `/products` — a two-pane master-detail
// drill-down (facet types on the left, that facet's values on the right),
// deliberately distinct from the hamburger category drawer's accordion.
// Wired to the exact same `activeFilters`/`onToggle`/`onClearAll` the
// desktop `FilterBar` uses (same URL-reflected filter state,
// lib/product-filters.ts) — this is a new surface for the existing
// filtering system, not a second filtering mechanism.
export function MobileFiltersDrawer({
  open,
  onClose,
  filterGroups,
  facetCounts,
  activeFilters,
  onToggle,
  onClearAll,
}: MobileFiltersDrawerProps) {
  const orderedTypes = orderFilterTypes(Object.keys(filterGroups))
  const [activeType, setActiveType] = useState<string | null>(null)
  const selectedType = activeType && orderedTypes.includes(activeType) ? activeType : (orderedTypes[0] ?? null)

  const activeCount = Object.values(activeFilters).reduce((sum, values) => sum + values.length, 0)

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent side="right" showCloseButton={false} className="w-full gap-0 p-0 lg:hidden">
        <SheetTitle className="sr-only">Filters</SheetTitle>
        <div className="flex items-center justify-between border-b border-border p-4">
          <span className="font-heading text-lg font-bold tracking-wide">FILTERS</span>
          <SheetClose render={<Button variant="ghost" size="icon" />}>
            <XIcon />
            <span className="sr-only">Close filters</span>
          </SheetClose>
        </div>

        {orderedTypes.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">Filters coming soon.</p>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <div className="flex w-[35%] shrink-0 flex-col overflow-y-auto border-r border-border bg-muted">
              {orderedTypes.map((filterType) => {
                const count = activeFilters[filterType]?.length ?? 0
                const isSelected = filterType === selectedType
                return (
                  <button
                    key={filterType}
                    type="button"
                    onClick={() => setActiveType(filterType)}
                    className={cn(
                      "flex min-h-14 items-center justify-between gap-1 px-3 py-2 text-left text-sm",
                      isSelected ? "bg-background font-bold text-foreground" : "font-medium text-muted-foreground"
                    )}
                  >
                    {filterTypeLabel(filterType)}
                    {count > 0 && (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[0.65rem] text-primary-foreground">
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex w-[65%] flex-col overflow-y-auto p-3">
              {selectedType &&
                filterGroups[selectedType]?.map((option) => {
                  const isActive = activeFilters[selectedType]?.includes(option.value) ?? false
                  const count = facetCounts[selectedType]?.[option.value] ?? 0
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onToggle(selectedType, option.value)}
                      className="flex min-h-12 items-center justify-between gap-2 border-b border-border py-2 text-left text-sm last:border-b-0"
                    >
                      <span className={cn(count === 0 && !isActive && "text-muted-foreground/60")}>
                        {option.value}
                        {count > 0 && <span className="ml-1 text-xs text-muted-foreground">({count})</span>}
                      </span>
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full border",
                          isActive ? "border-primary bg-primary text-primary-foreground" : "border-border"
                        )}
                      >
                        {isActive && <CheckIcon className="size-3.5" />}
                      </span>
                    </button>
                  )
                })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-border p-4">
          <button
            type="button"
            onClick={onClearAll}
            disabled={activeCount === 0}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline disabled:opacity-40 disabled:hover:no-underline"
          >
            Clear all filters
          </button>
          <SheetClose render={<Button className="px-6" />}>
            Done {activeCount > 0 && `(${activeCount})`}
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
