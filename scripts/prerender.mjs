/**
 * Snapshots the public marketing routes to static HTML after `vite build`.
 *
 * The app is a client-rendered SPA: the server response is <div id="root"></div>
 * and nothing else, so a crawler that does not execute JavaScript sees an empty
 * page. This script serves the freshly built dist/, loads each public route in
 * headless Chrome, waits for React to finish, and writes the resulting DOM back
 * over that route's HTML file.
 *
 * The output is still a static directory served by the same nginx config -- the
 * deploy pipeline does not change. The JS bundle still loads and hydrates, so
 * the authenticated app behaves exactly as before.
 *
 * Only routes with `prerender: true` in src/lib/routes.js are snapshotted.
 * Authenticated routes must never appear here: they would bake a logged-out
 * shell into the HTML.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer";
import { preview } from "vite";

import { PRERENDER_ROUTES } from "../src/lib/routes.js";

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const PORT = 4180;
const NAV_TIMEOUT_MS = 30_000;

/** "/" -> "index.html", "/faq" -> "faq/index.html" */
const outputPath = (route) =>
  route === "/" ? "index.html" : join(route.replace(/^\//, ""), "index.html");

/**
 * dist/index.html is both the homepage and nginx's SPA fallback for every route
 * that was not prerendered (/dashboard, /admin, unknown paths). Those routes
 * would otherwise paint the homepage for as long as the JS bundle takes to boot.
 *
 * Hide #root when the fallback shell is serving a URL that is not "/". main.tsx
 * drops the class as soon as React takes over. If JS never runs, a non-prerendered
 * route renders blank -- which is exactly what it did before prerendering existed.
 */
const FALLBACK_GUARD = `    <script>
      if (location.pathname !== "/") document.documentElement.classList.add("spa-fallback");
    </script>
    <style>html.spa-fallback #root { display: none }</style>
`;

const server = await preview({
  preview: { port: PORT, strictPort: true },
  logLevel: "warn",
});

const base = `http://localhost:${PORT}`;
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let failed = 0;

/**
 * Snapshots are buffered and flushed only after every route is captured.
 *
 * Writing inside the loop poisons the run: dist/index.html doubles as the SPA
 * fallback, so the moment it holds the homepage snapshot, every later route is
 * booted from homepage markup. React then hydrates the wrong tree and the
 * snapshot ends up with the homepage <h1> in it.
 */
const snapshots = new Map();

/**
 * Load one URL, wait for React to settle, and return the rendered HTML.
 * `label` and `dest` are for logging only. Returns null on failure.
 */
async function capture(url, { label, dest, isPrerenderedRoute }) {
  const page = await browser.newPage();
  page.setDefaultTimeout(NAV_TIMEOUT_MS);

  // Keep the snapshot hermetic. Google Fonts and the backend API are both
  // reachable from a dev machine and both would make the build nondeterministic
  // (or, for /api/auth/me, could resolve a real session into the HTML).
  // Blocking them leaves the <link> and <script> tags in place; only the
  // network fetch is skipped. AuthContext catches the failure and settles as
  // logged-out, which is exactly the state a crawler should see.
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const u = req.url();
    const external = !u.startsWith(base) && !u.startsWith("data:");
    if (external || u.includes("/api/")) req.abort().catch(() => {});
    else req.continue().catch(() => {});
  });

  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // <Seo> sets this once it has written <head>. Waiting on it (rather than a
    // fixed sleep) is what guarantees the snapshot has real metadata.
    await page.waitForSelector("html[data-seo-ready='true']");
    // Every page we snapshot renders exactly one <h1> (NotFound's is "404").
    await page.waitForSelector("h1");

    if (isPrerenderedRoute) {
      // index.css skips entry animations on the paint that already shows content;
      // main.tsx drops the attribute when it does not match the served URL.
      await page.evaluate((r) => {
        document.documentElement.dataset.prerendered = r;
      }, isPrerenderedRoute);
    }

    let html = await page.content();
    html = html.replace(/\s*data-seo-ready="true"/, "");
    if (isPrerenderedRoute === "/") html = html.replace("</head>", `${FALLBACK_GUARD}  </head>`);

    const h1Count = await page.$$eval("h1", (els) => els.length);
    const h1 = await page.$eval("h1", (el) => el.textContent.trim().replace(/\s+/g, " "));
    console.log(`[prerender] ${label.padEnd(12)} -> ${dest.padEnd(18)} ${(html.length / 1024).toFixed(1)} kB`);
    console.log(`[prerender]   title: ${await page.title()}`);
    console.log(`[prerender]   h1:    ${h1.slice(0, 70)}${h1Count === 1 ? "" : `   <-- ${h1Count} h1 tags!`}`);
    if (h1Count !== 1) {
      failed++;
      console.error(`[prerender]   expected exactly one <h1> on ${label}, found ${h1Count}`);
    }
    if (errors.length) console.warn(`[prerender]   page errors: ${errors.join("; ")}`);
    return html;
  } catch (err) {
    failed++;
    console.error(`[prerender] FAILED ${label}: ${err.message}`);
    if (errors.length) console.error(`[prerender]   page errors: ${errors.join("; ")}`);
    return null;
  } finally {
    await page.close();
  }
}

try {
  for (const route of PRERENDER_ROUTES) {
    const html = await capture(`${base}${route}`, {
      label: route,
      dest: outputPath(route),
      isPrerenderedRoute: route,
    });
    if (html) snapshots.set(outputPath(route), html);
  }

  // A real 404 page. nginx serves this with a 404 status for any path that is
  // neither a prerendered file nor a known client route, which turns the old
  // soft 404 (unknown URL -> homepage, HTTP 200) into an honest one. The URL is
  // deliberately one no route matches, so the SPA falls through to NotFound.
  // NotFound is noindex, so its bogus canonical never matters.
  const notFound = await capture(`${base}/__prerender_404__`, {
    label: "404",
    dest: "404.html",
  });
  if (notFound) snapshots.set("404.html", notFound);
} finally {
  await browser.close();
  await (server.close?.() ?? new Promise((r) => server.httpServer.close(r)));
}

if (failed) {
  // Fail the build rather than shipping empty shells that look fine to a human.
  console.error(`[prerender] ${failed} route(s) failed to prerender; dist left untouched`);
  process.exit(1);
}

// Server is down and every route captured -- safe to overwrite dist now. Keys
// are already dist-relative paths ("index.html", "faq/index.html", "404.html").
for (const [rel, html] of snapshots) {
  const dest = resolve(DIST, rel);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, html, "utf8");
}

console.log(`[prerender] ${snapshots.size} file(s) written`);
