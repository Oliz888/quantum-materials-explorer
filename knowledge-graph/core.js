(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NatureKnowledgeCore=api;})(typeof window==='undefined'?globalThis:window,function(){
  const overview=['physics','materials-science','chemistry','nanoscience-and-technology','condensed-matter-physics','materials-chemistry','materials-for-devices','nanoscale-materials','nanoscale-devices','electronic-properties-and-materials','electronic-devices','ferroelectrics-and-multiferroics','superconducting-properties-and-materials','topological-matter','graphene','synthesis-of-graphene'];
  function typeGroup(type){return /review/i.test(type)?'review':/highlight|briefing|news|comment|editorial|perspective|correction/i.test(type)?'other':/research|article|letter|protocol/i.test(type)?'research':'other';}
  function papersFor(data,id,{query='',type='all',year='all'}={}){
    return data.papers.filter(p=>p.channels.includes(id)&&(type==='all'||typeGroup(p.type)===type)&&(year==='all'||p.year===Number(year))&&p.title.toLowerCase().includes(query.toLowerCase().trim())).sort((a,b)=>b.date.localeCompare(a.date)||a.title.localeCompare(b.title));
  }
  function neighbors(structure,id){return structure.edges.filter(e=>e.source===id||e.target===id);}
  function graphFor(structure,mode,selected,facet='all'){
    const nearby=new Set([selected,...neighbors(structure,selected).flatMap(e=>[e.source,e.target])]);
    const nodes=structure.nodes.filter(n=>n.system!=='nature-citation-topic'&&(mode==='all'||(mode==='neighborhood'?nearby.has(n.id):overview.includes(n.id))));
    const ids=new Set(nodes.map(n=>n.id));
    return {nodes:nodes.map(n=>({...n,dimmed:facet!=='all'&&!n.facets.includes(facet)})),edges:structure.edges.filter(e=>ids.has(e.source)&&ids.has(e.target))};
  }
  function layout(nodes,edges){
    const ranks=new Map(nodes.map(n=>[n.id,0]));
    // Nature's selected broader/narrower graph is a DAG; cap passes defensively.
    for(let k=0;k<nodes.length;k++){let changed=false;for(const e of edges){if(ranks.get(e.target)<=ranks.get(e.source)){ranks.set(e.target,ranks.get(e.source)+1);changed=true;}}if(!changed)break;}
    const groups=[];for(const n of nodes){const rank=Math.min(ranks.get(n.id),nodes.length-1);(groups[rank]||=[]).push(n);}
    const order=new Map(nodes.map((n,i)=>[n.id,i]));
    for(let pass=0;pass<4;pass++){for(let rank=1;rank<groups.length;rank++){if(!groups[rank])continue;const score=n=>{const parents=edges.filter(e=>e.target===n.id).map(e=>order.get(e.source));return parents.length?parents.reduce((a,b)=>a+b,0)/parents.length:order.get(n.id);};groups[rank].sort((a,b)=>score(a)-score(b));groups[rank].forEach((n,i)=>order.set(n.id,i));}}
    const maxRows=Math.max(1,...groups.map(g=>g?.length||0)),height=Math.max(440,maxRows*104+100),width=Math.max(900,groups.length*260+40);
    const positions={};groups.forEach((g,col)=>g?.forEach((n,i)=>{positions[n.id]={x:140+col*260,y:(i+1)*height/(g.length+1)};}));
    return {positions,width,height};
  }
  function history(channel,mode){
    if(!channel?.annualSeries?.length)return null;
    const rows=channel.annualSeries.slice().sort((a,b)=>a.year-b.year);
    const result=[];let total=0,known=true;
    for(let year=rows[0].year;year<=rows.at(-1).year;year++){
      const row=rows.find(r=>r.year===year);
      const count=row?.complete===true&&Number.isInteger(row.count)&&row.count>=0?row.count:null;
      if(count===null)known=false;else total+=count;
      result.push({year,count:mode==='cumulative'?(known?total:null):count,partialYear:row?.partialYear||false,sourceUrl:row?.sourceUrl||channel.sourceUrl});
    }
    return result;
  }
  function previewDates(papers){const counts=new Map();for(const p of papers)counts.set(p.year,(counts.get(p.year)||0)+1);return [...counts].sort((a,b)=>a[0]-b[0]).map(([year,count])=>({year,count}));}
  return {overview,typeGroup,papersFor,neighbors,graphFor,layout,history,previewDates};
});
