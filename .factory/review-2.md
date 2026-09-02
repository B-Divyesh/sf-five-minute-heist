# Adversarial first-read review 2 — Five-Minute Heist

**Reviewed:** 2026-09-02 UTC  
**Live URL:** https://five-minute-heist.sociobot.in  
**Candidate:** `70f8f4e54c9dc24398999dfb212bd90b72adf677`  
**Verdict:** **FAIL**

The first screen, demo, registered claims, routes, and accessibility checks work. The review still fails because an earlier untested duration claim has regressed and the copy audit has remaining plain-language findings.

## Cold first read

Fresh browser contexts were opened at 390 × 844 and 1440 × 900 before scrolling.

- **What it does:** It asks me to plan five moves through a daily museum grid while accounting for moving guards.
- **For whom:** It is for a solo player who wants a short daily puzzle that is not another word game.
- **What to click first:** **Try it with sample data**.

Both viewports answer all three questions. The exact first-screen copy is **“Plan a five-move museum heist”**, **“For solo players who want a short daily puzzle without another word game”**, and **“Try it with sample data.”** The mobile first screen also exposes the top of **Today’s gallery**. No first-screen blocker remains.

## Findings

### Blocking

#### F-1-4j — The untested 4–6 minute claim has regressed

**Exact quote/location:** `README.md:5`: **“Five-Minute Heist is a free 4–6 minute game for one browser player.”**

**Evidence:** Review 1 required this claim to be removed because `.factory/claims.json` had no timing entry. `polish-1.md` recorded it as removed. The sentence is present again, while the registry still has no test that measures a human session lasting 4–6 minutes. `git blame` attributes the reintroduction to `8a62cf0`.

**Why this fails:** A player could rely on the stated time commitment. Passing the frame-rate claim does not test session duration. The history rule makes a regressed earlier finding blocking under its original ID.

**Concrete fix:** Remove **“4–6 minute”** again: **“Five-Minute Heist is a free game for one person playing in a browser.”** If the duration is retained, add a defensible measurement method, a matching claims entry, and exactly one `@claim:` test.

### Minor

#### F-2-1 — One README sentence exceeds 22 words and carries six ideas

**Exact quote/location:** `README.md:45`, 26 words: **“The suite verifies real HTTP routing, a 390 × 844 layout, accessibility, privacy, offline reload, and a 50 fps median floor from three active game runs.”**

**Why this matters:** The reader must unpack six checks in one sentence, and it exceeds the plain-words hard cap.

**Concrete fix:** **“The suite checks routes, the 390 × 844 layout, accessibility, privacy, and offline reload. It also checks three runs against a 50 fps median floor.”**

#### F-2-2 — “Sealed glyph” is unexplained jargon and its name changes

**Exact quotes/locations:** Landing: **“A sealed glyph shares the result without directions.”** README: **“copy a sealed result glyph.”** The completed-game accessible label calls it **“Sealed path.”**

**Why this matters:** “Glyph” and “sealed” do not tell a first-time player that the result is five spoiler-free symbols. Three names are used for the same output.

**Concrete fix:** Use **result symbols** everywhere. Landing: **“Five result symbols let you share without revealing your directions.”** README: **“Run the plan, then copy five result symbols that hide your directions.”** Accessible label: **“Result symbols.”**

#### F-2-3 — “Seed” is unexplained player-facing jargon

**Exact quotes/locations:** Landing game card: **“Sep 2, 2026 · seed 2026-09-02.”** README: **“The date creates a deterministic seed.”**

**Why this matters:** A first-time player does not need implementation terminology to identify the daily gallery.

**Concrete fix:** Show only **“Sep 2, 2026”** on the daily card. Replace the README sentence with **“The same date always creates the same gallery.”**

#### F-2-4 — “Sample key” exposes storage implementation instead of the result

**Exact quote/location:** Landing privacy section: **“Demo progress uses a separate sample key.”**

**Why this matters:** “Key” does not explain the user-visible protection.

**Concrete fix:** **“Demo progress stays separate from your daily progress.”**

#### F-2-5 — “Storage namespace” is unexplained README jargon

