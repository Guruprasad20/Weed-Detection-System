import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Reveal from "@/components/Reveal";

const faqs = [
  {
    q: "How accurate is WeedVision AI?",
    a: "Our AI vision model achieves over 92% top-3 accuracy on common North American and European weed species. Accuracy depends on image quality, lighting, and plant maturity.",
  },
  {
    q: "What image formats are supported?",
    a: "PNG, JPG, and WebP up to 10 MB. For best results, take a sharp close-up photo of a single plant against a contrasting background.",
  },
  {
    q: "Is my uploaded data stored?",
    a: "Images are sent to our secure AI gateway only for classification and are not retained. You can review and delete history at any time.",
  },
  {
    q: "Can I use this for commercial farms?",
    a: "Absolutely. WeedVision AI is designed for precision agriculture — from smallholder plots to large commercial operations. Contact us for enterprise integrations.",
  },
  {
    q: "Which weeds does the model recognise?",
    a: "The model covers 200+ broadleaf and grass weed species, including dandelion, crabgrass, chickweed, purslane, thistle, bindweed, and many regional invasives.",
  },
];

const FAQ = () => (
  <section id="faq" className="py-24 bg-muted/30">
    <div className="container mx-auto px-4 max-w-3xl">
      <Reveal>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Frequently Asked Questions</h2>
        </div>
      </Reveal>
      <Reveal delay={150}>
        <Accordion type="single" collapsible className="bg-card rounded-xl shadow-card-custom px-6">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="font-heading text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </div>
  </section>
);

export default FAQ;
