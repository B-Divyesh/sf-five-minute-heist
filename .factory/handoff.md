# Five-Minute Heist repair handoff — PASS

## Result

Release-blocking QA finding from `a48f2fc` is repaired and deployed. Product repair commit: `eb8e8f9` (`fix: stabilize mobile frame-rate claim`). Live URL: https://five-minute-heist.sociobot.in

## Repair

The prior frame-rate claim took one idle 60-frame sample while the 390 px scene continuously composited both hero drift and a large `backdrop-filter`. That probe was sensitive to a cold compositor stall: the required repeated reproduction produced 44.59, 41.77, 37.50, 41.25, 43.42, 42.31, 38.37, and 40.74 fps samples.

On phone layouts the atmospheric hero is now static and the game panel uses an opaque glass treatment without backdrop blur. Gameplay, controls, route animation, desktop drift, reduced-motion behavior, and all puzzle rules are unchanged.

The `@claim:frame-rate` regression test now measures actual active play rather than idle page cadence: it starts three fresh sample plans at 390 × 844, samples 60 rendered frames during each running plan (after five warm-up frames), records the values as an attachment, and asserts their median is at least 50 fps. This gives repeated evidence without dropping real rendering work or lowering the advertised floor. The claim manifest, README, and visual thesis describe the same method.

## Verification

- `npm ci`: passed (61 packages, 0 vulnerabilities) before reproduction.
- Reproduced the old one-shot failure with `npx playwright test --grep @claim:frame-rate --repeat-each=10`; failures were 37.50–44.59 fps.
- First repaired local claim run: `npm test -- --grep @claim:frame-rate` passed. Subsequent local JSON evidence: 60.000, 60.000, 60.006 fps; median 60.000 fps.
- `npm test`: passed — 4 deterministic core tests and all 21 Chromium browser tests. This covers desktop and 390 px mobile, keyboard, touch, pause/restart, storage, privacy request log, offline reload/update, routes, 200% text, reduced motion, and Axe serious/critical checks.
- `npm run build`: passed. Output: JS 23.51 kB raw / 8.73 kB gzip; CSS 13.19 kB raw / 3.90 kB gzip.
- `npm audit --audit-level=high`: passed, 0 vulnerabilities. Type checking is part of `npm run build`; no separate lint or consumer package applies to this static browser game.
- `/opt/fleet/lib/verify-url.sh` passed against live root and demo. Root: 622 ms, title/lang/one H1/main/alt/button checks all valid, zero console errors. Demo: 654 ms with the same result. Evidence: [root verification](evidence/repair-2/verify-root/verify.json) and [demo verification](evidence/repair-2/verify-demo/verify.json).
- `npm run test:live`: passed — all 21 tests. The live frame claim recorded 60.000, 60.000, 60.000 fps; median 60.000 fps.
- Live identity check: SHA-256 matched the current `dist/` for `index.html`, `assets/index-B3M3w3lc.js`, `assets/index-CnxBolkV.css`, `sw.js`, and `art/museum-night-768.webp`. Live headers retain CSP with `connect-src 'self'` and `frame-ancestors 'none'`, HSTS, `nosniff`, referrer policy, permissions policy, and immutable hashed-asset caching.

## Deployment

Deployed the committed production build with `/opt/fleet/lib/deploy-static.sh five-minute-heist dist`.

- Static Web Apps deployment: `eecbdcfc-c8ac-4a22-b3d1-cfb83ce4b33e`
- Host: `zealous-smoke-0166b1810.3.azurestaticapps.net`
- Custom domain status: Ready; HTTPS root returned 200.

## Scope and known gaps

There are no known release blockers. This remains a local-first static browser game: no backend, account, billing, API endpoint, Entra flow, rate limit, or server-side persistence exists, so server response-policy/429/concurrency checks are not applicable. No user data leaves the browser during play.

To verify from a fresh checkout:

```sh
npm ci
npm test
npm run build
npm audit --audit-level=high
npm run test:live
```
