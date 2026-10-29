/* Source-qualified directory relationships, cross-listing, milestones and export. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QMDirectory=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const pages={programs:'University & Programs',labs:'Labs & Institutes',federal:'National & Federal Initiatives'};
 const groupOrder=['Coordination','NSF','DOE','NIST & Commerce','Defense','DARPA','IARPA','NASA','University programs','University centers & research routes','Philanthropy & international networks','NSF institutes & foundries','DOE quantum centers','DOE Energy Frontier Research Centers','DOE nanoscale user facilities','NIST joint institutes','Defense laboratories','NASA research groups & facilities','University institutes & research themes','National laboratory research','Industry–university partnerships'];
 const normalize=v=>String(v||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const inPage=(e,page)=>(e.pages||[e.page]).includes(page);
 const groupOf=(e,page)=>e.viewGroups?.[page]||e.group;
 function filter(entries,{page,query='',group='all'}={}){
  const words=normalize(query).split(' ').filter(Boolean);
  return entries.filter(e=>{
   if(page&&!inPage(e,page))return false;
   if(group!=='all'&&groupOf(e,page)!==group)return false;
   const haystack=normalize([e.name,e.acronym,e.lead,e.funder,e.kind,e.group,e.country,e.focus,e.materials,e.notes,...e.topics].join(' '));
   return words.every(w=>haystack.includes(w)||haystack.replace(/ /g,'').includes(w));
  }).sort((a,b)=>groupOrder.indexOf(groupOf(a,page))-groupOrder.indexOf(groupOf(b,page))||a.name.localeCompare(b.name));
 }
 function entryHref(e,source,page=e.page){return `${inPage(e,page)?page:e.page}.html${source?`?source=${encodeURIComponent(source)}`:''}#${e.id}`;}
 function graph(entries){
  const nodes=[],edges=new Map(),byId=new Map(entries.map(e=>[e.id,e]));
  for(const page of ['federal','labs','programs'])for(const group of groupOrder){
   const ids=entries.filter(e=>inPage(e,page)&&groupOf(e,page)===group).map(e=>e.id);
   if(ids.length)nodes.push({id:page+':'+group,page,group,ids});
  }
  function edge(from,to,type,pair){if(from===to)return;const k=[from,to,type].join('|');if(!edges.has(k))edges.set(k,{from,to,type,pairs:new Set()});edges.get(k).pairs.add(pair);}
  for(const e of entries){
   const parent=byId.get(e.parentId);
   if(parent)edge(parent.page+':'+groupOf(parent,parent.page),e.page+':'+groupOf(e,e.page),'program',parent.id+'|'+e.id);
   if(e.page==='labs'&&inPage(e,'programs'))edge('labs:'+groupOf(e,'labs'),'programs:'+groupOf(e,'programs'),'crosslist',e.id);
  }
  const labs=entries.filter(e=>e.page==='labs'),programs=entries.filter(e=>e.page==='programs');
  for(const l of labs)for(const p of programs){
   if((l.hostIds||[]).some(h=>(p.hostIds||[]).includes(h)))edge('labs:'+groupOf(l,'labs'),'programs:'+groupOf(p,'programs'),'host',l.id+'|'+p.id);
  }
  return {nodes,edges:[...edges.values()].map(e=>({...e,count:e.pairs.size,pairs:[...e.pairs]}))};
 }
 function milestones(entries,{through=Infinity,type='all'}={}){
  const events=[];
  for(const entry of entries)for(const event of entry.milestones||[]){if(event.year<=through&&(type==='all'||type===event.type))events.push({...event,entryId:entry.id,entryName:entry.acronym||entry.name});}
  return events.sort((a,b)=>a.year-b.year||a.title.localeCompare(b.title));
 }
 function locations(entries){
  const points=new Map();
  for(const e of entries)for(const l of e.locations||[]){
   const key=normalize(l.label),point=points.get(key)||{...l,key,ids:[]};
   if(!point.ids.includes(e.id))point.ids.push(e.id);points.set(key,point);
  }
  return [...points.values()];
 }
 function csv(entries,page){
  const headings=['Name','Acronym','Home page','Also listed in','Group','Type','Host / lead','Funding / support','Focus','Materials connection','Status','Milestones','Locations','Notes','Topics','Sources','Checked'];
  const cell=v=>{let s=String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
  const rows=entries.map(e=>[e.name,e.acronym,pages[e.page],(e.pages||[e.page]).map(p=>pages[p]).join('; '),groupOf(e,page),e.kind,e.lead,e.funder,e.focus,e.materials,e.status,(e.milestones||[]).map(m=>`${m.year}: ${m.title} (${m.sourceUrl})`).join(' | '),(e.locations||[]).map(l=>`${l.label} (${l.sourceUrl}; approximate city)`).join('; '),e.notes,e.topics.join('; '),e.sources.map(s=>s.url).join(' | '),e.checkedDate]);
  return '\uFEFF'+[headings,...rows].map(r=>r.map(cell).join(',')).join('\r\n')+'\r\n';
 }
 return {pages,groupOrder,normalize,inPage,groupOf,filter,entryHref,graph,milestones,locations,csv};
});
