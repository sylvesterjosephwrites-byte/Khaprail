import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export interface AdminSampleInquiry {
  id: string
  name: string
  phone: string
  message: string | null
  status: string
  created_at: string
  products: { name: string } | null
}

interface UseAdminSampleInquiriesResult {
  inquiries: AdminSampleInquiry[]
  isLoading: boolean
  error: string | null
}

/** /admin/sample-inquiries — requires the authenticated admin session (batch 9 RLS). */
export function useAdminSampleInquiries(): UseAdminSampleInquiriesResult {
  const [inquiries, setInquiries] = useState<AdminSampleInquiry[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    supabase
      .from("sample_inquiries")
      .select("id, name, phone, message, status, created_at, products ( name )")
      .order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) {
          setError(queryError.message)
        } else {
          setInquiries((data ?? []) as unknown as AdminSampleInquiry[])
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { inquiries, isLoading, error }
}
