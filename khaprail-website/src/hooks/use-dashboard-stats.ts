import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface ActivityItem {
  id: string
  kind: "product" | "inquiry" | "post"
  label: string
  created_at: string
}

interface DashboardStats {
  productCount: number
  collectionCount: number
  inquiriesLast7Days: number
  inquiriesLast30Days: number
  recentActivity: ActivityItem[]
  isLoading: boolean
}

const DAY_MS = 24 * 60 * 60 * 1000

/** /admin dashboard home — real counts only, no fabricated stats (CLAUDE.md rule 2). */
export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<Omit<DashboardStats, "isLoading">>({
    productCount: 0,
    collectionCount: 0,
    inquiriesLast7Days: 0,
    inquiriesLast30Days: 0,
    recentActivity: [],
  })
  const [isLoading, setIsLoading] = useState(() => supabase !== null)

  useEffect(() => {
    if (!supabase) return
    const client = supabase
    let cancelled = false

    async function run() {
      const now = new Date()
      const sevenDaysAgo = new Date(now.getTime() - 7 * DAY_MS).toISOString()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * DAY_MS).toISOString()

      const [productCountRes, collectionCountRes, last7Res, last30Res, recentProductsRes, recentInquiriesRes, recentPostsRes] =
        await Promise.all([
          client.from("products").select("*", { count: "exact", head: true }),
          client.from("collections").select("*", { count: "exact", head: true }),
          client.from("sample_inquiries").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
          client.from("sample_inquiries").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
          client.from("products").select("id, name, created_at").order("created_at", { ascending: false }).limit(5),
          client
            .from("sample_inquiries")
            .select("id, name, created_at")
            .order("created_at", { ascending: false })
            .limit(5),
          client.from("blog_posts").select("id, title, created_at").order("created_at", { ascending: false }).limit(5),
        ])

      const activity: ActivityItem[] = [
        ...(recentProductsRes.data ?? []).map((p) => ({
          id: p.id,
          kind: "product" as const,
          label: `Product added: ${p.name}`,
          created_at: p.created_at,
        })),
        ...(recentInquiriesRes.data ?? []).map((i) => ({
          id: i.id,
          kind: "inquiry" as const,
          label: `Sample inquiry from ${i.name}`,
          created_at: i.created_at,
        })),
        ...(recentPostsRes.data ?? []).map((p) => ({
          id: p.id,
          kind: "post" as const,
          label: `Blog post: ${p.title}`,
          created_at: p.created_at,
        })),
      ]
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, 10)

      if (cancelled) return
      setStats({
        productCount: productCountRes.count ?? 0,
        collectionCount: collectionCountRes.count ?? 0,
        inquiriesLast7Days: last7Res.count ?? 0,
        inquiriesLast30Days: last30Res.count ?? 0,
        recentActivity: activity,
      })
      setIsLoading(false)
    }

    run()

    return () => {
      cancelled = true
    }
  }, [])

  return { ...stats, isLoading }
}
