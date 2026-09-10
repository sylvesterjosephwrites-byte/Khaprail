import { ExternalLinkIcon } from "lucide-react"
import { SUB_BRANDS } from "@/lib/sub-brands"
import { cn } from "@/lib/utils"

// Slim utility strip above the main navbar (not part of the sticky header,
// so it scrolls away rather than permanently eating header height) —
// signals the PAKTILES.COM brand family this site belongs to without
// competing visually with the real nav below it. Data-driven from
// `SUB_BRANDS` so a third sub-brand site is a one-line addition, not a
// repeat of this component.
export function SubBrandBar() {
  return (
    <div className="border-b border-border bg-muted text-muted-foreground">
      <div className="mx-auto flex h-8 max-w-7xl items-center gap-1.5 px-4 text-xs sm:px-6">
        <span className="shrink-0">Part of</span>
        {SUB_BRANDS.map((brand, index) => (
          <span key={brand.name} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true">·</span>}
            {brand.isCurrent ? (
              <a
                href={brand.url}
                aria-current="page"
                className="font-semibold text-foreground hover:underline outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm"
              >
                {brand.name}
              </a>
            ) : (
              <a
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1 font-medium hover:text-foreground hover:underline",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm"
                )}
              >
                {brand.name}
                <ExternalLinkIcon className="size-3" aria-hidden="true" />
              </a>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
