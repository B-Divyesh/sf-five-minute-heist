# Independent verification 4 — PASS

**Candidate:** `6f1f08fe6b4911d6d12fbc9b187e395f0aeb83d2`  
**Live URL:** https://five-minute-heist.sociobot.in  
**Verified:** 2026-09-02 06:51 UTC  
**Verdict:** **PASS.** No release-blocking or lower-severity product defect was found. The mandatory claims gate, complete local suite, production build, live suite, deterministic game run, accessibility checks, privacy inspection, PWA checks, and performance budgets all pass. The live deployment matches the candidate byte for byte.

## Mandatory first read — PASS

A cold 390 × 844 load says **“Plan a five-move museum heist.”** It names the audience as solo players seeking a short daily puzzle rather than another word game. The first action is **Try it with sample data**, immediately explained by “Open a ready practice gallery.” The daily game and board begin in the captured first viewport, so the screen shows the product rather than a menu wall.

The action opens `/?demo=1` in one click. The demo presents its persistent **Demo — sample data, nothing is saved to your daily game** banner, reset and exit actions, deterministic seed, guard loops, plan slots, and board. The board begins at y=348 px, inside the required first 390 vertical pixels.

Evidence: [cold mobile first screen](evidence/verification-4/first-read-mobile.png) and [factory demo capture](evidence/verification-4/verify-demo/screenshot-mobile.png).

## Claims gate — 17/17 PASS

After `npm ci`, every exact command in `.factory/claims.json` ran separately, in manifest order, against the documented demo entry point. All returned exit code 0:

- `sample-ready`
- `free-access`
- `complete-run`
- `restart-reset`
- `local-progress-storage`
- `plan-preview`
- `visible-guard-loops`
- `privacy-default`
- `demo-isolation`
- `browser-generated`
- `touch-controls`
- `offline-reload`
- `result-glyph`
- `solvable-generator`
- `exhaustive-generator`
- `frame-rate`
- `original-art-provenance`

The landing page, Privacy, Terms, README, demo documentation, and copy audit were cross-checked against the registry. Visitor-facing functional and privacy promises are represented by the registered tests.

## Clean local gates — PASS

- Initial HEAD, `origin/main`, and the requested candidate were all `6f1f08fe6b4911d6d12fbc9b187e395f0aeb83d2`.
- `npm ci`: passed; 61 packages installed; 0 vulnerabilities.
- `npm test`: passed — 4 Vitest unit tests and 21 Chromium tests.
- `npm run build`: passed — `tsc --noEmit` and Vite production build; `dist/` produced.
- `npm audit --audit-level=high`: passed; 0 vulnerabilities.
- No separate lint script exists. Type checking is part of the exact production build.
- Production app JavaScript: 23,514 B raw / 8.73 kB gzip. App CSS: 13,191 B raw / 3.90 kB gzip. Self-hosted fonts: 57,020 B. Mobile scene: 19,508 B. These are within the product budgets.

## Deployment identity — PASS

Fresh SHA-256 values matched between the local production build and live deployment for:

- `index.html`: `831736297c77b68147820abe80333f7dab125facb699c0dde13058c0296118dd`
- `assets/index-B3M3w3lc.js`: `e0b2a7d304374ec6be5ab8b0f3b46b8013a0e538224888c87c203d91965080da`
- `assets/index-CnxBolkV.css`: `7933bce0b43831c66c00b043eaf9b811e6922a03eadeea4e83a30d439a52e845`
- `sw.js`: `b0c7c1944503d1c4b4111050010b309c36607f4c4a3c64f7a070383984a940be`
- `404.html`, `manifest.webmanifest`, the mobile museum scene, and the display font also matched.

`npm run test:live` passed all 21 tests against production. The deployed product is the requested candidate.

## Deterministic browser-game run — PASS

A fresh live mobile run started at `/`, entered the sample with the one-click action, and reset the sandbox:

