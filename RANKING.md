# Ranking Architecture — Hybrid Search

## Why this exists

openFDA's search API only supports exact and prefix matching on specific fields — it has no
built-in fuzzy or semantic matching. In practice this means:

- A typo (`"ibuprofin"` instead of `"ibuprofen"`) returns zero results.
- A multi-word query (`"advil pm"`) can miss formulations where the words don't appear as an
  exact contiguous phrase in `brand_name`.

This project has no backend and no vector database (out of scope per the assignment — "No
backend required"), so true semantic/vector search isn't an option here. Instead, we implement
a **pragmatic exact + fuzzy hybrid**: broaden what we retrieve from openFDA, then re-rank
client/server-side using a combination of exact keyword scoring and fuzzy string matching.

This is explicitly **not** vector/embedding search. There's no notion of semantic similarity
here — "ibuprofen" and "pain reliever" would not match each other under this system the way
they might under a real embedding model. What this does solve is typo tolerance and partial/
reordered token matching, which covers the actual failure mode we saw against the real API
(exact substring matching being too strict for how people actually type drug names).

## Architecture

```
                    Query (raw user input)
                              │
                    sanitizeLuceneQuery()
                              │
                              ↓
                  Broad candidate retrieval
              (OR across brand_name / generic_name /
               substance_name, single openFDA request)
                              │
                              ↓
                  Zero results? → this IS the
                  zero-results state (no further
                  fallback — see "Fallback logic" below)
                              │
                              ↓
                    Hybrid re-ranking
              ┌───────────────┴───────────────┐
              ↓                                ↓
      Exact keyword score              Fuzzy score (Fuse.js)
      (whole-phrase / whole-token       (typo-tolerant,
       match on brand_name,             partial match)
       generic_name, substance_name)
              │                                │
              └───────────────┬────────────────┘
                    hybridScore = (exact * 0.7)
                              + (fuzzy * 0.3)
                              │
                              ↓
                  Sort descending, return
```

## Candidate retrieval

A single broadened openFDA query combines brand name, generic name, and substance name into one
OR expression, rather than issuing separate requests per field. This keeps us to one API call
per search (important given openFDA's 40 requests/minute unauthenticated rate limit) while
casting a wider net than the original single-field `brand_name` query.

The raw user query is passed through `sanitizeLuceneQuery()` before being interpolated into the
query string, escaping Lucene special characters (`: " ( ) * ~`) and the literal tokens `AND`/
`OR`, since openFDA's search is Lucene-syntax underneath and unescaped input could either break
the query or be interpreted as a boolean operator the user didn't intend.

Wildcard prefix matching (`field:prefix*`) was considered but is **not used** unless verified
against the live API for the specific field first — several `openfda.*` fields are exact-match/
untokenized, and a wildcard against an untokenized field can silently return zero rather than
error, which looks identical to a genuine zero-results case. If wildcard support is confirmed
for a field, it can be added back in; until then we rely on the OR-across-fields approach for
recall.

## Re-ranking

### Exact score

`calculateExactScore(drug, query)` returns a normalized 0–1 score based on whole-phrase and
whole-token matches against `brand_name` (highest priority), `generic_name`, and
`substance_name`, in that order. An exact whole-phrase match on `brand_name` scores highest;
partial/token-level matches score lower but nonzero.

### Fuzzy score

Fuse.js is initialized with weighted keys:

| Field                      | Weight |
|-----------------------------|--------|
| `openfda.brand_name`        | 0.6    |
| `openfda.generic_name`      | 0.3    |
| `openfda.substance_name`    | 0.1    |

Threshold: `0.5` (moderate typo tolerance — loose enough to catch a one or two character typo,
tight enough not to surface unrelated drugs).

**Important correction from the initial plan:** Fuse.js scores are inverted — `0` means a
perfect match and `1` means no match at all. The raw Fuse score must be converted before use:

```
fuzzySimilarity = 1 - fuseResult.score
```

Using the raw Fuse score directly as a "similarity" would have weighted perfect matches lowest
instead of highest. This is covered by a unit test asserting a known exact match produces a
`fuzzySimilarity` near `1`.

### Combined score

```
hybridScore = (exactScore * 0.7) + (fuzzySimilarity * 0.3)
```

Exact matching is weighted higher because for a health-information product, precision on a
correctly-typed drug name matters more than recall on a mistyped one — fuzzy matching is a
safety net for typos, not the primary ranking signal. Results are sorted descending by
`hybridScore`.

## Fallback logic

The original plan included a separate "fall back to a direct single-field query" step if the
broad query returned zero results. This was removed: the broad query's OR expression already
includes the narrow single-field match as one of its clauses, so if the broad query returns
zero, the narrower fallback would too — that branch was unreachable as designed. A zero-result
broad+fuzzy query is treated directly as the genuine zero-results state, rendered by the
existing empty-state UI.

## Caching

Because openFDA rate-limits unauthenticated requests to 40/minute, and a debounced search can
still issue several broad queries during active typing, an in-memory `Map` cache keyed by the
sanitized query string sits in front of the openFDA request in `lib/openfda.ts`. This is
per-session (in-memory, not persisted) — it's a rate-limit safeguard, not a durability feature.

## What this is not, and what we'd do with more time

- **Not semantic search.** No embeddings, no vector store, no similarity beyond string-level
  matching. "Fever reducer" would not surface ibuprofen unless the words themselves appear in
  a matched field.
- **Not typo-correction on symptom or condition queries** — this hybrid only helps when the
  user is trying to type a drug name and gets it slightly wrong, not when searching by symptom.
- With more time and a backend in scope, the natural next step is embedding drug names/
  descriptions with a small model (e.g. via `transformers.js` client-side, avoiding an external
  API dependency) and adding true cosine-similarity ranking as a third signal alongside exact
  and fuzzy — genuinely combining keyword + vector search rather than keyword + fuzzy-string.

## Verification

- Unit tests confirm: `fuzzySimilarity` inversion is correct; sanitization escapes Lucene
  special characters without altering normal alphanumeric queries; a known typo ("ibuprofin")
  ranks the correct drug in the top results; an exact brand match ("Tylenol") still ranks itself
  first; an empty/invalid query is handled without throwing.
- Manual verification against the live openFDA API for: `"ibuprofin"`, `"advil pm"`,
  `"tylenol"`, `"amoxicillin"`.