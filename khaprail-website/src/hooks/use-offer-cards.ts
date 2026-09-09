import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { OfferCard } from "@/types/offer-card"

interface UseOfferCardsResult {
  cards: OfferCard[]
  isLoading: boolean
  error: string | null
}

const COLUMNS =
  "id, badge_value, badge_suffix, label, link_label, link_url, image_url, image_alt_text, sort_order, is_active, created_at, updated_at"

/** Homepage "Offers, Available Now" section — active cards only, in admin-set `sort_order`. */
export function useOfferCards(): UseOfferCardsResult {
  const [cards, setCards] = useState<OfferCard[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    supabase
      .from("offer_cards")
      .select(COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) {
          setError(queryError.message)
        } else {
          setCards(data ?? [])
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { cards, isLoading, error }
}
