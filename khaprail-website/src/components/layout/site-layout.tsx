import { Outlet } from "react-router-dom"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { FloatingWhatsAppButton } from "@/components/shared/floating-whatsapp-button"
import { AiChatWidget } from "@/components/shared/ai-chat-widget"
import { MobileTabBar } from "@/components/nav/mobile-tab-bar"
import { MobileDrawerProvider } from "@/lib/mobile-drawer-context"
import { ChatPanelProvider } from "@/lib/chat-panel-context"

// `pb-20` reserves room for the fixed mobile `MobileTabBar` so it never
// overlaps page content/the footer — `lg:pb-0` since that bar only shows
// below the `lg` breakpoint.
export function SiteLayout() {
  return (
    <MobileDrawerProvider>
      <ChatPanelProvider>
        <div className="flex min-h-svh flex-col pb-20 lg:pb-0">
          <SiteHeader />
          <Outlet />
          <SiteFooter />
          <FloatingWhatsAppButton />
          <AiChatWidget />
          <MobileTabBar />
        </div>
      </ChatPanelProvider>
    </MobileDrawerProvider>
  )
}
