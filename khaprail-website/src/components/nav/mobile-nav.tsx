import { useState } from "react"
import { Link } from "react-router-dom"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { NAV_LINKS } from "@/lib/nav-links"
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp"
import { getRootCategories, getCategoryChildren } from "@/lib/category-tree"
import type { Category } from "@/types/category"

interface MobileNavProps {
  categories: Category[]
  isLoading: boolean
  error: string | null
}

export function MobileNav({ categories, isLoading, error }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const roots = getRootCategories(categories)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="size-11 lg:hidden" />}
      >
        <MenuIcon />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Khaprail Tiles</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 overflow-y-auto px-4 pb-4">
          <Accordion>
            <AccordionItem value="categories">
              <AccordionTrigger className="text-base font-heading font-semibold">Categories</AccordionTrigger>
              <AccordionContent>
                {isLoading ? (
                  <div className="flex flex-col gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : error || roots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Categories coming soon.</p>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {roots.map((category) => {
                      const children = getCategoryChildren(categories, category.id)
                      return (
                        <li key={category.id}>
                          <SheetClose
                            nativeButton={false}
                            render={
                              <Link
                                to={`/categories/${category.slug}`}
                                className="flex items-center gap-3 rounded-lg py-2 text-base hover:bg-muted"
                              />
                            }
                          >
                            <span className="h-8 w-8 shrink-0 overflow-hidden rounded bg-muted">
                              {category.cover_image_url && (
                                <img
                                  src={category.cover_image_url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </span>
                            {category.name}
                          </SheetClose>
                          {children.length > 0 && (
                            <ul className="ml-11 flex flex-col gap-1 border-l border-border pl-3">
                              {children.map((child) => (
                                <li key={child.id}>
                                  <SheetClose
                                    nativeButton={false}
                                    render={
                                      <Link
                                        to={`/categories/${child.slug}`}
                                        className="flex items-center rounded-lg py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                                      />
                                    }
                                  >
                                    {child.name}
                                  </SheetClose>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {NAV_LINKS.map((link) => (
            <SheetClose
              key={link.to}
              nativeButton={false}
              render={
                <Link
                  to={link.to}
                  className="flex min-h-11 items-center rounded-lg py-2.5 font-heading text-lg font-semibold hover:bg-muted"
                />
              }
            >
              {link.label}
            </SheetClose>
          ))}
          <Button
            className="mt-2 h-12 w-full text-lg"
            nativeButton={false}
            render={<a href={buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noreferrer" />}
          >
            Get a Sample
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
