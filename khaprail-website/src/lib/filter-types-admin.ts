import { supabase } from "@/lib/supabase"

/** Requires the authenticated admin session per the `filter_types` RLS policy (batch 9). */
export async function addFilterValue(filterType: string, value: string, displayOrder: number): Promise<void> {
  if (!supabase) throw new Error("Supabase project not configured yet")
  const { error } = await supabase
    .from("filter_types")
    .insert({ filter_type: filterType, value, display_order: displayOrder })
  if (error) throw error
}

export async function updateFilterValue(id: string, value: string, displayOrder: number): Promise<void> {
  if (!supabase) throw new Error("Supabase project not configured yet")
  const { error } = await supabase.from("filter_types").update({ value, display_order: displayOrder }).eq("id", id)
  if (error) throw error
}

export async function deleteFilterValue(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase project not configured yet")
  const { error } = await supabase.from("filter_types").delete().eq("id", id)
  if (error) throw error
}
