import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Category } from "@/types/category"

interface UseCategoryResult {
  category: Category | null
  isLoading: boolean
  /** Set when Supabase isn't provisioned yet, the query failed, or no row matched the slug. */
  error: string | null
}

/**
 * Reads a single row from the `categories` table by slug. Used by the
 * category/subcategory listing page template.
 */
export function useCategory(slug: string | undefined): UseCategoryResult {
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(() => supabase !== null && !!slug)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase || !slug) return

    let cancelled = false
    setIsLoading(true)
    setError(null)

    supabase
      .from("categories")
      .select("id, name, slug, parent_id, cover_image_url, sort_order, created_at")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) {
          setError(queryError.message)
        } else if (!data) {
          setError("Category not found")
        } else {
          setCategory(data)
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { category, isLoading, error }
}
