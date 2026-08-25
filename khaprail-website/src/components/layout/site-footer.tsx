import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { NAV_LINKS } from "@/lib/nav-links"
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp"
import { useCategories } from "@/hooks/use-categories"
import { getRootCategories } from "@/lib/category-tree"

const FOOTER_CATEGORY_LIMIT = 8

// Categories / Quick Links / WhatsApp CTA (10-HOMEPAGE-SPEC.md). No "Social"
// column — no real social profile URLs are confirmed anywhere for Khaprail
// Tiles, and inventing placeholder social icons/links would violate the
// honest-data rule (02-DESIGN-SYSTEM.md).
export function SiteFooter() {
  const { categories } = useCategories()
  const roots = getRootCategories(categories).slice(0, FOOTER_CATEGORY_LIMIT)

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg">Khaprail Tiles</p>
          <p className="mt-1 text-sm text-muted-foreground">Est. 1982 · Lahore, Pakistan</p>
          <Button
            className="mt-4 h-11"
            nativeButton={false}
            render={<a href={buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noreferrer" />}
          >
            Chat on WhatsApp
          </Button>
        </div>

        {roots.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">Categories</p>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              {roots.map((category) => (
                <Link key={category.id} to={`/categories/${category.slug}`} className="hover:text-foreground">
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Quick Links</p>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} Khaprail Tiles. Built by SylJo Tech.
      </div>
    </footer>
  )
}
