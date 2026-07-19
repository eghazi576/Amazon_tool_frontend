/**
 * Single source of truth for every publicly reachable route.
 *
 * Consumed by three places that must never disagree:
 *   - src/components/Seo.tsx           per-page <head> tags
 *   - scripts/prerender.mjs            which routes get snapshotted to static HTML
 *   - scripts/generate-seo-files.mjs   sitemap.xml + robots.txt
 *
 * Plain ESM (not TypeScript) so the Node build scripts can import it directly.
 *
 * Authenticated routes (/dashboard/*, /admin) are deliberately absent: they sit
 * behind RequireAuth, must never be prerendered, and must never be indexed.
 */

export const SITE_URL = "https://www.thewholesaleos.com";
export const SITE_NAME = "WholesaleOS";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

/** Absolute, canonical URL for a route path. */
export const canonical = (path) => new URL(path, SITE_URL).href;

/**
 * @typedef {object} RouteMeta
 * @property {string}  path         router path
 * @property {string}  title        used for <title> and og:title (kept identical on purpose)
 * @property {string}  description  used for meta description and og:description
 * @property {boolean} index        false emits `noindex, follow`
 * @property {boolean} prerender    snapshot to static HTML at build time
 * @property {{changefreq: string, priority: string}|null} sitemap  null omits from sitemap.xml
 */

