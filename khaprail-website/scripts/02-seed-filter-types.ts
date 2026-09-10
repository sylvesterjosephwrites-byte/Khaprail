/**
 * Khaprail Catalog Seed — Filter Types + Auto-Wire Product Attributes
 * =====================================================================
 * Idempotent TypeScript runner — safe to execute multiple times.
 *
 * Uses the Supabase service-role key (bypasses RLS) so it works
 * regardless of admin session state.
 *
 * Run:
 *   npx tsx scripts/02-seed-filter-types.ts
 *
 * Required env vars (in .env or .env.local):
 *   VITE_SUPABASE_URL           — Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY   — service-role key (NOT the anon key)
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { config } from "dotenv"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

// Load .env from the project root (khaprail-website/)
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, "../.env") })
config({ path: resolve(__dirname, "../.env.local") })

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing env vars. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env or .env.local"
  )
  process.exit(1)
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// ---------------------------------------------------------------------------
// Facet definitions (slug = stored value, matches URL filter params)
// ---------------------------------------------------------------------------

interface FacetValue {
  value: string
  display_order: number
}

interface Facet {
  filter_type: string
  values: FacetValue[]
}

const FACETS: Facet[] = [
  {
    filter_type: "type",
    values: [
      { value: "roof-tile", display_order: 1 },
      { value: "floor-tile", display_order: 2 },
      { value: "wall-tile", display_order: 3 },
      { value: "screen-jali-tile", display_order: 4 },
      { value: "decorative-tile", display_order: 5 },
    ],
  },
  {
    filter_type: "pattern",
    values: [
      { value: "flat", display_order: 1 },
      { value: "french", display_order: 2 },
      { value: "disco", display_order: 3 },
      { value: "murlee", display_order: 4 },
      { value: "spanish", display_order: 5 },
      { value: "italian", display_order: 6 },
    ],
  },
  {
    filter_type: "material",
    values: [
      { value: "terracotta-clay", display_order: 1 },
      { value: "khaprail-clay", display_order: 2 },
      { value: "multani-clay", display_order: 3 },
    ],
  },
  {
    filter_type: "finish",
    values: [
      { value: "natural-unglazed", display_order: 1 },
      { value: "glazed", display_order: 2 },
      { value: "smooth", display_order: 3 },
      { value: "textured-rustic", display_order: 4 },
    ],
  },
  {
    filter_type: "color",
    values: [
      { value: "natural-terracotta", display_order: 1 },
      { value: "rust-red", display_order: 2 },
      { value: "burnt-orange", display_order: 3 },
      { value: "brown", display_order: 4 },
      { value: "charcoal", display_order: 5 },
    ],
  },
  {
    filter_type: "suitability",
    values: [
      { value: "roof", display_order: 1 },
      { value: "floor", display_order: 2 },
      { value: "wall", display_order: 3 },
      { value: "screen-partition", display_order: 4 },
    ],
  },
  {
    filter_type: "application",
    values: [
      { value: "outdoor", display_order: 1 },
      { value: "courtyard", display_order: 2 },
      { value: "residential", display_order: 3 },
      { value: "commercial", display_order: 4 },
      { value: "kitchen", display_order: 5 },
      { value: "bathroom", display_order: 6 },
      { value: "pool", display_order: 7 },
      { value: "industrial", display_order: 8 },
    ],
  },
  // Size facet values are populated dynamically in step 1b.
  { filter_type: "size", values: [] },
]

// ---------------------------------------------------------------------------
// Mapping tables for auto-wiring
// ---------------------------------------------------------------------------

/** finish column keyword → filter value slug */
const FINISH_MAP: [RegExp, string][] = [
  [/natural|unglazed/i, "natural-unglazed"],
  [/glazed/i, "glazed"],
  [/smooth/i, "smooth"],
  [/textured|rustic/i, "textured-rustic"],
]

/** name/slug keyword → pattern slug */
const PATTERN_KEYWORDS: [RegExp, string][] = [
  [/disco/i, "disco"],
  [/murlee/i, "murlee"],
  [/french/i, "french"],
  [/spanish/i, "spanish"],
  [/italian/i, "italian"],
  [/flat/i, "flat"],
]

/** root category slug fragment → [type slug, suitability slug] */
const CATEGORY_TYPE_MAP: [RegExp, string, string][] = [
  [/roof/, "roof-tile", "roof"],
  [/floor/, "floor-tile", "floor"],
  [/wall/, "wall-tile", "wall"],
  [/jali/, "screen-jali-tile", "screen-partition"],
]

