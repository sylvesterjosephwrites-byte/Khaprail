import { useRef } from "react"
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { CollectionCard } from "@/components/nav/collection-card"
import type { Collection } from "@/types/collection"

interface CollectionsMegaMenuProps {
  collections: Collection[]
  isLoading: boolean
  error: string | null
}

/**
 * "Our Collection" image-card dropdown (03-MEGA-MENU-SPEC.md). Arrow keys
 * roam the whole card set (primary + secondary) via a roving tabindex-style
 * focus move; Enter/click follow the card's link; Escape-to-close and
 * focus-return-to-trigger are handled by the NavigationMenu primitive itself.
 */
export function CollectionsMegaMenu({ collections, isLoading, error }: CollectionsMegaMenuProps) {
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const primary = collections.filter((c) => !c.is_secondary)
  const secondary = collections.filter((c) => c.is_secondary)
  const cardCount = primary.length + secondary.length

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    let nextIndex: number | null = null
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % cardCount
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + cardCount) % cardCount
    }
    if (nextIndex !== null) {
      event.preventDefault()
      cardRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Our Collection</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="w-[min(90vw,54rem)] p-6">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="aspect-[16/10] w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : error || primary.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Collections coming soon.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {primary.map((collection, index) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    cardRef={(el) => {
                      cardRefs.current[index] = el
                    }}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>
              {secondary.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 sm:grid-cols-4 lg:grid-cols-6">
                  {secondary.map((collection, i) => {
                    const index = primary.length + i
                    return (
                      <CollectionCard
                        key={collection.id}
                        collection={collection}
                        compact
                        cardRef={(el) => {
                          cardRefs.current[index] = el
                        }}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
