(function() {
  'use strict';
  const select=document.getElementById('dataSource');
  const valid=value=>value==='symposium'||value==='wos';
  function setSource(source) {
    select.value=source;
    document.getElementById('about-symposium').hidden=source!=='symposium';
    document.getElementById('about-wos').hidden=source!=='wos';
    try {localStorage.setItem('qm_source',source);} catch (_) {}
    const url=new URL(location.href);url.searchParams.set('source',source);history.replaceState(null,'',url);
    document.querySelectorAll('.site-nav a').forEach(a=>{const url=new URL(a.href);url.searchParams.set('source',source);a.href=url;});
  }
  let source=new URLSearchParams(location.search).get('source');
  if(!valid(source)) {try {source=localStorage.getItem('qm_source');} catch (_) {}}
  select.onchange=()=>setSource(select.value);
  setSource(valid(source)?source:'symposium');
})();
