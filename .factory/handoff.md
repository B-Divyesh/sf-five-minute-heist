# Five-Minute Heist handoff

## Current review status

Review 5 returns **FAIL — 2 low-severity findings and 0 untested claims**. The live game and all 17 claims pass, but adjacent phone controls have less than the required 8 px spacing. The README also still omits the intended 4–6 minute session length identified in verification 2.

No product code was changed in review 5. Implementation `9ca7b1658f9c7edc54f9d3db77d05401d8a3df16` remains live and matches a clean build. See [review-5.md](review-5.md) and `evidence/review-5/`.

## Repair 3 implementation outcome

Repair 3 is complete and deployed. The implementation candidate is `9ca7b1658f9c7edc54f9d3db77d05401d8a3df16`; later report and evidence commits do not change the deployed product.

The untested 4–6 minute README promise is removed. All ten review-2 copy findings are fixed in the interface, README, claim registry, demo notes, and copy audit. Version 1.1.2 is live at `https://five-minute-heist.sociobot.in`.

## Finding disposition

| Finding | Current disposition and evidence |
| --- | --- |
| F-1-1 | Fixed. One click opens `/?demo=1`; the live phone board starts at 335.6 px and the sample label remains visible through play and reset. `@claim:sample-ready` checks the generated board, both guard loops, five slots, label, and position. |
| F-1-2 | Fixed. Vite emits versioned assets; live JS and CSS return `max-age=31536000, immutable`. |
| F-1-3 | Fixed. `/not-a-real-page` returns HTTP 404 with the designed `Page not found` page. Its supporting copy is now literal rather than metaphorical. |
| F-1-4a–i, k–m | Fixed. The corresponding registered outcome tests pass independently: sample readiness, free access, saved progress, previews, guard loops, privacy, demo isolation, browser generation, touch, exhaustive validation, and artifact scanning. |
| F-1-4j | Fixed again. README no longer makes an unmeasured 4–6 minute promise. No public duration claim remains. |
| F-1-5 | Fixed. Daily, Demo, and Privacy remain visible and at least 44 × 44 CSS px on phone routes. |
| F-1-6 | Fixed. Actions use `Open today’s game`, `Turn sound on`, and `Turn sound off`. |
| F-1-7 | Fixed. Both app and server 404 pages use `Page not found`. |
| F-2-1 | Fixed. The 26-word test sentence is split into two short sentences. |
| F-2-2 | Fixed. Player-facing copy and the accessible result label use `result symbols`. `@claim:result-symbols` compares the visible five symbols with the copied result and rejects direction disclosure. |
| F-2-3 | Fixed. The game shows `Sample gallery` or the current date, not an internal seed. README says the same date creates the same gallery. |
| F-2-4 | Fixed. Landing copy says demo progress stays separate from daily progress. |
| F-2-5 | Fixed. README explains the demo key prefix as separate storage without using `namespace`. |
| F-2-6 | Fixed. README states the Playwright version and compatibility in plain words. |
| F-2-7 | Fixed. README describes repeatable logic tests and local browser checks in plain words. |
| F-2-8 | Fixed. README calls the build files `versioned` and explains the result. |
| F-2-9 | Fixed. README states the one-year cache outcome, known-route handling, and 404 behavior in three sentences. |
| F-2-10 | Fixed. Privacy copy names code, fonts, and images loaded from other sites; the same-origin request test passes. |
| Verification-2 mobile findings | Fixed and retained. All public links pass 44 × 44 px checks; all public pages fit at 200% text on a 390 px viewport. |
| Verification-3 frame-rate finding | Fixed and retained. Three fresh live phone samples measured 60.0, 60.0, and 60.0 fps. |

## Verification

Clean checkout: `/tmp/fmh-repair3.pbXsh4/repo` at `9ca7b16`.

