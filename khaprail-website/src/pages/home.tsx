import { Hero } from "@/components/home/hero"
import { FeaturedCategoriesRow } from "@/components/home/featured-categories-row"
import { FeatureRow } from "@/components/home/feature-row"
import { BestSellersSection } from "@/components/home/best-sellers-section"
import { Heritage } from "@/components/home/heritage"
import { TrendingCategoriesGrid } from "@/components/home/trending-categories-grid"
import { CategoryShowcase } from "@/components/home/category-showcase"
import { NewArrivalsSection } from "@/components/home/new-arrivals-section"
import { VideosSection } from "@/components/home/videos-section"
import { DownloadCta } from "@/components/home/download-cta"

// Section order per 10-HOMEPAGE-SPEC.md: Hero -> Featured Categories ->
// 3-image feature row -> Best Sellers -> Heritage -> Trending/Categories
// grid -> New Arrivals -> Footer (rendered by SiteLayout, not here).
// Videos/Download CTA aren't in that target order but are kept (moved to
// the end) rather than deleted — both are real, already-built,
// honest-data-backed sections; see 00-PROGRESS.md for this adaptation.
// Category Showcase (warm-panel 3-photo section, distinct from the earlier
// 3-image feature row) was added after Trending Categories per its own
// request — see 00-PROGRESS.md.
export function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <FeaturedCategoriesRow />
      <FeatureRow />
      <BestSellersSection />
      <Heritage />
      <TrendingCategoriesGrid />
      <CategoryShowcase />
      <NewArrivalsSection />
      <VideosSection />
      <DownloadCta />
    </main>
  )
}
