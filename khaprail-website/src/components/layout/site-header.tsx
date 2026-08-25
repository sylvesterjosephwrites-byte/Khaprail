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

// Nav link/trigger styling shared by the plain links and the mega-menu
// trigger — bolder display-font weight + a solid (not underline) hover/active
// state, per the "bolder, more confident navbar" pass.
const NAV_ITEM_CLASS =
  "font-heading text-[0.95rem] font-semibold text-foreground hover:bg-primary hover:text-primary-foreground data-active:bg-primary data-active:text-primary-foreground data-popup-open:bg-primary data-popup-open:text-primary-foreground data-open:bg-primary data-open:text-primary-foreground"

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
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background transition-shadow duration-200",
        isScrolled && "shadow-md"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-[height] duration-200 sm:px-6",
          isScrolled ? "h-14" : "h-20"
        )}
      >
        <Link to="/" className="shrink-0 font-heading text-2xl font-bold text-foreground">
          Khaprail Tiles
        </Link>

        <NavigationMenu className="hidden max-w-none flex-1 justify-center lg:flex">
          <NavigationMenuList className="gap-1">
            <CategoriesMegaMenu categories={categories} isLoading={isLoading} error={error} triggerClassName={NAV_ITEM_CLASS} />
            {NAV_LINKS.filter((link) => link.label !== "Home").map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavigationMenuLink render={<Link to={link.to} />} className={NAV_ITEM_CLASS}>
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button
            className="hidden h-10 px-5 text-sm lg:inline-flex"
            nativeButton={false}
            render={<a href={buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noreferrer" />}
          >
            Get a Sample
          </Button>
          <MobileNav categories={categories} isLoading={isLoading} error={error} />
        </div>
      </div>
    </header>
  )
}
