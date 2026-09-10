import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { SearchIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useProductSearch } from "@/hooks/use-product-search"
import { cn } from "@/lib/utils"

// Desktop navbar search — a real, always-live `<input>` styled as a pill
// (matching the filter/tab pill treatment elsewhere on the site) rather
// than a separate collapsed/expanded toggle state: it's immediately
// usable on click or focus with no extra step, and focus-within styling
// alone gives it the "activates on interaction" look the request asked
// for. Debounced live results (`useProductSearch`) render as an
// accessible combobox/listbox popup — real `products`/`categories` rows
// only, capped at 6 (01-SITE-MAP.md's search requirement).
export function SiteSearch() {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const { results, isLoading } = useProductSearch(query)

  const trimmed = query.trim()
  const showDropdown = isOpen && trimmed.length > 0
  const viewAllIndex = results.length

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    setActiveIndex(-1)
  }, [query])

  useEffect(() => {
    if (!showDropdown) return
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [showDropdown])

  function goToResultsPage() {
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    setIsOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false)
      return
    }
    if (!showDropdown) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, viewAllIndex))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (activeIndex === -1 || activeIndex === viewAllIndex) {
        goToResultsPage()
      } else {
        navigate(`/products/${results[activeIndex].slug}`)
        setIsOpen(false)
      }
    }
  }

  const listboxId = "site-search-listbox"

  return (
    <div ref={containerRef} className="relative ml-auto hidden w-full max-w-xs lg:block">
      <div className="group flex h-9 items-center gap-2 rounded-full border border-navy-foreground/25 bg-navy-foreground/10 px-3.5 transition-colors focus-within:border-border focus-within:bg-background">
        <SearchIcon className="size-4 shrink-0 text-navy-foreground/70 group-focus-within:text-muted-foreground" />
        <input
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `site-search-option-${activeIndex}` : undefined}
          aria-label="Search products"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search khaprail, disco tile..."
          className="h-full w-full bg-transparent text-sm text-navy-foreground placeholder:text-navy-foreground/60 outline-none focus:text-foreground focus:placeholder:text-muted-foreground"
        />
      </div>

      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="absolute top-full left-0 z-50 mt-2 w-full min-w-72 overflow-hidden rounded-xl border border-border bg-popover shadow-xl"
        >
          {isLoading ? (
            <div className="flex flex-col gap-2 p-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No results for &ldquo;{trimmed}&rdquo;</p>
          ) : (
            <ul>
              {results.map((product, i) => (
                <li key={product.id} id={`site-search-option-${i}`} role="option" aria-selected={activeIndex === i}>
                  <Link
                    to={`/products/${product.slug}`}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted",
                      activeIndex === i && "bg-muted"
                    )}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white">
                      {product.cover_image_url && (
                        <img src={product.cover_image_url} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium text-foreground">{product.name}</span>
                      {product.category_name && (
                        <span className="truncate text-xs text-muted-foreground">{product.category_name}</span>
                      )}
                    </div>
                    {product.price != null && (
                      <span className="shrink-0 text-sm font-semibold text-price">PKR {product.price.toLocaleString()}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            id={`site-search-option-${viewAllIndex}`}
            role="option"
            aria-selected={activeIndex === viewAllIndex}
            to={`/search?q=${encodeURIComponent(trimmed)}`}
            onMouseEnter={() => setActiveIndex(viewAllIndex)}
            className={cn(
              "block border-t border-border px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted",
              activeIndex === viewAllIndex && "bg-muted"
            )}
          >
            View all results for &ldquo;{trimmed}&rdquo;
          </Link>
        </div>
      )}
    </div>
  )
}
