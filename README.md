# Five-Minute Heist

Plan five moves through one daily 5 × 5 museum. Two visible guard loops move after each step, and a valid plan reaches the exhibit.

Five-Minute Heist is a free game for one browser player. Use arrow keys or the on-screen touch controls, run the plan, then copy a sealed result glyph. The sample works offline after the first visit. Daily progress stays in local browser storage.

## Try the sample

Choose **Try it with sample data** on the first screen, or visit:

https://five-minute-heist.sociobot.in/?demo=1

The ready sample uses only the `demo:five-minute-heist:` storage namespace. **Reset demo** removes sample progress. **Open today’s game** also removes sample progress before leaving. Neither action changes daily data.

## Play

- Study the two visible six-position guard loops.
- Add exactly five moves with arrow keys or the on-screen controls.
- Press Enter or choose **Run the plan**.
- Reach the exhibit after taking the seal when one appears.
- Choose **Play again** to clear the plan.

The date creates a deterministic seed. Before accepting a board, the browser checks all 1,024 possible five-move routes and keeps a solvable one. It does not download or ship an answer list.

## Develop

Requires Node.js 20 or later.

```sh
npm install
npm run dev
```

Open `http://localhost:5173`. Use `http://localhost:5173/?demo=1` for the isolated sample.

## Test

Playwright 1.58.2 is pinned to match the factory browser image.

```sh
npm test
npm run build
```

`npm test` runs four deterministic core tests and the browser claim suite through the Azure Static Web Apps emulator. The suite verifies real HTTP routing, a 390 × 844 layout, accessibility, privacy, offline reload, and a measured 50 fps floor.

Each command in [.factory/claims.json](.factory/claims.json) runs one observable claim test from the sample entry point.

## Deploy

```sh
npm run build
/opt/fleet/lib/deploy-static.sh five-minute-heist dist
```

The build writes hashed JavaScript and CSS to `dist/`. `staticwebapp.config.json` gives those assets immutable caching, rewrites only known app routes, and serves the designed 404 with HTTP 404.

## Privacy and license

The game uses no account, tracking cookies, ads, analytics, or third-party runtime files. See [/privacy](https://five-minute-heist.sociobot.in/privacy) and [/terms](https://five-minute-heist.sociobot.in/terms).

The code is available under the [MIT License](LICENSE). The generated museum scene was made for this game; its prompt and provenance are in [.factory/design.md](.factory/design.md) and `assets/src/`.
