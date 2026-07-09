/**
 * Emits dist/sitemap.xml and dist/robots.txt from the route manifest.
 *
 * These files used to live in public/ and were maintained by hand, which is how
 * they ended up pointing at the apex host while the site served from www, and
 * listing routes by memory rather than by what the router actually mounts.
 * Deriving both from src/lib/routes.js means a new public route shows up in the
 * sitemap the moment it is registered.
 *
 * Runs after `vite build`, so it writes into dist/ directly. Anything in
 * public/ would be copied over these; that is why the old copies were deleted.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { SITE_URL, SITEMAP_ROUTES, canonical } from "../src/lib/routes.js";

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");

/** Build date, not "now" — a rebuild without content changes shouldn't churn lastmod. */
const lastmod = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_ROUTES.map(
  (r) => `  <url>
    <loc>${canonical(r.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.sitemap.changefreq}</changefreq>
    <priority>${r.sitemap.priority}</priority>
  </url>`,
).join("\n")}
</urlset>
`;

// Agent rules are curated, not derived. Only the Sitemap line depends on SITE_URL.
const robots = `User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /admin/

User-agent: GPTBot
Allow: /
Disallow: /dashboard/
Disallow: /admin/

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

await mkdir(DIST, { recursive: true });
await writeFile(resolve(DIST, "sitemap.xml"), sitemap, "utf8");
await writeFile(resolve(DIST, "robots.txt"), robots, "utf8");

console.log(`[seo] sitemap.xml  ${SITEMAP_ROUTES.length} urls, host ${SITE_URL}`);
for (const r of SITEMAP_ROUTES) console.log(`[seo]   ${canonical(r.path)}`);
console.log("[seo] robots.txt  written");
