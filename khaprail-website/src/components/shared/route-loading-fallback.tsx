// Suspense fallback for lazy-loaded route chunks (App.tsx) — shown only for
// the split-second a route's JS chunk is still downloading, inside the
// layout's `<Outlet />` boundary so the header/footer/nav chrome around it
// never disappears. Deliberately minimal (no skeleton shapes to avoid
// implying a specific page layout that isn't there yet).
export function RouteLoadingFallback() {
  return (
    <div className="flex min-h-[50vh] flex-1 items-center justify-center" role="status" aria-label="Loading">
      <span className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
  )
}
