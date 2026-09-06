# Verify the five-move museum puzzle — PASS

**Verdict: PASS.** There are **zero findings** at every severity and **zero untested public claims**.

The implementation reviewed is `60649193d3fcf59fa355dedae024094ba85c3e20`. The documentation and deployment-evidence base is `8dbeb652790deea812ed0630081fac759fe0dc6d`. The commits after the implementation contain only reports and evidence; they do not change the product image.

Live URL: `https://five-minute-heist.sociobot.in`

## First screen before scrolling

Fresh 390 × 844 phone and 1440 × 900 desktop contexts opened the live root at scroll position zero.

- Job: **Plan a five-move museum heist.**
- Audience: solo players who want a short daily puzzle without another word game.
- First action: **Try it with sample data**, followed by **Open a ready practice gallery.**

The game board is visible on both first screens, so the site opens on the game rather than a menu. Evidence: [phone](evidence/verification-6/cold-phone.png) and [desktop](evidence/verification-6/cold-desktop.png).

## Claims — 18/18 pass

From a detached clean checkout at the implementation SHA, I installed the documented prerequisites with `npm ci`. I then ran every exact `test` command in `.factory/claims.json` separately, in manifest order.

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
| `session-length` | PASS — 273,415 ms from ready board to the real win screen |
| `original-art-provenance` | PASS |

The full local suite repeated the duration check at 273,406 ms. The full live suite repeated it at 273,394 ms. All three results are inside the declared 240,000–360,000 ms range.

The first claim attempt stopped before testing because I had installed dependencies in the repository root instead of the detached checkout. After running `npm ci` in the correct checkout, I restarted from claim 1 and all 18 commands exited zero. After the last claim passed, an optional summary formatter returned 127 because `column` is not installed. Neither harness mistake is a product or claim failure.

I also cross-checked the live page, policy pages, README, copy audit, and manifest. Every public promise is covered by a registered observable test. Untested public claims: **0**.

## Game, sample, and recovery paths

The one-click action opened a populated **Sample gallery** with two six-position guard loops, five plan slots, and the persistent **Demo — sample data, nothing is saved to your daily game** label. The sample board began inside the first 390 vertical pixels on the phone.

A fresh touch run checked wall, guard, and missed-goal losses. Each loss gave a plain recovery instruction. **Reset demo** returned the plan to `0/5` while preserving a daily-data sentinel. A valid `U,U,L,U,L` plan paused and resumed, then reached **You escaped with the exhibit**, 1,000 points, and `◆△✦△◆`. **Play again** reset the plan. Evidence: [loss](evidence/verification-6/phone-loss.png), [phone win](evidence/verification-6/phone-win.png), and [direct run results](evidence/verification-6/live-check.json).

A separate desktop context entered the same plan with Arrow keys and Enter and reached the 1,000-point end state. Leaving the sample removed every `demo:five-minute-heist:` key and preserved the daily sentinel. The empty-plan Run button, sixth move boundary, Backspace recovery, pause/resume, and completed-plan reset all passed in the full suites.

No multiplayer, paid mode, account, backend, or AI feature is advertised or required. Tenant isolation, backend restart persistence, health, and 429/`Retry-After` checks do not apply to this static solo game.

## Accessibility, mobile, and motion

- The live suite passed all 26 browser tests.
- Playwright Axe found zero serious or critical issues on `/`, both demo URLs, `/privacy`, `/terms`, and the 404 page.
- The URL verifier found `lang=en`, one H1, a main landmark, complete image alternatives, named buttons, and no console errors on root and demo. Root loaded in 627 ms; demo loaded in 600 ms. Evidence: [root result](evidence/verification-6/verify-root/verify.json) and [demo result](evidence/verification-6/verify-demo/verify.json).
- All interactive links and buttons tested at least 44 × 44 CSS px. Adjacent direction controls, demo actions, and wrapped header rows kept at least 8 CSS px at normal and 200% text.
- Every public route fit at 390 px with 200% text and no clipped header link or horizontal overflow.
- Keyboard play, Tab focus, a 3 px visible focus outline, skip link, route focus restoration, and back navigation passed.
- Board and result state have accessible names; status changes use live regions. There is no dialog or custom input trap.
- A fresh reduced-motion context completed a win. No rapid flashing or required precision timing was found.

