import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Category } from "@/types/category"

interface UseCategoriesResult {
  categories: Category[]
  isLoading: boolean
  /** Set when Supabase isn't provisioned yet, or the query itself failed. */
  error: string | null
}

/**
 * Reads the admin-editable, self-referencing `categories` table
 * (12-CATEGORY-TAXONOMY.md) as a flat, sort_order-ordered list. Use
 * `src/lib/category-tree.ts` to derive roots/children/ancestors from it.
 * Never hardcode the category list in a component.
 */
export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    supabase
      .from("categories")
      .select("id, name, slug, parent_id, cover_image_url, sort_order, created_at")
      .order("sort_order", { ascending: true })
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) {
          setError(queryError.message)
        } else {
          setCategories(data ?? [])
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { categories, isLoading, error }
}
