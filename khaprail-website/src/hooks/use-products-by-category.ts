import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"

interface UseProductsByCategoryResult {
  products: Product[]
  isLoading: boolean
  error: string | null
}

const PRODUCT_COLUMNS = "id, name, slug, category_id, size, cover_image_url, is_featured, price, created_at"

/** Every product in a category (exact match, not recursive into children) — used by `/categories/[slug]` and the homepage "Shop by Category" tabs. */
export function useProductsByCategory(categoryId: string | null): UseProductsByCategoryResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null && !!categoryId)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase || !categoryId) {
      setProducts([])
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("category_id", categoryId)
      .order("name", { ascending: true })
      .then(({ data, error: queryError }) => {
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
  }, [categoryId])

  return { products, isLoading, error }
}
