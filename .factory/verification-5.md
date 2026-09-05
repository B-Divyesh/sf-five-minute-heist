# Independent verification 5 — PASS

Verified 2026-09-05 against `https://five-minute-heist.sociobot.in`.

**Verdict: PASS.** There are **zero findings** at every severity and **zero untested public claims**. The deployed game matches implementation candidate `9ca7b1658f9c7edc54f9d3db77d05401d8a3df16`. The documentation head is `7bb9f3a466b17d9b05c0e18fa5d3f3d139b23434`; it contains reports only and does not change the candidate image.

## First screen

Fresh phone (390 × 844) and desktop (1440 × 900) contexts, before scrolling, showed:

- Job: **Plan a five-move museum heist.**
- Audience: **Solo players who want a short daily puzzle without another word game.**
- First action: **Try it with sample data.**

The actual board is on the first screen on both devices. Evidence: [phone first screen](evidence/verification-5/cold-phone.png) and [desktop first screen](evidence/verification-5/cold-desktop.png).

## Claims gate — 17/17 PASS

Started from the clean `7bb9f3a` checkout, installed the documented Node prerequisites with `npm ci`, and ran every `test` command in `.factory/claims.json` separately in manifest order. Each command passed its four logic tests and its one tagged browser test. A later full local suite also passed, so no public claim is untested.

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

The live 24-test run also passed; Playwright records its final status as `passed` with no failed tests.

## Browser-game and demo run — PASS

On a fresh live phone context, one click opened the populated `Sample gallery` and kept the persistent **Demo — sample data, nothing is saved to your daily game** label visible. The deliberate invalid `D,D,D,D,D` plan reached a clear, recoverable loss state. After **Reset demo**, `U,U,L,U,L` reached **You escaped with the exhibit** for 1,000 points. **Play again** returned the plan to `0/5`.

On a fresh live desktop context, the same valid plan entered by Arrow keys and Enter reached the scored end screen. A daily local-storage sentinel survived entering, resetting, and leaving demo; every `demo:five-minute-heist:` key was removed. This proves the sample did not change daily data.

The three fresh active-play phone samples measured 60.006, 60.000, and 60.000 fps; median 60.000 fps, above the advertised 50 fps floor. The scripted live run log is [live-check.json](evidence/verification-5/live-check.json). End-screen evidence: [phone loss](evidence/verification-5/phone-loss.png), [phone win](evidence/verification-5/phone-win.png), and [desktop keyboard win](evidence/verification-5/desktop-win.png).

## Quality, accessibility, privacy, and routes — PASS

- `npm test`: passed — 4 unit tests and 24 local Chromium tests.
- `npm run build`: passed and produced `dist/`. Output is 23,540 B JavaScript (8.72 kB gzip), 13,191 B CSS (3.90 kB gzip), and 57,020 B local fonts.
- `npm run test:live`: passed — 24/24 live Chromium tests.
- `npm audit --audit-level=high`: passed with zero vulnerabilities.
- `/opt/fleet/lib/verify-url.sh https://five-minute-heist.sociobot.in …`: passed. It found a 664 ms load, the expected title and `lang=en`, one H1, a main landmark, no missing image alternatives or unnamed buttons, and no console errors. Its report is [verify.json](evidence/verification-5/verify-root/verify.json).
- The live suite tested skip-link focus, a designed 3 px focus outline, keyboard completion/recovery, pause/resume, touch completion, reduced motion, 44 × 44 px links, and 200% text at 390 px. It ran Axe with zero serious or critical issues on root, both demo URLs, Privacy, Terms, and the 404 page.
- The direct live run made no external requests, set no account or payment UI, and the privacy claim test passed with no cookies, analytics, ads, or external code/font/image requests. The service-worker sample offline reload test passed.
- `/`, `/demo`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, `/sw.js`, and `/manifest.webmanifest` return 200. `/not-a-real-page` returns the expected HTTP 404 with the designed **Page not found** screen, correct title, recovery link, and no product defect. The expected navigation-404 console resource message was excluded from the no-console-error check; it is not a broken-page error.
- The live HTML, JS, CSS, and service worker SHA-256 values exactly match a fresh candidate build. Versioned JS and CSS have `max-age=31536000, immutable`.
- Lighthouse 13.4.1 mobile audit generated scores of Performance 99, Accessibility 100, Best Practices 100, and SEO 100; FCP 1.1 s, LCP 1.2 s, TBT 110 ms, CLS 0.001. The local browser process crashed during Lighthouse’s final screenshot collection after audit data had been written, so this measurement is recorded as a host-tool incident, not a product console or runtime error. The complete audit is [lighthouse-mobile.json](evidence/verification-5/lighthouse-mobile.json).

The external `Built by Param Factory` link is visibly marked as opening a new tab. It was not fetched because this work order prohibits connecting to another product.

## Earlier findings — current disposition

| Earlier finding | Disposition and current proof |
| --- | --- |
| Verification 2: undersized mobile links and clipped 200% text | Fixed. All public routes pass 44 × 44 px link checks and 200% text width checks in the live suite. |
| Verification 3: 50 fps claim failure | Fixed. The registered claim passed; fresh independent phone measurements have a 60.000 fps median. |
| Review 1 F-1-1 through F-1-3 | Fixed. One-click populated demo remains above the phone fold; versioned assets cache for one year; unknown route is a real designed HTTP 404. |
| Review 1 F-1-4a through F-1-4m | Fixed. Every resulting public claim is registered and individually passed above; the previous unmeasured duration wording is absent. |
| Review 1 F-1-5 through F-1-7 | Fixed. Demo navigation is visible on phone, controls name their actions, and both 404 forms say **Page not found**. |
| Review 2 F-1-4j | Fixed. No public 4–6 minute duration promise remains. |
| Review 2 F-2-1 through F-2-10 | Fixed. The current copy audit records no sentence over 22 words, no prohibited jargon in the cited lines, consistent `result symbols`, and explicit same-site privacy wording. |

## Scope notes

This is a static local-first browser game. It has no backend, account tenant, API health endpoint, or rate-limited live request allowance; tenant isolation, restart persistence, and 429/`Retry-After` checks do not apply. No AI feature is implied by the puzzle job.

