import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { orderFilterTypes, filterTypeLabel, type ActiveFilters } from "@/lib/product-filters"
import type { FilterType } from "@/types/product"

interface FilterBarProps {
  filterGroups: Record<string, FilterType[]>
  facetCounts: Record<string, Record<string, number>>
  activeFilters: ActiveFilters
  isLoading: boolean
  onToggle: (filterType: string, value: string) => void
  onClearAll: () => void
}

export function FilterBar({
  filterGroups,
  facetCounts,
  activeFilters,
  isLoading,
  onToggle,
  onClearAll,
}: FilterBarProps) {
  const orderedTypes = orderFilterTypes(Object.keys(filterGroups))

  const hasActiveFilters = Object.values(activeFilters).some((values) => values.length > 0)

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
    )
  }

  if (orderedTypes.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      {orderedTypes.map((filterType) => (
        <div key={filterType} className="flex flex-wrap items-center gap-2">
          <span className="w-20 shrink-0 text-sm font-medium text-muted-foreground">
            {filterTypeLabel(filterType)}
          </span>
          {filterGroups[filterType].map((option) => {
            const isActive = activeFilters[filterType]?.includes(option.value) ?? false
            const count = facetCounts[filterType]?.[option.value] ?? 0
            return (
              <Button
                key={option.id}
                type="button"
                size="sm"
                variant={isActive ? "default" : "outline"}
                className={cn("rounded-full", !isActive && count === 0 && "opacity-50")}
                aria-pressed={isActive}
                onClick={() => onToggle(filterType, option.value)}
              >
                {option.value}
                {count > 0 && <span className="text-xs opacity-70">({count})</span>}
              </Button>
            )
          })}
        </div>
      ))}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="w-fit text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
