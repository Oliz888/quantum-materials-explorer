# Quantum Materials Explorer

An interactive static website for exploring materials, researchers, techniques, and physical phenomena. Every explorer page and the About page have a **Data source** selector. Exactly one source is displayed at a time; the two publication collections and entity catalogs are never combined.

- Existing public website: https://oliz888.github.io/quantum-materials-explorer/
- Git repository: https://github.com/Oliz888/quantum-materials-explorer
- Local checkout: `/Users/shiruizhou/Desktop/EPiQs/working space/Olivia/hypergraph-explorer`

## Sources

| Source selector | Records | Years | Origin |
| --- | ---: | --- | --- |
| EPiQS Postdoctoral Symposium | 812 | 2020–2026 | Original symposium-derived collection in `data.js`, retained without changes. Its existing header describes supporting publication records from WoS and arXiv. |
| Web of Science | 2,697 | 2014–2026 | The three Excel exports in `EPiQs/web of science`, normalized and combined within this source only. |

Source selection persists when navigating between pages and is encoded in the URL (`?source=symposium` or `?source=wos`). It is also remembered in browser local storage. Source switching clears graph searches, category filters, selected details, and timeline playback, and resets the year to that source's latest year.

The original `data.js` remains byte-for-byte unchanged. WoS has its own IDs, catalogs, and publication records in `data/wos.json`. A publication appearing in both sources is intentionally retained separately in each.

## Run locally

Requires Python 3 and a modern browser. There is no npm installation or build step for the website.

```bash
cd "/Users/shiruizhou/Desktop/EPiQs/working space/Olivia/hypergraph-explorer"
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://localhost:8000/?source=wos and enter the project password supplied separately. Stop the server with `Ctrl+C`. Choose another port if 8000 is occupied.

The graph library loads from `https://unpkg.com/vis-network/standalone/umd/vis-network.min.js`; internet access to this CDN is required. Its version is not pinned. The WoS dataset loads on demand with `fetch`, so use an HTTP server rather than opening the HTML via `file://`. Use localhost or HTTPS for the Web Crypto password check.

## Pages and controls

| Page | Graph |
| --- | --- |
| `index.html` | Materials Co-occurrence Network: materials linked when their tags occur in the same paper. WoS includes both compounds and broader material families. |
| `collaboration.html` | Co-authorship among the researcher/name IDs recorded in the selected dataset. |
| `techniques.html` | Technique–material bipartite graph, with Characterization, Synthesis, and Computational filters. |
| `phenomena.html` | Phenomena linked when they occur together in at least three papers. |
| `physics-map.html` | Research traditions, topics, questions and history: independent physics, chemistry, materials-science and quantum-information entries. |

Three pages have a cumulative year cutoff and animation. The technique page uses all years in the selected source. Search filters graph nodes. Click a node to see its details and associated papers. Detail panels respect the year cutoff.

**Browse papers** includes all papers through the selected year, including papers without any recognized material, technique, or phenomenon. It supports title/DOI/author search and pagination. This paper list does not apply the graph's node-name search or technique-category filter. DOI links open the publication. WoS paper cards include source filenames, sheet/row references, and expandable evidence for automated tags.

WoS collaboration defaults to the top 100 author name groups by publication count; choose 250 or 500 to expand it. Search applies across all 9,073 name groups before this display limit. Edges are the induced graph among the displayed names, so hidden names and their edges are omitted from the view, not removed from the dataset.

Graphs are pairwise projections; the materials page is titled “Materials Co-occurrence Network.” Node size increases nonlinearly with paper count. Edge width increases with shared-paper count. Force-layout position is not a measured scientific distance. Connections indicate record co-occurrence, not independently established causal or scientific relationships.

## Field Map

The new **Field Map** tab is a conceptual reading guide, independent of either publication dataset. Click nodes to explore deeper, use breadcrumbs or Back to retrace a route, or search in Chinese or English. Other physics domains have overview entries only, except atomic/optical routes relevant to the readings. English mode displays English labels only; the Chinese interface remains available separately. Nodes omit repetitive navigation hints. Shared topics can be reached from more than one direction; cross-links do not assert disciplinary descent.

Hover or keyboard-focus a node to see its development period and milestones. Its detail panel includes source links. The timeline covers selected events through 2021, with the displayed cutoff extending to the readings' 2025 publication year; it does not claim an exhaustive current history. Use the range control to filter events, select a card for context and its source, or click a timeline marker to open the associated topic. Approximate development periods are distinguished from dated discoveries, proposals, synthesis advances and institutional milestones.

