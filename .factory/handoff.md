# Five-Minute Heist handoff

## Status

Repair 4 is complete. The implementation candidate is `60649193d3fcf59fa355dedae024094ba85c3e20` (version 1.1.3). The documentation and claim changes are in that same implementation commit. The evidence added after deployment is documentation-only and does not change the static product files.

The game is a daily five-move museum puzzle for solo browser players taking a short break. A new visitor first sees the job, audience, and **Try it with sample data** action, with the playable board on the same screen.

## Fixed findings

| Finding | Resolution | Evidence |
| --- | --- | --- |
| Review 5 F-5-1: adjacent mobile controls had 4–6 px gaps | Phone control, demo-action, and wrapping-header gaps are now 8 px. Demo banner buttons are at least 44 px high at every width. A browser regression test measures edge-to-edge geometry at 390 × 844 with normal and 200% text. | `evidence/repair-4/touch-spacing.json` records 8 px direction and demo gaps at both scales, plus the 8 px wrapped-header gap at 200%. |
| Review 5 F-5-2: README omitted the session length | README now states the intended 4–6 minute session. `session-length` is the eighteenth registered claim. Its browser check starts at a ready sample board, uses five player-paced planning intervals, reaches the real win screen, and accepts only 4–6 minutes elapsed. The method is in `session-length.md`. | `npm test -- --grep @claim:session-length` passed locally, from a clean checkout, and over HTTPS. |

Earlier review findings remain fixed: one-click sample readiness, immutable versioned assets, a designed HTTP 404, clear mobile navigation and action names, 44 px targets, 200% text fitting, private local storage, offline reload, and the 50 fps claim.

## Verification

- Clean checkout: `/tmp/five-minute-heist-clean.odfP04` at implementation `6064919`.
- `npm ci` and `npm audit --audit-level=high`: passed with zero vulnerabilities.
- `npm run build`: passed and produced `dist/`. JavaScript is 23.54 kB raw / 8.72 kB gzip. CSS is 13.19 kB raw / 3.88 kB gzip.
- `npm test`: passed — 4 core tests and 26 local browser tests.
- Every exact command in `.factory/claims.json`: passed separately from the clean checkout (18/18).
- `npm run test:live`: passed — 26 HTTPS browser tests.
- URL verification passed for root (679 ms) and demo (657 ms): correct title, `lang=en`, one H1, main landmark, image alternatives, named buttons, and no console errors.
- Playwright Axe checks passed with zero serious or critical issues across root, both demo URLs, Privacy, Terms, and the HTTP 404.
- Lighthouse mobile data was written before its Chromium tab crashed while collecting the final screenshot: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.93 s, LCP 1.35 s, TBT 116.5 ms, CLS 0.0015, 138,854 B transfer. The crash is a host-tool artifact after the audit data was saved, not a product console or runtime error.

## Fresh live run

Fresh phone and desktop browser contexts checked the first screen before scrolling. They showed:

- Job: **Plan a five-move museum heist.**
- Audience: solo players who want a short daily puzzle without another word game.
- First action: **Try it with sample data.**

The phone entered the populated Sample gallery in one tap. It reached wall, guard, and missed-goal loss states, reset safely, retained the demo label, paused and resumed, then won by touch for 1,000 points and five direction-free result symbols. **Play again** returned it to `0/5`. The desktop reached the same end screen with Arrow keys and Enter. The sample preserved a daily-data sentinel and removed all `demo:five-minute-heist:` data on exit. Reduced-motion and offline fresh contexts also completed a win.

`evidence/repair-4/live-check.json` records 46 passing checks, no external requests, no console/page errors, 60.006 fps median active play, and a 226 ms p95 across 20 fresh phone loads. The passed privacy claim also checks that the browser has no cookies. Screenshots include cold phone and desktop screens plus phone loss, phone win, and desktop keyboard win.

The deployed HTML, service worker, 404 document, JavaScript, and CSS SHA-256 values equal the current `dist/` build. `/not-a-real-page` deliberately returns HTTP 404 with **Page not found** and a recovery link.

## How to run

```sh
npm ci
npm test
npm run build
npm run test:live
```

Run one claim with `npm test -- --grep @claim:<id>`. The full timed session check takes about five minutes because it measures a real 4–6 minute planning route.

## Remaining scope

No known product defect remains. This is a static, local-first solo game with no backend, account, payment, tenant, health endpoint, or rate-limited API. Backend isolation, restart persistence, and 429/`Retry-After` checks do not apply. No paid offer, billing registration, AI feature, import, sync, or multiplayer mode is advertised or required by the researched brief.
