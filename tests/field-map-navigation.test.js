const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('all maps and the preview share the same three tabs and mark their own map', () => {
  const pages = ['physics-map.html', 'physics-map-v2.html', 'knowledge-graph-v2.html'];
  const labels = ['V1 · Layered map', 'V2 · Connected fields', 'V3 · Knowledge graph'];
  for (const page of [...pages, 'knowledge-graph.html']) {
    const html = fs.readFileSync(path.join(__dirname, '..', page), 'utf8');
    const nav = html.match(/<nav class="field-map-versions"[^>]*>([\s\S]*?)<\/nav>/)[1];
    const links = [...nav.matchAll(/<a href="([^"]+)"([^>]*)>([^<]+)<\/a>/g)];
    assert.deepEqual(links.map(link => link[1]), pages);
    assert.deepEqual(links.map(link => link[3]), labels);
    const selected = links.filter(link => link[2].includes('aria-current'));
    assert.equal(selected.length, 1);
    assert.equal(selected[0][1], page === 'knowledge-graph.html' ? pages[2] : page);
    assert.ok(html.includes('field-map-navigation.css'));
    assert.ok(html.includes('field-map-navigation.js'));
  }
});
