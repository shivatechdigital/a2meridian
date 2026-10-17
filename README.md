This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font` to self-host Playfair Display, Inter, and JetBrains Mono.

## Phase 0 Foundation

- Keep the existing root-level `app/` structure. Guide references to `src/app`,
	`src/lib`, and `src/types` correspond to `app/`, `lib/`, and `types/` here.
- Tailwind CSS v4 is integrated through `@tailwindcss/turbopack`. Theme tokens,
	fonts, animations, and shared utilities live in `app/globals.css`; no
	`tailwind.config.ts` or v3 `@tailwind` directives are needed.
- `lib/constants.ts` and `types/index.ts` contain the initial company data and
	shared contracts. Company metrics and contact information supplied by the
	setup guide are unverified placeholders and must be checked before publishing.
- `.env.local` contains local placeholders and is ignored by Git. Replace the
	Sanity and Resend values locally, and keep server tokens out of client code.
	Mirror these variable names in your deployment's secret/environment settings.
- Component, route, and Sanity schema directories are reserved for later phases.
	Empty route directories do not expose pages or API endpoints.

External setup remains manual: create a Sanity project and dataset, configure
Resend, and provision GCP only after reviewing billing and account permissions.
Google Cloud free credits depend on eligibility; they are not guaranteed.
Sanity Studio runs separately from Next.js, using the configuration and schemas
in this repository. The embedded `/studio` route has been removed.

## Local Servers

Run these in two terminals from the project root:

```bash
npm run dev
```

 The company-story image, catalog grid, stats, hero CTA, section titles, and footer links use the new components.
npm run dev:studio
```

Studio: http://localhost:3333

If Node reports a certificate error on this Windows machine, first run this in
the Studio terminal (certificate verification remains enabled):

```powershell
$env:NODE_OPTIONS = ($env:NODE_OPTIONS + ' --use-system-ca').Trim()
```

Studio reads the existing local Sanity environment values. Only the public
project ID, dataset, and API version are exposed to its browser bundle.
If Studio reports a CORS error, add `http://localhost:3333` with credentials
enabled in the project's Sanity management settings. Do not add wildcard origins.

Use a supported Node.js LTS release meeting Next.js requirements (at least
20.9 for this release line), not the guide's Node 18 recommendation.
Git was already initialized by create-next-app. No automatic commit is needed.
`next-sitemap` is listed in the guide but is not installed or configured;
Next.js metadata routes are another option for a later SEO phase.

Validation commands:

```bash
npm run lint
npm exec tsc -- --noEmit
npm run build
```

Google fonts are downloaded at build time, so builds require network access.
Review `npm audit` before choosing targeted dependency fixes; avoid blindly
running `npm audit fix --force`.

## Phase 1 Layout

The website now has a responsive shared header, keyboard-accessible mobile
navigation, four-column footer, and a delayed WhatsApp control. `ScrollReveal`
and `SectionTitle` provide reusable reduced-motion-aware section styling.

Routes: `/`, `/about`, `/products`, `/products/[slug]`, `/global-reach`,
`/certifications`, and `/contact`. These are foundation pages; the product
catalog, CMS data, map, and inquiry form belong to later phases. Product detail
routes currently display the requested slug without claiming a real listing.

Set verified phone and WhatsApp values in `lib/constants.ts` before publishing.
Placeholder phone links are not dialable, and WhatsApp stays disabled until its
number is valid. Social and legal links are intentionally omitted until real
destinations and policy content are supplied. Confirm the canonical domain
in `app/layout.tsx` before deployment.

The homepage background is a local Unsplash photograph:
https://images.unsplash.com/photo-1494412519320-aa613dfb7738

## Phase 2 Homepage

The homepage is assembled from eight components in `components/home`: Hero,
Stats, WhatWeDo, ProductPreview, GlobalPreview, WhyChooseUs, PartnerLogos, and
CTABanner. It uses local images with Next Image, react-countup for viewport
counters, and react-simple-maps for a real geographical preview. Region buttons
highlight the selected map connection. The carrier marquee has pause/play and
reduced-motion support; it translates by exactly one duplicated group.

