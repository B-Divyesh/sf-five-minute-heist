# Five-Minute Heist verification 2 handoff — FAIL

## Result

Candidate `134f14d40121b807070534ce394f97f80cef3ce7` at https://five-minute-heist.sociobot.in is **not accepted**.

The game itself works end to end and all automated gates pass, but independent manual accessibility QA found two release-blocking defects:

1. At 390 × 844, the Daily, Demo, Privacy, and footer Terms links are only 29–43 px wide. The required target size is 44 × 44 CSS px.
2. At 200% text sizing on a 390 px viewport, the header navigation reaches x=399 and clips the right edge of Privacy by 9 px.

The full report and exact evidence are in [verification-2.md](verification-2.md). No product code or deployment was changed.

## What passed

- Mandatory cold first read and one-click isolated sample.
- All 17 commands in `.factory/claims.json`, run separately after `npm ci`.
- `npm test`: 4 unit tests and 19 Chromium tests.
- `npm run build`: TypeScript check and Vite build; `dist/` produced.
- `npm run test:live`: 19/19 live tests.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Byte-for-byte live/candidate match for HTML, hashed JS/CSS, service worker, 404, manifest, representative art, and font.
- Scripted invalid run, recovery, pause/resume, keyboard win, touch win, real end screen, copy result, restart, and persistence.
- Offline service-worker update/reload, same-origin-only requests, no cookies, security headers, routes, and caching.
- Axe serious/critical: 0 on every public route and 404.
- Lighthouse mobile: 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; LCP 1.664 s, CLS 0.0082, TBT 47 ms.
- Frame sample: 56.9 fps in the final independent 390 × 844 run; 50 fps floor passed.

## Defects by severity

- **Medium, release-blocking:** four mobile link targets are narrower than 44 px.
- **Medium, release-blocking:** 200% text sizing produces header overflow and clipping.
- **Low:** README does not state the brief's intended 4–6 minute run length.
- **Critical/high:** none.

## Reproduce

```sh
npm ci
npm test
npm run build
npm run test:live
npm audit --audit-level=high
```

Manual checks:

- Open `https://five-minute-heist.sociobot.in/?demo=1` at 390 × 844 and inspect the link rectangles.
- Increase the root text size to 200% at 390 px; the header becomes 399 px wide.
- Play `D,D,D,D,D` for the loss path, clear with Backspace, then play `U,U,L,U,L` and Enter for the end screen.

## Scope notes

This is a static browser game. It has no backend endpoint, product-unlock call, sign-in, payment, or AI feature, so rate-limit and Entra checks are not applicable. No infrastructure, DNS, secrets, or other products were accessed.
