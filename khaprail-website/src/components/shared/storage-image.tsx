import type { CSSProperties } from "react"
import { isSupabaseStorageUrl, transformStorageImage } from "@/lib/image-transform"

interface StorageImageProps {
  src: string
  alt: string
  /** Rendered CSS width/height (the actual display slot, not the source file's dimensions) — used both for the transform request size and the `<img>`'s own `width`/`height` attributes (layout-shift prevention). */
  width: number
  height: number
  className?: string
  style?: CSSProperties
  quality?: number
  resize?: "cover" | "contain" | "fill"
  /** Above-the-fold / LCP-candidate image — loads eagerly with a high fetch priority instead of the lazy-loaded default. */
  priority?: boolean
}

/**
 * `<picture>` wrapper around a Supabase Storage-hosted image: a WebP
 * `<source>` plus a same-size/quality original-format `<img>` fallback, both
 * via Storage's image transformation endpoint (`lib/image-transform.ts`) —
 * real format/size optimization, not just a `loading="lazy"` attribute.
 * Non-Storage URLs (local bundled assets, external links) render as a plain
 * `<img>` unchanged, since there's nothing to transform.
 */
export function StorageImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  quality,
  resize = "cover",
  priority = false,
}: StorageImageProps) {
  const canTransform = isSupabaseStorageUrl(src)
  const webpSrc = canTransform ? transformStorageImage(src, { width, height, quality, resize, format: "webp" }) : null
  const fallbackSrc = canTransform ? transformStorageImage(src, { width, height, quality, resize }) : src

  return (
    <picture>
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      <img
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        className={className}
        style={style}
      />
    </picture>
  )
}
