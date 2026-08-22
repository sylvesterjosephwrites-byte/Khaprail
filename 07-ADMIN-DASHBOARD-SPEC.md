# 07 — Admin Dashboard Spec

Same pattern as the Artisan project's admin: its own header/sidebar chrome, separate from the storefront — not a shared layout.

## Sections

- **Products** — CRUD, variants (color swatches), images, spec-sheet fields, collection assignment
- **Collections** — CRUD, cover image, sort order, primary vs. secondary flag
- **Filter Types & Values** — Color / Material / Size / Shape / Roof options, admin-editable, no developer needed to add a new value
- **Blog Posts** — the tabbed editor from 06-BLOG-CMS-SPEC.md (Content / SEO / AEO-GEO / FAQs)
- **Sample Inquiries** — log of "Get a Sample" WhatsApp submissions, with status tracking (new/contacted/closed), same as Artisan's `sample_inquiries` panel
- **Dashboard home** — basic real stats: product count, collection count, inquiry count this week/month, recent activity feed

## Access

- Simple Supabase auth-gated admin route (`/admin/*`), single admin role is sufficient for v1 — no need for granular RBAC unless Sylvester asks for multiple admin users later

## Explicitly out of scope for v1 (flag if asked, don't build silently)

- Multi-admin roles/permissions
- Order/checkout flow (this is a catalog + lead-gen site, not e-commerce checkout, unless Sylvester says otherwise)
