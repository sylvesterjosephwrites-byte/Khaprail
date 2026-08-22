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
import type { Collection } from "@/types/collection"

interface MobileNavProps {
  collections: Collection[]
  isLoading: boolean
  error: string | null
}

export function MobileNav({ collections, isLoading, error }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="lg:hidden" />}
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
            <AccordionItem value="collections">
              <AccordionTrigger>Our Collection</AccordionTrigger>
              <AccordionContent>
                {isLoading ? (
                  <div className="flex flex-col gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : error || collections.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Collections coming soon.</p>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {collections.map((collection) => (
                      <li key={collection.id}>
                        <SheetClose
                          nativeButton={false}
                          render={
                            <Link
                              to={`/collections/${collection.slug}`}
                              className="flex items-center gap-3 rounded-lg py-2 text-sm hover:bg-muted"
                            />
                          }
                        >
                          <span className="h-8 w-8 shrink-0 overflow-hidden rounded bg-muted">
                            {collection.cover_image_url && (
                              <img
                                src={collection.cover_image_url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            )}
                          </span>
                          {collection.name}
                        </SheetClose>
                      </li>
                    ))}
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
                  className="rounded-lg py-2.5 text-sm font-medium hover:bg-muted"
                />
              }
            >
              {link.label}
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
