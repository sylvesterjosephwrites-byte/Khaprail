# 08 — UI Libraries & Reference Repos

## Install first

```bash
npm create vite@latest khaprail-website -- --template react-ts
cd khaprail-website
npm install @supabase/supabase-js lucide-react @react-pdf/renderer react-router-dom framer-motion

# shadcn/ui — base primitives
npx shadcn@latest init
npx shadcn@latest add accordion dialog tabs dropdown-menu navigation-menu card badge button input select checkbox sheet
```

## Component sources to pull from as needed

- **21st.dev** — community registry of shadcn-compatible React/Tailwind blocks. Browse https://21st.dev, install a specific component with:
  `npx shadcn@latest add "https://21st.dev/r/<author>/<component>"`
  Good categories for this project: hero sections, image galleries with zoom, animated mega-menus, trust/testimonial sections.
- **Aceternity UI** — https://ui.aceternity.com — animated, visually rich, copy-paste (no install command). Good for the homepage hero and other "futuristic" moments.
- **Magic UI** — https://magicui.design — same copy-paste model as Aceternity, more animated micro-components.

> Note: "UI UX Pro" wasn't a library I could identify by that exact name — Aceternity UI + Magic UI are the closest fit (free, animation-forward, shadcn-compatible). Flag it if you meant a specific paid kit and I'll swap this section.

## Reference repos (clone locally to study patterns, don't ship as-is)

| Repo | Why it's useful |
|---|---|
| `shadcnspace/ecommerce-shadcn-nextjs-template` | Clean shop/PLP/PDP folder structure on shadcn |
| `basir/next-pg-shadcn-ecommerce` | Full admin dashboard pattern (products/orders/users) |
| `mohammadoftadeh/next-ecommerce-shopco` | Figma-to-code shop UI, good PLP/PDP visual polish reference |
| Shadcnblocks "Roofing & Home Services" template (shadcnblocks.com/templates) | Directly relevant — built specifically for roofing/home-services businesses, with before/after image sliders and MDX blog. Paid, but worth reviewing for layout ideas. |
| `birobirobiro/awesome-shadcn-ui` | Curated index of the whole shadcn ecosystem — use to find more blocks instead of guessing |

```bash
git clone https://github.com/shadcnspace/ecommerce-shadcn-nextjs-template.git ref-shopco
git clone https://github.com/basir/next-pg-shadcn-ecommerce.git ref-admin
```
