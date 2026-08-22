// Mirrors the `collections` table sketched in 03-MEGA-MENU-SPEC.md.
export interface Collection {
  id: string
  name: string
  slug: string
  cover_image_url: string | null
  sort_order: number
  is_secondary: boolean
}
