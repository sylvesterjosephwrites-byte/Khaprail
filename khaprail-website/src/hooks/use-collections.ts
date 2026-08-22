import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Collection } from "@/types/collection"

interface UseCollectionsResult {
  collections: Collection[]
  isLoading: boolean
  /** Set when Supabase isn't provisioned yet, or the query itself failed. */
  error: string | null
}

/**
 * Reads the admin-editable `collections` table (see 03-MEGA-MENU-SPEC.md).
 * Never hardcode the collection list in a component — add rows in Supabase
 * instead, once the project exists.
 */
export function useCollections(): UseCollectionsResult {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    supabase
      .from("collections")
      .select("id, name, slug, cover_image_url, sort_order, is_secondary")
      .order("sort_order", { ascending: true })
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) {
          setError(queryError.message)
        } else {
          setCollections(data ?? [])
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { collections, isLoading, error }
}
