import { useEffect, useState, type FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ProductFormStudio } from "@/components/admin/ProductFormStudio"
import { useCategories } from "@/hooks/use-categories"
import { supabase } from "@/lib/supabase"
import { saveProduct, type ProductFormValues, type ImageDraft, type AttributeDraft } from "@/lib/products-admin"
import { flattenCategoryTree } from "@/lib/category-tree"
import { getErrorMessage } from "@/lib/utils"

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  slug: "",
  category_id: null,
  description: null,
  size: null,
  thickness: null,
  finish: null,
  country_of_origin: "Pakistan",
  cover_image_url: null,
  is_featured: false,
  is_new: false,
  brand: "Khaprail Tiles",
  merchant: null,
  sku: null,
  availability: null,
  manufacturer: "Khaprail Tiles",
  price: null,
}

interface FetchedProduct extends ProductFormValues {
  product_images: { image_url: string }[]
  product_attributes: { attribute_type: string; value: string }[]
}

// /admin/products/new and /admin/products/:id/edit
// Refactored from single-column stacked form to a 2-column studio
// workspace with flyout slug lock, drag-and-drop media, and AI sidebar.
export function AdminProductEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { categories, isLoading: categoriesLoading } = useCategories()
  const categoryRows = flattenCategoryTree(categories)

  const [values, setValues] = useState<ProductFormValues>(EMPTY_VALUES)
  const [images, setImages] = useState<ImageDraft[]>([])
  const [attributes, setAttributes] = useState<AttributeDraft[]>([])
  const [isLoadingProduct, setIsLoadingProduct] = useState(!!id)
  const isLoading = isLoadingProduct || categoriesLoading
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
        `name, slug, category_id, description, size, thickness, finish,
         country_of_origin, cover_image_url, is_featured, is_new,
         brand, merchant, sku, availability, manufacturer, price,
         product_images ( image_url ),
         product_attributes ( attribute_type, value )`
      )
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const fetched = data as unknown as FetchedProduct
          const { product_images, product_attributes, ...formValues } = fetched
          setValues({ ...formValues, is_new: formValues.is_new ?? false })
          setImages(product_images.map((img) => ({ image_url: img.image_url })))
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
      const savedId = await saveProduct(values, images, attributes, id ?? null)
      navigate(`/admin/products/${savedId}/edit`)
    } catch (err) {
      setSaveError(getErrorMessage(err, "Failed to save product"))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ProductFormStudio
      isEditing={!!id}
      values={values}
      images={images}
      attributes={attributes}
      categories={categories}
      categoryRows={categoryRows}
      isSaving={isSaving}
      isLoading={isLoading}
      saveError={saveError}
      onFieldChange={updateField}
      onImagesChange={setImages}
      onAttributesChange={setAttributes}
      onSubmit={handleSubmit}
      onSlugChange={(slug) => updateField("slug", slug)}
    />
  )
}
