# Test Plan

Run before public deployment.

## Navigation
- Desktop top + side links.
- Mobile drawer open/close and Escape.
- Deep links: `#planner`, `#domain/digital`.
- Unknown route behavior.

## Accessibility
- Keyboard-only traversal.
- Visible focus.
- Screen-reader labels.
- 200% zoom.
- Reduced motion.
- Light/dark contrast.
- Print rendering.

## Storage
- IndexedDB path.
- localStorage fallback.
- quota failure behavior.
- JSON export/import.
- malformed import rejection.
- selective reset.
- upgrade/migration test before schema changes.

## Offline/PWA
- first visit online.
- reload offline.
- stale-cache update.
- missing optional file.
- `file://` behavior.

## Diagnostics
- no WebGPU.
- WebGPU success.
- denied/failed adapter/device.
- device-lost style errors.
- clipboard unavailable.

## Safety
- no secret telemetry requests.
- no automatic sharing.
- no anonymous internet chat.
- URLs rendered safely.
- user text escaped before HTML insertion.
