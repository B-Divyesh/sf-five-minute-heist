# Adversarial first-read review 1 — Five-Minute Heist

**Reviewed:** 2026-09-02 UTC  
**Live URL:** https://five-minute-heist.sociobot.in  
**Verdict:** **FAIL**

This was a fresh-context review of the live product and a clean local install. Blocking findings remain.

## Cold first read

At desktop width, before scrolling, I understood this is a daily solo puzzle: queue five moves through a museum, avoid guards, and reach the exhibit. It is for people who want a short puzzle rather than another word game. The first action is **Try it with sample data**.

At 390 × 844, the home screen still answers those questions. Its title, introductory sentence, primary action, and the top of the playable board are visible. The visual treatment is distinct and not a generic SaaS template.

The cold demo does not meet the same standard. At 390 × 844, .game-shell begins at 663 px but the actual .board begins at 912 px. The primary action opens copy, a banner, and the top of a card; it does not show the sample being used in the first viewport.

## Findings

### Blocking

#### F-1-1 — The phone demo does not show the sample in use

**Location/evidence:** The live action is **“Try it with sample data.”** Its /demo destination has **“Plan this five-move museum heist”**, yet at 390 × 844 the 5 × 5 board begins at 912 px, below the viewport.

**Why this fails:** The one-click demo must show the product being used with realistic sample data on the first screen after clicking. A phone visitor must scroll before seeing the board, guard loops, plan slots, or sample positions.

**Concrete fix:** Make the action open /demo#game and preserve the anchor through SPA navigation, or make a compact demo layout that places the board and guard loops above the fold. Keep the banner, but do not put another full hero ahead of the sample. Add a 390 × 844 test that asserts the board begins inside the viewport after the action.

#### F-1-2 — An earlier cache-header finding remains unfixed

**Earlier finding:** .factory/handoff.md and .factory/verification.md recorded: **“live /assets/app.js and /assets/style.css currently return Cache-Control: public, must-revalidate, max-age=30; adopt content-hashed assets with long-lived immutable cache headers.”**

**Location/evidence:** Fresh live HEAD requests still return cache-control: public, must-revalidate, max-age=30 for both assets. The built names remain app.js and style.css, not content-hashed names.

**Why this fails:** The review instructions make every earlier unfixed finding blocking in this round.

**Concrete fix:** Emit content-hashed JS and CSS names, configure long-lived immutable caching for those assets, and verify the deployed response headers.

#### F-1-3 — Unknown live URLs return success instead of a real 404

**Location/evidence:** HEAD https://five-minute-heist.sociobot.in/not-a-real-page returns **HTTP 200**, HTML, and the landing document. The SPA later paints its “This room is not in the gallery” view, but the server has already said the resource exists. public/404.html is not the response to this unknown URL.

**Why this fails:** A designed 404 route must be real. Crawlers, shared links, and HTTP clients receive a successful response rather than a missing-resource response.

**Concrete fix:** Let only known SPA routes (/, /demo, /privacy, /terms) fall back to the app, and serve the designed 404 with HTTP 404 for other paths. Add a live test for both status and page heading.

#### F-1-4 — Claim-like landing and README statements have no matching registry entry

Each row is a separate unlisted-claim finding. The closest current tests prove narrower behavior and do not satisfy the quoted promise.

