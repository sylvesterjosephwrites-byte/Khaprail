import { createElement } from "react"
import { getCategoryIcon } from "@/lib/category-icons"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"

// Alternating soft-fill tones built from the site's two real accent colors
// (navy primary blue + gold) rather than the old per-index rainbow palette
// (category-fill-palette.ts, removed) — matches the reference's "outlined
// icon inside a soft-filled circle" pattern while staying on-brand.
const ICON_TONES = [
  { bg: "bg-primary/15", icon: "text-primary" },
  { bg: "bg-accent/15", icon: "text-accent" },
]

interface CategoryBadgeCircleProps {
  category: Category
  index?: number
  size?: "default" | "lg"
}

// Circular icon badge (SchoolBooksExperts "Shop by Department" reference) —
// an outlined Lucide icon centered in a soft-tinted circle, label rendered
// by the caller underneath. Falls back to the real cover photo once a
// category actually has one (none do yet, see 00-PROGRESS.md) — a real
// photo is always better than a placeholder icon.
export function CategoryBadgeCircle({ category, index = 0, size = "default" }: CategoryBadgeCircleProps) {
  const tone = ICON_TONES[index % ICON_TONES.length]

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm",
        size === "lg" ? "size-28" : "size-20",
        !category.cover_image_url && tone.bg
      )}
    >
      {category.cover_image_url ? (
        <img src={category.cover_image_url} alt="" className="h-full w-full object-cover" />
      ) : (
        // createElement (not JSX) so a runtime-resolved icon component
        // doesn't trip oxlint's static-components heuristic — it's a stable
        // lookup, never a component actually defined during render.
        createElement(getCategoryIcon(category.name), {
          className: cn(size === "lg" ? "size-11" : "size-8", tone.icon),
          strokeWidth: 1.75,
          "aria-hidden": "true",
        })
      )}
    </span>
  )
}
