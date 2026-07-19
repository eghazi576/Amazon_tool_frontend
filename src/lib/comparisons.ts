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

const AMZSCOUT: Comparison = {
  slug: "wholesaleos-vs-amzscout",
  competitor: "AMZScout",
  positioning:
    "AMZScout is an Amazon product-research suite and browser extension, known for its product database, sales estimates and keyword tools, oriented largely towards product discovery.",
  intro:
    "AMZScout and WholesaleOS both touch product research, but from opposite ends. AMZScout is a discovery suite for finding product ideas and estimating demand. WholesaleOS is a focused instrument for scoring a specific product or wholesale brand you already have in front of you.",
  rows: [
    { dimension: "Core job", wholesaleos: "Score a product/brand you already have", competitor: "Discover new product opportunities" },
    { dimension: "Output", wholesaleos: "Scored EXCELLENT → REJECT verdict", competitor: "Estimates and metrics to interpret" },
    { dimension: "Brand vetting", wholesaleos: "11-criteria Brand Intelligence", competitor: "Not a wholesale brand-vetting focus" },
    { dimension: "Model fit", wholesaleos: "Wholesale, online arbitrage", competitor: "Largely private-label discovery" },
    { dimension: "Data", wholesaleos: "Live Keepa API", competitor: "Amazon marketplace estimates" },
  ],
  chooseCompetitor: [
    "You are searching for brand-new product ideas from scratch.",
    "You want a product database and sales estimator for discovery.",
    "Private-label research is your main workflow.",
  ],
  chooseWholesaleOS: [
    "You already have an ASIN or brand and want a scored go/no-go.",
    "You source wholesale or online arbitrage, not private label.",
    "You need structured brand-risk vetting before contacting a supplier.",
  ],
  faqs: [
    { q: "Is WholesaleOS an AMZScout alternative?", a: "They serve different steps. AMZScout is a discovery suite for finding product ideas; WholesaleOS scores a product or brand you already have and returns a verdict. For wholesale and online-arbitrage vetting, WholesaleOS replaces that step; for private-label discovery, a suite like AMZScout fits better." },
    { q: "Which is better for wholesale sourcing?", a: "WholesaleOS is built for it — its Brand Intelligence module scores wholesale brands across 11 criteria including IP complaints, hazmat percentage and FBA seller density, which discovery-focused suites do not centre on." },
    { q: "Does WholesaleOS estimate demand for new products?", a: "WholesaleOS estimates monthly sales for a given ASIN from live Keepa data, but it is designed to evaluate products you bring to it, not to browse a database of new ideas. For open-ended discovery, a product-database tool is the better fit." },
  ],
};

const TACTICAL_ARBITRAGE: Comparison = {
  slug: "wholesaleos-vs-tactical-arbitrage",
  competitor: "Tactical Arbitrage",
  positioning:
    "Tactical Arbitrage is a bulk sourcing and arbitrage scanning tool that searches retailer and wholesale sources at scale for products that could be resold profitably on Amazon.",
  intro:
    "These two sit next to each other in a sourcing workflow rather than competing. Tactical Arbitrage is about scanning many sources at scale to surface candidates. WholesaleOS is about taking a candidate — or a whole brand — and returning a structured, scored verdict on it.",
  rows: [
    { dimension: "Core job", wholesaleos: "Score and vet a specific product or brand", competitor: "Scan many sources for candidates at scale" },
    { dimension: "Scale", wholesaleos: "Deep analysis, one ASIN or brand at a time", competitor: "Bulk lists across retailers/wholesale" },
    { dimension: "Verdict", wholesaleos: "Weighted 15-criteria score with reasons", competitor: "Profitability flags across scanned items" },
    { dimension: "Brand vetting", wholesaleos: "Dedicated 11-criteria brand score", competitor: "Product-level sourcing focus" },
    { dimension: "Best for", wholesaleos: "The decision on a shortlisted deal", competitor: "Finding the shortlist in the first place" },
  ],
  chooseCompetitor: [
    "You want to scan large retailer or wholesale price lists in bulk.",
    "Your bottleneck is finding candidates, not deciding on them.",
    "You run high-volume online arbitrage sourcing.",
  ],
  chooseWholesaleOS: [
    "You have candidates and want a rigorous, scored decision on each.",
    "You are evaluating a wholesale brand, not just individual products.",
    "Hard-reject checks (IP, hazmat, authenticity) matter to your call.",
  ],
  faqs: [
    { q: "Is WholesaleOS a Tactical Arbitrage alternative?", a: "Not really — they solve different halves of sourcing. Tactical Arbitrage finds candidates by scanning many sources; WholesaleOS decides on a candidate with a scored verdict and brand vetting. Many sellers would use a scanner to build a shortlist and a scoring tool to decide, rather than one instead of the other." },
    { q: "Can WholesaleOS scan bulk product lists?", a: "No. WholesaleOS analyses one ASIN or brand at a time in depth. If bulk scanning across retailers and wholesale lists is your need, that is what a tool like Tactical Arbitrage is designed for." },
    { q: "Which is better for wholesale brand vetting?", a: "WholesaleOS — its Brand Intelligence module produces an APPROVED or REJECTED verdict on a brand across 11 criteria before you invest time in a supplier, which bulk product scanners are not built to do." },
  ],
};

