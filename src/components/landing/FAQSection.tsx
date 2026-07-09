import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { homepageFaqs as faqs } from "./faqs";



const FAQSection = () => {
  return (
    <section id="faq" className="relative py-24 md:py-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-3xl" />

      <div className="container relative mx-auto max-w-3xl px-6">

        {/* Heading */}
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Got questions?</span>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about WholesaleOS before you start.
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-border/60 bg-card/60 px-5 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/30"
            >
              <AccordionTrigger className="text-left text-sm font-medium leading-snug hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Bottom CTA */}
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Still have questions?{" "}
          <a href="mailto:support@wholesaleos.ai" className="text-primary underline underline-offset-2 hover:opacity-80">
            support@wholesaleos.ai
          </a>
        </p>
      </div>
    </section>
  );
};

export default FAQSection;
