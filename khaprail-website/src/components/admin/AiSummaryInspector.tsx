import { useCallback, useState } from "react"
import {
  SparklesIcon,
  RefreshCwIcon,
  Wand2Icon,
  CopyIcon,
  CheckIcon,
  PencilIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  generateStaticSummary,
  type SummaryTone,
  type ProductAiContext,
} from "@/lib/ai-chat-client"

const TONE_OPTIONS: { value: SummaryTone; label: string; hint: string }[] = [
  { value: "architectural", label: "Architectural", hint: "Technical, material-focused" },
  { value: "commercial", label: "Commercial", hint: "Sales-driven, benefit-led" },
  { value: "minimal", label: "Minimal", hint: "Clean, understated" },
]

interface AiSummaryInspectorProps {
  productContext: ProductAiContext
  accessToken: string | null
  categoryName?: string
  onApply: (summary: string) => void
  currentDescription: string | null
}

export function AiSummaryInspector({
  productContext,
  accessToken,
  categoryName,
  onApply,
  currentDescription,
}: AiSummaryInspectorProps) {
  const [tone, setTone] = useState<SummaryTone>("architectural")
  const [generatedText, setGeneratedText] = useState<string | null>(null)
  const [editedText, setEditedText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const canGenerate = !!accessToken && !!productContext.name.trim()
  const activeText = editedText || generatedText || ""
  const hasChanged = !!activeText && activeText !== currentDescription

  const handleGenerate = useCallback(async () => {
    if (!accessToken) return
    setIsGenerating(true)
    setError(null)
    try {
      const result = await generateStaticSummary(
        productContext,
        tone,
        accessToken,
        categoryName,
      )
      setGeneratedText(result)
      setEditedText("")
      setCopied(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate summary")
    } finally {
      setIsGenerating(false)
    }
  }, [productContext, tone, accessToken, categoryName])

  const handleCopy = useCallback(async () => {
    if (!activeText) return
    await navigator.clipboard.writeText(activeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [activeText])

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#EBE3D8] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <SparklesIcon className="size-4 text-[#C25A2B]" />
        <h3 className="text-sm font-semibold text-foreground">AI Product Summary</h3>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Tone</span>
        <div className="flex gap-1.5">
          {TONE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTone(opt.value)}
              title={opt.hint}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                tone === opt.value
                  ? "border-[#C25A2B] bg-[#C25A2B]/5 text-[#C25A2B]"
                  : "border-[#DDD4C7] bg-[#FDFBF7] text-muted-foreground hover:border-[#C25A2B]/30 hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={!canGenerate || isGenerating}
        onClick={handleGenerate}
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "bg-[#C25A2B] text-white hover:bg-[#A94A1F]",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {isGenerating ? (
          <>
            <RefreshCwIcon className="size-4 animate-spin" />
            Generating...
          </>
        ) : generatedText ? (
          <>
            <RefreshCwIcon className="size-4" />
            Regenerate
          </>
        ) : (
          <>
            <Wand2Icon className="size-4" />
            Generate Summary
          </>
        )}
      </button>

      {!productContext.name.trim() && (
        <p className="text-center text-xs text-muted-foreground/60">
          Enter a product name first
        </p>
      )}

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      {generatedText && (
        <>
          <div className="relative rounded-lg border border-[#EBE3D8] bg-[#FDFBF7] p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <PencilIcon className="size-3" />
                Edit before applying
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex h-6 items-center gap-1 rounded-md border border-[#DDD4C7] bg-white px-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                title={copied ? "Copied!" : "Copy to clipboard"}
              >
                {copied ? (
                  <><CheckIcon className="size-3 text-green-600" /> Copied</>
                ) : (
                  <><CopyIcon className="size-3" /> Copy</>
                )}
              </button>
            </div>
            <textarea
              value={activeText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={4}
              className={cn(
                "w-full resize-y rounded-md border border-[#DDD4C7] bg-white px-3 py-2 text-sm leading-relaxed text-foreground outline-none",
                "focus:border-[#C25A2B] focus:ring-2 focus:ring-[#C25A2B]/20",
              )}
            />
            <p className="mt-1 text-right text-[10px] text-muted-foreground/60">
              {activeText.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          {hasChanged && (
            <button
              type="button"
              onClick={() => onApply(activeText)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border border-[#C25A2B]/30 px-3 py-2 text-sm font-medium transition-colors",
                "text-[#C25A2B] hover:bg-[#C25A2B]/5",
              )}
            >
              <CheckIcon className="size-3.5" />
              Apply to Description
            </button>
          )}
        </>
      )}
    </div>
  )
}