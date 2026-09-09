import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { TRENDING_TILE_GRID_POSITIONS, type TrendingTile } from "@/types/trending-tile"

interface UseTrendingTilesResult {
  tiles: TrendingTile[]
  isLoading: boolean
  error: string | null
}

const COLUMNS =
  "id, grid_position, image_url, image_alt_text, show_new_badge, title, subtitle, link_url, is_active, created_at, updated_at"

/**
 * Homepage "Trending in Tiles" bento grid — active tiles only, one per
 * `grid_position` (no DB-level uniqueness constraint on that column, so if
 * two active tiles ever claim the same slot the most recently updated one
 * wins), returned in the fixed canonical slot order
 * (large/small_top_left/small_top_right/wide_bottom) regardless of fetch
 * order, since the grid layout depends on that order matching.
 */
export function useTrendingTiles(): UseTrendingTilesResult {
  const [tiles, setTiles] = useState<TrendingTile[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    supabase
      .from("trending_tiles")
      .select(COLUMNS)
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) {
          setError(queryError.message)
        } else {
          const byPosition = new Map<string, TrendingTile>()
          for (const row of data ?? []) {
            if (!byPosition.has(row.grid_position)) byPosition.set(row.grid_position, row)
          }
          const ordered = TRENDING_TILE_GRID_POSITIONS.map((position) => byPosition.get(position)).filter(
            (t): t is TrendingTile => !!t
          )
          setTiles(ordered)
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { tiles, isLoading, error }
}
