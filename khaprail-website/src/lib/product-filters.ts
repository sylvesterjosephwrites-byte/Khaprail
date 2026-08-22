// URL <-> filter-state helpers for /products (04-PRODUCT-LISTING-FILTERS.md).
// Reflects active filters into the URL as `?color=terracotta,red&shape=hexagon`
// (comma-separated = multi-select OR within a filter type) so filtered views
// stay shareable/bookmarkable/indexable.

export type ActiveFilters = Record<string, string[]>

export type SortOption = "newest" | "name-asc"

export function parseFiltersFromSearchParams(searchParams: URLSearchParams): ActiveFilters {
  const filters: ActiveFilters = {}
  for (const [key, rawValue] of searchParams.entries()) {
    if (key === "sort") continue
    const values = rawValue.split(",").filter(Boolean)
    if (values.length > 0) filters[key] = values
  }
  return filters
}

export function parseSortFromSearchParams(searchParams: URLSearchParams): SortOption {
  const sort = searchParams.get("sort")
  return sort === "name-asc" ? "name-asc" : "newest"
}

export function filtersToSearchParams(filters: ActiveFilters, sort: SortOption): URLSearchParams {
  const params = new URLSearchParams()
  for (const [filterType, values] of Object.entries(filters)) {
    if (values.length > 0) params.set(filterType, values.join(","))
  }
  if (sort !== "newest") params.set("sort", sort)
  return params
}

export function toggleFilterValue(filters: ActiveFilters, filterType: string, value: string): ActiveFilters {
  const current = filters[filterType] ?? []
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
  const updated = { ...filters }
  if (next.length > 0) {
    updated[filterType] = next
  } else {
    delete updated[filterType]
  }
  return updated
}
