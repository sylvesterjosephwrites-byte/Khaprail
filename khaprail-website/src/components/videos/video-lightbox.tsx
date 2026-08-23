import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { getVideoEmbedUrl } from "@/lib/video-embed"
import type { Video } from "@/types/video"

interface VideoLightboxProps {
  video: Video | null
  onOpenChange: (open: boolean) => void
}

export function VideoLightbox({ video, onOpenChange }: VideoLightboxProps) {
  const embedUrl = video ? getVideoEmbedUrl(video.video_url) : null

  return (
    <Dialog open={video !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogTitle className="sr-only">{video?.title ?? "Video"}</DialogTitle>
        {video && (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={video.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              // eslint-disable-next-line jsx-a11y/media-has-caption -- source video has no captions to attach
              <video src={video.video_url} controls autoPlay className="h-full w-full" />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
