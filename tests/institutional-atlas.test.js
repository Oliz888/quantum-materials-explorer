const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),C=require('../institutional-atlas/atlas-core.js');
const root=path.join(__dirname,'..','institutional-atlas');const read=n=>JSON.parse(fs.readFileSync(path.join(root,'data',n+'.json')));const D=C.prepare({institutions:read('institutions'),hostData:read('hosts'),funding:read('funding'),geography:read('states')});
const base=()=>({query:'',state:'all',agency:'all',program:'all',layers:['programs','labs','federal','philanthropy'],fundingScope:'materials',weights:{education:40,research:35,funding:25},metric:'combined',top:10});
test('all three categories share one map, distinct entries and hosts',()=>{const v=C.filter(D,base());assert.equal(v.hosts.length,55);assert.equal(v.entries.length,123);assert.equal(new Set(D.hosts.map(h=>h.id )).size,55);assert.equal(new Set(D.entries.map(e=>e.id)).size,123);});
test('all host and linked entry references resolve with source-qualified geography',()=>{for(const h of D.hosts){assert.ok(h.sourceUrls.length);assert.ok(h.locations.every(l=>l.sourceUrl.startsWith('https://')));assert.ok(h.lat>=24&&h.lat<50&&h.lon<-60);for(const id of h.hostEntryIds)assert.ok(D.byEntry[id]);}for(const a of D.awards){for(const id of C.awardHosts(a))assert.ok(D.byHost[id]);for(const id of a.relatedEntryIds)assert.ok(D.byEntry[id]);}});
test('state filtering pins only hosts in the selected state',()=>{const v=C.filter(D,{...base(),state:'CA'});assert.ok(v.hosts.length>=5);assert.ok(v.hosts.every(h=>h.stateCode==='CA'));});
test('DOE program links its centers and documented consortium partners',()=>{const v=C.filter(D,{...base(),program:'doe-qis'});assert.equal(v.entries.filter(e=>e.parentId==='doe-qis').length,5);for(const id of ['brookhaven','fermilab','argonne','lbnl','oak-ridge','northwestern','yale'])assert.ok(v.hosts.some(h=>h.id===id));assert.ok(v.hosts.every(h=>D.awards.some(a=>a.relatedEntryIds.includes('doe-qis')&&C.awardHosts(a).includes(h.id))));});
test('federal-only layer includes documented partners without headquarters pins',()=>{const v=C.filter(D,{...base(),layers:['federal'],program:'doe-qis'});assert.equal(v.entries.length,1);assert.ok(v.hosts.length>5);assert.ok(v.hosts.every(h=>D.awards.some(a=>a.relatedEntryIds.includes('doe-qis')&&C.awardHosts(a).includes(h.id))));});
test('empty layer selection produces no institutions',()=>{const v=C.filter(D,{...base(),layers:[]});assert.equal(v.hosts.length,0);assert.equal(v.entries.length,0);});
test('keyword search resolves institutions and topics',()=>{const v=C.filter(D,{...base(),query:'Yale'});assert.deepEqual(v.hosts.map(h=>h.id),['yale']);assert.ok(v.entries.every(e=>e.lead.includes('Yale')||e.id==='moore-epiqs'));});
test('formal education excludes cross-listed research centers',()=>{assert.equal(C.evidence(D,D.byHost.harvard,'materials').education.length,0);assert.equal(C.evidence(D,D.byHost.yale,'materials').education.length,1);assert.equal(C.evidence(D,D.byHost.mines,'materials').components.education,1);});
test('distinct records preserve amount meaning, year, sources and agency identity',()=>{assert.equal(new Set(D.awards.map(C.awardKey)).size,177);for(const a of D.awards){assert.ok(Number.isFinite(a.amountUSD)&&a.amountUSD>0);assert.ok(a.amountMeaning);assert.match(a.officialUrl,/^https:\/\//);assert.ok(C.fundingYear(a)>=2013&&C.fundingYear(a)<=2026);}assert.equal(D.awards.filter(a=>a.agency==='NSF').length,19);assert.equal(D.awards.filter(a=>a.agency==='DOE').length,15);});
test('material scope excludes broader QIS and mixed materials across agencies',()=>{const material=C.scopedAwards(D,'materials');assert.equal(material.length,152);assert.ok(material.every(a=>a.scopeType==='quantum-materials'));assert.equal(material.filter(a=>a.agency==='NSF').length,8);assert.equal(C.scopedAwards(D,'all').length,177);});
test('prime award amounts not allocated to collaborating hosts',()=>{const h=C.evidence(D,D.byHost.harvard,'materials'),m=C.evidence(D,D.byHost.mit,'materials'),a=C.evidence(D,D.byHost.arkansas,'materials');assert.equal(h.amount,44434392);assert.equal(m.amount,null);assert.ok(a.awards.every(a=>a.awardId!=='1906383'));});
test('award deduplication prevents double-counting from cross-listing',()=>{const d={...D,awards:[...D.awards,D.awards[0]]};assert.equal(C.evidence(d,D.byHost.harvard,'materials').amount,44434392);});
test('missing evidence displayed separately; weights finite at zero',()=>{const e=C.evidence(D,D.byHost.mit,'materials',{education:0,research:0,funding:0});assert.equal(e.amount,null);assert.equal(e.combined,0);assert.deepEqual(C.weights({education:0,research:0,funding:0}),{education:0,research:0,funding:0});});
test('weights change scores; counts unaffected; cap bounds maintained',()=>{for(const h of D.hosts){const e=C.evidence(D,h,'all',{education:0,research:0,funding:100});assert.ok(e.combined>=0&&e.combined<=100);}const e=C.evidence(D,D.byHost.yale,'materials',{education:100,research:0,funding:0});assert.equal(e.combined,100);});
test('timeline year filters events without dropping undated host records',()=>{const v=C.filter(D,base()),all=C.milestones(v.entries),old=C.milestones(v.entries,{through:2000});assert.equal(all.length,89);assert.ok(old.length<all.length);assert.ok(old.every(m=>m.year<=2000));assert.equal(v.entries.length,123);assert.ok(all.every(m=>m.sourceUrl));});
test('state outlines and projection cover contiguous US with all names',()=>{assert.equal(D.geography.features.length,49);for(const f of D.geography.features){assert.ok(f.properties.name);assert.ok(C.path(f.geometry).startsWith('M'));}for(const h of D.hosts){const[x,y]=C.project(h.lon,h.lat);assert.ok(x>0&&x<1480&&y>100&&y<900);}});
test('highlighting compares host types separately and excludes unsupported scores',()=>{const s={...base(),metric:'funding'},r=C.rankings(D,D.hosts,s),set=C.highlights(r,5);assert.ok(set.size<=10);assert.ok([...set].every(id=>C.evidence(D,D.byHost[id],'materials').amount!==null));assert.equal(C.highlights(r,0).size,0);});
test('export neutralizes spreadsheet formulas and preserves literal quotations',()=>{assert.equal(C.csv([['=1+1','a"b']]),'\uFEFF"\'=1+1","a""b"');});
test('both published versions have explicit reciprocal links and correct active states',()=>{
 for(const page of ['programs.html','labs.html','federal.html','institutional-atlas.html']){
  const html=fs.readFileSync(path.join(root,'..',page),'utf8');const nav=html.match(/<nav class="programs-versions"[\s\S]*?<\/nav>/)?.[0];assert.ok(nav,page);
  assert.match(nav,/href="programs\.html"/);assert.match(nav,/href="institutional-atlas\.html"/);
  assert.ok(nav.includes(page==='institutional-atlas.html'?'href="institutional-atlas.html" aria-current="page"':'href="programs.html" aria-current="page"'));
 }
 const html=fs.readFileSync(path.join(root,'..','institutional-atlas.html'),'utf8');assert.doesNotMatch(html,/WORKING PREVIEW|Independent preview|Local preview;|existing website unchanged/);assert.match(html,/data-view="institutional-atlas"/);
});

test('consortium totals and contract ceilings never become university or laboratory obligations',()=>{for(const h of D.hosts){const ev=C.evidence(D,h,'all');assert.ok(ev.awards.every(a=>a.agency==='NSF'&&a.recipientHostId===h.id));}const fnal=C.evidence(D,D.byHost.fermilab,'all');assert.equal(fnal.amount,null);assert.ok(fnal.linkedAwards.some(a=>a.amountUSD===125000000));const maryland=C.evidence(D,D.byHost.maryland,'all');assert.ok(maryland.linkedAwards.some(a=>a.agency==='DARPA'));assert.ok(!maryland.awards.some(a=>a.agency==='DARPA'));});
test('renewal phases count once per project and twice as records',()=>{const d={...D,awards:D.awards.filter(a=>a.recordId.startsWith('doe-sqms-'))},ev=C.evidence(d,D.byHost.fermilab,'all',{education:0,research:0,funding:100},{fundingMeasure:'projects'});assert.equal(ev.linkedAwards.length,2);assert.equal(ev.projectCount,1);assert.equal(ev.amount,null);assert.equal(ev.combined,25);});
test('funding agency and year filters select documented hosts and phases',()=>{const s={...base(),fundingScope:'all',fundingAgency:'DOE',fundingYear:'2025'};const awards=C.fundingRecords(D,s);assert.equal(awards.length,5);const ids=new Set(awards.flatMap(C.awardHosts));const visible=C.filter(D,s);assert.ok(visible.hosts.length>5);assert.ok(visible.hosts.every(h=>ids.has(h.id)));});
test('unmapped program investments remain funding records without fabricated host allocations',()=>{const a=C.fundingRecords(D,{fundingAgency:'NIST',fundingScope:'all'});assert.equal(a.length,1);assert.equal(a[0].amountUSD,20000000);assert.deepEqual(C.awardHosts(a[0]),[]);assert.equal(C.amountKind(a[0]),'program');});
test('table amount-type selection does not change funding evidence or map',()=>{const s={...base(),fundingScope:'all',fundingAgency:'DOE',amountKind:'obligation'};assert.equal(C.fundingRecords(D,s).length,15);assert.ok(C.filter(D,s).hosts.length>0);});
test('browser bundle and JSON snapshots are identical',()=>{const vm=require('node:vm'),ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data/bundle.js'),'utf8'),ctx);assert.deepEqual(JSON.parse(JSON.stringify(ctx.window.QMAP_DATA.funding)),read('funding'));});

test('program selection uses the same funding subset for evidence and ledger',()=>{const s={...base(),fundingScope:'all',agency:'DOE',program:'doe-qis',fundingMeasure:'projects'},ev=C.evidence(D,D.byHost.northwestern,s.fundingScope,s.weights,s);assert.equal(ev.projectCount,3);assert.equal(ev.linkedAwards.length,5);assert.ok(ev.linkedAwards.every(a=>a.relatedEntryIds.includes('doe-qis')));});
test('project searches never infer a partner through a shared center or umbrella',()=>{const s={...base(),fundingScope:'all',query:'Quantum Systems Accelerator'},v=C.filter(D,s),a=C.fundingRecords(D,s);assert.equal(a.length,2);const direct=new Set(a.flatMap(C.awardHosts));assert.ok(v.hosts.length>1);assert.ok(v.hosts.every(h=>direct.has(h.id)));assert.ok(!v.hosts.some(h=>h.id==='howard'));assert.ok(!v.hosts.some(h=>h.id==='arkansas'));});

test('EPiQS records preserve official identifiers, recipient grants and month precision',()=>{
 const grants=D.awards.filter(a=>C.funderType(a)==='private-foundation');assert.equal(grants.length,135);
 assert.equal(grants.reduce((n,a)=>n+a.amountUSD,0),196892206);
 for(const a of grants){assert.equal(a.agency,'Moore Foundation');assert.equal(C.amountKind(a),'foundation');assert.match(a.awardId,/^GBMF/);assert.match(a.officialUrl,/moore\.org\/grant-detail\?grantId=GBMF/);assert.match(a.awardDate,/^20\d\d-\d\d$/);assert.equal(a.startDate,null);assert.equal(a.endDate,null);assert.equal(a.datePrecision,'month');assert.deepEqual(C.awardHosts(a),a.recipientHostId?[a.recipientHostId]:[]);assert.ok(a.recipientInstitution);if(a.researchGroup)assert.ok(a.researchGroup.url);assert.ok(a.relatedEntryIds.includes('moore-epiqs'));}
 assert.equal(grants.find(a=>a.awardId==='GBMF9064').amountUSD,2000001);
 assert.equal(grants.find(a=>a.awardId==='GBMF3848').awardDate,'2013-08');
 assert.equal(grants.find(a=>a.awardId==='GBMF10637').termMonths,49);
});
test('private and federal funder filters agree across map, ledger and host evidence',()=>{
 for(const [sector,n]of [['private-foundation',135],['federal',42]]){const s={...base(),fundingScope:'all',fundingSector:sector,fundingMeasure:'projects'},a=C.fundingRecords(D,s),v=C.filter(D,s);assert.equal(a.length,n);const hosts=new Set(a.flatMap(C.awardHosts));assert.ok(v.hosts.length>0);assert.ok(v.hosts.every(h=>hosts.has(h.id)));for(const h of v.hosts)assert.ok(C.evidence(D,h,'all',s.weights,s).linkedAwards.every(x=>C.funderType(x)===sector));}
});
test('EPiQS funding program can be traced through the private layer alone',()=>{
 const s={...base(),layers:['philanthropy'],program:'moore-epiqs',fundingScope:'all'},v=C.filter(D,s);
 assert.deepEqual(v.entries.map(e=>e.id),['moore-epiqs']);assert.equal(C.fundingRecords(D,s).length,135);
 assert.ok(v.hosts.some(h=>h.id==='caltech'));assert.ok(v.hosts.some(h=>h.id==='stanford'));assert.ok(!v.hosts.some(h=>h.id==='brookhaven'));assert.equal(v.hosts.length,30);
});
test('private grants never add to federal obligations or imply national-lab allocations',()=>{
 const all={...base(),fundingScope:'all',fundingAgency:'Moore Foundation',fundingMeasure:'foundation'};
 const ev=C.evidence(D,D.byHost.princeton,'all',all.weights,all);assert.equal(ev.amount,null);assert.ok(ev.foundationAmount>0);assert.ok(ev.foundationAwards.every(a=>a.recipientHostId==='princeton'));
 const bozovic=D.awards.find(a=>a.awardId==='GBMF9074');assert.deepEqual(C.awardHosts(bozovic),['yale']);
 assert.equal(C.evidence(D,D.byHost.brookhaven,'all',all.weights,all).foundationAmount,null);
 assert.equal(C.evidence(D,D.byHost.slac,'all',all.weights,all).foundationAmount,null);
});
test('theory renewals group by host; initiative envelope stays out of totals',()=>{
 const s={...base(),fundingScope:'all',fundingAgency:'Moore Foundation',fundingMeasure:'projects'};
 const theory=D.awards.filter(a=>a.projectKey==='moore-epiqs-theory-harvard'),d={...D,awards:theory};assert.equal(theory.length,3);
 const e=C.evidence(d,D.byHost.harvard,'all',s.weights,s);assert.equal(e.projectCount,1);assert.equal(e.linkedAwards.length,3);
 assert.ok(D.funding.contextOnly.some(c=>c.funderType==='private-foundation'&&c.amountUSD===230000000));assert.ok(!D.awards.some(a=>a.amountUSD===230000000));
 const year=C.fundingRecords(D,{...s,fundingYear:'2026',fundingPortfolio:'Theory centers & scholars'});assert.equal(year.length,8);assert.ok(year.every(a=>a.portfolio==='Theory centers & scholars'));
});
test('research group and EPiQS portfolio searches retain directly funded hosts',()=>{
 for(const query of ['Mundy Group','Gedik Group','Materials synthesis investigators']){
 const s={...base(),fundingScope:'all',query},awards=C.fundingRecords(D,s),v=C.filter(D,s),direct=new Set(awards.flatMap(C.awardHosts));assert.ok(awards.length>0);assert.ok(v.hosts.length>0);assert.ok(v.hosts.every(h=>direct.has(h.id)));}
});
test('exclusive funding layers keep the funding ledger and host evidence in the same sector',()=>{
 for(const [layer,sector]of [['philanthropy','private-foundation'],['federal','federal']]){
 const s={...base(),layers:[layer],fundingScope:'all'},a=C.fundingRecords(D,s);assert.equal(a.length,sector==='private-foundation'?135:42);assert.ok(a.every(x=>C.funderType(x)===sector));}
});


test('complete EPiQS snapshot matches every official listing ID and full-grant total',()=>{
 const c=read('epiqs-coverage'),g=D.awards.filter(a=>a.program==='EPiQS');assert.equal(c.officialListingCount,135);assert.equal(c.detailRecordsChecked,135);assert.deepEqual(g.map(a=>a.awardId).sort(),c.grantIds);assert.deepEqual(c.missingGrantIds,[]);assert.deepEqual(c.duplicateGrantIds,[]);assert.equal(g.reduce((n,a)=>n+a.amountUSD,0),196892206);
});
test('every year and grant-type cell agrees with ledger, recipient map and highlight evidence',()=>{
 const p=C.portfolioSummary(D.awards);assert.equal(p.count,135);assert.equal(p.amountUSD,196892206);assert.equal(p.types.length,8);assert.equal(p.years.reduce((n,y)=>n+y.count,0),135);
 for(const y of p.years)for(const type of p.types){const s={...base(),fundingScope:'all',fundingAgency:'Moore Foundation',fundingYear:String(y.year),fundingPortfolio:type},a=C.fundingRecords(D,s),v=C.filter(D,s);assert.equal(a.length,y.types[type]);assert.ok(a.every(g=>g.portfolio===type&&g.announcementYear===y.year));assert.deepEqual(v.hosts.map(h=>h.id).sort(),[...new Set(a.flatMap(C.awardHosts))].sort());for(const h of v.hosts){const e=C.evidence(D,h,'all',s.weights,s);assert.equal(e.linkedAwards.length,a.filter(g=>g.recipientHostId===h.id).length);}}
});
test('non-US and intermediary recipients remain searchable without fabricated pins',()=>{
 for(const [query,n] of [['American Chemical Society',1],['British Columbia',2],['Complex Adaptive Matter',2],['Sherbrooke',1]]){const s={...base(),fundingScope:'all',query,fundingAgency:'Moore Foundation'};const a=C.fundingRecords(D,s);assert.equal(a.length,n,query);assert.ok(a.every(g=>!g.recipientHostId));assert.equal(C.filter(D,s).hosts.length,0);}
});
test('mixed-initiative and metascience awards preserve purpose and allocation boundaries',()=>{
 const mixed=D.awards.find(a=>a.awardId==='GBMF4474');assert.equal(mixed.amountUSD,846456);assert.equal(mixed.scopeType,'mixed-initiative');assert.match(mixed.amountMeaning,/undisclosed/);
 const iu=D.awards.find(a=>a.awardId==='GBMF14096');assert.equal(iu.recipientHostId,'indiana');assert.equal(iu.scopeType,'research-on-research');assert.equal(D.byHost.indiana.labEntryIds.length,0);assert.equal(D.byHost.indiana.educationEvidence.length,0);assert.equal(C.fundingRecords(D,{fundingScope:'materials',fundingPortfolio:'Research on research & evaluation'}).length,0);
});
test('historical recipients and named units do not migrate with researchers or dual appointments',()=>{
 const g=id=>D.awards.find(a=>a.awardId===id);assert.equal(g('GBMF9062').recipientHostId,'yale');assert.equal(g('GBMF9062.01').recipientHostId,'cornell');assert.equal(g('GBMF4533').recipientHostId,'ucsd');assert.equal(g('GBMF4533.01').recipientHostId,'columbia');assert.equal(g('GBMF4411').recipientHostId,'iowa-state');assert.equal(g('GBMF4630').recipientHostId,'lbnl');assert.ok(g('GBMF9457').relatedEntryIds.includes('cornell-lassp'));assert.match(g('GBMF9063').recipientUnit,/Sponsored Programs/);
});
