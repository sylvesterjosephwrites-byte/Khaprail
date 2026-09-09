// Mirrors the `lifestyle_tiles` table — admin-curated editorial photo tiles
// for the homepage "Tiles for Every Space" section (distinct from
// `categories`: caption/link/image are hand-entered per row, not derived
// from real product counts).
export interface LifestyleTile {
  id: string
  image_url: string
  image_alt_text: string
  caption: string
  link_url: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}
