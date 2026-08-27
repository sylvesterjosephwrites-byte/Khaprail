import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useBlogPosts } from "@/hooks/use-blog-posts"

// /blog — published posts only (06-BLOG-CMS-SPEC.md).
export function BlogIndex() {
  const { posts, isLoading, error } = useBlogPosts()

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-6xl font-semibold sm:text-7xl">Blog</h1>
          <p className="mt-2 text-muted-foreground">Stories, guides, and updates from Khaprail Tiles.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-[16/10] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : error || posts.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Blog posts coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group/link outline-none">
                <Card className="h-full p-0">
                  <div className="flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-muted">
                    {post.cover_image_url && (
                      <img src={post.cover_image_url} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <CardContent className="flex flex-col gap-2 py-4">
                    {post.category && <Badge variant="secondary">{post.category}</Badge>}
                    <h2 className="font-heading text-xl group-hover/link:underline">{post.title}</h2>
                    {post.excerpt && <p className="text-base text-muted-foreground">{post.excerpt}</p>}
                    <p className="text-xs text-muted-foreground">
                      {[post.author, post.read_time_minutes ? `${post.read_time_minutes} min read` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
