import { PDFDownloadLink } from "@react-pdf/renderer"
import { buttonVariants } from "@/components/ui/button"
import { CatalogDocument, type CatalogCollection } from "@/lib/pdf/catalog-document"

interface DownloadCatalogButtonProps {
  collections: CatalogCollection[]
}

export function DownloadCatalogButton({ collections }: DownloadCatalogButtonProps) {
  return (
    <PDFDownloadLink
      document={<CatalogDocument collections={collections} />}
      fileName="khaprail-tiles-catalog.pdf"
      className={buttonVariants({ size: "lg", className: "h-14 px-7 text-lg" })}
    >
      {({ loading }) => (loading ? "Preparing..." : "Download Full Catalog")}
    </PDFDownloadLink>
  )
}
