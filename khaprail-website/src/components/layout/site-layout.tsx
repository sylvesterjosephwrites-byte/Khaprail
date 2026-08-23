import { Outlet } from "react-router-dom"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { FloatingWhatsAppButton } from "@/components/shared/floating-whatsapp-button"

export function SiteLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <FloatingWhatsAppButton />
    </div>
  )
}
