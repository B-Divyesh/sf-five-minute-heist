# Five-Minute Heist handoff

## Independent verification result — PASS

Candidate `731cf94d9f7038f62f432e34228a84f65a9fb47b` was independently verified against https://five-minute-heist.sociobot.in on 2026-09-02 UTC. **PASS: no release-blocking defects.** Clean claims, full tests, build, live deployment identity comparison, cold first-read, desktop/mobile play, keyboard game run, offline reload, request privacy, headers, console errors, and axe serious/critical checks all passed. Full evidence is in `.factory/verification.md`.

One low-severity follow-up remains: live static app and CSS responses use `max-age=30`; adopt content-hashed assets with immutable cache headers in a future release. The verified service worker still supports the required offline reload.

## Built

- A finished daily 5 × 5 plan-then-watch stealth puzzle.
- Deterministic date seeds, two visible guard loops, walls, and alternating seal constraints.
- Exhaustive validation of all 1,024 five-move plans before a generated board is accepted.
- Complete input → plan → animated execution → fail/win → score → sealed result → replay loop.
- Arrow-key, Enter, Backspace, pointer, and touch controls.
- Pause on demand and when the tab is hidden. Plans, scores, results, and sound settings persist locally.
- A separate `/demo` sample with `demo:five-minute-heist:` storage, reset, and clean exit.
- Offline service worker, SPA routes, standalone 404, security headers, social metadata, sitemap, and manifest.
- Privacy and terms pages, MIT license, README, claim registry, demo notes, and copy audit.
- Original responsive museum artwork from the factory image model. Prompt and provenance are in `.factory/design.md` and `assets/src/`.

## Run and verify

```sh
npm install
npm test
npm run build
npm run preview
```

The deploy artifact is `dist/`, and `dist/index.html` is at its root.

Verification completed on 2026-09-02:

- `npm test`: 3 deterministic core tests and 12 Chromium tests passed.
- Every command in `.factory/claims.json` can run through Playwright’s `--grep` filter.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, one title, `lang=en`, one `h1`, main landmark, no missing alt text, and no console errors.
- Playwright axe scan: no serious or critical violations.
- Mobile layout: 390 × 844 px with no horizontal overflow.
- Measured animation frame rate: 60.0 fps at 390 × 844 px in headless Chromium.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse metrics: LCP 1.96 s, CLS 0.001, total blocking time 0 ms.
- Production payload: 8.49 KB gzip JavaScript, 3.57 KB gzip CSS, 19.1 KB mobile hero WebP, 63.5 KB fonts.
- `npm audit`: zero known dependency advisories.

## Known gaps

- Native share is browser-dependent. Browsers without it use the tested clipboard fallback.
- The game intentionally has no historical archive, account, streak, leaderboard, analytics, or paid tier.
- Local progress disappears when the visitor clears this site’s browser storage.

## Next steps

- Deploy `dist/` through the factory static pipeline.
- Run the same URL verifier against `https://five-minute-heist.sociobot.in` after deployment.