/** category name keyword → application slug */
const APPLICATION_KEYWORDS: [RegExp, string][] = [
  [/outdoor/i, "outdoor"],
  [/kitchen/i, "kitchen"],
  [/bathroom/i, "bathroom"],
  [/pool/i, "pool"],
  [/industrial/i, "industrial"],
  [/courtyard/i, "courtyard"],
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalize a size string: collapse whitespace, unify multiplication sign. */
function normalizeSize(raw: string): string {
  return raw.replace(/\s+/g, " ").replace(/\s*[xX×]\s*/g, "x").trim()
}

interface Product {
  id: string
  name: string
  slug: string
  category_id: string | null
  finish: string | null
  size: string | null
}

interface CategoryRow {
  id: string
  name: string
  slug: string
  parent_id: string | null
}

interface ExistingAttribute {
  product_id: string
  attribute_type: string
  value: string
}

// ---------------------------------------------------------------------------
// STEP 0 — Ensure uniqueness constraint
// ---------------------------------------------------------------------------

async function ensureConstraint(): Promise<void> {
  const { error } = await supabase.rpc("exec_sql", {
    sql: `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_filter_types_type_value') THEN
        ALTER TABLE filter_types ADD CONSTRAINT uq_filter_types_type_value UNIQUE (filter_type, value);
      END IF;
    END $$;`,
  })
  // If exec_sql RPC doesn't exist, skip — the SQL script handles this.
  if (error) {
    console.warn(
      "⚠ Could not run constraint DDL via RPC (expected if exec_sql function doesn't exist)."
    )
    console.warn("  Run the SQL script first, or add the constraint manually in Supabase dashboard.")
    console.warn(`  Error: ${error.message}`)
  }
}

// ---------------------------------------------------------------------------
// STEP 1a — Seed static facet values (upsert)
// ---------------------------------------------------------------------------

async function seedFacetValues(): Promise<number> {
  let total = 0

  for (const facet of FACETS) {
    if (facet.values.length === 0) continue // size handled dynamically

    const rows = facet.values.map((v) => ({
      filter_type: facet.filter_type,
      value: v.value,
      display_order: v.display_order,
    }))

    const { error, count } = await supabase
      .from("filter_types")
      .upsert(rows, { onConflict: "filter_type,value" })

    if (error) throw new Error(`Upsert ${facet.filter_type}: ${error.message}`)
    total += count ?? rows.length
    console.log(`  ✓ ${facet.filter_type}: ${rows.length} values`)
  }

  return total
}

// ---------------------------------------------------------------------------
// STEP 1b — Seed dynamic size facet from products.size
// ---------------------------------------------------------------------------

async function seedSizeFacet(): Promise<number> {
  const { data: products, error } = await supabase
    .from("products")
    .select("size")
    .not("size", "is", null)

  if (error) throw new Error(`Fetch products for sizes: ${error.message}`)

  const distinctSizes = new Set<string>()
  for (const p of products ?? []) {
    if (p.size && p.size.trim()) {
      const normalized = normalizeSize(p.size)
      if (normalized) distinctSizes.add(normalized)
    }
  }

  if (distinctSizes.size === 0) {
    console.log("  (no size values found in products)")
    return 0
  }

  const rows = [...distinctSizes]
    .sort()
    .map((size, i) => ({
      filter_type: "size",
      value: size,
      display_order: i + 1,
    }))

  const { error: upsertError } = await supabase
    .from("filter_types")
    .upsert(rows, { onConflict: "filter_type,value" })

  if (upsertError) throw new Error(`Upsert size facet: ${upsertError.message}`)
  console.log(`  ✓ size: ${rows.length} dynamic values`)
  return rows.length
}

// ---------------------------------------------------------------------------
// STEP 2 — Auto-wire product_attributes
// ---------------------------------------------------------------------------

async function autoWireProducts(): Promise<number> {
  // Fetch all products + categories + existing attributes
  const [{ data: products }, { data: categories }, { data: existingAttrs }] = await Promise.all([
    supabase.from("products").select("id, name, slug, category_id, finish, size"),
    supabase.from("categories").select("id, name, slug, parent_id"),
    supabase.from("product_attributes").select("product_id, attribute_type, value"),
  ])

  if (!products?.length) {
    console.log("  (no products found — skipping auto-wire)")
    return 0
  }

  const cats = (categories ?? []) as CategoryRow[]
  const catById = new Map(cats.map((c) => [c.id, c]))
  const existingSet = new Set(
    ((existingAttrs ?? []) as ExistingAttribute[]).map(
      (a) => `${a.product_id}::${a.attribute_type}`
    )
  )

  const toInsert: { product_id: string; attribute_type: string; value: string }[] = []

  function shouldAdd(productId: string, attrType: string): boolean {
    return !existingSet.has(`${productId}::${attrType}`)
  }

  /** Resolve the root category slug for a product's category_id. */
  function rootSlug(categoryId: string | null): string | null {
    if (!categoryId) return null
    const cat = catById.get(categoryId)
    if (!cat) return null
    if (cat.parent_id) {
      const parent = catById.get(cat.parent_id)
      return parent?.slug ?? cat.slug
    }
    return cat.slug
  }

  /** Resolve the root category name for a product's category_id. */
  function rootAndSelfNames(categoryId: string | null): string[] {
    if (!categoryId) return []
    const cat = catById.get(categoryId)
    if (!cat) return []
    const names = [cat.name]
    if (cat.parent_id) {
      const parent = catById.get(cat.parent_id)
      if (parent) names.push(parent.name)
    }
    return names
  }

  for (const p of products as Product[]) {
    // 2a. Finish
    if (p.finish && p.finish.trim() && shouldAdd(p.id, "finish")) {
      for (const [re, slug] of FINISH_MAP) {
        if (re.test(p.finish)) {
          toInsert.push({ product_id: p.id, attribute_type: "finish", value: slug })
          existingSet.add(`${p.id}::finish`)
          break
        }
      }
    }

    // 2b. Pattern from name/slug
    if (shouldAdd(p.id, "pattern")) {
      const haystack = `${p.name} ${p.slug}`
      for (const [re, slug] of PATTERN_KEYWORDS) {
        if (re.test(haystack)) {
          toInsert.push({ product_id: p.id, attribute_type: "pattern", value: slug })
          existingSet.add(`${p.id}::pattern`)
          break
        }
      }
    }

    // 2c. Type + Suitability from category tree
    const rSlug = rootSlug(p.category_id)
    if (rSlug) {
      for (const [re, typeSlug, suitSlug] of CATEGORY_TYPE_MAP) {
        if (re.test(rSlug)) {
          if (shouldAdd(p.id, "type")) {
            toInsert.push({ product_id: p.id, attribute_type: "type", value: typeSlug })
            existingSet.add(`${p.id}::type`)
          }
          if (shouldAdd(p.id, "suitability")) {
            toInsert.push({ product_id: p.id, attribute_type: "suitability", value: suitSlug })
            existingSet.add(`${p.id}::suitability`)
          }
          break
        }
      }
    }

    // 2d. Application from category names
    const catNames = rootAndSelfNames(p.category_id)
    if (catNames.length > 0 && shouldAdd(p.id, "application")) {
      const joined = catNames.join(" ")
      for (const [re, slug] of APPLICATION_KEYWORDS) {
        if (re.test(joined)) {
          toInsert.push({ product_id: p.id, attribute_type: "application", value: slug })
          existingSet.add(`${p.id}::application`)
          break
        }
      }
    }

    // 2e. Size from products.size
    if (p.size && p.size.trim() && shouldAdd(p.id, "size")) {
      toInsert.push({ product_id: p.id, attribute_type: "size", value: normalizeSize(p.size) })
      existingSet.add(`${p.id}::size`)
    }
  }

  if (toInsert.length === 0) {
    console.log("  (all product attributes already exist — nothing to insert)")
    return 0
  }

  // Batch insert in chunks of 500 (Supabase limit)
  const BATCH = 500
  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH)
    const { error } = await supabase.from("product_attributes").insert(batch)
    if (error) throw new Error(`Insert product_attributes batch ${i / BATCH + 1}: ${error.message}`)
  }

  return toInsert.length
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("\n╔══════════════════════════════════════════════════╗")
  console.log("║  Khaprail Seed — Filter Types + Product Wiring  ║")
  console.log("╚══════════════════════════════════════════════════╝\n")

  console.log("Step 0: Ensure uniqueness constraint...")
  await ensureConstraint()

  console.log("\nStep 1a: Seeding static facet values...")
  const staticCount = await seedFacetValues()
  console.log(`  → ${staticCount} total static values upserted`)

  console.log("\nStep 1b: Seeding dynamic size values...")
  const sizeCount = await seedSizeFacet()
  console.log(`  → ${sizeCount} size values upserted`)

  console.log("\nStep 2: Auto-wiring product_attributes...")
  const wiredCount = await autoWireProducts()
  console.log(`  → ${wiredCount} product attribute rows inserted`)

  console.log("\n✓ Seed complete. Run the verification queries to confirm.\n")
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err)
  process.exit(1)
})
