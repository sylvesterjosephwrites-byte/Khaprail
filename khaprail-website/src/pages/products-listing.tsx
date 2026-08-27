import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { FilterBar } from "@/components/products/filter-bar"
import { ProductCard } from "@/components/products/product-card"
import { Pagination } from "@/components/shared/pagination"
import { useFilterTypes } from "@/hooks/use-filter-types"
import { useProducts } from "@/hooks/use-products"
import {
  filtersToSearchParams,
  parseFiltersFromSearchParams,
  parseSortFromSearchParams,
  toggleFilterValue,
  type SortOption,
} from "@/lib/product-filters"

const PAGE_SIZE = 12

// /products — filterable listing (04-PRODUCT-LISTING-FILTERS.md). Filters
// reflect into the URL so views are shareable/bookmarkable/indexable.
export function ProductsListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeFilters = parseFiltersFromSearchParams(searchParams)
  const sort = parseSortFromSearchParams(searchParams)
  const [page, setPage] = useState(1)

  const { filterGroups, isLoading: filtersLoading } = useFilterTypes()
  const { products, facetCounts, isLoading: productsLoading, error } = useProducts(activeFilters, sort)

  useEffect(() => {
    setPage(1)
  }, [searchParams])

  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  const pagedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleToggle(filterType: string, value: string) {
    const next = toggleFilterValue(activeFilters, filterType, value)
    setSearchParams(filtersToSearchParams(next, sort), { replace: true })
  }

  function handleClearAll() {
    setSearchParams(filtersToSearchParams({}, sort), { replace: true })
  }

  function handleSortChange(value: SortOption | null) {
    if (!value) return
    setSearchParams(filtersToSearchParams(activeFilters, value), { replace: true })
  }

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-6xl font-semibold sm:text-7xl">Products</h1>
          <p className="mt-2 text-muted-foreground">Browse our full catalog of clay and terracotta tiles.</p>
        </div>

        <div className="mb-8 flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
          <FilterBar
            filterGroups={filterGroups}
            facetCounts={facetCounts}
            activeFilters={activeFilters}
            isLoading={filtersLoading}
            onToggle={handleToggle}
            onClearAll={handleClearAll}
          />
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name-asc">Name A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : error || products.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Products coming soon.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {pagedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
          </>
        )}
      </div>
    </main>
  )
}
