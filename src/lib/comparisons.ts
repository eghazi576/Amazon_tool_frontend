import type { Faq } from "@/lib/jsonld";

/**
 * Content for the /compare/* pages.
 *
 * Ground rules, because these pages name real competitors on a public, indexable
 * URL and are read by AI answer engines that cite them:
 *
 *   1. Everything said about WholesaleOS is verified against the code.
 *   2. Competitors are described by their well-established category and
 *      positioning only. No invented prices, no invented feature gaps, nothing
 *      disparaging. Where a distinction is drawn it is one that is publicly
 *      obvious (e.g. Keepa is a data/extension tool, not a scoring tool -- and
 *      WholesaleOS is literally built on the Keepa API, so this is not a knock).
 *   3. Each page says plainly when the OTHER tool is the better choice. Balanced
 *      comparisons are the ones that get cited; a page that only flatters itself
 *      reads as marketing and is ignored.
 *   4. Competitor products change. Each page carries a "verify current details"
 *      note, and none of this is presented as a live feature audit.
 */

export type CompareRow = { dimension: string; wholesaleos: string; competitor: string };

export type Comparison = {
  slug: string;
  competitor: string;
  /** One-line positioning of the competitor, stated fairly. */
  positioning: string;
  intro: string;
  rows: CompareRow[];
  chooseCompetitor: string[];
  chooseWholesaleOS: string[];
  faqs: Faq[];
};

const KEEPA: Comparison = {
  slug: "wholesaleos-vs-keepa",
  competitor: "Keepa",
  positioning:
    "Keepa is the reference price-history and Best Seller Rank tracker for Amazon, used through a browser extension and a data API.",
  intro:
    "This is a comparison people ask about often, and the honest answer is that they are not really rivals. WholesaleOS is built on top of the Keepa API — it uses Keepa's data. The difference is what each one does with that data: Keepa shows you the history; WholesaleOS reads the same history and returns a scored buy or no-buy verdict.",
  rows: [
    { dimension: "Core job", wholesaleos: "Scores a product and gives a buy/no-buy verdict", competitor: "Tracks and charts price and BSR history" },
    { dimension: "Output", wholesaleos: "A 15-criteria score: EXCELLENT / GOOD / AVERAGE / BAD / REJECT", competitor: "Raw charts and data points you interpret yourself" },
    { dimension: "Profit calculation", wholesaleos: "Built in — referral, FBA, storage fees, ROI, break-even", competitor: "Not its focus; data only" },
    { dimension: "Brand vetting", wholesaleos: "Brand Intelligence — 11-criteria wholesale brand score", competitor: "Not offered" },
    { dimension: "Data source", wholesaleos: "The Keepa API (the same data)", competitor: "Keepa's own data" },
    { dimension: "Best for", wholesaleos: "Deciding fast whether to buy a wholesale deal", competitor: "Reading the underlying market history in depth" },
  ],
  chooseCompetitor: [
    "You want the raw price and BSR history and prefer to read the charts yourself.",
    "You live in the Keepa browser extension while shopping and want data inline.",
    "You are building your own tooling on the Keepa API.",
  ],
  chooseWholesaleOS: [
    "You want a scored verdict rather than charts to interpret.",
    "You are vetting wholesale brands and need a structured brand score, not just product data.",
    "You want profit, ROI and fee maths done for you alongside the market data.",
  ],
  faqs: [
    { q: "Is WholesaleOS a Keepa alternative?", a: "Not exactly — WholesaleOS uses the Keepa API for its data, so it is more accurate to call it a layer on top of Keepa. Keepa provides the price and BSR history; WholesaleOS scores it and returns a buy/no-buy verdict, profit calculations and a brand score." },
    { q: "Do I still need Keepa if I use WholesaleOS?", a: "For the analysis WholesaleOS provides, no — it pulls the Keepa data for you. Some sellers still keep the Keepa browser extension for reading charts inline while they shop. The two are complementary rather than mutually exclusive." },
    { q: "What does WholesaleOS add on top of Keepa data?", a: "A 15-criteria product viability score with hard-reject checks (IP complaints, hazmat, authenticity), an FBA profit and ROI calculator, monthly sales estimation, and an 11-criteria Brand Intelligence score for vetting wholesale brands — none of which Keepa itself produces." },
  ],
};

