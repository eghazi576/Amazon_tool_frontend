/**
 * Content for the /blog and /blog/<slug> pages.
 *
 * Same ground rules as the comparison pages: every claim about WholesaleOS is
 * one the product actually delivers, competitors and third-party tools are
 * described only by their well-established category, and nothing is invented.
 * These pages are indexable and read by AI answer engines, so accuracy is the
 * point.
 *
 * A paragraph may embed an internal link with the token [[/path|anchor text]].
 * BlogPost renders that as a real <Link>, so posts carry contextual internal
 * links without the body needing to hold JSX.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  /** Meta description and the excerpt shown on the index. */
  description: string;
  /** ISO date, e.g. "2026-07-27". */
  date: string;
  readMinutes: number;
  tag: string;
  body: Block[];
  /** Internal links shown in the "Related" section. */
  related: { to: string; label: string }[];
};

const WHAT_IS: Post = {
  slug: "what-is-an-amazon-product-research-tool",
  title: "What Is an Amazon Product Research Tool? (And How to Pick One)",
  description:
    "An Amazon product research tool turns raw market data into a sourcing decision. Here is what one actually does, the questions it should answer, and how to choose one for wholesale and FBA.",
  date: "2026-07-27",
  readMinutes: 6,
  tag: "Guides",
  body: [
    {
      type: "p",
      text: "An Amazon product research tool is software that helps a seller decide whether a product is worth buying to resell. It pulls the market data behind a listing, price history, Best Seller Rank, seller count, review volume, and turns it into something you can act on. The good ones do the arithmetic and the judgement you would otherwise do by hand across five browser tabs.",
    },
    {
      type: "p",
      text: "That is the whole job: shorten the distance between \"here is an ASIN\" and \"buy it, or skip it.\" Everything else is detail.",
    },
    { type: "h2", text: "What an Amazon product research tool actually does" },
    {
      type: "p",
      text: "Underneath the branding, most tools in this category do some combination of the following:",
    },
    {
      type: "ul",
      items: [
        "Retrieve market history, price and Best Seller Rank over time, usually from the Keepa API.",
        "Estimate demand, a monthly sales figure derived from the sales badge, BSR drops, or a category lookup.",
        "Calculate profit, referral and fulfillment fees, storage, net margin, ROI, and a break-even price.",
        "Flag risk, IP complaints, hazmat, gating, and authenticity concerns that can sink a deal after you have bought.",
        "Return a verdict, a score or signal that says how the product looks overall.",
      ],
    },
    {
      type: "p",
      text: "Some tools stop at the raw data and leave the interpretation to you. Others go all the way to a scored verdict. Neither is wrong; they suit different sellers.",
    },
    { type: "h2", text: "The two questions every sourcing decision comes down to" },
    {
      type: "p",
      text: "Strip away the dashboards and every sourcing decision is really two questions. Will it sell? And will it make money after Amazon takes its cut? A product research tool earns its keep by answering both quickly and honestly, demand from the sales and BSR history, profitability from real fee math rather than a guess.",
    },
    {
      type: "p",
      text: "For wholesale specifically there is a third question that product-level tools often miss: is the brand itself safe to work with? A brand with a history of IP complaints or mass account takedowns can cost you far more than one bad SKU. That is [[/dashboard/brand|brand vetting]], and it is a different job from scoring a single product.",
    },
    { type: "h2", text: "What to look for when choosing one" },
    {
      type: "ul",
      items: [
        "Live data, not stale snapshots. Price and BSR history should come from a real source and be current.",
        "Honest profit math. Fees should be calculated from weight, dimensions and category, not assumed.",
        "Clear risk flags. Gating and IP problems are easier to avoid before you buy than to unwind after.",
        "A verdict you can trust. A score is only useful if you understand what drives it and where it can be wrong.",
        "Focus that matches your model. A private-label discovery suite and a wholesale vetting tool solve different problems.",
      ],
    },
    { type: "h2", text: "Where WholesaleOS fits" },
    {
      type: "p",
      text: "WholesaleOS is an Amazon product research tool built for wholesale and online-arbitrage sellers. You give it an ASIN or a brand; it reads live Keepa data and returns a scored buy or no-buy verdict across 15 weighted criteria, with a built-in FBA profit calculator and hard-reject checks for IP complaints, hazmat and authenticity. For wholesale, its Brand Intelligence module scores a brand across 11 criteria before you contact a supplier.",
    },
    {
      type: "p",
      text: "It is not the only approach, and it is not the right fit for everyone. If you want to see how it lines up against the tools you already know, read the honest [[/compare|tool comparisons]], or the wider [[/best-amazon-wholesale-tools|guide to Amazon wholesale tools]]. If you just want to understand how the scoring works, the [[/faq|FAQ]] walks through it.",
    },
  ],
  related: [
    { to: "/compare", label: "WholesaleOS vs other Amazon tools" },
    { to: "/best-amazon-wholesale-tools", label: "Best Amazon wholesale tools guide" },
    { to: "/faq", label: "How the scoring works (FAQ)" },
  ],
};

