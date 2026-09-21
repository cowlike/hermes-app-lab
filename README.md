# hermes-app-lab
<!-- Hermes GitHub access smoke test: 2026-09-20 -->

## Tic-Tac-Toe

A zero-dependency tic-tac-toe web app. No build step, no packages — just open it in a browser.

### Run locally

```bash
git clone https://github.com/cowlike/hermes-app-lab.git
cd hermes-app-lab
```

Then open `index.html` directly in your browser (double-click it, or `open index.html` / `xdg-open index.html`).

That's it — everything runs client-side.

### Features

- **1 Player mode** — you (X) vs an unbeatable minimax computer (O)
- **2 Players mode** — pass-and-play on the same device
- **Scoreboard** — running wins/losses/draws per mode, persisted in `localStorage`
- **Winner highlighting** and draw detection
