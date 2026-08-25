import type { ProductDetail } from "@/types/product"

interface SpecBlockProps {
  product: ProductDetail
}

// Brand / Merchant / Category / Availability / SKU / Manufacturer / Size /
// Thickness / Finish / Country of Origin (05-PDP-SPEC.md) — a simple table,
// only showing fields that are actually set rather than fabricating
// placeholders (no "In Stock Scarce"-style urgency labels either).
export function SpecBlock({ product }: SpecBlockProps) {
  const rows: [string, string | null][] = [
    ["Brand", product.brand],
    ["Merchant", product.merchant],
    ["Category", product.category_name],
    ["Availability", product.availability],
    ["SKU", product.sku],
    ["Manufacturer", product.manufacturer],
    ["Size", product.size],
    ["Thickness", product.thickness],
    ["Finish", product.finish],
    ["Country of Origin", product.country_of_origin],
  ]
  const visibleRows = rows.filter(([, value]) => !!value)

  if (visibleRows.length === 0) return null

  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {visibleRows.map(([label, value]) => (
          <tr key={label} className="border-b border-border last:border-b-0">
            <th scope="row" className="py-2 pr-4 text-left font-medium text-muted-foreground">
              {label}
            </th>
            <td className="py-2 text-foreground">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
