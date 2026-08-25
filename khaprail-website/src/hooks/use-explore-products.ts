import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"

interface UseExploreProductsResult {
  products: Product[]
  isLoading: boolean
}

const PRODUCT_COLUMNS = "id, name, slug, category_id, size, cover_image_url, is_featured, price, created_at"
const EXPLORE_LIMIT = 8

/**
 * "Explore More Products" (05-PDP-SPEC.md) — a broader, cross-category
 * discovery rail, distinct from "Similar Products" (same category only,
 * see `use-related-products.ts`). Newest products first, excluding the
 * current one.
 */
export function useExploreProducts(excludeProductId: string): UseExploreProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)

  useEffect(() => {
    if (!supabase) return

    let cancelled = false
    setIsLoading(true)

    supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .neq("id", excludeProductId)
      .order("created_at", { ascending: false })
      .limit(EXPLORE_LIMIT)
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error) setProducts(data ?? [])
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [excludeProductId])

  return { products, isLoading }
}
