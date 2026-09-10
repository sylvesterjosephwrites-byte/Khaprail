export interface SubBrand {
  name: string
  url: string
  /** This site — rendered as the current/active brand, not a link to itself. */
  isCurrent: boolean
}

// Khaprail Tiles is the first of a planned series of dedicated per-brand
// tile sites under the PAKTILES.COM parent brand (see CLAUDE.md). Data-driven
// so a third sub-brand is a one-line addition here, not a repeat of the
// navbar-bar/footer-section work — see `sub-brand-bar.tsx` and
// `our-brands-footer-section.tsx`.
export const SUB_BRANDS: SubBrand[] = [
  { name: "PAKTILES.COM", url: "https://paktiles.com", isCurrent: false },
  { name: "Khaprail Tiles", url: "/", isCurrent: true },
]
