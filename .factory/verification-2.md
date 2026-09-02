# Independent verification 2 — FAIL

**Candidate:** `134f14d40121b807070534ce394f97f80cef3ce7`  
**Live URL:** https://five-minute-heist.sociobot.in  
**Verified:** 2026-09-02 04:57 UTC  
**Verdict:** **FAIL.** The game, claim suite, production build, deployment identity, privacy, offline behavior, and performance all pass. Two manual accessibility requirements are release-blocking: four mobile links are narrower than 44 CSS px, and 200% text sizing clips the header navigation.

## Release-blocking findings

### MEDIUM — mobile link targets are narrower than 44 px

At 390 × 844, a fresh demo exposes these visible link rectangles:

| Link | Measured size |
| --- | ---: |
| Daily | 29 × 44 px |
| Demo | 37 × 44 px |
| Privacy | 43 × 44 px |
| Terms (footer) | 40 × 44 px |

This violates the attached accessibility baseline and the product's own `.factory/design.md`, both of which require targets of at least 44 × 44 CSS px. The game controls themselves meet the requirement. Axe and Lighthouse do not catch this manual target-size failure.

Evidence: [adversarial QA results](evidence/verification-2/qa-live.json).

### MEDIUM — 200% text sizing clips the header navigation

At a 390 px viewport with the root text size set to 200%, the document is 399 px wide. The header navigation ends at x=399 and the Privacy link extends from x=312 to x=399, leaving its rightmost 9 px outside the viewport. This violates the attached requirement that text resize to 200% without loss.

Evidence: [200% text screenshot](evidence/verification-2/qa-live-text-200-mobile.png) and [measured DOM results](evidence/verification-2/qa-live.json).

## Low-severity finding

- **LOW — README omits the intended session length.** `.factory/brief.json` specifies 4–6 minutes and the attached game-loop contract requires README to state the intended run length. README calls it a short daily puzzle but does not state 4–6 minutes. This is a documentation gap, not a gameplay failure.

## Mandatory first read — PASS

On a cold 390 × 844 visit, the first screen says what the product does: “Plan a five-move museum heist.” It names the audience: solo players who want a short daily puzzle without another word game. The first action is **Try it with sample data**, next to “Open a ready practice gallery.” The daily game panel and board are visible in the captured first viewport, so this is not a menu wall.

The action opens `/?demo=1` in one click. In the demo, the playable board begins at y=363.625 px, inside the first 390 vertical pixels, and the persistent demo banner provides **Reset demo** and **Open today’s game**.

Evidence: [mobile first read](evidence/verification-2/first-read-mobile.png), [desktop first read](evidence/verification-2/first-read-desktop.png), and their adjacent JSON request/DOM captures.

## Claims gate — 17/17 PASS

After `npm ci`, every `test` command in `.factory/claims.json` was run separately and passed from the demo entry point:

`sample-ready`, `free-access`, `complete-run`, `restart-reset`, `local-progress-storage`, `plan-preview`, `visible-guard-loops`, `privacy-default`, `demo-isolation`, `browser-generated`, `touch-controls`, `offline-reload`, `result-glyph`, `solvable-generator`, `exhaustive-generator`, `frame-rate`, and `original-art-provenance`.

The clean clone initially had no dependencies, so the first attempted command stopped at `vitest: not found`; `npm ci` installed the locked dependencies, after which all 17 exact commands passed. That initial environment setup condition is not a product test failure.

The live landing copy, README, Privacy page, Terms page, and copy audit were cross-checked against the registry. Their functional/privacy claims are represented. The separate README session-length omission is recorded above.

## Clean local gates

- `npm ci`: passed; 61 packages installed; 0 vulnerabilities.
- `npm audit --audit-level=high`: passed; 0 vulnerabilities.
- `npm test`: passed — 4 Vitest unit tests and 19 Chromium tests.
- `npm run build`: passed — `tsc --noEmit` and Vite production build; `dist/` produced.
- No separate lint command exists. Type checking is part of the production build.
- Production output: JS 23,514 B raw / 8.73 kB gzip; CSS 12,760 B raw / 3.82 kB gzip; initial fonts 57,020 B raw in three local files; mobile scene 19,508 B. The JS, CSS, font, image, and total initial-transfer budgets are comfortably met.

## Deployment identity — PASS

HEAD, `origin/main`, and the requested candidate were all `134f14d40121b807070534ce394f97f80cef3ce7` before report changes.

