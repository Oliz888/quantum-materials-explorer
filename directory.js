(async function(){
 'use strict';
 const $=id=>document.getElementById(id),C=window.QMDirectory,page=document.body.dataset.directory,params=new URLSearchParams(location.search);
 let source=params.get('source');if(!['wos','symposium'].includes(source)){try{source=localStorage.getItem('qm_source');}catch(_){}}if(!['wos','symposium'].includes(source))source='wos';
 const text=(tag,value,cls)=>{const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;return el;};
 const link=(label,url,cls)=>{const a=text('a',label,cls);a.href=url;return a;};
 const svgEl=(tag,attrs={})=>{const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,String(v));return e;};
 const svgText=(value,x,y,cls)=>{const e=svgEl('text',{x,y,class:cls||''});e.textContent=value;return e;};
 function preserveSource(){document.querySelectorAll('a[href]').forEach(a=>{const u=new URL(a.href,location.href);if(u.origin===location.origin&&u.pathname.endsWith('.html')){u.searchParams.set('source',source);a.href=u.href;}});}
 preserveSource();
 try{
  const response=await fetch('data/institutions.json?v=2');if(!response.ok)throw Error(`Directory response ${response.status}`);
  const data=await response.json(),entries=data.entries,byId=new Map(entries.map(e=>[e.id,e]));
  const allPage=entries.filter(e=>C.inPage(e,page)),total=allPage.length;
  const groups=C.groupOrder.filter(g=>allPage.some(e=>C.groupOf(e,page)===g));
  const allEvents=C.milestones(entries),firstYear=Math.min(...allEvents.map(e=>e.year)),lastYear=Math.max(...allEvents.map(e=>e.year));
  let visible=[],mapMode='connections',chosenYear=null,showAllEvents=false,geography=null,mapRevision=0;
  $('directoryScope').textContent=data.scope;$('entryTotal').textContent=total;
  document.querySelectorAll('[data-count]').forEach(el=>el.textContent=entries.filter(e=>C.inPage(e,el.dataset.count)).length);
  groups.forEach(g=>{const o=text('option',g);o.value=g;$('directoryGroup').append(o);});
  $('directoryYear').min=firstYear;$('directoryYear').max=lastYear;$('directoryYear').value=lastYear;$('directoryYearLabel').textContent=lastYear;
  function wrapLabel(value,max=31){const lines=[''];for(const word of value.split(' ')){const i=lines.length-1;if((lines[i]+' '+word).trim().length>max&&lines[i])lines.push(word);else lines[i]=(lines[i]+' '+word).trim();}return lines;}
  function groupURL(p,g){const u=new URL(p+'.html',location.href);u.searchParams.set('source',source);u.searchParams.set('group',g);return u.href;}
  function renderConnections(){
   const graph=C.graph(entries),columns=['federal','labs','programs'],centers={federal:170,labs:540,programs:910};
   const maxRows=Math.max(...columns.map(p=>graph.nodes.filter(n=>n.page===p).length)),height=maxRows*60+105;
   const svg=svgEl('svg',{viewBox:`0 0 1080 ${height}`,role:'group','aria-label':'Groups across federal initiatives, labs, and university pathways'});
   const pos=new Map();
   for(const p of columns){
    const ns=graph.nodes.filter(n=>n.page===p),x=centers[p];
    svg.append(svgEl('rect',{x:x-155,y:42,width:310,height:height-50,rx:10,class:p===page?'map-column current':'map-column'}));
    svg.append(svgText(p==='federal'?'National & federal':p==='labs'?'Labs & institutes':'University & programs',x,25,'map-column-title'));
    ns.forEach((n,i)=>pos.set(n.id,{x,y:80+(maxRows-ns.length)*30+i*60}));
   }
   for(const e of graph.edges){const a=pos.get(e.from),b=pos.get(e.to);if(!a||!b)continue;const path=svgEl('path',{d:`M${a.x+135},${a.y} C${a.x+185},${a.y} ${b.x-185},${b.y} ${b.x-135},${b.y}`,class:'relationship-line '+e.type});const title=svgEl('title');title.textContent=`${e.type==='program'?'Program–center links':e.type==='host'?'Shared university host pairs':'Cross-listed entities'}: ${e.count}`;path.append(title);svg.append(path);}
   for(const n of graph.nodes){
    const {x,y}=pos.get(n.id),inactive=n.page===page&&!n.ids.some(id=>visible.some(e=>e.id===id)),a=svgEl('a',{href:groupURL(n.page,n.group),tabindex:0,'aria-label':`${n.group}, ${n.ids.length} entries in ${C.pages[n.page]}`,class:'map-group '+(inactive?'filtered-out ':'')+(n.page===page?'this-page ':'')+($('directoryGroup').value===n.group&&n.page===page?'selected':'')});
    const dates=C.milestones(n.ids.map(id=>byId.get(id))).slice(-3).map(e=>e.year+' · '+e.title);
    const title=svgEl('title');title.textContent=`${n.group}\n${n.ids.length} entries${dates.length?'\nSelected milestones:\n'+dates.join('\n'):''}`;a.append(title);
    a.append(svgEl('rect',{x:x-135,y:y-23,width:270,height:46,rx:7}));
    const lines=wrapLabel(n.group,32);lines.forEach((line,i)=>a.append(svgText(line,x-121,y-(lines.length-1)*7+4+i*14,'map-node-label')));
    a.append(svgEl('circle',{cx:x+115,cy:y,r:12,class:'map-count-bg'}),svgText(n.ids.length,x+115,y+4,'map-count'));
    if(n.page===page)a.addEventListener('click',ev=>{ev.preventDefault();$('directoryGroup').value=n.group;$('directoryQuery').value='';render();const detail=$('mapDetail');detail.hidden=false;detail.replaceChildren(text('strong',n.group),text('span',`${n.ids.length} entries selected. The timeline and directory below now show this group.`),link('Browse entries ↓','#browseTitle'));});
    svg.append(a);
   }
   $('institutionMap').replaceChildren(svg);
   if(matchMedia('(max-width:700px)').matches)$('institutionMap').scrollLeft=centers[page]/1080*svg.getBoundingClientRect().width-$('institutionMap').clientWidth/2;
   $('mapCoverage').textContent=`${entries.length} distinct entries across three views. Node counts include cross-listing; filtered-out groups in this view are faded. Lines summarize recorded links between groups; they do not connect every member or measure collaboration.`;
  }
  function geoEntries(){if(page!=='federal')return visible;const ids=new Set(visible.map(e=>e.id));return entries.filter(e=>ids.has(e.id)||ids.has(e.parentId));}
  async function renderGeography(revision){
   const hosts=geoEntries(),points=C.locations(hosts),mapped=hosts.filter(e=>(e.locations||[]).length);
   const loading=text('p','Loading host locations…','panel-note');$('institutionMap').replaceChildren(loading);
   if(!geography){const r=await fetch('data/north-america-map.json?v=1');if(!r.ok)throw Error('Map outline unavailable');geography=await r.json();}
   if(revision!==mapRevision||mapMode!=='locations')return;
   const wrapper=text('div','','geography-view'),picker=text('select','','host-picker');picker.setAttribute('aria-label','Choose a host location');
   const opt=text('option','Choose a host city');opt.value='';picker.append(opt);
   const svg=svgEl('svg',{viewBox:'0 0 1000 500',role:'group','aria-label':'Approximate host-city map of the United States and Canada'});
   const canvas=text('div','','geo-canvas');canvas.append(svg);
   const defs=svgEl('defs'),clip=svgEl('clipPath',{id:'geoClip'});clip.append(svgEl('rect',{x:0,y:0,width:1000,height:500}));defs.append(clip);svg.append(defs);
   svg.append(svgEl('rect',{width:1000,height:500,class:'map-water'}));const land=svgEl('g',{'clip-path':'url(#geoClip)'});
   geography.features.forEach(f=>{const p=svgEl('path',{d:f.d,class:'map-land'});const t=svgEl('title');t.textContent=f.name;p.append(t);land.append(p);});svg.append(land);
   svg.append(svgText('CANADA',510,70,'country-label'),svgText('UNITED STATES',480,295,'country-label'),svgText('MEXICO',365,475,'country-label'));
   const clusters=[];
   for(const p of points){const x=(p.lon+134)/74*1000,y=(55-p.lat)/33*500;const near=clusters.find(c=>Math.hypot(c.x-x,c.y-y)<22);if(near){near.points.push(p);near.ids=[...new Set([...near.ids,...p.ids])];}else clusters.push({x,y,points:[p],ids:[...p.ids]});}
   function details(cluster){
    canvas.scrollLeft=Math.max(0,cluster.x/1000*svg.getBoundingClientRect().width-canvas.clientWidth/2);
    const box=$('mapDetail');box.hidden=false;box.replaceChildren(text('strong',cluster.points.map(p=>p.label).join(' / ')),text('span',`${cluster.ids.length} mapped entries. Approximate host cities; a joint or distributed institution can appear in more than one location.`));
    const ul=document.createElement('ul');cluster.ids.forEach(id=>{const e=byId.get(id),li=document.createElement('li');li.append(link(`${e.acronym} · ${e.name}`,C.entryHref(e,source,C.inPage(e,page)?page:e.page)));ul.append(li);});box.append(ul);
    const sources=text('div','','map-location-sources');cluster.points.forEach(p=>sources.append(link(p.label+' · location source ↗',p.sourceUrl)));box.append(sources);
    svg.querySelectorAll('.host-marker').forEach(el=>el.classList.toggle('selected',el.dataset.cluster===String(clusters.indexOf(cluster))));
   }
   clusters.forEach((c,i)=>{
    const label=c.points.map(p=>p.label).join(' / '),o=text('option',label+` (${c.ids.length})`);o.value=String(i);picker.append(o);
    const g=svgEl('g',{class:'host-marker',role:'button',tabindex:0,'aria-label':label+`, ${c.ids.length} entries`,'data-cluster':i});
    const t=svgEl('title');t.textContent=label+'\n'+c.ids.map(id=>byId.get(id).acronym||byId.get(id).name).join('\n');g.append(t,svgEl('circle',{cx:c.x,cy:c.y,r:Math.min(17,8+Math.sqrt(c.ids.length)*2)}),svgText(c.ids.length,c.x,c.y+4,'host-count'));
    g.addEventListener('click',()=>{picker.value=String(i);details(c);});g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();picker.value=String(i);details(c);}});svg.append(g);
   });
   picker.addEventListener('change',()=>{if(picker.value!=='')details(clusters[+picker.value]);});
   wrapper.append(picker,canvas);$('institutionMap').replaceChildren(wrapper);$('institutionMap').scrollLeft=0;
   $('mapCoverage').replaceChildren(document.createTextNode((page==='federal'?`${mapped.length} linked research entries mapped for ${visible.length} initiatives. `:`${mapped.length} of ${hosts.length} entries in this view have verified host cities. `)+'Nearby cities are grouped; markers do not represent every partner site. '),link('Base map: Natural Earth','https://www.naturalearthdata.com/about/terms-of-use/'));
   if(!mapped.length){$('mapDetail').hidden=false;$('mapDetail').replaceChildren(text('p','No host city is documented for these results. The directory and milestones remain available below.'));}
  }
  function renderMap(){
   const revision=++mapRevision;$('mapDetail').hidden=true;
   $('connectionsMode').setAttribute('aria-pressed',String(mapMode==='connections'));$('locationsMode').setAttribute('aria-pressed',String(mapMode==='locations'));$('connectionLegend').hidden=mapMode!=='connections';
   $('overviewTitle').textContent=mapMode==='connections'?'How the three views connect':'Where the research is hosted';
   $('overviewCaption').textContent=mapMode==='connections'?'Program–center links connect support to research. Shared hosts connect labs with university pathways. Select a group to browse its entries.':page==='federal'?'This view shows documented host cities of centers linked to the selected initiatives. Agency headquarters are not used as substitutes for research locations.':'This view shows documented host cities of the current results. Distributed networks and sites without a verified location remain listed below.';
   if(mapMode==='connections')renderConnections();else renderGeography(revision).catch(error=>{if(revision!==mapRevision)return;$('institutionMap').replaceChildren(text('p','The map outline could not load. Use Connections or browse the entries below.','panel-note'));console.error(error);});
  }
  function renderTimeline(){
   const events=C.milestones(visible,{through:+$('directoryYear').value,type:$('directoryActivity').value}),years=[...new Set(events.map(e=>e.year))];
   if(chosenYear&&!years.includes(chosenYear))chosenYear=null;
   const svg=svgEl('svg',{viewBox:'0 0 1100 156',role:'group','aria-label':'Timeline of sourced institutional milestones'}),x=year=>35+(year-firstYear)/(lastYear-firstYear||1)*1030;
   svg.append(svgEl('line',{x1:35,y1:108,x2:1065,y2:108,class:'time-axis'}));
   const ticks=[firstYear,...Array.from({length:Math.ceil((lastYear-firstYear)/10)},(_,i)=>Math.ceil(firstYear/10)*10+i*10).filter(y=>y>firstYear&&y<lastYear-3),lastYear];
   ticks.forEach(year=>{svg.append(svgEl('line',{x1:x(year),y1:108,x2:x(year),y2:114,class:'time-axis'}),svgText(year,x(year),136,'time-label'));});
   let previousX=-100,row=0;
   years.forEach(year=>{
    const list=events.filter(e=>e.year===year);row=x(year)-previousX<35?(row+1)%3:0;previousX=x(year);const y=40+row*22;
    const g=svgEl('g',{class:'year-marker'+(chosenYear===year?' selected':''),role:'button',tabindex:0,'aria-label':`${year}: ${list.length} milestones`});
    const title=svgEl('title');title.textContent=`${year}: ${list.length} milestones\n`+list.slice(0,6).map(e=>e.title).join('\n')+(list.length>6?'\nSelect to see all.':'');g.append(title,svgEl('line',{x1:x(year),y1:y,x2:x(year),y2:108,class:'time-stem'}),svgEl('circle',{cx:x(year),cy:y,r:list.length>1?12:6}));if(list.length>1)g.append(svgText(list.length,x(year),y+4,'year-count'));
    const choose=()=>{chosenYear=year;showAllEvents=true;renderTimeline();};g.addEventListener('click',choose);g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();choose();}});svg.append(g);
   });
   $('directoryTimeline').replaceChildren(svg);
   if(matchMedia('(max-width:700px)').matches)$('directoryTimeline').scrollLeft=$('directoryTimeline').scrollWidth;
   const undated=visible.filter(e=>!(e.milestones||[]).length).length;
   $('timelineStatus').textContent=`${events.length} sourced milestone${events.length===1?'':'s'} through ${$('directoryYear').value} · ${undated} entries without a verified event date${chosenYear?' · showing '+chosenYear:''}`;
   $('clearMilestoneYear').hidden=!chosenYear;
   const selected=events.filter(e=>!chosenYear||e.year===chosenYear).slice().reverse(),shown=showAllEvents?selected:selected.slice(0,6),fragment=document.createDocumentFragment();
   for(const event of shown){const e=byId.get(event.entryId),card=text('article','','milestone-card');const top=text('div','','milestone-meta');top.append(text('b',event.year),text('span',({formation:'Formation / designation',education:'Education',funding:'Funding / renewal',infrastructure:'Infrastructure',policy:'Policy'})[event.type]||event.type));card.append(top,text('h3',event.title),link(e.acronym||e.name,C.entryHref(e,source,page),'milestone-entry'));if(event.note)card.append(text('p',event.note));card.append(link('Milestone source ↗',event.sourceUrl,'milestone-source'));fragment.append(card);}
   if(!shown.length)fragment.append(text('p','No documented milestones match these filters. Institution entries remain below.','panel-note'));
   $('milestoneCards').replaceChildren(fragment);$('moreMilestones').hidden=selected.length<=6;$('moreMilestones').textContent=showAllEvents?'Show fewer milestones':`Show all ${selected.length} milestones`;
  }
  function card(e){
   const el=text('article','','directory-card');el.id=e.id;el.tabIndex=-1;
   const top=text('div','','entry-top');top.append(text('span',e.roleLabels?.[page]||e.kind,'entry-kind'),link('↗',C.entryHref(e,source,page),'entry-permalink'));top.lastChild.setAttribute('aria-label',`Link to ${e.acronym||e.name}`);
   el.append(top,text('p',e.acronym||e.lead,'entry-acronym'),text('h3',e.name));
   if((e.pages||[]).length>1){const cross=text('p','','entry-crosslist');cross.append(document.createTextNode('Also in '));e.pages.filter(p=>p!==page).forEach(p=>cross.append(link(C.pages[p],C.entryHref(e,source,p))));el.append(cross);}
   const dl=text('dl','','entry-roles');[['Host / lead',e.lead],['Funding / support',e.funder]].forEach(([label,value])=>dl.append(text('dt',label),text('dd',value)));el.append(dl,text('p',e.focus,'entry-focus'));
   const relation=text('p','','entry-materials');relation.append(text('strong','Materials connection '),document.createTextNode(e.materials));el.append(relation);
   const topics=text('div','','entry-topics');e.topics.forEach(t=>topics.append(text('span',t)));el.append(topics);
   if(e.parentId){const parent=byId.get(e.parentId),p=text('p','','entry-parent');p.append(document.createTextNode('Program → '),link(parent.acronym||parent.name,C.entryHref(parent,source)));el.append(p);}
   const children=entries.filter(child=>child.parentId===e.id);if(children.length){const related=document.createElement('details');related.className='entry-related';related.append(text('summary',`Linked labs & centers (${children.length})`));const ul=document.createElement('ul');children.forEach(child=>{const li=document.createElement('li');li.append(link(`${child.acronym} · ${child.name}`,C.entryHref(child,source)));ul.append(li);});related.append(ul);el.append(related);}
   const evidence=document.createElement('details');evidence.className='entry-evidence';evidence.append(text('summary','Milestones, location & sources'),text('p',e.status,'entry-status'));
   for(const event of e.milestones||[]){const p=text('p','','entry-event');p.append(text('b',event.year+' · '),link(event.title,event.sourceUrl));evidence.append(p);}
   if(!(e.milestones||[]).length)evidence.append(text('p','No verified milestone date is assigned.'));
   if(e.locations?.length){const p=text('p','Host locations: ','entry-locations');e.locations.forEach((l,i)=>{if(i)p.append(document.createTextNode(' · '));p.append(link(l.label,l.sourceUrl));});evidence.append(p);}
   if(e.locationNote)evidence.append(text('p',e.locationNote));if(e.notes)evidence.append(text('p',e.notes));
   const ol=document.createElement('ol');e.sources.forEach(s=>{const li=document.createElement('li');li.append(link(s.title,s.url));if(s.note)li.append(text('small',s.note));ol.append(li);});evidence.append(ol,text('p',`Checked ${e.checkedDate}.`,'entry-checked'));
   const bottom=text('div','','entry-bottom');bottom.append(link('Official source ↗',e.sources[0].url),text('span',e.status,'status-short'));el.append(evidence,bottom);return el;
  }
  function render(updateURL=true){
   visible=C.filter(entries,{page,query:$('directoryQuery').value,group:$('directoryGroup').value});const fragment=document.createDocumentFragment();
   groups.forEach(g=>{const list=visible.filter(e=>C.groupOf(e,page)===g);if(!list.length)return;const section=text('section','','entry-group'),h=text('h3',g,'group-title');h.append(text('span',list.length));const grid=text('div','','entry-grid');list.forEach(e=>grid.append(card(e)));section.append(h,grid);fragment.append(section);});
   $('directoryEntries').replaceChildren(fragment);$('directoryEmpty').hidden=visible.length!==0;$('directoryStatus').textContent=`${visible.length} of ${total} entries${$('directoryQuery').value.trim()?` matching “${$('directoryQuery').value.trim()}”`:''}`;$('exportDirectory').disabled=!visible.length;
   if(updateURL){const u=new URL(location.href);u.searchParams.set('source',source);for(const[k,v]of[['q',$('directoryQuery').value.trim()],['group',$('directoryGroup').value]]){if(v&&v!=='all')u.searchParams.set(k,v);else u.searchParams.delete(k);}history.replaceState(null,'',u);}
   renderMap();renderTimeline();preserveSource();
  }
  function reset(){ $('directoryQuery').value='';$('directoryGroup').value='all';chosenYear=null;render(); }
  function showHash(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch(_){return;}const e=byId.get(id);if(!e||!C.inPage(e,page))return;if(!visible.some(item=>item.id===id))reset();const el=$(id);el.querySelector('.entry-evidence').open=true;el.focus({preventScroll:true});el.scrollIntoView({block:'start',behavior:'instant'});}
  if(page==='federal'){
   $('rosterSection').hidden=false;data.rosters.forEach(roster=>{const el=text('article','','roster-card'),h=text('div','','roster-heading');h.append(text('b',roster.count,'roster-number'),text('h3',roster.name));const details=document.createElement('details'),ul=document.createElement('ul');details.append(text('summary','View all centers'));roster.ids.forEach(id=>{const e=byId.get(id),li=document.createElement('li');li.append(link(`${e.acronym} · ${e.name}`,C.entryHref(e,source)));ul.append(li);});details.append(ul);el.append(h,text('p',roster.note),details,link('Official roster ↗',roster.source.url,'roster-source'));$('rosterGrid').append(el);});
  }
  $('directoryQuery').value=params.get('q')||'';$('directoryGroup').value=groups.includes(params.get('group'))?params.get('group'):'all';
  $('directoryFilters').addEventListener('submit',ev=>ev.preventDefault());$('directoryQuery').addEventListener('input',()=>{chosenYear=null;render();});$('directoryGroup').addEventListener('change',()=>{chosenYear=null;render();});
  for(const id of ['resetDirectory','emptyReset'])$(id).addEventListener('click',()=>{reset();$('directoryQuery').focus();});
  $('connectionsMode').addEventListener('click',()=>{mapMode='connections';renderMap();});$('locationsMode').addEventListener('click',()=>{mapMode='locations';renderMap();});
  $('directoryYear').addEventListener('input',()=>{$('directoryYearLabel').textContent=$('directoryYear').value;renderTimeline();});$('directoryActivity').addEventListener('change',()=>{chosenYear=null;renderTimeline();});
  $('resetDirectoryTime').addEventListener('click',()=>{$('directoryYear').value=lastYear;$('directoryYearLabel').textContent=lastYear;$('directoryActivity').value='all';chosenYear=null;showAllEvents=false;renderTimeline();});
  $('clearMilestoneYear').addEventListener('click',()=>{chosenYear=null;showAllEvents=false;renderTimeline();});$('moreMilestones').addEventListener('click',()=>{showAllEvents=!showAllEvents;renderTimeline();});
  $('exportDirectory').addEventListener('click',()=>{const blob=new Blob([C.csv(visible,page)],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=link('',url);a.download=`quantum-materials-${page}-${data.checkedDate}.csv`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  window.addEventListener('hashchange',showHash);render(false);showHash();
 }catch(error){console.error(error);$('directoryStatus').textContent='The directory could not load. Please reload the page.';const button=text('button','Reload directory');button.type='button';button.addEventListener('click',()=>location.reload());$('directoryEntries').append(button);}
})();
