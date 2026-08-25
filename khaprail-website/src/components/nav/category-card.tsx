import { Link } from "react-router-dom"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import { CategoryTile } from "@/components/categories/category-tile"
import type { Category } from "@/types/category"

interface CategoryCardProps {
  category: Category
  cardRef: (el: HTMLAnchorElement | null) => void
  onKeyDown: (event: React.KeyboardEvent) => void
  compact?: boolean
}

export function CategoryCard({ category, cardRef, onKeyDown, compact }: CategoryCardProps) {
  return (
    <NavigationMenuLink
      render={
        <Link
          ref={cardRef}
          to={`/categories/${category.slug}`}
          onKeyDown={onKeyDown}
          className="group/card flex flex-col items-center gap-2 rounded-lg p-2 text-center outline-none"
        />
      }
    >
      <CategoryTile category={category} compact={compact} />
    </NavigationMenuLink>
  )
}
