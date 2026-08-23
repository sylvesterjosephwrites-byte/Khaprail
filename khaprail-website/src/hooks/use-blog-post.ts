import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { BlogPostWithFaqs } from "@/types/blog"

interface UseBlogPostResult {
  post: BlogPostWithFaqs | null
  isLoading: boolean
  error: string | null
}

const COLUMNS = `
  id, title, slug, cover_image_url, category, author, read_time_minutes,
  excerpt, content, focus_keyword, meta_title, meta_description, answer_box,
  ai_summary, entity_tags, status, published_at, created_at,
  blog_faqs ( id, question, answer, sort_order )
`

/** /blog/:slug — a single published post with its FAQs (06-BLOG-CMS-SPEC.md). */
export function useBlogPost(slug: string | undefined): UseBlogPostResult {
  const [post, setPost] = useState<BlogPostWithFaqs | null>(null)
  const [isLoading, setIsLoading] = useState(() => supabase !== null && !!slug)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase || !slug) return

    let cancelled = false
    setIsLoading(true)
    setError(null)

    supabase
      .from("blog_posts")
      .select(COLUMNS)
      .eq("slug", slug)
      .eq("status", "published")
      .order("sort_order", { referencedTable: "blog_faqs", ascending: true })
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) {
          setError(queryError.message)
        } else if (!data) {
          setError("Post not found")
        } else {
          setPost(data as unknown as BlogPostWithFaqs)
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { post, isLoading, error }
}
