import { Link } from "react-router-dom";
import { Sparkles, HelpCircle } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import { faqPageSchema } from "@/lib/jsonld";
import { routeMeta } from "@/lib/routes.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const meta = routeMeta("/faq");

// ─── FAQ Data ────────────────────────────────────────────────────────────────

const categories = [
  {
    title: "General — About WholesaleOS",
    faqs: [
      {
        q: "What is WholesaleOS?",
        a: "WholesaleOS is a web-based Amazon FBA research platform that helps sellers find profitable products, analyze competition, and validate wholesale brand opportunities. It fetches live market data from Keepa — including price history, Best Seller Rank (BSR), FBA seller counts, and profit margins — and produces a scored buy/no-buy verdict for every ASIN you analyze.",
      },
      {
        q: "Who is WholesaleOS built for?",
        a: "WholesaleOS is built for Amazon FBA sellers operating in wholesale, online arbitrage (OA), and private label models. Whether you are sourcing products from distributors, scanning retail clearance, or vetting new brands to carry, WholesaleOS gives you the data and scoring you need to make faster, better decisions.",
      },
      {
        q: "How is WholesaleOS different from Jungle Scout or Helium 10?",
        a: "Jungle Scout and Helium 10 are broad Amazon seller suites covering keyword research, listing optimization, PPC, and more. WholesaleOS is laser-focused on product and brand viability scoring. Its Brand Intelligence module scores brands across 11 criteria — including IP complaint history, hazmat catalog percentage, MAP enforcement, and FBA seller count — a workflow that general tools do not offer. WholesaleOS is also built on live Keepa data, giving you 90-day price history, BSR trends, and real-time FBA seller counts.",
      },
      {
        q: "What data sources does WholesaleOS use?",
        a: "WholesaleOS pulls live data from the Keepa API, which aggregates real-time Amazon marketplace data including price history, Best Seller Rank, review counts, FBA/FBM offer counts, and Amazon's own 'Bought in past month' sales badge. For IP complaint history, WholesaleOS links to ip-alert.com and who.is for domain and business registration verification.",
      },
      {
        q: "Is WholesaleOS free to use?",
        a: "WholesaleOS currently offers access to registered users. Sign up to start researching products and evaluating brands. Pricing details are available after registration.",
      },
    ],
  },
  {
    title: "Product Research",
    faqs: [
      {
        q: "How does the product viability score work?",
        a: "WholesaleOS scores every product across 15+ weighted criteria grouped into hard-reject checks and scored criteria. Hard-reject checks (IP complaint, hazmat, authenticity complaints) immediately fail a product regardless of score. Scored criteria cover profitability, competition level, Buy Box stability, listing health, review sentiment, and more. The final score maps to one of five verdicts: EXCELLENT, GOOD, AVERAGE, BAD, or REJECT.",
      },
      {
        q: "How does WholesaleOS calculate monthly sales estimates?",
        a: "WholesaleOS uses a three-step cascade. First, it reads Amazon's own 'Bought in past month' badge from Keepa — the most accurate signal available. If that is not available, it counts actual BSR drop events in the 30-day series (each drop typically represents a sale). As a last resort it extrapolates from the 90-day BSR average using a category-specific BSR-to-sales lookup table.",
      },
      {
        q: "What is BSR and why does it matter?",
        a: "BSR stands for Best Seller Rank. Amazon assigns a rank to every product in every category — the lower the number, the more that product sells relative to others. A BSR of 500 in Kitchen means it is the 500th best-selling kitchen product on Amazon. WholesaleOS tracks your product's BSR over 90 days so you can see whether sales are trending up, down, or spiking — which indicates seasonal demand, a viral moment, or a competitor entering the market.",
      },
      {
        q: "How does the profit calculator work?",
        a: "Enter your COGS (cost of goods sold) and WholesaleOS automatically calculates net profit, ROI, and profit margin. It factors in Amazon's referral fee (varies by category, pulled from an up-to-date 2025 rate table), FBA fulfillment fees (estimated from product weight and dimensions), and monthly storage fees. The result is your per-unit net profit, break-even price, and whether the ROI clears a healthy threshold.",
      },
      {
        q: "What does the Buy Box check tell me?",
        a: "The Buy Box check tells you whether an active Buy Box exists on the listing. If there is no Buy Box, customers cannot add the product to cart with one click — dramatically hurting conversion. If Amazon itself holds the Buy Box, competing as a third-party seller is very difficult. WholesaleOS flags both scenarios so you can decide whether to proceed.",
      },
      {
        q: "What is a gated category or brand on Amazon?",
        a: "Gated categories and brands require Amazon's approval before you can sell them. Examples include Toys & Games (during Q4), Grocery, Beauty, and thousands of specific brands. WholesaleOS includes a gated check in its scoring — if a product is gated for your account, it loses points since you cannot sell it without first getting approved. Always verify gating status inside Seller Central for your specific account.",
      },
    ],
  },
  {
    title: "Brand Intelligence",
    faqs: [
      {
        q: "What is Brand Intelligence in WholesaleOS?",
        a: "Brand Intelligence is WholesaleOS's wholesale brand vetting module. Before reaching out to a brand or distributor, you need to know: Does this brand have a real website? Are they a registered business? Do they have IP complaint history? Is their catalog hazmat-heavy? Brand Intelligence scores a brand across 11 criteria and produces an APPROVED or REJECTED verdict — helping you avoid brands that will waste your time or get your account suspended.",
      },
      {
        q: "What are the 11 Brand Intelligence scoring criteria?",
        a: "The 11 criteria are: (1) Has an official website, (2) Has registered business details, (3) Brand is actively selling within 30 days, (4) No history of mass account takedowns, (5) No more than 1 IP complaint in the last 12 months, (6) No counterfeit red flags on IP-Alert, (7) FBA seller count per ASIN is in the ideal 3–5 range, (8) Monthly sales exceed 100 units per ASIN, (9) Hazmat catalog under 10%, (10) Not in an adult or high-risk category, and (11) MAP policy enforcement level. Hard-reject criteria (1, 2, 4) immediately reject the brand if they fail, regardless of the overall score.",
      },
      {
        q: "Can WholesaleOS auto-fill brand data from an ASIN?",
        a: "Yes. Enter any ASIN from the brand and click Submit. WholesaleOS fetches the brand name, category, average rating, review count, FBA seller count, monthly sales estimate, hazmat status, and adult product flag automatically. Fields that cannot be auto-detected — such as IP complaint count, mass takedown history, brand website, and business registration — require manual entry with guidance links provided.",
      },
      {
        q: "What is MAP and why does it affect my sourcing decision?",
        a: "MAP stands for Minimum Advertised Price. Brands that aggressively enforce MAP require all sellers to list at or above a fixed minimum price. This protects your margin (no race to the bottom) but also means you must comply or risk being cut off from the brand's supply. WholesaleOS flags MAP enforcement as a signal to be aware of — not a disqualifier, since MAP enforcement is generally a sign of a healthy, in-demand brand.",
      },
      {
        q: "How do I check IP complaints for a brand?",
        a: "WholesaleOS links directly to IP-Alert.com from the IP Complaints field. IP-Alert.com is a community-maintained database of brands known to file IP complaints, counterfeit claims, or cease-and-desist letters against Amazon sellers. Enter the number of complaints you find and WholesaleOS factors it into the score. Zero or one complaint in the last 12 months passes; two or more loses 10 points.",
      },
    ],
  },
  {
    title: "Data Accuracy & Reliability",
    faqs: [
      {
        q: "How accurate is the sales estimate?",
        a: "Sales estimates are approximations, not guarantees. The most accurate source is Amazon's own 'Bought in past month' badge (fetched via Keepa), which reflects real purchases in the last 30 days. When that is unavailable, WholesaleOS counts actual BSR drops in the 30-day data series — each drop generally corresponds to at least one sale. All estimates carry inherent uncertainty; use them as directional signals alongside BSR trend and review velocity.",
      },
      {
        q: "How current is the price and BSR data?",
        a: "Keepa tracks Amazon prices and BSR in near real-time, typically updating every 1–6 hours depending on the product's sales velocity. When you analyze an ASIN in WholesaleOS, it fetches the most current snapshot available from Keepa at that moment, plus the full 90-day historical series.",
      },
      {
        q: "Why might some fields show no data?",
        a: "Some products — especially newly launched ASINs or products with very low sales velocity — do not have enough historical data in Keepa for all fields to populate. In those cases, WholesaleOS shows null rather than an incorrect value, and falls back to alternative calculation methods where possible. A missing data field is useful information in itself: it often signals a product too new or too inactive to confidently evaluate.",
      },
    ],
  },
  {
    title: "Account & Privacy",
    faqs: [
      {
        q: "Is my search history saved?",
        a: "Yes. Every product lookup and brand evaluation is saved to your account so you can review, compare, and export them later from the History page. Your data is tied to your account and is not shared with other users.",
      },
      {
        q: "How do I reset my password?",
        a: "Go to the Sign In page and click 'Forgot password'. Enter your email address and you will receive a reset link. If you do not receive the email within a few minutes, check your spam folder.",
      },
      {
        q: "How do I contact support?",
        a: "You can reach the WholesaleOS team by email at support@wholesaleos.com. We respond to all enquiries within 24 hours on business days.",
      },
    ],
  },
];

