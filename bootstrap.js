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
    if(['physics-map','physics-map-v2'].includes(document.body.dataset.view)) {
      await load('physics-map-readings.js?v=1');
      await load('physics-map-data.js?v=2');
      if(document.body.dataset.view==='physics-map-v2') {
        await load('physics-map-physh.js?v=1');
        await load('physics-map-views.js?v=2');
        await load('physics-map-v2.js?v=1');
      } else await load('physics-map.js?v=4');
      return;
    }
    if(document.body.dataset.view==='institutional-atlas') {
      await load('institutional-atlas/data/bundle.js?v=1');
      await load('institutional-atlas/atlas-core.js?v=1');
      await load('institutional-atlas/atlas.js?v=1');
      return;
    }
    if(document.body.dataset.view==='institutions') {
      await load('directory-core.js?v=2');
      await load('directory.js?v=2');
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
