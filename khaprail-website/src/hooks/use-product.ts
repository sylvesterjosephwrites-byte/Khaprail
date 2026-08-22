import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { ProductDetail } from "@/types/product"

interface UseProductResult {
  product: ProductDetail | null
  isLoading: boolean
  /** Set when Supabase isn't provisioned yet, the query failed, or no row matched the slug. */
  error: string | null
}

const PRODUCT_DETAIL_COLUMNS = `
  id, name, slug, collection_id, description, size, thickness, finish,
  shade_variation, country_of_origin, cover_image_url, is_featured, created_at,
  product_images ( id, image_url, sort_order ),
  product_variants ( id, color_name, swatch_image_url, hero_image_url, sort_order ),
  product_attributes ( id, attribute_type, value )
`

/**
 * Reads a single `products` row by slug, embedding its images/variants/
 * attributes in one request via PostgREST's FK-based resource embedding
 * (05-PDP-SPEC.md).
 */
export function useProduct(slug: string | undefined): UseProductResult {
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(() => supabase !== null && !!slug)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase || !slug) return

    let cancelled = false
    setIsLoading(true)
    setError(null)

    supabase
      .from("products")
      .select(PRODUCT_DETAIL_COLUMNS)
      .eq("slug", slug)
      .order("sort_order", { referencedTable: "product_images", ascending: true })
      .order("sort_order", { referencedTable: "product_variants", ascending: true })
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) {
          setError(queryError.message)
        } else if (!data) {
          setError("Product not found")
        } else {
          setProduct(data as unknown as ProductDetail)
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { product, isLoading, error }
}
