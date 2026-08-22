import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"

interface UseRelatedProductsResult {
  products: Product[]
  isLoading: boolean
}

const PRODUCT_COLUMNS = "id, name, slug, collection_id, size, cover_image_url, is_featured, created_at"
const RELATED_LIMIT = 4

/**
 * "You May Also Like" rail (05-PDP-SPEC.md) — other products in the same
 * collection, excluding the current one.
 */
export function useRelatedProducts(collectionId: string | null, excludeProductId: string): UseRelatedProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null && !!collectionId)

  useEffect(() => {
    if (!supabase || !collectionId) {
      setProducts([])
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("collection_id", collectionId)
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
  }, [collectionId, excludeProductId])

  return { products, isLoading }
}
