(async function(){
  'use strict';
  const $=id=>document.getElementById(id), C=window.QMDirectory;
  const page=document.body.dataset.directory;
  const params=new URLSearchParams(location.search);
  let source=params.get('source');
  if(!['wos','symposium'].includes(source)){
    try{source=localStorage.getItem('qm_source');}catch(_){}
  }
  if(!['wos','symposium'].includes(source))source='wos';
  const text=(tag,value,className)=>{const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;return el;};
  const link=(label,url,className)=>{const a=text('a',label,className);a.href=url;return a;};
  function preserveSource(){
    document.querySelectorAll('a[href]').forEach(a=>{
      const u=new URL(a.href,location.href);
      if(u.origin===location.origin&&u.pathname.endsWith('.html')){u.searchParams.set('source',source);a.href=u.href;}
    });
  }
  preserveSource();
  try{
    const response=await fetch('data/institutions.json?v=1');
    if(!response.ok)throw new Error(`Directory response: ${response.status}`);
    const data=await response.json(),entries=data.entries,byId=new Map(entries.map(e=>[e.id,e]));
    $('directoryScope').textContent=data.scope;
    const total=entries.filter(e=>e.page===page).length;
    $('entryTotal').textContent=total;
    document.querySelectorAll('[data-count]').forEach(el=>{el.textContent=entries.filter(e=>e.page===el.dataset.count).length;});
    const groups=C.groupOrder.filter(g=>entries.some(e=>e.page===page&&e.group===g));
    groups.forEach(g=>{const o=text('option',g);o.value=g;$('directoryGroup').append(o);});
    if(page==='federal'){
      $('rosterSection').hidden=false;
      data.rosters.forEach(roster=>{
        const card=text('article','','roster-card');
        const count=text('div',String(roster.count),'roster-number');
        const heading=text('div','','roster-heading');heading.append(count,text('h3',roster.name));
        const details=document.createElement('details'),summary=text('summary','View all centers');
        const ul=document.createElement('ul');
        roster.ids.forEach(id=>{const e=byId.get(id),li=document.createElement('li');li.append(link(`${e.acronym} · ${e.name}`,C.entryHref(e,source)));ul.append(li);});
        details.append(summary,ul);
        card.append(heading,text('p',roster.note),details,link('Official roster ↗',roster.source.url,'roster-source'));
        $('rosterGrid').append(card);
      });
    }
    function card(e){
      const el=text('article','','directory-card');el.id=e.id;el.tabIndex=-1;
      const top=text('div','','entry-top');top.append(text('span',e.kind,'entry-kind'),link('↗',C.entryHref(e,source),'entry-permalink'));
      top.lastChild.setAttribute('aria-label',`Link to ${e.acronym||e.name}`);
      const h=text('h3',e.name);el.append(top,text('p',e.acronym||e.lead,'entry-acronym'),h);
      const dl=text('dl','','entry-roles');
      [['Host / lead',e.lead],['Funding / support',e.funder]].forEach(([label,value])=>{dl.append(text('dt',label),text('dd',value));});
      el.append(dl,text('p',e.focus,'entry-focus'));
      const relation=text('p','','entry-materials');relation.append(text('strong','Materials connection '),document.createTextNode(e.materials));el.append(relation);
      const topics=text('div','','entry-topics');e.topics.forEach(t=>topics.append(text('span',t)));el.append(topics);
      if(e.parentId){const parent=byId.get(e.parentId);const p=text('p','','entry-parent');p.append(document.createTextNode('Program → '),link(parent.acronym||parent.name,C.entryHref(parent,source)));el.append(p);}
      const children=entries.filter(child=>child.parentId===e.id);
      if(children.length){
        const related=document.createElement('details');related.className='entry-related';
        related.append(text('summary',`Linked labs & centers (${children.length})`));
        const ul=document.createElement('ul');children.forEach(child=>{const li=document.createElement('li');li.append(link(`${child.acronym} · ${child.name}`,C.entryHref(child,source)));ul.append(li);});
        related.append(ul);el.append(related);
      }
      const evidence=document.createElement('details');evidence.className='entry-evidence';
      evidence.append(text('summary','Status & sources'));
      evidence.append(text('p',e.status,'entry-status'));
      if(e.startYear)evidence.append(text('p',`Milestone year: ${e.startYear}. See the notes and source for what this date marks.`));
      if(e.notes)evidence.append(text('p',e.notes));
      const list=document.createElement('ol');
      e.sources.forEach(s=>{const li=document.createElement('li');li.append(link(s.title,s.url));if(s.note)li.append(text('small',s.note));list.append(li);});
      evidence.append(list,text('p',`Checked ${e.checkedDate}.`,'entry-checked'));
      const bottom=text('div','','entry-bottom');bottom.append(link('Official source ↗',e.sources[0].url),text('span',e.status,'status-short'));
      el.append(evidence,bottom);return el;
    }
    let visible=[];
    function render(updateURL=true){
      visible=C.filter(entries,{page,query:$('directoryQuery').value,group:$('directoryGroup').value});
      const fragment=document.createDocumentFragment();
      groups.forEach(g=>{
        const subset=visible.filter(e=>e.group===g);if(!subset.length)return;
        const section=text('section','','entry-group');const heading=text('h3',g,'group-title');heading.append(text('span',subset.length));section.append(heading);
        const grid=text('div','','entry-grid');subset.forEach(e=>grid.append(card(e)));section.append(grid);fragment.append(section);
      });
      $('directoryEntries').replaceChildren(fragment);
      $('directoryEmpty').hidden=visible.length!==0;
      $('directoryStatus').textContent=`${visible.length} of ${total} entries${$('directoryQuery').value.trim()?` matching “${$('directoryQuery').value.trim()}”`:''}`;
      $('exportDirectory').disabled=visible.length===0;
      if(updateURL){const u=new URL(location.href);u.searchParams.set('source',source);for(const [key,value] of [['q',$('directoryQuery').value.trim()],['group',$('directoryGroup').value]]){if(value&&value!=='all')u.searchParams.set(key,value);else u.searchParams.delete(key);}history.replaceState(null,'',u);}
      preserveSource();
    }
    function reset(){ $('directoryQuery').value='';$('directoryGroup').value='all';render(); }
    function showHash(){
      let id;try{id=decodeURIComponent(location.hash.slice(1));}catch(_){return;}
      const e=byId.get(id);if(!e||e.page!==page)return;
      if(!visible.some(item=>item.id===id))reset();
      const el=$(id);el.querySelector('.entry-evidence').open=true;el.focus({preventScroll:true});el.scrollIntoView({block:'start',behavior:'instant'});
    }
    $('directoryQuery').value=params.get('q')||'';
    $('directoryGroup').value=groups.includes(params.get('group'))?params.get('group'):'all';
    $('directoryFilters').addEventListener('submit',ev=>ev.preventDefault());
    $('directoryQuery').addEventListener('input',()=>render());
    $('directoryGroup').addEventListener('change',()=>render());
    $('resetDirectory').addEventListener('click',()=>{reset();$('directoryQuery').focus();});
    $('emptyReset').addEventListener('click',()=>{reset();$('directoryQuery').focus();});
    $('exportDirectory').addEventListener('click',()=>{
      const blob=new Blob([C.csv(visible)],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob);
      const a=link('',url);a.download=`quantum-materials-${page}-${data.checkedDate}.csv`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
    window.addEventListener('hashchange',showHash);
    render(false);showHash();
  }catch(error){
    console.error(error);$('directoryStatus').textContent='The directory could not load. Please reload the page.';
    const button=text('button','Reload directory');button.type='button';button.addEventListener('click',()=>location.reload());$('directoryEntries').append(button);
  }
})();