| Id | Exact quote and location | Why it is unlisted | Concrete fix |
| --- | --- | --- | --- |
| F-1-4a | Landing: “A practice gallery opens with a ready puzzle.” | No claim follows the action and asserts ready sample UI. | Add sample-opens-ready: follow the action and assert seeded board, loops, and plan slots. |
| F-1-4b | Landing: “Free to play.” README: “The game is free.” | No free-access claim exists. | Add a test that completes a sample run with no account/payment, or remove these statements. |
| F-1-4c | Landing: “Progress stays in this browser.” | settings-persist proves demo sound only. | Add real-namespace plan/progress persistence coverage, or narrow the copy. |
| F-1-4d | Landing: “The board previews the guards after each move.” and “The board previews each step.” | No test checks visual board preview after a queued move. | Add plan-preview and compare labelled board state with the simulation. |
| F-1-4e | Landing: “Each line shows where that guard stands after every move.” README: “Guards follow visible loops.” | No test compares displayed loops with guard positions. | Add visible-guard-loops against generated guard loops. |
| F-1-4f | Landing: “It does not use accounts, tracking cookies, ads, or paid hints.” README: “There are no accounts, ads, analytics, third-party runtime scripts, or tracking cookies.” | local-only only records request origins. | Split into precise cookie/request assertions or remove unprovable categories. |
| F-1-4g | Landing: “Your plan, result, and sound choice stay in local browser storage.” README: “Progress and the sound choice stay in local browser storage.” | The registered test inspects sound only. | Add local-progress-storage that completes a demo and checks only expected localStorage values. |
| F-1-4h | Landing: “Demo progress uses a separate sample key.” README: “The sample uses the separate demo:five-minute-heist: storage namespace.” | demo-isolation protects a sentinel during reset, but does not prove all demo writes use only that namespace. | Add a playthrough storage-prefix test. |
| F-1-4i | Landing: “The daily generator sends no answer. It builds and checks the gallery in your browser.” | answer-not-shipped checks only initial HTML for one solution. | Add browser-generation/request-log coverage, or retain only the narrower tested copy. |
| F-1-4j | README: “A round takes about 4–6 minutes.” | No timing claim exists. | Add a measured timing test/method or remove it. |
| F-1-4k | README: “Use the keyboard or touch controls...” and “Add exactly five moves with arrow keys or the on-screen buttons.” | Keyboard is covered; touch is not. | Add a touch-pointer completion test and a matching claim. |
| F-1-4l | README: “The deterministic generator tests every possible five-move route before accepting a board.” | solvable-generator proves 31 boards have a solution, not exhaustive 1,024-route checking. | Add the generator invariant or reduce the copy to solvability. |
| F-1-4m | README: “...or stored as a shipped answer list.” | The test checks initial HTML, not all shipped assets. | Search the production artifact in the claim test, or remove this promise. |

**Why this fails:** The claims contract requires every reliance-worthy statement to have an observable demo test. Passing the listed claims does not cover additional promises.

### Minor

#### F-1-5 — The mobile header removes Demo

**Location/evidence:** At 390 px the live header shows **“Daily”** and **“Privacy”** while the **“Demo”** link has display: none. This also occurs on /privacy.

**Why this matters:** The required consistent header includes the demo path. A visitor on a policy page has no direct mobile navigation route to the sample.

**Concrete fix:** Keep a compact Demo link, or an accessible menu containing Daily, Demo, and Privacy. Test navigation to Demo from mobile /privacy.

#### F-1-6 — Two buttons do not name their action

**Location/evidence:** The banner button reads **“Start for real”** and the toggle reads **“Sound off”** or **“Sound on.”**

**Why this matters:** These expose a vague intention/current state instead of the outcome of pressing the button.

**Concrete fix:** Use **“Open today’s game”**, **“Turn sound on”**, and **“Turn sound off”**; retain aria-pressed for state.

#### F-1-7 — The standalone 404 H1 is metaphorical

**Location/evidence:** public/404.html uses **“This room is not in the gallery.”**

**Why this matters:** It does not name the error out of context.

**Concrete fix:** Use **“Page not found”** for the H1 and keep the gallery sentence as supporting copy.

## Copy audit

Word counts use whitespace-separated words/numbers. Compact board labels, dates, and repeated link labels are not sentences. /demo repeats landing copy and adds the demo rows below. No sentence exceeds 22 words and no sentence uses a banned marketing term. “Flag” points to the finding above.

