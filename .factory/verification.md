# Independent verification — PASS

**Candidate:** `731cf94d9f7038f62f432e34228a84f65a9fb47b`  
**Live URL:** https://five-minute-heist.sociobot.in  
**Verified:** 2026-09-02 (UTC)  
**Verdict:** **PASS.** No release-blocking defect was found. The deployed HTML, application JavaScript, stylesheet, and service worker match a clean production build of the candidate exactly.

## Cold first read

On a fresh desktop visit, the first screen says: “Plan a five-move museum heist.” It says this is for solo players wanting a short daily puzzle rather than a word game, and the primary action is **Try it with sample data**, with the immediate result (“A practice gallery opens with a ready puzzle”). The playable 5 × 5 board is visible on that same screen; it is not a menu wall. At 390 × 844 the game panel and top of the board are visible without horizontal overflow.

## Clean local verification

- `npm ci`: passed; npm reported 0 vulnerabilities.
- Every command in `.factory/claims.json` was run separately from the `/demo` entry point and passed:
  - `@claim:complete-run`
  - `@claim:restart-reset`
  - `@claim:settings-persist`
  - `@claim:offline-reload`
  - `@claim:local-only`
  - `@claim:result-glyph`
  - `@claim:frame-rate`
  - `@claim:answer-not-shipped`
  - `@claim:solvable-generator`
  - `@claim:demo-isolation`
- `npm test`: passed (3 deterministic Vitest checks and 12 Chromium checks).
- `npm run build`: passed and produced `dist/`.
- Production outputs: app JavaScript 22,628 B raw / 8,500 B gzip; CSS 11,450 B raw / 3,568 B gzip. JavaScript is comfortably below the 200 KB initial-JS budget.

## Live verification

- HTTPS root returned 200. `verify-url.sh` recorded title, `lang=en`, one `h1`, a `main` landmark, zero missing image alt attributes, zero unlabeled buttons, and zero console errors; cold network-idle load was 660 ms.
- SHA-256 comparison of live and local `index.html`, `assets/app.js`, `assets/style.css`, and `sw.js` was identical for every file.
- Browser request log for a complete demo play contained 7 requests, all to `https://five-minute-heist.sociobot.in`; no analytics, ads, third-party fonts, scripts, or network origins were observed.
- Response headers included HTTPS, CSP with `connect-src 'self'` and response-header `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive `Permissions-Policy`.
- The live service worker controlled `/demo`; after first visit, an offline reload showed the offline notice and the playable board. `registration.update()` completed with the active `/sw.js` worker.
- Playwright axe scan at 390 × 844 reported zero serious or critical violations. Reduced-motion mode had no overflow or console/page errors.

## Scripted game run

From a fresh live `/demo`, the invalid plan `D,D,D,D,D` failed with “Move 1 hit a wall. Remove moves and try another route.” Removing all moves returned the plan to `0/5`. Keyboard-only input `ArrowUp, ArrowUp, ArrowLeft, ArrowUp, ArrowLeft, Enter` reached the real end screen **You escaped with the exhibit**, producing the sealed five-glyph result `◆△✦△◆` and 900 points. **Play again** reset the plan to `0/5`.

The claim suite also independently covered persisted sound, copied glyph direction hiding, date-generator solvability across 31 boards, demo namespace isolation, and the 50 fps floor at 390 × 844 (the test passed).

## Findings by severity

- **Release-blocking / high / medium:** none.
- **Low, non-blocking:** live `/assets/app.js` and `/assets/style.css` currently return `Cache-Control: public, must-revalidate, max-age=30`. Offline use is protected by the verified service-worker precache, and payloads are small, but a later deployment should use content-hashed filenames with long-lived immutable cache headers to improve repeat-visit caching.

## Scope notes

This is a static browser game with no server-side API, account, sign-in, payment, or rate-limited product endpoint; the 429 allowance and Entra checks are not applicable.
