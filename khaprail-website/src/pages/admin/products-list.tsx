import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { useAdminProducts } from "@/hooks/use-admin-products"
import { deleteProduct } from "@/lib/products-admin"

// /admin/products — CRUD list (07-ADMIN-DASHBOARD-SPEC.md).
export function AdminProductsList() {
  const { products, isLoading, error } = useAdminProducts()

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl">Products</h1>
        <Button nativeButton={false} render={<Link to="/admin/products/new" />}>
          New Product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-muted-foreground">No products yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between gap-4 py-3">
              <Link to={`/admin/products/${product.id}/edit`} className="flex-1 hover:underline">
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">/{product.slug}</p>
              </Link>
              <ConfirmDeleteDialog
                itemLabel={product.name}
                onConfirm={() => deleteProduct(product.id).then(() => window.location.reload())}
                trigger={
                  <button type="button" className="text-sm text-muted-foreground hover:text-destructive">
                    Delete
                  </button>
                }
              />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
