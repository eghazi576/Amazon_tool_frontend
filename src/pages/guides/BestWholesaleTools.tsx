import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import { routeMeta } from "@/lib/routes.js";
import { faqPageSchema } from "@/lib/jsonld";
import { comparisonBySlug } from "@/lib/comparisons";

const meta = routeMeta("/best-amazon-wholesale-tools");

/**
 * A genuine, categorised guide to the Amazon wholesale / sourcing tool landscape.
 *
 * This is a self-published guide that includes our own product, so the honesty
 * bar is higher, not lower: tools are grouped by the job they do, each is
 * described by its real strength, and WholesaleOS appears only in the categories
 * it actually serves (sourcing decisions and brand vetting) -- never as a claimed
 * "#1 overall". A page that pretends to be objective while only flattering itself
 * is neither credible to a reader nor citable by an answer engine. Competitor
 * descriptions reuse the fair positioning from comparisons.ts.
 */

type Tool = {
  name: string;
  /** Slug of the /compare page, if one exists. */
  compareSlug?: string;
  bestFor: string;
  us?: boolean;
};

type Category = { title: string; blurb: string; tools: Tool[] };

const CATEGORIES: Category[] = [
  {
    title: "Market data & price history",
    blurb: "The underlying data layer — price and Best Seller Rank history over time. Most other tools, WholesaleOS included, build on this.",
    tools: [
      { name: "Keepa", compareSlug: "wholesaleos-vs-keepa", bestFor: "The reference price and BSR history, via extension and API" },
    ],
  },
  {
    title: "Product research & discovery suites",
    blurb: "Broad suites for finding product ideas and estimating demand, generally leaning towards private label.",
    tools: [
      { name: "Jungle Scout", compareSlug: "wholesaleos-vs-jungle-scout", bestFor: "Product discovery and an opportunity finder" },
      { name: "Helium 10", compareSlug: "wholesaleos-vs-helium-10", bestFor: "An all-in-one suite: keywords, PPC, listings, research" },
      { name: "AMZScout", compareSlug: "wholesaleos-vs-amzscout", bestFor: "A product database and sales estimator for discovery" },
    ],
  },
  {
    title: "Sourcing & buy / no-buy decisions",
    blurb: "Tools for deciding whether a specific product is worth buying to resell — the step after you have a candidate.",
    tools: [
      { name: "SellerAmp (SAS)", compareSlug: "wholesaleos-vs-selleramp", bestFor: "Fast product analysis and a mobile scanner" },
      { name: "Seller Assistant", compareSlug: "wholesaleos-vs-seller-assistant", bestFor: "Inline profit and restriction checks while you browse" },
      { name: "WholesaleOS", us: true, bestFor: "A weighted 15-criteria score and buy/no-buy verdict on live Keepa data" },
    ],
  },
  {
    title: "Bulk sourcing & arbitrage scanning",
    blurb: "For finding candidates at scale by scanning many retailer or wholesale sources at once.",
    tools: [
      { name: "Tactical Arbitrage", compareSlug: "wholesaleos-vs-tactical-arbitrage", bestFor: "Scanning retailer and wholesale lists in bulk" },
    ],
  },
  {
    title: "Brand research & wholesale brand vetting",
    blurb: "Working at the brand level — discovering brands, and vetting whether a brand is a safe wholesale opportunity.",
    tools: [
      { name: "SmartScout", compareSlug: "wholesaleos-vs-smartscout", bestFor: "Discovering brands and exploring the catalogue" },
      { name: "WholesaleOS", us: true, bestFor: "An 11-criteria APPROVED/REJECTED verdict on a wholesale brand" },
    ],
  },
];

