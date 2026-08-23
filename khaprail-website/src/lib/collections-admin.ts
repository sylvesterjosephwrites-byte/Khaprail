import { supabase } from "@/lib/supabase"
import type { Collection } from "@/types/collection"

export type CollectionFormValues = Omit<Collection, "id">

/** Requires the authenticated admin session per the `collections` RLS policy (batch 9). */
export async function saveCollection(values: CollectionFormValues, existingId: string | null): Promise<string> {
  if (!supabase) throw new Error("Supabase project not configured yet")

  const { data, error } = existingId
    ? await supabase.from("collections").update(values).eq("id", existingId).select("id").single()
    : await supabase.from("collections").insert(values).select("id").single()

  if (error) throw error
  return data.id as string
}

export async function deleteCollection(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase project not configured yet")
  const { error } = await supabase.from("collections").delete().eq("id", id)
  if (error) throw error
}
