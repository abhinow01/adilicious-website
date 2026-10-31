# Content management (Sanity)

All website copy, the hero videos, menu courses, client posters, contact details and SEO data are
managed in **Sanity**. The website stays a static, prerendered page: it reads Sanity only after
an editor publishes, never on a normal visit.

```
Editor ──publishes──▶ Sanity ──signed webhook──▶ /api/revalidate ──▶ cache tag expired
                                                                          │
Visitor ──▶ VPS (next start) ──▶ prerendered page from cache ◀──re-render once (1 Sanity query)
```

| Where | What |
|---|---|
| `studio/` | The editing app (Sanity Studio): schemas, desk structure, preview config, migration script |
| `src/sanity/` | Website data layer: client, queries, caching, metadata, image helpers |
| `src/app/api/revalidate` | Webhook endpoint that refreshes the cache after a publish |
| `src/app/api/draft-mode/*` | Turns preview of unpublished drafts on/off (used by the Studio) |
| `src/app/robots.js`, `sitemap.js` | Generated from the CMS |

---

## 1. One-time setup

### 1.1 Create the Sanity project
1. Sign up at <https://www.sanity.io> and create a project (Free plan). Note the **Project ID**.
2. Create a dataset called `production` with visibility **Public**.
   Public is safe: anonymous requests only ever see *published* documents; drafts always need a token.
3. **API → Tokens**:
   - Add a token named `website-preview` with **Viewer** permission → this is `SANITY_API_READ_TOKEN`.
   - Add a token named `seed` with **Editor** permission (only for step 1.3; delete it afterwards).
4. **API → CORS origins**: add `http://localhost:3333` with *Allow credentials* (for running the Studio locally).
   The deployed Studio's origin is added automatically by `sanity deploy`.

### 1.2 Environment variables
Website (repo root): copy `.env.example` to `.env.local` (development) and to
`.env.production.local` on the VPS, and fill in:

| Variable | Secret? | Value |
|---|---|---|
| `SANITY_PROJECT_ID` | no | Project ID |
| `SANITY_DATASET` | no | `production` |
| `SANITY_API_READ_TOKEN` | **yes** | Viewer token (preview only) |
| `SANITY_REVALIDATE_SECRET` | **yes** | `openssl rand -base64 32`; the same value goes into the webhook |
| `NEXT_PUBLIC_SITE_URL` | no | e.g. `https://www.adilicious.co` (no trailing slash) |
| `SITE_NOINDEX` | no | `1` only on a staging copy |

