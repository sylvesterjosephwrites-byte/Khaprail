import { lazy, Suspense, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Gallery } from "@/components/pdp/gallery"
import { VariantSwatches } from "@/components/pdp/variant-swatches"
import { SpecBlock } from "@/components/pdp/spec-block"
import { ApplicationTags } from "@/components/pdp/application-tags"
import { SampleRequestDialog } from "@/components/pdp/sample-request-dialog"
import { ProductCard } from "@/components/products/product-card"
import { useProduct } from "@/hooks/use-product"
import { useRelatedProducts } from "@/hooks/use-related-products"
import type { ProductVariant } from "@/types/product"

// @react-pdf/renderer is large (fontkit, its own layout engine) — load it
// only when a PDP actually mounts, not as part of every route's bundle.
const DownloadSpecSheetButton = lazy(() =>
  import("@/components/shared/download-spec-sheet-button").then((m) => ({ default: m.DownloadSpecSheetButton }))
)

// /products/[slug] — product detail page (05-PDP-SPEC.md).
export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { product, isLoading, error } = useProduct(slug)
  const [searchParams, setSearchParams] = useSearchParams()
  const [manualImageUrl, setManualImageUrl] = useState<string | null>(null)

  const relatedProducts = useRelatedProducts(product?.collection_id ?? null, product?.id ?? "")

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <h1 className="font-heading text-2xl">Product not found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn't find that product. Browse the full catalog instead.
        </p>
        <Button className="mt-4" nativeButton={false} render={<Link to="/products" />}>
          View All Products
        </Button>
      </main>
    )
  }

  const activeVariant = product.product_variants.find((v) => v.color_name === searchParams.get("color")) ?? null
  const baseHeroUrl = product.cover_image_url ?? product.product_images[0]?.image_url ?? null
  const displayedImageUrl = manualImageUrl ?? activeVariant?.hero_image_url ?? baseHeroUrl

  const thumbnails = [
    ...(product.cover_image_url ? [{ id: "cover", url: product.cover_image_url }] : []),
    ...product.product_images.map((img) => ({ id: img.id, url: img.image_url })),
  ]

  function handleVariantSelect(variant: ProductVariant) {
    setManualImageUrl(null)
    const next = new URLSearchParams(searchParams)
    next.set("color", variant.color_name)
    setSearchParams(next, { replace: true })
  }

  return (
    <main className="flex-1">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <Gallery
          heroImageUrl={displayedImageUrl}
          thumbnails={thumbnails}
          selectedUrl={manualImageUrl}
          onSelect={(url) => setManualImageUrl(url)}
        />

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-heading text-3xl">{product.name}</h1>
            {product.description && <p className="mt-3 text-muted-foreground">{product.description}</p>}
          </div>

          <VariantSwatches
            variants={product.product_variants}
            activeVariantId={activeVariant?.id ?? null}
            onSelect={handleVariantSelect}
          />

          <SpecBlock product={product} />

          <ApplicationTags attributes={product.product_attributes} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <SampleRequestDialog productId={product.id} productName={product.name} />
            <Suspense
              fallback={
                <Button size="lg" variant="outline" className="h-12 px-6 text-base" disabled>
                  Download Spec Sheet
                </Button>
              }
            >
              <DownloadSpecSheetButton product={product} />
            </Suspense>
          </div>
        </div>
      </div>

      {relatedProducts.products.length > 0 && (
        <div className="mx-auto w-full max-w-6xl border-t border-border px-4 py-16 sm:px-6">
          <h2 className="mb-8 font-heading text-3xl font-semibold sm:text-4xl">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.products.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
