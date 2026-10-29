const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../data/institutions.json');
const C=require('../directory-core.js');
const entries=data.entries,byId=new Map(entries.map(e=>[e.id,e]));
test('each directory entity has a unique home and cited, dated evidence',()=>{
 assert.equal(byId.size,entries.length);
 assert.equal(entries.length,93);
 for(const e of entries){
  assert.match(e.id,/^[a-z0-9-]+$/);assert.ok(C.pages[e.page]);assert.ok(C.groupOrder.includes(e.group),e.id);assert.ok(e.pages.includes(e.page));
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


test('university coverage includes non-degree pathways and cross-lists existing centers',()=>{
 assert.equal(C.filter(entries,{page:'programs'}).length,20);
 for(const id of ['uchicago-cqi','cu-boulder-cubit','ciqm','columbia-quantum-materials','northeastern-qmsi']){
  assert.ok(C.inPage(byId.get(id),'programs'));assert.ok(C.inPage(byId.get(id),'labs'));
  assert.equal(byId.get(id).page,'labs');assert.equal(C.groupOf(byId.get(id),'programs'),'University centers & research routes');
 }
 assert.match(byId.get('oregon-quantum-nano').kind,/specialization/i);
 assert.ok(entries.some(e=>C.inPage(e,'programs')&&/minor/i.test(e.kind)));
 assert.equal(C.entryHref(byId.get('ciqm'),'wos','programs'),'programs.html?source=wos#ciqm');
});
test('relationship map distinguishes program links, shared hosts and cross-listing',()=>{
 const g=C.graph(entries),nodes=new Map(g.nodes.map(n=>[n.id,n]));
 for(const edge of g.edges){assert.ok(nodes.has(edge.from));assert.ok(nodes.has(edge.to));assert.ok(edge.count>0);assert.equal(edge.count,edge.pairs.length);}
 assert.ok(g.edges.some(e=>e.type==='program'&&e.pairs.includes('nsf-qlci|qsense')));
 assert.ok(g.edges.some(e=>e.type==='crosslist'&&e.pairs.includes('ciqm')));
 assert.ok(g.edges.some(e=>e.type==='host'&&e.pairs.includes('practiqal|yale-qmse')));
 assert.ok(!g.edges.some(e=>e.type==='collaboration'));
});
test('milestones preserve event meanings and do not remove undated institutions',()=>{
 const allowed=new Set(['formation','education','funding','infrastructure','policy']);const ids=new Set();
 for(const e of entries)for(const m of e.milestones){assert.ok(Number.isInteger(m.year));assert.ok(m.year<=2026);assert.ok(m.title);assert.ok(allowed.has(m.type));assert.match(m.sourceUrl,/^https:\/\//);assert.ok(!ids.has(m.id));ids.add(m.id);}
 const all=C.filter(entries,{page:'labs'}),events=C.milestones(all,{through:2020});assert.ok(events.every(e=>e.year<=2020));assert.equal(all.length,45);
 assert.ok(C.milestones(all).some(e=>e.entryId==='qsense'&&e.year===2026&&/renew/i.test(e.title)));
 const education=C.milestones(C.filter(entries,{page:'programs'}),{type:'education'});assert.ok(education.length>5);assert.ok(education.every(e=>e.type==='education'));
 assert.ok(entries.some(e=>e.milestones.length===0));
});
test('geography uses sourced approximate host cities and leaves portfolios unpinned',()=>{
 const points=C.locations(entries);assert.ok(points.length>20);
 for(const e of entries)for(const l of e.locations){assert.equal(l.precision,'city');assert.ok(l.lat>=-90&&l.lat<=90);assert.ok(l.lon>=-180&&l.lon<=180);assert.match(l.sourceUrl,/^https:\/\//);}
 for(const id of ['nsf-qlci','doe-qis','nist-quantum-science','cifar-qm','nasa-cal'])assert.equal(byId.get(id).locations.length,0);
 assert.ok(byId.get('cint').locations.length>1);
 for(const p of points)assert.equal(new Set(p.ids).size,p.ids.length);
});
