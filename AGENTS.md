# AGENTS.md — Medicine Directory

## What this project is

A Medicine Directory built on the public [openFDA Drug Label API](https://open.fda.gov/apis/drug/label/).

Two pages: a homepage search, and an SEO-friendly per-medicine detail page. No backend — all data comes live from openFDA at request time (server-side in Next.js route/page handlers).

**Important framing:** openFDA is a **US FDA dataset**. This product is explicitly "US drug label data, India-first UX" — not a claim that the drug data itself is Indian. Don't write code or copy that implies Indian regulatory sourcing (e.g., don't reference CDSCO, don't imply Indian brand-name coverage). If a feature would require India-specific drug data, flag it in comments as a known gap rather than faking it.

## Stack
- Next.js 14, App Router, TypeScript (strict mode)
- Tailwind CSS — use the default spacing/typography scale, avoid arbitrary values (`top-[13px]`)
- TanStack Query for data fetching/caching on the client
- No backend, no database, no auth
- Node package manager: npm

## Architecture rules (don't violate these)

- **All openFDA access goes through `lib/openfda.ts`.** No `fetch()` calls to the API from components or pages directly. If a new endpoint or query shape is needed, add a function there.
- **Routing:** medicine detail pages live at `/medicine/[slug]`. `slug` encodes both the brand name and `set_id` (see `lib/slug.ts`) because brand names alone collide across formulations (e.g., multiple "Advil" variants share a name but not a `set_id`). Never route by raw brand name alone.
- **Types:** `types/drug.ts` defines only the fields this app actually renders. All openFDA fields are optional (`?: string[]`) — the API is inconsistent about which fields are present per record. Never assume a field exists without a fallback.
- **Search results page is the disambiguation UI.** When a search returns multiple records, show them as a list (`DrugCard`) rather than auto-navigating to the first match, even if results look similar.
- **Missing-field handling is centralized.** Use `formatFieldOrFallback` (or equivalent shared helper) everywhere a field might be absent — don't hand-roll fallback strings per component. Fallback copy: `"Not provided by the manufacturer for this formulation."`
- **Loading states are skeletons, not full-page spinners**, on every page that fetches data.
- **Errors are visible in the UI**, not just logged — every data-fetching component needs a distinguishable zero-results state, error/timeout state, and loading state. These three are visually distinct from each other.

## Content / product rules

- The disclaimer ("this is US FDA data via openFDA, not medical advice, consult a doctor or pharmacist") must be visible without scrolling on both the homepage and detail page — never footer-only.
- Warnings and dosage information are the primary content a health-anxious user came for — keep them above or immediately alongside active ingredients, not buried below marketing-style copy.
- Every detail page needs `generateMetadata` (title, meta description ≤155 chars, canonical, OpenGraph) and JSON-LD (`schema.org/Drug`) — this is core to the assignment, not optional polish.

## openFDA quirks worth knowing before you "fix" something

- A search with **zero matches returns an HTTP 404** with `error.code: "NOT_FOUND"` — this is not the same as a network/server error and must not be handled by the generic error state.
- Many fields (`purpose`, `warnings`, `dosage_and_administration`, etc.) are **absent entirely** on some records rather than present-but-empty. Check for `undefined`, not just `.length === 0`.
- `spl_product_data_elements` and similar raw SPL dump fields are unstructured noise — don't parse or render them.
- Brand names can include odd characters/casing (e.g. `"Advil;II"`) — always encode before building query strings or slugs.

## Commands

```bash
npm run dev       # local dev server
npm run build     # production build — run before considering a task done
npm run lint       # eslint
```

Treat a broken `npm run build` as a failing task, not a warning to ignore.

## What NOT to do

- Don't add a backend, database, or auth — out of scope.
- Don't dump every raw openFDA field onto the page "to be thorough" — the assignment explicitly rewards a curated, deliberate feature set over a full API field dump.
- Don't silently swallow errors in try/catch with no UI state change.
- Don't invent Indian drug data or imply this covers Indian-market brand names.