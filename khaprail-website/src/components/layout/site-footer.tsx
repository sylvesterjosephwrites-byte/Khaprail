import { Link } from "react-router-dom"
import { NAV_LINKS } from "@/lib/nav-links"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-heading text-lg">Khaprail Tiles</p>
          <p className="mt-1 text-sm text-muted-foreground">Est. 1982 · Lahore, Pakistan</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} Khaprail Tiles. Built by SylJo Tech.
      </div>
    </footer>
  )
}
