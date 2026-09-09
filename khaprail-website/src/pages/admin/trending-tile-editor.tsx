import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"
import { saveTrendingTile, type TrendingTileFormValues } from "@/lib/trending-tiles-admin"
import { getErrorMessage } from "@/lib/utils"
import { TRENDING_TILE_GRID_POSITIONS, type TrendingTile, type TrendingTileGridPosition } from "@/types/trending-tile"

const POSITION_LABELS: Record<TrendingTileGridPosition, string> = {
  large: "Large (left)",
  small_top_left: "Small (top-left)",
  small_top_right: "Small (top-right)",
  wide_bottom: "Wide (bottom)",
}

const EMPTY_VALUES: TrendingTileFormValues = {
  grid_position: "large",
  image_url: "",
  image_alt_text: "",
  show_new_badge: true,
  title: "",
  subtitle: "",
  link_url: "",
  is_active: true,
}

// /admin/trending-tiles/new and /admin/trending-tiles/:id/edit. Image
// upload is a plain Storage URL field — same pattern as every other image
// field in this admin — the file itself is uploaded to Supabase Storage
// separately, then the URL pasted in here.
export function AdminTrendingTileEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [values, setValues] = useState<TrendingTileFormValues>(EMPTY_VALUES)
  const [isLoading, setIsLoading] = useState(!!id)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !supabase) {
      setIsLoading(false)
      return
    }
    supabase
      .from("trending_tiles")
      .select(
        "id, grid_position, image_url, image_alt_text, show_new_badge, title, subtitle, link_url, is_active, created_at, updated_at"
      )
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...formValues } = data as TrendingTile
          setValues(formValues)
        }
        setIsLoading(false)
      })
  }, [id])

  function updateField<K extends keyof TrendingTileFormValues>(key: K, value: TrendingTileFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    setSaveError(null)
    try {
      await saveTrendingTile(values, id ?? null)
      navigate("/admin/trending-tiles")
    } catch (err) {
      setSaveError(getErrorMessage(err, "Failed to save trending tile"))
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
        <h1 className="font-heading text-3xl">{id ? "Edit Trending Tile" : "New Trending Tile"}</h1>
        <Link to="/admin/trending-tiles" className="text-sm text-muted-foreground hover:underline">
          Back to all trending tiles
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Grid Position</label>
          <Select
            value={values.grid_position}
            onValueChange={(v) => v && updateField("grid_position", v as TrendingTileGridPosition)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{(value: TrendingTileGridPosition) => POSITION_LABELS[value]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TRENDING_TILE_GRID_POSITIONS.map((position) => (
                <SelectItem key={position} value={position}>
                  {POSITION_LABELS[position]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Image URL</label>
          <Input
            required
            value={values.image_url}
            onChange={(e) => updateField("image_url", e.target.value)}
            placeholder="https://.../trending-tiles/rooftop.jpg"
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
          <label className="text-sm font-medium">Title</label>
          <Input
            required
            value={values.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Rooftop Restorations"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Subtitle</label>
          <Textarea
            required
            rows={2}
            value={values.subtitle}
            onChange={(e) => updateField("subtitle", e.target.value)}
            placeholder="Everyday durability for real Pakistani homes."
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
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={values.show_new_badge}
            onCheckedChange={(checked) => updateField("show_new_badge", checked === true)}
          />
          Show "NEW" badge on this tile
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={values.is_active}
            onCheckedChange={(checked) => updateField("is_active", checked === true)}
          />
          Active (shown in the homepage "Trending in Tiles" section)
        </label>

        {saveError && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {saveError}
          </p>
        )}

        <Button type="submit" className="w-fit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Trending Tile"}
        </Button>
      </form>
    </main>
  )
}
