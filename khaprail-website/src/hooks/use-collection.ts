import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Collection } from "@/types/collection"

interface UseCollectionResult {
  collection: Collection | null
  isLoading: boolean
  /** Set when Supabase isn't provisioned yet, the query failed, or no row matched the slug. */
  error: string | null
}

/**
 * Reads a single row from the admin-editable `collections` table by slug
 * (see 03-MEGA-MENU-SPEC.md). Used by the collection landing page.
 */
export function useCollection(slug: string | undefined): UseCollectionResult {
  const [collection, setCollection] = useState<Collection | null>(null)
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
      .from("collections")
      .select("id, name, slug, cover_image_url, sort_order, is_secondary")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) {
          setError(queryError.message)
        } else if (!data) {
          setError("Collection not found")
        } else {
          setCollection(data)
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { collection, isLoading, error }
}