The figures supplied in the phase guides are draft company data, not independently
verified facts: 25+ countries, 500+ products, 10,000+ MT/year, category counts, and
regional percentages. Verify these before publishing. The category counts total
435+, so they should not be treated as an exact reconciliation of the total
catalog. Experience is shown as 8+ years for 2026, using the supplied 2018 founding
year; review the reference year in Stats when updating the site.

No certification or confirmed carrier partnership is asserted without evidence.
Hero badges describe trade principles, and the marquee is labelled as a logistics
ecosystem rather than contracted partners. The CTA uses email until a valid phone
number is supplied. The map shows regional examples, not actual freight paths.
The complete Global Reach page and catalog filtering remain later-phase work.

Re-download assets with `./scripts/download-home-assets.ps1` on Windows. Sources,
attribution, and licenses are in `public/home/ASSETS.md`. In particular, preserve
the visible Rob Lavinsky / iRocks.com credit and CC BY-SA 3.0 link when reusing the
pyrite photo. Photos illustrate sectors, not company-owned facilities.

## Phase 3 About and Certifications

`/about` contains the image-led hero, company story, mission/vision, four values,
2018-2024 timeline, four sample leadership profiles, and six-photo gallery.
Gallery buttons open a native modal with previous/next controls, arrow-key
navigation, Escape closing, focus restoration, and body-scroll restoration.
Both new pages contain horizontal reveal animations within `overflow-x-clip`
to avoid mobile overflow while off-screen elements are translated.

Content awaiting confirmation is labelled visibly. The guide's team names,
biographies, and stock portraits are samples, not verified personnel. Timeline
registrations and growth claims need supporting records. Stock offices and
facilities are explicitly illustrative; replace them with approved company
photographs before publishing. Source data lives in `lib/about-content.ts`.

`/certifications` describes six relevant document types and eight compliance
review areas. No valid certificate numbers, current records, or issuer evidence
were supplied, so all six cards show documentation pending and unverified
validity rather than the guide's placeholder IDs and expired 2025 date. Cards
link to official guidance and a real email request, not nonexistent downloads.
ISO publishes the standard; an independent certification body issues a company's
ISO certificate. Phytosanitary certificates are consignment-specific. The
compliance checklist is a set of review topics, not an audit assurance.
Document-type copy is in `lib/certifications.ts`.

Use `./scripts/download-about-assets.ps1` for the local stock images. Source and
license notes are in `public/about/ASSETS.md`. The existing website/Studio port
configuration and Sanity schemas are unchanged.

## Phase 4 Product Catalog

The standalone Studio is still in this repository: `npm run dev:studio` on 3333.
Category and Product schemas are registered in `sanity/schemaTypes/index.ts`.
There is no separate `a2-meridian-cms` folder and no embedded Studio route.

Published CMS data flows through the existing public Sanity client and the
server-only functions in `lib/queries.ts`. The public dataset does not need an
API token for published reads. Existing local environment values were preserved;
server credentials are not passed to browser components. Never put write tokens
in NEXT_PUBLIC variables. A private dataset would require a server-only reader
token and an explicit configuration change.

The catalog uses request-time published reads (`useCdn: false`, `no-store`), so
published changes appear on a fresh request without rebuilding. Drafts do not
appear on the website. Data streams inside Suspense to work with Cache Components.
The listing supports category, name/category/HS search, trade direction, reset,
result counts, and 12-item pagination. State is stored in `category`, `q`, `trade`,
and `page` URL parameters, so category links from the homepage/footer work.
Import and Export filters include dual-direction products; Both selects only
dual-direction products. Filtering is client-side over the published catalog,
appropriate for a modest portfolio; move it to paginated GROQ for a large catalog.

