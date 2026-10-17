# A1 Content Foundation

The existing standalone Studio runs from this repository on port 3333. Schemas
live in `sanity/schemaTypes`, not a separate a2-meridian-cms project. Project ID,
dataset, environment loading, and the existing product/category models remain
unchanged. No cloud content was created, deleted, migrated, or published by A1.

## Registered Models

Eight reusable types: `seo`, `blockContent`, `teamMember`, `timelineItem`,
`countryEntry`, `officeLocation`, `statItem`, and `valueItem`.

Seven new documents: `siteSettings`, `homepage`, `aboutPage`, `globalReachPage`,
`certification`, `contactPage`, and the disabled `inquiry` model. Together with
existing `category` and `product`, the registry contains 17 distinct types.

Portable Text includes headings, lists, decorators, validated links, and images
with required alternative text. Images throughout content models have alt text
and optional illustrative flags. Numeric values, order, office/map coordinates,
country IDs, certification dates, and duplicate country entries have validation.
SEO title/description length warnings are recommendations, not blocking errors.

Homepage also includes the current service/reason sections, category references,
global preview, and logistics names; About includes the gallery; Global Reach
includes the trade process. These extend the supplied models to cover current
website surfaces without silently omitting them.

## Studio Organization

The sidebar groups Pages, Products, Certifications, Inquiries - Setup Required,
and Site Settings. Media is an additional plugin alongside Structure and Vision.

Fixed singleton IDs are `siteSettings`, `homepage`, `aboutPage`,
`globalReachPage`, and `contactPage`. Studio creation templates and global create
options exclude those types; duplicate/delete/unpublish actions are filtered.
Their editor panels are reached through fixed-ID sidebar entries. Existing
duplicates created outside this Studio would need a separate content audit.
These are Studio editing safeguards, not Content Lake API authorization. Do not
treat hidden menu entries or filtered actions as role-based access control.

The installed Studio uses the older structure/action pattern. No unsupported
`singleton: true` schema option or newer-version-only singleton API is used.
Ordinary product/category/certification documents keep server-generated IDs.

## Inquiry Privacy Boundary

**The current website dataset is public. Do not store inquiry personal data or
internal notes in it.** A public dataset is readable outside Studio. `readOnly`,
hidden fields, action filters, and a private-looking dashboard do not make records
confidential. Public asset URLs are not confidential file storage either.

The requested inquiry type is registered as a dormant, document-level read-only
model. Its creation templates and all actions are disabled, and the sidebar opens
a privacy notice instead of a live list. No inquiry write path was added to the
website API. The existing Resend endpoint remains unchanged, including its pending
real credential/delivery setup. No submitted data was stored in Sanity by A1.

Before enabling CRM storage, implement a separate private dataset or secured
backend with server-only narrowly scoped writes, authenticated staff reads,
retention/deletion rules, audit controls, and an appropriate privacy notice.
Dataset provisioning, permission changes, and private-workspace wiring are not
part of this schema-only phase. A product reference in another dataset needs a
cross-dataset reference or a validated product ID/text snapshot, not the current
same-dataset reference unchanged. The extra `productInterestText` field supports
free-text categories when there is no specific product. Inquiry preview avoids
displaying personal names/emails as list titles in this disabled workspace.

The contact document's `notificationEmail` is labelled informational; it does not
override server `INQUIRY_TO_EMAIL`. Do not put private recipient addresses, API
keys, server secrets, or internal operational notes into public content fields.

## Content Integrity

Certification display defaults to false rather than assuming validity. Expiry
cannot precede issue date, and the frontend must still evaluate evidence/dates
when eventually wired. An active checkbox is not a certification verification.
Upload only public-approved, redacted certificate PDFs. ISO company certificates
are issued by certification bodies, not ISO itself.

Country entries retain requested ISO alpha-2 fields and add optional alpha-3,
numeric world-atlas IDs, continent, and longitude/latitude fields for the existing
map adapter. Future frontend wiring must map/validate these, preserving numeric
leading zeroes; two-letter codes alone do not highlight the current map file.
Evidence flags on metrics, milestones, and trade relationships default false.
Office coordinates have no invented default pin, and must be supplied as a pair.
The footer default uses `{year}` rather than an outdated hardcoded copyright year.

## What Is Not Wired Yet

Adding schemas does **not** automatically make the live website CMS-driven.
Existing product/category queries continue working. Site settings, homepage,
About, global map content, certificates, contact copy, Portable Text renderers,
SEO overrides, image adapters, preview, and cache invalidation still require
frontend query/component integration. No live page content was replaced by empty
singleton records. Sidebar fields can be drafted, but changes do not reach those
website sections until that integration is implemented.

## Validation

```powershell
npm run dev:studio
npm exec -- sanity schema extract --path .next/catalog-schema.json
npm exec --yes --package=tsx -- tsx --test scripts/foundation-schemas.test.ts
npm exec -- sanity build .next/studio-check --yes
npm exec -- sanity documents validate --yes --format ndjson
node scripts/check-studio-foundation.mjs
npm run lint
npm run build
```

The wrapper resolves the installed Sanity CLI from its package metadata, uses
system certificate authorities, and reports explicit child-process exit codes.
Use `--documents-only` to check document compatibility without rebuilding Studio.
For A1, standalone Studio build and document validation exited successfully;
schema extraction, all four foundation tests, lint, and the production website
build also passed. Authenticated sidebar, document editing, and Media interaction
still need a signed-in browser review; the shared browser reached the login screen.

Use the previously documented `--use-system-ca` setting on Windows if TLS errors
occur. Do not disable certificate verification. The shared automated browser may
need its own login even when the user's regular browser or CLI is authenticated.
Review the Studio panels after signing in. Media plugin installation retained
the existing npm audit advisories; no forced dependency upgrade was performed.