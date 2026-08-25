import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { CategoriesMegaMenu } from "@/components/nav/categories-mega-menu"
import { MobileNav } from "@/components/nav/mobile-nav"
import { NAV_LINKS } from "@/lib/nav-links"
import { useCategories } from "@/hooks/use-categories"
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

// Nav-strip link styling — white text on the solid navy strip, filled pill
// on hover/active/open rather than an underline.
const NAV_ITEM_CLASS =
  "rounded-full text-[0.9rem] font-medium text-navy-foreground hover:bg-navy-foreground/15 data-active:bg-navy-foreground/15 data-popup-open:bg-navy-foreground/15 data-open:bg-navy-foreground/15"

// Two-bar header (2026-08-25 restyle): a white top bar (logo + real CTA —
// no Login/Wishlist/Cart/search affordances were added here since this site
// has no customer accounts, wishlist, or cart to back them, see
// 00-PROGRESS.md) and a solid navy sub-nav strip underneath.
export function SiteHeader() {
  const { categories, isLoading, error } = useCategories()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={cn("sticky top-0 z-40 transition-shadow duration-200", isScrolled && "shadow-lg")}>
      <div className="bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="shrink-0 font-heading text-2xl font-bold text-[#1f1f1f]">
            Khaprail Tiles
          </Link>
          <div className="flex items-center gap-2">
            <Button
              className="hidden h-10 rounded-full px-5 text-sm lg:inline-flex"
              nativeButton={false}
              render={<a href={buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noreferrer" />}
            >
              Get a Sample
            </Button>
            <MobileNav categories={categories} isLoading={isLoading} error={error} />
          </div>
        </div>
      </div>

      <div className="hidden bg-navy lg:block">
        <div className="mx-auto flex h-12 max-w-7xl items-center px-4 sm:px-6">
          <NavigationMenu className="max-w-none flex-1">
            <NavigationMenuList className="gap-1">
              <CategoriesMegaMenu
                categories={categories}
                isLoading={isLoading}
                error={error}
                triggerClassName={NAV_ITEM_CLASS}
              />
              {NAV_LINKS.filter((link) => link.label !== "Home").map((link) => (
                <NavigationMenuItem key={link.to}>
                  <NavigationMenuLink render={<Link to={link.to} />} className={NAV_ITEM_CLASS}>
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
}
