const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../data/institutions.json');
const C=require('../directory-core.js');
const entries=data.entries,byId=new Map(entries.map(e=>[e.id,e]));
test('each directory entity has a unique home and cited, dated evidence',()=>{
 assert.equal(byId.size,entries.length);
 for(const e of entries){
  assert.match(e.id,/^[a-z0-9-]+$/);assert.ok(C.pages[e.page]);assert.ok(C.groupOrder.includes(e.group),e.id);
  for(const key of ['name','kind','lead','funder','focus','materials','status','checkedDate'])assert.ok(e[key],`${e.id}: ${key}`);
  assert.ok(e.topics.length);assert.ok(e.sources.length);assert.equal(e.checkedDate,data.checkedDate);
  for(const s of e.sources){assert.ok(s.title);assert.ok(s.note);assert.ok(s.evidenceDate);const u=new URL(s.url);assert.equal(u.protocol,'https:');assert.notEqual(u.host,'www.google.com');}
  if(e.parentId){assert.ok(byId.has(e.parentId));assert.equal(byId.get(e.parentId).page,'federal');}
 }
});
test('complete official rosters link to the correct centers and parent program',()=>{
 assert.deepEqual(data.rosters.map(r=>r.count),[8,5,5,4]);
 const seen=new Set();
 for(const r of data.rosters){
  assert.equal(r.ids.length,r.count);assert.equal(new Set(r.ids).size,r.count);
  for(const id of r.ids){const e=byId.get(id);assert.ok(e);assert.equal(e.page,'labs');assert.equal(e.parentId,r.parentId);assert.equal(seen.has(id),false);seen.add(id);}
 }
 assert.deepEqual(data.rosters[0].ids,['ftqsaa','hqan','marquis','practiqal','ciqc','qubbe','qsense','rqs']);
});
test('roles and historical status are not collapsed into a generic federal list',()=>{
 assert.equal(byId.get('cifar-qm').page,'programs');assert.equal(byId.get('moore-epiqs').page,'programs');
 assert.equal(byId.get('microsoft-purdue-quantum').page,'labs');
 for(const id of ['qsense','rqs'])assert.equal(byId.get(id).parentId,'nsf-qlci');
 assert.equal(byId.get('ciqm').startYear,2013);assert.equal(byId.get('nsf-mrsec').startYear,1994);
 for(const id of ['darpa-onisq','darpa-impaqt'])assert.match(byId.get(id).status,/completed/i);
 assert.match(byId.get('qmec').status,/announced/i);assert.match(byId.get('bloch-quantum-hub').status,/intended/i);
});
test('search supports acronyms, hosts, mixed case and combinations with group filters',()=>{
 assert.deepEqual(C.filter(entries,{page:'labs',query:'qsense'}).map(e=>e.id),['qsense']);
 assert.ok(C.filter(entries,{page:'labs',query:'superconducting Princeton'}).some(e=>e.id==='marquis'));
 assert.ok(C.filter(entries,{page:'programs',query:'YaLe'}).some(e=>e.id==='yale-qmse'));
 assert.equal(C.filter(entries,{page:'labs',group:'DOE quantum centers'}).length,5);
 assert.equal(C.filter(entries,{page:'programs',query:'no-such-institution-xyz'}).length,0);
 assert.equal(C.filter(entries,{page:'labs',group:'DOE quantum centers',query:'yale certificate'}).length,0);
 assert.equal(C.filter(entries,{page:'labs'}).length,45);
});
test('deep links retain publication source while pointing to the entity home page',()=>{
 assert.equal(C.entryHref(byId.get('qsense'),'wos'),'labs.html?source=wos#qsense');
 assert.equal(C.entryHref(byId.get('nsf-qlci'),'symposium'),'federal.html?source=symposium#nsf-qlci');
});
test('CSV retains evidence and escapes quotes, line breaks and spreadsheet formulas',()=>{
 const e={...byId.get('qsense'),name:'=HYPERLINK("x")',focus:'first line\nsecond line'};
 const csv=C.csv([e]);assert.ok(csv.startsWith('\uFEFF'));assert.match(csv,/"'=HYPERLINK\(""x""\)"/);assert.match(csv,/"first line\nsecond line"/);assert.ok(csv.includes(e.sources[0].url));assert.ok(csv.includes(e.checkedDate));
});
