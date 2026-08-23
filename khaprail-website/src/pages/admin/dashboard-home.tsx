import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

// /admin — dashboard home (07-ADMIN-DASHBOARD-SPEC.md): real stats and a
// recent-activity feed, never fabricated numbers.
export function DashboardHome() {
  const stats = useDashboardStats()

  const cards = [
    { label: "Products", value: stats.productCount },
    { label: "Collections", value: stats.collectionCount },
    { label: "Inquiries (7 days)", value: stats.inquiriesLast7Days },
    { label: "Inquiries (30 days)", value: stats.inquiriesLast30Days },
  ]

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 font-heading text-3xl">Dashboard</h1>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent>
              {stats.isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="font-heading text-3xl">{card.value}</p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-medium">Recent Activity</h2>
      {stats.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : stats.recentActivity.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {stats.recentActivity.map((item) => (
            <div key={`${item.kind}-${item.id}`} className="flex items-center justify-between py-3 text-sm">
              <span>{item.label}</span>
              <span className="text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
