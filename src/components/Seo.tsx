import { useEffect } from "react";
import { OG_IMAGE, SITE_NAME, canonical } from "@/lib/routes.js";
import type { JsonLd } from "@/lib/jsonld";

/**
 * Per-page <head> manager.
 *
 * There is no SSR here. The build snapshots each public route with a headless
 * browser (scripts/prerender.mjs), so whatever this effect writes to <head>
 * ends up baked into that route's static HTML. The prerenderer waits for the
 * `data-seo-ready` flag set below before taking its snapshot.
 *
 * Render exactly one <Seo> per page. A second instance would fight the first
 * over document.title.
 */

interface SeoProps {
  title: string;
  description: string;
  /** Router path, e.g. "/faq". Used to build the canonical URL. */
  path: string;
  /** Absolute URL. Defaults to the sitewide OG image. */
  image?: string;
  /** Emits `noindex, follow`. */
  noindex?: boolean;
  /** Defaults to `title` — keep them identical unless there's a reason not to. */
  ogTitle?: string;
  /** Defaults to `description`. */
  ogDescription?: string;
  jsonLd?: JsonLd | JsonLd[];
}

function upsertMeta(keyAttr: "name" | "property", key: string, content: string) {
  const selector = `meta[${keyAttr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(keyAttr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const Seo = ({
  title,
  description,
  path,
  image = OG_IMAGE,
  noindex = false,
  ogTitle,
  ogDescription,
  jsonLd,
}: SeoProps) => {
  const url = canonical(path);
  // Effects compare by identity, so serialize the schema to a stable key.
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
    upsertCanonical(url);

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:title", ogTitle ?? title);
    upsertMeta("property", "og:description", ogDescription ?? description);
    upsertMeta("property", "og:image", image);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", ogTitle ?? title);
    upsertMeta("name", "twitter:description", ogDescription ?? description);
    upsertMeta("name", "twitter:image", image);

    // Page-scoped JSON-LD. The sitewide Organization node in index.html carries
    // no data-seo-jsonld attribute, so it is never touched here.
    const nodes = (jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []).map((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoJsonld = "";
      // Guard against a literal </script> inside any string value.
      script.textContent = JSON.stringify(schema).replace(/</g, "\\u003c");
      document.head.appendChild(script);
      return script;
    });

    document.documentElement.dataset.seoReady = "true";

    return () => {
      nodes.forEach((n) => n.remove());
      delete document.documentElement.dataset.seoReady;
    };
    // jsonLd is intentionally tracked via its serialized key, not by identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, url, image, noindex, ogTitle, ogDescription, jsonLdKey]);

  return null;
};

export default Seo;
