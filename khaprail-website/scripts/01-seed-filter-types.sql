-- ============================================================================
-- Khaprail Catalog Seed — Filter Types + Auto-Wire Product Attributes
-- ============================================================================
-- Idempotent: safe to run multiple times without duplication.
--
-- Target tables (existing, no schema changes):
--   filter_types       (id uuid PK, filter_type text, value text, display_order int)
--   product_attributes (id uuid PK, product_id uuid FK, attribute_type text, value text)
--
-- Run via: Supabase SQL Editor  OR  psql "$SUPABASE_DB_URL" -f 01-seed-filter-types.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 0 — Ensure idempotency constraint on filter_types
-- ============================================================================
-- The admin UI writes arbitrary (filter_type, value) pairs, so this unique
-- constraint also guards against accidental duplicates from future manual
-- inserts through the dashboard.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_filter_types_type_value'
  ) THEN
    ALTER TABLE filter_types
      ADD CONSTRAINT uq_filter_types_type_value UNIQUE (filter_type, value);
  END IF;
END $$;

-- ============================================================================
-- STEP 1 — Seed 8 filter facets (upsert via ON CONFLICT)
-- ============================================================================

-- Facet 1: type (Type) -------------------------------------------------------
INSERT INTO filter_types (filter_type, value, display_order) VALUES
  ('type', 'roof-tile',          1),
  ('type', 'floor-tile',         2),
  ('type', 'wall-tile',          3),
  ('type', 'screen-jali-tile',   4),
  ('type', 'decorative-tile',    5)
ON CONFLICT (filter_type, value) DO UPDATE SET display_order = EXCLUDED.display_order;

-- Facet 2: pattern (Pattern) -------------------------------------------------
INSERT INTO filter_types (filter_type, value, display_order) VALUES
  ('pattern', 'flat',     1),
  ('pattern', 'french',   2),
  ('pattern', 'disco',    3),
  ('pattern', 'murlee',   4),
  ('pattern', 'spanish',  5),
  ('pattern', 'italian',  6)
ON CONFLICT (filter_type, value) DO UPDATE SET display_order = EXCLUDED.display_order;

-- Facet 3: material (Material) -----------------------------------------------
INSERT INTO filter_types (filter_type, value, display_order) VALUES
  ('material', 'terracotta-clay', 1),
  ('material', 'khaprail-clay',   2),
  ('material', 'multani-clay',    3)
ON CONFLICT (filter_type, value) DO UPDATE SET display_order = EXCLUDED.display_order;

-- Facet 4: finish (Finish) ---------------------------------------------------
INSERT INTO filter_types (filter_type, value, display_order) VALUES
  ('finish', 'natural-unglazed',  1),
  ('finish', 'glazed',            2),
  ('finish', 'smooth',            3),
  ('finish', 'textured-rustic',   4)
ON CONFLICT (filter_type, value) DO UPDATE SET display_order = EXCLUDED.display_order;

-- Facet 5: color (Color) -----------------------------------------------------
INSERT INTO filter_types (filter_type, value, display_order) VALUES
  ('color', 'natural-terracotta', 1),
  ('color', 'rust-red',           2),
  ('color', 'burnt-orange',       3),
  ('color', 'brown',              4),
  ('color', 'charcoal',           5)
ON CONFLICT (filter_type, value) DO UPDATE SET display_order = EXCLUDED.display_order;

-- Facet 6: suitability (Suitability) -----------------------------------------
INSERT INTO filter_types (filter_type, value, display_order) VALUES
  ('suitability', 'roof',              1),
  ('suitability', 'floor',             2),
  ('suitability', 'wall',              3),
  ('suitability', 'screen-partition',  4)
ON CONFLICT (filter_type, value) DO UPDATE SET display_order = EXCLUDED.display_order;

-- Facet 7: application (Application) -----------------------------------------
INSERT INTO filter_types (filter_type, value, display_order) VALUES
  ('application', 'outdoor',      1),
  ('application', 'courtyard',    2),
  ('application', 'residential',  3),
  ('application', 'commercial',   4),
  ('application', 'kitchen',      5),
  ('application', 'bathroom',     6),
  ('application', 'pool',         7),
  ('application', 'industrial',   8)
