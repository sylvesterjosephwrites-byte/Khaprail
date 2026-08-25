import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"

interface UseProductsByCategoryResult {
  products: Product[]
  isLoading: boolean
}

const PRODUCT_COLUMNS = "id, name, slug, category_id, size, cover_image_url, is_featured, price, created_at"

/** /categories/[slug] — every product in a category (exact match, not recursive into children). */
export function useProductsByCategory(categoryId: string | null): UseProductsByCategoryResult {
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
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error) setProducts(data ?? [])
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [categoryId])

  return { products, isLoading }
}
