import type { CatalogCollection } from "@/lib/pdf/catalog-document"
import type { Collection } from "@/types/collection"

interface ProductForCatalog {
  collection_id: string | null
  name: string
  size: string | null
}

const OTHER_GROUP_NAME = "Other"

// Shared by /downloads and the homepage download CTA so the real
// products→collections grouping used to build the catalog PDF only lives
// in one place.
export function buildCatalogCollections(
  products: ProductForCatalog[],
  collections: Pick<Collection, "id" | "name">[]
): CatalogCollection[] {
  const collectionNameById = new Map(collections.map((c) => [c.id, c.name]))
  const groups = new Map<string, CatalogCollection>()
  for (const product of products) {
    const groupName = (product.collection_id && collectionNameById.get(product.collection_id)) || OTHER_GROUP_NAME
    if (!groups.has(groupName)) groups.set(groupName, { name: groupName, products: [] })
    groups.get(groupName)!.products.push({ name: product.name, size: product.size })
  }
  return Array.from(groups.values())
}