Broad domains are selected from [APS PhySH](https://physh.org/disciplines). The expanded routes synthesize [Nature Physics (2016)](https://doi.org/10.1038/nphys3668), [Cava, de Leon & Xie (2021)](https://doi.org/10.1021/acs.chemrev.0c01322), and [Goyal et al. (2025)](https://doi.org/10.1186/s40712-024-00202-7), supplemented by linked original papers and institutional histories. This is an interpretive map, not a formal exhaustive classification. Field, mechanism, material, state, and research-approach labels distinguish different kinds of nodes.

The URL preserves the route, language, timeline cutoff, activity lens and scope; browser Back/Forward restore them. The publication source selector only controls which dataset opens when returning to publication pages. The map uses local assets, no graph CDN, and the existing password gate.

### Reading coverage and field formation

The map now has 98 nodes. Physics, chemistry, materials science and quantum information are independent entry points under `landscape`; old URLs starting at `physics` still work. Expanded topics carry research questions, labeled as editorial synthesis, and original-paper page or table references. The coverage panel links the principal sections and categories of all three readings directly to nodes:

- **Nature Physics, p. 105:** symmetry/order, correlations, topology and emergent excitations, and engineered platforms (atoms, ions, defects, circuit QED and heterostructures).
- **Cava et al., pp. 2777–2779:** its three themes of experimental discovery, prediction/interpretation, and information/energy applications; including the eleven reviewed subject areas, crystal chemistry, orbitals, doping, electrides and colloidal dots.
- **Goyal et al., pp. 1–32:** the four property themes, all Table 1 categories with corrected node types, the principal application sections, theory/measurement examples, and Table 3 methods grouped into six families. Soft/organic materials retain their more limited coverage status. The broad fabrication inventory does not imply equal field relevance for every method.

The formation view distinguishes expansion of a name and problem scope from material discovery and cross-field exchange. It does not infer a single disciplinary founder, or a merged discipline, from these readings. Timeline lenses separate discovery/theory, material design/preparation, and naming/community. Activities can overlap; the selected events are not matched histories establishing disciplinary priority. The map preserves the distinction between established phenomena, candidate platforms, methods, materials and prospective applications.

## WoS preprocessing

Inputs (original workbooks are never edited):

```text
/Users/shiruizhou/Desktop/EPiQs/web of science/
├── savedrecs.xls          (1,000 records)
├── savedrecs - 1.xls      (1,000 records)
└── savedrecs - 2 .xls     (697 records)
```

The separate folder `/Users/shiruizhou/Desktop/EPiQs/website database/` contains three older exports and is **not** part of this import.

The reproducible import uses only local files and deterministic rules. It makes no network requests or model calls.

1. Read all `.xls` files and sheets in the input directory. Verify required headers. Record each input file's SHA-256, sheet name, and original 1-based row number.
2. Normalize Unicode with NFKC and collapse whitespace. Keep raw workbooks intact. Normalize DOI prefixes and case. Parse publication years as integers.
3. Deduplicate by exact normalized WoS UT or DOI. A title/year fallback is used only for records without either identifier; distinct identified records with the same title stay separate. Fill missing values, union selected list fields, retain source-row provenance, and audit scalar conflicts. An inconsistent UT/DOI bridge stops the import for review.
4. Quarantine missing-title or invalid-year records in the report. The current three files have no rejected records or duplicates: all 2,697 records remain. Six records lack a DOI and eight lack an abstract.
5. Build independent author name groups, material/technique/phenomenon catalogs, and paper records. IDs are source-prefixed and deterministic. All relationship IDs must resolve.
6. Write the website subset to `data/wos.json`, a report to `data/wos-report.json`, and the complete normalized merged records to `web of science/processed/wos-merged.json` **outside this repository**.

The full normalized audit preserves the exported fields locally. The website subset omits email addresses, reprint addresses, full funding text, and full abstracts. It includes bibliographic metadata, mapped institution names, keywords, and short evidence excerpts.

### Entity extraction and interpretation

Rules live in `scripts/wos_rules.json`. The importer searches normalized **Article Title**, **Author Keywords**, and **Abstract**, in that order. It does not use Keywords Plus for tagging. Each matched entity records the source field, matched text, character offsets, and an excerpt. Formula rules use token boundaries (for example, `FeSe` does not match `FeSe2`). Catalogs contain 65 material/family rules, 25 technique rules, and 36 phenomenon rules.

These are **automated text mentions**, not validated statements that a paper experimentally studies a material or applies a technique. Background references, negations, generic terminology, and ambiguous acronyms can match. Terms outside the dictionary, uncommon chemical formatting, doped formulas, and synonyms may be missed. Broader families and specific compounds may both tag one paper. No semantic relevance filter was applied to the imported collection: all valid supplied records remain, including records outside a narrow quantum-materials topic definition.

Current coverage:

| Tag type | Papers with at least one tag |
| --- | ---: |
| Materials / material families | 1,216 |
| Techniques | 1,252 |
| Phenomena | 2,052 |
| Both material and technique | 649 |

The current WoS graphs have 61 active material/family nodes, 25 active technique nodes, and 36 active phenomenon nodes. Coverage refers to the current dictionary and these supplied exports, not the whole field or all WoS publications.

Authors are grouped by normalized full name (falling back to the abbreviated author field when necessary). Case and whitespace variants merge; other spelling variants can remain separate, and different people with the same full name can be conflated. These 9,073 groups are not a verified count of unique people. Institutions are collected only from explicit bracketed name–address mappings; unmatched affiliations remain labeled as unmapped. ORCID-based identity reconciliation and cross-source person matching are not performed.

### Rebuild

For a fresh Python environment:

```bash
python3 -m venv .venv
.venv/bin/pip install -r scripts/requirements.txt
.venv/bin/python scripts/preprocess_wos.py
```

The defaults are derived from the checkout's location. After moving or cloning the repository, supply explicit paths:

```bash
.venv/bin/python scripts/preprocess_wos.py \
  --input "/path/to/wos-exports" \
  --audit "/path/outside-the-web-repository/processed" \
  --output data
```

Inspect `data/wos-report.json` after rebuilding. Review changed matches and unmatched coverage before drawing research conclusions. When updating web assets for deployment, increment their cache-version strings in the four HTML pages and the WoS URL in `explorer.js` as appropriate.

## Code organization

| File | Responsibility |
| --- | --- |
| Four explorer `.html` files | Accessible page structure, navigation, labels, and controls. |
| `about.html`, `about.js` | Source-aware purpose, methods, coverage, graph definitions, and limitations. |
| `physics-map.html`, `physics-map.css`, `physics-map.js` | Responsive conceptual map, drill-down navigation, search, bilingual details and linked timeline. |
| `physics-map-data.js` | Topic graph, historical milestones, graph traversal and filtering. |
| `physics-map-readings.js` | Source-grounded topic additions, research questions, reading coverage with page locators and field-formation perspectives. |
| `bootstrap.js` | Loads page scripts and datasets only after the password gate is unlocked. |
| `style.css` | Shared layout, graph controls, source selector, and paper cards; responsive layout. |
| `data.js` | Original 812-paper symposium dataset and its legacy helpers. Unmodified by this import. |
| `data/wos.json` | Independent processed WoS dataset, fetched only when selected. |
| `data/wos-report.json` | Input hashes, deduplication/rejection counts, coverage, and method. |
| `graph-core.js` | Pure graph construction, filtering, counts, and entity-to-paper queries. |
| `explorer.js` | Source loading, persistence, controls, vis-network rendering, and paper/detail panels. |
| `auth.js` | Password entry, versioned tab session, and Lock site action. |
| `scripts/preprocess_wos.py` | Reproducible local `.xls` import. |
| `scripts/wos_rules.json` | Auditable extraction dictionary and patterns. |
| `tests/` | Preprocessing and graph regression checks. |

The shared graph module fixes the old stale-search behavior after year changes and uses the selected cutoff in detail panels. Original technique labels `Experiment` and `Theory` map to the existing UI's Characterization and Computational categories without modifying the source dataset.

The parent directory's `fetch_papers.py`, `papers_output.json`, and `papers_summary.tsv` are separate historical OpenAlex retrieval files and are not used by this import or by the website. That old script still contains output paths under `Desktop/quantum materials`; review those paths before running it.

## Verification

```bash
node --test tests/*.test.js
.venv/bin/python -m unittest discover -s tests -p 'test_*.py'
```

The Python integration check uses the local raw-export audit path above. The graph tests use the committed website datasets. Tested behaviors include source isolation, original dataset counts, year cutoffs, search after time filtering, category filters, author search before the top-N limit, visible edge endpoints, and the phenomena threshold. The preprocessing tests exercise duplicate rules, scalar-conflict recording, conflicting identity bridges, formula boundaries, ID resolution, and every extracted match's offsets against its normalized source record.

Browser checks cover source switching, persistence across navigation, the earlier WoS timeline, collaboration limits/search, technique categories, paper browsing, source-row provenance, and tag-evidence display. These checks establish software behavior and structural provenance, not scientific validity of automatic tags or author disambiguation.

## Password and publication

The password is not included in this README and has not been changed. `auth.js` compares its SHA-256 hash and stores an eight-hour session in `sessionStorage` under `qm_auth_v2`. The old `qm_auth` flag is retired, so previously unlocked tabs must sign in again. All five pages start hidden behind the gate; `bootstrap.js` waits for successful entry before loading explorer scripts or datasets. Valid sessions are reused across navigation in the same tab; expiry is checked at the next page load. **Lock site** clears the session and reloads the page.

This is a browser display gate, not server-side access control or encryption. Static assets and the public repository remain directly retrievable, including earlier published versions. Do not treat this interface password as confidentiality for data. Actual access control requires a hosting or data-serving layer that authenticates each protected request.

The existing GitHub Pages configuration was read during this update: it serves the root of the `main` branch. To publish a reviewed update, commit the static pages, shared scripts, styles, and `data/` assets and merge/push to `main`. No build step is needed. Keep raw workbooks and the full normalized audit outside the web repository. Review the Pages build and verify the deployed source selector after publishing.

The initial WoS integration was developed on `codex/wos-source-selector`; the About page and access-gate update were developed on `codex/about-and-password`. The raw Excel files and full normalized audit remain local; only the processed website subset belongs in the published site.
