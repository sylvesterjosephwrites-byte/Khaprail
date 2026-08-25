import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { useCategories } from "@/hooks/use-categories"
import { deleteCategory } from "@/lib/categories-admin"
import { flattenCategoryTree } from "@/lib/category-tree"
import { cn } from "@/lib/utils"

// /admin/categories — CRUD list (07-ADMIN-DASHBOARD-SPEC.md), indented by
// depth (12-CATEGORY-TAXONOMY.md: up to 3 levels).
export function AdminCategoriesList() {
  const { categories, isLoading, error } = useCategories()
  const rows = flattenCategoryTree(categories)

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl">Categories</h1>
        <Button nativeButton={false} render={<Link to="/admin/categories/new" />}>
          New Category
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
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {rows.map(({ category, depth }) => (
            <div key={category.id} className="flex items-center justify-between gap-4 py-3">
              <Link
                to={`/admin/categories/${category.id}/edit`}
                className="flex-1 hover:underline"
                style={{ paddingLeft: `${depth * 1.5}rem` }}
              >
                <p className={cn("font-medium text-foreground", depth > 0 && "text-sm")}>{category.name}</p>
                <p className="text-sm text-muted-foreground">/{category.slug}</p>
              </Link>
              <ConfirmDeleteDialog
                itemLabel={category.name}
                onConfirm={() => deleteCategory(category.id).then(() => window.location.reload())}
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