const SMARTSCOUT: Comparison = {
  slug: "wholesaleos-vs-smartscout",
  competitor: "SmartScout",
  positioning:
    "SmartScout is an Amazon brand, category and seller research tool used to discover brands and analyse the competitive landscape across the catalogue.",
  intro:
    "SmartScout and WholesaleOS both work at the brand level, which makes this a closer comparison than most. SmartScout helps you discover and explore brands across Amazon's catalogue. WholesaleOS takes a specific brand and scores its viability as a wholesale opportunity.",
  rows: [
    { dimension: "Brand angle", wholesaleos: "Score a specific brand's wholesale viability", competitor: "Discover and explore brands at scale" },
    { dimension: "Output", wholesaleos: "APPROVED / REJECTED across 11 criteria", competitor: "Brand and category data to explore" },
    { dimension: "Risk checks", wholesaleos: "IP complaints, hazmat, MAP, seller density", competitor: "Catalogue and seller analytics" },
    { dimension: "Product scoring", wholesaleos: "15-criteria product verdict too", competitor: "Catalogue-level research focus" },
    { dimension: "Best for", wholesaleos: "Deciding whether to pursue a brand", competitor: "Finding brands worth looking at" },
  ],
  chooseCompetitor: [
    "You want to explore Amazon's brand and category landscape broadly.",
    "You are building a list of brands to research.",
    "Catalogue-wide analytics are central to your workflow.",
  ],
  chooseWholesaleOS: [
    "You have a brand and want a scored approve/reject on it.",
    "You need structured risk checks (IP, hazmat, MAP) before outreach.",
    "You also want a product-level verdict on the brand's ASINs.",
  ],
  faqs: [
    { q: "Is WholesaleOS a SmartScout alternative?", a: "They complement more than compete. SmartScout is strong for discovering brands across the catalogue; WholesaleOS is built to then score a chosen brand's viability with an approve/reject verdict. Discovery and vetting are different steps, and a seller might reasonably use both." },
    { q: "Which is better for vetting a wholesale brand?", a: "WholesaleOS is purpose-built for vetting. Its Brand Intelligence module scores a brand across 11 weighted criteria — website and business verification, IP complaint history, hazmat catalogue percentage, FBA seller density and more — and returns a clear verdict before you contact the supplier." },
    { q: "Does WholesaleOS help discover new brands?", a: "WholesaleOS is designed to evaluate a brand you bring to it, using live Keepa data, rather than to browse the catalogue for new ones. For open brand discovery, a catalogue-research tool is the better starting point." },
  ],
};

const SELLER_ASSISTANT: Comparison = {
  slug: "wholesaleos-vs-seller-assistant",
  competitor: "Seller Assistant",
  positioning:
    "Seller Assistant is a sourcing browser extension for online arbitrage and wholesale that surfaces profit, restriction and alert checks inline while you browse product pages.",
  intro:
    "This is one of the closest comparisons: both target online-arbitrage and wholesale sourcing decisions. The difference is form and depth. Seller Assistant works inline as a browser extension while you shop; WholesaleOS is a web app that returns a structured, weighted score and a dedicated brand-vetting verdict.",
  rows: [
    { dimension: "Form", wholesaleos: "Web app — paste an ASIN or brand", competitor: "Browser extension, inline on the page" },
    { dimension: "Product output", wholesaleos: "Weighted 15-criteria score with hard rejects", competitor: "Inline profit and restriction checks" },
    { dimension: "Brand vetting", wholesaleos: "Dedicated 11-criteria brand verdict", competitor: "Primarily product-level checks" },
    { dimension: "Data", wholesaleos: "Live Keepa API", competitor: "Amazon + data sources inline" },
    { dimension: "Best for", wholesaleos: "A structured, scored decision + brand vetting", competitor: "Fast inline checks while browsing" },
  ],
  chooseCompetitor: [
    "You want checks inline on the Amazon page as you browse.",
    "A lightweight extension fits your sourcing flow best.",
    "Your focus is quick per-product go/no-go while shopping.",
  ],
  chooseWholesaleOS: [
    "You want a weighted score and a clear verdict, not just inline flags.",
    "You vet wholesale brands and want a dedicated brand-level score.",
    "You want product and brand analysis in one place, from live Keepa data.",
  ],
  faqs: [
    { q: "Is WholesaleOS a Seller Assistant alternative?", a: "For the sourcing decision, yes — both evaluate whether a product is worth buying. WholesaleOS differs in depth and form: a web app that returns a weighted 15-criteria score plus a dedicated 11-criteria brand verdict, versus an inline browser extension focused on per-product checks. Which fits depends on whether you prefer inline speed or structured scoring." },
    { q: "Does WholesaleOS work as a browser extension?", a: "No — WholesaleOS is a web app where you paste an ASIN or brand and get a full analysis. If inline checks on the Amazon page itself are core to how you source, an extension like Seller Assistant is designed for that." },
    { q: "Which is better for wholesale brands?", a: "WholesaleOS is built specifically for wholesale brand vetting, scoring a brand across 11 criteria and returning an APPROVED or REJECTED verdict — a dedicated brand workflow beyond per-product sourcing checks." },
  ],
};

export const COMPARISONS: Comparison[] = [
  KEEPA,
  JUNGLE_SCOUT,
  HELIUM_10,
  SELLERAMP,
  AMZSCOUT,
  TACTICAL_ARBITRAGE,
  SMARTSCOUT,
  SELLER_ASSISTANT,
];

export const comparisonBySlug = (slug: string) =>
  COMPARISONS.find((c) => c.slug === slug);