Product detail pages show real CMS fields, multiple images and thumbnails,
previous/next and touch gestures, a keyboard-accessible zoom dialog, specifications,
MOQ, packaging, supplier-listed credentials, and same-category related products.
Missing listings use `notFound()` and noindex metadata; streamed responses may
already have sent HTTP 200 before the not-found UI arrives. Sample product pages
are noindex. Inquiry parameters are URL-encoded and preserved on the contact page.
Email is used while the WhatsApp number is a placeholder. There is no checkout,
payment flow, or automatically sent inquiry; email opens the visitor's mail app.

### Sample Content

Six categories and eight published sample products were imported using the
authorized CLI login: Basmati Rice 1121, Cumin Seeds, Turmeric Powder, Cotton Yarn
30s, Industrial Dyes, Water Pumps, Green Tea, and Granite Slabs. Each has two
Sanity-uploaded images and three specification entries; the first three are
featured. These are demonstrations, not verified availability or commercial terms.
Images are explicitly labelled illustrative sector/logistics photographs, not
actual product photography. Replace them with approved product images before
publishing a real catalog. Certifications are empty because no documentary
evidence was supplied; editors can add substantiated credentials in Studio.
Sources for reused images remain in `public/home/ASSETS.md` and
`public/about/ASSETS.md`.

The seed creates server-generated document IDs and uses returned category IDs for
references. It skips existing category/product slugs and never overwrites them.
It is safe to rerun sequentially, but do not run concurrent seeds. Uploaded assets
may remain if a run fails midway. To add missing samples using an authorized login:

```powershell
$env:NODE_OPTIONS = ($env:NODE_OPTIONS + ' --use-system-ca').Trim()
npm exec -- sanity exec scripts/seed-catalog.ts --with-user-token
```

The CLI authenticates locally; do not paste tokens into chat. The shared automated
browser may show a separate Studio login even when your own browser is logged in.

### Catalog Checks

```bash
npm exec --yes --package=tsx -- tsx --test scripts/catalog-filter.test.ts
npm exec -- sanity schema extract --path .next/catalog-schema.json
npm exec -- sanity documents validate --yes --format ndjson
npm run lint
npm run build
```

Filter tests cover category/search combinations, dual-direction semantics,
normalized HS searches, nullable fields, empty data, and certification-only specs.
CMS validation reports issues; an empty ndjson result means no document issues
were found. Local request errors surface a retry screen rather than a false
empty catalog. Studio publishing, rather than just saving a draft, is required.

## Phase 5 Global Reach

`/global-reach` now contains the image-led hero, interactive world map,
regional country-coverage statistics, an expandable country/product directory,
and the six-step trade process. The existing ports remain website 3000 and
standalone Studio 3333. This phase does not change Sanity schemas or CMS content.

`lib/countries-data.ts` holds the 18 supplied illustrative trade-country entries.
Each has alpha-3 and ISO numeric codes. The local world-atlas file uses numeric
IDs, not ISO_A3 properties; polygon colors now match those IDs correctly.
Singapore is omitted from the low-resolution 110m country polygons, but remains
available through its marker, dropdown, and directory entry. All 18 countries
have product lists and selectable markers. Map-data license/source notes remain
in `public/home/ASSETS.md`. The hero reuses the documented local port photograph.

The draft country shares supplied in the guide total 125%, not 100%. They are
retained as unverified source data but are not displayed as trade volumes. The
guide's regional counts also omitted Oceania and did not reconcile with the list.
Instead, five coverage groups derive their counts and country-share percentages
from all 18 entries: Middle East 4, Europe 3, East/Southeast Asia 6, Americas/Africa
4, and Oceania 1. These percentages describe country coverage, not trade volume.
The mapped entries span six continents (North and South America counted
separately). Quick stats are derived from these entries rather than unverified
25+ countries, 40+ real routes, or 500+ shipments. Country relationships and
product availability are explicitly illustrative pending company confirmation.