**Exact quote/location:** `README.md:13`: **“The ready sample uses only the `demo:five-minute-heist:` storage namespace.”**

**Why this matters:** The prefix is useful evidence, but “namespace” makes the isolation statement harder to scan.

**Concrete fix:** **“The sample stores progress separately under keys that start with `demo:five-minute-heist:`.”**

#### F-2-6 — “Pinned” assumes package-management vocabulary

**Exact quote/location:** `README.md:38`: **“Playwright 1.58.2 is pinned to match the factory browser image.”**

**Why this matters:** The sentence can state the compatibility requirement without insider shorthand.

**Concrete fix:** **“This project uses Playwright 1.58.2, the version installed in the factory test browser.”**

#### F-2-7 — The test description uses internal process jargon

**Exact quote/location:** `README.md:45`: **“`npm test` runs four deterministic core tests and the browser claim suite through the Azure Static Web Apps emulator.”**

**Why this matters:** “Deterministic core tests,” “claim suite,” and “emulator” are not explained before use.

**Concrete fix:** **“`npm test` runs four repeatable logic tests and checks every registered browser claim in a local copy of Azure Static Web Apps.”**

#### F-2-8 — The build output sentence uses “hashed” without explaining the result

**Exact quote/location:** `README.md:56`: **“The build writes hashed JavaScript and CSS to `dist/`.”**

**Why this matters:** A reader needs to know that the filenames change with their contents, not the hashing mechanism.

**Concrete fix:** **“The build writes versioned JavaScript and CSS files to `dist/`.”**

#### F-2-9 — The deployment sentence uses “immutable caching” without a plain result

**Exact quote/location:** `README.md:56`: **“`staticwebapp.config.json` gives those assets immutable caching, rewrites only known app routes, and serves the designed 404 with HTTP 404.”**

**Why this matters:** The configuration outcome is useful, but the cache phrase is specialist shorthand.

**Concrete fix:** **“`staticwebapp.config.json` caches each versioned asset for one year. It sends known routes to the app and unknown routes to the 404 page.”**

#### F-2-10 — “Third-party runtime files” obscures the privacy promise

**Exact quote/location:** `README.md:60`: **“The game uses no account, tracking cookies, ads, analytics, or third-party runtime files.”**

**Why this matters:** A player cannot readily tell whether “runtime files” means scripts, fonts, images, or network calls.

**Concrete fix:** **“The game uses no account, tracking cookies, ads, or analytics. It loads no code, fonts, or images from other sites.”** Keep the existing `privacy-default` request-log test attached to this wording.

## Copy audit

Counts split on whitespace after Markdown formatting is removed. Dates, coordinates, route lines, and score values are data rather than sentences. They are noted where their labels need review. No banned marketing word appears. Findings are linked in the Result column.

### Live landing page

