import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * This app uses a plain `<BrowserRouter>`, not the data-router APIs, so
 * React Router's `<ScrollRestoration>` isn't available (it requires a
 * `createBrowserRouter` data router). Without this, no route change resets
 * scroll position — a visitor who scrolls down `/products` and clicks a
 * product card lands on the new PDP already scrolled to wherever the old
 * page left off, not the top (UX_AUDIT_REPORT.md finding 7 / Exec Summary
 * #2). Scoped to the pathname (not the full location) so in-page filter/sort
 * changes that only touch the query string don't yank scroll position.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
