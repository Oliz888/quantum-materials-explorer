/* Shared filtering and export for the three institutional directory pages. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.QMDirectory=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const pages={programs:'Programs & Education',labs:'Labs & Institutes',federal:'National & Federal Initiatives'};
  const groupOrder=['Coordination','NSF','DOE','NIST & Commerce','Defense','DARPA','IARPA','NASA','University programs','Philanthropy & international networks','NSF institutes & foundries','DOE quantum centers','DOE Energy Frontier Research Centers','DOE nanoscale user facilities','NIST joint institutes','Defense & space laboratories','University institutes & research themes','National laboratory research','Industry–university partnerships'];
  const normalize=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  function filter(entries,{page,query='',group='all'}={}){
    const words=normalize(query).split(' ').filter(Boolean);
    return entries.filter(e=>{
      if(page&&e.page!==page)return false;
      if(group!=='all'&&e.group!==group)return false;
      const haystack=normalize([e.name,e.acronym,e.lead,e.funder,e.kind,e.group,e.country,e.focus,e.materials,e.notes,...e.topics].join(' '));
      return words.every(word=>haystack.includes(word)||haystack.replace(/ /g,'').includes(word));
    }).sort((a,b)=>groupOrder.indexOf(a.group)-groupOrder.indexOf(b.group)||a.name.localeCompare(b.name));
  }
  function entryHref(entry,source){return `${entry.page}.html${source?`?source=${encodeURIComponent(source)}`:''}#${entry.id}`;}
  function csv(entries){
    const headings=['Name','Acronym','Page','Group','Type','Host / lead','Funder / support','Focus','Materials connection','Status','Milestone year','Notes','Topics','Sources','Checked'];
    // Neutralize formula-leading text in spreadsheet exports, including future edits.
    const cell=value=>{let s=String(value??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
    const rows=entries.map(e=>[e.name,e.acronym,pages[e.page],e.group,e.kind,e.lead,e.funder,e.focus,e.materials,e.status,e.startYear,e.notes,e.topics.join('; '),e.sources.map(s=>s.url).join(' | '),e.checkedDate]);
    return '\uFEFF'+[headings,...rows].map(row=>row.map(cell).join(',')).join('\r\n')+'\r\n';
  }
  return {pages,groupOrder,normalize,filter,entryHref,csv};
});