ON CONFLICT (filter_type, value) DO UPDATE SET display_order = EXCLUDED.display_order;

-- Facet 8: size (Size) — dynamic extraction from products.size ---------------
INSERT INTO filter_types (filter_type, value, display_order)
SELECT
  'size',
  normalized,
  ROW_NUMBER() OVER (ORDER BY normalized)::int
FROM (
  SELECT DISTINCT
    TRIM(
      REGEXP_REPLACE(
        REGEXP_REPLACE(size, '\s+', ' ', 'g'),   -- collapse whitespace
        '\s*[xX×]\s*', 'x', 'g'                   -- normalize X / x / ×
      )
    ) AS normalized
  FROM products
  WHERE size IS NOT NULL
    AND TRIM(size) <> ''
) AS distinct_sizes
WHERE normalized <> ''
ON CONFLICT (filter_type, value) DO UPDATE SET display_order = EXCLUDED.display_order;

-- ============================================================================
-- STEP 2 — Auto-wire product_attributes from existing product data
-- ============================================================================
-- Only inserts attributes that don't already exist for each product, so
-- re-running this script never creates duplicates.
--
-- The `value` stored in product_attributes matches the `value` (slug) in
-- filter_types so the filter UI can cross-reference them exactly.

-- 2a. Finish: product.finish → attribute_type 'finish' -----------------------
INSERT INTO product_attributes (product_id, attribute_type, value)
SELECT p.id, 'finish', mapped.slug
FROM products p
CROSS JOIN LATERAL (
  SELECT slug FROM (VALUES
    ('natural',     'natural-unglazed'),
    ('unglazed',    'natural-unglazed'),
    ('glazed',      'glazed'),
    ('smooth',      'smooth'),
    ('textured',    'textured-rustic'),
    ('rustic',      'textured-rustic')
  ) AS m(keyword, slug)
  WHERE LOWER(TRIM(p.finish)) LIKE '%' || m.keyword || '%'
  LIMIT 1
) AS mapped
WHERE p.finish IS NOT NULL
  AND TRIM(p.finish) <> ''
  AND NOT EXISTS (
    SELECT 1 FROM product_attributes pa
    WHERE pa.product_id = p.id AND pa.attribute_type = 'finish'
  );

-- 2b. Pattern: product name/slug keyword → attribute_type 'pattern' ----------
INSERT INTO product_attributes (product_id, attribute_type, value)
SELECT p.id, 'pattern', m.slug
FROM products p
CROSS JOIN LATERAL (
  SELECT slug FROM (VALUES
    ('disco',   'disco'),
    ('murlee',  'murlee'),
    ('french',  'french'),
    ('spanish', 'spanish'),
    ('italian', 'italian'),
    ('flat',    'flat')
  ) AS m(keyword, slug)
  WHERE LOWER(p.name) LIKE '%' || m.keyword || '%'
     OR LOWER(p.slug) LIKE '%' || m.keyword || '%'
  LIMIT 1
) AS m
WHERE NOT EXISTS (
  SELECT 1 FROM product_attributes pa
  WHERE pa.product_id = p.id AND pa.attribute_type = 'pattern'
);

-- 2c. Type + Suitability from category tree ----------------------------------
-- Resolves each product's root ancestor category (1 level up is enough for
-- the current 2-level taxonomy), then maps:
--   root slug contains 'roof'    → type=roof-tile,     suitability=roof
--   root slug contains 'floor'   → type=floor-tile,    suitability=floor
--   root slug contains 'wall'    → type=wall-tile,     suitability=wall
--   root slug contains 'jali'    → type=screen-jali-tile, suitability=screen-partition

