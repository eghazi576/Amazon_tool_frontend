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

## 3. nginx — DONE (2026-07-10)

`scripts/prerender.mjs` writes one file per public route:

```
dist/index.html            ->  /
dist/faq/index.html        ->  /faq
dist/sign-up/index.html    ->  /sign-up
dist/sign-in/index.html    ->  /sign-in
```

The old config had two bugs, both fixed on the droplet and now reflected in the
backend repo's `nginx.conf.example` and `setup-droplet.sh`:

```nginx
# before
location / {
    try_files $uri $uri/ /index.html;
}

# after
absolute_redirect off;

location / {
    try_files $uri $uri/index.html /index.html;
}
```

**`$uri/` matched the directory.** It resolved `/faq` to `dist/faq/`, and nginx's
`index` module answers a slash-less directory request with a `301 /faq/` — while
every canonical tag and sitemap entry says `/faq`. Matching `$uri/index.html`
serves the file directly, no redirect.

**The redirect also downgraded HTTPS.** Cloudflare terminates TLS, so the origin
always sees `$scheme = http` and nginx emitted `Location: http://www.…/faq/`.
`absolute_redirect off` makes nginx send a relative `Location`, preserving the
browser's scheme.

Measured before and after:

```
before:  GET /faq -> 301  Location: http://www.thewholesaleos.com/faq/
after:   GET /faq -> 200  hops=0   https://www.thewholesaleos.com/faq
```

### Two traps found while doing this

**`sites-enabled/amazon-tool` was a plain file, not a symlink.** It had diverged
from `sites-available/amazon-tool`: nginx served one, every edit landed in the
other, and `nginx -t` passed either way. The live copy carried the real
hostnames, `root /var/www/amazon-frontend` (no `/dist`), and a set of
`deny all` blocks for dotfiles, `.env`, `.key`, `.pem` — none of which existed in
`sites-available`. Always check first:

```bash
ls -l /etc/nginx/sites-enabled/amazon-tool     # expect  l...  -> ../sites-available/...
diff /etc/nginx/sites-{available,enabled}/amazon-tool
```

**`root` is `/var/www/amazon-frontend`, not `.../dist`.** The frontend deploy
scps `dist/*` with `strip_components: 1`, so the built files land one level up.
`setup-droplet.sh` claimed `.../dist` and would have 404'd every route on a
rebuilt droplet.

### Never put the host/protocol redirects here

Under Cloudflare's **Flexible** SSL mode the origin always sees `$scheme = http`.
A redirect keyed on `$scheme` therefore loops forever: browser asks over https,
Cloudflare fetches over http, nginx 301s to https, repeat. The apex→www and
http→https redirects belong in Cloudflare (sections 1 and 2), not in nginx.

The nginx config lives in the **backend** repository, which is a separate git repo,
and the frontend deploy workflow never copies it to the server. Changes there need
a manual install on the droplet.

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
- [x] nginx `try_files` + `absolute_redirect off`; `/faq` returns `200 hops=0` (2026-07-10)
- [x] `robots.txt` serving the www sitemap (the stale 4h edge cache expired on its own)
- [ ] `sites-enabled/amazon-tool` restored to a symlink of `sites-available`
- [ ] Real assets: `logo.png`, `og-image.png` and `favicon.png` are currently the
      same 669×373 file, and `og:image` declares a 1200×630 it does not have
- [ ] Search Console property for `https://www.thewholesaleos.com` verified,
      sitemap `https://www.thewholesaleos.com/sitemap.xml` submitted
- [ ] Soft-404 approach chosen
