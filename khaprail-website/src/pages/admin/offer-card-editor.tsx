import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"
import { saveOfferCard, type OfferCardFormValues } from "@/lib/offer-cards-admin"
import { getErrorMessage } from "@/lib/utils"
import type { OfferCard } from "@/types/offer-card"

const EMPTY_VALUES: OfferCardFormValues = {
  badge_value: "",
  badge_suffix: "",
  label: "",
  link_label: "Shop now",
  link_url: "",
  image_url: "",
  image_alt_text: "",
  sort_order: 0,
  is_active: true,
}

// /admin/offer-cards/new and /admin/offer-cards/:id/edit. Image upload is a
// plain Storage URL field — same pattern as every other image field in
// this admin (categories/products/lifestyle tiles) — the file itself is
// uploaded to Supabase Storage separately, then the URL pasted in here.
export function AdminOfferCardEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [values, setValues] = useState<OfferCardFormValues>(EMPTY_VALUES)
  const [isLoading, setIsLoading] = useState(!!id)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !supabase) {
      setIsLoading(false)
      return
    }
    supabase
      .from("offer_cards")
      .select(
        "id, badge_value, badge_suffix, label, link_label, link_url, image_url, image_alt_text, sort_order, is_active, created_at, updated_at"
      )
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...formValues } = data as OfferCard
          setValues(formValues)
        }
        setIsLoading(false)
      })
  }, [id])

  function updateField<K extends keyof OfferCardFormValues>(key: K, value: OfferCardFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    setSaveError(null)
    try {
      await saveOfferCard({ ...values, badge_suffix: values.badge_suffix?.trim() || null }, id ?? null)
      navigate("/admin/offer-cards")
    } catch (err) {
      setSaveError(getErrorMessage(err, "Failed to save offer card"))
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
        <h1 className="font-heading text-3xl">{id ? "Edit Offer Card" : "New Offer Card"}</h1>
        <Link to="/admin/offer-cards" className="text-sm text-muted-foreground hover:underline">
          Back to all offer cards
        </Link>
      </div>
      <p className="mb-6 rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">
        No live percentage-off promotion is confirmed yet — keep the badge/label a real, always-true
        capability (free samples, bulk pricing, delivery terms, new-customer welcome) rather than an
        unconfirmed number.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Badge Value</label>
            <Input
              required
              value={values.badge_value}
              onChange={(e) => updateField("badge_value", e.target.value)}
              placeholder="Free"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Badge Suffix (optional)</label>
            <Input
              value={values.badge_suffix ?? ""}
              onChange={(e) => updateField("badge_suffix", e.target.value)}
              placeholder="Sample"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Label</label>
          <Input
            required
            value={values.label}
            onChange={(e) => updateField("label", e.target.value)}
            placeholder="Try Before You Buy"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Link Label</label>
            <Input
              required
              value={values.link_label}
              onChange={(e) => updateField("link_label", e.target.value)}
              placeholder="Shop now"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Link URL</label>
            <Input
              required
              value={values.link_url}
              onChange={(e) => updateField("link_url", e.target.value)}
              placeholder="/products or a full https:// URL"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Image URL</label>
          <Input
            required
            value={values.image_url}
            onChange={(e) => updateField("image_url", e.target.value)}
            placeholder="https://.../offer-cards/sample.jpg"
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
            placeholder="Khaprail clay roof tiles, available as a free sample"
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
          Active (shown in the homepage "Offers, Available Now" section)
        </label>

        {saveError && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {saveError}
          </p>
        )}

        <Button type="submit" className="w-fit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Offer Card"}
        </Button>
      </form>
    </main>
  )
}
