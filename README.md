# Five-Minute Heist

Plan five moves through one daily 5 × 5 museum. Guards follow visible loops, and a valid plan reaches the exhibit end screen.

Five-Minute Heist is for one browser player. A round takes about 4–6 minutes. Use the keyboard or touch controls, run the plan, then copy a sealed result glyph.

The game is free. It works offline after the first visit. Progress and the sound choice stay in local browser storage. The game loads its own files from this site.

## Try the sample

Open `/demo` or visit:

https://five-minute-heist.sociobot.in/demo

The sample uses the separate `demo:five-minute-heist:` storage namespace. **Reset demo** clears only sample progress. **Start for real** clears the sample and opens today’s game.

## Play

- Study the two six-step guard previews.
- Add exactly five moves with arrow keys or the on-screen buttons.
- Press Enter or choose **Run the plan**.
- Reach the exhibit after taking the seal when one is shown.
- Choose **Play again** to reset the plan.

The date creates the seed. The deterministic generator tests every possible five-move route before accepting a board. The daily answer is not embedded in HTML or stored as a shipped answer list.

## Develop

Requires Node.js 20 or later.

```sh
npm install
npm run dev
```

Open `http://localhost:5173`. Use `http://localhost:5173/demo` for the clean sample.

## Test

Playwright 1.58.2 is pinned to match the factory browser image.

```sh
npm test
npm run build
```

`npm test` runs deterministic core checks and the browser claim suite. The browser suite includes a 390 × 844 viewport and a measured 50 fps floor for the 60 fps target.

## Deploy

The exact build command is:

```sh
npm run build
```

It writes the static site to `dist/`, with `dist/index.html` at the root. Deploy that directory to any static host with SPA fallback support. `staticwebapp.config.json` provides Azure Static Web Apps routing, security headers, and the designed 404 response.

## Privacy and license

There are no accounts, ads, analytics, third-party runtime scripts, or tracking cookies. See `/privacy` and `/terms` in the built site.

The code is available under the [MIT License](LICENSE). The original generated scene and prompt provenance are recorded in `.factory/design.md` and `assets/src/`.
