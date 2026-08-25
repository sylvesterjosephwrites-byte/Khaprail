import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export interface ComparableProduct {
  id: string
  name: string
  price: number | null
  brand: string | null
  merchant: string | null
  availability: string | null
}

interface UseComparableProductsResult {
  products: ComparableProduct[]
  isLoading: boolean
}

const COLUMNS = "id, name, price, brand, merchant, availability"
const LIMIT = 3

/**
 * "Compare With Similar Items" (05-PDP-SPEC.md) — same-category products
 * that actually have a `price` set. Only returns rows once there's enough
 * real data to make a meaningful table (the PDP itself decides the
 * render-or-hide threshold).
 */
export function useComparableProducts(categoryId: string | null, excludeProductId: string): UseComparableProductsResult {
  const [products, setProducts] = useState<ComparableProduct[]>([])
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
      .select(COLUMNS)
      .eq("category_id", categoryId)
      .neq("id", excludeProductId)
      .not("price", "is", null)
      .limit(LIMIT)
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
