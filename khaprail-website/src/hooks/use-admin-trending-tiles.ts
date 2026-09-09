import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { TrendingTile } from "@/types/trending-tile"

interface UseAdminTrendingTilesResult {
  tiles: TrendingTile[]
  isLoading: boolean
  error: string | null
}

const COLUMNS =
  "id, grid_position, image_url, image_alt_text, show_new_badge, title, subtitle, link_url, is_active, created_at, updated_at"

/** /admin/trending-tiles list — every tile (active and inactive), requires the authenticated admin session. */
export function useAdminTrendingTiles(): UseAdminTrendingTilesResult {
  const [tiles, setTiles] = useState<TrendingTile[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    supabase
      .from("trending_tiles")
      .select(COLUMNS)
      .order("grid_position", { ascending: true })
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
