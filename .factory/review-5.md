# Review 5 — Plan a five-move museum heist

**Reviewed:** 2026-09-06 UTC

**Live URL:** https://five-minute-heist.sociobot.in

**Implementation candidate:** `9ca7b1658f9c7edc54f9d3db77d05401d8a3df16`

**Documentation baseline:** `23ed6f63d9165c5db7d75ffef25b2181d9d5a00e`
**Verdict: FAIL**

This strict review found **two low-severity findings** and **zero untested public claims**. The game loop and all declared claims pass, but a PASS requires zero findings.

## First screen

Fresh, unscrolled browsers at 390 × 844 and 1440 × 900 showed:

- Job: **Plan a five-move museum heist.**
- Audience: **Solo players who want a short daily puzzle without another word game.**
- First action: **Try it with sample data.**

The game board is visible in the first viewport on both sizes. One click opens a populated **Sample gallery**. On the phone, its board starts at 335.625 px. The demo label, two six-position guard loops, five plan slots, reset action, and exit action are present.

Evidence: [phone first screen](evidence/review-5/cold-phone.png), [desktop first screen](evidence/review-5/cold-desktop.png), and [live run data](evidence/review-5/live-check.json).

## Findings

### F-5-1 — Adjacent phone controls have less than 8 px spacing

**Severity:** Low, release-blocking under the zero-finding rule.

At 390 × 844, each direction button is 82.5 × 44 px, but the three horizontal gaps between them are 6 px. At 200% text size, the direction gaps remain 6 px, the two demo actions have a 6 px vertical gap, and the wordmark-to-navigation row gap is 4 px.

The controls meet the 44 × 44 px target-size minimum, but the attached design contract also requires at least 8 px between adjacent targets. The current mobile rules set `.controls { gap: 6px; }`, `.demo-banner { gap: 6px 8px; }`, and the wrapping header has a 4 px row gap.

**Required fix:** Keep at least 8 px between adjacent interactive targets at normal and 200% text sizes. Add a browser assertion for edge-to-edge spacing, not only target width and height.

Evidence: [touch spacing measurements](evidence/review-5/touch-spacing.json).

### F-5-2 — README still omits the intended session length

**Severity:** Low, release-blocking under the zero-finding rule.

Independent verification 2 reported this exact low-severity gap: the brief specifies a 4–6 minute session, and the browser-game contract requires the README to state the intended run length. The current README names the product but does not state the session length.

The history shows a conflict that was not fully resolved. A later edit added an untested **4–6 minute** promise, Review 2 correctly rejected that promise as `F-1-4j`, and implementation `9ca7b16` removed it. That fixed the untested claim but reinstated the earlier documentation omission.

**Required fix:** Add an explicit intended session length backed by a defensible timed-player measurement and registered claim test. Do not restore an untested duration promise.

## Declared claims

From clean checkout `23ed6f6`, `npm ci` passed with zero vulnerabilities. Every exact `test` command in `.factory/claims.json` then ran separately in manifest order.

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

The 17 registry IDs each have exactly one matching `@claim:<id>` test. Landing, game, policy, README, demo, and generated-art statements were cross-checked against the registry. No unlisted public claim was found.

## Complete game runs

A fresh phone browser used touch controls. It entered the sample, then exercised:

1. `D,D,D,D,D`: wall loss with a clear recovery action.
2. `U,U,D,L,U`: guard-collision loss.
3. `U,U,R,U,U`: five-move missed-goal loss.
4. Reset, persisted sound choice, pause and resume.
5. `U,U,L,U,L`: 1,000-point win with result symbols `◆△✦△◆`.
6. **Play again**: plan returned to 0/5.

A fresh desktop browser entered `U,U,L,U,L` with Arrow keys and Enter and reached the 1,000-point win screen. The registered clipboard test copied the same five symbols and rejected direction leakage.

A daily-data sentinel survived demo entry, reset, and exit. All `demo:five-minute-heist:` keys were removed on exit. The sample did not change daily data. The persistent sample label remained present through loss and win.

Evidence: [phone loss](evidence/review-5/phone-loss.png), [phone win](evidence/review-5/phone-win.png), and [desktop keyboard win](evidence/review-5/desktop-win.png).

## Quality, accessibility, privacy, routes, and performance

