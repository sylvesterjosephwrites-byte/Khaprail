import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

// Numbered pagination (11-CATEGORY-LISTING-SPEC.md — "not infinite scroll"),
// shared by /products and every category/subcategory listing page.
export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <nav className="mt-10 flex items-center justify-center gap-1" aria-label="Pagination">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </Button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <Button
          key={n}
          type="button"
          variant={n === page ? "default" : "outline"}
          size="sm"
          className={cn("w-9", n === page && "pointer-events-none")}
          aria-current={n === page ? "page" : undefined}
          onClick={() => onPageChange(n)}
        >
          {n}
        </Button>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  )
}
