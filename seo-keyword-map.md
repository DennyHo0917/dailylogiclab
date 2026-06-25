# SEO Keyword Map

Date: 2026-06-18

This keyword map follows the demand-mining article's method: start from search intent, competitor language, long-tail modifiers, and tool roots, then map each keyword cluster to a page.

## Primary Keyword Clusters

| Page | Primary Keyword | Secondary Keywords | Intent | Page Role |
|---|---|---|---|---|
| `/` | two not touch online | two not touch online free, two not touch puzzle, no touching stars puzzle, star battle online, queens style puzzle | Play now | Main game entry |
| `/star-battle` | star battle puzzle | star battle rules, how to play star battle, daily star battle, star battle online | Learn rules | Guide page |
| `/star-battle-hints` | star battle hints | how to solve star battle, star battle strategy, star battle tutorial, star battle puzzle tips | Get unstuck | Tutorial page |
| `/queens-puzzle-alternative` | queens puzzle alternative | queens game alternative, queens unlimited, queens style puzzle, star battle queens | Find more puzzles | Comparison / alternative page |
| `/killer-sudoku-combination-calculator` | killer sudoku combination calculator | killer sudoku cage calculator, sudoku cage combinations, killer sudoku helper, kakuro combination calculator | Use calculator | Tool page |

## Evidence Notes

- `Star Battle` SERPs contain established online puzzle competitors such as Puzzle Star Battle, KrazyDad, Puzzle Madness, MindGames, Braingle, and Puzzle Baron.
- `Two Not Touch` is the homepage keyword because SERP intent is to play the no-touch stars game immediately.
- `Queens` is a related placement-puzzle term, and app-store/SERP language commonly connects Queens with Star Battle and Two Not Touch.
- `Killer Sudoku combination calculator` has direct tool competitors such as Godoku, Craig M. Booth's calculator, Sudoku Tools, Djape, BrainBashers, and SudoCue.

## Multilingual SEO Map

These pages are language SEO entries, not separate products. Each one targets a local search vocabulary while keeping the same daily puzzle, unique-solution proof, hint penalty loop, and Killer Sudoku helper.

| URL | Language | Primary Search Phrase | Natural Secondary Terms | Localized Intent | Page Role |
|---|---|---|---|---|---|
| `/de/` | German | star battle deutsch | kampf der sterne, tägliches logikrätsel, queens rätsel alternative, killer sudoku kombinationen | Play a German-language logic puzzle without account friction | Localized game entry |
| `/es/` | Spanish | star battle español | puzzle de lógica, rompecabezas de lógica, juego de lógica gratis, sudoku killer combinaciones | Play a daily puzzle and understand the rules in Spanish | Localized game entry |
| `/fr/` | French | star battle français | puzzle logique, casse-tête logique, jeu de logique gratuit, combinaisons killer sudoku | Play a short French logic puzzle with unique-solution proof | Localized game entry |
| `/ja/` | Japanese | star battle 日本語 | スター バトル, ロジックパズル, 毎日 パズル, killer sudoku 組み合わせ | Play a Japanese-language daily logic puzzle with no signup | Localized game entry |
| `/pt-br/` | Portuguese (Brazil) | star battle português | quebra-cabeça lógico, jogo de lógica, puzzle lógico, killer sudoku combinações | Play a Brazilian Portuguese daily logic puzzle | Localized game entry |
| `/zh-cn/` | Simplified Chinese | star battle 中文 | 星之战, 每日逻辑谜题, 逻辑小游戏, 杀手数独组合 | Give Chinese readers a clear puzzle/rules entry even though Google demand may be smaller | Localized game entry |

## Multilingual Demand Notes

- German SERPs show both English `Star Battle` and localized `Kampf der Sterne`, so the German page should keep the English puzzle name but include the local synonym.
- Spanish and French pages should not rely only on `Star Battle`; search language commonly includes `puzzle de lógica`, `rompecabezas`, `puzzle logique`, and `casse-tête logique`.
- Japanese app-store language uses `ロジックパズル`, so Japanese copy should sound like a puzzle page, not a literal translation of the English title.
- Portuguese should favor Brazil-facing phrasing such as `jogo de lógica`, `quebra-cabeça lógico`, and `sem cadastro`.
- Chinese should include `星之战` as the most natural localized name while keeping `Star Battle` for international recognition.
- These localized pages are mostly SEO traffic entries and AdSense inventory. The repeat loop remains the daily puzzle, streak, best time, hints, and practice mode.

## Current SEO Coverage

- Metadata: title, description, keywords, robots, canonical.
- Social previews: Open Graph and Twitter tags on the homepage.
- Multilingual metadata: language-specific title, description, keywords, canonical, hreflang, Open Graph locale, and sitemap alternates.
- Structured data: WebSite, WebPage, WebApplication, FAQPage, Article, SoftwareApplication.
- Indexable pages: homepage, six localized homepage variants, plus four keyword-focused static pages.
- Internal linking: homepage links to all keyword pages.
- Crawl files: robots.txt and sitemap.xml.

## Next SEO Work After Deployment

If the final purchased domain is not `dailylogiclab.com`, replace that domain across canonical tags, sitemap, robots.txt, Open Graph URLs, and `SITE_URL` in `app.js`, then add:

1. Google Search Console verification.
2. Real `og-image.png`.
3. Daily archive pages such as `/star-battle/2026-06-18`.
4. More puzzle variants only after search impressions appear: Takuzu, Tents, Kakuro, Futoshiki.
5. A lightweight blog/tutorial section if `star battle hints` or `queens puzzle alternative` gets impressions.
