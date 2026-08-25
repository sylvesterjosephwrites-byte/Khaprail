# 11 — Category / Listing Page Spec

Layout borrowed from the Store.com category-page reference (Cata.pdf).

## Section order

1. **Breadcrumb header** — page title (category name) + breadcrumb trail (Home > Category > [Subcategory if applicable])
2. **"Top Picks Today" carousel** — horizontal scroll of featured products within this category, real-data backed (see honest-data rule)
3. **"Explore [Category]" subcategory row** — circular icon cards for this category's subcategories (e.g. on the Wall Tiles page: Kitchen Wall Tiles, Bathroom Wall Tiles, Outdoor Wall Tiles…). If the category is flat (no subcategories — see 12-CATEGORY-TAXONOMY.md), skip this row entirely rather than showing an empty/placeholder row.
4. **Filter bar** — pill-style controls: Filter · Sort · Brand · Categories · Price (adapt "Brand" to whatever's relevant for Khaprail — likely Material or Collection instead)
5. **Product grid** — 4 columns desktop, responsive down to 2 on mobile, standard product cards (photo, price if applicable, name, quick action)
6. **Pagination** — numbered pagination with prev/next arrows, not infinite scroll, matching the reference

## Notes

- This page type serves both main-category pages and subcategory pages — same template, filtered by `category_id`/`parent_id`
- Reuse the filter system defined in 04-PRODUCT-LISTING-FILTERS.md (Color/Material/Size/Shape/Roof) alongside the category-specific "Categories" filter shown in the reference

## Implementation note (2026-08-25)

Built as `src/pages/category-detail.tsx`, shared by every category and subcategory. "Top Picks Today" reads the real `is_featured` flag scoped to the category. The subcategory row (`CategoryIconRail`) only renders when `getCategoryChildren()` returns rows — true only for Wall Tiles, Floor Tiles, and Kitchen Wall Tiles today. The filter bar's category-value labels already come from the admin-editable `filter_types` table (never hardcoded "Brand"), so no relabeling was needed. Pagination is a client-side 12-per-page slice of the already-fetched, already-filtered result set — proportionate at the catalog's current size; would need a server-side range query if the catalog grows much larger.
