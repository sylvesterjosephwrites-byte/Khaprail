# 03 — "Our Collection" Mega-Menu Spec

Reference: AceppePro's "Industries" dropdown (screenshot on file) — image tile + label per item, grid layout, not a text list.

## Structure

- Grid of photo cards, 6 per row on desktop, responsive down to 2 per row on tablet
- Each card: product photo (16:10 or 1:1 crop) + label underneath, e.g. "Khaprail Roof Tiles," "Multani Tiles," "Terracotta Floor Tiles," "Wall Tiles," "Outdoor Tiles"
- Secondary/low-priority items (Grass Pavers, Fire Bricks, Blue Pottery) can sit in a smaller row below the primary grid, or be dropped — confirm with Sylvester (see 00-PROGRESS.md open questions)

## Interaction

- Hover: subtle scale (1.02–1.05x) + shadow lift via Framer Motion — not a full color change
- Fully keyboard-navigable: arrow keys move between cards, Enter selects, Escape closes
- On mobile: collapses into an accordion or full-screen sheet, not a hover dropdown (no hover on touch)

## Data source

Collections and their cover images should come from a Supabase `collections` table (name, slug, cover_image_url, sort_order, is_secondary), admin-editable — same pattern as Artisan's admin-manageable filter system. Do not hardcode the collection list in the component.

## Why this pattern (for context, not to restate to the client)

Hick's Law: a 25+ item flat text list forces the visitor to read every line. A photo-card grid lets the eye pattern-match a roof-tile photo almost instantly — cuts decision time substantially versus a text dropdown.
