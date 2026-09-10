import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"

interface UseRelatedProductsResult {
  products: Product[]
  isLoading: boolean
}

const PRODUCT_COLUMNS = "id, name, slug, category_id, size, cover_image_url, is_featured, is_new, price, created_at"
const RELATED_LIMIT = 4

/**
 * "Similar Products" rail (05-PDP-SPEC.md) — other products in the same
 * category, excluding the current one.
 */
export function useRelatedProducts(categoryId: string | null, excludeProductId: string): UseRelatedProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null && !!categoryId)

  useEffect(() => {
    if (!supabase || !categoryId) {
      setProducts([])
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("category_id", categoryId)
      .neq("id", excludeProductId)
      .order("created_at", { ascending: false })
      .limit(RELATED_LIMIT)
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error) setProducts(data ?? [])
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [categoryId, excludeProductId])

  return { products, isLoading }
}
