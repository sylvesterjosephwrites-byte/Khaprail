import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { SpecSheetProduct } from "@/lib/pdf/spec-sheet-document"

export interface DownloadableProduct extends SpecSheetProduct {
  id: string
  collection_id: string | null
}

interface UseDownloadableProductsResult {
  products: DownloadableProduct[]
  isLoading: boolean
}

const COLUMNS =
  "id, name, slug, collection_id, size, thickness, finish, shade_variation, country_of_origin, description"

/** Products page for /downloads (01-SITE-MAP.md) — spec sheets + full catalog. */
export function useDownloadableProducts(): UseDownloadableProductsResult {
  const [products, setProducts] = useState<DownloadableProduct[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    supabase
      .from("products")
      .select(COLUMNS)
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error) setProducts(data ?? [])
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { products, isLoading }
}
