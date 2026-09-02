# Independent verification 3 — FAIL

**Candidate:** `2cccef726174bbd969a64b80d12be427194b9912`  
**Live URL:** https://five-minute-heist.sociobot.in  
**Verified:** 2026-09-02 05:53 UTC  
**Verdict:** **FAIL.** The required frame-rate claim test fails reproducibly. The other 16 claim commands, gameplay, deployment identity, privacy, accessibility, offline behavior, build, and web-performance budgets pass.

## Release-blocking finding

### MEDIUM — the advertised 50 fps floor fails its required claim test

`.factory/claims.json` says the game targets 60 fps with a tested 50 fps floor. Its exact command, `npm test -- --grep @claim:frame-rate`, failed from the clean checkout at **45.83 fps**. The same check failed in the full local suite at **45.21 fps** and in the full production suite at **45.83 fps**. Each result is below the asserted 50 fps minimum.

A separate set of five short live samples measured about 60.0 fps, but that does not override three failures of the registered acceptance test. The conflicting results show that the claim lacks enough repeatable margin under the repository's own test conditions. The claims contract makes any failing registered claim release-blocking.

Evidence: [local failure screenshot](evidence/verification-3/frame-rate/test-failed-1.png), [local trace](evidence/verification-3/frame-rate/trace.zip), [live failure screenshot](evidence/verification-3/live-frame-rate/test-failed-1.png), and [live trace](evidence/verification-3/live-frame-rate/trace.zip).

## Mandatory first read — PASS

On a cold 390 × 844 visit, the first screen says what to do: **“Plan a five-move museum heist.”** It says who it is for: solo players wanting a short daily puzzle rather than another word game. The visible first action is **Try it with sample data**, beside “Open a ready practice gallery.” The actual daily board starts at y=760.97 px and appears in the first viewport, so the capture is the game rather than a menu wall.

The action opens `/?demo=1` in one click. The demo board starts at y=347.69 px, within the first 390 vertical pixels, and shows the seeded gallery, controls, guard loops, and persistent **Demo — sample data, nothing is saved to your daily game** banner with reset and exit actions.

Evidence: [desktop first screen](evidence/verification-3/first-read-desktop.png), [mobile first screen](evidence/verification-3/first-read-mobile.png), and [demo verifier capture](evidence/verification-3/verify-demo/screenshot-mobile.png).

## Claims gate — 16/17 PASS

After `npm ci`, every `test` command in `.factory/claims.json` was run separately, in manifest order:

- PASS: `sample-ready`, `free-access`, `complete-run`, `restart-reset`, `local-progress-storage`, `plan-preview`, `visible-guard-loops`, `privacy-default`, `demo-isolation`, `browser-generated`, `touch-controls`, `offline-reload`, `result-glyph`, `solvable-generator`, `exhaustive-generator`, and `original-art-provenance`.
- FAIL: `frame-rate` — 45.83 fps observed, 50 fps required.

Landing, Privacy, Terms, README, and `.factory/copy-audit.md` claim-like copy was cross-checked against the manifest. No additional unlisted product claim was found.

## Clean local gates

- Candidate, HEAD, and `origin/main` were all `2cccef726174bbd969a64b80d12be427194b9912` before verification changes.
- `npm ci`: passed; 61 packages installed and 0 vulnerabilities reported.
- `npm test`: **failed** — 4/4 Vitest tests passed; 20/21 Chromium tests passed; only `@claim:frame-rate` failed at 45.21 fps.
- `npm run build`: passed — `tsc --noEmit` and Vite production build completed and produced `dist/`.
- `npm audit --audit-level=high`: passed with 0 vulnerabilities.
- No separate lint script exists. Type checking is part of the production build.
- Output sizes: JavaScript 23,514 B raw / 8.73 kB gzip; CSS 13,100 B raw / 3.88 kB gzip; self-hosted fonts 57,020 B; mobile scene 19,508 B. All stated JS, CSS, font, and image budgets pass.

## Deployment identity — PASS

Fresh local and live SHA-256 hashes matched byte-for-byte for:

- `index.html`
- `assets/index-CU_AeaY7.js`
- `assets/index-DBf8y65k.css`
- `sw.js`
- `404.html`
- `manifest.webmanifest`
- `art/museum-night-768.webp`
- `fonts/space-grotesk.woff2`

