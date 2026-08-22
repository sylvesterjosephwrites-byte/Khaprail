# 05 — Product Detail Page (PDP) Spec

Reference: daltile.com/products/mosaic/keystones/arctic-white-black

## Layout

1. **Gallery** — large hero image with roll-over/click zoom, thumbnail rail below for variant/angle photos
2. **Color/finish swatch grid** ("Additional Colors") if the product has variants — small swatch thumbnails, clicking swaps the hero image and updates the URL/slug
3. **Spec block:** Size, Thickness, Finish, Shade Variation, Country of Origin (Pakistan / Lahore)
4. **Application accordion:** where this tile is suitable — Roof / Floor / Wall / Outdoor / Wet Areas — presented as a simple table or icon-card row, not paragraph text
5. **Primary CTAs, above the fold:**
   - "Get a Sample" — opens WhatsApp deep-link with pre-filled message (same pattern as Artisan's `sample_inquiries` feature), also logs to Supabase
   - "Download Spec Sheet" — generates PDF via @react-pdf/renderer, branded in Khaprail's palette
6. **"You May Also Like"** related-products rail at the bottom — pull from same collection, exclude current product

## Data model (Supabase, sketch)

```
products (id, name, slug, collection_id, description, size, thickness, finish,
          shade_variation, country_of_origin, cover_image_url, created_at, is_featured)
product_images (id, product_id, image_url, sort_order)
product_variants (id, product_id, color_name, swatch_image_url, hero_image_url)
product_attributes (id, product_id, attribute_type, value)  -- for filters + application tags
sample_inquiries (id, product_id, name, phone, message, created_at, status)
```

## Notes

- Above-the-fold = essentials only (progressive disclosure, see 02-DESIGN-SYSTEM.md)
- No fabricated stock/urgency indicators unless wired to real `stock_qty` data
