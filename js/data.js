window.NGSO_DATA = (() => {
  const domains = [
    {
      id:"resilience", icon:"🧠", type:"self", title:"Mental Health & Emotional Resilience",
      summary:"Name what is happening, lower immediate load, spot patterns, strengthen support and know when the problem needs more help than a self-guided tool can provide.",
      tags:["stress","anxiety","grief","sleep","emotions","support"],
      why:"Emotional distress can affect attention, sleep, relationships, motivation and decision-making. A useful first response is not to label the person; it is to reduce immediate strain, identify patterns and connect them with appropriate support.",
      ladder:[
        "Do a 60-second state check: intensity, body tension, sleep, food/water, and immediate safety.",
        "Pick one regulation action that is safe and familiar: slower breathing, movement, sensory grounding, music, writing, a shower, fresh air, or a quiet space.",
        "Shrink the next demand into one visible action that can be completed in 5–15 minutes.",
        "Name one trusted person and a low-friction way to contact them.",
        "If distress is persistent, escalating, impairing daily life or includes safety concerns, involve an appropriate trusted adult or qualified professional."
      ],
      protective:["regular sleep opportunity","safe relationships","predictable routines","movement","food/water","time outdoors","creative expression","professional support when needed"],
      pitfalls:["Treating a mood tracker as a diagnosis","Making someone disclose more than they want","Using streaks to shame missed days","Assuming one coping skill works for everyone"],
      quests:["Create a two-person support map","Build a five-minute calm kit","Log one week of energy—not just mood"],
      tools:["checkin","supportmap"]
    },
    {
      id:"digital", icon:"🔐", type:"systems", title:"Digital Literacy & Cyber Safety",
      summary:"Reduce account takeover, scams, oversharing, manipulation and privacy loss while preserving the benefits of being online.",
      tags:["privacy","phishing","social media","passwords","consent","scams","cyberbullying"],
      why:"Digital risk is rarely solved by telling young people to disconnect. Better tools make risky actions harder, suspicious patterns easier to notice, and recovery steps easier to find.",
      ladder:[
        "Secure the email account that recovers other accounts.",
        "Use unique passwords or passkeys where available and turn on strong multi-factor authentication.",
        "Review public profile information and remove details that reveal home, school schedules or predictable routines.",
        "Before clicking urgent messages, verify the sender through a separate trusted channel.",
        "Know the recovery path: backup codes, trusted contacts, platform reporting and evidence capture."
      ],
      protective:["unique credentials","MFA","private-by-default profiles","trusted reporting channel","regular software updates","backups","pause-before-post habit"],
      pitfalls:["Blaming victims after compromise","Treating screenshots as proof of identity","Sharing precise location by default","Publicly confronting a suspected scammer from a primary account"],
      quests:["Run a privacy audit","Create an account-recovery card","Teach one phishing red flag to someone else"],
      tools:["privacyaudit","sharecheck"]
    },
    {
      id:"climate", icon:"🌱", type:"systems", title:"Climate Action & Environmental Stewardship",
      summary:"Turn broad environmental concern into local, measurable projects that improve place, skills and community resilience.",
      tags:["climate","nature","water","food","trees","waste","community"],
      why:"Large problems can create paralysis when the action scale is unclear. Local stewardship projects make outcomes observable and give participants a way to learn systems thinking through practice.",
      ladder:[
        "Choose a place you can actually influence: home, block, school, club, park or watershed group.",
        "Observe before acting: what is the problem, who maintains the space, and what constraints matter?",
        "Pick one reversible, low-risk project with a visible outcome.",
        "Ask permission where land, facilities or public space are involved.",
        "Measure a simple before/after indicator and record what did not work."
      ],
      protective:["local permission","ecological fit","maintenance owner","small pilots","seasonal planning","water/safety considerations","documented learning"],
      pitfalls:["Planting without long-term watering","Introducing unsuitable species","Treating volunteer labor as infinite","Confusing visibility with ecological impact"],
      quests:["Map three nearby stewardship opportunities","Design a 30-day micro-project","Create a maintenance handoff plan"],
      tools:["projectbuilder","impactlog"]
    },
    {
      id:"finance", icon:"💸", type:"self", title:"Financial Literacy & Planning",
      summary:"Build practical money habits around cash flow, saving, tradeoffs, fraud resistance and future choices without pretending one budget fits everyone.",
      tags:["budget","saving","income","money","fraud","goals","banking"],
      why:"Financial literacy is most useful when attached to real decisions: what comes in, what must go out, what can wait, what risk is acceptable and what goal matters enough to plan for.",
      ladder:[
        "List actual money coming in and unavoidable commitments.",
        "Separate needs, flexible spending and future goals.",
        "Create a small buffer before optimizing returns.",
        "Compare total cost—not just monthly payment—before taking on debt or subscriptions.",
        "Treat pressure, guaranteed-return claims and requests for secrecy as reasons to slow down and verify independently."
      ],
      protective:["simple budget","emergency buffer","fee awareness","fraud pause","price comparison","goal-based saving","trusted second opinion for high-stakes decisions"],
      pitfalls:["Equating poverty with poor character","Using investment games as personalized advice","Ignoring fees and interest","Assuming stable income"],
      quests:["Map one month of cash flow","Find one recurring cost to reconsider","Define a savings goal with a date"],
      tools:["budget","goalcalc"]
    },
    {
      id:"career", icon:"🧰", type:"self", title:"Career Exploration & Skill Development",
      summary:"Explore work through evidence: interests, transferable skills, small projects, feedback and portfolios rather than title-chasing alone.",
      tags:["career","skills","portfolio","jobs","school","learning","mentorship"],
      why:"Career choices are easier when treated as experiments. Short projects expose the real tasks, tools and learning curve behind a field before someone commits years to it.",
      ladder:[
        "Name three tasks you enjoy or tolerate—not just job titles.",
        "Map those tasks to transferable skills.",
        "Choose one 2–10 hour micro-project that produces something visible.",
        "Ask for feedback from someone who understands the work.",
        "Record what energized you, what drained you and what skill would unlock the next level."
      ],
      protective:["portfolio evidence","mentor feedback","transferable skills","multiple pathways","realistic cost/time estimates","accessible learning materials"],
      pitfalls:["Assuming passion must come first","Overvaluing credentials without practice","Underestimating hidden barriers","Treating one rejection as a verdict"],
      quests:["Build a one-page skill map","Complete one micro-project","Interview someone about a day-in-the-life"],
      tools:["skillsprint","portfolio"]
    },
    {
      id:"belonging", icon:"🤝", type:"social", title:"Social Inclusion & Community Engagement",
      summary:"Strengthen belonging, reduce isolation, support safer bystander action and create routes into contribution without forcing conformity.",
      tags:["belonging","friends","bullying","community","volunteer","bystander","clubs"],
      why:"Belonging is not the same as popularity. A resilient social environment gives people multiple routes to support, contribution and identity so one group does not control all social access.",
      ladder:[
        "Map existing safe people and spaces, even if each connection is small.",
        "Choose one recurring group organized around an activity, not status.",
        "Practice a low-risk bystander move: interrupt, distract, document safely, recruit help or check in afterward.",
        "Create a contribution role that is specific and bounded.",
        "Escalate serious harassment, threats or violence through appropriate trusted channels rather than handling it alone."
      ],
      protective:["multiple social groups","trusted adult","clear reporting routes","structured activities","peer ally","boundaries","restorative options where safe"],
      pitfalls:["Forcing reconciliation","Making the target responsible for group harmony","Confusing popularity with support","Escalating publicly when private safety planning is better"],
      quests:["Draw a belonging map","Try one new structured activity","Practice three bystander options"],
      tools:["belongingmap","bystander"]
    },
    {
      id:"health", icon:"🫶", type:"self", title:"Substance Awareness & Healthy Choices",
      summary:"Support informed choices, refusal skills, safer help-seeking and early intervention without glamorizing substances or relying on fear.",
      tags:["substances","health","sleep","refusal","peer pressure","overdose","habits"],
      why:"Fear-only messaging can fail when it conflicts with lived experience. Useful education distinguishes uncertainty, dose/context risk, impaired judgment, dependency patterns, interaction risks and the value of seeking help early.",
      ladder:[
        "Identify the situation: curiosity, pressure, coping, habit, or an emergency.",
        "If there is immediate danger or someone is unresponsive, having trouble breathing or cannot be safely awakened, contact local emergency services now.",
        "For non-emergencies, use a pause plan: leave the pressure situation, contact a trusted person and avoid mixing unknown substances.",
        "Prepare one refusal line and one exit route before high-pressure situations.",
        "If use is becoming frequent, secretive, hard to control or tied to coping, involve a qualified health professional or trusted adult."
      ],
      protective:["trusted ride/home plan","refusal script","non-using activities","sleep","supportive adults","medical help without shame","accurate information"],
      pitfalls:["Moralizing","Giving procedural instructions for drug use","Assuming experimentation equals addiction","Hiding emergency symptoms to avoid consequences"],
      quests:["Write a pressure-exit script","Choose two support contacts","List three non-substance coping options"],
      tools:["pauseplan","habitmap"]
    },
    {
      id:"civic", icon:"🏛️", type:"systems", title:"Civic Awareness & Public-Problem Literacy",
      summary:"Learn how to investigate public issues, distinguish evidence from claims, understand tradeoffs and participate without being told what political choice to make.",
      tags:["civics","policy","sources","community","government","advocacy","media literacy"],
      why:"Civic agency improves when people can separate facts, values, tradeoffs, authority and uncertainty. The goal here is informed participation, not political persuasion.",
      ladder:[
        "Write the public problem in neutral, observable language.",
        "Separate factual questions from value judgments.",
        "Find the official body or process responsible for the issue.",
        "Compare primary sources, credible reporting and affected-community perspectives.",
        "Record tradeoffs, uncertainties and what evidence would change your view before choosing how to participate."
      ],
      protective:["source diversity","primary documents","neutral problem framing","clear uncertainty","respectful participation","privacy when engaging publicly"],
      pitfalls:["Treating virality as evidence","Assuming motives without evidence","Reducing people to political labels","Using this tool to recommend candidates or voting choices"],
      quests:["Complete a source triangle on one issue","Write one neutral issue brief","Attend or review one public meeting/process"],
      tools:["sourcecheck","issuemap"]
    },
    {
      id:"creative", icon:"🎨", type:"self", title:"Creative Expression & Emotional Processing",
      summary:"Use art, writing, music, design and making as ways to externalize experience, build skill and produce meaning without requiring public exposure.",
      tags:["art","music","writing","design","creativity","expression","story"],
      why:"Creative work can function as reflection, communication, practice and identity-building. The important distinction is that expression is an option—not a requirement to disclose private experiences publicly.",
      ladder:[
        "Choose a medium with low setup friction.",
        "Set a tiny constraint: 10 minutes, one page, eight bars, three colors, one scene.",
        "Make privately before deciding whether to share.",
        "Review the work for what it reveals about needs, questions or interests.",
        "If sharing, choose the audience and remove identifying details you do not want public."
      ],
      protective:["private drafting","clear sharing boundaries","process goals","regular practice","supportive feedback","copyright awareness"],
      pitfalls:["Turning every emotion into content","Posting while highly activated","Confusing engagement metrics with creative value","Using copyrighted work without permission"],
      quests:["Complete a 10-minute creative sprint","Make one private piece","Ask for specific—not generic—feedback"],
      tools:["creativesprint","sharingboundary"]
    },
    {
      id:"problem", icon:"🧩", type:"systems", title:"Problem-Solving & Future Planning",
      summary:"Frame problems, map causes and stakeholders, test small interventions, learn from failure and scale what works.",
      tags:["planning","systems","future","experiments","goals","decision","risk"],
      why:"Complex problems become more tractable when separated into observable conditions, causal hypotheses, constraints, leverage points and reversible experiments.",
      ladder:[
        "Define the problem as an observable condition, not a villain.",
        "Map causes, constraints, stakeholders and existing assets.",
        "Choose one leverage point within your control or influence.",
        "Design the smallest safe experiment that could teach you something.",
        "Measure results, record side effects and decide whether to stop, adapt or scale."
      ],
      protective:["reversible experiments","predefined stop conditions","stakeholder input","risk register","measurable outcomes","post-project review"],
      pitfalls:["Jumping from problem to favorite solution","Ignoring second-order effects","Scaling before maintenance is clear","Equating effort with impact"],
      quests:["Build a causal map","Run one reversible experiment","Write a stop/adapt/scale review"],
      tools:["systemsmap","experiment"]
    }
  ];

  const resources = [
    {title:"Trusted-person protocol", kind:"Support", body:"Choose at least one person who can listen, one who can act in an emergency, and one institutional contact if available. Write what you want each person to do so the request is concrete."},
    {title:"Evidence triangle", kind:"Media literacy", body:"For consequential claims, compare a primary/official source, an independent credible source, and a perspective from people directly affected. Record disagreement instead of flattening it."},
    {title:"Privacy minimization", kind:"Digital safety", body:"Collect the minimum data needed for the task. Do not store precise location, passwords, health diagnoses, government identifiers or other secrets in this app."},
    {title:"Stop-condition rule", kind:"Project safety", body:"Before a project, define what would make you pause or stop: safety incident, escalating conflict, unexpected cost, loss of permission, or evidence of harm."},
    {title:"Ask-for-help template", kind:"Communication", body:"Use: “I’m dealing with ____. I’ve tried ____. The part I need help with is ____. Could you help me with ____ by ____?”"},
    {title:"Verification habit", kind:"Decision quality", body:"When a claim would materially change a decision, check when it was published, who is responsible for it, whether it applies to your location/population, and what would falsify it."}
  ];

  const routes = [
    ["overview","Overview"],["domains","10 Domains"],["planner","Planner"],["dashboard","Dashboard"],
    ["resources","Resources"],["collaboration","Collaboration"],["diagnostics","Diagnostics"],["data","My Data"],["about","About"]
  ];
  return {domains,resources,routes,schemaVersion:1};
})();