/** @type {RouteMeta[]} */
export const ROUTES = [
  {
    path: "/",
    title: "WholesaleOS | AI Wholesale Analyst for Amazon Sellers",
    description:
      "Research Amazon products, score wholesale brands, and get a buy or no-buy verdict in seconds. Live Keepa data, profit math, and IP checks in one tool.",
    index: true,
    prerender: true,
    sitemap: { changefreq: "weekly", priority: "1.0" },
  },
  {
    path: "/faq",
    title: "WholesaleOS FAQ | Amazon FBA Product & Brand Research",
    description:
      "How the 15-criteria viability score works, how Brand Intelligence vets wholesale brands, where the live Keepa data comes from, and how accurate estimates are.",
    index: true,
    prerender: true,
    sitemap: { changefreq: "monthly", priority: "0.7" },
  },

  // Comparison pages. High commercial intent, low competition, and exactly the
  // kind of balanced side-by-side content AI answer engines cite. Each names one
  // competitor. The body lives in src/lib/comparisons.ts; only SEO metadata is
  // here. Keep the two in sync when adding a comparison.
  {
    path: "/compare",
    title: "WholesaleOS Comparisons | vs Keepa, Jungle Scout, Helium 10",
    description:
      "Honest side-by-side comparisons of WholesaleOS against Keepa, Jungle Scout, Helium 10 and SellerAmp for Amazon wholesale and online-arbitrage sourcing.",
    index: true,
    prerender: true,
    sitemap: { changefreq: "monthly", priority: "0.6" },
  },
  {
    path: "/compare/wholesaleos-vs-keepa",
    title: "WholesaleOS vs Keepa | Scored Verdict vs Raw Data",
    description:
      "WholesaleOS is built on the Keepa API and adds a scored buy/no-buy verdict, profit maths and brand vetting on top of Keepa's price and BSR history. Compared fairly.",
    index: true,
    prerender: true,
    sitemap: { changefreq: "monthly", priority: "0.6" },
  },
  {
    path: "/compare/wholesaleos-vs-jungle-scout",
    title: "WholesaleOS vs Jungle Scout | Wholesale Scoring vs Suite",
    description:
      "A focused wholesale and brand-scoring tool versus a broad product-research suite. When to choose WholesaleOS and when Jungle Scout fits better — compared honestly.",
    index: true,
    prerender: true,
    sitemap: { changefreq: "monthly", priority: "0.6" },
  },
  {
    path: "/compare/wholesaleos-vs-helium-10",
    title: "WholesaleOS vs Helium 10 | Focused Tool vs All-in-One",
    description:
      "A focused product and wholesale-brand scoring tool versus a large all-in-one Amazon suite. Where each one wins, and how to choose — a fair side-by-side.",
    index: true,
    prerender: true,
    sitemap: { changefreq: "monthly", priority: "0.6" },
  },
  {
    path: "/compare/wholesaleos-vs-selleramp",
    title: "WholesaleOS vs SellerAmp | Structured Scoring vs Sourcing",
    description:
      "Both are sourcing-decision tools. WholesaleOS adds weighted 15-criteria product scoring and dedicated 11-criteria wholesale brand vetting. Compared fairly.",
    index: true,
    prerender: true,
    sitemap: { changefreq: "monthly", priority: "0.6" },
  },
  {
    path: "/sign-up",
    title: "Create Your Free WholesaleOS Account | Amazon FBA Tool",
    description:
      "Create a free WholesaleOS account and run a full market analysis on your first Amazon ASIN in under three seconds. No credit card required to get started.",
    index: true,
    prerender: true,
    sitemap: { changefreq: "monthly", priority: "0.8" },
  },
  // A login form has nothing to offer a searcher, and Google says so. Kept
  // prerendered (link previews, and a noindex only counts if it can be read)
  // but marked noindex and dropped from the sitemap.
  //
  // /sign-up above stays indexable on purpose: it is a real landing page with
  // unique copy, and it is where "wholesaleos sign up" should land.
  {
    path: "/sign-in",
    title: "Sign In to WholesaleOS | Amazon FBA Product Research",
    description:
      "Sign in to WholesaleOS to research Amazon products, score wholesale brands, and review every product lookup and brand evaluation saved to your account.",
    index: false,
    prerender: true,
    sitemap: null,
  },

  // Legal pages. Indexable and prerendered -- they are a trust signal Google
  // looks for, and a footer link to a dead "#" is worse than no link at all.
  // Low sitemap priority: real, but not what we want to rank for.
  {
    path: "/privacy",
    title: "Privacy Policy | WholesaleOS",
    description:
      "What WholesaleOS collects and what it never does. No analytics, no advertising trackers, no selling of your data, and no cookies at all on the public pages.",
    index: true,
    prerender: true,
    sitemap: { changefreq: "yearly", priority: "0.3" },
  },
  {
    path: "/terms",
    title: "Terms of Service | WholesaleOS",
    description:
      "The agreement between you and WholesaleOS, including the data-accuracy disclaimer and our independence from Amazon. Sales figures are estimates, not guarantees.",
    index: true,
    prerender: true,
    sitemap: { changefreq: "yearly", priority: "0.3" },
  },
  {
    path: "/cookies",
    title: "Cookie Policy | WholesaleOS",
    description:
      "WholesaleOS sets two cookies, both strictly necessary to keep you signed in, and both httpOnly. There are no analytics, advertising or tracking cookies.",
    index: true,
    prerender: true,
    sitemap: { changefreq: "yearly", priority: "0.3" },
  },

  // Publicly reachable, but thin and not worth indexing. Prerendering them buys
  // nothing (they are behind an email link) and they stay out of the sitemap.
  {
    path: "/forgot-password",
    title: "Reset Your Password | WholesaleOS",
    description: "Request a password reset link for your WholesaleOS account.",
    index: false,
    prerender: false,
    sitemap: null,
  },
  {
    path: "/reset-password",
    title: "Choose a New Password | WholesaleOS",
    description: "Set a new password for your WholesaleOS account.",
    index: false,
    prerender: false,
    sitemap: null,
  },
];

/** Route paths to snapshot at build time. */
export const PRERENDER_ROUTES = ROUTES.filter((r) => r.prerender).map((r) => r.path);

/** Routes that belong in sitemap.xml. */
export const SITEMAP_ROUTES = ROUTES.filter((r) => r.sitemap !== null);

/**
 * Look up a route's SEO metadata by path.
 * Throws rather than silently rendering a page with the wrong <title>.
 * @param {string} path
 * @returns {RouteMeta}
 */
export function routeMeta(path) {
  const match = ROUTES.find((r) => r.path === path);
  if (!match) throw new Error(`routeMeta: no SEO metadata registered for "${path}"`);
  return match;
}
