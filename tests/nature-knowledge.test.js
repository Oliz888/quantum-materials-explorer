const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),C=require('../knowledge-graph/core.js'),S=require('../knowledge-graph/data/structure.json'),D=require('../knowledge-graph/data/snapshot.json');
test('verified hierarchy preserves multiple parents and source evidence without equating citation topics',()=>{
 const ids=new Set(S.nodes.map(n=>n.id));assert.equal(ids.size,S.nodes.length);assert.equal(S.nodes.length,39);assert.equal(S.edges.length,47);
 for(const e of S.edges){assert.ok(ids.has(e.source)&&ids.has(e.target));assert.equal(e.relation,'broaderThan');assert.ok(e.sourceUrl.startsWith('https://www.nature.com/'));assert.ok(e.evidence.length);}
 const parents=id=>S.edges.filter(e=>e.target===id).map(e=>e.source).sort();
 assert.deepEqual(parents('condensed-matter-physics'),['materials-science','physics']);
 assert.ok(parents('graphene').includes('materials-chemistry'));assert.ok(parents('graphene').includes('nanoscale-materials'));
 assert.equal(S.seedArticle.subjectAssignments.length,5);assert.equal(S.seedArticle.relatedCitationTopics.length,1);
 assert.equal(S.nodes.find(n=>n.id==='topological-phases-in-quantum-systems').system,'nature-citation-topic');
 assert.ok(!S.edges.some(e=>e.target==='topological-phases-in-quantum-systems'));
});
test('paper identities are unique and memberships retain the distinct channel collection scopes',()=>{
 assert.equal(new Set(D.papers.map(p=>p.url)).size,D.papers.length);assert.equal(D.papers.length,243);
 for(const p of D.papers){assert.ok(p.title&&p.type&&p.journal&&p.sourceUrls.length);assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(p.date));assert.ok(p.date<=D.checkedDate);assert.equal(p.year,Number(p.date.slice(0,4)));assert.ok(p.channels.every(id=>D.channels.some(c=>c.id===id)));}
 for(const c of D.channels)assert.equal(C.papersFor(D,c.id).length,c.loadedCount);
 const supercon=D.channels.find(c=>c.id==='superconducting-properties-and-materials');assert.equal(supercon.officialResultsCount,2677);assert.equal(supercon.previewJournalRestriction,'Nature Physics only');
 assert.deepEqual(D.channels.map(c=>c.officialResultsCount),[5294,6716,1461,2677,2598,null]);
 const seed=D.papers.find(p=>p.doi==='10.1038/nphys4274');assert.equal(seed.channels.length,5);assert.equal(seed.date,'2017-09-25');
});
test('filters distinguish review articles from research and never inherit topic membership',()=>{
 assert.equal(C.typeGroup('Review Article'),'review');assert.equal(C.typeGroup('Research Briefing'),'other');assert.equal(C.typeGroup('News & Views'),'other');assert.equal(C.typeGroup('Article'),'research');
 assert.equal(C.papersFor(D,'physics').length,0);
 const result=C.papersFor(D,'topological-matter',{type:'review',year:2017,query:'Emergent'});assert.equal(result.length,1);assert.equal(result[0].doi,'10.1038/nphys4274');
 assert.equal(C.papersFor(D,'topological-matter',{query:'no-such-paper-zzzz'}).length,0);
});
test('missing annual data never becomes zero, and cumulative curves cannot bridge gaps',()=>{
 for(const channel of D.channels)assert.equal(channel.paginationComplete,false);
 assert.equal(C.history(D.channels.find(c=>c.system==='nature-citation-topic'),'annual'),null);
 const channel={annualSeries:[{year:2020,count:3,complete:true},{year:2022,count:4,complete:true},{year:2023,count:0,complete:true},{year:2024,count:7,complete:false}]};
 assert.deepEqual(C.history(channel,'annual').map(r=>r.count),[3,null,4,0,null]);
 assert.deepEqual(C.history(channel,'cumulative').map(r=>r.count),[3,null,null,null,null]);
 assert.deepEqual(C.previewDates([{year:2017},{year:2026},{year:2026}]),[{year:2017,count:1},{year:2026,count:2}]);
});
test('85 official annual queries reconcile with separately observed channel totals and preserve zero evidence',()=>{
 let rows=0;for(const c of D.channels.filter(c=>c.system==='nature-ontology')){
  const annual=C.history(c,'annual'),cumulative=C.history(c,'cumulative');assert.equal(annual.length,17);rows+=annual.length;
  assert.equal(annual[0].year,2010);assert.equal(annual.at(-1).year,2026);assert.equal(cumulative.at(-1).count,c.officialResultsCount);
  assert.equal(c.annualCoverage.complete,true);assert.equal(c.paginationComplete,false);
  for(const r of c.annualSeries){const url=new URL(r.sourceUrl);assert.equal(url.searchParams.get('subject'),c.id);assert.equal(url.searchParams.get('date_range'),`${r.year}-${r.year}`);assert.equal(url.searchParams.get('article_type'),'protocols,research,reviews');assert.equal(r.partialYear,r.year===2026);assert.equal(r.complete,true);if(r.count===0)assert.match(r.evidence.heading,/No results were found/);else assert.ok(r.evidence.heading.includes(String(r.count)));}
 }
 assert.equal(rows,85);
});
test('graph subsets preserve official edges and finite readable layouts',()=>{
 for(const mode of ['overview','all','neighborhood'])for(const selected of ['graphene','topological-matter','condensed-matter-physics']){
  const g=C.graphFor(S,mode,selected),ids=new Set(g.nodes.map(n=>n.id));assert.ok(!ids.has('topological-phases-in-quantum-systems'));
  for(const e of g.edges)assert.ok(ids.has(e.source)&&ids.has(e.target));
  const layout=C.layout(g.nodes,g.edges);for(const p of Object.values(layout.positions)){assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));assert.ok(p.x>0&&p.x<layout.width&&p.y>0&&p.y<layout.height);}
 }
 const g=C.graphFor(S,'neighborhood','graphene');assert.ok(g.nodes.some(n=>n.id==='materials-chemistry'));assert.ok(g.nodes.some(n=>n.id==='synthesis-of-graphene'));
});
test('published bundle matches JSON and page respects the existing authentication gate',async()=>{
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'knowledge-graph/data/bundle.js'),'utf8'),context);
 assert.deepEqual(JSON.parse(JSON.stringify(context.window.NatureKnowledgeData)),{structure:S,snapshot:D});
 const html=fs.readFileSync(path.join(root,'knowledge-graph.html'),'utf8');assert.match(html,/data-auth="locked"/);assert.match(html,/auth\.js\?v=2/);assert.doesNotMatch(html,/<script src="knowledge-graph/);
 let resolve;const ready=new Promise(r=>resolve=r),loaded=[];const document={body:{dataset:{view:'knowledge-graph'}},createElement(){return {};},head:{appendChild(s){loaded.push(s.src);s.onload();}}};
 const run=vm.runInNewContext(fs.readFileSync(path.join(root,'bootstrap.js'),'utf8'),{window:{QMAuth:{ready}},document,console});await Promise.resolve();assert.equal(loaded.length,0);resolve();await run;
 assert.deepEqual(loaded,['knowledge-graph/data/bundle.js?v=1','knowledge-graph/core.js?v=1','knowledge-graph/graph.js?v=1']);
});
