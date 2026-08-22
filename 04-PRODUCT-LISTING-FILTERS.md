# 04 — Product Listing & Filters Spec

## Filters

- Color
- Material
- Size
- Shape
- Roof (category/application — this is Khaprail's core distinguishing facet)

## Pattern

- Pill-style filter chips with live result counts, same pattern as built for the Artisan project
- Filter values are NOT hardcoded — pull from a Supabase `filter_types` table (filter_type, value, display_order), admin-editable, mirroring Artisan's system
- Multi-select within a filter type, AND logic across filter types
- URL should reflect active filters (e.g. `/products?color=terracotta&shape=hexagon`) so filtered views are shareable/bookmarkable and indexable

## Listing card

- Product photo, name, starting size/price if applicable, quick "Get a Sample" action
- New Arrival / Best Seller badges only when backed by real data (see 02-DESIGN-SYSTEM.md — honest data only)

## Sort

- Newest, Name A–Z — keep it simple; do not add a fake "Popularity" sort unless backed by real inquiry-volume data
