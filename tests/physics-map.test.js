const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../physics-map-data.js');

test('every route, milestone and citation resolves; all nodes are reachable', () => {
  for (const n of Object.values(A.nodes)) {
    for (const id of [...n.children, ...n.related]) assert.ok(A.nodes[id], `${n.id} -> ${id}`);
    for (const id of n.events) assert.ok(A.events[id], `${n.id}: ${id}`);
    for (const id of n.sources) assert.ok(A.sources[id], `${n.id}: ${id}`);
    assert.ok(A.validPath(A.pathTo(n.id)), `Canonical path to ${n.id}`);
    assert.ok(A.descendants('landscape').includes(n.id), `Reachable ${n.id}`);
    for(const evidence of n.evidence) { assert.ok(A.sources[evidence.source]); assert.ok(evidence.locator); }
  }
  for (const e of Object.values(A.events)) {
    assert.ok(A.nodes[e.node]); assert.ok(A.sources[e.source]);
    assert.ok(Number.isInteger(e.year));
    assert.ok(e.detail.zh && e.detail.en);
  }
  for (const s of Object.values(A.sources)) assert.equal(new URL(s.url).protocol, 'https:');
});

test('shared topics support different paths without cycles or invalid jumps', () => {
  for (const area of ['superconductivity', 'correlations']) {
    assert.ok(A.validPath(['physics', 'condensed', area, 'cuprates']));
  }
  assert.ok(A.validPath(['physics', 'condensed', 'nanoscale', 'confinement', 'quantum-dots']));
  assert.equal(A.validPath(['physics', 'quantum-dots']), false);
  assert.equal(A.validPath(['physics', 'condensed', 'quantum-materials', 'condensed']), false);
  assert.equal(A.validPath(['unknown']), false);
  const seen = new Set(), active = new Set();
  function walk(id) {
    assert.ok(!active.has(id), `Child cycle at ${id}`);
    if (seen.has(id)) return;
    active.add(id); A.children(id).forEach(n => walk(n.id)); active.delete(id); seen.add(id);
  }
  Object.keys(A.nodes).forEach(walk);
});

test('timelines deduplicate cross-listed events, sort dates and filter the requested period', () => {
  const all = A.timeline();
  assert.equal(all.length, Object.keys(A.events).length);
  assert.equal(new Set(all.map(e => e.id)).size, all.length);
  assert.ok(all.every((e, i) => !i || e.year >= all[i - 1].year));
  assert.ok(A.timeline('physics', 1986).every(e => e.year <= 1986));
  assert.deepEqual(A.timeline('quantum-dots', 1990).map(e => e.id), ['qd1981']);
  assert.equal(A.timeline('quantum-wires').length, 0);
  assert.equal(A.timeline('particles').length, 0);
  assert.ok(A.timeline('landscape').some(e => e.id === 'cifar2002'));
});

test('chemistry is an independent entry, with chemical questions and cross-field routes',()=>{
  assert.deepEqual(A.pathTo('chemistry'),['landscape','chemistry']);
  assert.ok(!A.get('physics').children.includes('chemistry'));
  assert.ok(A.validPath(['landscape','chemistry','solid-chemistry','crystal-chemistry','hexagonal-perovskites']));
  assert.ok(A.validPath(['landscape','quantum-materials','solid-chemistry','crystal-chemistry','hexagonal-perovskites']));
  assert.ok(A.get('chemistry').questions.length>=2);
  assert.ok(A.get('electronic-design').children.includes('orbitals'));
  assert.ok(A.get('electronic-design').children.includes('doping'));
});

test('reading coverage links resolve and retain source locations and interpretive limits',()=>{
  assert.deepEqual(A.readings.map(r=>r.id),['nature','cava','goyal']);
  for(const reading of A.readings){
    assert.ok(reading.limit.en && reading.limit.zh);
    for(const group of reading.groups){
      assert.ok(group.locator);
      for(const id of group.nodes){
        assert.ok(A.nodes[id],`${reading.id}: ${id}`);
        assert.ok(A.get(id).evidence.some(e=>e.source===reading.id));
      }
    }
  }
  const cavaTopics=new Set(A.readings.find(r=>r.id==='cava').groups.flatMap(g=>g.nodes));
  for(const id of ['topology-chemistry','photoemission','skyrmions','spin-liquids','hexagonal-perovskites','bonding','orbitals','doping','quantum-algorithms','electrides','quantum-dots'])assert.ok(cavaTopics.has(id));
  const goyalTopics=new Set(A.readings.find(r=>r.id==='goyal').groups.flatMap(g=>g.nodes));
  for(const id of ['symmetry','topological-superconductivity','majorana','defects','superfluidity','metamaterials','weyl','synthesis-methods'])assert.ok(goyalTopics.has(id));
  for(const node of Object.values(A.nodes).filter(n=>!n.placeholder))assert.ok(node.questions.length&&node.questionStatus==='reader-synthesis');
});

test('historical lenses preserve shared activities and do not imply disciplinary ownership',()=>{
  assert.ok(A.timeline('landscape',2025,'community').every(e=>e.kind==='institution'));
  assert.ok(A.timeline('landscape',2025,'materials').some(e=>e.id==='qd1993'));
  assert.ok(A.timeline('landscape',2025,'materials').some(e=>e.id==='cuprate1986'));
  assert.ok(A.timeline('landscape',2025,'phenomena').some(e=>e.id==='cuprate1986'));
  assert.ok(!A.timeline('landscape',1990,'materials').some(e=>e.id==='qd1993'));
});

test('bilingual search and conceptual types preserve the distinctions in the readings', () => {
  assert.ok(A.search('量子限域').some(n => n.id === 'confinement'));
  assert.ok(A.search('GRAPHENE').some(n => n.id === 'graphene'));
  assert.deepEqual(A.search('   '), []);
  assert.equal(A.get('confinement').kind, 'mechanism');
  assert.equal(A.get('quantum-dots').kind, 'material');
  assert.equal(A.get('quantum-materials').kind, 'umbrella');
  assert.equal(A.events.rvb1973.kind, 'theory');
  assert.equal(A.events.bridge2021.kind, 'institution');
  assert.match(A.events.qd1981.display, /Early 1980s/);
});
