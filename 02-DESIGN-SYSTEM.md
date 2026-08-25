# 02 — Design System

## Palette (superseded 2026-08-25 — see below)

~~Heritage clay-tile brand — warm, natural, craft-forward. Avoid cold tech-startup blues/purples.~~
~~- Primary: terracotta / clay orange (e.g. `#B5502B`–`#C96A3D` range)~~
~~- Secondary: warm sand / beige (`#E8DCC8` range)~~
~~- Accent: deep brown / espresso for text and grounding (`#3B2A20` range)~~
~~- Neutral background: warm off-white, not pure white (`#FAF6F0` range)~~

**Current (2026-08-25 dark restyle):** dark charcoal is now the dominant storefront background (`#1f1f1f`–`#262626` range), not a light/warm one. Solid navy (`#14213D`-ish) for the header sub-nav strip and footer. Action blue (`#2F6FED`) for primary CTA pills. Gold/orange (`#F2A93B`) for price text. The one exception is the hero banner, which stays a light powder-blue (`#B8DDEF`-ish) band with dark navy text — everything else (header top bar aside, which is plain white) is dark. See `src/index.css` for the exact token values (`--background`, `--navy`, `--panel-navy`, `--panel-warm`, `--price`, `--hero`, `--hero-foreground`). Admin (`/admin/*`) keeps its own separate dark-espresso chrome (`--sidebar-*` tokens), unaffected by this storefront restyle.
- Use color sparingly for CTAs and badges — the product photography should carry most of the visual weight

## Typography

**Current (2026-08-25 dark restyle):** Single type family site-wide: **Inter** (variable, self-hosted via `@fontsource-variable/inter`). No specific replacement typeface was named when the terracotta/Baloo 2 direction was superseded, so Inter was chosen as a clean, highly-legible default for the new dark e-commerce-style theme — swap `@fontsource-variable/inter` and the `--font-display` value in `src/index.css` if a different family is wanted. Same single-family/weight-hierarchy approach as before (no separate heading/body pairing).

~~Single type family site-wide: Baloo 2 (variable, weights 400–800), matching the real Khaprail logo wordmark...~~ — superseded; Baloo 2/Fredoka/Quicksand were all part of the earlier rounded-sans direction this restyle replaced.
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
