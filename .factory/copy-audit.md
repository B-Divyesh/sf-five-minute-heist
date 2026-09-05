# Copy audit

Audited 2026-09-05 from the home and demo screens, game states, policy pages, 404 page, footer, and README. Counts split on spaces after Markdown formatting is removed. No sentence exceeds 22 words or uses a banned marketing word.

## Home and demo

| Location | Copy | Words | Claim or result |
| --- | --- | ---: | --- |
| Eyebrow | One gallery each day · five moves | 7 | Daily game context |
| Home H1 | Plan a five-move museum heist | 5 | Job statement |
| Intro | For solo players who want a short daily puzzle without another word game. | 13 | Audience |
| Action | Try it with sample data | 5 | `sample-ready` |
| Action note | Open a ready practice gallery. | 5 | `sample-ready` |
| Fact | Free to play. | 3 | `free-access` |
| Fact | The sample works offline after your first visit. | 8 | `offline-reload` |
| Fact | Progress stays in this browser. | 5 | `local-progress-storage` |
| Demo H1 | Plan the sample museum heist | 5 | Job statement |
| Demo intro | The ready sample has its own progress. | 7 | `demo-isolation` |
| Demo intro | Reset it at any time. | 5 | `demo-isolation` |
| Demo banner | Demo — sample data, nothing is saved to your daily game. | 10 | `demo-isolation` |
| Button | Reset demo | 2 | `demo-isolation` |
| Button | Open today’s game | 3 | `demo-isolation` |
| Game heading | Today’s gallery / Practice gallery | 2 / 2 | State |
| Gallery label | Current date / Sample gallery | 3 / 2 | State |
| Sound button | Turn sound on / Turn sound off | 3 / 3 | `local-progress-storage` |
| Status | Add five moves. | 3 | Instruction |
| Status | The board previews the guards after each move. | 8 | `plan-preview` |
| Button | Remove last move | 3 | Action |
| Button | Run the plan | 3 | `complete-run` |
| Heading | How the daily heist works | 5 | Section |
| Step | Study both guard loops | 4 | `visible-guard-loops` |
| Step text | Each line shows where that guard stands after every move. | 10 | `visible-guard-loops` |
| Step | Queue five moves | 3 | `complete-run` |
| Step text | Use the arrow buttons or arrow keys. | 7 | `touch-controls` / `complete-run` |
| Step text | The board previews each step. | 5 | `plan-preview` |
| Step | Run and share | 3 | `complete-run` / `result-symbols` |
| Step text | Watch the plan play. | 4 | `complete-run` |
| Step text | Five result symbols let you share without revealing your directions. | 10 | `result-symbols` |
| Heading | What the game does not do | 6 | Section |
| Privacy | It does not use accounts, tracking cookies, ads, or paid hints. | 11 | `privacy-default` / `free-access` |
| Privacy | Your plan, result, and sound choice stay in local browser storage. | 11 | `local-progress-storage` |
| Privacy | Demo progress stays separate from your daily progress. | 8 | `demo-isolation` |
| Privacy | The daily generator sends no answer. | 6 | `browser-generated` |
| Privacy | It builds and checks the gallery in your browser. | 9 | `browser-generated` |
| End heading | You escaped with the exhibit | 5 | `complete-run` |
| Result label | Result symbols | 2 | `result-symbols` |
| Button | Copy result | 2 | `result-symbols` |
| Button | Play again | 2 | `restart-reset` |
| Footer | Plan five moves through one daily museum. | 7 | `complete-run` |
| Footer | Original generated scene made for this game. | 7 | `original-art-provenance` |

## Policy and error pages

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Privacy H1 | Your game stays in your browser | 6 | Plain page title |
| Privacy | Five-Minute Heist does not ask for an account or collect personal details. | 12 | `privacy-default` |
| Privacy | The demo stores progress separately from the daily game. | 9 | `demo-isolation` |
| Privacy | Resetting or leaving the demo removes only sample progress. | 9 | `demo-isolation` |
| Terms H1 | Play for free and share fairly | 6 | Plain page title |
| Terms | Five-Minute Heist is a free browser game for personal use. | 10 | `free-access` |
| 404 H1 | Page not found | 3 | Literal error |
| 404 | The address does not match a page on this site. | 10 | Error cause |
| 404 | Today’s game is still ready. | 5 | Recovery |
| 404 action | Return to today’s game | 4 | Recovery action |

