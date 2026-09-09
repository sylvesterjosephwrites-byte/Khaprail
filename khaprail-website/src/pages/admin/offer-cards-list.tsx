import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { useAdminOfferCards } from "@/hooks/use-admin-offer-cards"
import { deleteOfferCard, setOfferCardActive } from "@/lib/offer-cards-admin"

// /admin/offer-cards — CRUD list for the homepage "Offers, Available Now"
// section. No percentage-off discount exists yet — badge_value/label must
// stay a real, always-true capability (free samples, bulk pricing,
// delivery, new-customer welcome) until an actual promotion is confirmed;
// edit the copy here the moment one is. Ordered by `sort_order`.
export function AdminOfferCardsList() {
  const { cards, isLoading, error } = useAdminOfferCards()
  const [activeOverrides, setActiveOverrides] = useState<Record<string, boolean>>({})

  async function handleToggleActive(id: string, current: boolean) {
    setActiveOverrides((prev) => ({ ...prev, [id]: !current }))
    await setOfferCardActive(id, !current)
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl">Offer Cards</h1>
        <Button nativeButton={false} render={<Link to="/admin/offer-cards/new" />}>
          New Offer Card
        </Button>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        No live percentage-off promotion exists yet — keep badges/labels to real, always-true capabilities
        (free samples, bulk pricing, delivery terms, new-customer welcome) until a real offer is confirmed.
      </p>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : cards.length === 0 ? (
        <p className="text-sm text-muted-foreground">No offer cards yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {cards.map((card) => {
            const isActive = activeOverrides[card.id] ?? card.is_active
            return (
              <div key={card.id} className="flex items-center gap-4 py-3">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {card.image_url && <img src={card.image_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <Link to={`/admin/offer-cards/${card.id}/edit`} className="flex-1 hover:underline">
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    {card.badge_value}
                    {card.badge_suffix && <span className="text-muted-foreground">{card.badge_suffix}</span>}
                    {" — "}
                    {card.label}
                    {!isActive && <Badge variant="outline">Inactive</Badge>}
                  </p>
                  <p className="text-sm text-muted-foreground">Order: {card.sort_order} · {card.link_url}</p>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleToggleActive(card.id, isActive)}
                >
                  {isActive ? "Deactivate" : "Activate"}
                </Button>
                <ConfirmDeleteDialog
                  itemLabel={`${card.badge_value} ${card.badge_suffix ?? ""}`.trim()}
                  onConfirm={() => deleteOfferCard(card.id).then(() => window.location.reload())}
                  trigger={
                    <button type="button" className="text-sm text-muted-foreground hover:text-destructive">
                      Delete
                    </button>
                  }
                />
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