1. With no moves, **Run the plan** was disabled. An unrelated keyboard key left the plan at `0/5`.
2. Six attempted down inputs filled exactly five slots, disabled further directions, and did not overflow the plan.
3. `D,D,D,D,D` reached the real wall-loss state: “Move 1 hit a wall. Remove moves and try another route.”
4. Five Backspaces recovered to `0/5`.
5. Sound was enabled and remained enabled after reload.
6. `U,U,L,U,L` was entered by keyboard. Pause held turn 0 unchanged for 700 ms; Resume continued execution.
7. The real end screen showed **You escaped with the exhibit**, 900 points after two attempts, and glyph `◆△✦△◆`.
8. **Copy result** produced the same five glyphs and no direction arrows.
9. **Play again** removed the end screen, reset to `0/5`, and focused the first direction control.
10. The valid plan was replayed with touch controls and reached the end screen again.

Additional runs produced “Guard spotted you on move 5” for `U,U,D,L,U` and “Five moves ended outside the exhibit room” for `U,U,R,U,U`. This exercises the stated goal, guard challenge, input boundaries, wall/guard/missed-goal losses, recovery, win, restart, stored settings/progress, keyboard, touch, pause/resume, daily mode, and isolated demo mode.

Evidence: [mobile end screen](evidence/verification-4/end-screen-mobile.png).

## Accessibility and responsive behavior — PASS

- Playwright axe reported zero serious or critical findings across `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the designed 404.
- Every checked route has `lang=en`, exactly one H1, one main landmark, a route-specific title, labelled buttons, and no image missing alt text.
- At 390 px, every checked route has zero horizontal overflow. The live suite also passed its 200% text-resize checks.
- Every link and button measured at least 44 × 44 CSS px on the landing, demo, text pages, 404, and end screen.
- The first Tab reveals **Skip to game** with a visible 3 px amber outline. Repeated Tab navigation reached the header, sample action, sound control, direction controls, footer, and returned to the skip link without a trap.
- Arrow keys, Backspace, Enter, and touch controls all operated the game.
- With `prefers-reduced-motion: reduce`, the media query matched, animation duration became `0.01ms`, smooth scrolling became `auto`, and the run still reached the end screen.
- No application console errors or page errors occurred during the complete run.

Factory checks passed on root and demo. Root loaded to network idle in 844 ms; demo in 881 ms. Both reported a valid title, language, one H1, main landmark, image alt coverage, labelled buttons, and zero console errors.

Evidence: [root verifier result](evidence/verification-4/verify-root/verify.json) and [demo verifier result](evidence/verification-4/verify-demo/verify.json).

## Privacy, security, routing, and PWA — PASS

- The complete live gameplay flow made 14 requests, all to `https://five-minute-heist.sociobot.in`; no third-party runtime origin, analytics, ad, account, payment, or answer/API request appeared.
- The browser set no cookies. Completed demo state used only `demo:five-minute-heist:progress:sample-glass-gallery`, containing its plan, attempts, best score, result, and sound choice.
- Response headers include a restrictive same-origin CSP with header-delivered `frame-ancestors 'none'`, HSTS, `nosniff`, `strict-origin-when-cross-origin`, and a restrictive Permissions Policy.
- HTML and `sw.js` use 30-second revalidation. Hashed JS/CSS use one-year immutable caching; fonts and art use one-week caching.
- `/`, `/demo`, `/privacy`, `/terms`, robots, sitemap, manifest, social image, icons, and every discovered non-404 HTTP link returned 200. The unknown route returned the designed HTTP 404.
- The active `/sw.js` worker controlled the page and `registration.update()` completed. After switching a fresh context offline, `/demo` reloaded with its offline notice, sample seed, and playable board.
- This is a static browser game with no server-side endpoint, product-unlock call, account, sign-in, payment, or server persistence. API concurrency, request-allowance/429, and Entra authority checks are not applicable.

## Performance — PASS

- Fresh Lighthouse 12.8.2 mobile: Performance 98, Accessibility 100, Best Practices 100, SEO 100; FCP 1.3 s, LCP 1.5 s, TBT 150 ms, CLS 0, total transfer 135 KiB. INP is unavailable without field interaction data.
- Twenty fresh 390 × 844 contexts reached the playable board in 192–340 ms; measured p95 was 334 ms.
- Three independent active-play samples at 390 × 844 measured 60.012, 60.006, and 60.006 fps; median 60.006 fps. This passes the advertised 50 fps floor for the 60 fps target.

Evidence: [Lighthouse JSON](evidence/verification-4/lighthouse-live.json).

## Findings by severity

- Critical: 0
- High: 0
- Medium: 0
- Low: 0

Candidate `6f1f08f` is accepted.