- `npm ci`: passed; 61 packages installed; 0 vulnerabilities.
- Every command in `.factory/claims.json`: 17/17 passed independently in manifest order.
- `npm test`: passed; 4 logic tests and 24 Chromium tests.
- `npm run build`: passed and produced `dist/`.
- `npm audit --audit-level=high`: passed with 0 vulnerabilities.
- Output: JavaScript 23,540 B raw / 8.72 kB gzip; CSS 13,191 B raw / 3.90 kB gzip; local fonts 57,020 B; phone scene 19,508 B.
- Local and live URL verification: title, `lang=en`, one H1, main landmark, image alternatives, named buttons, and zero console errors passed for root and demo.
- Playwright axe integration: zero serious or critical issues across root, both demo URLs, Privacy, Terms, and the HTTP 404.
- Live `npm run test:live`: 24/24 passed.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s, LCP 1.5 s, TBT 0 ms, CLS 0.038.

The live deployment completed as `fb9b00ac-9caa-4b55-a519-b072d7cfe01c`. SHA-256 hashes match between `dist/` and HTTPS for the HTML, JS, CSS, service worker, 404 page, manifest, and phone art.

## Cold read and game run

Fresh 390 × 844 and 1440 × 900 browsers, before scrolling, state:

- Job: `Plan a five-move museum heist`.
- Audience: solo players who want a short daily puzzle instead of another word game.
- First action: `Try it with sample data`.

The phone root shows the game board within its first viewport. The one-click sample shows its board at 335.6 px, plus the persistent `Demo — sample data, nothing is saved to your daily game` label.

A fresh live phone and desktop run entered the sample, reset it, and played `D,D,D,D,D` to the wall-loss message. Both recovered and played `U,U,L,U,L` to `You escaped with the exhibit`, 900 points after two attempts, and result symbols `◆△✦△◆`. A separate clean win captured the 1,000-point end screen. The only stored key was `demo:five-minute-heist:progress:sample-glass-gallery`; no cookie, daily-data write, foreign request, or console error appeared.

Evidence:

- [Live phone end screen](evidence/repair-3/live-run/end-phone-viewport.png)
- [Live desktop end screen](evidence/repair-3/live-run/end-desktop-viewport.png)
- [Live root verifier](evidence/repair-3/live-root/verify.json)
- [Live demo verifier](evidence/repair-3/live-demo/verify.json)
- [Lighthouse report](evidence/repair-3/lighthouse-live.json)

## Repair 3 remaining scope record

At the repair 3 handoff, no product defect was known. The brief’s 4–6 minute target was treated as intent rather than a measured public promise. Review 5 supersedes that status below.

This is a static, local-first game. Backend persistence, tenant isolation, API health, and 429 behavior do not apply. AI would not improve the five-move puzzle job, so no model or external integration was added.

## Independent verification 5

**PASS — zero findings and zero untested claims.** Independent QA reviewed implementation `9ca7b1658f9c7edc54f9d3db77d05401d8a3df16` at documentation head `7bb9f3a466b17d9b05c0e18fa5d3f3d139b23434`.

- Clean dependencies: `npm ci` passed with zero audit vulnerabilities.
- Every `.factory/claims.json` command passed separately: 17/17 claims. `npm test` passed 4 unit and 24 local browser tests; `npm run test:live` passed 24/24.
- `npm run build` passed. Live HTML, JS, CSS, and service-worker hashes equal a fresh candidate build.
- Fresh live phone and desktop runs showed the job, audience, and `Try it with sample data` before scroll and the game board in the first viewport. Both completed a loss-to-recovery-to-win route; touch and keyboard worked; reset/play-again cleared the plan; demo storage did not affect daily storage.
- Independent active-play phone frame samples were 60.006, 60.000, and 60.000 fps (60.000 fps median; 50 fps claim floor).
- URL verifier, Axe checks, privacy/request checks, offline reload, route titles, reduced motion, focus, 200% text, 44 px targets, legal pages, and designed 404 all passed. The 404 is deliberately HTTP 404 and not a defect.
- Lighthouse mobile output was Performance 99, Accessibility 100, Best Practices 100, SEO 100 (FCP 1.1 s, LCP 1.2 s, TBT 110 ms, CLS 0.001). Lighthouse’s browser crashed only while collecting its final screenshot after writing results; this is a host-tool incident, not a product runtime error.

