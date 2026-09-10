// Real, confirmed business contact details — single source of truth shared
// by the footer and /contact page so the two can never drift. Do not
// hardcode any of these values elsewhere.

export const CONTACT_EMAIL = "info@paktiles.com"

export interface ContactPhone {
  display: string
  href: string
}

export const CONTACT_PHONES: ContactPhone[] = [
  { display: "+92 300 4617715", href: "tel:+923004617715" },
  { display: "+92 301 6878978", href: "tel:+923016878978" },
]

export interface ContactLocation {
  label: string
  address: string
}

export const CONTACT_LOCATIONS: ContactLocation[] = [
  {
    label: "Lahore [Head Office]",
    address: "Opposite Packages Mall Gate 2, Walton Road, Lahore, Pakistan.",
  },
  {
    label: "Islamabad",
    address: "G-04 Civic Center, Executive Block, Gulberg Greens, Islamabad, Pakistan.",
  },
]

export const CONTACT_HOURS = [
  { days: "Monday – Saturday", hours: "9am – 9pm" },
  { days: "Sunday", hours: "1pm – 6pm" },
]

export const COPYRIGHT_LINE = "Copyright © 2026 PAKTILES.COM. All Rights Reserved."
