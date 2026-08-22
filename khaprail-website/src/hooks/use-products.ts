import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"
import type { ActiveFilters, SortOption } from "@/lib/product-filters"

interface UseProductsResult {
  products: Product[]
  /** Live result counts per filter_type/value, scoped to the current result set (04-PRODUCT-LISTING-FILTERS.md). */
  facetCounts: Record<string, Record<string, number>>
  isLoading: boolean
  error: string | null
}

const PRODUCT_COLUMNS = "id, name, slug, collection_id, size, cover_image_url, is_featured, created_at"

/**
 * Reads the `products` table, applying AND-across-filter-types /
 * OR-within-a-filter-type semantics against `product_attributes`
 * (04-PRODUCT-LISTING-FILTERS.md). With no active filters, returns every
 * product sorted per `sort`.
 */
export function useProducts(filters: ActiveFilters, sort: SortOption): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [facetCounts, setFacetCounts] = useState<Record<string, Record<string, number>>>({})
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  const filtersKey = JSON.stringify(
    Object.entries(filters)
      .map(([type, values]) => [type, [...values].sort()] as const)
      .sort(([a], [b]) => a.localeCompare(b))
  )

  useEffect(() => {
    if (!supabase) return
    const client = supabase

    let cancelled = false
    setIsLoading(true)
    setError(null)

    async function run() {
      const activeFilters: ActiveFilters = JSON.parse(filtersKey).reduce(
        (acc: ActiveFilters, [type, values]: [string, string[]]) => {
          acc[type] = values
          return acc
        },
        {}
      )
      const activeEntries = Object.entries(activeFilters)

      let matchingIds: Set<string> | null = null
      for (const [attributeType, values] of activeEntries) {
        const { data, error: attrError } = await client
          .from("product_attributes")
          .select("product_id")
          .eq("attribute_type", attributeType)
          .in("value", values)
        if (attrError) throw attrError
        const idsForType = new Set((data ?? []).map((row) => row.product_id as string))
        if (matchingIds === null) {
          matchingIds = idsForType
        } else {
          const intersected = new Set<string>()
          for (const id of matchingIds) {
            if (idsForType.has(id)) intersected.add(id)
          }
          matchingIds = intersected
        }
        if (matchingIds.size === 0) break
      }

      let query = client.from("products").select(PRODUCT_COLUMNS)
      if (matchingIds !== null) {
        query = query.in("id", [...matchingIds])
      }
      query =
        sort === "name-asc"
          ? query.order("name", { ascending: true })
          : query.order("created_at", { ascending: false })

      const { data: productRows, error: productError } = await query
      if (productError) throw productError
      const finalProducts = (productRows ?? []) as Product[]

      const counts: Record<string, Record<string, number>> = {}
      if (finalProducts.length > 0) {
        const { data: attrRows, error: countError } = await client
          .from("product_attributes")
          .select("product_id, attribute_type, value")
          .in(
            "product_id",
            finalProducts.map((p) => p.id)
          )
        if (countError) throw countError
        for (const row of attrRows ?? []) {
          const byValue = (counts[row.attribute_type] ??= {})
          byValue[row.value] = (byValue[row.value] ?? 0) + 1
        }
      }

      return { finalProducts, counts }
    }

    run()
      .then(({ finalProducts, counts }) => {
        if (cancelled) return
        setProducts(finalProducts)
        setFacetCounts(counts)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load products")
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [filtersKey, sort])

  return { products, facetCounts, isLoading, error }
}
