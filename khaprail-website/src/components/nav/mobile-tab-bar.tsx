import type { ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { HomeIcon, SlidersHorizontalIcon, DownloadIcon, PhoneIcon } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp"
import { useMobileDrawer } from "@/lib/mobile-drawer-context"
import { useChatPanel } from "@/lib/chat-panel-context"
import { cn } from "@/lib/utils"

const MOBILE_FILTERS_HASH = "#mobile-filters"

// Persistent bottom tab bar (mobile only, every page) — Home / Filters /
// an elevated "Get a Sample" WhatsApp CTA / Catalog / Contact. Hidden
// whenever the category drawer (hamburger), the filters drawer, or the AI
// chat panel is open, so only one mobile nav surface is ever on screen at
// once — the chat panel now takes over the full mobile screen (see
// ai-chat-widget.tsx), so without this the tab bar was visible
// underneath/behind it, the exact double-UI-stacking case this rule
// already existed to prevent for the other two drawers. "Filters" isn't a
// real page — it opens the two-pane filters drawer that lives on
// `/products` (see `mobile-filters-drawer.tsx`); the drawer's open/closed
// state is the `#mobile-filters` URL hash rather than a query param,
// specifically so it can't collide with `parseFiltersFromSearchParams`
// (lib/product-filters.ts), which treats every other query key as a real
// filter type. Tapping Filters from anywhere else navigates to `/products`
// with that hash already set.
export function MobileTabBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { categoryDrawerOpen } = useMobileDrawer()
  const { isOpen: chatPanelOpen } = useChatPanel()

  const filtersDrawerOpen = location.hash === MOBILE_FILTERS_HASH
  if (categoryDrawerOpen || filtersDrawerOpen || chatPanelOpen) return null

  function handleFiltersTap() {
    if (location.pathname === "/products") {
      navigate(`${location.pathname}${location.search}${MOBILE_FILTERS_HASH}`, { replace: true })
    } else {
      navigate(`/products${MOBILE_FILTERS_HASH}`)
    }
  }

  const isHome = location.pathname === "/"
  const isProducts = location.pathname === "/products"
  const isCatalog = location.pathname === "/downloads"
  const isContact = location.pathname === "/contact"

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="relative grid h-16 grid-cols-5 items-stretch">
        <TabLink to="/" label="Home" isActive={isHome}>
          <HomeIcon className="size-5" />
        </TabLink>
        <TabButton label="Filters" isActive={isProducts} onClick={handleFiltersTap}>
          <SlidersHorizontalIcon className="size-5" />
        </TabButton>

        <div className="flex items-center justify-center">
          <a
            href={buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noreferrer"
            aria-label="Get a Sample on WhatsApp"
            className="absolute -top-5 flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg outline-none transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95"
          >
            <WhatsAppIcon className="size-6" />
          </a>
          <span className="absolute bottom-1.5 text-[0.65rem] font-medium text-muted-foreground">
            Get a Sample
          </span>
        </div>

        <TabLink to="/downloads" label="Catalog" isActive={isCatalog}>
          <DownloadIcon className="size-5" />
        </TabLink>
        <TabLink to="/contact" label="Contact" isActive={isContact}>
          <PhoneIcon className="size-5" />
        </TabLink>
      </div>
    </nav>
  )
}

interface TabProps {
  label: string
  isActive: boolean
  children: ReactNode
}

function TabLink({ to, label, isActive, children }: TabProps & { to: string }) {
  return (
    <Link
      to={to}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 text-[0.65rem] font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      {children}
      {label}
    </Link>
  )
}

function TabButton({ label, isActive, onClick, children }: TabProps & { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 text-[0.65rem] font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      {children}
      {label}
    </button>
  )
}
