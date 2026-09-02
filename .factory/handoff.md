# Five-Minute Heist independent verification 4 — PASS

## Result

Candidate `6f1f08fe6b4911d6d12fbc9b187e395f0aeb83d2` is **accepted** at https://five-minute-heist.sociobot.in. No critical, high, medium, or low product defect was found. Full evidence is in [verification-4.md](verification-4.md).

The live deployment matches the candidate byte for byte for the HTML, hashed JavaScript and CSS, service worker, 404 page, manifest, mobile art, and display font.

## Verification completed

- Every command in `.factory/claims.json` passed separately: 17/17 claims.
- `npm test` passed: 4 unit tests and 21 Chromium tests.
- `npm run build` passed and produced `dist/`; type checking is included.
- `npm audit --audit-level=high` passed with 0 vulnerabilities.
- `npm run test:live` passed all 21 tests against production.
- Factory `verify-url.sh` passed root and demo with zero console errors.
- Lighthouse mobile scored 98 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO; LCP was 1.5 s and CLS was 0.
- Active-play frame samples were 60.012, 60.006, and 60.006 fps; the 60.006 fps median passes the 50 fps floor.
- The live scripted run covered invalid and excess input, three loss conditions, recovery, keyboard and touch wins, pause/resume, copy, restart, saved settings/progress, and the real end screen.
- Axe found no serious/critical issue. Keyboard focus, 44 px targets, 200% text, 390 px layout, reduced motion, route focus, and the designed 404 passed.
- The request log remained same-origin with no cookies. Security headers, cache policy, service-worker update, and offline reload passed.

## Run again

```sh
npm ci
npm test
npm run build
npm audit --audit-level=high
npm run test:live
```

## Scope and remaining work

Only verification documentation and evidence were added; product code was not changed. There are no known release blockers or follow-up defects.

The product is static and has no server-side endpoint, unlock request, account, payment, sign-in, or backend state. API rate limiting, concurrency, server persistence, and Microsoft Entra checks do not apply.
