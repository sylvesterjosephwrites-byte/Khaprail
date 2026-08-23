import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"
import { saveCollection, type CollectionFormValues } from "@/lib/collections-admin"
import { getErrorMessage, slugify } from "@/lib/utils"
import type { Collection } from "@/types/collection"

const EMPTY_VALUES: CollectionFormValues = {
  name: "",
  slug: "",
  cover_image_url: null,
  sort_order: 0,
  is_secondary: false,
}

// /admin/collections/new and /admin/collections/:id/edit.
export function AdminCollectionEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [values, setValues] = useState<CollectionFormValues>(EMPTY_VALUES)
  const [isLoading, setIsLoading] = useState(!!id)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !supabase) {
      setIsLoading(false)
      return
    }
    supabase
      .from("collections")
      .select("id, name, slug, cover_image_url, sort_order, is_secondary")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const { id: _id, ...formValues } = data as Collection
          setValues(formValues)
        }
        setIsLoading(false)
      })
  }, [id])

  function updateField<K extends keyof CollectionFormValues>(key: K, value: CollectionFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    setSaveError(null)
    try {
      await saveCollection(values, id ?? null)
      navigate("/admin/collections")
    } catch (err) {
      setSaveError(getErrorMessage(err, "Failed to save collection"))
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

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl">{id ? "Edit Collection" : "New Collection"}</h1>
        <Link to="/admin/collections" className="text-sm text-muted-foreground hover:underline">
          Back to all collections
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
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={values.is_secondary}
            onCheckedChange={(checked) => updateField("is_secondary", checked === true)}
          />
          Secondary collection (shown in the smaller "Also from Khaprail" row)
        </label>

        {saveError && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {saveError}
          </p>
        )}

        <Button type="submit" className="w-fit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Collection"}
        </Button>
      </form>
    </main>
  )
}
