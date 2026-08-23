import { Hero } from "@/components/home/hero"
import { CollectionsShowcase } from "@/components/home/collections-showcase"
import { CatalogHighlights } from "@/components/home/catalog-highlights"
import { VideosSection } from "@/components/home/videos-section"
import { Heritage } from "@/components/home/heritage"
import { DownloadCta } from "@/components/home/download-cta"
import { CtaBanner } from "@/components/shared/cta-banner"

export function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <CollectionsShowcase />
      <CatalogHighlights />
      <VideosSection />
      <Heritage />
      <DownloadCta />
      <CtaBanner />
    </main>
  )
}
