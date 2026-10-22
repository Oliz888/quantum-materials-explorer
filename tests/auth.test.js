const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const hash='14c28d58ec72d7ea13893b3007bcc01c7c69e8bdd98b89668a8e1c7a10351438';
function harness(initial={},storageFails=false) {
  const store=new Map(Object.entries(initial));
  const element=()=>({listeners:{},value:'',textContent:'',disabled:false,focus(){},remove(){this.removed=true;},addEventListener(name,fn){this.listeners[name]=fn;}});
  const elements=Object.fromEntries(['auth-pw','auth-err','auth-btn','auth-gate'].map(id=>[id,element()]));
  const form=element(),lockButton=element();let gateCount=0,reloads=0;
  const doc={documentElement:{dataset:{auth:'locked'}},
    getElementById:id=>elements[id],querySelectorAll:()=>[lockButton],querySelector:()=>null,
    createElement:()=>{const gate=elements['auth-gate'];gate.querySelector=()=>form;return gate;},
    body:{appendChild(){gateCount++;}}};
  const sessionStorage={getItem(k){if(storageFails)throw Error('blocked');return store.get(k)??null;},setItem(k,v){if(storageFails)throw Error('blocked');store.set(k,v);},removeItem(k){if(storageFails)throw Error('blocked');store.delete(k);}};
  // Exercise acceptance/rejection without putting the real project password in tests.
  const crypto={subtle:{digest:async(_algorithm,bytes)=>Buffer.from(new TextDecoder().decode(bytes)==='valid-test-input'?hash:'00'.repeat(32),'hex')}};
  const context={document:doc,sessionStorage,crypto,TextEncoder,Uint8Array,Date,Promise,window:{},location:{reload(){reloads++;}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'auth.js'),'utf8'),context);
  return {context,store,elements,form,lockButton,get gateCount(){return gateCount;},get reloads(){return reloads;}};
}
test('fresh visit and legacy flag stay locked until the correct password',async()=>{
  const h=harness({qm_auth:'1'});let ready=false;h.context.window.QMAuth.ready.then(()=>ready=true);
  await Promise.resolve();assert.equal(ready,false);assert.equal(h.gateCount,1);assert.equal(h.context.document.documentElement.dataset.auth,'locked');
  h.elements['auth-pw'].value='wrong';await h.form.listeners.submit({preventDefault(){}});
  assert.equal(ready,false);assert.match(h.elements['auth-err'].textContent,/Incorrect/);assert.equal(h.store.has('qm_auth_v2'),false);
  h.elements['auth-pw'].value='valid-test-input';await h.form.listeners.submit({preventDefault(){}});await Promise.resolve();
  assert.equal(ready,true);assert.equal(h.context.document.documentElement.dataset.auth,'unlocked');assert.equal(h.elements['auth-pw'].value,'');
  assert.equal(JSON.parse(h.store.get('qm_auth_v2')).version,2);
});
test('valid tab session persists, and Lock site clears it',async()=>{
  const h=harness({qm_auth_v2:JSON.stringify({version:2,expires:Date.now()+60000})});
  await h.context.window.QMAuth.ready;assert.equal(h.gateCount,0);
  h.lockButton.listeners.click();assert.equal(h.store.has('qm_auth_v2'),false);assert.equal(h.reloads,1);
});
test('expired and malformed sessions fail closed',()=>{
  for(const token of ['garbage',JSON.stringify({version:2,expires:Date.now()-1}),JSON.stringify({version:1,expires:Date.now()+1000})]){
    const h=harness({qm_auth_v2:token});assert.equal(h.gateCount,1);assert.equal(h.context.document.documentElement.dataset.auth,'locked');
  }
});
test('blocked storage still permits explicit login in the current page',async()=>{
  const h=harness({},true);h.elements['auth-pw'].value='valid-test-input';
  await h.form.listeners.submit({preventDefault(){}});await h.context.window.QMAuth.ready;
  assert.equal(h.context.document.documentElement.dataset.auth,'unlocked');
});
test('bootstrap waits for unlock; About and Physics Map do not load publication datasets',async()=>{
  for(const view of ['materials','about','physics-map']){
    let resolve;const ready=new Promise(r=>resolve=r);const loaded=[];
    const document={body:{dataset:{view}},createElement(){return {};},head:{appendChild(s){loaded.push(s.src);s.onload();}}};
    const task=vm.runInNewContext(fs.readFileSync(path.join(root,'bootstrap.js'),'utf8'),{window:{QMAuth:{ready}},document,console});
    await Promise.resolve();assert.equal(loaded.length,0);resolve();await task;
    if(view==='about')assert.deepEqual(loaded,['about.js?v=1']);
    else if(view==='physics-map')assert.deepEqual(loaded,['physics-map-readings.js?v=1','physics-map-data.js?v=2','physics-map-physh.js?v=1','physics-map-views.js?v=1','physics-map.js?v=3']);
    else {assert.ok(loaded.some(x=>x.startsWith('data.js')));assert.ok(loaded.at(-1).startsWith('explorer.js'));}
  }
});
test('all routes start locked, share navigation and have no eager dataset scripts',()=>{
  for(const file of ['index.html','collaboration.html','techniques.html','phenomena.html','about.html','physics-map.html']){
    const html=fs.readFileSync(path.join(root,file),'utf8');
    assert.match(html,/<html[^>]+data-auth="locked"/);assert.match(html,/auth\.js\?v=2/);
    assert.match(html,/href="about\.html"/);assert.match(html,/data-lock-site/);
    assert.match(html,/href="physics-map\.html"/);
    assert.doesNotMatch(html,/<script src="(?:data\.js|explorer\.js|graph-core\.js)/);
    assert.doesNotMatch(html,/Materials (?:Discovery )?Hypergraph/);
  }
});
