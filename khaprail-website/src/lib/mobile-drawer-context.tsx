import { createContext, useContext, useState, type ReactNode } from "react"

interface MobileDrawerContextValue {
  categoryDrawerOpen: boolean
  setCategoryDrawerOpen: (open: boolean) => void
}

const MobileDrawerContext = createContext<MobileDrawerContextValue | null>(null)

/**
 * Shared "is the hamburger category drawer open" flag — the drawer itself
 * lives in `SiteHeader`, but the bottom `MobileTabBar` (a sibling in
 * `SiteLayout`) needs to know when it's open so it can hide itself rather
 * than stacking two mobile nav surfaces on screen at once. The filters
 * drawer doesn't need this context — its open state is driven by the URL
 * hash instead, which `MobileTabBar` can already read directly via
 * `useLocation()`.
 */
export function MobileDrawerProvider({ children }: { children: ReactNode }) {
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)
  return (
    <MobileDrawerContext.Provider value={{ categoryDrawerOpen, setCategoryDrawerOpen }}>
      {children}
    </MobileDrawerContext.Provider>
  )
}

export function useMobileDrawer(): MobileDrawerContextValue {
  const ctx = useContext(MobileDrawerContext)
  if (!ctx) throw new Error("useMobileDrawer must be used within MobileDrawerProvider")
  return ctx
}
