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
| `physics-map.html` | V1: restored layered map with physics, chemistry, materials science and quantum-information entry points. |
| `physics-map-v2.html` | V2: interacting research traditions on the main map, plus PhySH, Goyal and npj classification views. |

Three pages have a cumulative year cutoff and animation. The technique page uses all years in the selected source. Search filters graph nodes. Click a node to see its details and associated papers. Detail panels respect the year cutoff.

**Browse papers** includes all papers through the selected year, including papers without any recognized material, technique, or phenomenon. It supports title/DOI/author search and pagination. This paper list does not apply the graph's node-name search or technique-category filter. DOI links open the publication. WoS paper cards include source filenames, sheet/row references, and expandable evidence for automated tags.

WoS collaboration defaults to the top 100 author name groups by publication count; choose 250 or 500 to expand it. Search applies across all 9,073 name groups before this display limit. Edges are the induced graph among the displayed names, so hidden names and their edges are omitted from the view, not removed from the dataset.

Graphs are pairwise projections; the materials page is titled “Materials Co-occurrence Network.” Node size increases nonlinearly with paper count. Edge width increases with shared-paper count. Force-layout position is not a measured scientific distance. Connections indicate record co-occurrence, not independently established causal or scientific relationships.

## Field Atlas / Field Map

`physics-map.html` restores the layered map from revision `e040616`, including its navigation, cross-links, reading coverage and timeline. `physics-map-v2.html` is the separate, overlapping atlas. Both pages link to each other, preserve language/source preferences and use the same access gate.

V2 opens with **Field connections**: Physics (including condensed matter), Chemistry (solid-state, crystal and electronic-structure traditions), and Materials science & engineering connect directly to quantum materials. Bidirectional arrows represent reciprocal research exchange, not an established genealogy, disciplinary priority, or a quantitative contribution. Shared examples change the questions shown in all three regions. The links are a reading-based synthesis of Nature, Cava and Goyal; they are explicitly distinguished from the three source-specific classification lenses below.

Three switchable classification lenses use the same topic IDs:

- **PhySH:** four official facets from APS PhySH 2.8.0 (Research Areas, Physical Systems, Properties, Techniques). The selected 45 topic-to-concept matches carry concept URLs, DOIs, inherited facet memberships, disciplines, and exact/related match qualifications. Professional Topics is omitted. Properties is deliberately sparse; ordinary-language properties are not automatically placed in that facet. Vocabulary is CC0; the version and source hash are retained in `physics-map-physh.js`.
- **Goyal:** four central property themes (confinement, correlations, topology, symmetry), plus material systems, applications, and preparation. Topology and symmetry share a subsection in the original. Seven visual regions are our organization of sections and Tables 1 and 3, not seven exclusive classes.
- **npj Quantum Materials:** six groups follow the journal's Aims & Scope. Explicitly named topics are separated from curated related mappings. Topics not itemized remain searchable as context; this does not assert exclusion by the journal.

The extended catalog contains 117 nodes, including background entries. Regions show representative topics and their category counts; the searchable index contains all mapped topics, and searching or enabling related context reaches the wider reading catalog. Selecting a topic highlights all its placements, links repeated occurrences, and shows research questions, source locations and mappings in other lenses. Region geometry is schematic, not a quantitative Venn diagram or disciplinary genealogy. Category filters do not turn shared topics into exclusive classes.

The physics–chemistry–materials-science connection layer retains three source-grounded cases: quantum dots, cuprates, and topological materials. Questions and assignments are editorial synthesis, identified separately from source claims. The source panel retains the principal themes and page/table references from Nature Physics (2016), Cava et al. (2021), and Goyal et al. (2025).

The timeline retains 25 selected events, through 2021, with a cutoff extending to the readings' 2025 publication year. Its three activity rows distinguish discovery/theory, material design/preparation and names/communities. An event can appear in multiple rows but the status count deduplicates it. Filter by selected topic, category, year and activity; click an event to read its source. The layout references Tokura et al. (2017), Figure 1, but does not reproduce its projected future as established history. Selected milestones cannot establish disciplinary priority.

English mode contains English labels only; Chinese mode remains available. The URL preserves lens, selected topic, category, language, query, context, bridge highlight and timeline settings. Browser Back/Forward restores state. Old `path=physics,...` links continue to open the layered V1; V2 also accepts a path and selects its final topic. The publication source selector only changes the return dataset for other pages. The atlas uses local assets and the existing access gate.

Desktop regions and a sticky inspector reflow to compact overlapping regions with a closable detail panel on mobile. Tooltip content is available on focus; tabs support arrow-key navigation. Automated checks validate lens membership provenance, shared identities, explicit-vs-related npj mappings, context preservation, extended references and timeline filters.

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
| `physics-map.html`, `physics-map.css`, `physics-map.js` / `physics-map-v2.js` | Responsive overlapping atlas, lens switching, search, bilingual details and historical activity rows. |
| `physics-map-data.js` | Topic graph, historical milestones, graph traversal and filtering. |
| `physics-map-views.js` | Source-specific memberships, additional scope topics, cross-field examples and history filtering. |
| `physics-map-physh.js` | Selected official versioned vocabulary, concept identifiers and explicit correspondence qualifications (CC0). |
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