// ─── JSON-LD FAQ Schema (GEO / structured data) ──────────────────────────────

const faqSchema = faqPageSchema(categories.flatMap((cat) => cat.faqs));

// ─── Component ────────────────────────────────────────────────────────────────

export default function FAQPage() {
  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">

      <Seo
        title={meta.title}
        description={meta.description}
        path={meta.path}
        noindex={!meta.index}
        jsonLd={faqSchema}
      />

      <Navbar />

      <main className="container mx-auto max-w-3xl px-4 pb-24 pt-32">

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-elegant">
            <HelpCircle className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know about WholesaleOS — Amazon FBA product and brand research.
          </p>
        </div>

        {/* FAQ categories */}
        <div className="space-y-10">
          {categories.map((cat) => (
            <section key={cat.title}>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {cat.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {cat.faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`${cat.title}-${i}`}
                    className="rounded-xl border border-border/60 bg-card px-5 shadow-sm"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium leading-snug hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    {/* forceMount: see FAQSection.tsx. The answers must exist in the
                        HTML, because faqPageSchema() publishes them as structured data. */}
                    <AccordionContent forceMount className="text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="font-display text-xl font-bold">Still have questions?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Reach us at{" "}
            <a href="mailto:support@wholesaleos.com" className="text-primary underline underline-offset-2">
              support@wholesaleos.com
            </a>{" "}
            or just start using the tool — most answers become obvious once you try it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/sign-up"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-opacity hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" /> Get Started Free
            </Link>
            <Link
              to="/sign-in"
              className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
