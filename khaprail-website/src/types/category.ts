// Mirrors the self-referencing `categories` table (12-CATEGORY-TAXONOMY.md).
export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  cover_image_url: string | null
  sort_order: number
  created_at: string
}
