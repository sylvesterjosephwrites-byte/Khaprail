import { Link } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { CollectionsMegaMenu } from "@/components/nav/collections-mega-menu"
import { MobileNav } from "@/components/nav/mobile-nav"
import { NAV_LINKS } from "@/lib/nav-links"
import { useCollections } from "@/hooks/use-collections"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const { collections, isLoading, error } = useCollections()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0 font-heading text-xl font-semibold text-foreground">
          Khaprail Tiles
        </Link>

        <NavigationMenu className="hidden max-w-none flex-1 justify-center lg:flex">
          <NavigationMenuList>
            <CollectionsMegaMenu collections={collections} isLoading={isLoading} error={error} />
            {NAV_LINKS.filter((link) => link.label !== "Home").map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavigationMenuLink
                  render={<Link to={link.to} />}
                  className={cn(navigationMenuTriggerStyle(), "font-normal")}
                >
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <MobileNav collections={collections} isLoading={isLoading} error={error} />
      </div>
    </header>
  )
}
