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
import { useCollections } from "@/hooks/use-collections"
import { supabase } from "@/lib/supabase"
import {
  saveProduct,
  type ProductFormValues,
  type ImageDraft,
  type VariantDraft,
  type AttributeDraft,
} from "@/lib/products-admin"
import { getErrorMessage, slugify } from "@/lib/utils"

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  slug: "",
  collection_id: null,
  description: null,
  size: null,
  thickness: null,
  finish: null,
  shade_variation: null,
  country_of_origin: "Pakistan",
  cover_image_url: null,
  is_featured: false,
}

interface FetchedProduct extends ProductFormValues {
  product_images: { image_url: string }[]
  product_variants: { color_name: string; swatch_image_url: string | null; hero_image_url: string | null }[]
  product_attributes: { attribute_type: string; value: string }[]
}

// /admin/products/new and /admin/products/:id/edit
// (07-ADMIN-DASHBOARD-SPEC.md: "CRUD, variants (color swatches), images,
// spec-sheet fields, collection assignment").
export function AdminProductEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { collections, isLoading: collectionsLoading } = useCollections()

  const [values, setValues] = useState<ProductFormValues>(EMPTY_VALUES)
  const [images, setImages] = useState<ImageDraft[]>([])
  const [variants, setVariants] = useState<VariantDraft[]>([])
  const [attributes, setAttributes] = useState<AttributeDraft[]>([])
  const [isLoadingProduct, setIsLoadingProduct] = useState(!!id)
  const isLoading = isLoadingProduct || collectionsLoading
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !supabase) {
      setIsLoadingProduct(false)
      return
    }
    supabase
      .from("products")
      .select(
        `name, slug, collection_id, description, size, thickness, finish, shade_variation,
         country_of_origin, cover_image_url, is_featured,
         product_images ( image_url ),
         product_variants ( color_name, swatch_image_url, hero_image_url ),
         product_attributes ( attribute_type, value )`
      )
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const fetched = data as unknown as FetchedProduct
          const { product_images, product_variants, product_attributes, ...formValues } = fetched
          setValues(formValues)
          setImages(product_images.map((img) => ({ image_url: img.image_url })))
          setVariants(
            product_variants.map((v) => ({
              color_name: v.color_name,
              swatch_image_url: v.swatch_image_url ?? "",
              hero_image_url: v.hero_image_url ?? "",
            }))
          )
          setAttributes(product_attributes)
        }
        setIsLoadingProduct(false)
      })
  }, [id])

  function updateField<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    setSaveError(null)
    try {
      const savedId = await saveProduct(values, images, variants, attributes, id ?? null)
      navigate(`/admin/products/${savedId}/edit`)
    } catch (err) {
      setSaveError(getErrorMessage(err, "Failed to save product"))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
        <Skeleton className="h-96 w-full" />
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl">{id ? "Edit Product" : "New Product"}</h1>
        <Link to="/admin/products" className="text-sm text-muted-foreground hover:underline">
          Back to all products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <Field label="Name">
            <Input
              required
              value={values.name}
              onChange={(e) => updateField("name", e.target.value)}
              onBlur={() => !values.slug && values.name && updateField("slug", slugify(values.name))}
            />
          </Field>
          <Field label="Slug">
            <Input required value={values.slug} onChange={(e) => updateField("slug", e.target.value)} />
          </Field>
          <Field label="Collection">
            <Select
              value={values.collection_id ?? ""}
              onValueChange={(v) => updateField("collection_id", v || null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a collection">
                  {(value: string | null) => collections.find((c) => c.id === value)?.name ?? "Select a collection"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {collections.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Cover Image URL">
            <Input
              value={values.cover_image_url ?? ""}
              onChange={(e) => updateField("cover_image_url", e.target.value || null)}
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={values.description ?? ""}
              onChange={(e) => updateField("description", e.target.value || null)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Size">
              <Input value={values.size ?? ""} onChange={(e) => updateField("size", e.target.value || null)} />
            </Field>
            <Field label="Thickness">
              <Input
                value={values.thickness ?? ""}
                onChange={(e) => updateField("thickness", e.target.value || null)}
              />
            </Field>
            <Field label="Finish">
              <Input value={values.finish ?? ""} onChange={(e) => updateField("finish", e.target.value || null)} />
            </Field>
            <Field label="Shade Variation">
              <Input
                value={values.shade_variation ?? ""}
                onChange={(e) => updateField("shade_variation", e.target.value || null)}
              />
            </Field>
          </div>
          <Field label="Country of Origin">
            <Input
              value={values.country_of_origin}
              onChange={(e) => updateField("country_of_origin", e.target.value)}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={values.is_featured}
              onCheckedChange={(checked) => updateField("is_featured", checked === true)}
            />
            Featured
          </label>
        </section>

        <ListSection
          title="Images"
          items={images}
          onChange={setImages}
          empty={{ image_url: "" }}
          renderRow={(item, update) => (
            <Input
              placeholder="Image URL"
              value={item.image_url}
              onChange={(e) => update({ ...item, image_url: e.target.value })}
            />
          )}
        />

        <ListSection
          title="Additional Colors (Variants)"
          items={variants}
          onChange={setVariants}
          empty={{ color_name: "", swatch_image_url: "", hero_image_url: "" }}
          renderRow={(item, update) => (
            <div className="grid flex-1 grid-cols-3 gap-2">
              <Input
                placeholder="Color name"
                value={item.color_name}
                onChange={(e) => update({ ...item, color_name: e.target.value })}
              />
              <Input
                placeholder="Swatch image URL"
                value={item.swatch_image_url}
                onChange={(e) => update({ ...item, swatch_image_url: e.target.value })}
              />
              <Input
                placeholder="Hero image URL"
                value={item.hero_image_url}
                onChange={(e) => update({ ...item, hero_image_url: e.target.value })}
              />
            </div>
          )}
        />

        <ListSection
          title="Attributes (filters + application tags)"
          items={attributes}
          onChange={setAttributes}
          empty={{ attribute_type: "", value: "" }}
          renderRow={(item, update) => (
            <div className="grid flex-1 grid-cols-2 gap-2">
              <Input
                placeholder="Type (e.g. color, shape, application)"
                value={item.attribute_type}
                onChange={(e) => update({ ...item, attribute_type: e.target.value })}
              />
              <Input
                placeholder="Value (e.g. Terracotta Red, Roof)"
                value={item.value}
                onChange={(e) => update({ ...item, value: e.target.value })}
              />
            </div>
          )}
        />

        {saveError && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {saveError}
          </p>
        )}

        <Button type="submit" size="lg" className="w-fit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Product"}
        </Button>
      </form>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}

interface ListSectionProps<T> {
  title: string
  items: T[]
  onChange: (items: T[]) => void
  empty: T
  renderRow: (item: T, update: (next: T) => void) => React.ReactNode
}

function ListSection<T>({ title, items, onChange, empty, renderRow }: ListSectionProps<T>) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">{title}</h2>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {renderRow(item, (next) => onChange(items.map((it, i) => (i === index ? next : it))))}
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="shrink-0 text-sm text-muted-foreground hover:text-destructive"
          >
            Remove
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" className="w-fit" onClick={() => onChange([...items, empty])}>
        Add
      </Button>
    </section>
  )
}