None of these are exposed to the browser (only `NEXT_PUBLIC_SITE_URL` is, and it's public anyway).

Studio: copy `studio/.env.example` to `studio/.env` and fill in the project ID, and
`SANITY_STUDIO_PREVIEW_ORIGIN=https://www.adilicious.co` (the live site, used by the preview).

### 1.3 Migrate the existing content
```bash
cd studio
npm install
npm run seed            # uploads the original copy, videos and images
```
The seed only creates documents that don't exist yet, so running it twice is harmless.
`npm run seed -- --replace` overwrites them with the original content.
Then delete the `seed` token in manage.sanity.io and remove `SANITY_WRITE_TOKEN` from `studio/.env`.

The hero video `appetizers.mp4` was re-encoded for the CMS from 4K/12.8 MB to 1080p/2.2 MB
(visually equivalent, SSIM 0.98, audio track removed since the hero is muted). The originals stay
in `public/videos/` and can be uploaded in the Studio if preferred.

### 1.4 Deploy the Studio
```bash
cd studio
npm run deploy          # → https://adilicious.sanity.studio (hostname from SANITY_STUDIO_HOSTNAME)
```
Re-run it after changing schemas or `SANITY_STUDIO_PREVIEW_ORIGIN`.

### 1.5 Editor login
Create one Sanity account for the shared editor credential (e.g. `content@yourdomain`, email +
password login), then **manage.sanity.io → Members → Invite** it. On the Free plan the only roles are
Administrator and Viewer, so the editor account must be an Administrator: keep its password in a
password manager and enable two-factor authentication. Restricted "Editor" roles need the Growth
plan ($15 per seat per month).

### 1.6 The publish webhook
manage.sanity.io → **API → Webhooks → Create webhook**:

| Field | Value |
|---|---|
| Name | `Refresh website` |
| URL | `https://www.adilicious.co/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type in ["siteSettings", "homePage", "course", "work"]` |
| Projection | `{"tags": [_type]}` |
| HTTP method | POST |
| API version | `v2025-02-19` |
| Drafts | **off** (only published changes) |
| Secret | the value of `SANITY_REVALIDATE_SECRET` |

Test it: publish any change, then check **Webhooks → Attempts log** for a `200` response.
A `401` means the secret differs; a `400` lists the tags it didn't recognise.

---

## 2. Running on the VPS

```bash
npm ci
npm run build      # fetches content from Sanity (3 queries) and prerenders the page
npm run start      # or under PM2/systemd: `pm2 start npm --name adilicious -- start`
```

- **One instance, persistent disk.** The cache lives in `.next/cache` on the server's disk. Keep
  a single `next start` process. If you ever run several instances or containers, they need a
  shared cache handler (see Next.js "Self-hosting → Multi-instance cache coordination").
- **Redeploying** runs `next build` again, which re-reads current content from Sanity.
- **HTTPS is required** for the Studio preview (the preview cookie is `SameSite=None; Secure`).
- **Reverse proxy.** Don't cache HTML in nginx or Cloudflare: the page's
  `Cache-Control: s-maxage=3600, stale-while-revalidate` is meant for Next.js. A proxy that
  honours it would keep serving an old page for up to an hour after a publish. Caching
  `/_next/static/*` is fine (those files are immutable).

```nginx
server {
  server_name www.adilicious.co;
  # listen 443 ssl; certificates…

  location /_next/static/ {
    proxy_pass http://127.0.0.1:3000;
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    # no proxy_cache here: Next.js already caches pages and refreshes them on publish
  }
}
```

---

## 3. How caching works

| What | Cached where | Expires | Refreshed by |
|---|---|---|---|
| Sanity query results | Next.js Data Cache (`.next/cache` on the VPS disk) | 1 h safety net, only if visited | Publish webhook (cache tags = document types) |
| Prerendered page (HTML + RSC) | Next.js full-route cache (same disk) | Same | Same; re-rendered on the next request |
| Repeated reads within one render | React `cache()` | End of request | n/a |
| Images and videos | Sanity CDN (`cdn.sanity.io`); file URLs change when a file changes | Effectively never | Uploading a new file |
| JS/CSS/fonts | Browser and any proxy (hashed file names) | 1 year | New deployment |
| Draft preview | **Not cached** | n/a | Each request (cookie set by the Studio) |

- Publishing a change costs **one** Sanity API request (on the next visit), whatever the traffic.
  Normal visits cost zero. The Free plan includes 250,000 API requests a month.
- `revalidateTag(tag, {expire: 0})` makes the first visitor after a publish get the new content
  (one render of a few hundred ms), so an editor checking their change never sees the old version.
- The website reads Sanity with `useCdn: false` on purpose: right after a publish, Sanity's API CDN
  could still return the old version, which Next.js would then keep.
- Queries live in `src/sanity/queries.js` and fetch exactly what the page renders, with
  references resolved in the same request.

---

## 4. For editors

Open the Studio (`https://adilicious.sanity.studio`) and sign in with the shared account.

- **Home page**: every section of the page, in page order (Hero, House rules, Menu, Book a
  table, Say hello, SEO). The order of sections is fixed because the scroll animations depend on it.
- **Site settings**: site name, tagline, contact emails, default SEO and share image,
  organisation details (used by Google), footer.
- **Menu courses**: the services on the plate. Their order is set in Home page → Menu → Courses.
- **Work / clients**: the posters behind the plate (image, or a colour artwork as fallback).

Writing titles: a **new line** is a line break, and `*asterisks*` make the italic accent,
e.g. `Tell us⏎what you're *hungry*⏎for.`

**Publish** makes a change live within seconds. **Presentation** (top bar) shows the real site with
your unpublished drafts; after saving, press the reload button in the preview to see the change.

Video uploads: MP4 (H.264), muted, under ~5 MB. Every visitor downloads it, and the Free plan
includes 100 GB of CDN bandwidth a month (about 30,000 plays of a 3 MB clip). Always fill in a
poster image.

---

## 5. Adding pages later (footer, case studies, blog)

The content model and routing are prepared for this.

**Footer**: content is already in Site settings → Footer, and the `Footer` component reads it.
Uncomment `<Footer …/>` in `src/components/HomeClient.jsx` (and import it from `./Plate`).

**Case studies** (`/work/<slug>`): the `work` type already has slug, summary, services, year and SEO.
1. Add body fields (e.g. a gallery or rich text) to `studio/schemas/documents/work.js`.
2. Enable the route in `src/sanity/routes.js`: `work: (slug) => \`/work/${slug}\``.
3. Create `src/app/work/[slug]/page.js`:
   - `generateStaticParams()` that returns the slugs (query `*[_type=="work" && defined(slug.current)]`).
   - Fetch with `sanityFetch({ query, params: { slug }, tags: ['work'] })`.
   - `generateMetadata()` with `buildMetadata({ seo: doc.seo, settings, path: \`/work/${slug}\` })`.
   - `notFound()` when the document doesn't exist (returns a 404).
4. The sitemap picks the pages up automatically; the existing webhook already covers `work`.

**Blog** (`/blog/<slug>`): same recipe with a new `post` type. Add it to `studio/schemas/index.js`, to
the desk structure in `studio/sanity.config.js`, to `TAGS` in `src/sanity/tags.js`, to `routes.js`,
and to the webhook filter.

**Changed or removed URLs**: once there are multiple pages, add a `redirect` document type and
read it in `next.config.mjs` `redirects()` (applied at build), or in a `proxy.js` (the
Next.js 16 name for middleware) for instant effect. For permanently deleted content, return
status 410 from the route.

---

## 6. Troubleshooting

| Symptom | Fix |
|---|---|
| Build fails "Missing SANITY_PROJECT_ID" | Environment file missing on the server |
| Build fails "Sanity has no homePage document" | Run the seed (1.3) or create and publish Home page / Site settings |
| Published but the site didn't change | Check the webhook Attempts log; a missed webhook self-heals within 1 h |
| Preview shows "Invalid preview secret" | Open the preview from the Studio's Presentation tool, not by URL |
| Preview blank inside the Studio | The site must be on HTTPS, and `SANITY_STUDIO_PREVIEW_ORIGIN` must match it; redeploy the Studio |

---

## 7. Known issues outside this change (not modified)

- The **reservation form** doesn't send anything yet (it only shows the success label), and the
  **postcard** endpoint only logs messages (`src/app/api/postcard/route.js`).
- **Accessibility**, which Lighthouse can see now that the content is in the HTML: low contrast on the
  "01 / 03" counter and the Kitchen/Press labels; the hero dots are small touch targets.
  Both are design decisions, left unchanged.
- **Font licence**: Helvetica Neue is commercial and the font files are in a public repository.
- `src/app/(landing)/components/Process.jsx` and `public/videos/main-course.mp4` (43 MB) are unused.
  The `locomotive-scroll` and `clsx` dependencies are not imported anywhere.
- The old footer copy mentions "Brooklyn & Mexico City, est. 2021" and a placeholder phone number.
  It's migrated as-is into Site settings → Footer, to be corrected there.
