import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SpecBlock } from "@/components/pdp/spec-block"
import type { ProductDetail } from "@/types/product"

interface AboutItemAccordionProps {
  product: ProductDetail
}

// "About This Item" — Product Details + Specification panels, collapsed by
// default (05-PDP-SPEC.md progressive disclosure).
export function AboutItemAccordion({ product }: AboutItemAccordionProps) {
  return (
    <div>
      <h2 className="mb-2 font-heading text-3xl font-semibold">About This Item</h2>
      <Accordion>
        <AccordionItem value="details">
          <AccordionTrigger>Product Details</AccordionTrigger>
          <AccordionContent className="text-base">
            {product.description ?? "No additional details have been added for this product yet."}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="specification">
          <AccordionTrigger>Specification</AccordionTrigger>
          <AccordionContent>
            <SpecBlock product={product} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
