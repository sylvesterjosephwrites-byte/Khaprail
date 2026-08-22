interface ComingSoonProps {
  title: string
}

// Placeholder for routes not yet built — see 09-BUILD-ORDER.md for the
// batch each real page lands in. Not a substitute for building the page.
export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
      <h1 className="font-heading text-2xl">{title}</h1>
      <p className="text-sm text-muted-foreground">This page is coming soon.</p>
    </main>
  )
}
