import { CtaBanner } from "@/components/shared/cta-banner"

// /videos (01-SITE-MAP.md). No video content has been supplied yet, and
// 07-ADMIN-DASHBOARD-SPEC.md's v1 scope has no "Videos" management section —
// an honest placeholder rather than a full CMS-backed gallery until that's
// decided (see 00-PROGRESS.md).
export function Videos() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-heading text-4xl">Videos</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We're putting together videos of our workshop and tile-making process. Check back soon.
        </p>
      </div>
      <CtaBanner />
    </main>
  )
}