| Location | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| Eyebrow | One gallery each day · five moves | 7 | Pass |
| H1 | Plan a five-move museum heist | 5 | Pass |
| Intro | For solo players who want a short daily puzzle without another word game. | 13 | Pass |
| Primary action | Try it with sample data | 5 | Pass; result-naming verb |
| Action note | Open a ready practice gallery. | 5 | Pass |
| Fact | Free to play. | 3 | `free-access` |
| Fact | The sample works offline after your first visit. | 8 | `offline-reload` |
| Fact | Progress stays in this browser. | 5 | `local-progress-storage` |
| Game heading | Today’s gallery | 2 | Pass |
| Game data | Sep 2, 2026 · seed 2026-09-02 | 6 | F-2-3 |
| Button | Turn sound on | 3 | Pass; result-naming verb |
| Goal | Reach the exhibit in C4 after taking the seal in E3. | 11 | Pass |
| Status | Add five moves. | 3 | Pass |
| Status | The board previews the guards after each move. | 8 | `plan-preview` |
| Board description | Five by five gallery. | 4 | Pass |
| Board description | You are in E5. | 4 | Pass |
| Board description | The exhibit is in C4. | 5 | Pass |
| Board description | Take the seal in E3 first. | 6 | Pass |
| Labels | Guard 1 loop / Guard 2 loop | 3 / 3 | Pass |
| Label | Your five moves | 3 | Pass |
| Direction buttons | Add move U — up / R — right / D — down / L — left | 5 each | Pass; accessible result-naming verbs |
| Button | Remove last move | 3 | Pass; result-naming verb |
| Button | Run the plan | 3 | Pass; result-naming verb |
| H2 | How the daily heist works | 5 | Pass |
| H3 | Study both guard loops | 4 | Pass |
| Step | Each line shows where that guard stands after every move. | 10 | `visible-guard-loops` |
| H3 | Queue five moves | 3 | Pass |
| Step | Use the arrow buttons or arrow keys. | 7 | Pass |
| Step | The board previews each step. | 5 | `plan-preview` |
| H3 | Run and share | 3 | Pass |
| Step | Watch the plan play. | 4 | Pass |
| Step | A sealed glyph shares the result without directions. | 8 | F-2-2 |
| H2 | What the game does not do | 6 | Pass |
| Privacy | It does not use accounts, tracking cookies, ads, or paid hints. | 11 | `privacy-default` / `free-access` |
| Privacy | Your plan, result, and sound choice stay in local browser storage. | 11 | `local-progress-storage` |
| Privacy | Demo progress uses a separate sample key. | 7 | F-2-4 |
| Privacy | The daily generator sends no answer. | 6 | `browser-generated` |
| Privacy | It builds and checks the gallery in your browser. | 9 | `browser-generated` |
| Footer | Five-Minute Heist — Plan five moves through one daily museum. | 10 | Pass |
| Footer | Original generated scene made for this game. | 7 | `original-art-provenance` |
| Footer | Version 1.1.1. | 2 | Pass |

The header labels **Daily**, **Demo**, and **Privacy** and the footer links **Privacy**, **Terms**, and **Built by Param Factory** are clear navigation labels, not sentences. Terminology otherwise stays consistent for *plan*, *move*, *gallery*, *guard*, *exhibit*, *seal*, and *demo*.

### README

| Location | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| H1 | Five-Minute Heist | 2 | Pass |
| Intro | Plan five moves through one daily 5 × 5 museum. | 10 | Pass |
| Intro | Two visible guard loops move after each step, and a valid plan reaches the exhibit. | 15 | `visible-guard-loops` / `complete-run` |
| Intro | Five-Minute Heist is a free 4–6 minute game for one browser player. | 12 | **F-1-4j** |
| Intro | Use arrow keys or the on-screen touch controls, run the plan, then copy a sealed result glyph. | 17 | F-2-2 |
| Intro | The sample works offline after the first visit. | 8 | `offline-reload` |
| Intro | Daily progress stays in local browser storage. | 7 | `local-progress-storage` |
| H2 | Try the sample | 3 | Pass |
| Sample | Choose Try it with sample data on the first screen, or visit: | 12 | Pass |
| Sample | The ready sample uses only the demo:five-minute-heist: storage namespace. | 9 | F-2-5 |
| Sample | Reset demo removes sample progress. | 5 | `demo-isolation` |
| Sample | Open today’s game also removes sample progress before leaving. | 9 | `demo-isolation` |
| Sample | Neither action changes daily data. | 5 | `demo-isolation` |
| H2 | Play | 1 | Pass |
| Step | Study the two visible six-position guard loops. | 7 | `visible-guard-loops` |
| Step | Add exactly five moves with arrow keys or the on-screen controls. | 11 | `touch-controls` / `complete-run` |
| Step | Press Enter or choose Run the plan. | 7 | `complete-run` |
| Step | Reach the exhibit after taking the seal when one appears. | 10 | `complete-run` |
| Step | Choose Play again to clear the plan. | 7 | `restart-reset` |
| Generator | The date creates a deterministic seed. | 6 | F-2-3 |
| Generator | Before accepting a board, the browser checks all 1,024 possible five-move routes and keeps a solvable one. | 17 | `exhaustive-generator` / `solvable-generator` |
| Generator | It does not download or ship an answer list. | 9 | `browser-generated` |
| H2 | Develop | 1 | Pass |
| Requirement | Requires Node.js 20 or later. | 5 | Pass; development requirement |
| Instruction | Open http://localhost:5173. | 2 | Pass |
| Instruction | Use http://localhost:5173/?demo=1 for the isolated sample. | 6 | Pass |
| H2 | Test | 1 | Pass |
| Test | Playwright 1.58.2 is pinned to match the factory browser image. | 10 | F-2-6 |
| Test | npm test runs four deterministic core tests and the browser claim suite through the Azure Static Web Apps emulator. | 19 | F-2-7 |
| Test | The suite verifies real HTTP routing, a 390 × 844 layout, accessibility, privacy, offline reload, and a 50 fps median floor from three active game runs. | 26 | F-2-1 |
| Test | Each command in .factory/claims.json runs one observable claim test from the sample entry point. | 14 | Pass |
| H2 | Deploy | 1 | Pass |
| Deploy | The build writes hashed JavaScript and CSS to dist/. | 9 | F-2-8 |
| Deploy | staticwebapp.config.json gives those assets immutable caching, rewrites only known app routes, and serves the designed 404 with HTTP 404. | 19 | F-2-9 |
| H2 | Privacy and license | 3 | Pass |
| Privacy | The game uses no account, tracking cookies, ads, analytics, or third-party runtime files. | 13 | F-2-10 |
| Links | See /privacy and /terms. | 4 | Pass |
| License | The code is available under the MIT License. | 8 | Pass |
| Art | The generated museum scene was made for this game; its prompt and provenance are in .factory/design.md and assets/src/. | 18 | `original-art-provenance` |

