(() => {
  const D=window.NGSO_DATA,S=window.NGSO_STORAGE,P=window.NGSO_PLANNER,Diag=window.NGSO_DIAGNOSTICS,C=window.NGSO_COLLAB;
  let state, currentPlan=null, currentDomain=null, toastTimer=null;

  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
  const dl=(name,text,type="application/json")=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
  function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}

  function initSplash(){
    const splash=$("#splash"),bar=$("#splash-progress"),status=$("#splash-status"),enter=$("#enter-app"),skip=$("#skip-splash");
    let done=false,p=10,t=setInterval(()=>{p=Math.min(90,p+10);bar.style.width=p+"%";status.textContent=["Preparing local workspace…","Loading action domains…","Checking storage…","Building routes…","Preparing deterministic planner…","Ready."][Math.min(5,Math.floor(p/18))]},180);
    const close=()=>{if(done)return;done=true;clearInterval(t);bar.style.width="100%";if(skip.checked){S.patch(s=>s.preferences.skipSplash=true)}splash.classList.add("hidden");$("#workspace").focus()};
    enter.addEventListener("click",close);setTimeout(close,6500);
    if(state?.preferences?.skipSplash)splash.classList.add("hidden");
  }

  function buildNav(){
    const links=D.routes.map(([id,label])=>`<a href="#${id}" data-nav="${id}">${esc(label)}</a>`).join("");
    $("#side-nav").innerHTML=links;$("#top-nav").innerHTML=D.routes.slice(0,5).map(([id,label])=>`<a href="#${id}" data-nav="${id}">${esc(label)}</a>`).join("");
  }
  function route(){
    const raw=(location.hash||"#overview").slice(1), id=raw.startsWith("domain/")?"domain-detail":raw;
    $$(".route").forEach(r=>r.classList.toggle("active",r.dataset.route===id));
    $$("[data-nav]").forEach(a=>a.classList.toggle("active",a.dataset.nav===id|| (id==="domain-detail"&&a.dataset.nav==="domains")));
    if(raw.startsWith("domain/")){const d=D.domains.find(x=>x.id===raw.split("/")[1]);if(d)renderDomain(d)}
    $("#breadcrumbs").textContent=id==="domain-detail"&&currentDomain?`Home / Domains / ${currentDomain.title}`:`Home / ${D.routes.find(x=>x[0]===id)?.[1]||"Domain"}`;
    window.scrollTo({top:0,behavior:document.body.classList.contains("reduce-motion")?"auto":"smooth"});
    $("#side").classList.remove("open");$("#drawer-toggle").setAttribute("aria-expanded","false");
  }

  function renderOverview(){
    $("#overview-stats").innerHTML=[
      [D.domains.length,"challenge domains"],["0","accounts required"],["1","deterministic planner"],["100%","core tools AI-optional"]
    ].map(x=>`<div class="stat"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join("");
  }

  function renderDomains(){
    const q=($("#domain-search").value||"").toLowerCase(),type=$("#domain-filter").value;
    const list=D.domains.filter(d=>(type==="all"||d.type===type)&&(!q||[d.title,d.summary,...d.tags].join(" ").toLowerCase().includes(q)));
    $("#domain-count").textContent=list.length;
    $("#domain-grid").innerHTML=list.map(d=>`<article class="domain-card">
      <div class="domain-icon" aria-hidden="true">${d.icon}</div>
      <div><p class="eyebrow">${esc(d.type)}</p><h2>${esc(d.title)}</h2><p>${esc(d.summary)}</p></div>
      <div class="tag-row">${d.tags.slice(0,6).map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>
      <a class="secondary button-link" href="#domain/${d.id}">Open tools →</a>
    </article>`).join("")||`<div class="panel">No matching domains.</div>`;
  }

  function renderDomain(d){
    currentDomain=d;
    $("#domain-detail-content").innerHTML=`<div class="page-head"><div><p class="eyebrow">${esc(d.type)} domain</p><h1>${d.icon} ${esc(d.title)}</h1><p class="lead">${esc(d.summary)}</p></div><a class="secondary button-link" href="#domains">← All domains</a></div>
      <div class="grid two">
        <article class="panel"><h2>Why this matters</h2><p>${esc(d.why)}</p><h3>Protective factors</h3><div class="tag-row">${d.protective.map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</div></article>
        <article class="panel"><h2>Watch for inversion</h2><ul>${d.pitfalls.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></article>
      </div>
      <article class="panel"><h2>Action ladder</h2><div class="action-ladder">${d.ladder.map(x=>`<div class="action-step"><p>${esc(x)}</p></div>`).join("")}</div></article>
      <article class="panel"><h2>Interactive tools</h2><div id="domain-tools">${d.tools.map(t=>toolHTML(t,d)).join("")}</div></article>
      <article class="panel"><h2>Suggested quests</h2><div class="quest-board">${d.quests.map((q,i)=>`<div class="quest"><span>${i+1}</span><div>${esc(q)}</div><button class="secondary complete-domain-quest" data-q="${esc(d.id+"::"+q)}">Log +10 XP</button></div>`).join("")}</div></article>`;
    bindDomainTools(d);
  }

  function toolHTML(t,d){
    const base=(title,body)=>`<div class="tool-card" data-tool="${t}"><h3>${title}</h3>${body}<div class="tool-output" hidden></div></div>`;
    if(t==="checkin")return base("60-second check-in",`<div class="grid two compact-grid"><label>Distress 0–10<input type="range" min="0" max="10" value="5" data-f="distress"></label><label>Energy 0–10<input type="range" min="0" max="10" value="5" data-f="energy"></label><label>Sleep last night<input data-f="sleep" placeholder="hours / quality"></label><label>Immediate need<select data-f="need"><option>quiet</option><option>movement</option><option>food/water</option><option>connection</option><option>task clarity</option><option>professional help</option></select></label></div><button class="primary run-tool">Reflect</button>`);
    if(t==="supportmap")return base("Support map",`<label>Person who can listen<input data-f="listen"></label><label>Person who can act if safety is at risk<input data-f="act"></label><label>School/community/professional contact<input data-f="formal"></label><button class="primary run-tool">Build map</button>`);
    if(t==="privacyaudit")return base("Privacy audit",`<div class="check-grid">${["Recovery email secured","Unique passwords/passkeys","MFA enabled","Public profile reviewed","Location sharing reviewed","App permissions reviewed","Backup codes stored safely","Reporting/recovery path known"].map(x=>`<label class="checkline"><input type="checkbox" data-f="item" value="${esc(x)}"> ${esc(x)}</label>`).join("")}</div><button class="primary run-tool">Score readiness</button>`);
    if(t==="sharecheck")return base("Before-you-share check",`<label>What are you about to share?<textarea data-f="text" rows="2"></textarea></label><div class="check-grid">${["Contains precise location","Shows school/work schedule","Includes someone else without consent","Could reveal a password/code/document","Posted while angry/upset"].map(x=>`<label class="checkline"><input type="checkbox" data-f="risk" value="${esc(x)}"> ${esc(x)}</label>`).join("")}</div><button class="primary run-tool">Check</button>`);
    if(t==="projectbuilder")return base("Local stewardship project builder",`<label>Place<input data-f="place" placeholder="school courtyard, block, park…"></label><label>Problem observed<input data-f="problem"></label><label>Small reversible action<input data-f="action"></label><label>Permission / maintenance owner<input data-f="owner"></label><button class="primary run-tool">Build project brief</button>`);
    if(t==="impactlog")return base("Before/after impact log",`<label>Indicator<input data-f="indicator" placeholder="litter bags removed, plants surviving, participants…"></label><label>Before<input data-f="before"></label><label>After<input data-f="after"></label><label>What else changed?<input data-f="side"></label><button class="primary run-tool">Create learning note</button>`);
    if(t==="budget")return base("Simple monthly cash-flow calculator",`<div class="grid two compact-grid"><label>Income<input type="number" min="0" step="0.01" data-f="income"></label><label>Needs<input type="number" min="0" step="0.01" data-f="needs"></label><label>Flexible spending<input type="number" min="0" step="0.01" data-f="wants"></label><label>Saving / debt goals<input type="number" min="0" step="0.01" data-f="save"></label></div><button class="primary run-tool">Calculate</button>`);
    if(t==="goalcalc")return base("Savings-goal calculator",`<div class="grid two compact-grid"><label>Goal amount<input type="number" min="0" step="0.01" data-f="goal"></label><label>Already saved<input type="number" min="0" step="0.01" data-f="current"></label><label>Months<input type="number" min="1" max="120" value="6" data-f="months"></label></div><button class="primary run-tool">Calculate pace</button>`);
    if(t==="skillsprint")return base("Skill sprint generator",`<label>Interest<select data-f="interest"><option>technology</option><option>arts/media</option><option>health/helping</option><option>trades/making</option><option>business</option><option>science/environment</option></select></label><label>Hours available<select data-f="hours"><option>2</option><option>5</option><option>10</option></select></label><button class="primary run-tool">Generate sprint</button>`);
    if(t==="portfolio")return base("Portfolio evidence card",`<label>Project / task<input data-f="project"></label><label>What you did<textarea data-f="did" rows="2"></textarea></label><label>Evidence link / file name<input data-f="evidence"></label><label>Skill demonstrated<input data-f="skill"></label><button class="primary run-tool">Create card</button>`);
    if(t==="belongingmap")return base("Belonging map",`<label>People I feel safest with<input data-f="people"></label><label>Places/groups I can return to<input data-f="places"></label><label>One new structured group to try<input data-f="new"></label><button class="primary run-tool">Map</button>`);
    if(t==="bystander")return base("Bystander option picker",`<label>Situation intensity<select data-f="level"><option value="low">uncomfortable / exclusion</option><option value="medium">harassment / escalating conflict</option><option value="high">threat / violence / immediate danger</option></select></label><button class="primary run-tool">Show safer options</button>`);
    if(t==="pauseplan")return base("Pressure pause plan",`<label>Situation / trigger<input data-f="trigger"></label><label>Exit line<input data-f="line" placeholder="No thanks — I’m heading out."></label><label>Person to contact<input data-f="contact"></label><label>Safe way home / place to go<input data-f="exit"></label><button class="primary run-tool">Build plan</button>`);
    if(t==="habitmap")return base("Habit pattern map",`<label>When does the urge/behavior happen?<input data-f="when"></label><label>What feeling/problem comes before it?<input data-f="before"></label><label>What need might another activity meet?<input data-f="alt"></label><button class="primary run-tool">Map pattern</button>`);
    if(t==="sourcecheck")return base("Source triangle",`<label>Claim<textarea data-f="claim" rows="2"></textarea></label><label>Primary / official source<input data-f="primary"></label><label>Independent source<input data-f="independent"></label><label>Affected-community perspective<input data-f="affected"></label><label>What would change your view?<input data-f="falsify"></label><button class="primary run-tool">Build evidence note</button>`);
    if(t==="issuemap")return base("Neutral issue map",`<label>Observable problem<input data-f="problem"></label><label>Factual questions<input data-f="facts"></label><label>Values/tradeoffs<input data-f="values"></label><label>Responsible body/process<input data-f="body"></label><button class="primary run-tool">Map issue</button>`);
    if(t==="creativesprint")return base("Creative sprint",`<label>Medium<select data-f="medium"><option>writing</option><option>drawing</option><option>music</option><option>photo/video</option><option>design</option><option>making</option></select></label><label>Minutes<select data-f="minutes"><option>10</option><option>20</option><option>30</option></select></label><label>Theme/input<input data-f="theme" placeholder="rain, pressure, belonging, future…"></label><button class="primary run-tool">Generate constraint</button>`);
    if(t==="sharingboundary")return base("Sharing boundary check",`<div class="check-grid">${["I am okay if this is copied","No precise location is visible","Other people consent to being included","I removed private documents/codes","I would still share this tomorrow"].map(x=>`<label class="checkline"><input type="checkbox" data-f="item" value="${esc(x)}"> ${esc(x)}</label>`).join("")}</div><button class="primary run-tool">Check boundary</button>`);
    if(t==="systemsmap")return base("Systems map starter",`<label>Problem<input data-f="problem"></label><label>Likely causes (comma-separated)<input data-f="causes"></label><label>Stakeholders/assets<input data-f="stakeholders"></label><label>Constraint<input data-f="constraint"></label><button class="primary run-tool">Create map</button>`);
    if(t==="experiment")return base("Safe experiment canvas",`<label>Hypothesis<input data-f="hypothesis"></label><label>Smallest test<input data-f="test"></label><label>Success signal<input data-f="signal"></label><label>Stop condition<input data-f="stop"></label><button class="primary run-tool">Create experiment card</button>`);
    return base("Tool",`<p>Tool unavailable.</p>`);
  }

  function vals(card){
    const out={};card.querySelectorAll("[data-f]").forEach(el=>{
      if(el.type==="checkbox"){if(!out[el.dataset.f])out[el.dataset.f]=[];if(el.checked)out[el.dataset.f].push(el.value||true)}
      else out[el.dataset.f]=el.value;
    });return out;
  }
  function bindDomainTools(d){
    $$(".run-tool").forEach(btn=>btn.onclick=()=>{const card=btn.closest(".tool-card"),t=card.dataset.tool,v=vals(card),o=card.querySelector(".tool-output");o.hidden=false;o.innerHTML=runTool(t,v);});
    $$(".complete-domain-quest").forEach(btn=>btn.onclick=async()=>{const q=btn.dataset.q;await logQuest(q,10);btn.disabled=true;btn.textContent="Logged ✓"});
  }
  function runTool(t,v){
    const e=x=>esc(x||"—");
    if(t==="checkin"){const d=Number(v.distress),en=Number(v.energy);const next=d>=8?"High distress: prioritize immediate support, safety and reducing demands.":d>=5?"Moderate load: choose one regulation action and one small task.":"Lower load: consider a small proactive step while capacity is available.";return `<strong>Snapshot:</strong> distress ${d}/10 · energy ${en}/10 · sleep ${e(v.sleep)} · need ${e(v.need)}.<br>${next}<br><small>This is reflection, not diagnosis.</small>`}
    if(t==="supportmap")return `Listen: <strong>${e(v.listen)}</strong><br>Act if safety is at risk: <strong>${e(v.act)}</strong><br>Formal support: <strong>${e(v.formal)}</strong>`;
    if(t==="privacyaudit"){const n=(v.item||[]).length;return `<strong>${n}/8 checks complete.</strong> Prioritize securing account recovery and MFA before cosmetic privacy settings.`}
    if(t==="sharecheck"){const r=v.risk||[];return r.length?`Pause. Flags: ${r.map(e).join("; ")}. Remove or reduce those risks before sharing.`:`No listed red flags selected. Still ask: who can see it, how long can it persist, and would you be comfortable losing control of the copy?`}
    if(t==="projectbuilder")return `<strong>Place:</strong> ${e(v.place)}<br><strong>Observed:</strong> ${e(v.problem)}<br><strong>Pilot:</strong> ${e(v.action)}<br><strong>Permission/maintenance:</strong> ${e(v.owner)}<br><em>Next: define one before/after indicator and a stop condition.</em>`;
    if(t==="impactlog")return `Indicator: ${e(v.indicator)} · before: ${e(v.before)} · after: ${e(v.after)}.<br>Side effects/context: ${e(v.side)}. Record uncertainty instead of forcing a success story.`;
    if(t==="budget"){const a=["income","needs","wants","save"].map(k=>Number(v[k]||0)),left=a[0]-a[1]-a[2]-a[3];return `<strong>Planned remainder: ${left.toFixed(2)}</strong><br>Income ${a[0].toFixed(2)} − needs ${a[1].toFixed(2)} − flexible ${a[2].toFixed(2)} − goals ${a[3].toFixed(2)}.<br>${left<0?"Plan exceeds income: reduce flexible/goal amounts or identify added income/support before committing.":"A positive remainder can absorb irregular costs or strengthen the buffer."}`}
    if(t==="goalcalc"){const goal=Number(v.goal||0),cur=Number(v.current||0),m=Math.max(1,Number(v.months||1)),gap=Math.max(0,goal-cur);return `Remaining: <strong>${gap.toFixed(2)}</strong>. Approximate monthly pace: <strong>${(gap/m).toFixed(2)}</strong>. This ignores interest/returns and is a planning estimate, not investment advice.`}
    if(t==="skillsprint"){const ideas={technology:"Build a tiny website/tool that solves one real annoyance.", "arts/media":"Create a 3-piece mini-series and document your process.","health/helping":"Create a plain-language resource explainer using verified sources.","trades/making":"Repair, fabricate or improve one small object and document the steps.",business:"Test a simple offer with five potential users and record objections.","science/environment":"Run a small observation or measurement project and visualize the result."};return `<strong>${e(v.hours)}-hour sprint:</strong> ${e(ideas[v.interest])}<br>Deliverable: one artifact + one paragraph on what you learned + one question for a mentor.`}
    if(t==="portfolio")return `<strong>${e(v.project)}</strong><br>${e(v.did)}<br>Evidence: ${e(v.evidence)}<br>Skill: ${e(v.skill)}<br><small>Keep claims specific: what you personally did, with what result.</small>`;
    if(t==="belongingmap")return `Safe people: ${e(v.people)}<br>Repeatable places/groups: ${e(v.places)}<br>Experiment: ${e(v.new)}<br><em>A resilient map has more than one route to connection.</em>`;
    if(t==="bystander"){return v.level==="high"?"Prioritize distance, emergency/trusted help, and not becoming another person at risk. Do not physically intervene unless you are trained and it is clearly safe.":v.level==="medium"?"Options: recruit help, document only if safe/legal, distract, create an exit, and check in with the target afterward.":"Options: include the excluded person, redirect the conversation, name the behavior briefly, or check in privately afterward."}
    if(t==="pauseplan")return `Trigger: ${e(v.trigger)}<br>Exit line: “${e(v.line)}”<br>Contact: ${e(v.contact)}<br>Safe exit: ${e(v.exit)}<br><strong>If someone is unresponsive or having trouble breathing, contact emergency services.</strong>`;
    if(t==="habitmap")return `Pattern: ${e(v.when)} → ${e(v.before)}.<br>Alternative need-meeting action: ${e(v.alt)}.<br><em>Use this to notice patterns, not to self-diagnose.</em>`;
    if(t==="sourcecheck")return `<strong>Claim:</strong> ${e(v.claim)}<br>Primary: ${e(v.primary)}<br>Independent: ${e(v.independent)}<br>Affected perspective: ${e(v.affected)}<br>Would change my view: ${e(v.falsify)}<br><small>Do not treat agreement among weak sources as strong evidence.</small>`;
    if(t==="issuemap")return `Problem: ${e(v.problem)}<br>Factual questions: ${e(v.facts)}<br>Values/tradeoffs: ${e(v.values)}<br>Responsible body/process: ${e(v.body)}<br><em>This tool does not recommend a political choice.</em>`;
    if(t==="creativesprint"){const constraints=["Use only one point of view.","Make the first version deliberately rough.","Use three repeated motifs.","Start with the ending.","Remove one expected element."];const c=constraints[(v.theme||"").length%constraints.length];return `<strong>${e(v.minutes)} minutes · ${e(v.medium)}.</strong> Theme: ${e(v.theme)}. Constraint: ${c} Stop when the timer ends; decide whether to continue after a short break.`}
    if(t==="sharingboundary"){const n=(v.item||[]).length;return n===5?"All five boundary checks selected. You still control whether to share.":`${n}/5 checks selected. Consider keeping the work private or removing identifying/third-party material before sharing.`}
    if(t==="systemsmap")return `Problem → ${e(v.problem)}<br>Causes → ${e(v.causes)}<br>Stakeholders/assets → ${e(v.stakeholders)}<br>Constraint → ${e(v.constraint)}<br><strong>Next:</strong> circle one factor you can influence without needing the whole system to change first.`;
    if(t==="experiment")return `Hypothesis: ${e(v.hypothesis)}<br>Small test: ${e(v.test)}<br>Success signal: ${e(v.signal)}<br>Stop condition: ${e(v.stop)}<br><strong>Rule:</strong> decide stop/adapt/scale from evidence, not sunk effort.`;
    return "No output.";
  }

  function populatePlanner(){
    $("#plan-domain").innerHTML=D.domains.map(d=>`<option value="${d.id}">${d.icon} ${esc(d.title)}</option>`).join("");
    $("#build-plan").onclick=()=>{
      const support=$$('input[name="support"]:checked').map(x=>x.value);
      currentPlan=P.build({domain:$("#plan-domain").value,goal:$("#plan-goal").value,time:$("#plan-time").value,energy:$("#plan-energy").value,support,constraint:$("#plan-constraint").value});
      $("#plan-output").innerHTML=P.render(currentPlan);$("#save-plan").disabled=false;
    };
    $("#save-plan").onclick=async()=>{if(!currentPlan)return;await S.patch(s=>{s.plans.unshift(currentPlan);s.plans=s.plans.slice(0,60);s.progress.xp+=15;s.progress.lastAction="Saved an action plan"});state=S.get();currentPlan=null;$("#save-plan").disabled=true;toast("Plan saved locally · +15 XP");renderDashboard()};
  }

  async function logQuest(id,xp){
    const s=S.get();if(s.progress.completed.includes(id)){toast("Already logged.");return}
    await S.patch(st=>{st.progress.completed.push(id);st.progress.xp+=xp;st.progress.lastAction=id.split("::").pop()});state=S.get();toast(`Progress logged · +${xp} XP`);updateHUD();renderDashboard();
  }

  function renderDashboard(){
    state=S.get();const xp=state.progress.xp,lvl=Math.floor(xp/100)+1;
    $("#progress-cards").innerHTML=[
      [xp,"XP (cosmetic)"],[lvl,"level"],[state.progress.completed.length,"actions logged"],[state.plans.length,"saved plans"]
    ].map(x=>`<div class="stat"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join("");
    const suggestions=D.domains.flatMap(d=>d.quests.slice(0,1).map(q=>({d,q,id:d.id+"::"+q}))).filter(x=>!state.progress.completed.includes(x.id)).slice(0,6);
    $("#quest-board").innerHTML=suggestions.length?suggestions.map(x=>`<div class="quest"><span>${x.d.icon}</span><div><strong>${esc(x.q)}</strong><small>${esc(x.d.title)}</small></div><button class="secondary dash-quest" data-q="${esc(x.id)}">+10 XP</button></div>`).join(""):`<p class="muted">No current suggestions. Refresh to review completed domains or create your own next action.</p>`;
    $$(".dash-quest").forEach(b=>b.onclick=()=>logQuest(b.dataset.q,10));
    $("#reflection-list").innerHTML=state.reflections.slice(0,12).map(r=>`<div class="timeline-item"><strong>${esc(r.next||"Reflection")}</strong><div>${esc(r.helped)}</div><small>${new Date(r.at).toLocaleString()}</small></div>`).join("")||`<p class="muted">No reflections saved.</p>`;
    $("#saved-plans").innerHTML=state.plans.slice(0,12).map(p=>`<div class="timeline-item"><strong>${esc(p.domainTitle)}</strong><div>${esc(p.goal)}</div><small>${new Date(p.createdAt).toLocaleString()}</small></div>`).join("")||`<p class="muted">No saved plans.</p>`;
    updateHUD();
  }
  function updateHUD(){
    state=S.get();const xp=state.progress.xp,lvl=Math.floor(xp/100)+1,within=xp%100;
    $("#hud-level").textContent=lvl;$("#hud-xp").textContent=xp;$("#xp-bar").style.width=within+"%";$("#hud-today").textContent=state.progress.lastAction||"No action logged yet.";
  }

  function renderResources(){
    $("#resource-grid").innerHTML=D.resources.map(r=>`<article class="panel"><p class="eyebrow">${esc(r.kind)}</p><h2>${esc(r.title)}</h2><p>${esc(r.body)}</p></article>`).join("");
    renderLocalResources();
  }
  function renderLocalResources(){
    state=S.get();$("#local-resources").innerHTML=state.resources.map(r=>`<div class="timeline-item"><strong>${esc(r.name)}</strong><div>${esc(r.forWhom)} · ${esc(r.contact)}</div>${r.url?`<div><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.url)}</a></div>`:""}<small>${esc(r.note)}</small></div>`).join("")||`<p class="muted">No local resources saved.</p>`;
  }

  function renderStorage(){state=S.get();$("#storage-inventory").textContent=JSON.stringify(S.info(),null,2)}

  async function runDiagnostics(deep=false){
    let r=await Diag.basic();if(deep)r=await Diag.deepGPU();
    const b=r.browser, items=[
      ["Network",r.network.online,"Currently "+(r.network.online?"online":"offline")],
      ["IndexedDB",b.indexedDB,"Preferred structured local storage"],
      ["Service worker",b.serviceWorker,location.protocol.startsWith("http")?"Available to hosted build":"Requires HTTPS or localhost; file:// stays normal HTML"],
      ["BroadcastChannel",b.broadcastChannel,"Same-origin tab collaboration"],
      ["WebCrypto",b.webCrypto,"Integrity/hash primitives"],
      ["WebGPU",b.webGPU,"Optional local-AI compute path"]
    ];
    $("#diagnostic-cards").innerHTML=items.map(([n,ok,desc])=>`<div class="diag ${ok?"ok":"warn"}"><strong>${ok?"✓":"△"} ${esc(n)}</strong><span>${esc(desc)}</span></div>`).join("");
    $("#diagnostic-output").textContent=JSON.stringify(r,null,2);$("#ai-readiness").textContent=Diag.aiTier(r);
  }

  function searchAll(q){
    q=q.trim().toLowerCase();if(!q)return[];
    const out=[];
    D.domains.forEach(d=>{const hay=[d.title,d.summary,d.why,...d.tags,...d.ladder,...d.protective,...d.quests].join(" ").toLowerCase();if(hay.includes(q))out.push({title:d.title,desc:d.summary,href:"#domain/"+d.id})});
    D.resources.forEach(r=>{if([r.title,r.kind,r.body].join(" ").toLowerCase().includes(q))out.push({title:r.title,desc:r.body,href:"#resources"})});
    return out.slice(0,20);
  }

  function bind(){
    window.addEventListener("hashchange",route);
    $("#domain-search").addEventListener("input",renderDomains);$("#domain-filter").addEventListener("change",renderDomains);
    $("#theme-toggle").onclick=async()=>{const t=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=t;await S.patch(s=>s.preferences.theme=t)};
    $("#motion-toggle").onclick=async()=>{const on=!document.body.classList.contains("reduce-motion");document.body.classList.toggle("reduce-motion",on);await S.patch(s=>s.preferences.motion=on?"reduced":"normal")};
    $("#drawer-toggle").onclick=()=>{const s=$("#side"),open=!s.classList.contains("open");s.classList.toggle("open",open);$("#drawer-toggle").setAttribute("aria-expanded",String(open))};
    $(".energy-picker").addEventListener("click",e=>{const b=e.target.closest(".energy-choice");if(!b)return;$$(".energy-choice").forEach(x=>x.classList.remove("active"));b.classList.add("active");const n=Number(b.dataset.energy),opts=["Open one domain and read only its first action step.","Do one 5–15 minute checklist or map one support person.","Build a deterministic plan and complete the first step.","Choose a 30-day micro-project and define a review point."];$("#today-recommendation").textContent=opts[n-1]});
    $("#save-reflection").onclick=async()=>{const r={at:new Date().toISOString(),helped:$("#reflection-helped").value.trim(),hard:$("#reflection-hard").value.trim(),next:$("#reflection-next").value.trim()};if(!r.helped&&!r.hard&&!r.next)return toast("Add at least one reflection field.");await S.patch(s=>{s.reflections.unshift(r);s.reflections=s.reflections.slice(0,100);s.progress.xp+=5;s.progress.lastAction="Saved a reflection"});$("#reflection-helped").value=$("#reflection-hard").value=$("#reflection-next").value="";toast("Reflection saved locally · +5 XP");renderDashboard()};
    $("#regen-quests").onclick=renderDashboard;
    $("#save-resource").onclick=async()=>{const r={id:"resource-"+Date.now(),name:$("#resource-name").value.trim(),forWhom:$("#resource-for").value.trim(),contact:$("#resource-contact").value.trim(),url:$("#resource-url").value.trim(),note:$("#resource-note").value.trim()};if(!r.name)return toast("Add a service name.");if(r.url && !/^https?:\/\//i.test(r.url))return toast("Use a full http(s) website address.");await S.patch(s=>s.resources.unshift(r));["#resource-name","#resource-for","#resource-contact","#resource-url","#resource-note"].forEach(x=>$(x).value="");toast("Resource saved locally.");renderLocalResources()};
    $("#join-room").onclick=()=>{try{C.join($("#room-name").value,$("#display-name").value,roomMessage);$("#room-status").textContent="Connected to browser-local room.";$("#room-message").disabled=$("#send-room-message").disabled=false;$("#leave-room").disabled=false;$("#join-room").disabled=true}catch(e){toast(e.message)}};
    $("#send-room-message").onclick=()=>{const v=$("#room-message").value.trim();if(v){C.send(v);$("#room-message").value=""}};
    $("#room-message").addEventListener("keydown",e=>{if(e.key==="Enter")$("#send-room-message").click()});
    $("#leave-room").onclick=()=>{C.leave();$("#room-status").textContent="Not connected.";$("#room-message").disabled=$("#send-room-message").disabled=true;$("#leave-room").disabled=true;$("#join-room").disabled=false};
    $("#run-diagnostics").onclick=()=>runDiagnostics(false);$("#deep-gpu").onclick=()=>runDiagnostics(true);
    $("#copy-diagnostic").onclick=async()=>{try{await navigator.clipboard.writeText($("#diagnostic-output").textContent);toast("Diagnostic copied.")}catch{toast("Clipboard unavailable; select the text manually.")}};
    $("#download-diagnostic").onclick=()=>dl("ngso-diagnostic.json",$("#diagnostic-output").textContent);
    $("#refresh-storage").onclick=renderStorage;
    $("#export-state").onclick=()=>dl(`ngso-backup-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(S.exportState(),null,2));
    $("#import-state").onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const raw=JSON.parse(await f.text());await S.importState(raw);state=S.get();applyPrefs();renderDashboard();renderLocalResources();renderStorage();toast("Validated backup imported.")}catch(err){toast("Import rejected: "+err.message)}finally{e.target.value=""}};
    $("#reset-state").onclick=()=>{location.hash="#data"};
    $("#perform-reset").onclick=async()=>{const keys=$$("#reset-options input:checked").map(x=>x.value);if(!keys.length)return toast("Select data to reset.");if(!confirm("Reset the selected local data? Export a backup first if you may want it later."))return;await S.reset(keys);state=S.get();applyPrefs();renderDashboard();renderLocalResources();renderStorage();toast("Selected data reset.")};
    $("#global-search-button").onclick=openSearch;$("#close-search").onclick=closeSearch;$("#search-modal").addEventListener("click",e=>{if(e.target===$("#search-modal"))closeSearch()});
    $("#global-search").addEventListener("input",e=>{const list=searchAll(e.target.value);$("#search-results").innerHTML=list.map(x=>`<div class="search-result" data-href="${esc(x.href)}"><strong>${esc(x.title)}</strong><div>${esc(x.desc)}</div></div>`).join("")||`<p class="muted">No matches yet.</p>`;$$(".search-result").forEach(r=>r.onclick=()=>{location.hash=r.dataset.href;closeSearch()})});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){$("#side").classList.remove("open");closeSearch()} if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch()}});
  }
  function roomMessage(m){const log=$("#room-log"),line=document.createElement("div");line.className="chat-line";line.textContent=`${new Date(m.at).toLocaleTimeString()} · ${m.name}: ${m.text}`;log.append(line);log.scrollTop=log.scrollHeight}
  function openSearch(){$("#search-modal").hidden=false;setTimeout(()=>$("#global-search").focus(),0)}
  function closeSearch(){$("#search-modal").hidden=true}
  function applyPrefs(){state=S.get();document.documentElement.dataset.theme=state.preferences.theme||"dark";document.body.classList.toggle("reduce-motion",state.preferences.motion==="reduced")}
  function network(){
    const update=()=>{const on=navigator.onLine;$("#online-dot").className="dot "+(on?"online":"offline");$("#online-label").textContent=on?"Online":"Offline";$("#pwa-label").textContent=location.protocol.startsWith("http")?("serviceWorker" in navigator?"Hosted · PWA-capable":"Hosted · no SW support"):"File mode · PWA install unavailable"};
    addEventListener("online",update);addEventListener("offline",update);update();
  }
  async function registerSW(){if("serviceWorker" in navigator&&location.protocol.startsWith("http")){try{await navigator.serviceWorker.register("./sw.js")}catch{}}}

  async function init(){
    state=await S.init();applyPrefs();buildNav();renderOverview();renderDomains();populatePlanner();renderDashboard();renderResources();renderStorage();bind();network();initSplash();route();registerSW();runDiagnostics(false);
  }
  init();
})();