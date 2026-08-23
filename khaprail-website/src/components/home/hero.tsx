import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import { HeroTile } from "@/components/home/hero-tile"

export function Hero() {
  return (
    <section className="border-b border-border bg-secondary/40">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Est. 1982 · Lahore, Pakistan
          </span>
          <h1 className="max-w-2xl font-heading text-5xl font-semibold leading-[1.1] sm:text-6xl lg:text-7xl">
            Clay Roof &amp; Terracotta Tiles, Shaped in Lahore Since 1982
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
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

        <HeroTile className="mx-auto aspect-square w-full max-w-xs sm:max-w-sm lg:mx-0 lg:max-w-md" />
      </div>
    </section>
  )
}
