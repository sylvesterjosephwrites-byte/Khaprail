# 02 — Design System

## Palette (current — reverted 2026-08-28 back to the original terracotta palette)

Heritage clay-tile brand — warm, natural, craft-forward. Avoid cold tech-startup blues/purples.
- Primary: terracotta / clay orange (`#B5502B`)
- Secondary: warm sand / beige (`#E8DCC8`)
- Accent: clay orange, slightly lighter/warmer than primary (`#C96A3D`)
- Neutral background: warm off-white, not pure white (`#FAF6F0`); body/heading text espresso brown (`#3B2A20`)
- Use color sparingly for CTAs and badges — the product photography should carry most of the visual weight

~~**2026-08-25 dark restyle (superseded 2026-08-28):** dark charcoal (`#1f1f1f`–`#262626`), solid navy nav strip/footer, action blue (`#2F6FED`) CTAs, gold (`#F2A93B`) price text, a light powder-blue hero exception.~~ Reverted — see the "Storefront palette revert" note below for why and how.

### Storefront palette revert (2026-08-28)

Reverted `src/index.css`'s `:root` token block from the dark-charcoal values back to the original terracotta/sand/espresso values (recovered verbatim via `git show 24b47e7^:khaprail-website/src/index.css`, the commit right before the dark restyle). Everything built during the dark-restyle era (two-bar header, mega-menu, toned product-rail panels, circular icon badges, pagination, the type-scale bump) **stayed** — only the color tokens changed. Admin (`/admin/*`) is unaffected either way; its `--sidebar-*` tokens were never touched by either restyle.

The dark restyle had introduced 6 tokens with no equivalent in the original palette (`--navy`, `--navy-foreground`, `--panel-navy`, `--panel-warm`, `--price`, `--hero`, `--hero-foreground`), used across ~10 files (header nav strip, footer, floating WhatsApp button, "New"/"NEW" badges, alternating product-rail panel tones, price text, Hero/Heritage photo-wash banners). Rather than deleting them and editing every call site, they're kept as `var()` aliases onto the restored base palette, so they resolve to terracotta-appropriate colors automatically:

| Token | Resolves to | Used for |
|---|---|---|
| `--navy` / `--navy-foreground` | `var(--foreground)` espresso / `var(--background)` cream | header nav strip, footer, floating WhatsApp button, "New Arrival"/"NEW" badges |
| `--panel-navy` | `var(--secondary)` sand | one alternating product-rail panel tone, Feature Row's photo-card backdrop |
| `--panel-warm` | `var(--muted)` warm off-white | the other alternating panel tone (Top Picks Today, New Arrivals, Category Showcase) |
| `--price` | `var(--accent)` clay orange | product price text |
| `--hero` / `--hero-foreground` | `var(--foreground)` espresso / `var(--background)` cream | Hero/Heritage photo-wash overlay + text/pill/button color over it |

Repointing `--hero`→espresso and `--hero-foreground`→cream reproduces, in effect, the exact pre-dark-restyle Hero design already built and contrast-verified in this repo (`00-PROGRESS.md`'s 2026-08-24 "full-bleed placeholder photo hero" entry) — no component edit needed, Hero/Heritage just inherited the correct look from the token change.

Two hardcoded (non-token) values elsewhere didn't auto-correct and needed real edits: `site-header.tsx`'s wordmark (`text-[#1f1f1f]`, a literal leftover dark-theme hex → `text-primary`) and `category-showcase.tsx`'s photo-placeholder box + caption (`bg-black/20` → `bg-foreground/10`, `text-white` → `text-foreground` — the caption sits directly on the now-light `panel-warm` background, so white text would've been stranded/invisible). Grepped every `.tsx` for `text-white|bg-black|bg-white|text-black|#[hex]` to confirm nothing else needed a change — the remaining hits (`dialog.tsx`/`sheet.tsx` modal scrims, `video-grid.tsx`/`video-lightbox.tsx` play-button overlays) are theme-agnostic dark scrims over actual photo/video content, unrelated to page theme.