Evidence and the detailed finding disposition are in [verification-5.md](verification-5.md) and `evidence/verification-5/`. No known product defect remains.

## Review 3

**PASS — zero findings and zero untested claims.** Review 3 independently checked implementation `9ca7b1658f9c7edc54f9d3db77d05401d8a3df16` against the live site. The review began from documentation head `af5c66e9179e78389922741954a2ea10670c683d`; the later report commit does not alter the product image.

- A clean checkout completed `npm ci`, all 17 declared claim commands separately, `npm test`, `npm run build`, and `npm audit --audit-level=high` with no failures or high vulnerabilities.
- `npm run test:live` passed all 24 live browser tests. Root and demo also passed the URL verifier with no console errors.
- Fresh phone and desktop browser runs stated the job, audience, and sample action before scroll. The phone run reached a loss, reset, and touch win; the desktop keyboard run won. Demo data stayed separate from daily data.
- Three fresh phone active-play readings were 60, 60, and 60 fps. The expected unknown route returns the designed HTTP 404.

See [review-3.md](review-3.md) and `evidence/review-3/` for screenshots, verifier output, and the scripted live-run data. No known product defect remains.

## Review 4

**PASS — zero findings and zero untested claims.** Review 4 checked implementation `9ca7b1658f9c7edc54f9d3db77d05401d8a3df16` at documentation head `43e6a59f366216be8dd2301a4ca482fc64a8f25e`. The later commits still change reports and evidence only.

- `npm ci`, each of the 17 declared claim commands, `npm test`, `npm run build`, `npm audit --audit-level=high`, and the 24-test live suite passed.
- A fresh touch phone run completed loss → reset → 1,000-point win → replay reset. A fresh desktop keyboard run won and proved demo storage could not alter daily storage.
- Fresh offline and reduced-motion contexts stayed playable. URL verifier and Axe coverage passed; direct requests recorded no external runtime origin, cookies, or console error.
- The live HTML, service worker, JS, and CSS hashes equal a new candidate build. The designed unknown route remains the expected HTTP 404.

See [review-4.md](review-4.md) and `evidence/review-4/` for the detailed evidence.

## Review 5

**FAIL — 2 low-severity findings and 0 untested claims.** Review 5 checked implementation `9ca7b1658f9c7edc54f9d3db77d05401d8a3df16` from documentation baseline `23ed6f63d9165c5db7d75ffef25b2181d9d5a00e`.

- At 390 px, adjacent direction controls have 6 px gaps. At 200% text, the wrapping header has a 4 px gap and the demo actions have a 6 px gap. The required minimum is 8 px.
- The README does not state the intended 4–6 minute session length. Verification 2 reported this omission. Adding an untested duration claim and then removing it did not resolve both the game-documentation and claims requirements.
- All 17 declared claims passed independently after a clean `npm ci`. `npm test`, `npm run build`, `npm audit --audit-level=high`, and all 24 live browser tests passed.
- Fresh phone and desktop runs covered touch, keyboard, wall/guard/missed-goal losses, reset, recovery, pause/resume, a 1,000-point win, result symbols, replay reset, sound persistence, demo isolation, reduced motion, and offline completion.
- Axe found zero violations across all six public route forms. URL verification, route/link checks, same-origin request checks, and candidate-to-live file hashes passed.
- Three active phone samples measured a 60.006 fps median. Twenty fresh phone loads measured a 237 ms p95. Lighthouse recorded 100/100/100/100, LCP 1.4 s, TBT 40 ms, CLS 0.001, and 136 KiB transferred before its Chromium tab crashed during final screenshot collection.

Next work: increase all adjacent phone-control gaps to at least 8 px and add a geometry regression test. Add the intended session length only with a defensible timed-player measurement and registered claim test. Re-run every claim and the strict live review after deployment.
