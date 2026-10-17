# Phase 8 SEO and Performance Report

## Measured Results

Lighthouse 13.5.0 ran against a local `next start` production build on port 3002
using installed Chromium, default mobile simulation and desktop preset. Audits
ran sequentially. These are lab results on this Windows machine, not field Core
Web Vitals, a public PageSpeed result, or a promise of search ranking.

Final audit timestamps: 2026-10-17 04:02:12Z (mobile), 04:02:39Z (desktop).

| Metric | Mobile | Desktop |
| --- | --- | --- |
| Performance | 82 | 86 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| First Contentful Paint | 1.3 s | 1.2 s |
| Largest Contentful Paint | 4.0 s | 3.8 s |
| Total Blocking Time | 260 ms | 180 ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 2.3 s | 2.0 s |

**The 90+ performance target is not met.** LCP still exceeds 2.5 seconds in these
local runs. TBT is a lab diagnostic, not INP. FID is retired as a Core Web Vital;
production INP should be measured from real interactions (good threshold 200ms),
alongside LCP and CLS at the 75th percentile. No field INP data exists yet.

The first baseline run scored 58 mobile / 78 desktop, with mobile TBT 1230ms.
An intermediate run scored 67 / 59, demonstrating local run-to-run variation.
Do not compare isolated runs as guaranteed production gains. The final focused
pass reduced mobile TBT to 260ms and removed repeated word-level Motion work.
Remaining audits flag main-thread/layout work, unused JS (~72 KiB estimated),
image delivery (~24 KiB estimated), and legacy JS (~14 KiB estimated). A label/name
match diagnostic also remains non-scoring despite the 100 accessibility category;
review the rendered brand link with assistive technology during final content QA.

## Implemented

- Central `lib/seo.ts` provides unique titles, descriptions, canonical URLs,
  Open Graph, and Twitter cards. All six static public routes and a dynamic
  product route were inspected on the production server.
- `NEXT_PUBLIC_SITE_URL` accepts an HTTP(S) origin only. Its fallback is the
  supplied `https://a2meridian.com`; confirm ownership/production hostname before
  deployment. No homepage canonical is blindly inherited by every child route.
- Google verification is emitted only when `GOOGLE_SITE_VERIFICATION` is set.
  No placeholder verification code, social profile, employee count, phone number,
  unverified certification, or approximate coordinate was inserted in JSON-LD.
- Script-safe Organization/LocalBusiness and WebSite JSON-LD uses the real `q`
  catalog search parameter. Product pages have BreadcrumbList data. Non-sample
  Product data has resolved Sanity image URLs; no zero-price offer, invented SKU,
  manufacturer brand, availability claim, or expired date is fabricated. An
  inquiry-only listing without offers/reviews may not qualify for Google Product
  rich results, which is preferable to misleading markup.
- Sample products remain noindex for both robots and Googlebot, are absent from
  the sitemap, and do not emit Product markup. Current eight sample documents
  were not changed. Verified non-sample published products can enter the sitemap.
- Native Next.js `app/sitemap.ts` and `app/robots.ts` replace the older guide's
  next-sitemap/postbuild workflow. XML and robots responses were verified. No API
  or Studio URL is listed; `_next` resources are not blocked from rendering bots.
  Sitemap failures are not silently replaced by an incomplete list.
- Reproducible 1200x630 OG JPG, A2 monogram logo, ICO/SVG icons, and 180px Apple
  icon are generated locally. The monogram is a provisional brand asset, not a
  supplied official logo. Source photo provenance remains in public/home/ASSETS.md.
- Existing variable `next/font` setup is retained and the less-used mono font is
  no longer globally preloaded. No external Google-font preconnect is needed.
- Optimized local hero WebP and high fetch priority improve image delivery;
  Next Image owns responsive preloading, avoiding duplicate global hero requests.
  AVIF/WebP formats and the existing restricted Sanity remote pattern are enabled.
- Below-fold homepage map waits until near the viewport. Shared text/scroll
  reveals are CSS/IntersectionObserver-driven, progressively visible in server
  HTML; magnetic motion is CSS-based, cursor loads after eligible pointer use,
  and desktop parallax runtime waits for scrolling. Reduced motion remains supported.
- Compression and nosniff/frame/referrer/permissions headers are verified.
  Deprecated X-XSS-Protection and blanket immutable caching of mutable filenames
  were not added. Next retains its hashed-asset cache policy.
- Native Turbopack analysis is available with `npm run analyze`, producing
  `.next/diagnostics/analyze`. The installed optional Webpack analyzer is not
  attached to the Turbopack build. Do not replace this app's Turbopack/Tailwind
  integration merely to use a Webpack-only report.

## Reproduce

```powershell
npm run seo:assets
npm run build
# Separate terminal; choose an unused audit port.
$env:NODE_OPTIONS = ($env:NODE_OPTIONS + ' --use-system-ca').Trim()
npm run start -- --port 3002
# Another terminal, after the production server is ready:
npm run audit:performance
npm run test:seo
npm run analyze
```

Audit defaults to `http://localhost:3002/`; set `AUDIT_URL` to change it and
`CHROME_PATH` if Chromium is installed elsewhere. HTML/JSON reports and summary
are in `.next/audits`. These ignored build artifacts may be removed by a rebuild;
this tracked report retains the observed final numbers. Close the temporary
audit server after testing. Normal website/Studio commands remain ports 3000/3333.

## Launch Work Remaining

1. Verify domain ownership, real contact details, office address, legal policies,
   company claims, sample product replacements, and the provisional brand logo.
2. Configure Search Console verification and submit the deployed sitemap. Ranking,
   public PageSpeed, and Google's Rich Results validation require the real site;
   they have not been claimed as completed locally.
3. Profile the final production deployment on representative devices, inspect
   LCP image/font timing and unused JS with the bundle snapshot, and repeat
   Lighthouse runs under controlled load. Reach 90+ with measured evidence.
4. Collect field Web Vitals; do not interpret Lighthouse's TBT as field INP.
5. Configure/verify real Resend delivery and production spam controls described
   in INQUIRY_SETUP.md. This SEO phase did not configure credentials or send email.

The existing npm audit still reports 19 advisories (7 moderate, 12 high). No
blind forced upgrades were run. Review affected dependency paths separately.