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
