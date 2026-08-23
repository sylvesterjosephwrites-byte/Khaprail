import type { BlogPostWithFaqs } from "@/types/blog"

/** Escapes "</" so embedded JSON can't prematurely close the <script> tag it's rendered into. */
function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/<\//g, "<\\/")
}

// Article schema from the SEO tab fields (06-BLOG-CMS-SPEC.md).
export function buildArticleJsonLd(post: BlogPostWithFaqs): string {
  return safeJsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    image: post.cover_image_url || undefined,
    author: post.author ? { "@type": "Person", name: post.author } : undefined,
    datePublished: post.published_at || undefined,
    keywords: post.entity_tags.length > 0 ? post.entity_tags.join(", ") : undefined,
  })
}

// FAQPage schema from the FAQs tab (06-BLOG-CMS-SPEC.md).
export function buildFaqJsonLd(post: BlogPostWithFaqs): string | null {
  if (post.blog_faqs.length === 0) return null
  return safeJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.blog_faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  })
}