Code blocks and the standalone demo URL are commands/addresses, not sentences. All headings make sense out of context. All landing buttons use verbs that name their result; arrow buttons expose **Add move …** accessible names.

## Demo and sandbox behavior

- The primary landing action enters `/?demo=1` in one click.
- At 390 × 844, the first demo screen contains the persistent banner, sample player, exhibit, walls, two guards, and both loop previews. The board begins at 347.7 px, inside the first viewport.
- The banner says **“Demo — sample data, nothing is saved to your daily game.”** It includes **Reset demo** and **Open today’s game**.
- After one move, the only demo write was `demo:five-minute-heist:progress:sample-glass-gallery`. A seeded `five-minute-heist:sentinel` remained unchanged.
- **Reset demo** removed the demo key and kept the daily sentinel. Writing again and choosing **Open today’s game** removed the demo key and again kept the sentinel.
- The observed live flow made seven requests, all to `https://five-minute-heist.sociobot.in`. It set no cookies and emitted no console error.
- `@claim:offline-reload` passed from its own clean browser context after service-worker control and offline reload.

The demo requirement passes.

## Claims audit

The repository was cloned without local build output to `/tmp/fmh-review2.19EcRc/repo`, then installed with `npm ci`. Every exact command from `.factory/claims.json` was run independently. Each claim ID occurs exactly once in `tests/e2e/game.spec.ts`.

| Claim ID | Result | Observable coverage |
| --- | --- | --- |
| `sample-ready` | PASS | One-click mobile sample, banner, seed, loops, slots, board position |
| `free-access` | PASS | Completed scored run without account or payment gate |
| `complete-run` | PASS | Keyboard plan reached the result screen |
| `restart-reset` | PASS | Play again cleared all five slots |
| `local-progress-storage` | PASS | Daily plan, attempts, score, result, sound, reload, clear |
| `plan-preview` | PASS | Player and both guard positions matched simulation |
| `visible-guard-loops` | PASS | Both six-position lines matched generated guards |
| `privacy-default` | PASS | No cookies, foreign requests, account, payment, or external runtime file |
| `demo-isolation` | PASS | Prefix isolation, reset, exit, daily sentinel preservation |
| `browser-generated` | PASS | Same-origin request log and full `dist/` answer scan |
| `touch-controls` | PASS | Touch-enabled phone completed the sample |
| `offline-reload` | PASS | Dedicated context reloaded the playable sample offline |
| `result-glyph` | PASS | Shared five-symbol result contained no direction arrows |
| `solvable-generator` | PASS | 31 dated boards each had a winning plan |
| `exhaustive-generator` | PASS | 1,024 unique routes and repeatable sample generation |
| `frame-rate` | PASS | Three phone runs met the 50 fps median floor |
| `original-art-provenance` | PASS | Live disclosure, design prompt, and source prompt file |

