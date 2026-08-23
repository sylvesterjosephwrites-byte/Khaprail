import { Link } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { CollectionTile } from "@/components/collections/collection-tile"
import { useCollections } from "@/hooks/use-collections"

export function CollectionsShowcase() {
  const { collections, isLoading, error } = useCollections()
  const primary = collections.filter((c) => !c.is_secondary)

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-3xl font-semibold sm:text-4xl">Shop by Collection</h2>
        <p className="mt-2 text-muted-foreground">Roof, floor, and wall tiles grouped the way you'd ask for them.</p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-[16/10] w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : error || primary.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Collections coming soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {primary.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.slug}`}
              className="group/card flex flex-col items-center gap-2 rounded-lg p-2 text-center outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <CollectionTile collection={collection} />
            </Link>
          ))}
        </div>
      )}
      {!isLoading && !error && primary.length > 0 && (
        <div className="mt-8 text-center">
          <Link to="/collections" className="text-sm font-medium text-primary hover:underline">
            View All Collections
          </Link>
        </div>
      )}
    </section>
  )
}
