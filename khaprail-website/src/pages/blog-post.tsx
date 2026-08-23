import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FaqAccordion } from "@/components/blog/faq-accordion"
import { useBlogPost } from "@/hooks/use-blog-post"
import { buildArticleJsonLd, buildFaqJsonLd } from "@/lib/seo/json-ld"

// /blog/:slug (06-BLOG-CMS-SPEC.md): cover image, title, author/read-time,
// Answer Box near the top (for human skimmers and AI crawlers), content,
// FAQ accordion, Article + FAQPage JSON-LD.
export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { post, isLoading, error } = useBlogPost(slug)

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
          <Skeleton className="aspect-[16/9] w-full rounded-xl" />
          <Skeleton className="mt-6 h-8 w-2/3" />
          <Skeleton className="mt-4 h-24 w-full" />
        </div>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <h1 className="font-heading text-2xl">Post not found</h1>
        <p className="text-sm text-muted-foreground">We couldn't find that post. Browse the blog instead.</p>
        <Button className="mt-4" nativeButton={false} render={<Link to="/blog" />}>
          View All Posts
        </Button>
      </main>
    )
  }

  const paragraphs = (post.content ?? "").split(/\n\s*\n/).filter((p) => p.trim())
  const articleJsonLd = buildArticleJsonLd(post)
  const faqJsonLd = buildFaqJsonLd(post)

  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />}

      <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
        {post.cover_image_url && (
          <div className="mb-8 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-muted">
            <img src={post.cover_image_url} alt="" className="h-full w-full object-cover" />
          </div>
        )}

        <h1 className="font-heading text-4xl">{post.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {[post.author, post.read_time_minutes ? `${post.read_time_minutes} min read` : null]
            .filter(Boolean)
            .join(" · ")}
        </p>

        {post.answer_box && (
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
            <p className="text-foreground">{post.answer_box}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 text-lg leading-relaxed text-foreground">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <FaqAccordion faqs={post.blog_faqs} />
      </div>
    </main>
  )
}