The map has direction/region filters, a country selector, keyboard/touch country
selection, bounded hover/focus tooltips, and a persistent selected-country panel.
Import/Export filters include dual-direction countries; Both selects only those
countries. Buttons zoom between 1x and 5x, pan in four directions, focus the
selected country, and reset the view. Pointer drag and touch pinch/pan are handled
by react-simple-maps/d3-zoom. Wheel zoom requires Control so normal page scrolling
is not captured. Filter changes reset framing so results cannot remain off-screen
after a previous country zoom. The selector also provides access to densely
clustered or small country markers on mobile.

The client wrapper owns `next/dynamic` with `ssr: false`, as required by this Next
release. It uses the installed library's real types, plus topojson-client and its
official types; no loose module redeclarations are added. Local geography loading
has a retry state. The HQ pulse and coverage bars honor reduced motion. Tooltips
are supplementary; the detail panel and expandable directory expose all products
without requiring hover. Market inquiry links preserve the selected country on
the contact page and open an encoded email inquiry. No backend email is sent yet.

Validation:

```bash
npm exec --yes --package=tsx -- tsx --test scripts/map-data.test.ts
npm run lint
npm run build
```

Tests cover IDs/coordinates, topology matches, trade filters, reconciled regional
counts, and tooltip clamping. Browser checks cover polygon fills, all markers,
hover/focus, selection, zoom/pan/drag/reset, empty filtering, geography retry,
country directory expansion, market inquiry context, reduced-motion reload, and
320/390/768/1440-pixel layouts. Real touch-device gesture performance should also
be reviewed on the target phones before launch. Existing dependency audit
advisories remain unchanged; no forced dependency upgrades were performed.

## Phase 6 Contact and Inquiry

The contact page now has a shared validated inquiry form, contact information,
working hours, product/market prefills, a consent-loaded Google address map, and
guarded direct-contact links. Product pages also provide a Quick Inquiry dialog
with the same form, product/HS context, native focus trapping, Escape closing,
scroll locking, and retained drafts.

`POST /api/inquiry` validates with Zod v4, bounds the request body, escapes email
content, applies basic per-process abuse limits, and sends through Resend only
when server configuration is present. Success means provider acceptance, not
confirmed inbox delivery. Unconfigured service returns 503 and keeps form input.
The API key and sender/recipient configuration were not modified or invented.

See [INQUIRY_SETUP.md](INQUIRY_SETUP.md) for server environment variable names,
Resend onboarding restrictions, verification commands, production abuse-control
limitations, and privacy considerations. A real Resend key, verified sender,
explicit recipient, and inbox test are still required. Do not share secrets in chat.
Website/Studio ports remain 3000/3333.

## Phase 7 Animation and Polish

Lenis smooth-wheel scrolling is enabled only for desktop (1024px+), fine-pointer,
non-touch visitors without reduced-motion preference. It uses Lenis' managed RAF
loop and destroys the instance/listeners when disabled or unmounted. Modal/menu
body locks stop Lenis; closing resumes it. Dialogs, map gestures, native selects,
textareas, and third-party embeds are excluded. Touch devices keep native scrolling.
Lenis' packaged CSS is used rather than copied legacy CSS. Anchor navigation uses
an offset for the fixed header. Normal map wheel scrolling remains untouched.

Route entry fades use root and products templates rather than repeating wrappers
on every page. They animate opacity, not a transform on the entire page, to avoid
changing fixed-element containing blocks. Search parameters do not remount these
templates, so filtering does not erase state. Route exit animation is intentionally
not advertised: the App Router does not preserve outgoing trees for a basic
AnimatePresence wrapper. Entries respect reduced motion.

The brand intro is a non-interactive, one-second, once-per-session visual, not a
network loading indicator. It can be dismissed immediately by keyboard/pointer
input and never locks scrolling or focus. It is initially hidden in server HTML,
skipped if storage is unavailable, and hidden for reduced motion. There is no
artificial 2.2-second wait before usable content.

