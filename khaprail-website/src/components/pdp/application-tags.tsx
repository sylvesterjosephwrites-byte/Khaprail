import { Home, Layers, Square, Trees, Droplet, Tag, type LucideIcon } from "lucide-react"
import type { ProductAttributeRow } from "@/types/product"

interface ApplicationTagsProps {
  attributes: ProductAttributeRow[]
}

const APPLICATION_ICONS: Record<string, LucideIcon> = {
  roof: Home,
  floor: Layers,
  wall: Square,
  outdoor: Trees,
  "wet areas": Droplet,
}

// "Where this tile is suitable" (05-PDP-SPEC.md) — an icon-card row, not
// paragraph text, per 02-DESIGN-SYSTEM.md's recognition-over-recall
// principle. Reads `product_attributes` rows with attribute_type
// "application"; renders nothing if none are set yet.
export function ApplicationTags({ attributes }: ApplicationTagsProps) {
  const applications = attributes.filter((attr) => attr.attribute_type === "application")

  if (applications.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">Suitable For</span>
      <div className="flex flex-wrap gap-3">
        {applications.map((attr) => {
          const Icon = APPLICATION_ICONS[attr.value.toLowerCase()] ?? Tag
          return (
            <div
              key={attr.id}
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm"
            >
              <Icon className="size-4 text-primary" />
              {attr.value}
            </div>
          )
        })}
      </div>
    </div>
  )
}
