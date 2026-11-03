"""Rebuild V2's browser bundle and portable funding table from checked JSON records.
This does not fetch sources or modify the V1 directory.
"""
from pathlib import Path
import csv,json
ROOT=Path(__file__).resolve().parent
read=lambda name:json.loads((ROOT/'data'/f'{name}.json').read_text())
payload={key:read(name) for key,name in [('institutions','institutions'),('hostData','hosts'),('funding','funding'),('geography','states')]}
(ROOT/'data'/'bundle.js').write_text('window.QMAP_DATA='+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n')
hosts={h['id']:h['displayName'] for h in payload['hostData']['hosts']}
with (ROOT/'selected-funding-records.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.writer(f)
 w.writerow(['Record ID','Agency','Program','Project','Announcement or award-start year','Period','Amount USD','Amount type','Amount meaning','Lead','Named recipient','Mapped partners','Official sources','Checked date'])
 for a in payload['funding']['awards']:
  w.writerow([a['recordId'],a['agency'],a.get('programName',''),a['shortTitle'],a.get('announcementYear') or a['startDate'][:4],a.get('periodLabel',''),a['amountUSD'],a['amountType'],a['amountMeaning'],a.get('leadInstitution',''),a.get('recipientInstitution',''),' | '.join(hosts[x] for x in a.get('partnerHostIds',[])),' | '.join(dict.fromkeys([a['officialUrl']]+[s['url'] for s in a.get('sources',[])])),a['retrievalDate']])
print(f"V2 bundle: {len(payload['funding']['awards'])} funding records")
