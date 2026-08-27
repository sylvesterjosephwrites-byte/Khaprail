# 10 — Homepage Spec

Layout skeleton borrowed from the Store.com reference PDF (Home.pdf), re-skinned for Khaprail content. Section order is confirmed final — do not reorder without checking with Sylvester.

## Section order

1. **Hero banner** — large lifestyle/product photo + headline + subhead + CTA button, with prev/next arrows if multiple hero slides
2. **Featured Categories** — row of circular category-icon badges (outlined Lucide icon in a soft navy/gold-tinted circle, real cover photo once one exists + label underneath), horizontally scrollable with arrow controls. Pulls from the `categories` table (main categories only, see 12-CATEGORY-TAXONOMY.md), admin-orderable. **Confirmed position: immediately after the hero, before anything else.** (2026-08-27: switched from a per-index rainbow color fill to the icon-badge treatment — see `02-DESIGN-SYSTEM.md`.)
3. **3-image feature row** — three large photo cards side by side, each linking to a collection/category (e.g. "Shop Roof Tiles," "Explore Wall Tiles," "Outdoor Range")
4. **Best Sellers carousel** — horizontal product carousel, tabbed by category if useful. Must be backed by real inquiry/order-volume data — see honest-data rule in 02-DESIGN-SYSTEM.md. Do not launch this section until that data exists; show New Arrivals only until then.
5. **Heritage banner** — full-width brand-story band ("Since 1982," craftsmanship story), replaces the reference's "Final Clearance" promo slot
6. **Trending/Collections grid** — 2×2 (or similar) grid of featured collections as circular icon badges (same treatment as Featured Categories, larger `size="lg"`) with "NEW" badges only where genuinely new
7. **New Arrivals carousel** — auto-populated from real `created_at`, not manually curated
8. **Footer** — Categories / Quick Links / Social columns, plus an "Ask Khaprail" chat-style widget (optional v1 scope — confirm before building; can be a simple WhatsApp deep-link button instead of a full chat widget if that's simpler for v1)

## Explicitly deferred / needs confirmation before building

- Percentage-off promo cards ("40% Off," "30% Off" style modules) and the countdown-timer promo section from the reference — **do not build these unless there's a real, time-bound offer to back them.** Fabricated discount tiles violate the honest-data rule. Flag to Sylvester if he wants a real seasonal promo mechanism instead.
- Seasonal occasion banner (reference: "Valentine's Picks") — repurpose only if there's a genuine seasonal angle (e.g. monsoon/roofing season, construction season); otherwise skip.

## Implementation note (2026-08-25)

Built as: Hero → Featured Categories (circular row) → 3-image feature row → Best Sellers (ranked by real `sample_inquiries` volume, hides itself when empty) → Heritage → Trending Categories grid → New Arrivals → Footer. The Videos section and the catalog Download CTA aren't part of this confirmed order but were kept (moved to the end, after New Arrivals) rather than deleted, since both are real, already-built, honest-data-backed features — see `00-PROGRESS.md`'s batch 11 entry. No fabricated discount/countdown/social-column content was added anywhere.
