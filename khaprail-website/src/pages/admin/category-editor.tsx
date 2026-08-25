import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategories } from "@/hooks/use-categories"
import { supabase } from "@/lib/supabase"
import { saveCategory, type CategoryFormValues } from "@/lib/categories-admin"
import { flattenCategoryTree } from "@/lib/category-tree"
import { getErrorMessage, slugify } from "@/lib/utils"
import type { Category } from "@/types/category"

const NO_PARENT = "__none__"

const EMPTY_VALUES: CategoryFormValues = {
  name: "",
  slug: "",
  parent_id: null,
  cover_image_url: null,
  sort_order: 0,
}

// /admin/categories/new and /admin/categories/:id/edit.
export function AdminCategoryEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { categories, isLoading: categoriesLoading } = useCategories()
  const [values, setValues] = useState<CategoryFormValues>(EMPTY_VALUES)
  const [isLoadingCategory, setIsLoadingCategory] = useState(!!id)
  const isLoading = isLoadingCategory || categoriesLoading
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !supabase) {
      setIsLoadingCategory(false)
      return
    }
    supabase
      .from("categories")
      .select("id, name, slug, parent_id, cover_image_url, sort_order, created_at")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const { id: _id, created_at: _createdAt, ...formValues } = data as Category
          setValues(formValues)
        }
        setIsLoadingCategory(false)
      })
  }, [id])

  function updateField<K extends keyof CategoryFormValues>(key: K, value: CategoryFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    setSaveError(null)
    try {
      await saveCategory(values, id ?? null)
      navigate("/admin/categories")
    } catch (err) {
      setSaveError(getErrorMessage(err, "Failed to save category"))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6">
        <Skeleton className="h-64 w-full" />
      </main>
    )
  }

  const parentOptions = flattenCategoryTree(categories).filter((row) => row.category.id !== id)

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl">{id ? "Edit Category" : "New Category"}</h1>
        <Link to="/admin/categories" className="text-sm text-muted-foreground hover:underline">
          Back to all categories
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Name</label>
          <Input
            required
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            onBlur={() => !values.slug && values.name && updateField("slug", slugify(values.name))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Slug</label>
          <Input required value={values.slug} onChange={(e) => updateField("slug", e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Parent Category</label>
          <Select
            value={values.parent_id ?? NO_PARENT}
            onValueChange={(v) => updateField("parent_id", v === NO_PARENT ? null : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="None (top-level category)">
                {(value: string) =>
                  value === NO_PARENT ? "None (top-level category)" : categories.find((c) => c.id === value)?.name
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_PARENT}>None (top-level category)</SelectItem>
              {parentOptions.map(({ category, depth }) => (
                <SelectItem key={category.id} value={category.id}>
                  {"— ".repeat(depth)}
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Cover Image URL</label>
          <Input
            value={values.cover_image_url ?? ""}
            onChange={(e) => updateField("cover_image_url", e.target.value || null)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Sort Order</label>
          <Input
            type="number"
            value={values.sort_order}
            onChange={(e) => updateField("sort_order", Number(e.target.value))}
          />
        </div>

        {saveError && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {saveError}
          </p>
        )}

        <Button type="submit" className="w-fit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Category"}
        </Button>
      </form>
    </main>
  )
}
