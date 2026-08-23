import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { BlogFaq } from "@/types/blog"

interface FaqAccordionProps {
  faqs: BlogFaq[]
}

// FAQ accordion at the bottom of a post (06-BLOG-CMS-SPEC.md) — the same
// content also renders as FAQPage JSON-LD (see lib/seo/json-ld.ts).
export function FaqAccordion({ faqs }: FaqAccordionProps) {
  if (faqs.length === 0) return null

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="mb-4 font-heading text-2xl">Frequently Asked Questions</h2>
      <Accordion>
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
