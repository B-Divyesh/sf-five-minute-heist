# Demo sandbox

- URL: `https://five-minute-heist.sociobot.in/?demo=1` or local `http://localhost:5173/?demo=1`; `/demo` is also supported.
- Sample: a deterministic 5 × 5 gallery called `sample-glass-gallery`, with two guard loops and a solvable five-move route.
- Reset: use **Reset demo** in the persistent banner.
- Leave: use **Open today’s game**. This removes demo progress before opening the current daily gallery.
- Storage namespace: every demo key begins with `demo:five-minute-heist:`. The demo never reads or writes the daily `five-minute-heist:` namespace.
- Offline check: load `/demo`, wait for the service worker to take control, switch the browser offline, then reload.