The password is not included in this README and has not been changed. `auth.js` compares its SHA-256 hash and stores an eight-hour session in `sessionStorage` under `qm_auth_v2`. The old `qm_auth` flag is retired, so previously unlocked tabs must sign in again. All six pages start hidden behind the gate; `bootstrap.js` waits for successful entry before loading explorer scripts or datasets. Valid sessions are reused across navigation in the same tab; expiry is checked at the next page load. **Lock site** clears the session and reloads the page.

This is a browser display gate, not server-side access control or encryption. Static assets and the public repository remain directly retrievable, including earlier published versions. Do not treat this interface password as confidentiality for data. Actual access control requires a hosting or data-serving layer that authenticates each protected request.

The existing GitHub Pages configuration was read during this update: it serves the root of the `main` branch. To publish a reviewed update, commit the static pages, shared scripts, styles, and `data/` assets and merge/push to `main`. No build step is needed. Keep raw workbooks and the full normalized audit outside the web repository. Review the Pages build and verify the deployed source selector after publishing.

The initial WoS integration was developed on `codex/wos-source-selector`; the About page and access-gate update were developed on `codex/about-and-password`. The raw Excel files and full normalized audit remain local; only the processed website subset belongs in the published site.

## Institutional directory (October 2026)

The shared navigation contains one **Programs** entry. Its three subpages are:

- `programs.html`: university degrees, minors, specializations, certificates, curricula, research centers/themes and selected research networks.
- `labs.html`: institutes, research centers, facilities and industry partnerships.
- `federal.html`: major U.S. funding families, coordination and infrastructure initiatives.

Each page follows **relationship overview / host map → milestone timeline → detailed entries**. The blue, white and gray theme follows the publication homepage, including Field Atlas V2. Diagram colors still distinguish relationships and research categories.

`data/institutions.json` contains 93 distinct source-linked entries checked on 29 October 2026. The university view shows 20 entries, including five existing centers cross-listed from Labs; the other views contain 45 Labs and 33 Federal entries. `page` is the home page; `pages`, `viewGroups` and `roleLabels` permit multiple views without duplicate identities. Every entry keeps its actual organizational type.

Four complete named rosters remain represented: eight NSF QLCIs (August 2026 roster), five DOE National QIS Research Centers, five DOE NSRCs and four NDAA QIS centers. Other institutions and EFRCs are selected examples; this is not an exhaustive global inventory or a live list of open calls.

`parentId` records program–center links. `hostIds` identifies the universities named in the host/lead evidence; a shared host is not a claim of collaboration. The overview aggregates these links by directory group and separately marks cross-listing. Clicking a group opens that view and filters its entries. Hover/focus descriptions identify the groups and selected milestones.

Each `milestones` item has its own year, event label, type and source URL. The common time scale supports comparison across pages. Date and activity controls filter events only, preserving institutions with unknown dates. Announcement, renewal, class-period and actual launch dates must not be conflated.

`locations` records source-backed host cities with approximate coordinates and `precision: city`. The 57 mapped entries have 64 host records; nearby cities cluster in the display. Federal portfolios are not plotted at agency headquarters: that map derives locations from their linked centers. Distributed networks and the ISS facility are explicitly left without terrestrial research pins. `data/north-america-map.json` contains a simplified public-domain Natural Earth outline with attribution and source metadata.

`directory-core.js` handles cross-listing, filters, relationship aggregation, milestones and CSV export. `directory.js` renders after the existing access gate resolves, independently of publication data. Search (`q`), group (`group`) and publication context (`source`) remain in URLs. Entity fragments open their evidence details. CSV exports retain milestones, geographic sources and official references.

When updating, verify official evidence, preserve status distinctions and unknown dates, update check metadata, and run `node --test tests/*.test.js`. A live institutional page alone does not verify continued award funding.

## Institutional Atlas V2

Both Programs versions remain available. `programs.html`, `labs.html` and `federal.html` retain the V1 directory, relationship map, host map and milestones. Their version switch links to `institutional-atlas.html`, the V2 geographic atlas, with a reciprocal V1 link. The top-level Programs entry continues to open the original directory.

V2 preserves the reviewed local prototype: 40 distinct university/lab hosts, 49 state/DC labels, 93 unique directory entries, 89 sourced events, adjustable education/research/funding weights and a selected sample of 19 NSF prime awards. Its isolated source and dated data snapshot live under `institutional-atlas/`; no publication datasets or V1 data were replaced. `data/bundle.js` packages the adjacent JSON files for the browser. If those JSON files change, regenerate that bundle before publishing. The award CSV contains the same 19 source-linked records.

Funding defaults to eight quantum-materials-focused awards; the optional broader scope includes mixed MRSEC and QIS awards. Amounts are cumulative NSF obligations assigned once to each official prime recipient, not campus-wide funding totals or funds allocated to each collaborator. Unknown funding remains not assessed. The weight-based score reflects evidence coverage in this selected directory, not institutional quality. The date slider filters milestone events, not cumulative funding snapshots.

The hosted V2 page uses the same access gate and deferred bootstrap as the rest of the site. Internal navigation preserves the selected publication source. The earlier standalone offline preview remains outside this repository. Tests cover reciprocal version links, locked/deferred loading, weights, funding deduplication and attribution, filters, state geography and timeline invariants.
