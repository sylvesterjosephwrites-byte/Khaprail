// Khaprail's terracotta/espresso/sand tokens (src/index.css) — react-pdf
// can't read CSS variables, so the brand hex values are duplicated here.
// Shared by every PDF document (spec sheets, the full catalog) so they read
// as one consistent, branded set rather than drifting independently.
export const PDF_COLORS = {
  primary: "#B5502B",
  foreground: "#3B2A20",
  muted: "#7A6A58",
  border: "#E8DCC8",
} as const
