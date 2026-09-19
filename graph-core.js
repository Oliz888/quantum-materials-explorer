/* Shared, DOM-free graph model. Both sources are passed in explicitly. */
(function(root) {
  'use strict';
  const category = t => ({Experiment: 'Characterization', Theory: 'Computational'}[t.cat] || t.cat);
  const normalized = value => String(value || '').normalize('NFKC').toLocaleLowerCase();
  const matches = (entity, query) => normalized([entity.name, entity.cls, entity.cat, entity.inst, entity.formula].filter(Boolean).join(' ')).includes(normalized(query));
  function papersThrough(dataset, year) { return dataset.papers.filter(p => p.year <= year); }
  function graph(dataset, view, options = {}) {
    const year = options.year ?? Infinity;
    const papers = papersThrough(dataset, year);
    const field = {materials:'materials', collaboration:'authors', phenomena:'phenomena', techniques:'techniques'}[view];
    const catalog = view === 'collaboration' ? dataset.researchers : dataset[field];
    const count = new Map(), pairs = new Map();
    let represented = 0;
    const allowedTechs = new Set(dataset.techniques?.filter(t=>!options.category || options.category==='all' || category(t)===options.category).map(t=>t.id));
    const inc = (map, key) => map.set(key, (map.get(key) || 0) + 1);
    for (const p of papers) {
      const ids = [...new Set(p[field])];
      if (ids.length && (view !== 'techniques' || (p.materials.length && ids.some(id=>allowedTechs.has(id))))) represented++;
      ids.forEach(id => inc(count, id));
      if (view === 'techniques') {
        [...new Set(p.materials)].forEach(id => inc(count, id));
        for (const t of ids) for (const m of new Set(p.materials)) inc(pairs, JSON.stringify([t,m]));
      } else {
        for (let i=0; i<ids.length; i++) for (let j=i+1; j<ids.length; j++) inc(pairs, JSON.stringify([ids[i],ids[j]].sort()));
      }
    }
    let entities = catalog.filter(e => count.has(e.id)).map(e => ({...e, type:field, count:count.get(e.id)}));
    if (view === 'techniques') {
      entities = entities.filter(e => !options.category || options.category === 'all' || category(e) === options.category);
      const techIds = new Set(entities.map(e => e.id));
      const mats = new Set([...pairs.keys()].map(k=>JSON.parse(k)).filter(([t])=>techIds.has(t)).map(([,m])=>m));
      entities.push(...dataset.materials.filter(m=>mats.has(m.id)).map(m=>({...m,type:'materials',count:count.get(m.id)})));
    }
    const activeTotal = entities.length;
    if (options.query) entities = entities.filter(e => matches(e, options.query));
    const matchingTotal = entities.length;
    entities.sort((a,b)=> b.count-a.count || a.id.localeCompare(b.id));
    if (view === 'collaboration' && Number(options.limit) > 0) entities = entities.slice(0,Number(options.limit));
    const visible = new Set(entities.map(e=>e.id));
    const threshold = options.minEdge ?? (view === 'phenomena' ? 3 : 1);
    const edges = [...pairs].map(([key, weight])=>{const [from,to]=JSON.parse(key);return {from,to,weight};})
      .filter(e=> e.weight>=threshold && visible.has(e.from) && visible.has(e.to));
    return {entities,edges,papers,represented,activeTotal,matchingTotal};
  }
  function entityPapers(dataset, id, year) {
    return papersThrough(dataset, year).filter(p=>['materials','authors','techniques','phenomena'].some(k=>p[k].includes(id)))
      .sort((a,b)=>b.year-a.year || a.id.localeCompare(b.id));
  }
  const api = {graph,papersThrough,entityPapers,category,matches};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.QMGraph = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
