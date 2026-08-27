import { Button } from "@/components/ui/button"
import { buildWhatsAppUrl, WHATSAPP_DISPLAY_NUMBER } from "@/lib/whatsapp"

// /contact (01-SITE-MAP.md). WhatsApp is the site's one confirmed real
// contact channel (see src/lib/whatsapp.ts) — no email or street address is
// listed here since neither has been supplied yet (CLAUDE.md "never
// fabricate data"); flag to Sylvester if he wants those added.
export function Contact() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
      <h1 className="font-heading text-6xl font-semibold sm:text-7xl">Get in Touch</h1>
      <p className="max-w-lg text-lg text-muted-foreground">
        The fastest way to reach us is WhatsApp — message us for samples, pricing, or anything else about our
        clay and terracotta tiles.
      </p>
      <Button
        size="lg"
        className="h-12 px-6 text-base"
        nativeButton={false}
        render={
          <a href={buildWhatsAppUrl("Hi, I have a question about your tiles.")} target="_blank" rel="noreferrer" />
        }
      >
        Message Us on WhatsApp
      </Button>
      <p className="text-sm text-muted-foreground">
        {WHATSAPP_DISPLAY_NUMBER} · Est. 1982 · Lahore, Pakistan
      </p>
    </main>
  )
}
