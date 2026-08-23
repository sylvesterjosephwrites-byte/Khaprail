// Mirrors the `videos` table — an admin-editable list of embedded product/
// installation videos for the homepage and /videos page (01-SITE-MAP.md).
export interface Video {
  id: string
  title: string
  video_url: string
  thumbnail_url: string | null
  sort_order: number
}