## State and error copy

| Copy | Words | Result |
| --- | ---: | --- |
| The plan is empty. | 4 | Pass |
| Add five moves. | 3 | Pass |
| That move hits a wall. | 5 | Pass |
| Remove it and choose another direction. | 6 | Pass |
| A guard reaches that room then. | 6 | Pass |
| Remove the move and try another route. | 7 | Pass |
| Five moves are ready. | 4 | Pass |
| Run the plan when you are set. | 7 | Pass |
| Guard spotted you. | 3 | Pass |
| Five moves ended outside the exhibit room. | 7 | Pass |
| Change the plan and run it again. | 7 | Pass |
| You reached the exhibit without the seal. | 7 | Pass |
| Route through the marked seal first. | 6 | Pass |
| The plan worked. | 3 | Pass |
| You reached the exhibit without meeting a guard. | 8 | Pass |
| The gallery could not be prepared. | 6 | Pass |
| Reload the page to generate today’s board again. | 8 | Pass |
| Progress could not be saved. | 5 | Pass |
| Keep this tab open to finish your plan. | 8 | Pass |
| The result could not be copied. | 6 | Pass |
| Use your browser’s share menu instead. | 6 | Pass |
| Result copied. | 2 | Pass |
| The symbols do not show your directions. | 7 | `result-symbols` |

## README

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Intro | Plan five moves through one daily 5 × 5 museum. | 10 | Job statement |
| Intro | Two visible guard loops move after each step, and a valid plan reaches the exhibit. | 15 | `visible-guard-loops` / `complete-run` |
| Intro | Five-Minute Heist is a free game for one person playing in a browser. | 13 | `free-access` |
| Intro | Use arrow keys or the on-screen controls. | 8 | `touch-controls` / `complete-run` |
| Intro | Run the plan, then copy five result symbols that hide your directions. | 12 | `complete-run` / `result-symbols` |
| Intro | The sample works offline after the first visit. | 8 | `offline-reload` |
| Intro | Daily progress stays in local browser storage. | 7 | `local-progress-storage` |
| Sample | The sample stores progress separately under keys that start with demo:five-minute-heist:. | 11 | `demo-isolation` |
| Play | The same date always creates the same gallery. | 8 | Deterministic generator |
| Play | Before accepting a board, the browser checks all 1,024 possible five-move routes and keeps a solvable one. | 17 | `exhaustive-generator` / `solvable-generator` |
| Play | It does not download or ship an answer list. | 9 | `browser-generated` |
| Test | This project uses Playwright 1.58.2, the version installed in the factory test browser. | 14 | Development fact |
| Test | npm test runs four repeatable logic tests and checks every registered browser claim in a local copy of Azure Static Web Apps. | 22 | Test behavior |
| Test | The suite checks routes, the 390 × 844 layout, accessibility, privacy, and offline reload. | 14 | Test behavior |
| Test | It also checks three runs against a 50 fps median floor. | 11 | `frame-rate` |
| Deploy | The build writes versioned JavaScript and CSS files to dist/. | 10 | Build behavior |
| Deploy | staticwebapp.config.json caches each versioned asset for one year. | 9 | Routing test |
| Deploy | It sends known routes to the app and unknown routes to the 404 page. | 14 | Routing test |
| Privacy | The game uses no account, tracking cookies, ads, or analytics. | 10 | `privacy-default` |
| Privacy | It loads no code, fonts, or images from other sites. | 10 | `privacy-default` |

## Terminology

| Concept | One term |
| --- | --- |
| Five queued directions | plan |
| One direction | move |
| Play area | gallery |
| Moving obstacle | guard |
| Final target | exhibit |
| Optional required pickup | seal |
| Shareable trace | result symbols |
| Isolated sample state | demo |
