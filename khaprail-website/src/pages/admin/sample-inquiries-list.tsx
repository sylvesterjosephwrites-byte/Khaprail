import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminSampleInquiries } from "@/hooks/use-admin-sample-inquiries"
import { supabase } from "@/lib/supabase"

const STATUS_OPTIONS = ["new", "contacted", "closed"] as const

// /admin/sample-inquiries — log of "Get a Sample" submissions with status
// tracking (07-ADMIN-DASHBOARD-SPEC.md).
export function AdminSampleInquiriesList() {
  const { inquiries, isLoading, error } = useAdminSampleInquiries()
  const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({})

  async function handleStatusChange(id: string, status: string) {
    setStatusOverrides((prev) => ({ ...prev, [id]: status }))
    await supabase?.from("sample_inquiries").update({ status }).eq("id", id)
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 font-heading text-3xl">Sample Inquiries</h1>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : inquiries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sample inquiries yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-medium text-foreground">
                  {inquiry.name} · {inquiry.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {inquiry.products?.name ?? "General inquiry"} — {inquiry.message}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(inquiry.created_at).toLocaleString()}</p>
              </div>
              <Select
                value={statusOverrides[inquiry.id] ?? inquiry.status}
                onValueChange={(v) => v && void handleStatusChange(inquiry.id, v)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
