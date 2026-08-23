import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { BlogPost } from "@/types/blog"

interface UseAdminBlogPostsResult {
  posts: BlogPost[]
  isLoading: boolean
  error: string | null
}

const COLUMNS =
  "id, title, slug, cover_image_url, category, author, read_time_minutes, excerpt, status, published_at, created_at"

/**
 * /admin/blog list — no `status` filter, unlike the public `useBlogPosts()`,
 * so drafts show up too. Requires the authenticated admin session
 * (ProtectedRoute, batch 9) — RLS restricts unauthenticated reads to
 * published posts only (see blog_posts policies).
 */
export function useAdminBlogPosts(): UseAdminBlogPostsResult {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    supabase
      .from("blog_posts")
      .select(COLUMNS)
      .order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) {
          setError(queryError.message)
        } else {
          setPosts((data ?? []) as unknown as BlogPost[])
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { posts, isLoading, error }
}
