# nxtwave — Know Your Medicine, Before You Take It

A modern, high-trust medicine information and drug label directory built on official US FDA openFDA datasets, architected specifically around Indian healthcare search behaviors and an editorial-first user experience.

---

## 1. Product & UX Architecture

### "US Data, India-First UX" Framing
The openFDA API provides structured, verified drug labeling directly from pharmaceutical manufacturers and US FDA filings. However, raw FDA data presents specific challenges for non-US users:
- **Data Reality**: openFDA contains US brand names (e.g., Tylenol, Advil, Motrin), US National Drug Codes (NDC), and US-specific regulatory classifications.
- **Indian Search Behaviors**: In India, consumers commonly search by local brand names (e.g., *Dolo 650*, *Crocin*, *Combiflam*, *Brufen*) or active generic salts (*Paracetamol*, *Ibuprofen*, *Cetirizine*), where dosage forms and combined strengths vary significantly.

To bridge this gap respectfully and accurately:
1. **Above-the-Fold Regional Transparency**: Every medicine detail page prominently features a clear disclaimer directly below the hero identity block:
   > *"Source: US FDA drug label. This label data is indexed from the United States Food and Drug Administration (FDA). Medicine availability, brand names, formulations, approved indications, and labeling may differ in India and other countries. Always verify with local regulatory labels and consult a healthcare professional."*
2. **Ingredient-First Clarity**: We extract and highlight active ingredients, strengths, and classifications (e.g., *NSAID*, *Pain reliever / fever reducer*) so users can cross-reference the chemical composition of their local medication with verified FDA label monographs.
3. **Multi-Formulation Switching**: In Indian pharmacy practice, brand names frequently encompass multiple delivery forms (tablets, caplets, syrups, suspensions, drops). The `FormulationSelector` is embedded directly into the hero block, allowing users to switch between formulations without full-page reloads.

---

## 2. Editorial Layout & Hierarchy

Instead of dumping raw API string blobs, the medicine detail page (`app/medicine/[slug]/page.tsx`) implements a clean editorial hierarchy:

1. **Breadcrumb**: Semantic navigation (`Home / Medicines / {brand name}`) linking back to search.
2. **Hero Identity Block**:
   - Primary `<h1>` for brand name.
   - Clean ingredient + strength subtitle derived via `formatIngredientSubtitle` (e.g., *"Acetaminophen 250 mg + Ibuprofen 125 mg"*).
   - Badges for dosage form (*Tablet*, *Drops*, *Capsule*), administration route (*Oral*, *Topical*), and product type (*OTC*, *Prescription*).
   - Embedded interactive `FormulationSelector`.
   - Bolded one-line purpose summary.
3. **Source & Regional Disclaimer**: Above-the-fold guidance explaining US FDA dataset scope and international label differences.
4. **"At a Glance" Card**: Two-column summary table for Active ingredients, Strength, Dosage form, Route, Product type, and Manufacturer. Purely supplementary or missing rows are strictly omitted rather than cluttered with fallback text.
5. **Active Ingredients**: Individual `IngredientCard` components displaying Name, Strength badge, and Classification (e.g., *NSAID*). Falls back to a unified raw block when text cannot be safely parsed.
6. **Uses & Indications**: Purpose bolded, with run-together symptoms split into clean bullet points with validation guards (< 40 characters per item, >= 2 items) or paragraph prose.
7. **Dosage & Directions**: Node-safe HTML table parser (`cheerio`) rendering structured Tailwind tables without raw HTML injection (`dangerouslySetInnerHTML`), standard plain text fallback, and a fixed directions disclaimer.
8. **Important Safety Information**: Heuristic splitter matching FDA warning headers (*Allergy alert*, *Stomach bleeding warning*, *Heart attack and stroke warning*, *Liver warning*, *Sore throat warning*, *Reye's syndrome*, etc.) rendered using zero-JS native `<details>`/`<summary>` accordions with fallback to a single block when no headers match.
9. **Structured Safety Precautions**: Dedicated sections for API fields (*Do not use*, *Ask a doctor before use*, *Pregnancy & breastfeeding*, *When to stop use*) with explicit, visually de-emphasized fallback copy (*"Information not available in this label"*).
10. **Technical & Regulatory Metadata**: Collapsed-by-default disclosures for *Other ingredients* (inactive ingredients list) and *Label information* (NDC codes, SPL set ID, version, formatted effective date, application number).
11. **Light Theme Enforcement**: Universal light-theme design system with CSS `color-scheme: light !important;` to ensure consistent readability across all devices and OS color preferences.

---

## 3. Search & Ranking Architecture

openFDA's search API only supports exact and prefix matching on specific fields and has no built-in typo tolerance or fuzzy matching:
- **Broad Lucene Candidate Retrieval**: Combines `openfda.brand_name`, `openfda.generic_name`, `openfda.substance_name`, significant first tokens, and prefix wildcards in a single sanitized query.
- **Hybrid Re-ranking**: Combines exact match weighting (70%) with Fuse.js fuzzy string similarity (30%), inverted so perfect matches score highest.
- **In-Memory Rate Limit Protection**: In-memory caching with a 60-second TTL prevents hitting openFDA's 40 requests/minute rate limit.
- **Query Sanitization**: Escapes Lucene special syntax characters and boolean operators (`AND`, `OR`, `NOT`) to prevent query injection and malformed queries.

---

## 4. SEO & Performance

- **Server-Side Rendering (SSR)**: Dynamic page generation with automatic metadata generation (`generateMetadata`), canonical URL tags, and OpenGraph sharing tags.
- **Structured Data (Schema.org JSON-LD)**: Injected `Drug` schema markup on the server containing brand name, generic name, active ingredients, manufacturer organization, dosage form, and warnings for search engine rich snippets.
- **Zero-JS Interactivity**: Accordions and disclosures use semantic HTML `<details>` and `<summary>` elements, maintaining full interactivity without client-side state overhead.

---

## 5. What I'd Do Differently with More Time

1. **Dual-Dataset Indian Drug Mapping**:
   - Cross-reference openFDA chemical substance monographs with Indian CDSCO (Central Drugs Standard Control Organisation) and Jan Aushadhi generic drug databases to provide localized Indian pricing, domestic brand equivalents (e.g. mapping Tylenol -> Paracetamol 500mg / Dolo 650), and Jan Aushadhi store availability.
2. **Client-Side Embedding Search**:
   - Integrate a lightweight client-side embedding model (via `transformers.js` / ONNX) to support true semantic symptom searches (e.g. searching *"pounding headache behind eyes"* or *"dry cough at night"* to surface relevant active ingredients) alongside keyword retrieval.
3. **Drug-Drug Interaction Checker**:
   - Build a client-side multi-medicine comparison drawer allowing patients to input 2+ drugs and inspect potential active ingredient overlaps (e.g. accidental dual acetaminophen toxicity) and known contraindications.
4. **Multilingual Localization**:
   - Provide localized translations of critical warnings and directions in Hindi, Tamil, Telugu, Bengali, and Marathi for broader accessibility across India.

---

## 6. Project Setup & Verification

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Run Automated Unit Tests
```bash
npm run test
```
Executes Node.js test runner (`tsx --test`) verifying ingredient parsing, warning header splitting, zero-header fallbacks, dosage table HTML parsing, and bullet point parsing.

### Build Production Bundle
```bash
npm run build
```

---

## 7. Metadata

- **Time Spent**: 8 hours
- **AI Harness / Models Used**: Google Antigravity
