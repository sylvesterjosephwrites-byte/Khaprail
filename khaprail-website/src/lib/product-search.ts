import type { SupabaseClient } from "@supabase/supabase-js"

// Shared site-search logic (01-SITE-MAP.md's search requirement) — used by
// both the live navbar/drawer dropdown (`searchProducts`, full rows for
// display) and the /search results page's `useProducts` integration
// (`findProductIdsMatchingQuery`, id-set only, intersected with the
// existing filter system). One real query shape, not two that could drift.

const SEARCH_COLUMNS = "id, name, slug, price, cover_image_url, category_id"

export interface ProductSearchResult {
  id: string
  name: string
  slug: string
  price: number | null
  cover_image_url: string | null
  category_name: string | null
}

interface RawSearchRow {
  id: string
  name: string
  slug: string
  price: number | null
  cover_image_url: string | null
  category_id: string | null
}

/** Case-insensitive partial match on product name OR its category's name — both real columns, no invented facets. */
async function findMatchingRows(client: SupabaseClient, query: string): Promise<RawSearchRow[]> {
  const [{ data: nameMatches, error: nameError }, { data: categoryMatches, error: categoryError }] = await Promise.all([
    client.from("products").select(SEARCH_COLUMNS).ilike("name", `%${query}%`).order("created_at", { ascending: false }),
    client.from("categories").select("id").ilike("name", `%${query}%`),
  ])
  if (nameError) throw nameError
  if (categoryError) throw categoryError

  const byId = new Map<string, RawSearchRow>()
  for (const row of (nameMatches ?? []) as RawSearchRow[]) byId.set(row.id, row)

  const categoryIds = (categoryMatches ?? []).map((c) => c.id as string)
  if (categoryIds.length > 0) {
    const { data: byCategory, error: byCategoryError } = await client
      .from("products")
      .select(SEARCH_COLUMNS)
      .in("category_id", categoryIds)
      .order("created_at", { ascending: false })
    if (byCategoryError) throw byCategoryError
    for (const row of (byCategory ?? []) as RawSearchRow[]) byId.set(row.id, row)
  }

  return [...byId.values()]
}

/** Full result rows (with a real category name for display) for the live navbar/drawer dropdown — capped at `limit`. */
export async function searchProducts(client: SupabaseClient, query: string, limit: number): Promise<ProductSearchResult[]> {
  const trimmed = query.trim()
  if (!trimmed) return []
  const rows = findMatchingRows(client, trimmed)
  const matched = (await rows).slice(0, limit)

  const categoryIds = [...new Set(matched.map((p) => p.category_id).filter((id): id is string => !!id))]
  const categoryNames: Record<string, string> = {}
  if (categoryIds.length > 0) {
    const { data: cats } = await client.from("categories").select("id, name").in("id", categoryIds)
    for (const cat of cats ?? []) categoryNames[cat.id as string] = cat.name as string
  }

  return matched.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: row.price,
    cover_image_url: row.cover_image_url,
    category_name: row.category_id ? (categoryNames[row.category_id] ?? null) : null,
  }))
}

/** Just the matching product ids (unlimited) — for intersecting with the /search page's existing filter/attribute logic in `useProducts`. */
export async function findProductIdsMatchingQuery(client: SupabaseClient, query: string): Promise<Set<string>> {
  const trimmed = query.trim()
  if (!trimmed) return new Set()
  const rows = await findMatchingRows(client, trimmed)
  return new Set(rows.map((row) => row.id))
}
