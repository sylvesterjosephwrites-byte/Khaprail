import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"

interface UseFeaturedProductsResult {
  products: Product[]
  isLoading: boolean
  error: string | null
}

const PRODUCT_COLUMNS = "id, name, slug, category_id, size, cover_image_url, is_featured, is_new, price, created_at"

/**
 * "Top Picks Today" (category listing pages) — admin-toggled `is_featured`
 * flag. Real editorial curation, not a fabricated ranking, but no longer
 * used for the homepage's "Best Sellers" rail — see `use-best-sellers.ts`,
 * which ranks by real `sample_inquiries` volume instead. `categoryId` can
 * be a single id (exact match) or an array (e.g. `getDescendantCategoryIds`)
 * so a root category page's "Top Picks" stays consistent with its main
 * product grid, which also includes subcategory products.
 */
export function useFeaturedProducts(
  limit?: number,
  categoryId?: string | string[] | null
): UseFeaturedProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )
  const categoryKey = Array.isArray(categoryId) ? categoryId.slice().sort().join(",") : (categoryId ?? "")

  useEffect(() => {
    if (!supabase) return

    let cancelled = false
    let query = supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
    // Derived from `categoryKey` (already in the deps array below), not the
    // raw `categoryId` param, so this effect doesn't need to close over it
    // directly.
    const categoryIds = categoryKey ? categoryKey.split(",") : []
    if (categoryIds.length > 0) query = query.in("category_id", categoryIds)
    if (limit) query = query.limit(limit)

    query.then(({ data, error: queryError }) => {
      if (cancelled) return
      if (queryError) {
        setError(queryError.message)
      } else {
        setProducts(data ?? [])
      }
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [limit, categoryKey])

  return { products, isLoading, error }
}