const VET_BRAND: Post = {
  slug: "how-to-vet-a-wholesale-brand",
  title: "How to Vet a Wholesale Brand Before You Buy",
  description:
    "Product scoring tells you if an ASIN sells. Brand vetting tells you if the brand behind it is safe to stock. Here is what to check before you open a wholesale account.",
  date: "2026-07-24",
  readMinutes: 5,
  tag: "Wholesale",
  body: [
    {
      type: "p",
      text: "Most Amazon research happens at the product level: is this ASIN profitable, does it sell, what does the price history look like. That matters, but for wholesale it is only half the picture. When you open an account with a brand and buy a case pack, you are betting on the brand, not just one product. Vetting the brand first is what separates a repeatable wholesale operation from a string of expensive surprises.",
    },
    { type: "h2", text: "Why the brand matters more than the SKU" },
    {
      type: "p",
      text: "A single unprofitable product costs you that product. A bad brand can cost you your account. Brands that generate frequent intellectual-property complaints, sell heavily gated or hazardous catalogues, or have a history of mass takedowns put every seller who stocks them at risk. No product margin is worth a suspension.",
    },
    { type: "h2", text: "What to check before you commit" },
    {
      type: "ul",
      items: [
        "A real business behind the brand: an official website and registered business details, not just a storefront.",
        "IP complaint history: a pattern of complaints against sellers of the brand is a red flag.",
        "Seller density: too many FBA sellers on each ASIN means a race to the bottom on price; too few can mean the brand polices its listings tightly.",
        "Catalogue risk: a brand heavy on hazmat, adult, or gated items narrows what you can actually sell.",
        "Sales velocity: enough monthly movement per ASIN that your inventory will not sit.",
      ],
    },
    {
      type: "p",
      text: "None of these is a single yes or no. Vetting is about weighing them together into a decision you can defend, ideally before you spend an hour on the phone with a supplier.",
    },
    { type: "h2", text: "Turning the checklist into a verdict" },
    {
      type: "p",
      text: "This is exactly what WholesaleOS Brand Intelligence is built for. It scores a brand across 11 criteria, website and business verification, IP complaint history, hazmat catalogue percentage, FBA seller density, sales velocity and more, and returns an APPROVED or REJECTED verdict. Hard-reject criteria (no official website, no registered business details, a history of mass takedowns) fail a brand outright, so the risky ones are filtered before you invest time in them.",
    },
    {
      type: "p",
      text: "Product scoring and brand vetting work best together: vet the brand, then score its individual ASINs. If you want the product side too, that is what the [[/dashboard/research|product research]] tool does, and the [[/faq|FAQ]] explains how both scores are calculated.",
    },
  ],
  related: [
    { to: "/faq", label: "How brand scoring works (FAQ)" },
    { to: "/compare/wholesaleos-vs-smartscout", label: "WholesaleOS vs SmartScout" },
    { to: "/best-amazon-wholesale-tools", label: "Best Amazon wholesale tools guide" },
  ],
};

const KEEPA: Post = {
  slug: "how-to-read-a-keepa-chart",
  title: "How to Read a Keepa Chart: Price, BSR and Sell-Through",
  description:
    "A Keepa chart holds most of what you need to judge an Amazon product, if you know which lines to read. Here is how to turn price and BSR history into a demand and stability read.",
  date: "2026-07-21",
  readMinutes: 5,
  tag: "Data",
  body: [
    {
      type: "p",
      text: "Keepa is the reference source for Amazon price and Best Seller Rank history, and its chart packs a surprising amount of a sourcing decision into a few coloured lines. Most product research tools, WholesaleOS included, build on the Keepa API. Learning to read the chart directly makes you faster and sharper whichever tool you use.",
    },
    { type: "h2", text: "The lines that matter" },
    {
      type: "ul",
      items: [
        "Price history: what the item has actually sold for over time, including the Buy Box, new, and Amazon-direct prices.",
        "Best Seller Rank (BSR): the product's rank in its category. Lower is better, and the shape over time matters more than any single number.",
        "Offer count: how many sellers are on the listing, a proxy for competition.",
      ],
    },
    { type: "h2", text: "Reading demand from BSR drops" },
    {
      type: "p",
      text: "Each time a unit sells, the product's BSR improves (drops) and then drifts back up until the next sale. On the chart this shows up as a saw-tooth pattern. Frequent, sharp drops mean regular sales; a flat line that rarely moves means the item sits. Counting those drops over a window is one of the main ways demand is estimated when Amazon does not publish a sales figure.",
    },
    { type: "h2", text: "Reading stability from price" },
    {
      type: "p",
      text: "A price line that holds steady suggests a stable, defensible listing. A line that saw-tooths downward, or collapses when the offer count spikes, is a warning: more sellers arriving and undercutting each other erodes the margin you were counting on. Always read price and offer count together.",
    },
    { type: "h2", text: "From chart to verdict" },
    {
      type: "p",
      text: "The chart tells you the story; the decision still needs profit math and risk checks on top. WholesaleOS reads the same live Keepa data, estimates monthly sales from BSR drops, runs the FBA fee and ROI math, and returns a scored verdict, so you get the conclusion the chart points to without reading every line by hand. If you would rather see how tools differ on this, the [[/compare/wholesaleos-vs-keepa|WholesaleOS vs Keepa comparison]] lays it out.",
    },
  ],
  related: [
    { to: "/compare/wholesaleos-vs-keepa", label: "WholesaleOS vs Keepa" },
    { to: "/faq", label: "Where the data comes from (FAQ)" },
    { to: "/sign-in", label: "Sign in to WholesaleOS" },
  ],
};

export const POSTS: Post[] = [WHAT_IS, VET_BRAND, KEEPA];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);

/** Newest first, for the index. */
export const postsByDate = () => [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
