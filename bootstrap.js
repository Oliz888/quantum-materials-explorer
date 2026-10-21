/* Do not load datasets or initialize the explorer until the gate is unlocked. */
(async function() {
  await window.QMAuth.ready;
  function load(src) {
    return new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=src;script.onload=resolve;script.onerror=()=>reject(new Error(`Could not load ${src}`));
      document.head.appendChild(script);
    });
  }
  try {
    if(document.body.dataset.view==='physics-map') {
      await load('physics-map-readings.js?v=1');
      await load('physics-map-data.js?v=2');
      await load('physics-map.js?v=2');
      return;
    }
    if(document.body.dataset.view==='about') { await load('about.js?v=1'); return; }
    // A CDN failure still permits paper browsing and a visible graph error.
    await load('https://unpkg.com/vis-network/standalone/umd/vis-network.min.js').catch(error=>console.warn(error));
    await load('data.js?v=6');
    await load('graph-core.js?v=1');
    await load('explorer.js?v=2');
  } catch(error) {
    const message=document.createElement('p');message.className='load-error';message.setAttribute('role','alert');
    message.textContent='The explorer could not finish loading. Check your connection and reload this page.';
    document.body.appendChild(message);console.error(error);
  }
})();
