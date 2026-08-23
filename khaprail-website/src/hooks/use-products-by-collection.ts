import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"

interface UseProductsByCollectionResult {
  products: Product[]
  isLoading: boolean
}

const PRODUCT_COLUMNS = "id, name, slug, collection_id, size, cover_image_url, is_featured, created_at"

/** /collections/[slug] — every product in a collection (01-SITE-MAP.md). */
export function useProductsByCollection(collectionId: string | null): UseProductsByCollectionResult {
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
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error) setProducts(data ?? [])
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [collectionId])

  return { products, isLoading }
}
