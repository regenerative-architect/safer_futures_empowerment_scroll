# Next-Gen Safeguarding & Empowerment OS

A privacy-respecting web toolkit that turns ten broad youth challenges into practical, inspectable actions.

## Included domains
1. Mental health & emotional resilience
2. Digital literacy & cyber safety
3. Climate action & environmental stewardship
4. Financial literacy & planning
5. Career exploration & skill development
6. Social inclusion & community engagement
7. Substance awareness & healthy choices
8. Civic awareness & public-problem literacy
9. Creative expression & emotional processing
10. Problem-solving & future planning

## Core architecture
- Semantic HTML + vanilla CSS/JS.
- Shared route registry drives top + side navigation.
- Deterministic planner is the default intelligence layer; no model is required.
- IndexedDB first, localStorage fallback, memory fallback.
- Validated JSON import/export with schema versioning.
- PWA service worker on HTTPS/localhost; honest `file://` fallback.
- Reduced-motion mode, keyboard access, print CSS, no-JS static guide.
- Browser diagnostics with explicit deep WebGPU probe.
- Same-origin BroadcastChannel demo only; no anonymous stranger P2P.
- Cosmetic XP/quests; no feature gating.
- No telemetry, account, hidden sync, precise-location collection or secret transfer.

## Run
### Easiest local preview
Open `index.html` directly. Core reading, planning and local tools work. Service workers/PWA installation do **not** work under `file://`.

### Full PWA behavior
Serve this folder on HTTPS or localhost, e.g.:
`python -m http.server 8080`
Then open `http://localhost:8080/`.

## Production notes
For an internet multiplayer deployment, do not simply enable open P2P for minors. Add age-appropriate consent, moderation/reporting, membership, abuse response, privacy controls, recovery and an authoritative durable-state strategy where needed.

## Testing performed in bundle generation
Static checks verify required files, internal asset paths and JavaScript syntax where the local runtime supports it. Browser-specific behavior still requires browser testing; see `docs/TEST_PLAN.md`.
