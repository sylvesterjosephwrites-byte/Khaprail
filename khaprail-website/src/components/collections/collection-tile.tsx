import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Collection } from "@/types/collection"

interface CollectionTileProps {
  collection: Collection
  compact?: boolean
}

/**
 * Visual body of a collection card (image + label) with no link semantics of
 * its own — callers (mega-menu, homepage grid) supply the interactive
 * wrapper so this stays reusable in both a NavigationMenuLink and a plain
 * router Link.
 */
export function CollectionTile({ collection, compact }: CollectionTileProps) {
  return (
    <>
      <motion.span
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-md bg-muted shadow-sm group-focus-visible/card:ring-3 group-focus-visible/card:ring-ring/50 group-hover/card:shadow-md",
          compact && "aspect-square"
        )}
      >
        {collection.cover_image_url && (
          <img
            src={collection.cover_image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </motion.span>
      <span className={cn("font-medium text-foreground", compact ? "text-xs" : "text-sm")}>
        {collection.name}
      </span>
    </>
  )
}
