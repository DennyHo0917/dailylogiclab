# DailyLogicLab development todo

## Project constraints

- [x] Keep the existing root `/` Two Not Touch game playable and preserve its SEO metadata.
- [x] Reuse the current static HTML/CSS/JavaScript stack; do not add a framework or dependency.
- [x] Keep every game online, free, unlimited, and playable without an account.
- [x] Keep the current GA4 tag and extend game events without removing existing events.

## Audit notes

- The current site is a static HTML/CSS/JavaScript site with no package manager or framework.
- The existing Two Not Touch product is coupled to `index.html` + `app.js`; its root URL remains canonical and its generator is untouched.
- Shared reusable surface: `styles.css`, top navigation, button/card typography, responsive layout, root-page SEO/GA4, and browser localStorage.
- New games are isolated in `logic-games-core.js` (generators/validators) and `logic-games.js` (one shared UI runtime), avoiding a risky rewrite of the current game.
- Canonical landing routes are `/tents-and-trees/`, `/hashi/`, `/slitherlink/`, and `/nonogram/`; `/daily/` and `/practice/` are noindex state aliases that canonicalize to the landing page.
- All four new games now use procedural generators and `solve(limit = 2)` unique-solution checks; no generator falls back to an ambiguous puzzle.
- Responsive boards were measured and visually checked at 390px, 430px, 768px, and desktop widths.

## Phase 1 — audit and shared shape

- [x] Inspect the current HTML, CSS, JavaScript, redirects, sitemap, analytics, and localStorage usage.
- [x] Record the existing architecture and risk constraints in this list.
- [x] Add a shared game runtime without rewriting the existing Two Not Touch generator.
- [x] Add the unified game shell, navigation, buttons, stats, completion panel, and responsive board styles.

## Phase 2 — information architecture

- [x] Keep the active puzzle first; expose game switching in the header and place four compact related-game cards after the board.
- [x] Apply the same entry layout to English, German, Spanish, French, Japanese, Brazilian Portuguese, and Simplified Chinese with locale-native copy.
- [x] Add localized landing, daily, and practice routes for Tents and Trees, Hashi, Slitherlink, and Nonogram in all seven languages.
- [x] Add four illustrated related-game cards to every game landing page and audit localized SEO metadata.
- [x] Add `/two-not-touch` as a safe alias to the existing root game.
- [x] Add `/tents-and-trees`, `/hashi`, `/slitherlink`, and `/nonogram` landing/game routes.
- [x] Add `/daily` and `/practice` route aliases for each game.

## Phase 3 — Tents and Trees

- [x] Implement seeded procedural puzzle generation with a solver-backed validity check.
- [x] Implement Empty → Tent → Grass interaction, row/column clues, errors, reset, and completion.
- [x] Add Daily, unlimited Practice, difficulty, timer, local progress, and completion cross-links.

## Phase 4 — Hashi / Bridges

- [x] Replace fixed blueprints with deterministic procedural island layouts and unique connected bridge graphs.
- [x] Add a Hashi solver covering clue degree, 0/1/2 bridges, crossings, visibility, and connectivity.
- [x] Implement 0 → 1 → 2 → 0 bridge interaction, crossing checks, errors, reset, and completion.
- [x] Add Daily, unlimited Practice, difficulty, timer, local progress, and completion cross-links.

## Phase 5 — Slitherlink

- [x] Generate irregular, concave single-loop boundaries instead of inset rectangles and vary clue density by difficulty.
- [x] Add a Slitherlink solver covering clue counts, vertex degree, branches, and single-loop connectivity.
- [x] Implement Unknown → Line → X interaction, clue checks, invalid-loop checks, reset, and completion.
- [x] Add Daily, unlimited Practice, difficulty, timer, local progress, and completion cross-links.

## Phase 6 — Nonogram

- [x] Generate structured blobs, symmetric forms, strokes, geometric shapes, and multi-cluster patterns.
- [x] Add a row/column candidate solver and retain only unique Nonograms.
- [x] Implement Unknown → Filled → X interaction with touch-friendly controls and errors.
- [x] Add Daily, unlimited Practice, difficulty, timer, local progress, and completion cross-links.

## Phase 7 — SEO, linking, and measurement

- [x] Give every game landing page a useful title, description, canonical, OG tags, and JSON-LD.
- [x] Add How to Play, Rules, Tips, FAQ, Related Games, and More Logic Games content.
- [x] Add all new canonical routes to `sitemap.xml` without removing existing URLs.
- [x] Add `game_view`, `puzzle_start`, `puzzle_complete`, `new_puzzle`, `difficulty_change`, `daily_puzzle_start`, `daily_puzzle_complete`, and `cross_game_click` events.
- [x] Fire `daily_puzzle_start` only after the player presses Start, not while the puzzle is merely ready.
- [x] Persist recent game, daily completion, streak, best time, games played, and difficulty preference locally.

## Phase 8 — verification and preview

- [x] Run 1,000-seed generator, solver, validator, determinism, performance, and diversity tests for each game.
- [x] Run route, HTML, and JavaScript checks plus the existing app smoke check.
- [x] Verify no new horizontal overflow at 390px, 430px, 768px, and desktop widths.
- [x] Start a local server on an available port and hand the preview URL back for inspection.

## Known risks

- The production site is static, so clean route support depends on folder index files and `_redirects`; local preview will use the same folder routes.
- Existing Two Not Touch logic is tightly coupled to `index.html` and `app.js`; new games will use a separate runtime to keep SEO and behavior isolated.
- Difficulty now changes size, geometry, density, and clue removal, but it is not yet rated by a human-style logical-technique scorer.
