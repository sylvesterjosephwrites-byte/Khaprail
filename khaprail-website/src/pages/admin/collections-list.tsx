import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { useCollections } from "@/hooks/use-collections"
import { deleteCollection } from "@/lib/collections-admin"

// /admin/collections — CRUD list (07-ADMIN-DASHBOARD-SPEC.md).
export function AdminCollectionsList() {
  const { collections, isLoading, error } = useCollections()

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl">Collections</h1>
        <Button nativeButton={false} render={<Link to="/admin/collections/new" />}>
          New Collection
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : collections.length === 0 ? (
        <p className="text-sm text-muted-foreground">No collections yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {collections.map((collection) => (
            <div key={collection.id} className="flex items-center justify-between gap-4 py-3">
              <Link to={`/admin/collections/${collection.id}/edit`} className="flex-1 hover:underline">
                <p className="font-medium text-foreground">{collection.name}</p>
                <p className="text-sm text-muted-foreground">/{collection.slug}</p>
              </Link>
              {collection.is_secondary && <Badge variant="outline">Secondary</Badge>}
              <ConfirmDeleteDialog
                itemLabel={collection.name}
                onConfirm={() => deleteCollection(collection.id).then(() => window.location.reload())}
                trigger={
                  <button type="button" className="text-sm text-muted-foreground hover:text-destructive">
                    Delete
                  </button>
                }
              />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
