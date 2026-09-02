# Five-Minute Heist review-1 handoff

## Work completed

Performed the adversarial first-read review against the live site without changing product code. The complete result is in .factory/review-1.md.

## Verification run

- npm ci completed with zero reported vulnerabilities.
- npm test passed: 3 Vitest checks and 12 Chromium checks.
- npm run build passed and produced dist/.
- Every command listed in .factory/claims.json passed from the clean install.
- Fresh live checks covered desktop and 390 × 844 screens, a completed /demo run, same-origin request logging, service-worker offline reload, known-route crawl, metadata, console errors, and the unknown-route response.

## Review outcome

**FAIL.** No product code was changed. The review records these blocking findings:

1. The 390 px demo opens with the actual board below the first viewport.
2. The previous max-age=30 cache finding remains unresolved.
3. Unknown live URLs return HTTP 200 rather than a real designed 404 response.
4. Multiple landing and README promises are absent from .factory/claims.json or are broader than their current tests.

The review also records the hidden mobile Demo link, two ambiguous buttons, and a metaphorical standalone-404 H1. The next worker should implement and deploy those fixes, then repeat the complete live review from a fresh browser context.
