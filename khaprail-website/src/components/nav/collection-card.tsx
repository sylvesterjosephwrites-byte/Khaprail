import { Link } from "react-router-dom"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import { CollectionTile } from "@/components/collections/collection-tile"
import type { Collection } from "@/types/collection"

interface CollectionCardProps {
  collection: Collection
  cardRef: (el: HTMLAnchorElement | null) => void
  onKeyDown: (event: React.KeyboardEvent) => void
  compact?: boolean
}

export function CollectionCard({ collection, cardRef, onKeyDown, compact }: CollectionCardProps) {
  return (
    <NavigationMenuLink
      render={
        <Link
          ref={cardRef}
          to={`/collections/${collection.slug}`}
          onKeyDown={onKeyDown}
          className="group/card flex flex-col items-center gap-2 rounded-lg p-2 text-center outline-none"
        />
      }
    >
      <CollectionTile collection={collection} compact={compact} />
    </NavigationMenuLink>
  )
}
