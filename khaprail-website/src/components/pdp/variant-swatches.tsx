import { cn } from "@/lib/utils"
import type { ProductVariant } from "@/types/product"

interface VariantSwatchesProps {
  variants: ProductVariant[]
  activeVariantId: string | null
  onSelect: (variant: ProductVariant) => void
}

// "Additional Colors" swatch grid (05-PDP-SPEC.md) — clicking swaps the hero
// image and updates the URL via `?color=` (see product-detail.tsx).
export function VariantSwatches({ variants, activeVariantId, onSelect }: VariantSwatchesProps) {
  if (variants.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">Additional Colors</span>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant)}
            title={variant.color_name}
            className={cn(
              "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-1 ring-border outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              activeVariantId === variant.id && "ring-2 ring-primary"
            )}
          >
            {variant.swatch_image_url && (
              <img src={variant.swatch_image_url} alt={variant.color_name} className="h-full w-full object-cover" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
