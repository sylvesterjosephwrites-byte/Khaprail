import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import { searchProducts, type ProductSearchResult } from "@/lib/product-search"

const DEBOUNCE_MS = 300
const RESULT_LIMIT = 6

interface UseProductSearchResult {
  results: ProductSearchResult[]
  isLoading: boolean
  error: string | null
}

/**
 * Debounced (300ms) live search against the real `products`/`categories`
 * tables — powers both the desktop navbar dropdown and the mobile drawer's
 * search view. A monotonic request id guards against an older, slower
 * response overwriting a newer one if they resolve out of order.
 */
export function useProductSearch(query: string): UseProductSearchResult {
  const [results, setResults] = useState<ProductSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestId = useRef(0)

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed || !supabase) {
      requestId.current++
      setResults([])
      setIsLoading(false)
      setError(null)
      return
    }

    const client = supabase
    const myRequestId = ++requestId.current
    setIsLoading(true)

    const timer = setTimeout(() => {
      searchProducts(client, trimmed, RESULT_LIMIT)
        .then((rows) => {
          if (requestId.current !== myRequestId) return
          setResults(rows)
          setIsLoading(false)
          setError(null)
        })
        .catch((err: unknown) => {
          if (requestId.current !== myRequestId) return
          setError(err instanceof Error ? err.message : "Search failed")
          setIsLoading(false)
        })
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [query])

  return { results, isLoading, error }
}
