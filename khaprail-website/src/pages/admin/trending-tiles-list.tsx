import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { useAdminTrendingTiles } from "@/hooks/use-admin-trending-tiles"
import { deleteTrendingTile, setTrendingTileActive } from "@/lib/trending-tiles-admin"
import type { TrendingTileGridPosition } from "@/types/trending-tile"

const POSITION_LABELS: Record<TrendingTileGridPosition, string> = {
  large: "Large (left)",
  small_top_left: "Small (top-left)",
  small_top_right: "Small (top-right)",
  wide_bottom: "Wide (bottom)",
}

// /admin/trending-tiles — CRUD list for the homepage "Trending in Tiles"
// bento grid (4 fixed slots). Ordered by grid_position so the list reads
// in the same large/top-left/top-right/wide-bottom order as the grid.
export function AdminTrendingTilesList() {
  const { tiles, isLoading, error } = useAdminTrendingTiles()
  const [activeOverrides, setActiveOverrides] = useState<Record<string, boolean>>({})

  async function handleToggleActive(id: string, current: boolean) {
    setActiveOverrides((prev) => ({ ...prev, [id]: !current }))
    await setTrendingTileActive(id, !current)
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl">Trending Tiles</h1>
        <Button nativeButton={false} render={<Link to="/admin/trending-tiles/new" />}>
          New Trending Tile
        </Button>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        The homepage grid only renders correctly with one active tile per position — if two active tiles
        share a position, the most recently edited one is used.
      </p>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : tiles.length === 0 ? (
        <p className="text-sm text-muted-foreground">No trending tiles yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {tiles.map((tile) => {
            const isActive = activeOverrides[tile.id] ?? tile.is_active
            return (
              <div key={tile.id} className="flex items-center gap-4 py-3">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {tile.image_url && <img src={tile.image_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <Link to={`/admin/trending-tiles/${tile.id}/edit`} className="flex-1 hover:underline">
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    {tile.title}
                    {!isActive && <Badge variant="outline">Inactive</Badge>}
                  </p>
                  <p className="text-sm text-muted-foreground">{POSITION_LABELS[tile.grid_position]}</p>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleToggleActive(tile.id, isActive)}
                >
                  {isActive ? "Deactivate" : "Activate"}
                </Button>
                <ConfirmDeleteDialog
                  itemLabel={tile.title}
                  onConfirm={() => deleteTrendingTile(tile.id).then(() => window.location.reload())}
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
