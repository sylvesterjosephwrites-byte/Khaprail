// Mirrors the self-referencing `categories` table (12-CATEGORY-TAXONOMY.md).
export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  cover_image_url: string | null
  sort_order: number
  /** Admin-toggled — shows this category as a tab in the homepage "Shop by Category" section (only when it also has real products). */
  is_featured: boolean
  /** Admin-toggled — shows this category in the homepage "Trending Categories" grid (only when it also has real products, directly or via a subcategory). Replaces the old positional-slice logic. */
  is_trending: boolean
  created_at: string
}
