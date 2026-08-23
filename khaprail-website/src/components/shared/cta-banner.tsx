import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { buildWhatsAppUrl } from "@/lib/whatsapp"

export function CtaBanner() {
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <h2 className="font-heading text-3xl font-semibold sm:text-4xl">Ready to See the Clay in Person?</h2>
        <p className="max-w-xl text-primary-foreground/90">
          Request a free sample or download our full catalog — we'll follow up on WhatsApp.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            variant="secondary"
            className="h-12 px-6 text-base"
            nativeButton={false}
            render={
              <a
                href={buildWhatsAppUrl("Hi, I'd like to request a free tile sample.")}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            Get a Sample on WhatsApp
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-primary-foreground/30 bg-transparent px-6 text-base text-primary-foreground hover:bg-primary-foreground/10"
            nativeButton={false}
            render={<Link to="/contact" />}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  )
}
