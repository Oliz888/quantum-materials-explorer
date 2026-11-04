"""Rebuild the static browser bundle from reviewed Nature metadata JSON.

No network requests. Annual records must explicitly supply complete=true and
an official source URL; missing years remain unknown in the interface.
"""
import json
from pathlib import Path

base = Path(__file__).resolve().parents[1] / 'knowledge-graph' / 'data'
data = {key: json.loads((base / name).read_text()) for key, name in
        [('structure', 'structure.json'), ('snapshot', 'snapshot.json')]}
(base / 'bundle.js').write_text('window.NatureKnowledgeData = ' +
    json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
