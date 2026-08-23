import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"

interface UseNewArrivalsResult {
  products: Product[]
  isLoading: boolean
  error: string | null
}

const PRODUCT_COLUMNS = "id, name, slug, collection_id, size, cover_image_url, is_featured, created_at"

/** "New Arrivals" (homepage + /new-arrivals) — real `created_at`, newest first. */
export function useNewArrivals(limit?: number): UseNewArrivalsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase) return

    let cancelled = false
    let query = supabase.from("products").select(PRODUCT_COLUMNS).order("created_at", { ascending: false })
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
  }, [limit])

  return { products, isLoading, error }
}
