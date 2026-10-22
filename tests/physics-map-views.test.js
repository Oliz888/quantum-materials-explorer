const test=require('node:test');
const assert=require('node:assert/strict');
const V=require('../physics-map-views.js'),A=V.A;
test('formation overview and three lenses preserve shared topic identities and source-qualified memberships',()=>{
 assert.deepEqual(Object.keys(V.views),['origins','physh','goyal','npj']);
 for(const view of Object.values(V.views))for(const group of view.groups){
  assert.ok(group.locator);assert.ok(group.members.length);assert.equal(new Set(group.members).size,group.members.length);
  for(const id of group.members){assert.ok(A.nodes[id],id);const m=V.mapping(id,view.id,group.id);assert.ok(m.status&&m.url);assert.equal(new URL(m.url).protocol,'https:');}
  for(const id of group.featured)assert.ok(group.members.includes(id));
 }
 assert.deepEqual(V.memberships('quantum-dots','goyal').map(g=>g.id),['confinement','systems','applications']);
 assert.equal(V.topics('goyal').filter(n=>n.id==='quantum-dots').length,1);
});
test('official PhySH facets remain distinct from our topic matching and everyday property language',()=>{
 assert.equal(V.verified.version,'2.8.0');
 assert.deepEqual(V.memberships('topological-insulators','physh').map(g=>g.id),['research','systems']);
 assert.deepEqual(V.memberships('crystal-growth','physh').map(g=>g.id),['research','techniques']);
 assert.deepEqual(V.memberships('superconductivity','physh').map(g=>g.id),['research']);
 assert.equal(V.memberships('confinement','physh').length,0);
 assert.equal(V.mapping('correlations','physh','systems').status,'related');
 assert.equal(V.mapping('superconductivity','physh','research').status,'official');
 for(const m of V.verified.mappings){assert.ok(A.nodes[m.id]);assert.ok(m.doi.startsWith('https://doi.org/10.29172/'));}
});
test('npj keeps explicit scope topics, selected examples and chemistry context separate',()=>{
 assert.equal(V.views.npj.groups.length,6);
 assert.equal(V.mapping('heavy-fermion-superconductivity','npj','superconductivity').status,'named');
 assert.equal(V.memberships('heavy-fermions','npj').some(g=>g.id==='superconductivity'),false);
 assert.equal(V.mapping('heavy-fermions','npj','other').status,'named');
 assert.equal(V.mapping('magnetism','npj','correlated').status,'related');
 assert.equal(V.mapping('quantum-dots','npj','technology').status,'related');
 assert.equal(V.memberships('crystal-chemistry','npj').length,0);
 assert.ok(V.bridgesFor('crystal-chemistry').length);
});
test('extended topic catalog remains reachable and searchable with valid links',()=>{
 const reachable=new Set(A.descendants('landscape'));
 for(const n of Object.values(A.nodes)){
  assert.ok(reachable.has(n.id),n.id);
  for(const id of [...n.children,...n.related])assert.ok(A.nodes[id],id);
  for(const e of n.evidence)assert.ok(A.sources[e.source]);
 }
 assert.ok(A.search('photocatalysis').some(n=>n.id==='photocatalysis'));
 assert.ok(A.search('磁矩').some(n=>n.id==='magnetic-moment'));
});
test('timeline deduplicates shared events and respects topic, category, year and activity',()=>{
 assert.equal(V.eventsFor('goyal','all','quantum-dots','all',2025,'all').length,25);
 assert.deepEqual(V.eventsFor('goyal','all','quantum-dots','topic',1990,'all').map(e=>e.id),['qd1981']);
 const filtered=V.eventsFor('npj','superconductivity','quantum-dots','category',1986,'phenomena');
 assert.ok(filtered.some(e=>e.id==='cuprate1986'));assert.ok(filtered.every(e=>e.year<=1986));
 assert.equal(filtered.length,new Set(filtered.map(e=>e.id)).size);
 assert.equal(V.eventsFor('npj','energy','energy','category',2025,'all').length,0);
});

test('formation overview connects all three traditions without claiming an official taxonomy',()=>{
 assert.equal(V.views.origins.kind,'interpretive');
 assert.deepEqual(V.views.origins.groups.map(g=>g.id),['physics','chemistry','materials-science']);
 for(const id of ['quantum-materials','quantum-dots','cuprates','topological-chemistry']){
  assert.equal(V.memberships(id,'origins').length,3,id);
  for(const g of V.memberships(id,'origins'))assert.equal(V.mapping(id,'origins',g.id).status,'connection');
 }
 for(const b of V.bridges)for(const question of ['physics','chemistry','materials'])assert.ok(b[question].en&&b[question].zh);
 assert.equal(V.memberships('crystal-growth','origins').length,3);
 assert.ok(V.eventsFor('origins','chemistry','quantum-dots','category',2025,'all').some(e=>e.id==='qd1993'));
});
