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
def export(path, awards):
 with path.open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.writer(f,lineterminator="\n")
  w.writerow(['Record ID','Official grant ID','Funder type','Agency','Program','Official project title','EPiQS grant type','Classification basis','Purpose summary','Named investigator','Research group / center','Recipient unit','Award month','Announcement or award-start year','Term months','Period','Amount USD','Amount type','Amount meaning','Lead','Named recipient','Recipient organization','Country','Mapped recipient host','Mapped partners','Mapping note','Official sources','Checked date'])
  for a in awards:
   w.writerow([a['recordId'],a['awardId'],a.get('funderType','federal'),a['agency'],a.get('programName',''),a['awardTitle'],a.get('portfolio',''),a.get('classificationBasis',''),a.get('scopeNote',''),a.get('principalInvestigator',''),a.get('researchGroup',{}).get('name',''),a.get('recipientUnit',''),a.get('awardDate',''),a.get('announcementYear') or a['startDate'][:4],a.get('termMonths',''),a.get('periodLabel',''),a['amountUSD'],a['amountType'],a['amountMeaning'],a.get('leadInstitution',''),a.get('recipientInstitution',''),a.get('recipientOrganization',''),a.get('recipientCountry',''),hosts.get(a.get('recipientHostId'),''),' | '.join(hosts[x] for x in a.get('partnerHostIds',[])),a.get('mappingNote',''),' | '.join(dict.fromkeys([a['officialUrl']]+[s['url'] for s in a.get('sources',[])])),a['retrievalDate']])
export(ROOT/'selected-funding-records.csv',payload['funding']['awards'])
export(ROOT/'epiqs-public-grants.csv',sorted([a for a in payload['funding']['awards'] if a.get('program')=='EPiQS'],key=lambda a:(-a['announcementYear'],a['portfolio'],a['awardId'])))
print(f"V2 bundle: {len(payload['funding']['awards'])} funding records")