### Landing

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Eyebrow | One gallery each day · five moves | 7 | Pass |
| H1 | Plan a five-move museum heist | 5 | Pass |
| Hero | For solo players who want a short daily puzzle without another word game. | 13 | Pass |
| Action | Try it with sample data | 5 | Pass |
| Action note | A practice gallery opens with a ready puzzle. | 8 | F-1-4a |
| Fact | Free to play. | 3 | F-1-4b |
| Fact | Works offline after your first visit. | 6 | offline-reload |
| Fact | Progress stays in this browser. | 5 | F-1-4c |
| Game heading | Today’s gallery | 2 | Pass |
| Button | Sound off | 2 | F-1-6 |
| Goal | Reach the exhibit in C4 after taking the seal in E3. | 11 | State |
| Status | Add five moves. | 3 | Pass |
| Status | The board previews the guards after each move. | 8 | F-1-4d |
| Plan label | Your five moves | 3 | Pass |
| Button | Remove last move | 3 | Pass |
| Button | Run the plan | 3 | Pass |
| Heading | How the daily heist works | 5 | Pass |
| Step | Study both guard loops | 4 | Pass |
| Step text | Each line shows where that guard stands after every move. | 10 | F-1-4e |
| Step | Queue five moves | 3 | Pass |
| Step text | Use the arrow buttons or arrow keys. | 7 | Keyboard covered |
| Step text | The board previews each step. | 5 | F-1-4d |
| Step | Run and share | 3 | Pass |
| Step text | Watch the plan play. | 4 | Pass |
| Step text | A sealed glyph shares the result without directions. | 8 | result-glyph |
| Heading | What the game does not do | 6 | Pass |
| Privacy | It does not use accounts, tracking cookies, ads, or paid hints. | 11 | F-1-4f |
| Privacy | Your plan, result, and sound choice stay in local browser storage. | 11 | F-1-4g |
| Privacy | Demo progress uses a separate sample key. | 7 | F-1-4h |
| Privacy | The daily generator sends no answer. | 6 | F-1-4i |
| Privacy | It builds and checks the gallery in your browser. | 9 | F-1-4i |
| Footer | Five-Minute Heist — Plan five moves through one daily museum. | 9 | Pass |
| Footer | Original generated scene made for this game. | 7 | Provenance |
| Footer | Version 1.0.0. | 2 | Pass |
| Demo banner | Demo — sample data, nothing is saved to your daily game. | 10 | Demo contract |
| Demo H1 | Plan this five-move museum heist | 6 | Pass |
| Demo action | Play the sample below | 5 | Pass |
| Demo note | The sample has its own progress and can be reset. | 9 | F-1-4h |
| Demo heading | Practice gallery | 2 | Pass |
| Demo goal | Reach the exhibit in A2 in exactly five moves. | 10 | State |
| Demo button | Reset demo | 2 | demo-isolation |
| Demo button | Start for real | 3 | F-1-6 |