-- 2c-i. Type
INSERT INTO product_attributes (product_id, attribute_type, value)
SELECT p.id, 'type',
  CASE
    WHEN COALESCE(parent.slug, c.slug) LIKE '%roof%'  THEN 'roof-tile'
    WHEN COALESCE(parent.slug, c.slug) LIKE '%floor%' THEN 'floor-tile'
    WHEN COALESCE(parent.slug, c.slug) LIKE '%wall%'  THEN 'wall-tile'
    WHEN COALESCE(parent.slug, c.slug) LIKE '%jali%'  THEN 'screen-jali-tile'
  END
FROM products p
JOIN categories c        ON c.id = p.category_id
LEFT JOIN categories parent ON parent.id = c.parent_id
WHERE p.category_id IS NOT NULL
  AND COALESCE(parent.slug, c.slug) ~ '(roof|floor|wall|jali)'
  AND NOT EXISTS (
    SELECT 1 FROM product_attributes pa
    WHERE pa.product_id = p.id AND pa.attribute_type = 'type'
  );

-- 2c-ii. Suitability
INSERT INTO product_attributes (product_id, attribute_type, value)
SELECT p.id, 'suitability',
  CASE
    WHEN COALESCE(parent.slug, c.slug) LIKE '%roof%'  THEN 'roof'
    WHEN COALESCE(parent.slug, c.slug) LIKE '%floor%' THEN 'floor'
    WHEN COALESCE(parent.slug, c.slug) LIKE '%wall%'  THEN 'wall'
    WHEN COALESCE(parent.slug, c.slug) LIKE '%jali%'  THEN 'screen-partition'
  END
FROM products p
JOIN categories c        ON c.id = p.category_id
LEFT JOIN categories parent ON parent.id = c.parent_id
WHERE p.category_id IS NOT NULL
  AND COALESCE(parent.slug, c.slug) ~ '(roof|floor|wall|jali)'
  AND NOT EXISTS (
    SELECT 1 FROM product_attributes pa
    WHERE pa.product_id = p.id AND pa.attribute_type = 'suitability'
  );

-- 2d. Application from category name (any ancestor or self) ------------------
-- Checks the product's own category AND its parent for application-keyword
-- matches (outdoor, kitchen, bathroom, pool, industrial, courtyard).
INSERT INTO product_attributes (product_id, attribute_type, value)
SELECT DISTINCT p.id, 'application', m.slug
FROM products p
JOIN categories c        ON c.id = p.category_id
LEFT JOIN categories parent ON parent.id = c.parent_id
CROSS JOIN LATERAL (
  SELECT slug FROM (VALUES
    ('outdoor',    'outdoor'),
    ('kitchen',    'kitchen'),
    ('bathroom',   'bathroom'),
    ('pool',       'pool'),
    ('industrial', 'industrial'),
    ('courtyard',  'courtyard')
  ) AS m(keyword, slug)
  WHERE LOWER(c.name) LIKE '%' || m.keyword || '%'
     OR LOWER(COALESCE(parent.name, '')) LIKE '%' || m.keyword || '%'
  LIMIT 1
) AS m
WHERE p.category_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM product_attributes pa
    WHERE pa.product_id = p.id AND pa.attribute_type = 'application'
  );

-- 2e. Size from products.size column ----------------------------------------
INSERT INTO product_attributes (product_id, attribute_type, value)
SELECT p.id, 'size',
  TRIM(
    REGEXP_REPLACE(
      REGEXP_REPLACE(p.size, '\s+', ' ', 'g'),
      '\s*[xX×]\s*', 'x', 'g'
    )
  )
FROM products p
WHERE p.size IS NOT NULL
  AND TRIM(p.size) <> ''
  AND NOT EXISTS (
    SELECT 1 FROM product_attributes pa
    WHERE pa.product_id = p.id AND pa.attribute_type = 'size'
  );

COMMIT;

-- ============================================================================
-- Verification queries (run after COMMIT to confirm seeding)
-- ============================================================================

-- SELECT filter_type, COUNT(*) AS values_count
-- FROM filter_types
-- GROUP BY filter_type
-- ORDER BY MIN(display_order);

-- SELECT attribute_type, COUNT(*) AS product_count
-- FROM product_attributes
-- GROUP BY attribute_type
-- ORDER BY attribute_type;