const FAQS = [
  {
    q: "What is the best Amazon wholesale tool?",
    a: "There is no single best tool — it depends on the job. Keepa is the reference for market data; Jungle Scout, Helium 10 and AMZScout are broad research suites; Tactical Arbitrage scans sources in bulk; SellerAmp, Seller Assistant and WholesaleOS help decide on a specific product; and SmartScout and WholesaleOS work at the brand level. The right choice is the one that matches the step you are stuck on.",
  },
  {
    q: "Which tool is best for vetting wholesale brands?",
    a: "Wholesale brand vetting is a specific, underserved job. WholesaleOS is built for it: its Brand Intelligence module scores a brand across 11 criteria — website and business verification, IP complaint history, hazmat catalogue percentage, FBA seller density, sales velocity and more — and returns an APPROVED or REJECTED verdict before you invest time in a supplier.",
  },
  {
    q: "Do I need more than one Amazon tool?",
    a: "Often, yes — because the tools solve different steps. A common setup pairs a data or discovery tool to find candidates with a scoring tool to decide on them. For example, you might scan sources with a bulk tool, then score the shortlist and vet the brand with WholesaleOS.",
  },
  {
    q: "What is a good free or low-cost way to start?",
    a: "Keepa's data is the foundation many sellers start with. WholesaleOS itself uses the Keepa API and layers scoring on top, so you get the market history plus a verdict without reading charts yourself. Evaluate each tool against the specific decision you make most often.",
  },
];

const BestWholesaleTools = () => (
  <div className="relative min-h-screen bg-background font-sans text-foreground">
    <Seo title={meta.title} description={meta.description} path={meta.path} jsonLd={faqPageSchema(FAQS)} />

    <Navbar />

    <main className="container mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">Guide</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        The best Amazon wholesale &amp; sourcing tools
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        There is no single &ldquo;best&rdquo; Amazon tool — the right one depends on which step you are on.
        This guide maps the landscape by the job each tool does, so you can match the tool to your bottleneck
        rather than the loudest brand. It is written by the team behind WholesaleOS, and we have kept our own
        product to the categories it genuinely serves.
      </p>

      {/* How to choose */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-bold tracking-tight">How to choose</h2>
        <ul className="mt-4 space-y-2">
          {[
            "Are you finding candidates, or deciding on one you already have? Discovery suites and decision tools are different jobs.",
            "Product level or brand level? Vetting a wholesale brand's risk is a distinct task from analysing a single ASIN.",
            "What is your model — private label, online arbitrage, or wholesale? Tools lean towards one.",
            "Do you want raw data to interpret, or a scored verdict? Both are valid; they suit different working styles.",
          ].map((li) => (
            <li key={li} className="flex gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{li}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      {CATEGORIES.map((cat) => (
        <section key={cat.title} className="mt-12">
          <h2 className="font-display text-xl font-bold tracking-tight">{cat.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{cat.blurb}</p>
          <div className="mt-4 space-y-3">
            {cat.tools.map((t) => (
              <div
                key={t.name + cat.title}
                className={`rounded-xl border p-4 ${t.us ? "border-primary/40 bg-primary/5" : "border-border/60 bg-card/60"}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-foreground">
                    {t.name}
                    {t.us && <span className="ml-2 rounded bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">our tool</span>}
                  </h3>
                  {t.compareSlug && (
                    <Link to={`/compare/${t.compareSlug}`} className="text-xs text-primary underline underline-offset-2 hover:opacity-80">
                      WholesaleOS vs {comparisonBySlug(t.compareSlug)?.competitor} →
                    </Link>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{t.bestFor}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Where WholesaleOS fits */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-bold tracking-tight">Where WholesaleOS fits</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          WholesaleOS is not trying to be an all-in-one suite. It does two focused jobs: it scores a specific
          product with a weighted 15-criteria verdict (EXCELLENT to REJECT, with hard-reject checks for IP
          complaints, hazmat and authenticity), and it vets a wholesale brand across 11 criteria with an
          APPROVED or REJECTED result. Both run on live Keepa data. If your bottleneck is deciding on a deal or
          a brand — rather than discovering ideas or scanning at scale — that focus is the point.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-bold tracking-tight">Common questions</h2>
        <div className="mt-4 space-y-6">
          {FAQS.map((f) => (
            <div key={f.q}>
              <h3 className="text-base font-semibold text-foreground">{f.q}</h3>
              <p className="mt-1.5 leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-10 text-xs text-muted-foreground">
        Tool names are trademarks of their respective owners and are not affiliated with WholesaleOS.
        Third-party tools change their features and pricing; verify current details on their own sites.
      </p>

      <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-foreground">Score your next product or brand in seconds.</p>
        <Button asChild variant="hero">
          <Link to="/sign-up">
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <nav className="mt-10 border-t border-border/60 pt-8 text-sm">
        <Link to="/compare" className="text-primary underline underline-offset-2 hover:opacity-80">
          See all head-to-head comparisons →
        </Link>
      </nav>
    </main>

    <Footer />
  </div>
);

export default BestWholesaleTools;
