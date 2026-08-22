import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCollection } from "@/hooks/use-collection"
import { buildWhatsAppUrl } from "@/lib/whatsapp"

// /collections/[slug] — collection landing page (01-SITE-MAP.md). Products
// within a collection land in batch 5 (04-PRODUCT-LISTING-FILTERS.md); until
// then this shows an honest empty state rather than fabricated listings
// (02-DESIGN-SYSTEM.md "honest data only").
export function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { collection, isLoading, error } = useCollection(slug)

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
          <Skeleton className="aspect-[21/9] w-full rounded-lg" />
          <Skeleton className="mx-auto mt-6 h-8 w-64" />
        </div>
      </main>
    )
  }

  if (error || !collection) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <h1 className="font-heading text-2xl">Collection not found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn't find that collection. Browse all collections instead.
        </p>
        <Button className="mt-4" nativeButton={false} render={<Link to="/collections" />}>
          View All Collections
        </Button>
      </main>
    )
  }

  return (
    <main className="flex-1">
      <div className="border-b border-border bg-secondary/40">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6">
          <div className="flex aspect-[21/9] w-full max-w-3xl items-center justify-center overflow-hidden rounded-lg bg-muted shadow-sm">
            {collection.cover_image_url && (
              <img src={collection.cover_image_url} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <h1 className="font-heading text-4xl">{collection.name}</h1>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-16 text-center sm:px-6">
        <p className="text-muted-foreground">
          Products in this collection are coming soon. In the meantime, get in touch and we'll walk you
          through what's available.
        </p>
        <Button
          size="lg"
          className="mt-6 h-12 px-6 text-base"
          nativeButton={false}
          render={
            <a
              href={buildWhatsAppUrl(`Hi, I'm interested in ${collection.name}. Could you share more details?`)}
              target="_blank"
              rel="noreferrer"
            />
          }
        >
          Ask About {collection.name} on WhatsApp
        </Button>
      </div>
    </main>
  )
}
