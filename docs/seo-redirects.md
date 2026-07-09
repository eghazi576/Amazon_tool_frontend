# Canonical host, redirects, and the soft 404

Everything in this file has to be applied **outside this repository**. The build
produces a static `dist/` that is scp'd to a droplet and served by nginx; TLS
terminates at Cloudflare. Neither the Cloudflare config nor the live nginx config
is version-controlled here, so nothing below takes effect just by merging.

## Current state (measured, not assumed)

All four origins answer `200 OK` with identical content. Nothing redirects — not
even HTTP to HTTPS:

```
$ curl -s -o /dev/null -w "%{http_code} %{num_redirects}\n" -L http://thewholesaleos.com/
200 0
$ curl -s -o /dev/null -w "%{http_code} %{num_redirects}\n" -L https://thewholesaleos.com/
200 0
$ curl -s -o /dev/null -w "%{http_code} %{num_redirects}\n" -L http://www.thewholesaleos.com/
200 0
$ curl -s -o /dev/null -w "%{http_code} %{num_redirects}\n" -L https://www.thewholesaleos.com/
200 0
```

Google therefore sees up to four copies of the site and has to guess which is
real. That guess is what canonical tags exist to settle, and until this branch
the canonical pointed at the apex while the site was served from `www`.

**The canonical host is `https://www.thewholesaleos.com`.** It is the single
source of truth in [`src/lib/routes.js`](../src/lib/routes.js) (`SITE_URL`), which
feeds the canonical tags, the OG/Twitter URLs, `sitemap.xml`, and the `Sitemap:`
line in `robots.txt`. Change it there and everything follows.

## 1. HTTP to HTTPS

Cloudflare dashboard → **SSL/TLS → Edge Certificates → Always Use HTTPS: On**.

This covers both hosts and needs no rule.

## 2. Apex to www (301)

Cloudflare dashboard → **Rules → Redirect Rules → Create rule**.

| Field | Value |
| --- | --- |
| Rule name | `301 apex to www` |
| If incoming requests match | Custom filter expression |
| Expression | `http.host eq "thewholesaleos.com"` |
| Then | Dynamic redirect |
| Type | Dynamic |
| Expression | `concat("https://www.thewholesaleos.com", http.request.uri)` |
| Status code | `301` |
| Preserve query string | **off** |

`http.request.uri` already contains the path *and* the query string, which is why
"preserve query string" must stay off — leaving it on duplicates the query.

Equivalent call against the Rulesets API. Note the `PUT` replaces **every** rule
in the `http_request_dynamic_redirect` phase, so if that phase already has rules,
fetch them first with `GET` and include them in the payload:

```bash
curl -X PUT \
  "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/rulesets/phases/http_request_dynamic_redirect/entrypoint" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "rules": [
      {
        "description": "301 apex to www",
        "expression": "(http.host eq \"thewholesaleos.com\")",
        "action": "redirect",
        "action_parameters": {
          "from_value": {
            "status_code": 301,
            "target_url": {
              "expression": "concat(\"https://www.thewholesaleos.com\", http.request.uri)"
            },
            "preserve_query_string": false
          }
        }
      }
    ]
  }'
```

Verify afterwards — a 200 here means the rule did not take:

```bash
curl -sI https://thewholesaleos.com/faq | head -2
# expect: HTTP/2 301
#         location: https://www.thewholesaleos.com/faq
```

## 3. nginx must serve the prerendered directories

`scripts/prerender.mjs` writes one file per public route:

```
dist/index.html            ->  /
dist/faq/index.html        ->  /faq
dist/sign-up/index.html    ->  /sign-up
dist/sign-in/index.html    ->  /sign-in
```

The live config (mirrored in the backend repo at `nginx.conf.example`) uses:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

The `$uri/` branch resolves `/faq` to the *directory* `dist/faq/`, and nginx's
`index` module answers a directory request that lacks a trailing slash with a
`301 /faq/`. That would leave `/faq` redirecting to `/faq/` while every canonical
tag, sitemap entry, and internal link says `/faq` — a needless hop and a
canonical/served-URL mismatch.

Match the file directly instead:

```nginx
location / {
    try_files $uri $uri/index.html /index.html;
}
```

`/faq` now resolves to `dist/faq/index.html` with no redirect, and anything that
matches no file still falls back to the SPA shell.

**Verify on the droplet before relying on it** — this is the one item here I could
not test locally, and the `$uri/` behaviour is worth confirming rather than
trusting a comment:

```bash
curl -sI https://www.thewholesaleos.com/faq | head -2   # expect 200, not 301
```

That file lives in the **backend** repository, which is a separate git repo from
this one, and the deploy workflow never copies it to the server. Changing it is a
separate change in that repo, plus a manual install on the droplet.

## 4. Known gap: the soft 404

`try_files ... /index.html` means an unknown path such as `/does-not-exist` is
answered with the SPA shell and **HTTP 200**, not 404. Confirmed against
production. Google will happily index nonsense URLs as duplicates of the homepage.

`NotFound.tsx` sets `<meta name="robots" content="noindex, follow">`, but that is
a client-side signal: it only reaches a crawler that executes JavaScript.

A real fix needs the edge to answer with a 404 status for paths that are neither a
prerendered file nor a known SPA route. Options, cheapest first:

1. **Cloudflare rule** — match a negative list of known route prefixes and return
   404. Brittle as routes grow.
2. **Enumerate SPA routes in nginx** — `location ^~ /dashboard`, `location ^~
   /admin`, etc. fall back to `/index.html`; everything else gets
   `error_page 404 /404.html` and a real 404. Requires prerendering a `404.html`
   and touching nginx on every new top-level route.
3. **Move the marketing site to a host with native SPA-fallback-plus-404
   semantics** (Cloudflare Pages, Netlify). The largest change; only worth it if
   the hosting story is being revisited anyway.

Not fixed in this branch: it needs a decision about which of the three to take,
and all three live outside this repository.

## Checklist

- [ ] Always Use HTTPS enabled
- [ ] Apex → www 301 redirect rule live and verified with `curl -sI`
- [ ] nginx `try_files` updated and `/faq` returns 200 with no redirect
- [ ] Search Console property for `https://www.thewholesaleos.com` verified,
      sitemap `https://www.thewholesaleos.com/sitemap.xml` submitted
- [ ] Soft-404 approach chosen
