import { supabase } from "@/lib/supabase"

export interface ProductFormValues {
  name: string
  slug: string
  category_id: string | null
  description: string | null
  size: string | null
  thickness: string | null
  finish: string | null
  country_of_origin: string
  cover_image_url: string | null
  is_featured: boolean
  brand: string | null
  merchant: string | null
  sku: string | null
  availability: string | null
  manufacturer: string | null
  price: number | null
}

export interface ImageDraft {
  image_url: string
}

export interface AttributeDraft {
  attribute_type: string
  value: string
}

/**
 * Insert-or-update a product plus a full replace of its images/attributes
 * (delete-then-insert, same pattern as `saveBlogPost`). Requires the
 * authenticated admin session per the `products` RLS policies (batch 9).
 */
export async function saveProduct(
  values: ProductFormValues,
  images: ImageDraft[],
  attributes: AttributeDraft[],
  existingId: string | null
): Promise<string> {
  if (!supabase) throw new Error("Supabase project not configured yet")

  const { data, error } = existingId
    ? await supabase.from("products").update(values).eq("id", existingId).select("id").single()
    : await supabase.from("products").insert(values).select("id").single()

  if (error) throw error
  const productId = data.id as string

  const [{ error: imgDelErr }, { error: attrDelErr }] = await Promise.all([
    supabase.from("product_images").delete().eq("product_id", productId),
    supabase.from("product_attributes").delete().eq("product_id", productId),
  ])
  if (imgDelErr) throw imgDelErr
  if (attrDelErr) throw attrDelErr

  const imageRows = images
    .filter((img) => img.image_url.trim())
    .map((img, index) => ({ product_id: productId, image_url: img.image_url, sort_order: index }))
  const attributeRows = attributes
    .filter((a) => a.attribute_type.trim() && a.value.trim())
    .map((a) => ({ product_id: productId, attribute_type: a.attribute_type, value: a.value }))

  const [{ error: imgInsErr }, { error: attrInsErr }] = await Promise.all([
    imageRows.length > 0 ? supabase.from("product_images").insert(imageRows) : Promise.resolve({ error: null }),
    attributeRows.length > 0
      ? supabase.from("product_attributes").insert(attributeRows)
      : Promise.resolve({ error: null }),
  ])
  if (imgInsErr) throw imgInsErr
  if (attrInsErr) throw attrInsErr

  return productId
}

export async function deleteProduct(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase project not configured yet")
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw error
}
