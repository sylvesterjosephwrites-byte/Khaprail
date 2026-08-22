import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { FilterType } from "@/types/product"

interface UseFilterTypesResult {
  /** Filter values grouped by filter_type, each already ordered by display_order. */
  filterGroups: Record<string, FilterType[]>
  isLoading: boolean
  error: string | null
}

/**
 * Reads the admin-editable `filter_types` table (see
 * 04-PRODUCT-LISTING-FILTERS.md). Never hardcode Color/Material/Size/Shape/
 * Roof values in a component — add rows in Supabase instead.
 */
export function useFilterTypes(): UseFilterTypesResult {
  const [filterGroups, setFilterGroups] = useState<Record<string, FilterType[]>>({})
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    supabase
      .from("filter_types")
      .select("id, filter_type, value, display_order")
      .order("filter_type", { ascending: true })
      .order("display_order", { ascending: true })
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) {
          setError(queryError.message)
        } else {
          const groups: Record<string, FilterType[]> = {}
          for (const row of data ?? []) {
            ;(groups[row.filter_type] ??= []).push(row)
          }
          setFilterGroups(groups)
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { filterGroups, isLoading, error }
}
