import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminBlogPosts } from "@/hooks/use-admin-blog-posts"

// /admin/blog — 06-BLOG-CMS-SPEC.md's tabbed editor list view. Auth-gated by
// ProtectedRoute (batch 9); RLS grants the signed-in admin full read/write
// (see blog_posts/blog_faqs policies).
export function AdminBlogList() {
  const { posts, isLoading, error } = useAdminBlogPosts()

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl">Blog Posts</h1>
        <Button nativeButton={false} render={<Link to="/admin/blog/new" />}>
          New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/admin/blog/${post.id}/edit`}
              className="flex items-center justify-between gap-4 py-3 outline-none hover:bg-muted/50"
            >
              <div>
                <p className="font-medium text-foreground">{post.title}</p>
                <p className="text-sm text-muted-foreground">{post.category ?? "Uncategorized"}</p>
              </div>
              <Badge variant={post.status === "published" ? "default" : "outline"}>{post.status}</Badge>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
