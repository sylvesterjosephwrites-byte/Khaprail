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
 * `sample_inquiries` is a small lead-gen table, so counting client-side
 * over the whole table is proportionate — no RPC/view needed at this scale.
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
      const { data: inquiries, error: inquiryError } = await client
        .from("sample_inquiries")
        .select("product_id")
        .not("product_id", "is", null)

      if (cancelled) return
      if (inquiryError) {
        setError(inquiryError.message)
        setIsLoading(false)
        return
      }

      const counts = new Map<string, number>()
      for (const row of inquiries ?? []) {
        if (!row.product_id) continue
        counts.set(row.product_id, (counts.get(row.product_id) ?? 0) + 1)
      }

      const allRankedIds = Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id)
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
