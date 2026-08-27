import {
  Bath,
  Blocks,
  Building2,
  ChefHat,
  Flame,
  Grid2x2,
  Grid3x3,
  Home,
  LayoutGrid,
  Mountain,
  SquareStack,
  Sun,
  Warehouse,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react"

// Category-name -> Lucide icon mapping for the circular icon-badge treatment
// (SchoolBooksExperts "Shop by Department" reference). No icon manifest
// existed anywhere in this codebase before this pass (checked — the closest
// thing, application-tags.tsx, was deleted back in batch 11 along with the
// product_variants table it depended on), so this is a new mapping built
// against the real 12-CATEGORY-TAXONOMY.md category/subcategory names, most
// specific keyword first so e.g. "Kitchen Wall Tiles" matches Kitchen before
// the generic Wall fallback.
const CATEGORY_ICON_RULES: Array<[RegExp, LucideIcon]> = [
  [/kitchen/i, ChefHat],
  [/bath/i, Bath],
  [/pool/i, Waves],
  [/outdoor/i, Sun],
  [/jali/i, Wind],
  [/terracotta/i, Flame],
  [/clay/i, Flame],
  [/concrete/i, Blocks],
  [/brick/i, Blocks],
  [/mosaic/i, Grid3x3],
  [/industrial/i, Warehouse],
  [/stone/i, Mountain],
  [/khaprail/i, Building2],
  [/roof/i, Home],
  [/floor/i, SquareStack],
  [/wall/i, Grid2x2],
]

export function getCategoryIcon(categoryName: string): LucideIcon {
  for (const [pattern, icon] of CATEGORY_ICON_RULES) {
    if (pattern.test(categoryName)) return icon
  }
  return LayoutGrid
}