const JUNGLE_SCOUT: Comparison = {
  slug: "wholesaleos-vs-jungle-scout",
  competitor: "Jungle Scout",
  positioning:
    "Jungle Scout is a broad Amazon product-research and seller suite, best known for product discovery, an opportunity finder and keyword tools, oriented largely towards private-label sellers.",
  intro:
    "Jungle Scout and WholesaleOS overlap on product research but aim at different jobs. Jungle Scout is a wide suite for finding product ideas and building private-label listings. WholesaleOS is a focused instrument for scoring a specific product or wholesale brand you are already considering, and returning a verdict.",
  rows: [
    { dimension: "Breadth", wholesaleos: "Focused: product and brand viability scoring", competitor: "Broad suite: discovery, keywords, listings, more" },
    { dimension: "Primary user", wholesaleos: "Wholesale and online-arbitrage sellers", competitor: "Largely private-label sellers" },
    { dimension: "Verdict", wholesaleos: "Scored EXCELLENT → REJECT with reasons", competitor: "Metrics and estimates to interpret" },
    { dimension: "Brand vetting", wholesaleos: "11-criteria Brand Intelligence", competitor: "Not a wholesale brand-vetting tool" },
    { dimension: "Approach", wholesaleos: "Analyse an ASIN or brand you already have", competitor: "Discover new product opportunities" },
  ],
  chooseCompetitor: [
    "You are hunting for brand-new private-label product ideas from scratch.",
    "You want an all-in-one suite covering keywords and listing optimisation too.",
    "Product discovery, not deal-by-deal vetting, is your main workflow.",
  ],
  chooseWholesaleOS: [
    "You already have ASINs or brands and want a fast, scored go/no-go.",
    "You source wholesale or online arbitrage rather than private label.",
    "You need to vet a brand's IP, hazmat and seller-density risk before reaching out.",
  ],
  faqs: [
    { q: "Is WholesaleOS a Jungle Scout alternative?", a: "For wholesale and online-arbitrage sourcing, it can replace the vetting step — you paste an ASIN or brand and get a scored verdict. But Jungle Scout is a broader suite aimed more at private-label discovery, so which fits depends on your model. Many sellers use a discovery tool and a vetting tool together." },
    { q: "Which is better for Amazon wholesale?", a: "WholesaleOS is purpose-built for wholesale: its Brand Intelligence module scores a brand across 11 criteria — IP complaints, hazmat catalogue percentage, FBA seller density, business registration and more — which general product-research suites do not focus on." },
    { q: "Does WholesaleOS do keyword research?", a: "No. WholesaleOS is deliberately focused on product and brand viability scoring, not keywords, PPC or listing optimisation. If keyword research is central to your work, a broad suite will serve you better for that part." },
  ],
};

const HELIUM_10: Comparison = {
  slug: "wholesaleos-vs-helium-10",
  competitor: "Helium 10",
  positioning:
    "Helium 10 is a large all-in-one Amazon seller suite spanning keyword research, listing optimisation, PPC management and product research.",
  intro:
    "Helium 10 is a comprehensive toolbox; WholesaleOS is a focused instrument. If you want dozens of tools across the whole selling workflow, that is Helium 10's strength. If you want one clear thing — a scored verdict on a product or a wholesale brand — that is what WholesaleOS is for.",
  rows: [
    { dimension: "Scope", wholesaleos: "One job, done thoroughly: viability scoring", competitor: "Many tools across the whole seller workflow" },
    { dimension: "Focus", wholesaleos: "Product + wholesale brand vetting", competitor: "Keywords, PPC, listings, research" },
    { dimension: "Learning curve", wholesaleos: "Paste an ASIN, read the verdict", competitor: "Large suite; more to learn" },
    { dimension: "Brand Intelligence", wholesaleos: "11-criteria wholesale brand score", competitor: "Not a wholesale brand-vetting focus" },
    { dimension: "Best for", wholesaleos: "Fast sourcing decisions", competitor: "Running many parts of an Amazon business" },
  ],
  chooseCompetitor: [
    "You want one subscription covering keywords, PPC and listing tools as well.",
    "You run a large private-label operation with many workflows.",
    "You value breadth of tooling over a single focused output.",
  ],
  chooseWholesaleOS: [
    "You want a fast, scored buy/no-buy answer without a big toolset to learn.",
    "Your model is wholesale or online arbitrage, deal by deal.",
    "Brand risk (IP, hazmat, seller density) is a real part of your decision.",
  ],
  faqs: [
    { q: "Is WholesaleOS a Helium 10 alternative?", a: "For the specific task of scoring a product or vetting a wholesale brand, yes — and with far less to learn. For keyword research, PPC and listing optimisation, Helium 10 covers ground WholesaleOS deliberately does not. They suit different needs." },
    { q: "Why choose a focused tool over an all-in-one suite?", a: "A focused tool does one job without the overhead of features you will not use. WholesaleOS returns a scored verdict from live Keepa data in seconds; there is no suite to configure. If you only need the sourcing decision, that focus is the point." },
    { q: "Does WholesaleOS handle PPC or keywords?", a: "No — those are outside its scope by design. WholesaleOS scores product and brand viability. If PPC and keyword tooling are central to your work, pair it with a suite that specialises there." },
  ],
};

