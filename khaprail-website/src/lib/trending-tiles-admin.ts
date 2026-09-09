import { supabase } from "@/lib/supabase"
import type { TrendingTile } from "@/types/trending-tile"

export type TrendingTileFormValues = Omit<TrendingTile, "id" | "created_at" | "updated_at">

/** Requires the authenticated admin session per the `trending_tiles` RLS policy. */
export async function saveTrendingTile(values: TrendingTileFormValues, existingId: string | null): Promise<string> {
  if (!supabase) throw new Error("Supabase project not configured yet")

  const row = { ...values, updated_at: new Date().toISOString() }

  const { data, error } = existingId
    ? await supabase.from("trending_tiles").update(row).eq("id", existingId).select("id").single()
    : await supabase.from("trending_tiles").insert(row).select("id").single()

  if (error) throw error
  return data.id as string
}

export async function deleteTrendingTile(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase project not configured yet")
  const { error } = await supabase.from("trending_tiles").delete().eq("id", id)
  if (error) throw error
}

export async function setTrendingTileActive(id: string, isActive: boolean): Promise<void> {
  if (!supabase) throw new Error("Supabase project not configured yet")
  const { error } = await supabase
    .from("trending_tiles")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw error
}
