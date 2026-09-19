/* One source at a time: no cross-source record or entity merges. */
(function() {
  'use strict';
  const view = document.body.dataset.view;
  const $ = id => document.getElementById(id);
  const escape = s => String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels = {symposium:'EPiQS Postdoctoral Symposium', wos:'Web of Science'};
  const cache = {symposium:QM};
  const state = {source:'symposium',dataset:null,year:2026,query:'',category:'all',limit:100,network:null,token:0,timer:null,panel:null,page:0,paperQuery:''};
  let lookup = new Map(), currentGraph;
  const sourceSelect = $('dataSource');
  function stop() { clearInterval(state.timer); state.timer=null; if($('playBtn')) $('playBtn').textContent='▶'; }
  function notice(text) { $('sourceNote').textContent=text; $('sourceNote').hidden=!text; }
  function selectedOptions() {return {year:state.year,query:state.query,category:state.category,limit:state.source==='wos'?state.limit:0};}

  async function selectSource(source) {
    const token=++state.token;
    stop();
    sourceSelect.disabled=true;
    $('explorerControls').inert=true;
    notice(`Loading ${labels[source]}…`);
    try {
      if (!cache[source]) {
        const response=await fetch('data/wos.json?v=1');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        cache[source]=await response.json();
      }
      if (token!==state.token) return;
      state.source=source;
      state.dataset=cache[source];
      state.query=''; state.category='all'; state.panel=null; state.paperQuery=''; state.page=0;
      $('search').value='';
      if($('category')) $('category').value='all';
      lookup=new Map(['materials','researchers','techniques','phenomena','funders'].flatMap(k=>state.dataset[k]).map(e=>[e.id,e]));
      const years=state.dataset.papers.map(p=>p.year);
      state.year=Math.max(...years);
      const slider=$('yearSlider');
      if(slider) {slider.min=Math.min(...years);slider.max=state.year;slider.value=state.year;$('yearLabel').textContent=state.year;}
      $('authorLimitGroup').hidden=!(source==='wos' && view==='collaboration');
      sourceSelect.value=source;
      try {localStorage.setItem('qm_source',source);} catch (_) {}
      const url=new URL(location.href);url.searchParams.set('source',source);history.replaceState(null,'',url);
      document.querySelectorAll('.site-nav a, .source-methods').forEach(a=>{const url=new URL(a.href);url.searchParams.set('source',source);a.href=url;});
      render();
    } catch(error) {
      if(state.network) {state.network.destroy();state.network=null;}
      state.dataset=null;
      $('stats').textContent='Data unavailable';
      $('sidebar').replaceChildren();
      notice(`Could not load ${labels[source]}. Serve this folder over HTTP, check the data file, and retry.`);
      const retry=document.createElement('button');retry.textContent='Retry loading data';retry.onclick=()=>selectSource(source);$('sidebar').append(retry);
      console.error(error);
    } finally {sourceSelect.disabled=false;$('explorerControls').inert=false;}
  }
  function render() {
    if(!state.dataset) return;
    const g=currentGraph=QMGraph.graph(state.dataset,view,selectedOptions());
    const wos=state.source==='wos';
    notice('');
    const noun={materials:'materials / families',collaboration:wos?'author name groups':'researchers',techniques:'techniques + materials',phenomena:'phenomena'}[view];
    $('stats').textContent=`${g.entities.length.toLocaleString()} / ${g.activeTotal.toLocaleString()} ${noun} · ${g.edges.length.toLocaleString()} links`;
    $('coverage').textContent=`${g.papers.length.toLocaleString()} / ${state.dataset.papers.length.toLocaleString()} papers through ${state.year} · ${g.represented.toLocaleString()} with ${view==='collaboration'?'author names':view==='techniques'?'both technique and material tags':'tags for this view'}${view==='phenomena'?' · links require ≥3 shared papers':''}${view==='collaboration'&&wos?` · showing up to ${state.limit} names, ranked by paper count`:''}`;
    const nodes=g.entities.map(e=>({id:e.id,label:e.name,shape:e.type==='techniques'?'diamond':'dot',
      color:{background:e.color || '#2563eb',border:e.color || '#2563eb'},
      size:Math.min(9+Math.sqrt(e.count)*3,42),font:{size:wos?15:22,color:'#1f2937',strokeWidth:2,strokeColor:'#fff'},
      title:escape(`${e.name} · ${e.count} papers`)}));
    const edges=g.edges.map(e=>({...e,width:1+Math.min(Math.sqrt(e.weight),8),color:{color:'rgba(60,70,90,.20)',highlight:'#2563eb'}}));
    if(state.network) state.network.destroy();
    if(typeof vis==='undefined') {
      notice('The graph library could not load. Check access to unpkg.com and reload. Paper browsing is still available.');
    } else {
      state.network=new vis.Network($('network'),{nodes,edges},{
        layout:{randomSeed:42,improvedLayout:false},
        physics:{barnesHut:{gravitationalConstant:-12000,springLength:190,springConstant:.02,damping:.35},stabilization:{iterations:120}},
        interaction:{hover:true,tooltipDelay:150,navigationButtons:true},edges:{smooth:false}});
      state.network.once('stabilizationIterationsDone',()=>{state.network.setOptions({physics:false});});
      state.network.on('click',e=>{state.panel=e.nodes.length?e.nodes[0]:null;state.page=0;renderPanel();});
    }
    $('emptyGraph').hidden=!!g.entities.length;
    renderPanel();
  }
  function chips(title, ids) {
    const entities=[...new Set(ids)].map(id=>lookup.get(id)).filter(Boolean);
    if(!entities.length) return '';
    return `<div class="section-title">${escape(title)}</div><div class="topic-chips">${entities.map(e=>`<span class="topic-chip">${escape(e.name)}</span>`).join('')}</div>`;
  }
  function paperCard(p) {
    const authors=p.authors.map(id=>lookup.get(id)?.name || id).join('; ');
    const title=p.doi ? `<a href="https://doi.org/${p.doi.split('/').map(encodeURIComponent).join('/')}" target="_blank" rel="noopener">${escape(p.title)}</a>` : escape(p.title);
    let html=`<article class="paper-card"><span class="paper-title">${title}</span><span class="paper-year">${p.year}</span><div class="paper-journal">${escape(p.journal)}</div><div class="paper-meta">${escape(authors)}</div>`;
    if(state.source==='wos') {
      html+=`<div class="paper-meta">${escape(p.ut)} · ${escape(p.documentType)} · ${p.citations} WoS citations at export</div>`;
      if(p.evidence.length) html+=`<details class="evidence"><summary>Automated tag evidence (${p.evidence.length})</summary>${p.evidence.map(e=>`<p><b>${escape(lookup.get(e.entity)?.name)}</b> — ${escape(e.field)}: <q>${escape(e.excerpt)}</q></p>`).join('')}</details>`;
      else html+='<div class="paper-meta">No material, technique or phenomenon matched the current rules.</div>';
      html+=`<details class="evidence"><summary>Source records</summary>${p.sources.map(s=>`<p>${escape(s.file)} · ${escape(s.sheet)} · row ${s.row}</p>`).join('')}</details>`;
    }
    return html+'</article>';
  }
  function renderPanel() {
    if(!state.dataset) return;
    const sidebar=$('sidebar');
    let papers=QMGraph.papersThrough(state.dataset,state.year), html='';
    if(state.panel && state.panel!=='papers') {
      const e=lookup.get(state.panel);
      if(!e) {state.panel=null;return renderPanel();}
      papers=QMGraph.entityPapers(state.dataset,e.id,state.year);
      html=`<button id="backPanel" class="plain-button">← Overview</button><h2>${escape(e.name)}</h2><div class="meta-row"><span class="count-pill">${papers.length} papers through ${state.year}</span><span class="badge">${escape(e.cls || e.cat || e.inst || '')}</span></div>`;
      if(e.desc) html+=`<p>${escape(e.desc)}</p>`;
      if(e.discovered) html+=`<p><b>First reported:</b> ${escape(e.discovered)}</p>`;
      if(e.importance) html+=`<p><b>Why it matters:</b> ${escape(e.importance)}</p>`;
      if(e.applications) html+=`<p><b>Industry potential:</b> ${escape(e.applications)}</p>`;
      if(e.wiki && /^https:\/\//.test(e.wiki)) html+=`<a href="${escape(e.wiki)}" target="_blank" rel="noopener">Wikipedia →</a>`;
      html+=chips('Materials',papers.flatMap(p=>p.materials).filter(id=>id!==e.id))+chips('Techniques',papers.flatMap(p=>p.techniques).filter(id=>id!==e.id))+chips('Phenomena',papers.flatMap(p=>p.phenomena).filter(id=>id!==e.id));
      if(state.source==='symposium') html+=chips('Researchers',papers.flatMap(p=>p.authors).filter(id=>id!==e.id))+chips('Funding sources',papers.flatMap(p=>p.funders));
    } else if(state.panel==='papers') {
      html=`<button id="backPanel" class="plain-button">← Overview</button><h2>Browse papers</h2><label for="paperQuery">Title, DOI or author</label><input id="paperQuery" type="search" value="${escape(state.paperQuery)}" placeholder="Search this source’s papers">`;
      const q=state.paperQuery.toLocaleLowerCase();
      if(q) papers=papers.filter(p=>[p.title,p.doi,...p.authors.map(id=>lookup.get(id)?.name || '')].join(' ').toLocaleLowerCase().includes(q));
    } else {
      html=`<h2>${escape(labels[state.source])}</h2><p>Click a node to explore its connections and papers. Drag to move nodes; scroll to zoom.</p><button id="browsePapers">Browse ${papers.length.toLocaleString()} papers</button>`;
      if(state.source==='wos') html+='<p class="source-explanation">Tags indicate words found in titles, author keywords or abstracts. They can include background mentions and miss unlisted terms. Material nodes include both compounds and broader families. Unmatched papers remain in Browse papers.</p>';
      const grouped=new Map();
      for(const e of currentGraph.entities) {
        const label=view==='collaboration'?(state.source==='wos'?'Author name':e.inst):(e.type==='techniques'?QMGraph.category(e):(e.cls || e.cat || e.type));
        if(!grouped.has(label)) grouped.set(label,e.color);
      }
      html+='<div class="section-title">Legend</div>'+[...grouped].map(([name,color])=>`<div class="legend-item"><span class="legend-dot" style="background:${escape(color)}"></span>${escape(name)}</div>`).join('');
      html+='<p class="source-explanation">Node size increases with paper count. Links count papers sharing both entities. Graph position is a layout, not a measured distance.</p>';
      sidebar.innerHTML=html;
      $('browsePapers').onclick=()=>{state.panel='papers';state.page=0;renderPanel();};
      return;
    }
    const size=30;
    state.page=Math.min(state.page,Math.max(0,Math.ceil(papers.length/size)-1));
    const start=state.page*size;
    html+=`<div class="section-title">Papers (${papers.length.toLocaleString()})</div>`;
    html+=papers.slice(start,start+size).map(paperCard).join('') || '<p>No papers match this selection.</p>';
    html+=`<div class="pagination"><button id="prevPage" ${state.page===0?'disabled':''}>Previous</button><span>${papers.length?start+1:0}–${Math.min(start+size,papers.length)} of ${papers.length}</span><button id="nextPage" ${start+size>=papers.length?'disabled':''}>Next</button></div>`;
    sidebar.innerHTML=html;
    $('backPanel').onclick=()=>{state.panel=null;state.page=0;state.paperQuery='';renderPanel();};
    $('prevPage').onclick=()=>{state.page--;renderPanel();sidebar.scrollTop=0;};
    $('nextPage').onclick=()=>{state.page++;renderPanel();sidebar.scrollTop=0;};
    if($('paperQuery')) $('paperQuery').oninput=event=>{
      state.paperQuery=event.target.value;state.page=0;
      const caret=event.target.selectionStart;renderPanel();$('paperQuery').focus();$('paperQuery').setSelectionRange(caret,caret);
    };
  }
  sourceSelect.onchange=()=>selectSource(sourceSelect.value);
  $('search').oninput=event=>{state.query=event.target.value;state.panel=null;render();};
  $('authorLimit').onchange=event=>{state.limit=Number(event.target.value);render();};
  if($('category')) $('category').onchange=event=>{state.category=event.target.value;state.panel=null;render();};
  if($('yearSlider')) {
    $('yearSlider').oninput=event=>{state.year=Number(event.target.value);$('yearLabel').textContent=state.year;state.page=0;render();};
    $('playBtn').onclick=()=>{
      if(state.timer) return stop();
      const slider=$('yearSlider');state.year=Number(slider.min);slider.value=state.year;$('yearLabel').textContent=state.year;render();$('playBtn').textContent='⏸';
      state.timer=setInterval(()=>{if(state.year>=Number(slider.max))return stop();state.year++;slider.value=state.year;$('yearLabel').textContent=state.year;state.page=0;render();},1400);
    };
  }
  let initial=new URLSearchParams(location.search).get('source');
  if(!labels[initial]) {try {initial=localStorage.getItem('qm_source');} catch (_) {}}
  selectSource(labels[initial]?initial:'symposium');
})();
