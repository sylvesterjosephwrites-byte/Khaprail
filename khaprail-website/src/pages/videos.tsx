import { Skeleton } from "@/components/ui/skeleton"
import { VideoGrid } from "@/components/videos/video-grid"
import { useVideos } from "@/hooks/use-videos"
import { CtaBanner } from "@/components/shared/cta-banner"

// /videos (01-SITE-MAP.md). Reads the real `videos` table (see
// use-videos.ts) — no admin management UI exists yet for this table (open
// question in 00-PROGRESS.md), so rows currently need adding directly in
// Supabase until that's decided. Honest "coming soon" empty state, matching
// every other section on the site, until real video links are added.
export function Videos() {
  const { videos, isLoading, error } = useVideos()

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-5xl font-semibold sm:text-6xl">Videos</h1>
          <p className="mt-2 text-muted-foreground">Our workshop, tile-making process, and installations.</p>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video w-full rounded-lg" />
            ))}
          </div>
        ) : error || videos.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            We're putting together videos of our workshop and tile-making process. Check back soon.
          </p>
        ) : (
          <VideoGrid videos={videos} />
        )}
      </div>
      <CtaBanner />
    </main>
  )
}