The deployed application matches the candidate build. `npm run test:live` ran all 21 tests against production: 20 passed and only the same frame-rate claim failed.

## Scripted browser-game run — PASS

A fresh live mobile run started on `/`, entered the sample with the one-click action, and reset the demo:

1. With zero moves, **Run the plan** was disabled.
2. Six attempted down inputs filled only five slots; all four direction controls disabled at the boundary.
3. `D,D,D,D,D` reached a real loss: “Move 1 hit a wall. Remove moves and try another route.”
4. Five Backspaces recovered to `0/5` with execution disabled.
5. Sound was enabled and remained enabled after reload.
6. Keyboard input `U,U,L,U,L,Enter` began execution. Pause held turn 0 unchanged for 700 ms, and Resume continued.
7. The real end screen showed **You escaped with the exhibit**, 900 points after two attempts, and glyph `◆△✦△◆`.
8. Copied text contained the same five glyphs and no directions.
9. **Play again** reset to `0/5` and focused the first direction control.
10. A separate touch-only run reached the end screen.

Additional deterministic loss checks produced “Guard spotted you on move 5” for `U,U,D,L,U` and “Five moves ended outside the exhibit room” for `U,U,R,U,U`. This covers the goal, guard challenge, wall/guard/missed-target losses, win condition, boundary input, recovery, pause/resume, restart, persistent sound/progress, keyboard, touch, daily mode, and isolated demo mode.

Evidence: [mobile end screen](evidence/verification-3/end-screen-mobile.png).

## Accessibility, routing, and resilience — PASS

- Axe reported zero serious/critical findings on `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the designed HTTP 404.
- Every route has `lang=en`, one H1, one main landmark, the correct route title, and no horizontal overflow at 390 px.
- The first Tab focuses **Skip to game** with a visible 3 px amber outline.
- The smallest link/button target measured 44 × 44 CSS px across every route.
- At 200% root text on a 390 px viewport, every route retained zero horizontal overflow; application header links ended no farther right than x=314.
- Reduced-motion media matching was active and the deterministic run still reached the end screen.
- No unexpected console or page errors appeared during the complete gameplay request log.
- Every discovered HTTP link returned 200, except the intentional missing-route self skip link; mail links were exempt. The unknown route returned the designed HTTP 404.
- Factory `verify-url.sh` passed root and demo with zero console errors, one H1, `lang=en`, a main landmark, no missing image alt, and no unnamed buttons. Cold network-idle times were 623 ms and 592 ms.

Evidence: [root verification](evidence/verification-3/verify-root/verify.json) and [demo verification](evidence/verification-3/verify-demo/verify.json).

## Privacy, security, caching, and PWA — PASS

- The complete live run requested only `https://five-minute-heist.sociobot.in`; no cookie, analytics, ad, third-party script/font, account form, payment UI, or answer/API request was observed.
- The completed demo stored one key only: `demo:five-minute-heist:progress:sample-glass-gallery`. Its value retained the plan, two attempts, best score, completed result, and sound choice.
- Response headers include CSP with `connect-src 'self'` and response-header `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and restrictive `Permissions-Policy`.
- HTML and the service worker use 30-second revalidation; hashed JS/CSS use one-year immutable caching; fonts and art use one-week caching.
- Service-worker `registration.update()` completed, the worker controlled the page, and a subsequent offline reload showed both the offline-ready message and the playable board.
- This is a static game with no server-side endpoint, unlock call, sign-in, payment, or backend state. API request-allowance/429, Entra authority, concurrency, and server persistence checks are not applicable.

## Web performance — PASS apart from the frame-rate claim

Fresh Lighthouse 12.8.2 mobile results: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.056 s, LCP 1.506 s, TBT 48 ms, CLS 0.0082, total transfer 138,781 B. INP is unavailable without field interaction data. Initial load and bundle budgets pass.

Evidence: [Lighthouse JSON](evidence/verification-3/lighthouse-live.json).

## Severity summary

- Critical: 0
- High: 0
- Medium, release-blocking: 1
- Low: 0

Candidate `2cccef7` is **not accepted** because a mandatory registered claim test fails repeatedly.
