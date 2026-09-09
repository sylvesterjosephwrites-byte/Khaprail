import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"
import { saveLifestyleTile, type LifestyleTileFormValues } from "@/lib/lifestyle-tiles-admin"
import { getErrorMessage } from "@/lib/utils"
import type { LifestyleTile } from "@/types/lifestyle-tile"

const EMPTY_VALUES: LifestyleTileFormValues = {
  image_url: "",
  image_alt_text: "",
  caption: "",
  link_url: "",
  sort_order: 0,
  is_active: true,
}

// /admin/lifestyle-tiles/new and /admin/lifestyle-tiles/:id/edit. Image
// upload is a plain Storage URL field — same pattern as every other
// image field in this admin (categories/products) — the file itself is
// uploaded to Supabase Storage separately, then the URL pasted in here.
export function AdminLifestyleTileEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [values, setValues] = useState<LifestyleTileFormValues>(EMPTY_VALUES)
  const [isLoading, setIsLoading] = useState(!!id)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !supabase) {
      setIsLoading(false)
      return
    }
    supabase
      .from("lifestyle_tiles")
      .select("id, image_url, image_alt_text, caption, link_url, sort_order, is_active, created_at, updated_at")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...formValues } = data as LifestyleTile
          setValues(formValues)
        }
        setIsLoading(false)
      })
  }, [id])

  function updateField<K extends keyof LifestyleTileFormValues>(key: K, value: LifestyleTileFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    setSaveError(null)
    try {
      await saveLifestyleTile(values, id ?? null)
      navigate("/admin/lifestyle-tiles")
    } catch (err) {
      setSaveError(getErrorMessage(err, "Failed to save lifestyle tile"))
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
        <h1 className="font-heading text-3xl">{id ? "Edit Lifestyle Tile" : "New Lifestyle Tile"}</h1>
        <Link to="/admin/lifestyle-tiles" className="text-sm text-muted-foreground hover:underline">
          Back to all tiles
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Image URL</label>
          <Input
            required
            value={values.image_url}
            onChange={(e) => updateField("image_url", e.target.value)}
            placeholder="https://.../lifestyle-tiles/rooftop.jpg"
          />
          <p className="text-xs text-muted-foreground">
            Upload the photo to Supabase Storage first, then paste its public URL here.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Image Alt Text</label>
          <Input
            required
            value={values.image_alt_text}
            onChange={(e) => updateField("image_alt_text", e.target.value)}
            placeholder="Terracotta roof tiles on a Lahore rooftop"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Caption</label>
          <Input
            required
            value={values.caption}
            onChange={(e) => updateField("caption", e.target.value)}
            placeholder="Rooftop & Exterior"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Link URL</label>
          <Input
            required
            value={values.link_url}
            onChange={(e) => updateField("link_url", e.target.value)}
            placeholder="/categories/roof-tiles"
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
            checked={values.is_active}
            onCheckedChange={(checked) => updateField("is_active", checked === true)}
          />
          Active (shown in the homepage "Tiles for Every Space" section)
        </label>

        {saveError && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {saveError}
          </p>
        )}

        <Button type="submit" className="w-fit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Tile"}
        </Button>
      </form>
    </main>
  )
}
