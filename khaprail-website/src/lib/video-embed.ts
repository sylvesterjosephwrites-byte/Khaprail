// Turns a plain YouTube/Vimeo URL into an embeddable player URL for the
// video lightbox. Returns null for anything else (e.g. a direct .mp4 link),
// which the lightbox falls back to rendering as a plain <video> element.
export function getVideoEmbedUrl(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  const host = parsed.hostname.replace(/^www\./, "")

  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = parsed.searchParams.get("v")
    if (id) return `https://www.youtube.com/embed/${id}`
    const match = parsed.pathname.match(/^\/(?:shorts|embed)\/([\w-]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1)
    return id ? `https://www.youtube.com/embed/${id}` : null
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = parsed.pathname.split("/").filter(Boolean).pop()
    return id ? `https://player.vimeo.com/video/${id}` : null
  }

  return null
}