## Privacy, offline use, and routes

The complete direct run produced no external request, cookie, console error, or page error. Demo reset and exit changed only sample storage. Daily progress stayed intact.

After service-worker control and update, a fresh context reloaded the populated sample offline and completed a win. The live service worker is byte-for-byte identical to the candidate build.

`/privacy` and `/terms` return 200 with their own titles and headings. `/not-a-real-page` deliberately returns HTTP 404 with **Page not found** and a link back to the game. This expected 404 is not an error. Internal links passed; the external factory link was not fetched because it is outside this work order.

## Build, deployment identity, and performance

- `npm ci`: PASS; 61 packages installed and zero vulnerabilities.
- `npm audit --audit-level=high`: PASS; zero vulnerabilities.
- `npm run build`: PASS; `dist/` produced.
- `npm test`: PASS; 4 core tests and 26 local browser tests.
- `npm run test:live`: PASS; 26/26 HTTPS browser tests.
- JavaScript: 23.54 kB raw / 8.72 kB gzip. CSS: 13.19 kB raw / 3.88 kB gzip.
- Fresh active-play samples: 60.006, 60.006, and 60.006 fps; median 60.006 fps, above the tested 50 fps floor.
- Twenty fresh phone loads: 253 ms p95 to load and display the board, below the 2 second target.
- Latest candidate Lighthouse evidence: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.35 s, TBT 116.5 ms, CLS 0.0015, and 138,854 B transfer.

The deployed root HTML, service worker, 404 document, hashed JavaScript, and hashed CSS all have the same SHA-256 values as the clean `dist/` build. Hashed JS and CSS return `Cache-Control: public, max-age=31536000, immutable`. Security headers include the matching CSP, `nosniff`, and strict-origin referrer policy.

## Earlier findings

| Earlier finding | Current disposition and proof |
| --- | --- |
| Review 1 `F-1-1` | Fixed. One click opens the populated sample; its phone board starts above 390 px. |
| Review 1 `F-1-2` | Fixed. Hashed live JS and CSS use one-year immutable caching. |
| Review 1 `F-1-3` | Fixed. Unknown paths return the designed HTTP 404. |
| Review 1 `F-1-4a`–`F-1-4m` | Fixed. Every resulting promise is registered and passed. The duration promise now has its own timed outcome test. |
| Review 1 `F-1-5`–`F-1-7` | Fixed. Demo navigation remains visible on phone, actions name their result, and both 404 forms say **Page not found**. |
| Review 2 `F-1-4j` | Fixed. The restored 4–6 minute statement is backed by the eighteenth claim and three passing board-to-win measurements. |
| Review 2 `F-2-1`–`F-2-10` | Fixed. Copy remains within the recorded word limits, uses consistent terms, and states privacy behavior plainly. |
| Verification 2 mobile targets | Fixed. All checked controls meet 44 × 44 px, and all public routes fit at 200% text. |
| Verification 2 README duration | Fixed. README states 4–6 minutes and links the measurement method. |
| Verification 3 frame rate | Fixed. The registered claim, full suites, and fresh direct samples pass the 50 fps floor. |
| Review 5 `F-5-1` | Fixed. Geometry checks pass at 8 px for adjacent phone controls at normal and 200% text. |
| Review 5 `F-5-2` | Fixed. README states the intended session and claim `session-length` passed separately, locally, and live. |

## Finding count

- Critical: 0
- High: 0
- Medium: 0
- Low: 0
- Untested public claims: 0

**Final verdict: PASS.**