No registered claim test failed. F-1-4j remains an unlisted public claim, so the claims audit still fails overall.

## Earlier-finding verification

Every finding from `review-1.md` was checked against the live site and current code.

| Earlier ID | Result now | Evidence |
| --- | --- | --- |
| F-1-1 | Fixed | One click opens `/?demo=1`; mobile board starts at 347.7 px. |
| F-1-2 | Fixed | Live hashed JS/CSS return `max-age=31536000, immutable`; current build emits the same hashes. |
| F-1-3 | Fixed | `/not-a-real-page` returns HTTP 404 with `<h1>Page not found</h1>`. |
| F-1-4a | Fixed | `sample-ready` passed. |
| F-1-4b | Fixed | `free-access` passed. |
| F-1-4c | Fixed | `local-progress-storage` passed. |
| F-1-4d | Fixed | `plan-preview` passed. |
| F-1-4e | Fixed | `visible-guard-loops` passed. |
| F-1-4f | Fixed | `privacy-default` passed. |
| F-1-4g | Fixed | `local-progress-storage` covers the complete saved record. |
| F-1-4h | Fixed | `demo-isolation` passed and was repeated manually live. |
| F-1-4i | Fixed | `browser-generated` passed the request and artifact checks. |
| **F-1-4j** | **Regressed** | The untested **“4–6 minute”** sentence is back in `README.md:5`. |
| F-1-4k | Fixed | `touch-controls` passed in a touch-enabled mobile context. |
| F-1-4l | Fixed | `exhaustive-generator` checked all 1,024 routes. |
| F-1-4m | Fixed | `browser-generated` scanned every production HTML, JS, and JSON file. |
| F-1-5 | Fixed | Daily, Demo, and Privacy remain visible at 390 px on every public route. |
| F-1-6 | Fixed | Buttons read Open today’s game, Turn sound on, and Turn sound off. |
| F-1-7 | Fixed | Both SPA and standalone 404 documents use Page not found as the H1. |

`polish-1.md` correctly records the repairs at its repair commit, but its statement that F-1-4j was removed no longer matches the current README. The current handoff reported no gaps and therefore did not identify this regression.

## Structure, accessibility, and links

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200. The unknown route returns 404.
- Every public route has `lang=en`, one H1, one main landmark, a route-specific title under 60 characters, a meta description, canonical URL, OG title/description/image, favicon, consistent header, and consistent footer with Privacy and Terms.
- The OG image is 1200 × 630. The apple-touch icon is 180 × 180.
- Navigation from Privacy to Demo moves focus to the new H1. Browser Back restores Privacy and focuses its H1.
- Every crawled internal link returned 200 except the intentionally missing route, which returned 404. The Param Factory link returned 200; mail links were recognized as mail actions.
- Live assets are content-hashed and return one-year immutable cache headers. The live CSP and security headers match the product's same-origin runtime.
- After `npm run build`, `npm run test:live` passed 21/21. Its accessibility checks found no serious or critical axe violation, verified 44 × 44 px mobile links, checked 200% text layout, and found no console errors on the 200 routes.
- `npm test` passed in the clean clone: 4 unit tests and 21 Chromium tests. `npm run build` produced `dist/`; JavaScript is 23.51 kB raw and 8.73 kB gzip.
- The glass museum board, clipped panels, cyan route lighting, amber exhibit, and coral guards implement `.factory/design.md` and do not resemble a generic SaaS template. Reduced-motion rules are present and tested through the app flow.

No structural blocker was found.

## Missed leverage

The brief describes a deterministic, local daily puzzle. AI assistance, import/export, or account sync would not advance that job and would add network or privacy costs. Result sharing already covers the obvious social extension. No decorative AI feature, provider key, external model call, or embedded secret was found.

## What would make this perfect

Remove the untested 4–6 minute promise, split the 26-word test sentence, and replace the remaining coined or implementation terms with the proposed plain wording. Then rerun the claim registry and full copy audit. A new review can pass only when these findings are absent from both the live product and README.
