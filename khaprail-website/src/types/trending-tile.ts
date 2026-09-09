// Mirrors the `trending_tiles` table — homepage "Trending in Tiles" bento
// grid, 4 fixed slots.
export type TrendingTileGridPosition = "large" | "small_top_left" | "small_top_right" | "wide_bottom"

export const TRENDING_TILE_GRID_POSITIONS: TrendingTileGridPosition[] = [
  "large",
  "small_top_left",
  "small_top_right",
  "wide_bottom",
]

export interface TrendingTile {
  id: string
  grid_position: TrendingTileGridPosition
  image_url: string
  image_alt_text: string
  show_new_badge: boolean
  title: string
  subtitle: string
  link_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}
