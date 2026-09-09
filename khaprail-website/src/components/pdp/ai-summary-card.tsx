import { SparklesIcon } from "lucide-react"

interface AiSummaryCardProps {
  summary: string
}

// Cached AI summary (products.ai_summary) — generated once via the admin
// "Generate AI Summary" button, read directly from the stored column here.
// No live API call on page load. Only rendered when a summary actually
// exists (see product-detail.tsx) — no broken/empty state otherwise.
// Clearly labeled "AI-generated" so visitors don't mistake it for official
// manufacturer copy.
export function AiSummaryCard({ summary }: AiSummaryCardProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/50 p-4">
      <div className="mb-2 flex items-center gap-1.5">
        <SparklesIcon className="size-4 text-primary" />
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">AI-generated summary</span>
      </div>
      <p className="text-base text-foreground">{summary}</p>
    </div>
  )
}
