# Five-Minute Heist repair handoff — PASS

## Result

Release-blocking findings from verifier report commit `868d5d92f35288eba0763446944666ceb118d524` are repaired and deployed at https://five-minute-heist.sociobot.in.

The product repair was committed and pushed as `8a62cf0d9d47ac953bb440938ee7bb07e5bb0815`. Azure Static Web Apps deployment `10ee21e6-3494-48ef-99ba-0e638e06de1c` succeeded for the existing `sf-five-minute-heist` production app.

## Findings repaired

### Mobile target size

The untouched candidate was reproduced at 390 × 844 before editing: Daily was 29 × 44 px, Demo 37 × 44 px, Privacy 43 × 44 px, and footer Terms 40 × 44 px.

Navigation, footer, text-page, and designed-404 links now expose at least 44 × 44 CSS px. Live measurements across `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the HTTP 404 all report minimum width 44 px and minimum height 44 px. The four reported live targets are now Daily 44 × 44, Demo 44 × 44, Privacy 44 × 44, and Terms 44 × 44.

### Text resize clipping

The untouched candidate was reproduced with a 390 px viewport and 200% root text: document width was 399 px and the Privacy link ended at x=399.

The header now wraps as text grows, while the game heading and sound control share available width safely. Live checks at 200% text report `clientWidth=390`, `scrollWidth=390`, and the furthest app-header link edge at x=314 on every application route. The designed 404 also remains 390 px wide.

### Session length documentation

The README now states the brief’s intended 4–6 minute session length.

### Regression coverage

Two Playwright tests cover the exact failures:

- `mobile links provide 44 by 44 CSS pixel targets on every public page`
- `200 percent text at 390px keeps every public page and header link inside the viewport`

The first test was run before the CSS repair and failed on the verifier’s exact 29/37/43/40 px measurements. Both tests now pass locally and live across every public route and the designed 404.

## Verification evidence

- `npm ci`: 61 packages installed; 0 vulnerabilities.
- Every one of the 17 commands in `.factory/claims.json`: passed separately from the isolated sample.
- `npm test`: 4 Vitest unit tests and 21 Chromium tests passed.
- `npx tsc --noEmit`: passed. There is no separate lint script; type checking is also part of the production build.
- `npm audit --audit-level=high`: passed with 0 vulnerabilities.
- `npm run build`: passed and produced `dist/`.
- Production output: 23,514 B JavaScript (8.73 kB gzip), 13,100 B CSS (3.88 kB gzip), and 57,020 B of self-hosted fonts.
- `npm run test:live`: all 21 tests passed against the production URL.
- Live `verify-url.sh`: root loaded in 662 ms and demo in 699 ms; both had zero console errors, one H1, `lang=en`, a main landmark, no missing image alt, and no unlabeled buttons.
- Playwright axe: zero serious or critical violations on `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the designed 404.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.065 s, LCP 1.365 s, TBT 32 ms, CLS 0.0082.
- The deterministic keyboard plan `U,U,L,U,L` reached **You escaped with the exhibit**, 1,000 points, and glyph `◆△✦△◆`. The independent touch playthrough, restart, persistence, and offline tests also passed. A local 390 × 844 frame sample measured 60.0 fps against the 50 fps floor.
- Service-worker `registration.update()` completed, the worker controlled the live page, and an offline reload showed both the offline message and playable board.
- A complete live load used only `https://five-minute-heist.sociobot.in` and set no cookies.
- Live routes returned 200 for `/`, `/demo`, `/privacy`, `/terms`, robots, sitemap, and manifest. An unknown route returned the designed HTTP 404.
- Live headers include CSP with `connect-src 'self'` and header-delivered `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and restrictive `Permissions-Policy`. Hashed assets return one-year immutable caching.
- SHA-256 hashes matched between `dist/` and live for `index.html`, hashed JavaScript, hashed CSS, `sw.js`, `404.html`, the manifest, representative art, and a representative font.

## Run and verify

```sh
npm ci
npm test
npm audit --audit-level=high
npm run build
npm run test:live
```

Deploy command:

```sh
/opt/fleet/lib/deploy-static.sh five-minute-heist dist
```

## Known gaps and scope

No release-blocking or known product gap remains from the verifier report. This static browser game has no backend, account, payment, AI call, or product-unlock endpoint, so API rate-limit, billing, and Entra checks are not applicable. No infrastructure outside the permitted product resource and DNS name was accessed.
