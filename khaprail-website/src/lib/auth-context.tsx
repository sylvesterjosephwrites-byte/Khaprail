import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextValue {
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Wraps the /admin/* tree. Any signed-in Supabase user is treated as the
 * admin (07-ADMIN-DASHBOARD-SPEC.md: "single admin role is sufficient for
 * v1"). The app never ships a public sign-up form — the one admin account
 * is created directly in the Supabase dashboard (Authentication > Users),
 * so `authenticated` is only ever reachable by whoever holds that login.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(() => supabase !== null)

  useEffect(() => {
    if (!supabase) return
    const client = supabase

    client.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setIsLoading(false)
    })

    const { data: subscription } = client.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    if (!supabase) return { error: "Supabase project not configured yet" }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? error.message : null }
  }

  async function signOut() {
    await supabase?.auth.signOut()
  }

  return <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
