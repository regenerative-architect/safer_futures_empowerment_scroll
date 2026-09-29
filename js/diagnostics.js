window.NGSO_DIAGNOSTICS = (() => {
  let last=null;
  const yes=v=>!!v;
  async function basic(){
    let estimate=null;
    try{if(navigator.storage?.estimate) estimate=await navigator.storage.estimate()}catch{}
    const report={
      at:new Date().toISOString(),
      url:{protocol:location.protocol,secureContext:window.isSecureContext},
      network:{online:navigator.onLine},
      browser:{
        serviceWorker:yes("serviceWorker" in navigator),
        indexedDB:yes("indexedDB" in window),
        localStorage:(()=>{try{const k="__ngso_test";localStorage.setItem(k,"1");localStorage.removeItem(k);return true}catch{return false}})(),
        broadcastChannel:yes("BroadcastChannel" in window),
        webCrypto:yes(window.crypto?.subtle),
        clipboard:yes(navigator.clipboard),
        webGPU:yes(navigator.gpu),
        deviceMemory:navigator.deviceMemory||null,
        hardwareConcurrency:navigator.hardwareConcurrency||null,
        reducedMotion:matchMedia?.("(prefers-reduced-motion: reduce)").matches||false
      },
      storage:estimate?{quota:estimate.quota||null,usage:estimate.usage||null}:null,
      pwa:{displayStandalone:matchMedia?.("(display-mode: standalone)").matches||false},
      deepGPU:null
    };
    last=report;return report;
  }
  async function deepGPU(){
    if(!last) await basic();
    const out={attemptedAt:new Date().toISOString(),supported:!!navigator.gpu};
    if(!navigator.gpu){out.error={name:"Unsupported",message:"navigator.gpu is unavailable"};last.deepGPU=out;return last}
    try{
      const adapter=await navigator.gpu.requestAdapter();
      if(!adapter) throw new Error("No WebGPU adapter returned.");
      out.adapter={features:[...adapter.features],limits:{
        maxBufferSize:Number(adapter.limits?.maxBufferSize||0),
        maxStorageBufferBindingSize:Number(adapter.limits?.maxStorageBufferBindingSize||0)
      }};
      const device=await adapter.requestDevice();
      out.device="created";
      if(device?.destroy) device.destroy();
    }catch(e){
      out.error=normalizeError(e);
      const m=(out.error.message||"").toLowerCase();
      if(m.includes("device_removed")||m.includes("device removed")||m.includes("dxgi_error_device_removed")){
        out.recovery=["Reload the page after closing other GPU-heavy tabs/apps.","Update the browser and graphics driver.","Avoid unloading/reloading large GPU models repeatedly in one session.","Use the deterministic planner; AI is optional in this app."];
      }
    }
    last.deepGPU=out;return last;
  }
  function normalizeError(e){
    if(!e)return {name:"UnknownError",message:"Unknown failure"};
    if(typeof e==="string")return {name:"Error",message:e};
    return {name:e.name||"Error",message:e.message||String(e),stack:e.stack||null,code:e.code??null};
  }
  function aiTier(report){
    const b=report?.browser||{};
    if(!b.webGPU)return "No WebGPU detected: keep AI disabled and use the deterministic planner. If adding remote AI later, require explicit consent before sending any text.";
    const mem=Number(b.deviceMemory||0), cores=Number(b.hardwareConcurrency||0);
    if(mem>=16&&cores>=8)return "Hardware signals suggest a higher local-AI tier may be possible, but model compatibility must still be measured at runtime. Prefer a small model first, then scale up.";
    if(mem>=8&&cores>=4)return "Hardware signals suggest a small-to-medium local model tier may be practical. Start small and monitor memory/device-loss diagnostics.";
    return "Treat this device as a small-model or deterministic-first target. Do not assume a large local model will load reliably.";
  }
  return {basic,deepGPU,aiTier,getLast:()=>last};
})();