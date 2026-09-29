# Architecture

## Operating principle
Every optional capability has a visible failure mode and the core experience remains usable without it.

## Route registry
Navigation derives from one registry in `js/data.js`. Domain detail routes use `#domain/<id>`.

## State model
Schema v1:
- `progress`
- `plans`
- `reflections`
- `resources`
- `preferences`
- `extensions`

`js/storage.js` prefers IndexedDB and falls back to localStorage, then in-memory state. The app never claims cross-device sync.

## Deterministic planner
`js/planner.js` combines:
1. domain selection,
2. energy/time sizing,
3. support availability,
4. a domain action ladder,
5. safety/constraint checks,
6. review/stop-adapt-continue logic.

It is intentionally model-independent.

## Optional AI
No model is bundled. The diagnostics module estimates only a rough device tier. A future WebLLM adapter should:
- require explicit load,
- display model/runtime/version,
- show progress + memory errors,
- normalize WebGPU/DXGI device-loss errors,
- support abort/reset,
- mark AI output as draft/advisory,
- never replace deterministic core logic.

## Collaboration
The current demo uses `BroadcastChannel`, limited to the same origin/browser context. Production P2P/WebRTC/Trystero belongs behind a safety gate with moderation, membership, recovery and data minimization.

## PWA
The service worker precaches core files and uses same-origin runtime caching. `file://` deployments operate as normal HTML without pretending service workers work there.