- `npm test`: PASS — 4 unit tests and 24 local Chromium tests.
- `npm run build`: PASS — `dist/` produced; JavaScript is 23.54 kB raw / 8.72 kB gzip, and CSS is 13.19 kB raw / 3.90 kB gzip.
- `npm audit --audit-level=high`: PASS — zero vulnerabilities.
- `npm run test:live`: PASS — 24/24 live tests.
- URL verifier: PASS on root in 677 ms and demo in 592 ms, with correct title, language, one H1, main, image alternatives, button names, and no console errors.
- Axe: zero violations of any severity across root, both demo URLs, Privacy, Terms, and the 404 page.
- Keyboard: all 15 enabled demo controls were reached as native links or buttons and showed a 3 px focus outline. Arrow keys, Backspace, Enter, route focus, and back navigation passed.
- Responsive behavior: every target is at least 44 × 44 px, and all routes retain content at 200% text without horizontal overflow. F-5-1 records the separate spacing defect.
- Reduced motion: a fresh reduced-motion context completed a win.
- Offline/update: a fresh context updated the controlling service worker, reloaded offline, showed the offline notice, and completed a win.
- Privacy: the fresh live runs set no cookies and made no request outside the product origin. No analytics, ads, account, payment, or answer request appeared.
- Links: all discovered same-product links returned 200. The deliberate missing-page link returned its expected 404. The two `mailto:` actions were recognized. The external factory link was identified but not fetched because it is outside this product’s scope.
- Routes: root, demo, Privacy, Terms, robots, sitemap, service worker, manifest, social image, and icons returned 200. The unknown route returned the designed HTTP 404 with **Page not found** and a recovery link.
- Security: live headers include same-origin CSP, header-delivered `frame-ancestors 'none'`, HSTS, `nosniff`, Referrer Policy, and Permissions Policy.
- Performance: three active phone samples measured 60.000, 60.006, and 60.006 fps; median 60.006 fps. Twenty fresh phone loads measured a 237 ms p95.
- Lighthouse 13.0.1 wrote complete results: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 40 ms, CLS 0.001, total transfer 136 KiB. Chromium crashed only while Lighthouse collected its final full-page screenshot, after the audit data was written. This is a host-tool artifact, not a product runtime error.

Evidence: [Axe, structure, keyboard, and links](evidence/review-5/a11y-results.json), [root verifier](evidence/review-5/verify-root/verify.json), [demo verifier](evidence/review-5/verify-demo/verify.json), and [Lighthouse output](evidence/review-5/lighthouse-mobile.json).

## Candidate and earlier findings

Commits after `9ca7b16` change only `.factory` reports and evidence. A clean build directly from `9ca7b16` matched the live SHA-256 values for `index.html`, `sw.js`, `404.html`, `manifest.webmanifest`, `assets/index-BiFJaNK4.js`, and `assets/index-CnxBolkV.css`. The live site is the implementation candidate.

| Earlier finding | Current disposition |
| --- | --- |
| Review 1 `F-1-1` through `F-1-3` | Fixed: sample board is above 390 px; assets are versioned and immutable for one year; unknown paths return the designed 404. |
| Review 1 `F-1-4a` through `F-1-4m` | Fixed: the resulting claims are registered and pass; no answer list or unmeasured duration text is present. |
| Review 1 `F-1-5` through `F-1-7` | Fixed: phone Demo navigation remains visible, actions name outcomes, and 404 headings are literal. |
| Review 2 `F-1-4j` | Fixed: the untested 4–6 minute promise remains absent. |
| Review 2 `F-2-1` through `F-2-10` | Fixed: current copy is short, uses consistent terms, and states privacy behavior plainly. |
| Verification 2 mobile target-size and 200% text findings | Fixed: targets meet 44 × 44 px and all public routes fit at 200% text. |
| Verification 2 README session-length finding | **Open as F-5-2.** Removing the later untested duration claim restored this omission. |
| Verification 3 frame-rate finding | Fixed: the claim command, full live suite, and fresh direct measurements pass the 50 fps floor. |

This is a static local-first game. It has no backend, tenant, health endpoint, or request allowance. Tenant isolation, server restart persistence, and 429/`Retry-After` checks do not apply. No AI, import, sync, paid feature, or multiplayer mode is promised or needed for the stated job.

## Result

- Critical: 0
- High: 0
- Medium: 0
- Low: 2
- Untested public claims: 0

**FAIL — 2 findings, 0 untested claims.**
