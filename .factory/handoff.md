# Five-Minute Heist independent QA handoff — FAIL

## Result

Candidate `2cccef726174bbd969a64b80d12be427194b9912` at https://five-minute-heist.sociobot.in is **not accepted**.

The sole release-blocking defect is the registered 50 fps floor. Its exact claim command failed at 45.83 fps, the full clean local suite failed it at 45.21 fps, and the full live suite failed it at 45.83 fps. Under the required claims policy, any failing claim test fails the release. Details and traces are in [.factory/verification-3.md](verification-3.md).

## What was verified

- Ran every command in `.factory/claims.json` separately after `npm ci`: 16 passed and `frame-rate` failed.
- Performed cold desktop and 390 × 844 first-read checks. The page plainly identifies the game and audience, provides a visible one-click sample, and shows the game itself.
- Ran `npm test`: 4 unit tests and 20 browser tests passed; the frame-rate browser test failed.
- Ran `npm run build`: TypeScript and Vite passed; `dist/` was produced.
- Ran `npm audit --audit-level=high`: 0 vulnerabilities.
- Ran `npm run test:live`: 20 browser tests passed; the same frame-rate test failed.
- Confirmed clean-build and live hashes match for HTML, hashed JS/CSS, service worker, 404, manifest, representative art, and font.
- Played deterministic live wall-loss, guard-loss, missed-target, recovery, keyboard win, touch win, pause/resume, copy-result, and restart flows.
- Verified persisted sound/progress, isolated demo storage, service-worker update, and offline reload.
- Verified same-origin-only requests, no cookies or console/page errors, security headers, and cache policy.
- Verified all public routes at desktop and 390 px, keyboard focus, 44 px targets, 200% text, reduced motion, and zero serious/critical axe findings.
- Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.506 s and total transfer 138,781 B.

## Defects by severity

- Critical: 0
- High: 0
- Medium, release-blocking: 1 — `@claim:frame-rate` does not reliably meet its asserted 50 fps floor.
- Low: 0

## Reproduce

```sh
npm ci
npm test -- --grep @claim:frame-rate
npm test
npm run build
npm audit --audit-level=high
npm run test:live
```

Expected failure evidence is under `.factory/evidence/verification-3/frame-rate/` and `.factory/evidence/verification-3/live-frame-rate/`.

## Scope and next step

No product code was modified during verification. This static game has no backend, account, billing, AI call, unlock endpoint, or server-side state, so rate-limit, Entra, concurrency, and backend persistence checks do not apply.

Before release, either improve frame pacing so the existing 50 fps claim passes reliably under the exact clean and live suites, or remove/change the public claim and its acceptance threshold only with product-owner approval. Then rerun every registered claim command and both full suites.
