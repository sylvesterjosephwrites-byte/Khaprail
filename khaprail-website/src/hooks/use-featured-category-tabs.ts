import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Category } from "@/types/category"

interface UseFeaturedCategoryTabsResult {
  categories: Category[]
  isLoading: boolean
  error: string | null
}

const CATEGORY_COLUMNS = "id, name, slug, parent_id, cover_image_url, sort_order, is_featured, is_trending, created_at"

/**
 * Homepage "Shop by Category" tabs — admin-toggled `categories.is_featured`,
 * filtered to only categories with at least one real product (exact
 * `category_id` match, same convention as `useProductsByCategory` — no
 * recursion into subcategories) so a tab never opens onto an empty
 * carousel. Ordered by `sort_order`, then name as a stable tie-break for
 * rows that share the same order value.
 */
export function useFeaturedCategoryTabs(): UseFeaturedCategoryTabsResult {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase) return
    const client = supabase
    let cancelled = false

    async function run() {
      const { data: featuredRows, error: categoryError } = await client
        .from("categories")
        .select(CATEGORY_COLUMNS)
        .eq("is_featured", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true })

      if (cancelled) return
      if (categoryError) {
        setError(categoryError.message)
        setIsLoading(false)
        return
      }

      const featured = featuredRows ?? []
      if (featured.length === 0) {
        setCategories([])
        setIsLoading(false)
        return
      }

      const { data: productRows, error: productError } = await client
        .from("products")
        .select("category_id")
        .in("category_id", featured.map((c) => c.id))

      if (cancelled) return
      if (productError) {
        setError(productError.message)
        setIsLoading(false)
        return
      }

      const idsWithProducts = new Set((productRows ?? []).map((row) => row.category_id))
      setCategories(featured.filter((c) => idsWithProducts.has(c.id)))
      setIsLoading(false)
    }

    run()

    return () => {
      cancelled = true
    }
  }, [])

  return { categories, isLoading, error }
}
