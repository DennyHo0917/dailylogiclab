# Daily Logic Lab MVP

Live website: [Daily Logic Lab](https://dailylogiclab.com/)

Key pages: [Two Not Touch](https://dailylogiclab.com/) | [Tents and Trees](https://dailylogiclab.com/tents-and-trees/) | [Hashi](https://dailylogiclab.com/hashi/) | [Slitherlink](https://dailylogiclab.com/slitherlink/) | [Nonogram](https://dailylogiclab.com/nonogram/) | [Sitemap](https://dailylogiclab.com/sitemap.xml)

Static MVP for a daily logic puzzle site.

## Open Locally

Open `index.html` in a browser.

## Included

- Daily Two Not Touch puzzle
- Daily and unlimited practice Tents and Trees, Hashi, Slitherlink, and Nonogram puzzles
- Full game pages and controls in English, German, Spanish, French, Japanese, Brazilian Portuguese, and Simplified Chinese
- Practice puzzle button
- Seeded random puzzle generation
- Seeded puzzle validation and solver checks for the new game families
- Reset, check, hint, share
- Timer, star count, local streak
- Killer Sudoku cage combination calculator
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
