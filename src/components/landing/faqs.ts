import type { Faq } from "@/lib/jsonld";

/**
 * Homepage FAQ copy. Rendered by FAQSection and used to build the FAQPage
 * JSON-LD in Index.tsx, so the structured data can never drift from the
 * visible questions.
 */
export const homepageFaqs: Faq[] = [
  {
    q: "What is WholesaleOS?",
    a: "WholesaleOS is a web-based Amazon FBA research platform. Paste any ASIN and get a full 90-day price history, BSR trends, FBA seller count, profit analysis, and a scored buy/no-buy verdict in under 3 seconds.",
  },
  {
    q: "Who is WholesaleOS built for?",
    a: "Amazon FBA sellers operating in wholesale, online arbitrage, and private label. Whether you are sourcing from distributors, scanning retail clearance, or vetting wholesale brands, WholesaleOS gives you the data to decide faster and source smarter.",
  },
  {
    q: "How is WholesaleOS different from Jungle Scout or Helium 10?",
    a: "Jungle Scout and Helium 10 are broad suites covering PPC, listing optimisation, and keywords. WholesaleOS focuses entirely on product and brand viability scoring. Its Brand Intelligence module scores brands on 11 criteria including IP complaints, hazmat catalogue percentage, MAP enforcement, and FBA seller count. That level of focused brand vetting is something general tools simply do not offer.",
  },
  {
    q: "How does the product viability score work?",
    a: "WholesaleOS scores every product across 15+ weighted criteria. Hard-reject checks such as IP complaints, hazmat detection, and authenticity complaints immediately fail a product. Scored criteria cover profitability, competition level, Buy Box stability, and listing health. The final result is one of five verdicts: EXCELLENT, GOOD, AVERAGE, BAD, or REJECT.",
  },
  {
    q: "How accurate is the monthly sales estimate?",
    a: "WholesaleOS first reads Amazon's own Bought in past month badge via Keepa, which is the most accurate signal available. If that is unavailable, it counts actual BSR drop events in the 30-day data series. As a last resort it extrapolates from the 90-day BSR average using a category-specific lookup table.",
  },
  {
    q: "What data sources does WholesaleOS use?",
    a: "WholesaleOS pulls live data from the Keepa API, including price history, Best Seller Rank, review counts, FBA offer counts, and Amazon's sales badge. For brand research, it links to ip-alert.com for IP complaint history and who.is for domain and business registration verification.",
  },
  {
    q: "What is Brand Intelligence?",
    a: "Brand Intelligence is WholesaleOS's wholesale brand vetting module. It scores a brand across 11 criteria including website verification, business registration, IP complaint history, hazmat catalogue size, FBA seller density, and sales velocity. The result is a clear APPROVED or REJECTED verdict before you invest time reaching out to a supplier.",
  },
  {
    q: "Can WholesaleOS auto-fill brand data from an ASIN?",
    a: "Yes. Enter any ASIN from the brand and WholesaleOS auto-fills the brand name, category, ratings, FBA seller count, monthly sales, hazmat status, and adult product flag. Fields that require manual research such as IP complaints, mass takedown history, and business registration are clearly flagged with helper links.",
  },
  {
    q: "Is my search history saved?",
    a: "Yes. Every product lookup and brand evaluation is saved to your account and accessible any time from the History page. Your data is private and is never shared with other users.",
  },
  {
    q: "How do I get started?",
    a: "Create a free account, paste an Amazon ASIN into the Product Research tool, and you will have a full market analysis ready in under 3 seconds. No credit card required.",
  },
];
