import { useCallback, useRef, useState } from "react"
import { UploadCloudIcon, Trash2Icon, PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Cover Image Dropzone
// ---------------------------------------------------------------------------

interface CoverImageDropzoneProps {
  value: string | null
  onChange: (url: string | null) => void
}

export function CoverImageDropzone({ value, onChange }: CoverImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0]
      if (!file?.type.startsWith("image/")) return
      onChange(URL.createObjectURL(file))
    },
    [onChange],
  )

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">Cover Image</label>
      <div
        className={cn(
          "relative flex aspect-[16/10] cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors",
          isDragging
            ? "border-[#C25A2B] bg-[#C25A2B]/5"
            : "border-[#DDD4C7] bg-[#FDFBF7] hover:border-[#C25A2B]/40",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        {value ? (
          <>
            <img src={value} alt="Cover preview" className="absolute inset-0 h-full w-full object-cover" />
            <button type="button" onClick={(e) => { e.stopPropagation(); onChange(null) }}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
              <Trash2Icon className="size-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UploadCloudIcon className="size-8" />
            <span className="text-sm">Drop image or click to upload</span>
            <span className="text-xs opacity-60">JPG, PNG, WebP</span>
          </div>
        )}
      </div>
      <input type="text" value={value?.startsWith("blob:") ? "" : (value ?? "")}
        onChange={(e) => onChange(e.target.value || null)}
        placeholder="...or paste Supabase Storage URL"
        className={cn(
          "h-8 w-full rounded-lg border px-3 text-xs font-mono transition-colors outline-none",
          "border-[#DDD4C7] bg-[#FDFBF7] text-foreground",
          "placeholder:text-muted-foreground/50",
          "focus:border-[#C25A2B] focus:ring-2 focus:ring-[#C25A2B]/20",
        )} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Multi-Image Gallery
// ---------------------------------------------------------------------------

export interface GalleryImage { url: string }

interface ImageGalleryProps {
  images: GalleryImage[]
  onChange: (images: GalleryImage[]) => void
}

export function ImageGallery({ images, onChange }: ImageGalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const next = Array.from(files).filter((f) => f.type.startsWith("image/")).map((f) => ({ url: URL.createObjectURL(f) }))
      if (next.length > 0) onChange([...images, ...next])
    },
    [images, onChange],
  )

  function removeAt(i: number) { onChange(images.filter((_, idx) => idx !== i)) }
  function moveAt(from: number, to: number) {
    if (to < 0 || to >= images.length) return
    const next = [...images]; const [m] = next.splice(from, 1); next.splice(to, 0, m); onChange(next)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">
        Gallery Images
        {images.length > 0 && <span className="ml-2 text-xs font-normal text-muted-foreground">({images.length})</span>}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, i) => (
          <div key={img.url + i} className="group relative aspect-square overflow-hidden rounded-lg border border-[#DDD4C7] bg-[#FDFBF7]">
            <img src={img.url} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
              {i > 0 && <button type="button" onClick={() => moveAt(i, i - 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-foreground" title="Move left">‹</button>}
              {i < images.length - 1 && <button type="button" onClick={() => moveAt(i, i + 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-foreground" title="Move right">›</button>}
              <button type="button" onClick={() => removeAt(i)} className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 text-white hover:bg-red-600" title="Remove">
                <Trash2Icon className="size-3.5" />
              </button>
            </div>
            <span className="absolute bottom-1 left-1 flex h-5 min-w-5 items-center justify-center rounded bg-black/60 px-1 text-[10px] font-medium text-white">{i + 1}</span>
          </div>
        ))}
        <div className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[#DDD4C7] bg-[#FDFBF7] text-muted-foreground transition-colors hover:border-[#C25A2B]/40 hover:text-[#C25A2B]"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          <PlusIcon className="size-6" />
          <span className="text-xs">Add</span>
        </div>
      </div>
    </div>
  )
}
