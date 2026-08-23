# 02 — Design System

## Palette

Heritage clay-tile brand — warm, natural, craft-forward. Avoid cold tech-startup blues/purples.

- Primary: terracotta / clay orange (e.g. `#B5502B`–`#C96A3D` range)
- Secondary: warm sand / beige (`#E8DCC8` range)
- Accent: deep brown / espresso for text and grounding (`#3B2A20` range)
- Neutral background: warm off-white, not pure white (`#FAF6F0` range)
- Use color sparingly for CTAs and badges — the product photography should carry most of the visual weight

## Typography

- Single type family site-wide: **Baloo 2** (variable, weights 400–800), matching the real Khaprail logo wordmark — a bold, rounded, geometric sans-serif (thick uniform strokes, single-story "a," rounded dot on the "i," soft curved terminals). No separate heading/body pairing; hierarchy comes from weight (400/500 for body copy, 600/700 for headings, nav, and buttons), not a typeface switch. Replaces the earlier Fraunces (heading) + Geist (body) pairing chosen in batch 1 before the real logo font was confirmed.
- If a future page ever needs Baloo 2 to feel less "bubbly" at very small sizes, **Quicksand** is the confirmed fallback (same rounded-geometric family, more restrained) — swap the `@fontsource-variable/baloo-2` import and the `--font-display` value in `src/index.css` for `@fontsource-variable/quicksand` / `'Quicksand Variable'`, nothing else needs to change.
- Generous line-height on body copy — this audience includes older, non-tech-fluent visitors researching a home-construction decision, not a fast tech audience

## Spacing / layout

- Generous whitespace around product photography — don't crowd tile images, they need to read clearly at a glance
- 12-column grid, standard Tailwind spacing scale

## HCI & psychological principles to apply (not just decoration)

- **Hick's Law:** the real catalog has 25+ product types — never present them as one flat list. Group into visual collections (see 03-MEGA-MENU-SPEC.md).
- **Recognition over recall:** every filter, swatch, and menu item shows a photo, not just a name.
- **Fitts's Law:** primary CTAs ("Get a Sample," "Download Catalog," "WhatsApp Us") large and thumb-reachable — assume majority mobile traffic from Pakistan.
- **Von Restorff / isolation effect:** New Arrivals and Best Sellers get a visually distinct badge/card treatment, not just another grid row.
- **Progressive disclosure:** PDP shows essentials above the fold; specs/application info in an expandable accordion.
- **Provenance/trust signals:** "Since 1982" and craftsmanship story woven into the homepage hero and PDP, not buried only in About Us.
- **Honest data only:** no fabricated social proof. Real Supabase-backed counts, or nothing.

## Motion

- Framer Motion for micro-interactions (mega-menu card hover/lift, page transitions)
- Keep motion subtle and fast (150–250ms) — this should read as polished, not gimmicky
