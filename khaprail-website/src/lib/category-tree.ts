import type { Category } from "@/types/category"

/** Top-level categories, ordered for display. */
export function getRootCategories(categories: Category[]): Category[] {
  return categories.filter((c) => c.parent_id === null).sort((a, b) => a.sort_order - b.sort_order)
}

/** Direct children of a category, ordered for display. */
export function getCategoryChildren(categories: Category[], parentId: string): Category[] {
  return categories.filter((c) => c.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order)
}

/** Ancestor chain from root down to (but excluding) the category itself — for breadcrumbs. */
export function getCategoryAncestors(categories: Category[], categoryId: string): Category[] {
  const byId = new Map(categories.map((c) => [c.id, c]))
  const ancestors: Category[] = []
  let current = byId.get(categoryId)
  while (current?.parent_id) {
    const parent = byId.get(current.parent_id)
    if (!parent) break
    ancestors.unshift(parent)
    current = parent
  }
  return ancestors
}

/** The top-level category a given category rolls up to (itself, if it's already a root) — for grouping products assigned to subcategories under a root-level tab/filter. */
export function getRootCategoryId(categories: Category[], categoryId: string): string {
  const ancestors = getCategoryAncestors(categories, categoryId)
  return ancestors.length > 0 ? ancestors[0].id : categoryId
}

export interface CategoryTreeRow {
  category: Category
  depth: number
}

/** Depth-first tree order (root, then its children, recursively) — for the admin list's indented display. */
export function flattenCategoryTree(categories: Category[]): CategoryTreeRow[] {
  const rows: CategoryTreeRow[] = []
  function visit(parentId: string | null, depth: number) {
    for (const category of categories.filter((c) => c.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order)) {
      rows.push({ category, depth })
      visit(category.id, depth + 1)
    }
  }
  visit(null, 0)
  return rows
}