Fresh local-build and live SHA-256 values matched exactly for:

- `index.html`
- `assets/index-DrVNFsq1.js`
- `assets/index-BJa9ZHv0.css`
- `sw.js`
- `404.html`
- `manifest.webmanifest`
- `art/museum-night-768.webp`
- `fonts/space-grotesk.woff2`

The deployed product is the candidate.

## Scripted game run — PASS

A fresh live mobile demo was reset and played deterministically:

1. With an empty plan, **Run the plan** was disabled.
2. `D,D,D,D,D` filled the five slots; a sixth move was ignored and direction controls disabled.
3. Execution reached the real loss state: “Move 1 hit a wall. Remove moves and try another route.” The attempted plan stayed visible.
4. Backspace removed moves and recovered to `0/5`.
5. Sound was enabled and remained enabled after reload.
6. `U,U,L,U,L` was entered by keyboard. Pause held the board at turn 0 for 700 ms; Resume continued the run.
7. The real end screen showed **You escaped with the exhibit**, 900 points after two attempts, and sealed glyph `◆△✦△◆`.
8. Copy result produced the same five glyphs and no direction arrows.
9. **Play again** reset to `0/5`, retained progress/settings, and focused the first direction control.
10. The valid plan was replayed using touch controls and reached the end screen again.

Evidence: [end screen at 390 px](evidence/verification-2/qa-live-end-mobile.png) and [full scripted results](evidence/verification-2/qa-live.json).

The goal, deterministic guard challenge, wall/guard/route loss paths, win condition, restart, persisted state, keyboard input, touch input, pause/resume, daily mode, and isolated demo mode were all exercised.

## Accessibility and resilience

- Playwright axe: zero serious/critical violations on `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the designed 404.
- Lighthouse mobile: Accessibility 100.
- Semantic smoke test: `lang=en`, one H1, one main landmark, labelled controls, no missing image alt, and valid route titles.
- Keyboard-only: first Tab reveals **Skip to game**; all sampled controls show a 3 px amber focus outline; arrow keys, Backspace, and Enter operate the game.
- Route transitions focus the H1; back navigation restores the routed page.
- Reduced motion: media query matched, hero animation duration became `0.01ms`, smooth scrolling became `auto`, and the run still reached its end screen.
- No unexpected console or page errors occurred. A direct intentional HTTP 404 produces Chromium's expected failed-resource console line but no application error.
- Manual target-size and 200% text checks fail as detailed above.

## Privacy, security, routing, and PWA

- A complete demo run made requests only to the product origin. The seven unique URLs were the document, hashed JS/CSS, three self-hosted fonts, and the mobile museum image.
- No cookies, analytics, ads, external runtime scripts, account forms, payment UI, or answer/API requests were observed.
- Demo storage used only `demo:five-minute-heist:progress:sample-glass-gallery`; the registered isolation test also preserved a daily sentinel through reset/exit.
- Browser response headers include CSP with `connect-src 'self'` and header-delivered `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and restrictive `Permissions-Policy`.
- HTML uses `max-age=30`; hashed JS/CSS use `max-age=31536000, immutable`; fonts and art use one-week caching.
- `/`, `/demo`, `/privacy`, `/terms`, robots, sitemap, manifest, OG image, and the external Param Factory link returned 200. An unknown route returned the designed HTTP 404.
- `registration.update()` completed and the service worker controlled the page. A fresh offline reload showed the offline-ready message and playable board.
- This is a static product with no server-side API, product-unlock endpoint, sign-in, or payment. API 429 allowance and Entra authority checks are not applicable.

## Performance

- Fresh `verify-url.sh`: root network-idle load 659 ms; demo 643 ms; zero console errors.
- Fresh Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.064 s, LCP 1.664 s, TBT 47 ms, CLS 0.0082.
- Independent 390 × 844 frame samples measured 55.0 fps and 56.9 fps, passing the advertised tested floor of 50 fps for the 60 fps target.

Evidence: [Lighthouse JSON](evidence/verification-2/lighthouse-live-verify-2.json), [root URL verifier](evidence/verification-2/verify-live-root/verify.json), and [demo URL verifier](evidence/verification-2/verify-live-demo/verify.json).

## Severity summary

- Critical: 0
- High: 0
- Medium, release-blocking: 2
- Low: 1

Because the attached accessibility baseline is explicitly non-negotiable, passing automated checks does not override the two measured manual failures. Candidate `134f14d…` is **not accepted**.
