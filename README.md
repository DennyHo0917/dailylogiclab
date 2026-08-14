# Daily Logic Lab

Live website: [Daily Logic Lab](https://dailylogiclab.com/)

Key pages: [Two Not Touch](https://dailylogiclab.com/) | [Tents and Trees](https://dailylogiclab.com/tents-and-trees/) | [Hashi](https://dailylogiclab.com/hashi/) | [Slitherlink](https://dailylogiclab.com/slitherlink/) | [Nonogram](https://dailylogiclab.com/nonogram/) | [Sitemap](https://dailylogiclab.com/sitemap.xml)

Static multilingual logic puzzle site.

## Open Locally

Open `index.html` in a browser.

## Included

- Daily and unlimited Two Not Touch puzzles in 1★ Quick (7×7), 2★ Classic (10×10), and 3★ Expert (14×14) modes
- Daily and unlimited practice Tents and Trees, Hashi, Slitherlink, and Nonogram puzzles
- Full game pages and controls in English, German, Spanish, French, Japanese, Brazilian Portuguese, and Simplified Chinese
- Practice puzzle button
- Deterministic daily seeds and varied practice puzzle generation
- Unique-solution solver checks for Two Not Touch and all four additional game families
- Reset, check, hint, share
- Timer, star count, local streak
- Killer Sudoku combinations calculator with static 2-to-9-cell cage charts
- Responsive layout

## Files

- `index.html`
- `styles.css`
- `app.js`
- `logic-games-core.js`
- `logic-games.js`
- `tools/generate-game-locales.mjs`
- `screenshot-desktop.png`
- `screenshot-mobile.png`

## Local preview

The site is static. Serve the repository root, then open `/` or any game route:

```text
python -m http.server 4173
http://localhost:4173/
```

See [TODO.md](TODO.md) for the staged product plan and remaining upgrades.

Run the full generator, solver, determinism, performance, and diversity check with:

```text
node tools/test-two-not-touch.mjs
node tools/test-logic-games.mjs
```

Run the remaining CI checks with:

```text
node tools/audit-game-seo.mjs
node tools/check-site.mjs
node tools/audit-routes.mjs
```

After changing shared CSS or JavaScript, refresh the content-hashed asset URLs with:

```text
node tools/version-static-assets.mjs
```