const SELLERAMP: Comparison = {
  slug: "wholesaleos-vs-selleramp",
  competitor: "SellerAmp",
  positioning:
    "SellerAmp (SAS) is a widely used sourcing and product-analysis tool, popular with online-arbitrage and wholesale sellers for its quick profit analysis and mobile scanning.",
  intro:
    "SellerAmp and WholesaleOS are the closest of these comparisons — both are sourcing-decision tools rather than broad suites. The distinction WholesaleOS draws is its structured scoring: a weighted 15-criteria product verdict, and a dedicated 11-criteria Brand Intelligence score for vetting wholesale brands.",
  rows: [
    { dimension: "Category", wholesaleos: "Sourcing decision + brand vetting", competitor: "Sourcing / product analysis" },
    { dimension: "Product output", wholesaleos: "Weighted 15-criteria score with hard-reject checks", competitor: "Profit analysis and sourcing metrics" },
    { dimension: "Brand vetting", wholesaleos: "Dedicated 11-criteria Brand Intelligence", competitor: "Product-level analysis" },
    { dimension: "Data", wholesaleos: "Live Keepa API", competitor: "Amazon + Keepa data" },
    { dimension: "Best for", wholesaleos: "Wholesale brand and product scoring", competitor: "Fast OA sourcing checks, including on mobile" },
  ],
  chooseCompetitor: [
    "You want a quick mobile scan-and-analyse flow while sourcing in a store.",
    "Your workflow is fast online-arbitrage checks at the product level.",
    "You are already comfortable in the SellerAmp interface.",
  ],
  chooseWholesaleOS: [
    "You want a structured, weighted score and a clear verdict, not just metrics.",
    "You vet wholesale brands and want a dedicated brand-level risk score.",
    "Hard-reject checks (IP, hazmat, authenticity) matter to your decision.",
  ],
  faqs: [
    { q: "Is WholesaleOS a SellerAmp alternative?", a: "Yes — both are sourcing-decision tools rather than broad suites. WholesaleOS differs in its structured scoring: a weighted 15-criteria product verdict and a separate 11-criteria Brand Intelligence score for wholesale brand vetting. Which fits depends on whether you want quick metrics or a scored verdict." },
    { q: "Which is better for wholesale brand vetting?", a: "WholesaleOS is built specifically for it. Its Brand Intelligence module scores a brand across 11 criteria — website and business verification, IP complaint history, hazmat catalogue percentage, FBA seller density, sales velocity and more — and returns an APPROVED or REJECTED verdict before you contact a supplier." },
    { q: "Does WholesaleOS have a mobile scanner?", a: "WholesaleOS is a web-based tool centred on ASIN and brand analysis. If in-store mobile scanning is core to your sourcing, that is a workflow SellerAmp is well known for." },
  ],
};

export const COMPARISONS: Comparison[] = [KEEPA, JUNGLE_SCOUT, HELIUM_10, SELLERAMP];

export const comparisonBySlug = (slug: string) =>
  COMPARISONS.find((c) => c.slug === slug);
