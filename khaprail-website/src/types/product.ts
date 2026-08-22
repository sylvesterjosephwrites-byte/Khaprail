// Mirrors the `products` / `product_attributes` tables sketched in
// 05-PDP-SPEC.md (the parts batch 5's listing page needs — gallery/variant
// fields land with the PDP in batch 6).
export interface Product {
  id: string
  name: string
  slug: string
  collection_id: string | null
  size: string | null
  cover_image_url: string | null
  is_featured: boolean
  created_at: string
}

// Mirrors the `filter_types` table sketched in 04-PRODUCT-LISTING-FILTERS.md.
export interface FilterType {
  id: string
  filter_type: string
  value: string
  display_order: number
}

export interface ProductImage {
  id: string
  image_url: string
  sort_order: number
}

export interface ProductVariant {
  id: string
  color_name: string
  swatch_image_url: string | null
  hero_image_url: string | null
  sort_order: number
}

export interface ProductAttributeRow {
  id: string
  attribute_type: string
  value: string
}

// Full PDP data (05-PDP-SPEC.md) — gallery, variants, spec block, and
// application tags, plus everything the listing card already needs.
export interface ProductDetail {
  id: string
  name: string
  slug: string
  collection_id: string | null
  description: string | null
  size: string | null
  thickness: string | null
  finish: string | null
  shade_variation: string | null
  country_of_origin: string
  cover_image_url: string | null
  is_featured: boolean
  created_at: string
  product_images: ProductImage[]
  product_variants: ProductVariant[]
  product_attributes: ProductAttributeRow[]
}
