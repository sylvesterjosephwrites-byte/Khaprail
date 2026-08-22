import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

// Both sections need real created_at / inquiry-volume data to populate
// (see 04-PRODUCT-LISTING-FILTERS.md, CLAUDE.md's "honest data only" rule) —
// no products table exists yet, so this stays an honest placeholder until
// batch 5/6 wire it to Supabase.
const HIGHLIGHTS = [
  { title: "New Arrivals", to: "/new-arrivals", badge: "New" },
  { title: "Best Sellers", to: "/best-sellers", badge: "Popular" },
] as const

export function CatalogHighlights() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {HIGHLIGHTS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex flex-col justify-end gap-2 rounded-xl border border-border bg-secondary/40 p-8 outline-none transition-colors hover:bg-secondary/70 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Badge className="w-fit">{item.badge}</Badge>
            <h3 className="font-heading text-2xl">{item.title}</h3>
            <p className="text-sm text-muted-foreground">Coming soon as our online catalog goes live.</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
