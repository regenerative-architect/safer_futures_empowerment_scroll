window.NGSO_COLLAB = (() => {
  let chan=null, room=null, name=null, onMessage=null;
  function supported(){return "BroadcastChannel" in window}
  function join(roomName,displayName,handler){
    leave(); if(!supported())throw new Error("BroadcastChannel is not supported.");
    room=(roomName||"trusted-circle").trim().slice(0,60);name=(displayName||"participant").trim().slice(0,40);onMessage=handler;
    chan=new BroadcastChannel("ngso:"+room);
    chan.onmessage=e=>{if(onMessage)onMessage({...e.data,local:false})};
    sendSystem(`${name} joined this browser-local room.`);
    return {room,name};
  }
  function send(text){
    if(!chan)throw new Error("Join a room first.");
    const msg={type:"message",name,text:String(text).slice(0,500),at:new Date().toISOString()};
    chan.postMessage(msg); if(onMessage)onMessage({...msg,local:true});
  }
  function sendSystem(text){if(chan)chan.postMessage({type:"system",name:"system",text,at:new Date().toISOString()})}
  function leave(){if(chan){try{sendSystem(`${name||"participant"} left.`)}catch{};chan.close()}chan=null;room=null;name=null;onMessage=null}
  return {supported,join,send,leave,getState:()=>({connected:!!chan,room,name})};
})();