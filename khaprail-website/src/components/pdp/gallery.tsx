import { StorageImage } from "@/components/shared/storage-image"

interface GalleryProps {
  heroImageUrl: string | null
  thumbnailImageUrl: string | null
  onSwapThumbnail: () => void
}

// Single main photo + one small thumbnail (05-PDP-SPEC.md — "not a full zoom
// gallery"). Clicking the thumbnail swaps it with the hero image. The hero
// photo is a likely LCP element on PDPs, so it loads eagerly/high-priority
// (`priority`) rather than the lazy default every other image on the site
// uses (SEO/perf batch A, 2026-09-10). `alt=""` stays as-is here — this
// batch is image delivery only; descriptive alt text is Batch C's job.
export function Gallery({ heroImageUrl, thumbnailImageUrl, onSwapThumbnail }: GalleryProps) {
  return (
    <div className="flex gap-3">
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-muted">
        {heroImageUrl && (
          <StorageImage
            src={heroImageUrl}
            alt=""
            width={640}
            height={640}
            priority
            className="h-full w-full object-cover"
          />
        )}
      </div>
      {thumbnailImageUrl && (
        <button
          type="button"
          onClick={onSwapThumbnail}
          className="flex size-20 shrink-0 items-center justify-center self-start overflow-hidden rounded-lg bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <StorageImage src={thumbnailImageUrl} alt="" width={80} height={80} className="h-full w-full object-cover" />
        </button>
      )}
    </div>
  )
}
