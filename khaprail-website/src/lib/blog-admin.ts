import { supabase } from "@/lib/supabase"
import type { BlogPostFormValues, BlogFaq } from "@/types/blog"

export interface FaqDraft {
  question: string
  answer: string
}

/**
 * Insert-or-update a post plus a full replace of its FAQs (delete-then-insert
 * — fine at the ~5-FAQ scale this spec calls for). Requires the authenticated
 * admin session per the `blog_posts`/`blog_faqs` RLS policies.
 */
export async function saveBlogPost(
  values: BlogPostFormValues,
  faqs: FaqDraft[],
  existingId: string | null
): Promise<string> {
  if (!supabase) throw new Error("Supabase project not configured yet")

  const { data, error } = existingId
    ? await supabase.from("blog_posts").update(values).eq("id", existingId).select("id").single()
    : await supabase.from("blog_posts").insert(values).select("id").single()

  if (error) throw error
  const postId = data.id as string

  const { error: deleteError } = await supabase.from("blog_faqs").delete().eq("post_id", postId)
  if (deleteError) throw deleteError

  const rows = faqs
    .filter((faq) => faq.question.trim() && faq.answer.trim())
    .map((faq, index) => ({ post_id: postId, question: faq.question, answer: faq.answer, sort_order: index }))

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("blog_faqs").insert(rows)
    if (insertError) throw insertError
  }

  return postId
}

export function faqsFromBlogFaqs(blogFaqs: BlogFaq[]): FaqDraft[] {
  return blogFaqs.map((faq) => ({ question: faq.question, answer: faq.answer }))
}