Reusable components now include TextReveal, ImageReveal (Next Image),
StaggerContainer, MagneticButton (bounded motion values), ParallaxSection,
AnimatedLink, and AnimatedNumber. The number wrapper reuses react-countup rather
than a second interval/RAF counter implementation. Text reveals expose one intact
screen-reader label; stagger children preserve React keys. Image containers have
stable dimensions. The hero has a clipped background-only parallax, applied on
desktop; mobile and reduced motion use a stationary layer. The company-story
image, catalog grid, stats, hero CTA, section titles, and footer links use the new
components. Product hover/focus has a small lift, image zoom, and visible arrow;
essential View Details text remains visible without hover.

The supplemental desktop gold cursor retains the native cursor. It is hidden on
touch/small screens, reduced motion, forms, dialogs, and the map. Pointer positions
use motion values rather than React renders on every move. Decorative gradient,
shimmer, line/glow, reveal, and texture utilities are available; continuous heavy
shadow/background effects are not attached broadly. Reduced-motion CSS disables
decorative transitions, cursor, intro, and parallax.

Browser checks covered desktop wheel-provider activation, native mobile scrolling,
reduced-motion reload without hydration errors, anchor/route navigation, modal
scroll locking/restoration, map selection/zoom, catalog filtering, loaded hero
imagery, and overflow. One development integrated-browser sample at 1440x900
recorded 89 scrolling frame intervals: median 16.7ms, p95 16.8ms, none above 34ms.
This is a short local sample, not a guaranteed 60fps result or a production-device
benchmark. Profile a production build on representative phones and lower-powered
desktops before making performance claims. Email credentials/inbox testing from
Phase 6 remain pending; this phase does not configure Resend or modify CMS data.

## Phase 8 SEO and Performance

Central metadata, per-route canonical/social tags, safe JSON-LD, native CMS-aware
sitemap/robots routes, branded social/icons, image formats, and security headers
are implemented. Next/font and responsive hero preloads were retained without
redundant external preconnects. Native metadata routes mean no next-sitemap
postbuild script or Tailwind v3 config is required. Existing lint and port scripts
remain intact.

Set `NEXT_PUBLIC_SITE_URL` to the verified public origin before deployment, and
optionally set `GOOGLE_SITE_VERIFICATION` after registering Search Console.
Current sample products stay noindex and are excluded from Product markup/sitemap.
No fabricated price, stock status, certificate, employee count, or social profile
is added to structured data.

Final local production Lighthouse: Performance 82 mobile / 86 desktop; SEO,
Accessibility, and Best Practices 100 on both; CLS 0. The 90+ performance target
is **not** achieved. See [PERFORMANCE_REPORT.md](PERFORMANCE_REPORT.md) for exact
metrics, test environment, limitations, changes, reproducible commands, and
remaining deployment/field-validation work. Build, lint, and 20 regression tests
passed. Useful scripts: `seo:assets`, `audit:performance`, `test:seo`, and `analyze`.

## A1 CMS Foundation

Eight reusable object types and seven content documents are now registered in the
existing `sanity/schemaTypes` directory, alongside the unchanged product/category
models. Studio has grouped navigation, fixed-ID singleton editing safeguards,
and the Media plugin. Website/Studio ports remain 3000/3333.

This is the model/Studio foundation, not automatic frontend content integration.
Only existing catalog queries are currently wired. No singleton content was
seeded/published and no existing CMS records were overwritten.

The current dataset is public: inquiry storage/editing is deliberately disabled
and its sidebar opens a privacy notice. A read-only schema is not authorization.
Private inquiry CRM needs separate secured storage, permissions, and server
integration first. Details, schema coverage, validation commands, and next
integration boundaries are in [CMS_FOUNDATION.md](CMS_FOUNDATION.md).

## Ubuntu VPS Deployment

Deploy in two steps: [deploy.sh](deploy.sh) starts the website and Studio in
Docker, then [setup-domain.sh](setup-domain.sh) configures Nginx, HTTPS, and the
Studio at `/admin`. Full Ubuntu instructions are in
[DEPLOY_UBUNTU.md](DEPLOY_UBUNTU.md).

## Resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
