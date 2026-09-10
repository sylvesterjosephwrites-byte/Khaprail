import { useCallback, useEffect, useState } from "react"
import { SparklesIcon, RefreshCwIcon, CheckIcon } from "lucide-react"
import { cn, slugify } from "@/lib/utils"

// ---------------------------------------------------------------------------
// useAiSuggestions — simulated/connectable hook
// ---------------------------------------------------------------------------

interface Suggestion {
  slug: string
  label: string
  reason: string
}

/**
 * Generates 3-4 SEO-optimised slug alternatives from the product title and
 * category. Currently a deterministic local generator wrapped in a small
 * artificial delay so the UI shows its loading skeleton — swap the body for
 * a `fetch("/api/ai-slug", ...)` call when wiring to a real model.
 */
function useAiSuggestions(title: string, category: string | undefined) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [seed, setSeed] = useState(0)

  const generate = useCallback(() => {
    if (!title.trim()) {
      setSuggestions([])
      return
    }
    setIsGenerating(true)

    // Simulated async — replace with real API call
    const timer = setTimeout(() => {
      const base = slugify(title)
      const catSlug = category ? slugify(category) : ""

      const pool: Suggestion[] = [
        { slug: base, label: base, reason: "Direct from title" },
      ]
      if (catSlug) {
        pool.push({
          slug: `${catSlug}-${base}`,
          label: `${catSlug}-${base}`,
          reason: "Category-prefixed for SEO",
        })
      }
      // Localised keyword variant
      pool.push({
        slug: `${base}-pakistan`,
        label: `${base}-pakistan`,
        reason: "Geo-targeted keyword",
      })
      // Finish / material variant (seed-shifted on regenerate)
      const suffixes = ["handcrafted", "artisan", "premium", "terracotta", "clay"]
      const suffix = suffixes[(seed + title.length) % suffixes.length]
      pool.push({
        slug: `${base}-${suffix}`,
        label: `${base}-${suffix}`,
        reason: "Descriptive variant",
      })

      setSuggestions(pool.slice(0, 4))
      setIsGenerating(false)
    }, 450)

    return () => clearTimeout(timer)
  }, [title, category, seed])

  useEffect(() => {
    const cleanup = generate()
    return cleanup
  }, [generate])

  const regenerate = useCallback(() => setSeed((s) => s + 1), [])

  return { suggestions, isGenerating, regenerate }
}

// ---------------------------------------------------------------------------
// AiSlugRecommendations panel
// ---------------------------------------------------------------------------

interface AiSlugRecommendationsProps {
  title: string
  category: string | undefined
  onApply: (slug: string) => void
  activeSlug: string
}

export function AiSlugRecommendations({
  title,
  category,
  onApply,
  activeSlug,
}: AiSlugRecommendationsProps) {
  const { suggestions, isGenerating, regenerate } = useAiSuggestions(title, category)

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#EBE3D8] bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-[#C25A2B]" />
          <h3 className="text-sm font-semibold text-foreground">AI Slug Suggestions</h3>
        </div>
        <button
          type="button"
          onClick={regenerate}
          disabled={isGenerating || !title.trim()}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
            "text-muted-foreground hover:bg-[#FDFBF7] hover:text-foreground",
            "disabled:opacity-40",
          )}
        >
          <RefreshCwIcon
            className={cn("size-3.5", isGenerating && "animate-spin")}
          />
          Regenerate
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        SEO-optimised slug alternatives derived from the title and category.
        Click to apply instantly.
      </p>

      {/* Suggestion cards */}
      {!title.trim() && (
        <p className="py-4 text-center text-xs text-muted-foreground/60">
          Start typing a product name to see suggestions
        </p>
      )}

      {isGenerating && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-lg border border-[#EBE3D8] bg-[#FDFBF7]"
            />
          ))}
        </div>
      )}

      {!isGenerating && suggestions.length > 0 && (
        <div className="flex flex-col gap-2">
          {suggestions.map((s) => {
            const isActive = s.slug === activeSlug
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => onApply(s.slug)}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-all",
                  isActive
                    ? "border-[#C25A2B] bg-[#C25A2B]/5"
                    : "border-[#EBE3D8] bg-[#FDFBF7] hover:border-[#C25A2B]/40 hover:bg-white",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate font-mono text-sm",
                      isActive ? "font-semibold text-[#C25A2B]" : "text-foreground",
                    )}
                  >
                    {s.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{s.reason}</p>
                </div>
                {isActive ? (
                  <CheckIcon className="size-4 shrink-0 text-[#C25A2B]" />
                ) : (
                  <span className="shrink-0 rounded-md border border-[#DDD4C7] bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    Apply
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
