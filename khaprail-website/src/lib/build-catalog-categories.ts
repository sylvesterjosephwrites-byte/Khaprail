import type { CatalogCollection } from "@/lib/pdf/catalog-document"
import type { Category } from "@/types/category"

interface ProductForCatalog {
  category_id: string | null
  name: string
  size: string | null
}

const OTHER_GROUP_NAME = "Other"

// Shared by /downloads and the homepage download CTA so the real
// products→categories grouping used to build the catalog PDF only lives
// in one place.
export function buildCatalogCategories(
  products: ProductForCatalog[],
  categories: Pick<Category, "id" | "name">[]
): CatalogCollection[] {
  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]))
  const groups = new Map<string, CatalogCollection>()
  for (const product of products) {
    const groupName = (product.category_id && categoryNameById.get(product.category_id)) || OTHER_GROUP_NAME
    if (!groups.has(groupName)) groups.set(groupName, { name: groupName, products: [] })
    groups.get(groupName)!.products.push({ name: product.name, size: product.size })
  }
  return Array.from(groups.values())
}
