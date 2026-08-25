import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"

interface UseFeaturedProductsResult {
  products: Product[]
  isLoading: boolean
  error: string | null
}

const PRODUCT_COLUMNS = "id, name, slug, category_id, size, cover_image_url, is_featured, price, created_at"

/**
 * "Top Picks Today" (category listing pages) — admin-toggled `is_featured`
 * flag. Real editorial curation, not a fabricated ranking, but no longer
 * used for the homepage's "Best Sellers" rail — see `use-best-sellers.ts`,
 * which ranks by real `sample_inquiries` volume instead.
 */
export function useFeaturedProducts(limit?: number, categoryId?: string | null): UseFeaturedProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase) return

    let cancelled = false
    let query = supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
    if (categoryId) query = query.eq("category_id", categoryId)
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
  }, [limit, categoryId])

  return { products, isLoading, error }
}
