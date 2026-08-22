import type { ProductDetail } from "@/types/product"

interface SpecBlockProps {
  product: ProductDetail
}

// Size / Thickness / Finish / Shade Variation / Country of Origin
// (05-PDP-SPEC.md) — a simple table, only showing fields that are actually
// set rather than fabricating placeholders.
export function SpecBlock({ product }: SpecBlockProps) {
  const rows: [string, string | null][] = [
    ["Size", product.size],
    ["Thickness", product.thickness],
    ["Finish", product.finish],
    ["Shade Variation", product.shade_variation],
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
