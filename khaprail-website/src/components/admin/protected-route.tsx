import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"

export function ProtectedRoute() {
  const { session, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading...</div>
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
