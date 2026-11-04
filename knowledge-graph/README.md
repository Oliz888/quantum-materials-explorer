# Nature subject knowledge graph

An independent metadata snapshot, published at `knowledge-graph.html` and linked from Field Atlas V2. It does not merge the existing WoS or EPiQS publication datasets, or change the institutional funding ledger.

## Current coverage — 4 November 2026

- Starting review: Tokura, Kawasaki and Nagaosa (2017), *Emergent functions of quantum materials*, DOI `10.1038/nphys4274`.
- 39 selected nodes: 38 Nature ontology subjects and one separately identified citation topic.
- 47 official broader–narrower relationships. They describe browsing classification, not historical descent or causal influence.
- 243 unique article previews, deduplicated by canonical Nature article URL, including the starting review. The subject channels overlap.
- Five official all-time search counts, restricted to research, reviews and protocols: Electronic devices 5,294; Electronic properties and materials 6,716; Ferroelectrics and multiferroics 1,461; Topological matter 2,598; Superconducting properties and materials 2,677.
- Superconductivity has a Nature Physics-only preview containing several article types, while its official totals cover all Nature Portfolio journals. The citation-topic preview is a separate collection.
- 85 verified official annual query counts: five channels × 2010–2026. Each channel’s annual sum matches its independently observed all-time total. 2026 is partial, through 4 November. An explicit zero-result page is recorded as zero; unknown values remain unknown. The optional preview-date histogram is separate from annual totals and is not a field-development measure.
- The initial direct collection encountered a browser-verification challenge. After the ordinary browser automatically completed verification, annual counts were acquired using the visible Advanced Search year selectors. No verification was bypassed. Each row retains the displayed result heading, query URL and retrieval date.

## Data and provenance

`data/structure.json` stores sourced relationships, non-exclusive editorial facets, the seed article's explicit five subject assignments, and its sixth, separate citation-topic link. `data/snapshot.json` stores official search totals, individual paper metadata, collection restrictions, source URLs and cache hashes. These files contain metadata, not article abstracts/full texts.

Broader/narrower evidence comes from explicit official subject-page links. A page's `/nphys` article scope must not be generalized to all Nature Portfolio journals. Nature Index citation-topic trends cover a different publication universe and are not imported as Nature channel counts.

The preview is not a census, a probability sample, or a quantum-materials-only collection. Absence of a topic membership is not evidence that a paper lacks that topic. Broad nodes have unknown article counts: they do not inherit or sum child totals.

## Refreshing

Update the two JSON snapshots from reviewed official sources. Keep different schemes, scopes and retrieval dates explicit. The web page intentionally makes no publisher requests during browsing.

An annual aggregate, if acquired, uses this channel field:

```json
{"annualSeries":[{"year":2025,"count":123,"complete":true,"partialYear":false,"sourceUrl":"https://www.nature.com/search?..."}]}
```

The example number is schema documentation only, not collected data. `complete` means the annual query count is fully retrieved for the declared scope, not that a partial calendar year is complete. Missing years and unverified values must remain unknown. Cumulative values start at the explicit first year and stop after any unknown year. Keep 2026 marked as year-to-date.

Rebuild and verify:

```sh
python3 scripts/build_nature_knowledge.py
node --test tests/*.test.js
```

The production page uses the existing authentication gate. Local visual QA uses an isolated fixture with a test-only auth stub; production authentication is not edited.
