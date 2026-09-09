import { useState } from "react"
import { Link } from "react-router-dom"
import { MenuIcon, XIcon, DownloadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp"
import { getRootCategories, getCategoryChildren } from "@/lib/category-tree"
import { useMobileDrawer } from "@/lib/mobile-drawer-context"
import type { Category } from "@/types/category"

interface MobileNavProps {
  categories: Category[]
  isLoading: boolean
  error: string | null
}

// Category drawer (mobile hamburger menu) — a flat, single-open accordion
// of root categories only (no nested "Categories" wrapper item, unlike the
// old version of this component), each category its own row per
// 12-CATEGORY-TAXONOMY.md, pulled live from the `categories` table like the
// desktop mega-menu — never hardcoded. A leaf root category (no
// subcategories — 13 of the 15 real root categories today) navigates
// straight to its listing on tap instead of expanding onto an empty panel.
export function MobileNav({ categories, isLoading, error }: MobileNavProps) {
  const { categoryDrawerOpen, setCategoryDrawerOpen } = useMobileDrawer()
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null)
  const roots = getRootCategories(categories)

  function handleAccordionValueChange(next: unknown[]) {
    if (next.length === 0) {
      setOpenCategoryId(null)
      return
    }
    const newlyOpened = next.find((v) => v !== openCategoryId)
    setOpenCategoryId((newlyOpened ?? next[0]) as string)
  }

  return (
    <Sheet open={categoryDrawerOpen} onOpenChange={setCategoryDrawerOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="size-11 lg:hidden" />}>
        <MenuIcon />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} className="w-full gap-0 p-0 sm:max-w-sm">
        <SheetTitle className="sr-only">Khaprail Tiles menu</SheetTitle>
        <div className="flex items-center gap-3 border-b border-border p-4">
          <SheetClose render={<Button variant="ghost" size="icon" className="size-9" />}>
            <XIcon />
            <span className="sr-only">Close menu</span>
          </SheetClose>
          <span className="font-heading text-xl font-bold text-primary">Khaprail Tiles</span>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-2">
          {isLoading ? (
            <div className="flex flex-col gap-2 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-full" />
              ))}
            </div>
          ) : error || roots.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">Categories coming soon.</p>
          ) : (
            <Accordion
              value={openCategoryId ? [openCategoryId] : []}
              onValueChange={handleAccordionValueChange}
            >
              {roots.map((category) => {
                const children = getCategoryChildren(categories, category.id)
                if (children.length === 0) {
                  return (
                    <div key={category.id} className="border-b border-border last:border-b-0">
                      <SheetClose
                        nativeButton={false}
                        render={
                          <Link
                            to={`/categories/${category.slug}`}
                            className="flex min-h-12 w-full items-center py-2.5 text-base font-medium"
                          />
                        }
                      >
                        {category.name}
                      </SheetClose>
                    </div>
                  )
                }
                return (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="min-h-12 text-base font-medium">
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col gap-1 pb-2 pl-3">
                        {children.map((child) => (
                          <li key={child.id}>
                            <SheetClose
                              nativeButton={false}
                              render={
                                <Link
                                  to={`/categories/${child.slug}`}
                                  className="flex min-h-10 items-center text-sm text-muted-foreground hover:text-foreground"
                                />
                              }
                            >
                              {child.name}
                            </SheetClose>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}

          <SheetClose
            nativeButton={false}
            render={
              <Link
                to="/downloads"
                className="mt-3 flex items-center gap-3 rounded-xl bg-secondary px-4 py-3 text-base font-semibold text-secondary-foreground"
              />
            }
          >
            <DownloadIcon className="size-5 shrink-0" />
            Download Catalogue
          </SheetClose>

          <SheetClose
            nativeButton={false}
            render={
              <Link
                to="/blog"
                className="flex min-h-12 items-center border-b border-border py-2.5 text-base font-medium"
              />
            }
          >
            Blog
          </SheetClose>

          <Button
            className="mt-4 h-12 w-full text-lg"
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
