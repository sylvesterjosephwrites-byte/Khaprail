interface GalleryProps {
  heroImageUrl: string | null
  thumbnailImageUrl: string | null
  onSwapThumbnail: () => void
}

// Single main photo + one small thumbnail (05-PDP-SPEC.md — "not a full zoom
// gallery"). Clicking the thumbnail swaps it with the hero image.
export function Gallery({ heroImageUrl, thumbnailImageUrl, onSwapThumbnail }: GalleryProps) {
  return (
    <div className="flex gap-3">
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-muted">
        {heroImageUrl && <img src={heroImageUrl} alt="" className="h-full w-full object-cover" />}
      </div>
      {thumbnailImageUrl && (
        <button
          type="button"
          onClick={onSwapThumbnail}
          className="flex size-20 shrink-0 items-center justify-center self-start overflow-hidden rounded-lg bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <img src={thumbnailImageUrl} alt="" className="h-full w-full object-cover" />
        </button>
      )}
    </div>
  )
}
