#!/usr/bin/env python3
"""Build the independent WoS website dataset. No network or model calls.

Requires xlrd==2.0.2. Raw workbooks are never modified.
Run from any directory; --input defaults to EPiQs/web of science.
"""
import argparse
import hashlib
import json
import re
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

import xlrd

ROOT = Path(__file__).resolve().parents[1]
FIELDS = ["Article Title", "Author Keywords", "Abstract"]


def clean(value):
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return re.sub(r"\s+", " ", unicodedata.normalize("NFKC", str(value or ""))).strip()


def norm(value):
    return clean(value).casefold()


def split(value):
    return list(dict.fromkeys(clean(v) for v in value.split(";") if clean(v)))


def uid(prefix, value):
    return prefix + hashlib.sha256(value.encode()).hexdigest()[:16]


def doi(value):
    return re.sub(r"^(?:https?://(?:dx\.)?doi\.org/|doi:\s*)", "", norm(value))


def merge_records(rows):
    """Exact UT, then exact DOI. Title/year fallback only without both IDs.

    Never collapse distinct identified publications on title alone. Retain
    source rows and scalar conflicts. Fill missing values; union list fields.
    """
    records, by_ut, by_doi, by_title = [], {}, {}, {}
    conflicts = []
    list_fields = {"Authors", "Author Full Names", "Author Keywords", "Keywords Plus", "Affiliations", "Funding Orgs"}
    for row in rows:
        ut, d = norm(row.get("UT (Unique WOS ID)", "")), doi(row.get("DOI", ""))
        key = (norm(row.get("Article Title", "")), clean(row.get("Publication Year", "")))
        candidates = {i for i in [by_ut.get(ut) if ut else None, by_doi.get(d) if d else None] if i is not None}
        if len(candidates) > 1:
            raise ValueError("Conflicting UT/DOI identity bridge; resolve records before rebuilding")
        i = next(iter(candidates), None)
        if i is None and not ut and not d:
            i = by_title.get(key)
        if i is None:
            i = len(records)
            records.append(dict(row, _sources=[row["_source"]]))
        else:
            old = records[i]
            old["_sources"].append(row["_source"])
            for field, value in row.items():
                if field.startswith("_") or not value:
                    continue
                if not old.get(field):
                    old[field] = value
                elif old[field] != value:
                    if field in list_fields:
                        old[field] = "; ".join(dict.fromkeys(split(old[field]) + split(value)))
                    else:
                        conflicts.append({"record": i, "field": field, "kept": old[field], "other": value, "source": row["_source"]})
        if ut:
            by_ut[ut] = i
        if d:
            by_doi[d] = i
        if not ut and not d:
            by_title[key] = i
    return records, conflicts


def extract(record, rules):
    ids, evidence = [], []
    for rule in rules:
        for field in FIELDS:
            value = record.get(field, "")
            match = rule["regex"].search(value)
            if match:
                ids.append(rule["id"])
                start, end = match.span()
                evidence.append({"entity": rule["id"], "field": field, "match": value[start:end],
                                 "start": start, "end": end,
                                 "excerpt": value[max(0, start-85):min(len(value), end+110)]})
                break
    return ids, evidence


