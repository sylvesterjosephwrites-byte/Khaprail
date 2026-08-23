import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import { HERO_IMAGE_JPG, HERO_IMAGE_WEBP } from "@/lib/hero-image"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <picture>
        <source srcSet={HERO_IMAGE_WEBP} type="image/webp" />
        <img
          src={HERO_IMAGE_JPG}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_25%]"
        />
      </picture>
      {/* Darker/more opaque over the text on the left, fading out toward the
          right so the photo's texture shows through — brand espresso/terracotta
          tones rather than a generic black scrim. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground/92 via-foreground/70 to-foreground/25" />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 lg:items-start lg:py-32 lg:text-left">
        <span className="rounded-full bg-background/90 px-4 py-1 text-sm font-medium text-primary backdrop-blur-sm">
          Est. 1982 · Lahore, Pakistan
        </span>
        <h1 className="max-w-2xl font-heading text-5xl font-semibold leading-[1.1] text-background sm:text-6xl lg:text-7xl">
          Clay Roof &amp; Terracotta Tiles, Shaped in Lahore Since 1982
        </h1>
        <p className="max-w-xl text-lg text-background/90">
          Khaprail Tiles fires khaprail roof tiles, Multani tiles, and terracotta flooring from local clay —
          made for real Pakistani homes, not just a showroom.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-6 text-base"
            nativeButton={false}
            render={
              <a
                href={buildWhatsAppUrl("Hi, I'd like to request a free tile sample.")}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            Get a Sample
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-6 text-base"
            nativeButton={false}
            render={<Link to="/downloads" />}
          >
            Download Catalog
          </Button>
        </div>
      </div>
    </section>
  )
}