Contrast verified in-browser (zoom screenshots on Hero's cream-on-espresso text and the icon badges) — everything reads comfortably above AA. Icon badges (`text-primary`/`text-accent` solid icon on `bg-primary/15`/`bg-accent/15` tinted circle) are now visually more subtle than under the dark theme, since primary and accent are both warm orange-browns rather than the previous blue-vs-gold pairing — still clearly two-tone on close look, not a contrast problem, just a quieter rhythm effect; flag to Sylvester if a more differentiated two-tone badge alternation is wanted.

## Typography

**Current (2026-08-25 dark restyle):** Single type family site-wide: **Inter** (variable, self-hosted via `@fontsource-variable/inter`). No specific replacement typeface was named when the terracotta/Baloo 2 direction was superseded, so Inter was chosen as a clean, highly-legible default for the new dark e-commerce-style theme — swap `@fontsource-variable/inter` and the `--font-display` value in `src/index.css` if a different family is wanted. Same single-family/weight-hierarchy approach as before (no separate heading/body pairing).

### Type scale bump (2026-08-27)

Storefront text read too small/thin, so every prominent tier was bumped one Tailwind step up (font-weight unchanged — this stacks on top of the existing bold headings, it doesn't replace them). Admin (`/admin/*`) was deliberately left untouched, same "separate chrome" rule as every prior visual pass. Applied per-component (this codebase doesn't centralize heading sizes in one token — each page/section repeats its own `text-*` classes, same pattern the 2026-08-24 "heading size & weight pass" used), not via a Tailwind `--text-*` scale override, specifically so admin wouldn't inherit the bump too:

| Element | Was | Now |
|---|---|---|
| Page `<h1>` titles (Products, Categories, category name, blog post, etc.) | `text-5xl sm:text-6xl` | `text-6xl sm:text-7xl` |
| Section `<h2>` headings (rail titles, CTA banner, FAQ, "Explore Our Range") | `text-3xl sm:text-4xl` | `text-4xl sm:text-5xl` |
| Category-detail "Explore {category}" subcategory-row heading | `text-2xl` | `text-3xl` |
| PDP product name / price | `text-3xl` / `text-2xl` | `text-4xl` / `text-3xl` |
| Hero `<h1>` | `text-5xl sm:text-6xl lg:text-7xl`, `max-w-2xl` | `text-6xl sm:text-7xl lg:text-8xl`, `max-w-3xl` (widened so the bigger text doesn't over-wrap) |
| Heritage banner heading | `text-4xl sm:text-5xl` | `text-5xl sm:text-6xl` |
| Navbar logo wordmark | `text-2xl` | `text-3xl` |
| Navbar nav-strip links/mega-menu trigger | `text-[0.9rem]` | `text-base` (tightened trigger/link `px`  and `NavigationMenuList` gap to keep it from wrapping at the `lg:` floor — verified clean at 1024px/1280px/1536px) |
| Mega-menu category-card / circular-badge labels | `text-xs`–`text-sm` | `text-sm`–`text-lg` depending on context |
| Primary CTA buttons ("Get a Sample," "Download Catalog/Spec Sheet," checkout-style banners) | `h-12 px-6 text-base` | `h-14 px-7 text-lg` |
| Header/mobile-nav "Get a Sample" | `h-10/h-11 text-sm/text-base` | `h-11/h-12 text-base/text-lg` |
| Product-card title, PDP "Product Details" prose, blog excerpt | `text-sm` (inherited) | `text-base` |

Verified: `npm run build`/`npm run lint` clean, no new warning categories. In-browser at 1024px/1280px/1536px desktop widths the navbar strip fits with room to spare, no wrap. Real mobile-viewport screenshot not captured — same recurring browser-automation-tool limitation noted throughout `00-PROGRESS.md`'s session log (window resize doesn't change the actual viewport in this environment); the responsive classes were verified by code inspection instead.

~~Single type family site-wide: Baloo 2 (variable, weights 400–800), matching the real Khaprail logo wordmark...~~ — superseded; Baloo 2/Fredoka/Quicksand were all part of the earlier rounded-sans direction this restyle replaced.
- Generous line-height on body copy — this audience includes older, non-tech-fluent visitors researching a home-construction decision, not a fast tech audience

## Circular icon-badge component (2026-08-27, palette updated 2026-08-28)

`CategoryBadgeCircle` (`src/components/shared/category-badge-circle.tsx`) — an outlined Lucide icon centered in a soft-tinted circle, label rendered by the caller underneath (reference: a "Shop by Department"-style icon-badge row). Fill alternates between the two real accent colors at low opacity — `bg-primary/15` + `bg-accent/15` (both terracotta/clay-orange family under the current palette; was navy-blue/gold under the now-reverted dark restyle) — instead of the old per-index rainbow placeholder palette (`category-fill-palette.ts`, removed); falls back to the real `cover_image_url` photo once a category actually has one (none do yet). The icon itself comes from `src/lib/category-icons.tsx`'s `getCategoryIcon(name)` — a keyword-matched Lucide mapping built against the real `12-CATEGORY-TAXONOMY.md` category/subcategory names (Kitchen → ChefHat, Bathroom → Bath, Outdoor → Sun, Pool → Waves, Terracotta/Clay → Flame, Concrete/Brick → Blocks, Mosaic → Grid3x3, Jali → Wind, Industrial → Warehouse, Stone → Mountain, Khaprail → Building2, Roof → Home, Floor → SquareStack, Wall → Grid2x2, default → LayoutGrid). No icon-per-category manifest existed anywhere in this codebase before this pass — this is a new mapping, not a reuse of an existing one, since the closest prior thing (`application-tags.tsx`) was deleted in batch 11.

Used by: the homepage's Featured Categories row (all root categories, right after the hero) and Trending Categories grid (`size="lg"`), and the category-detail page's "Explore {category}" subcategory row (e.g. Wall Tiles → Kitchen/Bathroom/Outdoor/Terracotta/Concrete/Mosaic Wall Tiles) — this last one is the closest real analog on this site to a "shop by space/application" row, since Khaprail's taxonomy models kitchen/bathroom/outdoor as subcategories rather than a separate top-level axis.

**Scrollbar (2026-08-28):** the horizontal scroll containers on this row and on `ProductRail` used to show a persistent native scrollbar track below the content. Added a `scrollbar-hide` Tailwind v4 `@utility` (`src/index.css`) — `scrollbar-width: none` / `-ms-overflow-style: none` / `::-webkit-scrollbar { display: none }` — applied to both. Scroll functionality (arrow buttons, touch/trackpad swipe) is unaffected, only the visual scrollbar chrome is hidden. Not applied to `compare-table.tsx`'s data table, which keeps a visible scrollbar since that's a plain wide table, not a carousel.

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
