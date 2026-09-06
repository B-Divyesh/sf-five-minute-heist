# Review 4 — Plan a five-move museum heist

**Reviewed:** 2026-09-06 UTC  
**Live URL:** https://five-minute-heist.sociobot.in  
**Implementation candidate:** `9ca7b1658f9c7edc54f9d3db77d05401d8a3df16`  
**Documentation head:** `43e6a59f366216be8dd2301a4ca482fc64a8f25e`  
**Verdict: PASS**

There are **zero findings** at every severity and **zero untested public claims**. The documentation commits after the implementation candidate change reports and evidence only. A fresh production build from this checkout has byte-identical HTML, service worker, JavaScript, and CSS to the live deployment.

## First screen

Fresh, unscrolled browser contexts at 390 × 844 and 1440 × 900 showed:

- Job: **Plan a five-move museum heist.**
- Audience: **Solo players who want a short daily puzzle without another word game.**
- First action: **Try it with sample data.**

The playable board was visible in the first viewport on both devices. The one-click phone demo kept **“Demo — sample data, nothing is saved to your daily game.”** visible, identified **Sample gallery**, and placed the board above 390 px. Evidence: [phone first screen](evidence/review-4/cold-phone.png).

## Claims and clean checkout checks

From the clean tracked checkout, `npm ci` completed with zero audit vulnerabilities. I ran every command listed in `.factory/claims.json` separately, in manifest order. Each ran its four deterministic logic tests and exactly its tagged browser assertion successfully.

| Claim | Result |
| --- | --- |
| `sample-ready` | PASS |
| `free-access` | PASS |
| `complete-run` | PASS |
| `restart-reset` | PASS |
| `local-progress-storage` | PASS |
| `plan-preview` | PASS |
| `visible-guard-loops` | PASS |
| `privacy-default` | PASS |
| `demo-isolation` | PASS |
| `browser-generated` | PASS |
| `touch-controls` | PASS |
| `offline-reload` | PASS |
| `result-symbols` | PASS |
| `solvable-generator` | PASS |
| `exhaustive-generator` | PASS |
| `frame-rate` | PASS |
| `original-art-provenance` | PASS |

`npm test` passed its 4 unit tests and 24 local Chromium tests. `npm run build` passed and produced `dist/`: 23,540 B JavaScript (8.72 kB gzip) and 13,191 B CSS (3.90 kB gzip). `npm audit --audit-level=high` found zero vulnerabilities. A separate `npm run test:live` run completed the same 24 browser checks against the HTTPS deployment without a failing test.

The live asset hashes equal the fresh build for `index.html`, `sw.js`, `assets/index-BiFJaNK4.js`, and `assets/index-CnxBolkV.css`. The versioned JS and CSS responses carry `max-age=31536000, immutable`.

## Game run and recovery

A fresh phone context used touch controls only. The invalid `D,D,D,D,D` plan reached the clear recovery message **“Move 1 hit a wall. Remove moves and try another route.”**. **Reset demo** returned the plan to `0/5`. The valid `U,U,L,U,L` plan then reached **“You escaped with the exhibit”** and **1,000 points**. **Play again** returned the plan to `0/5`.

A fresh desktop context entered that valid route with Arrow keys and Enter, reached the 1,000-point end screen, and left demo mode. A daily-storage sentinel remained while all `demo:five-minute-heist:` data was removed. Evidence: [phone loss](evidence/review-4/phone-loss.png), [phone win](evidence/review-4/phone-win.png), and [desktop keyboard win](evidence/review-4/desktop-win.png).

The registered frame-rate claim passed its three active 390 × 844 samples with a median at or above its 50 fps floor. The complete local and live suites also cover pause/resume, queued-plan preview, result copying without directions, sound persistence, keyboard recovery, and the deterministic 1,024-route validator.

## Accessibility, privacy, routes, and updates

- `/opt/fleet/lib/verify-url.sh` passed on root (612 ms) and demo (656 ms): expected title, `lang=en`, one H1, main landmark, no missing image alternatives, no unnamed buttons, and no console errors. Evidence: [root verifier](evidence/review-4/verify-root/verify.json) and [demo verifier](evidence/review-4/verify-demo/verify.json).
- The live suite used Playwright Axe on root, both demo paths, Privacy, Terms, and the 404 page with zero serious or critical issues. It also passed skip-link focus, a designed 3 px focus outline, 44 × 44 px mobile links, 200% text at 390 px, keyboard controls, touch controls, and reduced-motion completion.
- A new reduced-motion context completed the sample successfully. A separate context waited for service-worker control, went offline, reloaded, and showed the offline notice with a playable board.
- The direct full game pass set no cookies, made no external runtime requests, and reported no page or application console errors. The game has no account, payment, tracking, ads, analytics, or backend; privacy deletion is local browser-data clearing and the policy page states that scope.
- Root, demo, Privacy, Terms, robots, sitemap, manifest, service worker, and all discovered same-product links returned 200. The external factory link is marked as opening a new tab and was not fetched because it is outside this product’s review scope. `mailto:` links are deliberate contact actions. `/not-a-real-page` returned the expected HTTP 404 with the designed **Page not found** screen and a working return link; this is expected behavior, not a finding.
- Privacy, Terms, and 404 each had the required route-specific title and one visible H1. The current product has no backend or API allowance, so tenant isolation, service restart persistence, health endpoint, and 429/`Retry-After` checks do not apply.

## Earlier findings

| Earlier finding | Current disposition and proof |
| --- | --- |
| Review 1 F-1-1 | Fixed. The ready isolated demo board begins above 390 px on phone. |
| Review 1 F-1-2 | Fixed. Live hashed JS and CSS are one-year immutable. |
| Review 1 F-1-3 | Fixed. The unknown URL is a designed HTTP 404. |
| Review 1 F-1-4a through F-1-4m | Fixed. The resulting 17 public claims are registered and all passed separately; the unmeasured duration wording remains absent. |
| Review 1 F-1-5 through F-1-7 | Fixed. Mobile Demo navigation is present, actions name their outcome, and both 404 forms use `Page not found`. |
| Review 2 F-1-4j | Fixed. No public 4–6 minute duration claim is present. |
| Review 2 F-2-1 through F-2-10 | Fixed. The current copy audit records no overlong or banned wording, uses `result symbols`, and names the same-site privacy behavior. |
| Verification 2 mobile touch-target and 200% text findings | Fixed. The live suite passed 44 px targets and 200% text on every public route. |
| Verification 3 frame-rate finding | Fixed. The registered 50 fps-floor claim passed again in this clean run. |

No AI, import, export, sync, or multiplayer capability is implied by this short deterministic solo puzzle. The static local-first design is appropriate to the stated job.

## Findings by severity

- Critical: 0
- High: 0
- Medium: 0
- Low: 0
- Untested public claims: 0
