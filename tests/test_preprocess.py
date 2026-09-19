import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("preprocess", ROOT / "scripts/preprocess_wos.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


def row(ut="", doi="", title="A paper", year="2024", **extra):
    return {"UT (Unique WOS ID)": ut, "DOI": doi, "Article Title": title,
            "Publication Year": year, "_source": {"file": "fixture.xls", "row": 2}, **extra}


class PreprocessingTests(unittest.TestCase):
    def test_duplicates_fill_missing_and_keep_provenance(self):
        records, conflicts = mod.merge_records([
            row("WOS:1", "", **{"Author Keywords": "graphene"}),
            row("WOS:1", "https://doi.org/10.1/ABC", **{"Author Keywords": "graphite"})])
        self.assertEqual(len(records), 1)
        self.assertEqual(len(records[0]["_sources"]), 2)
        self.assertEqual(records[0]["Author Keywords"], "graphene; graphite")
        self.assertEqual(conflicts, [])

    def test_doi_normalization_and_conflict_audit(self):
        records, conflicts = mod.merge_records([row("A", "10.1/ABC"), row("B", "https://doi.org/10.1/abc")])
        self.assertEqual(len(records), 1)
        self.assertEqual(conflicts[0]["field"], "UT (Unique WOS ID)")

    def test_distinct_identified_papers_with_same_title_survive(self):
        records, _ = mod.merge_records([row("A", "10.1/a"), row("B", "10.1/b")])
        self.assertEqual(len(records), 2)

    def test_identifierless_title_year_fallback(self):
        records, _ = mod.merge_records([row(), row(), row(year="2025")])
        self.assertEqual(len(records), 2)

    def test_conflicting_identity_bridge_fails(self):
        with self.assertRaises(ValueError):
            mod.merge_records([row("A", "10.1/a"), row("B", "10.1/b"), row("A", "10.1/b")])

    def test_source_evidence_and_reference_integrity(self):
        dataset = json.loads((ROOT / "data/wos.json").read_text())
        audit = json.loads((ROOT.parents[2] / "web of science/processed/wos-merged.json").read_text())
        raw = {r["UT (Unique WOS ID)"]: r for r in audit}
        self.assertEqual(dataset["metadata"]["inputRows"], 2697)
        self.assertEqual(len(dataset["papers"]), 2697)
        self.assertEqual(len({p["id"] for p in dataset["papers"]}), 2697)
        catalogs = {k: {e["id"] for e in dataset[k]} for k in ["materials", "researchers", "techniques", "phenomena"]}
        for p in dataset["papers"]:
            self.assertTrue(2014 <= p["year"] <= 2026)
            for key, collection in [("authors", "researchers"), ("materials", "materials"), ("techniques", "techniques"), ("phenomena", "phenomena")]:
                self.assertEqual(len(p[key]), len(set(p[key])))
                self.assertTrue(set(p[key]) <= catalogs[collection])
            self.assertEqual({e["entity"] for e in p["evidence"]},set(p["materials"]+p["techniques"]+p["phenomena"]))
            for e in p["evidence"]:
                field = raw[p["ut"]][e["field"]]
                self.assertEqual(field[e["start"]:e["end"]], e["match"])
                self.assertIn(e["excerpt"], field)

    def test_formula_boundaries(self):
        import re
        rules = json.loads((ROOT / "scripts/wos_rules.json").read_text())
        pattern = next(e["pattern"] for e in rules["materials"] if e["name"] == "FeSe")
        regex = re.compile(pattern, re.I)
        self.assertIsNotNone(regex.search("FeSe films"))
        self.assertIsNone(regex.search("FeSe2"))
        self.assertIsNone(regex.search("LiFeSe"))


if __name__ == "__main__":
    unittest.main()
