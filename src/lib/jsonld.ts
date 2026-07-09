import { SITE_NAME, SITE_URL } from "@/lib/routes.js";

export type JsonLd = Record<string, unknown>;

/**
 * Homepage only. Describes the product itself.
 * The sitewide Organization node lives statically in index.html.
 */
export const softwareApplicationSchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "WholesaleOS is an Amazon FBA product and brand research tool. It analyzes any ASIN using live Keepa data to provide price history, BSR trends, FBA seller counts, profit margins, and a buy/no-buy viability score.",
  // No `offers` block. It previously published price "0" USD while the FAQ says
  // pricing is disclosed after registration -- the two could not both be true, and
  // publishing a price we cannot stand behind is exactly what Google penalizes.
  // Restore it with real Offer markup once the pricing page exists.
  //
  // No `aggregateRating` either, and it must stay that way until real ratings are
  // collected. Inventing one risks a manual action.
  featureList: [
    "Live ASIN product lookup via Keepa API",
    "90-day price and BSR history charts",
    "FBA profit calculator with auto referral and fulfillment fees",
    "15-criteria product viability scoring",
    "Brand Intelligence with 11-criteria brand scoring",
    "IP complaint history check",
    "Hazmat and adult category detection",
    "Monthly sales estimate from BSR drops",
  ],
};

export type Faq = { q: string; a: string };

/**
 * Build a FAQPage node from the same array that renders the accordion, so the
 * structured data can never drift from the visible copy.
 *
 * This matters more than usual here: Radix unmounts collapsed AccordionContent,
 * so the answer text is absent from the prerendered HTML. The JSON-LD is what
 * carries the answers to crawlers.
 */
export function faqPageSchema(faqs: Faq[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
