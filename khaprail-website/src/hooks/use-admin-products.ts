import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"

interface UseAdminProductsResult {
  products: Product[]
  isLoading: boolean
  error: string | null
}

const COLUMNS = "id, name, slug, collection_id, size, cover_image_url, is_featured, created_at"

/** /admin/products list — requires the authenticated admin session (batch 9 RLS). */
export function useAdminProducts(): UseAdminProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    supabase
      .from("products")
      .select(COLUMNS)
      .order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) {
          setError(queryError.message)
        } else {
          setProducts((data ?? []) as unknown as Product[])
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { products, isLoading, error }
}
