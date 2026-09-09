import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { LifestyleTile } from "@/types/lifestyle-tile"

interface UseLifestyleTilesResult {
  tiles: LifestyleTile[]
  isLoading: boolean
  error: string | null
}

const COLUMNS = "id, image_url, image_alt_text, caption, link_url, sort_order, is_active, created_at, updated_at"

/** Homepage "Tiles for Every Space" section — active tiles only, in admin-set `sort_order`. */
export function useLifestyleTiles(): UseLifestyleTilesResult {
  const [tiles, setTiles] = useState<LifestyleTile[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    supabase
      .from("lifestyle_tiles")
      .select(COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) {
          setError(queryError.message)
        } else {
          setTiles(data ?? [])
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { tiles, isLoading, error }
}
