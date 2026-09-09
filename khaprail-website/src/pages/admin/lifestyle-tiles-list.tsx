import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { useAdminLifestyleTiles } from "@/hooks/use-admin-lifestyle-tiles"
import { deleteLifestyleTile, setLifestyleTileActive } from "@/lib/lifestyle-tiles-admin"

// /admin/lifestyle-tiles — CRUD list for the homepage "Tiles for Every
// Space" editorial section. Ordered by `sort_order` so the list reads
// left-to-right the same way the homepage tiles do.
export function AdminLifestyleTilesList() {
  const { tiles, isLoading, error } = useAdminLifestyleTiles()
  const [activeOverrides, setActiveOverrides] = useState<Record<string, boolean>>({})

  async function handleToggleActive(id: string, current: boolean) {
    setActiveOverrides((prev) => ({ ...prev, [id]: !current }))
    await setLifestyleTileActive(id, !current)
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl">Lifestyle Tiles</h1>
        <Button nativeButton={false} render={<Link to="/admin/lifestyle-tiles/new" />}>
          New Tile
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : tiles.length === 0 ? (
        <p className="text-sm text-muted-foreground">No lifestyle tiles yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {tiles.map((tile) => {
            const isActive = activeOverrides[tile.id] ?? tile.is_active
            return (
              <div key={tile.id} className="flex items-center gap-4 py-3">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {tile.image_url && (
                    <img src={tile.image_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <Link to={`/admin/lifestyle-tiles/${tile.id}/edit`} className="flex-1 hover:underline">
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    {tile.caption || "(no caption)"}
                    {!isActive && <Badge variant="outline">Inactive</Badge>}
                  </p>
                  <p className="text-sm text-muted-foreground">Order: {tile.sort_order} · {tile.link_url}</p>
                </Link>
                <Button type="button" variant="outline" size="sm" onClick={() => void handleToggleActive(tile.id, isActive)}>
                  {isActive ? "Deactivate" : "Activate"}
                </Button>
                <ConfirmDeleteDialog
                  itemLabel={tile.caption || "this tile"}
                  onConfirm={() => deleteLifestyleTile(tile.id).then(() => window.location.reload())}
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
