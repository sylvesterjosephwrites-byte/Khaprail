import { createContext, useContext, useState, type ReactNode } from "react"

interface ChatPanelContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
}

const ChatPanelContext = createContext<ChatPanelContextValue | null>(null)

/**
 * Shared open/closed state for the single AI chat panel (`AiChatWidget`,
 * mounted once in `SiteLayout`) so multiple entry points — the floating
 * bottom-left trigger, the navbar icon, the mobile drawer icon — can all
 * open/close the same instance instead of each owning its own popover.
 */
export function ChatPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <ChatPanelContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </ChatPanelContext.Provider>
  )
}

export function useChatPanel(): ChatPanelContextValue {
  const ctx = useContext(ChatPanelContext)
  if (!ctx) throw new Error("useChatPanel must be used within ChatPanelProvider")
  return ctx
}
