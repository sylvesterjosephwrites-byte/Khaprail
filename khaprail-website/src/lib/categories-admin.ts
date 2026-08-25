import { supabase } from "@/lib/supabase"
import type { Category } from "@/types/category"

export type CategoryFormValues = Omit<Category, "id" | "created_at">

/** Requires the authenticated admin session per the `categories` RLS policy. */
export async function saveCategory(values: CategoryFormValues, existingId: string | null): Promise<string> {
  if (!supabase) throw new Error("Supabase project not configured yet")

  const { data, error } = existingId
    ? await supabase.from("categories").update(values).eq("id", existingId).select("id").single()
    : await supabase.from("categories").insert(values).select("id").single()

  if (error) throw error
  return data.id as string
}

export async function deleteCategory(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase project not configured yet")
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) throw error
}
