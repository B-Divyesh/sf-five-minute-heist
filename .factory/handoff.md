# Five-Minute Heist polish 1 handoff

## Result

Perfection-loop round 1 is complete. Every item in `.factory/review-1.md`, including all minor and earlier cache findings, is fixed and verified on https://five-minute-heist.sociobot.in.

The deployed product remains a static TypeScript browser game with its luminous glass museum identity. No backend, account, payment, analytics, or AI dependency was added.

## What changed

- The first action opens the isolated `/?demo=1` sample in one click.
- The persistent demo banner resets sample state or opens today’s game without touching daily data.
- At 390 × 844, the actual 5 × 5 board begins near 305 px, inside the first 390 vertical pixels.
- Mobile navigation keeps Daily, Demo, and Privacy visible.
- Sound and demo-exit buttons now state their result.
- Vite emits hashed JS/CSS and Azure serves `/assets/*` for one year with `immutable`.
- Known SPA routes are explicit; unknown URLs return the designed page with HTTP 404 and the literal H1 “Page not found”.
- Route titles, descriptions, canonical/OG metadata, History API behavior, focus transfer, and live announcements are covered.
- The claim registry now has 17 unique claims with exactly one observable browser test each.
- The generator’s exhaustive 1,024-route enumeration is explicit and unit tested.
- README, demo notes, design notes, catalog description, and copy audit match the repaired product.

The complete finding-by-finding map is in [polish-1.md](polish-1.md).

## Verification

Repair commit `b3545f7` was pushed to `origin/main` and deployed with the factory static deployment script. Azure deployment `5fa16675-7a4d-497b-8ce9-ec5afc550703` succeeded.

- Clean clone `/tmp/five-minute-heist-verify.Ltm17h`: `npm ci` passed with 0 vulnerabilities.
- All 17 claim commands ran separately and passed.
- Clean full suite: 4 unit tests and 19 Chromium tests passed.
- Live full suite: `npm run test:live`, 19/19 passed.
- Live URL verifier on `/` and `/?demo=1`: HTTP 200, correct title, `lang=en`, one H1, main landmark, labelled buttons, no missing alt text, zero console errors.
- Live unknown URL: HTTP 404 with `Page not found`.
- Live hashed assets: 23,514 B JS and 12,760 B CSS; both return `Cache-Control: public, max-age=31536000, immutable`.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.6 s, CLS 0.028, TBT 0 ms.
- Accessibility: Playwright axe found no serious or critical issues on home, both demo entries, Privacy, Terms, or 404.
- Privacy: a complete demo run made only same-origin requests and set no cookies.
- Offline: a fresh isolated context reloaded the playable sample offline after service-worker control.
- Performance: the phone frame sampler passed the 50 fps floor for the 60 fps target.
- Dependency audit: 0 vulnerabilities.

Evidence:

- [Live demo at 390 × 844](evidence/polish-1/live-demo/screenshot-mobile.png)
- [Live Privacy page at 390 × 844](evidence/polish-1/live-privacy-mobile.png)
- [Live designed 404](evidence/polish-1/live-404-desktop.png)
- [Live URL verifier report](evidence/polish-1/live-demo/verify.json)
- [Live Lighthouse report](evidence/polish-1/lighthouse-live.json)

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run test:live
/opt/fleet/lib/deploy-static.sh five-minute-heist dist
```

The deploy artifact is `dist/`.

## Known gaps

None within the work order. Native sharing remains browser-dependent; the tested clipboard path is the fallback.
