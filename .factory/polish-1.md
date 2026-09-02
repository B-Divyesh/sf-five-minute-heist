# Perfection loop 1 — repair evidence

**Reviewed source:** `.factory/review-1.md` at `e946b9b`  
**Repair commit deployed:** `b3545f7`  
**Live URL:** https://five-minute-heist.sociobot.in  
**Result:** PASS — every blocking and minor finding is resolved.

All browser evidence below was repeated against the deployed site with `npm run test:live`: 19/19 passed. The live mobile demo is captured at [live-demo/screenshot-mobile.png](evidence/polish-1/live-demo/screenshot-mobile.png), and the live designed 404 is captured at [live-404-desktop.png](evidence/polish-1/live-404-desktop.png).

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The one-click action now opens `/?demo=1`. The compact mobile demo puts the generated board before secondary goal text. | `@claim:sample-ready` asserts the board top is below 390 px at 390 × 844. Live mobile screenshot above shows the grid beginning near 305 px. |
| F-1-2 | Restored Vite content hashes and added a one-year immutable `/assets/*` policy. | Routing/cache browser test; live `index-DrVNFsq1.js` and `index-BJa9ZHv0.css` return `max-age=31536000, immutable`. |
| F-1-3 | Removed catch-all SPA fallback. Only `/demo`, `/privacy`, and `/terms` rewrite to the app; all unknown paths use the designed 404 response. | Routing test; live `/not-a-real-page` returns HTTP 404 and `<h1>Page not found</h1>`. |
| F-1-4a | Registered the ready sample claim and test for seeded board, loops, slots, banner, and one-click entry. | `@claim:sample-ready`. |
| F-1-4b | Registered free access and proved a scored run without account or payment UI. | `@claim:free-access`. |
| F-1-4c | Replaced the narrow sound test with a daily-namespace persistence test covering the complete saved record. | `@claim:local-progress-storage`. |
| F-1-4d | Added observable turn/player/guard board state and compared it with deterministic simulation after a queued move. | `@claim:plan-preview`. |
| F-1-4e | Compared both rendered six-position guard lines with the generated guard loops. | `@claim:visible-guard-loops`. |
| F-1-4f | Consolidated privacy wording and tested no account/payment UI, cookies, foreign requests, or external runtime files. | `@claim:privacy-default`. |
| F-1-4g | Tested daily plan, attempts, score, result, and sound persistence, reload, and clearing. | `@claim:local-progress-storage`. |
| F-1-4h | Tested every demo write prefix plus reset and exit while preserving a daily sentinel. | `@claim:demo-isolation`. |
| F-1-4i | Narrowed the copy to browser generation with no downloaded answer, then tested the request log and production artifact. | `@claim:browser-generated`. |
| F-1-4j | Removed the unmeasured 4–6 minute statement from public copy. | README copy audit; `rg '4–6 minutes' README.md` has no match. |
| F-1-4k | Added a real touch-enabled phone context that taps the complete winning plan. | `@claim:touch-controls`. |
| F-1-4l | Refactored route enumeration into the validator and proved all 1,024 unique five-move routes are checked. | `@claim:exhaustive-generator`; unit test “enumerates every possible five-move route”. |
| F-1-4m | Expanded the no-answer test from initial HTML to every HTML, JavaScript, and JSON file in `dist/`. | `@claim:browser-generated`. |
| F-1-5 | Kept Daily, Demo, and Privacy visible at 390 px and gave each a 44 px target. | Routing test navigates from mobile `/privacy` to Demo; [live-privacy-mobile.png](evidence/polish-1/live-privacy-mobile.png). |
| F-1-6 | Renamed actions to **Open today’s game**, **Turn sound on**, and **Turn sound off**. | `@claim:demo-isolation`, `@claim:local-progress-storage`, and live screenshot. |
| F-1-7 | Changed both SPA and standalone 404 headings to **Page not found**, retaining the gallery sentence as support. | Routing test, live HTTP check, and live 404 screenshot above. |

## Controller evidence requirements

- Playable board in first 390 px: `@claim:sample-ready`, live mobile screenshot.
- Immutable hashed assets: live names and response headers listed above.
- Real designed HTTP 404: live HTTP 404 plus screenshot.
- Every public claim: 17 unique registry IDs; automated cross-check found exactly one `@claim:<id>` test for each.
- Mobile Demo link, clear buttons, literal 404 heading: covered by the rows above.

## Verification record

- Clean clone: `/tmp/five-minute-heist-verify.Ltm17h` from `b3545f7`.
- Clean `npm ci`: passed, 0 vulnerabilities.
- Every one of the 17 commands in `.factory/claims.json`: passed independently.
- Clean full `npm test`: 4 unit + 19 Chromium tests passed.
- Clean `npm run build`: passed; JS 23,514 B raw / 8.73 KB gzip, CSS 12,760 B raw / 3.82 KB gzip.
- Local Lighthouse: 99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO.
- Live `npm run test:live`: 19/19 passed after deployment.
- Live URL verifier: root and `/?demo=1` returned 200 with title, `lang=en`, one H1, main, labelled controls, and zero console errors.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.6 s, CLS 0.028, TBT 0 ms.
- Deployment ID: `5fa16675-7a4d-497b-8ce9-ec5afc550703`.
