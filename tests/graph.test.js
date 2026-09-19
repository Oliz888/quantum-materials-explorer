const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const core = require('../graph-core.js');
const root = path.join(__dirname,'..');
const symposium = vm.runInNewContext(fs.readFileSync(path.join(root,'data.js'),'utf8')+'\nQM');
const wos = JSON.parse(fs.readFileSync(path.join(root,'data/wos.json')));
test('original dataset remains intact and isolated across source switches',()=>{
  const before=JSON.stringify(symposium);
  let g=core.graph(symposium,'materials',{year:2026});
  assert.equal(g.papers.length,812);assert.equal(g.entities.length,21);assert.equal(g.edges.length,42);
  g=core.graph(wos,'materials',{year:2026});
  assert.equal(g.papers.length,2697);
  assert.ok(g.entities.every(e=>e.id.startsWith('wos-')));
  core.graph(symposium,'materials',{year:2026});
  assert.equal(JSON.stringify(symposium),before);
});
test('early-year filtering applies to graphs and details',()=>{
  const g=core.graph(wos,'materials',{year:2014});
  assert.equal(g.papers.length,2);
  assert.ok(core.entityPapers(wos,wos.materials[0].id,2014).every(p=>p.year<=2014));
  assert.equal(core.graph(wos,'materials',{year:2013}).entities.length,0);
});
test('search applies after year changes and graph edges have visible endpoints',()=>{
  for(const year of [2014,2020,2026]){
    const g=core.graph(wos,'materials',{year,query:'graphene'});
    assert.ok(g.entities.every(e=>core.matches(e,'graphene')));
    const ids=new Set(g.entities.map(e=>e.id));
    assert.ok(g.edges.every(e=>ids.has(e.from)&&ids.has(e.to)));
  }
});
test('author search covers all names before top-N display cap',()=>{
  const all=core.graph(wos,'collaboration',{year:2026,limit:0});
  const name=all.entities.at(-1).name;
  const filtered=core.graph(wos,'collaboration',{year:2026,query:name,limit:100});
  assert.ok(filtered.entities.some(e=>e.name===name));
  assert.equal(core.graph(wos,'collaboration',{year:2026,limit:100}).entities.length,100);
});
test('technique categories work for both source vocabularies',()=>{
  for(const ds of [symposium,wos]) for(const category of ['Characterization','Synthesis','Computational']){
    const g=core.graph(ds,'techniques',{category});
    const techs=g.entities.filter(e=>e.type==='techniques');
    assert.ok(techs.length>0,category);
    assert.ok(techs.every(e=>core.category(e)===category));
    assert.ok(g.edges.every(e=>techs.some(t=>t.id===e.from)));
  }
});
test('phenomena edges use the explicit three-paper threshold',()=>{
  assert.ok(core.graph(wos,'phenomena').edges.every(e=>e.weight>=3));
});
test('paper links and co-occurrences are not duplicated within a paper',()=>{
  const ds={materials:[{id:'a',name:'A'},{id:'b',name:'B'}],papers:[{year:2020,materials:['a','a','b']}]};
  const g=core.graph(ds,'materials');assert.equal(g.edges.length,1);assert.equal(g.edges[0].weight,1);assert.equal(g.entities[0].count,1);
});
