// Flat nav items from 01-SITE-MAP.md, excluding "Categories" which is its
// own mega-menu (see categories-mega-menu.tsx) rather than a plain link.
export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Best Sellers", to: "/best-sellers" },
  { label: "Videos", to: "/videos" },
  { label: "Downloads", to: "/downloads" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
] as const
