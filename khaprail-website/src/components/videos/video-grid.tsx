import { useState } from "react"
import { PlayIcon } from "lucide-react"
import { VideoLightbox } from "@/components/videos/video-lightbox"
import type { Video } from "@/types/video"

interface VideoGridProps {
  videos: Video[]
}

export function VideoGrid({ videos }: VideoGridProps) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setActiveVideo(video)}
            className="group/video relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {video.thumbnail_url && (
              <img src={video.thumbnail_url} alt="" className="h-full w-full object-cover" />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover/video:bg-black/35">
              <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-primary shadow transition-transform group-hover/video:scale-110">
                <PlayIcon className="ml-0.5 size-5" fill="currentColor" />
              </span>
            </span>
            <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-left text-sm font-medium text-white">
              {video.title}
            </span>
          </button>
        ))}
      </div>
      <VideoLightbox video={activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)} />
    </>
  )
}
