import { NavLink, Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin" },
  { label: "Products", to: "/admin/products" },
  { label: "Categories", to: "/admin/categories" },
  { label: "Filter Types", to: "/admin/filter-types" },
  { label: "Blog Posts", to: "/admin/blog" },
  { label: "Sample Inquiries", to: "/admin/sample-inquiries" },
] as const

// Admin gets its own chrome, not the storefront's SiteLayout
// (07-ADMIN-DASHBOARD-SPEC.md). Dark-espresso sidebar (src/index.css's
// --sidebar tokens) to read as visually distinct from the storefront.
export function AdminLayout() {
  const { signOut } = useAuth()

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col justify-between bg-sidebar text-sidebar-foreground">
        <div>
          <div className="px-4 py-5">
            <span className="font-heading text-lg">Khaprail Admin</span>
          </div>
          <nav className="flex flex-col gap-1 px-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="border-t border-sidebar-border p-4">
          <Button variant="outline" size="sm" className="w-full" onClick={() => void signOut()}>
            Sign Out
          </Button>
        </div>
      </aside>
      <div className="flex-1 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  )
}
