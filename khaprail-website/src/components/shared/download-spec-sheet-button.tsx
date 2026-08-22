import { PDFDownloadLink } from "@react-pdf/renderer"
import type { VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"
import { SpecSheetDocument, type SpecSheetProduct } from "@/lib/pdf/spec-sheet-document"

interface DownloadSpecSheetButtonProps {
  product: SpecSheetProduct
  size?: VariantProps<typeof buttonVariants>["size"]
  className?: string
}

// "Download Spec Sheet" (05-PDP-SPEC.md) — branded PDF generated client-side
// via @react-pdf/renderer. Styled with buttonVariants directly (rather than
// nesting a <button> inside PDFDownloadLink's <a>) to keep the markup valid.
// Reused by the PDP (large CTA) and the Downloads page (per-row button).
export function DownloadSpecSheetButton({
  product,
  size = "lg",
  className = "h-12 px-6 text-base",
}: DownloadSpecSheetButtonProps) {
  return (
    <PDFDownloadLink
      document={<SpecSheetDocument product={product} />}
      fileName={`${product.slug}-spec-sheet.pdf`}
      className={buttonVariants({ size, variant: "outline", className })}
    >
      {({ loading }) => (loading ? "Preparing..." : "Download Spec Sheet")}
    </PDFDownloadLink>
  )
}
