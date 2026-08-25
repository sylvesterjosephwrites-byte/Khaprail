import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"

interface UseBestSellersResult {
  products: Product[]
  isLoading: boolean
  error: string | null
}

const PRODUCT_COLUMNS = "id, name, slug, category_id, size, cover_image_url, is_featured, price, created_at"

/**
 * "Best Sellers" (homepage + /best-sellers) — ranked by real
 * `sample_inquiries` volume per product (10-HOMEPAGE-SPEC.md requires this
 * be backed by real inquiry/order data, never a manually-curated flag).
 * Reads the `product_inquiry_counts` view (aggregated counts only — no
 * name/phone/message) rather than the raw `sample_inquiries` table, since
 * that table is intentionally not public-readable (RLS: anon can only
 * insert, only `authenticated` admins can read individual inquiries).
 */
export function useBestSellers(limit?: number): UseBestSellersResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase) return
    const client = supabase
    let cancelled = false

    async function run() {
      const { data: counts, error: countError } = await client
        .from("product_inquiry_counts")
        .select("product_id, inquiry_count")

      if (cancelled) return
      if (countError) {
        setError(countError.message)
        setIsLoading(false)
        return
      }

      const allRankedIds = (counts ?? [])
        .slice()
        .sort((a, b) => b.inquiry_count - a.inquiry_count)
        .map((row) => row.product_id as string)
      const rankedIds = limit ? allRankedIds.slice(0, limit) : allRankedIds

      if (rankedIds.length === 0) {
        setProducts([])
        setIsLoading(false)
        return
      }

      const { data: productRows, error: productError } = await client
        .from("products")
        .select(PRODUCT_COLUMNS)
        .in("id", rankedIds)

      if (cancelled) return
      if (productError) {
        setError(productError.message)
        setIsLoading(false)
        return
      }

      const byId = new Map((productRows ?? []).map((p) => [p.id, p]))
      const ordered = rankedIds.map((id) => byId.get(id)).filter((p): p is Product => !!p)

      setProducts(ordered)
      setIsLoading(false)
    }

    run()

    return () => {
      cancelled = true
    }
  }, [limit])

  return { products, isLoading, error }
}
