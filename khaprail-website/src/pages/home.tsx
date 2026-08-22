import { Hero } from "@/components/home/hero"
import { CollectionsShowcase } from "@/components/home/collections-showcase"
import { CatalogHighlights } from "@/components/home/catalog-highlights"
import { Heritage } from "@/components/home/heritage"
import { CtaBanner } from "@/components/shared/cta-banner"

export function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <CollectionsShowcase />
      <CatalogHighlights />
      <Heritage />
      <CtaBanner />
    </main>
  )
}