def build(input_dir, output_dir, audit_dir):
    rules_doc = json.loads((ROOT / "scripts/wos_rules.json").read_text())
    catalogs = {k: [] for k in ["materials", "techniques", "phenomena"]}
    rules = {}
    for kind, entries in rules_doc.items():
        rules[kind] = []
        for item in entries:
            catalogs[kind].append({k: v for k, v in item.items() if k != "pattern"})
            rules[kind].append(dict(item, regex=re.compile(item["pattern"], re.I)))
    rows, files = [], []
    for path in sorted(input_dir.glob("*.xls")):
        book = xlrd.open_workbook(path)
        count = 0
        for sheet in book.sheets():
            headers = [clean(c) for c in sheet.row_values(0)]
            required = {"Article Title", "Publication Year", "UT (Unique WOS ID)", "Authors"}
            if not required.issubset(headers):
                raise ValueError(f"Missing required columns in {path.name}/{sheet.name}")
            for n in range(1, sheet.nrows):
                row = dict(zip(headers, map(clean, sheet.row_values(n))))
                if not any(row.values()):
                    continue
                row["_source"] = {"file": path.name, "sheet": sheet.name, "row": n+1}
                rows.append(row)
                count += 1
        files.append({"file": path.name, "rows": count, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    if not rows:
        raise ValueError("No input records found")
    merged, conflicts = merge_records(rows)
    authors, papers, rejected = {}, [], []
    coverage = Counter()
    for row in merged:
        title = row.get("Article Title", "")
        yr = row.get("Publication Year", "")
        if not title or not re.fullmatch(r"\d{4}", yr) or not 1800 <= int(yr) <= 2100:
            rejected.append({"sources": row["_sources"], "reason": "Missing title or invalid publication year"})
            continue
        names = split(row.get("Author Full Names", "") or row.get("Authors", ""))
        # Link affiliations only from explicit bracketed author-address groups.
        institutions = defaultdict(set)
        for group, address in re.findall(r"\[([^]]+)\]\s*([^[]+)", row.get("Addresses", "")):
            institution = clean(address.split(",")[0].strip("; "))
            for name in split(group):
                if institution:
                    institutions[norm(name)].add(institution)
        author_ids = []
        for name in names:
            key = norm(name)
            a_id = uid("wos-r-", key)
            if a_id not in authors:
                authors[a_id] = {"id": a_id, "name": name, "institutions": set(), "color": "#2563eb"}
            authors[a_id]["institutions"].update(institutions[key])
            author_ids.append(a_id)
        ut = row.get("UT (Unique WOS ID)", "")
        d = doi(row.get("DOI", ""))
        p = {"id": uid("wos-p-", ut or d or norm(title)+yr), "title": title,
             "year": int(yr), "authors": list(dict.fromkeys(author_ids)),
             "journal": row.get("Source Title", ""), "doi": d, "ut": ut,
             "documentType": row.get("Document Type", ""),
             "keywords": split(row.get("Author Keywords", "")),
             "citations": int(row.get("Times Cited, WoS Core", "0") or 0),
             "sources": row["_sources"], "evidence": [], "funders": []}
        for kind in catalogs:
            p[kind], ev = extract(row, rules[kind])
            p["evidence"].extend(ev)
            coverage[kind] += bool(p[kind])
        papers.append(p)
    for a in authors.values():
        a["institutions"] = sorted(a["institutions"])
        a["inst"] = "; ".join(a["institutions"]) or "Affiliation not mapped"
    papers.sort(key=lambda p: (-p["year"], p["id"]))
    report = {"inputFiles": files, "inputRows": len(rows), "uniqueRecords": len(merged),
              "duplicatesRemoved": len(rows)-len(merged), "conflicts": conflicts,
              "rejectedRecords": rejected, "papers": len(papers), "researcherNameGroups": len(authors),
              "yearRange": [min(p["year"] for p in papers), max(p["year"] for p in papers)],
              "papersWithMentions": dict(coverage),
              "missingDOI": sum(not p["doi"] for p in papers),
              "missingAbstract": sum(not r.get("Abstract") for r in merged),
              "rulesSha256": hashlib.sha256((ROOT / "scripts/wos_rules.json").read_bytes()).hexdigest(),
              "method": "Explicit regex mentions in normalized title, author keywords, and abstract; no Keywords Plus, semantic inference, or external model calls.",
              "authorMethod": "NFKC + whitespace normalization + casefold of exported full name, or abbreviated name if absent. Name groups are not disambiguated people."}
    dataset = dict(catalogs, researchers=sorted(authors.values(), key=lambda a: a["id"]),
                   papers=papers, funders=[], sessions=[], metadata=report)
    output_dir.mkdir(parents=True, exist_ok=True)
    audit_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "wos.json").write_text(json.dumps(dataset, ensure_ascii=False, separators=(",", ":"))+"\n")
    (output_dir / "wos-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2)+"\n")
    # Full normalized records remain beside the private raw exports, not in web assets.
    (audit_dir / "wos-merged.json").write_text(json.dumps(merged, ensure_ascii=False, indent=2)+"\n")
    print(json.dumps({k: v for k, v in report.items() if k not in {"conflicts", "inputFiles"}}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=ROOT.parents[2] / "web of science")
    parser.add_argument("--output", type=Path, default=ROOT / "data")
    parser.add_argument("--audit", type=Path)
    args = parser.parse_args()
    build(args.input, args.output, args.audit or args.input / "processed")
