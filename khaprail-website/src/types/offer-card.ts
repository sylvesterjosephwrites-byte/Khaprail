// Mirrors the `offer_cards` table — homepage "Offers, Available Now"
// section. `badge_value`/`badge_suffix`/`label` must describe a real,
// always-true capability (free samples, bulk pricing, delivery terms,
// new-customer welcome), never a percentage-off discount — Khaprail has no
// confirmed live promotion. All admin-editable so real numbers/terms can be
// swapped in the moment one is confirmed, with no code change.
export interface OfferCard {
  id: string
  badge_value: string
  badge_suffix: string | null
  label: string
  link_label: string
  link_url: string
  image_url: string
  image_alt_text: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}
