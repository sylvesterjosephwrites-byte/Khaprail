import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface UseCategoryProductCountsResult {
  /** Real product count per root-level category id (subcategory products roll up to their root ancestor). */
  counts: Map<string, number>
  isLoading: boolean
}

/**
 * Real product counts grouped by category — used to pick "which categories
 * actually have content" for data-driven homepage sections (e.g. Category
 * Showcase) instead of an arbitrary/manual pick. Callers roll subcategory
 * counts up to their root via `getRootCategoryId` before ranking.
 */
export function useCategoryProductCounts(): UseCategoryProductCountsResult {
  const [counts, setCounts] = useState<Map<string, number>>(new Map())
  const [isLoading, setIsLoading] = useState(() => supabase !== null)

  useEffect(() => {
    if (!supabase) return
    let cancelled = false

    supabase
      .from("products")
      .select("category_id")
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error) {
          const next = new Map<string, number>()
          for (const row of data ?? []) {
            if (!row.category_id) continue
            next.set(row.category_id, (next.get(row.category_id) ?? 0) + 1)
          }
          setCounts(next)
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { counts, isLoading }
}
