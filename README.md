# Five-Minute Heist

Plan five moves through one daily 5 × 5 museum. Two visible guard loops move after each step, and a valid plan reaches the exhibit.

Five-Minute Heist is a free game for one person playing in a browser. Use arrow keys or the on-screen controls. Run the plan, then copy five result symbols that hide your directions. The sample works offline after the first visit. Daily progress stays in local browser storage.

## Try the sample

Choose **Try it with sample data** on the first screen, or visit:

https://five-minute-heist.sociobot.in/?demo=1

The sample stores progress separately under keys that start with `demo:five-minute-heist:`. **Reset demo** removes sample progress. **Open today’s game** also removes sample progress before leaving. Neither action changes daily data.

## Play

- Study the two visible six-position guard loops.
- Add exactly five moves with arrow keys or the on-screen controls.
- Press Enter or choose **Run the plan**.
- Reach the exhibit after taking the seal when one appears.
- Choose **Play again** to clear the plan.

The same date always creates the same gallery. Before accepting a board, the browser checks all 1,024 possible five-move routes and keeps a solvable one. It does not download or ship an answer list.

## Develop

Requires Node.js 20 or later.

```sh
npm install
npm run dev
```

Open `http://localhost:5173`. Use `http://localhost:5173/?demo=1` for the isolated sample.

## Test

This project uses Playwright 1.58.2, the version installed in the factory test browser.

```sh
npm test
npm run build
```

`npm test` runs four repeatable logic tests and checks every registered browser claim in a local copy of Azure Static Web Apps. The suite checks routes, the 390 × 844 layout, accessibility, privacy, and offline reload. It also checks three runs against a 50 fps median floor.

Each command in [.factory/claims.json](.factory/claims.json) runs one observable claim test from the sample entry point.

## Deploy

```sh
npm run build
/opt/fleet/lib/deploy-static.sh five-minute-heist dist
```

The build writes versioned JavaScript and CSS files to `dist/`. `staticwebapp.config.json` caches each versioned asset for one year. It sends known routes to the app and unknown routes to the 404 page.

## Privacy and license

The game uses no account, tracking cookies, ads, or analytics. It loads no code, fonts, or images from other sites. See [/privacy](https://five-minute-heist.sociobot.in/privacy) and [/terms](https://five-minute-heist.sociobot.in/terms).

The code is available under the [MIT License](LICENSE). The generated museum scene was made for this game; its prompt and provenance are in [.factory/design.md](.factory/design.md) and `assets/src/`.
