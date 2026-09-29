window.NGSO_PLANNER = (() => {
  const domainMap=()=>Object.fromEntries(NGSO_DATA.domains.map(d=>[d.id,d]));
  function escapeHTML(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
  function build(input){
    const d=domainMap()[input.domain]||NGSO_DATA.domains[0];
    const energy=Number(input.energy)||2, time=input.time;
    const goal=(input.goal||"make this situation a little easier and safer").trim();
    const support=input.support||[];
    const tiny=d.ladder[0], next=d.ladder[Math.min(1,d.ladder.length-1)], deeper=d.ladder[Math.min(3,d.ladder.length-1)];
    const scale = energy<=1 ? "one tiny, reversible action" : energy===2 ? "one short action plus one support step" : energy===3 ? "a focused action-and-review cycle" : "a small project with a review point";
    const supportText=support.includes("none")||!support.length
      ?"Because support is unclear, include one step that identifies a safe person, service, educator or community contact before taking on a high-stakes task."
      :"Use the support you already identified; ask for a specific action rather than a vague “help me.”";
    const timeText = time==="week" ? "Use the week as a short experiment: act early, review mid-week, adjust, then record what changed."
      : `Use the ${time}-minute window for completion, not perfection. Stop when the timer ends and decide the next step separately.`;
    const risk = d.id==="resilience"||d.id==="health"
      ?"If there is immediate danger, inability to stay safe, severe impairment, unconsciousness or breathing difficulty, this planner is not the right layer—escalate to appropriate emergency/trusted professional support."
      :"If the action creates a new privacy, physical-safety, legal, financial or interpersonal risk, reduce scope or get appropriate trusted guidance before proceeding.";
    const constraint=input.constraint?.trim()?`Constraint to design around: ${escapeHTML(input.constraint.trim())}`:"No extra constraint supplied.";
    const now = energy<=1 ? tiny : next;
    const plan={
      id:"plan-"+Date.now(),
      createdAt:new Date().toISOString(),domain:d.id,domainTitle:d.title,goal,input,
      steps:[
        {phase:"Now",text:now},
        {phase:"Then",text:`Define success in one sentence: “After this step, I will know ${escapeHTML(goal)} is moving in the right direction because ____.”`},
        {phase:"Support",text:supportText},
        {phase:"Review",text:"Ask: What changed? What surprised me? Did this create any new risk? Stop, adapt or continue based on the answer."}
      ],
      notes:{scale,timeText,risk,constraint}
    };
    return plan;
  }
  function render(plan){
    return `
      <p><span class="tag">${escapeHTML(plan.domainTitle)}</span> <span class="tag">${escapeHTML(plan.notes.scale)}</span></p>
      <h3>Goal</h3><p>${escapeHTML(plan.goal)}</p>
      <div class="action-ladder">${plan.steps.map(s=>`<div class="action-step"><div><strong>${escapeHTML(s.phase)}</strong><p>${s.text}</p></div></div>`).join("")}</div>
      <div class="notice"><strong>Timebox:</strong> ${escapeHTML(plan.notes.timeText)}</div>
      <div class="notice"><strong>Constraint check:</strong> ${plan.notes.constraint}</div>
      <div class="notice warning"><strong>Safety gate:</strong> ${escapeHTML(plan.notes.risk)}</div>
      <p class="muted">Deterministic output · no model call · inspectable rule path.</p>`;
  }
  return {build,render};
})();