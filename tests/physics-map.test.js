const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../physics-map-data.js');

test('every route, milestone and citation resolves; all nodes are reachable', () => {
  for (const n of Object.values(A.nodes)) {
    for (const id of [...n.children, ...n.related]) assert.ok(A.nodes[id], `${n.id} -> ${id}`);
    for (const id of n.events) assert.ok(A.events[id], `${n.id}: ${id}`);
    for (const id of n.sources) assert.ok(A.sources[id], `${n.id}: ${id}`);
    assert.ok(A.validPath(A.pathTo(n.id)), `Canonical path to ${n.id}`);
    assert.ok(A.descendants('physics').includes(n.id), `Reachable ${n.id}`);
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
  assert.ok(A.timeline('condensed').some(e => e.id === 'cifar2002'));
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