### README

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Intro | Plan five moves through one daily 5 × 5 museum. | 10 | Pass |
| Intro | Guards follow visible loops, and a valid plan reaches the exhibit end screen. | 12 | F-1-4e |
| Intro | Five-Minute Heist is for one browser player. | 7 | Pass |
| Intro | A round takes about 4–6 minutes. | 6 | F-1-4j |
| Intro | Use the keyboard or touch controls, run the plan, then copy a sealed result glyph. | 14 | F-1-4k |
| Intro | The game is free. | 4 | F-1-4b |
| Intro | It works offline after the first visit. | 7 | offline-reload |
| Intro | Progress and the sound choice stay in local browser storage. | 10 | F-1-4g |
| Intro | The game loads its own files from this site. | 9 | local-only |
| Sample | Open /demo or visit: | 4 | Pass |
| Sample | The sample uses the separate demo:five-minute-heist: storage namespace. | 7 | F-1-4h |
| Sample | Reset demo clears only sample progress. | 6 | demo-isolation |
| Sample | Start for real clears the sample and opens today’s game. | 10 | F-1-4h |
| Play | Study the two six-step guard previews. | 6 | F-1-4e |
| Play | Add exactly five moves with arrow keys or the on-screen buttons. | 11 | F-1-4k |
| Play | Press Enter or choose Run the plan. | 8 | complete-run |
| Play | Reach the exhibit after taking the seal when one is shown. | 11 | Rule |
| Play | Choose Play again to reset the plan. | 8 | restart-reset |
| Generator | The date creates the seed. | 5 | F-1-4l |
| Generator | The deterministic generator tests every possible five-move route before accepting a board. | 12 | F-1-4l |
| Generator | The daily answer is not embedded in HTML or stored as a shipped answer list. | 15 | F-1-4m |
| Develop | Requires Node.js 20 or later. | 5 | Requirement |
| Test | Playwright 1.58.2 is pinned to match the factory browser image. | 10 | Repository fact |
| Test | npm test runs deterministic core checks and the browser claim suite. | 11 | Repository fact |
| Test | The browser suite includes a 390 × 844 viewport and a measured 50 fps floor for the 60 fps target. | 20 | frame-rate; not F-1-1 coverage |
| Deploy | The exact build command is: | 5 | Pass |
| Deploy | It writes the static site to dist/, with dist/index.html at the root. | 13 | Repository fact |
| Deploy | Deploy that directory to any static host with SPA fallback support. | 11 | Instruction |
| Deploy | staticwebapp.config.json provides Azure Static Web Apps routing, security headers, and the designed 404 response. | 13 | Contradicted by F-1-3 |
| Privacy | There are no accounts, ads, analytics, third-party runtime scripts, or tracking cookies. | 11 | F-1-4f |
| License | The code is available under the MIT License. | 8 | Pass |
| License | The original generated scene and prompt provenance are recorded in .factory/design.md and assets/src/. | 12 | Pass |

Terminology is otherwise consistent: *plan*, *move*, *gallery*, *guard*, *exhibit*, *seal*, and *demo* each retain one meaning.

## Demo, claims, and behavior checks

- The landing action reaches /demo in one click. The persistent banner, sample seed, **Reset demo**, and **Start for real** are present.
- In a fresh context, reset preserved a real-namespace sentinel while clearing demo state. The demo sample is the realistic deterministic sample-glass-gallery, with a 5 × 5 board and two guard loops.
- A completed live demo generated seven requests, all same-origin: document, self-hosted fonts, JS, CSS, and the museum image. There were no console errors or foreign requests.
- After first visit and service-worker control, live /demo reloaded offline with its offline notice and playable board.
- npm ci succeeded with zero vulnerabilities. npm test passed (3 Vitest checks and 12 Chromium checks), and npm run build passed and produced dist/.
- I ran every command in .factory/claims.json from the clean install. complete-run, restart-reset, settings-persist, offline-reload, local-only, result-glyph, frame-rate, answer-not-shipped, solvable-generator, and demo-isolation all passed.

## Structure, history, and missed leverage

Known public routes and the external Param Factory link returned HTTP 200. robots.txt, sitemap.xml, title, lang, one H1, main landmark, description, canonical, OG/Twitter metadata, favicon, self-hosted fonts, focus-on-SPA-route-change, back/forward behavior, and no-console-error checks were confirmed. The exception is F-1-3: the designed unknown route has the wrong HTTP status.

There are no earlier review-*.md or polish-*.md files. The sole earlier finding is the cache policy recorded in the handoff and verification documents; it remains unresolved as F-1-2.

The brief is for a compact browser game. An AI feature, import/export, or sync is not an obviously implied missing job, and no decorative AI feature or provider key was found.

## What would make this perfect

Open the mobile demo directly on a populated board, repair the real 404 and cache deployment behavior, and make every public product promise match a complete observable claim test. Then repeat this full review against the deployed URL; a pass requires zero remaining findings.

