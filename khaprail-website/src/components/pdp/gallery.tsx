import { cn } from "@/lib/utils"

interface GalleryProps {
  heroImageUrl: string | null
  thumbnails: { id: string; url: string }[]
  selectedUrl: string | null
  onSelect: (url: string) => void
}

// Hero image + thumbnail rail (05-PDP-SPEC.md). Full zoom-on-click is
// deferred — no real photography exists yet to verify it against, see
// 00-PROGRESS.md open questions.
export function Gallery({ heroImageUrl, thumbnails, selectedUrl, onSelect }: GalleryProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-muted">
        {heroImageUrl && <img src={heroImageUrl} alt="" className="h-full w-full object-cover" />}
      </div>
      {thumbnails.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {thumbnails.map((thumb) => (
            <button
              key={thumb.id}
              type="button"
              onClick={() => onSelect(thumb.url)}
              className={cn(
                "flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted ring-1 ring-transparent outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                selectedUrl === thumb.url && "ring-2 ring-primary"
              )}
            >
              <img src={thumb.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
