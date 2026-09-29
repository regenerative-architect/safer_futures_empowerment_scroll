window.NGSO_STORAGE = (() => {
  const KEY="ngso_state_v1", DB="ngso-db", STORE="state", ID="workspace";
  const defaults=()=>({schemaVersion:1,progress:{xp:0,completed:[],lastAction:null},plans:[],reflections:[],resources:[],preferences:{theme:"dark",motion:"auto",skipSplash:false},extensions:{}});
  let cache=defaults(), db=null, backend="memory";

  function mergeState(raw){
    const base=defaults();
    if(!raw||typeof raw!=="object") return base;
    const out={...base,...raw};
    out.progress={...base.progress,...(raw.progress||{})};
    out.preferences={...base.preferences,...(raw.preferences||{})};
    for(const k of ["plans","reflections","resources"]) if(!Array.isArray(out[k])) out[k]=[];
    if(!Array.isArray(out.progress.completed)) out.progress.completed=[];
    out.schemaVersion=1;
    return out;
  }
  function openDB(){
    return new Promise((resolve,reject)=>{
      if(!("indexedDB" in window)) return reject(new Error("IndexedDB unavailable"));
      const req=indexedDB.open(DB,1);
      req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE)};
      req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error||new Error("IndexedDB open failed"));
    });
  }
  async function init(){
    try{
      db=await openDB(); backend="indexedDB";
      const tx=db.transaction(STORE,"readonly"), req=tx.objectStore(STORE).get(ID);
      const raw=await new Promise((res,rej)=>{req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error)});
      if(raw) cache=mergeState(raw); else await save(cache);
    }catch(e){
      try{const raw=localStorage.getItem(KEY); if(raw) cache=mergeState(JSON.parse(raw)); backend="localStorage"}catch(_){}
    }
    return cache;
  }
  async function save(next){
    cache=mergeState(next||cache);
    if(backend==="indexedDB"&&db){
      try{
        const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put(cache,ID);
        await new Promise((res,rej)=>{tx.oncomplete=res;tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error)});
        return cache;
      }catch(e){backend="localStorage"}
    }
    try{localStorage.setItem(KEY,JSON.stringify(cache));backend="localStorage"}catch(e){backend="memory"}
    return cache;
  }
  function get(){return JSON.parse(JSON.stringify(cache))}
  async function patch(mutator){const draft=get();mutator(draft);return save(draft)}
  function validateImport(raw){
    if(!raw||typeof raw!=="object") throw new Error("Backup must be a JSON object.");
    if(raw.schemaVersion!==1) throw new Error("Unsupported schemaVersion. This build supports version 1.");
    const known=["schemaVersion","progress","plans","reflections","resources","preferences","extensions","exportedAt","app"];
    const unknown={}; for(const [k,v] of Object.entries(raw)) if(!known.includes(k)) unknown[k]=v;
    const clean=mergeState(raw); clean.extensions={...(clean.extensions||{}),...unknown}; return clean;
  }
  async function importState(raw){const clean=validateImport(raw);await save(clean);return clean}
  function exportState(){return {...get(),app:"Next-Gen Safeguarding & Empowerment OS",exportedAt:new Date().toISOString()}}
  async function reset(keys){
    return patch(s=>{
      for(const k of keys){
        if(k==="progress")s.progress=defaults().progress;
        if(k==="plans")s.plans=[];
        if(k==="reflections")s.reflections=[];
        if(k==="resources")s.resources=[];
        if(k==="preferences")s.preferences=defaults().preferences;
      }
    })
  }
  function info(){return {backend,schemaVersion:cache.schemaVersion,counts:{plans:cache.plans.length,reflections:cache.reflections.length,resources:cache.resources.length,completed:cache.progress.completed.length},bytes:new Blob([JSON.stringify(cache)]).size}}
  return {init,get,save,patch,importState,exportState,reset,info,defaults};
})();