# Deployment Guide

## GitHub Pages / static hosting
Upload the bundle contents at the site root. Keep relative paths unchanged. HTTPS enables service workers.

## Local / USB use
Open `index.html`. Expect:
- core UI: yes
- local state: browser-dependent, with fallbacks
- PWA installation/service worker: no under `file://`
- BroadcastChannel: browser-dependent
- WebGPU: browser/device-dependent

## Cache updates
Change `CACHE` in `sw.js` when shipping an update. Keep a visible changelog in production deployments.

## Content updates
Youth-support resources can change. Put time-sensitive local service details in user-created resource cards or a separately maintained verified dataset rather than baking unverified contact details into the app.

## Multiplayer expansion
If adding Trystero/WebRTC:
- preserve the current transport boundary,
- define message schemas and versions,
- include reconnect/late-join semantics,
- add moderation/reporting and abuse controls first,
- never broadcast precise location or sensitive youth data,
- consider server-authoritative membership and recovery even if payload traffic is P2P.
