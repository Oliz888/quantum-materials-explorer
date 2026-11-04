/* Independent V2 loader; the original snapshot and bootstrap stay unchanged. */
(async function(){
  await window.QMAuth.ready;
  const load=src=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>reject(Error('Could not load '+src));document.head.appendChild(script);});
  try{
    const [structure,snapshot]=await Promise.all(['knowledge-graph/data/structure.json','knowledge-graph-v2/corpus.json'].map(async url=>{const response=await fetch(url+'?v=1');if(!response.ok)throw Error('Could not load '+url);return response.json();}));
    window.NatureKnowledgeData={structure,snapshot};
    await load('knowledge-graph-v2/core.js?v=1');await load('knowledge-graph-v2/graph.js?v=1');
  }
  catch(error){const p=document.createElement('p');p.className='load-error';p.setAttribute('role','alert');p.textContent='The paper collection could not finish loading. Please reload the page.';document.body.appendChild(p);console.error(error);}
})();
