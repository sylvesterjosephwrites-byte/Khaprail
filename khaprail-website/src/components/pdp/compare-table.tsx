import type { ComparableProduct } from "@/hooks/use-comparable-products"
import type { ProductDetail } from "@/types/product"

interface CompareTableProps {
  product: ProductDetail
  comparableProducts: ComparableProduct[]
}

const ROWS: [string, (p: { price: number | null; brand: string | null; merchant: string | null; availability: string | null }) => string | null][] = [
  ["Price", (p) => (p.price != null ? `PKR ${p.price.toLocaleString()}` : null)],
  ["Brand", (p) => p.brand],
  ["Merchant", (p) => p.merchant],
  ["Availability", (p) => p.availability],
]

// "Compare With Similar Items" (05-PDP-SPEC.md) — only renders once there's
// enough real data to be useful: the current product needs a real `price`,
// and at least one other same-category product needs one too. An empty or
// single-column table looks broken, not helpful, so this stays hidden until
// Sylvester fills in price/brand/merchant/availability for enough products.
export function CompareTable({ product, comparableProducts }: CompareTableProps) {
  if (product.price == null || comparableProducts.length === 0) return null

  const columns = [
    { id: product.id, name: product.name, price: product.price, brand: product.brand, merchant: product.merchant, availability: product.availability },
    ...comparableProducts,
  ]

  return (
    <div>
      <h2 className="mb-4 font-heading text-2xl font-semibold sm:text-3xl">Compare With Similar Items</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-32 py-2 text-left" />
              {columns.map((col) => (
                <th key={col.id} className="border-b border-border py-2 px-3 text-left font-medium text-foreground">
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, getValue]) => (
              <tr key={label} className="border-b border-border last:border-b-0">
                <th scope="row" className="py-2 px-3 text-left font-medium text-muted-foreground">
                  {label}
                </th>
                {columns.map((col) => (
                  <td key={col.id} className="py-2 px-3 text-foreground">
                    {getValue(col) ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
