import { supabase } from "@/lib/supabase"
import { stripDuplicatedExtension } from "@/lib/utils"
import type { OfferCard } from "@/types/offer-card"

export type OfferCardFormValues = Omit<OfferCard, "id" | "created_at" | "updated_at">

/** Requires the authenticated admin session per the `offer_cards` RLS policy. */
export async function saveOfferCard(values: OfferCardFormValues, existingId: string | null): Promise<string> {
  if (!supabase) throw new Error("Supabase project not configured yet")

  // The Image URL field is a plain "paste the Storage URL" input, no upload
  // widget — strip a doubled extension before it's saved (finding 12).
  const row = {
    ...values,
    image_url: stripDuplicatedExtension(values.image_url),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = existingId
    ? await supabase.from("offer_cards").update(row).eq("id", existingId).select("id").single()
    : await supabase.from("offer_cards").insert(row).select("id").single()

  if (error) throw error
  return data.id as string
}

export async function deleteOfferCard(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase project not configured yet")
  const { error } = await supabase.from("offer_cards").delete().eq("id", id)
  if (error) throw error
}

export async function setOfferCardActive(id: string, isActive: boolean): Promise<void> {
  if (!supabase) throw new Error("Supabase project not configured yet")
  const { error } = await supabase
    .from("offer_cards")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw error
}
