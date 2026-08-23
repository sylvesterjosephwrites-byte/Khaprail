// Mirrors `blog_posts` / `blog_faqs` (06-BLOG-CMS-SPEC.md).
export interface BlogFaq {
  id: string
  question: string
  answer: string
  sort_order: number
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  cover_image_url: string | null
  category: string | null
  author: string | null
  read_time_minutes: number | null
  excerpt: string | null
  content: string | null
  focus_keyword: string | null
  meta_title: string | null
  meta_description: string | null
  answer_box: string | null
  ai_summary: string | null
  entity_tags: string[]
  status: "draft" | "published"
  published_at: string | null
  created_at: string
}

export interface BlogPostWithFaqs extends BlogPost {
  blog_faqs: BlogFaq[]
}

// The subset of fields the admin editor form manages directly (id/created_at
// are set by the database, faqs are edited via a separate list).
export type BlogPostFormValues = Omit<BlogPost, "id" | "created_at">
