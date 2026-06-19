import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE = "https://dailylogiclab.com";
const SITEMAP_LASTMOD = new Date().toISOString().slice(0, 10);

const languages = [
  {
    key: "en",
    htmlLang: "en",
    hreflang: "en",
    path: "/",
    out: "index.html",
    assets: "./",
    label: "English",
    currentLabel: "English",
    navAria: "Primary",
    footerAria: "Footer",
    switchAria: "Change language",
    meta: {
      title: "Daily Star Battle - Queens-Style Logic Puzzle, No Login",
      description:
        "Play a free daily Star Battle puzzle online. Daily and unlimited Queens-style practice boards are solver-verified unique and work without login.",
      keywords:
        "daily star battle, queens style puzzle, queens puzzle alternative, star battle online, star battle puzzle, two not touch puzzle, unlimited star battle, unique solution puzzle, no login logic puzzle",
      ogTitle: "Daily Star Battle - Queens-Style Logic Puzzle",
      ogDescription:
        "Play a daily Queens-style Star Battle puzzle, then practice unlimited solver-verified unique boards without login.",
      imageAlt: "Daily Logic Lab Star Battle puzzle board"
    },
    nav: ["Play", "Calculator", "Rules"],
    hero: {
      mode: "Daily puzzle",
      h1: "Daily Star Battle",
      intro:
        "A Queens-style logic puzzle you can play daily or unlimited. Every board is solver-verified unique and works without login.",
      proofs: ["Daily puzzle", "Unlimited practice", "Unique solution", "No account"],
      stats: ["Time", "Stars", "Streak"],
      boardLabel: "Star Battle board",
      startMode: "Daily puzzle",
      startTitle: "Ready to solve?",
      startBody: "The timer starts only after you press Start. Place one star in each row, column, and color block.",
      startButton: "Start Puzzle",
      status: "Press Start when you are ready. The timer is paused."
    },
    controls: {
      reset: "Reset",
      hint: "Hint +30s",
      check: "Check",
      practice: "New Practice",
      share: "Share",
      daily: "Daily",
      copyLink: "Copy Link",
      copy: "Copy"
    },
    side: {
      today: "Today",
      puzzle: "Puzzle",
      grid: "Grid",
      proof: "Unique",
      verified: "Verified",
      best: "Best",
      share: "Daily Star Battle\nQueens-style. Unique solution. No login.",
      goal: "Goal",
      rules: ["One star in every row.", "One star in every column.", "One star in every color block.", "No touching stars."],
      tip: "Tap a square once for a star, twice to mark it as impossible."
    },
    calculator: {
      eyebrow: "Puzzle helper",
      title: "Killer Sudoku Cage Calculator",
      lede: "Enter a cage sum and cell count to list possible digit combinations.",
      sum: "Sum",
      cells: "Cells",
      repeats: "Allow repeats",
      digitsLabel: "Available digits",
      count: "0 combinations"
    },
    rules: {
      eyebrow: "Rules",
      title: "Star Battle basics",
      lede:
        "Think of it as a tiny placement puzzle: the whole board needs 7 stars, but the rows, columns, color areas, and neighbors all restrict where they can go.",
      items: [
        "Place exactly one star in each row.",
        "Place exactly one star in each column.",
        "Place exactly one star in each color region.",
        "Stars may not touch, including diagonally."
      ]
    },
    guide: [
      {
        eyebrow: "Queens-style logic puzzle",
        title: "Play Daily Star Battle Online",
        paragraphs: [
          "Daily Logic Lab is a free Star Battle puzzle site built for players looking for a clean Queens-style logic puzzle they can play every day. Each board is generated with a solver and only shown when it has exactly one solution. Start with the daily puzzle, then use practice mode for another unique board without creating an account.",
          "Star Battle is familiar to players who enjoy Queens-style placement puzzles, two-not-touch puzzles, sudoku variants, and short grid logic games. The goal is simple, but every star affects its row, column, color region, and neighboring squares."
        ]
      },
      {
        eyebrow: "Puzzle helper",
        title: "Killer Sudoku Combination Calculator",
        paragraphs: [
          "The Killer Sudoku cage calculator helps you find combinations for a cage total. Enter the cage sum, choose the number of cells, remove digits that are already used, and copy the possible combinations into your solving notes.",
          "This tool is useful for searches like killer sudoku combination calculator, killer sudoku cage calculator, sudoku cage combinations, kakuro combinations, and other pencil puzzle helper workflows."
        ]
      }
    ],
    faqTitle: "Common Questions",
    faqEyebrow: "FAQ",
    faq: [
      ["What is the goal of Star Battle?", "Place one star in each row, one star in each column, and one star in each color region. Stars cannot touch each other, including diagonally."],
      ["Can a generated puzzle have no solution?", "The generator checks every board with a solver before showing it. A puzzle is accepted only when the solver finds exactly one valid solution."],
      ["How do I use the Killer Sudoku cage calculator?", "Type the target sum, choose how many cells are in the cage, and keep only the digits that are still available. The calculator lists all matching combinations."],
      ["Do I need an account?", "No. The daily puzzle, unlimited practice puzzles, hints, checks, sharing, and calculator all work in the browser without an account."]
    ],
    explore: {
      eyebrow: "Explore",
      title: "Logic Puzzle Guides",
      links: [
        ["Star Battle Puzzle Guide", "/star-battle"],
        ["Star Battle Hints", "/star-battle-hints"],
        ["Two Not Touch Puzzle", "/two-not-touch-puzzle"],
        ["Queens Puzzle Alternative", "/queens-puzzle-alternative"],
        ["Killer Sudoku Combination Calculator", "/killer-sudoku-combination-calculator"]
      ]
    },
    footer: { about: "About", contact: "Contact", privacy: "Privacy", sitemap: "Sitemap" }
  },
  {
    key: "de",
    htmlLang: "de",
    hreflang: "de",
    path: "/de/",
    out: "de/index.html",
    assets: "../",
    label: "Deutsch",
    currentLabel: "Deutsch",
    navAria: "Hauptnavigation",
    footerAria: "Fußzeile",
    switchAria: "Sprache wechseln",
    meta: {
      title: "Tägliches Star Battle - Logikrätsel ohne Anmeldung",
      description:
        "Spiele täglich ein kostenloses Star-Battle-Rätsel auf Deutsch. Jede 7x7-Aufgabe hat eine geprüfte eindeutige Lösung, dazu gibt es unbegrenzte Übungsfelder.",
      keywords:
        "star battle deutsch, tägliches logikrätsel, queens rätsel alternative, star battle online, stern rätsel, logikspiel ohne anmeldung, eindeutige lösung rätsel",
      ogTitle: "Tägliches Star Battle - Logikrätsel mit eindeutiger Lösung",
      ogDescription:
        "Ein kurzes Star-Battle-Rätsel für jeden Tag, plus unbegrenztes Training mit geprüfter eindeutiger Lösung.",
      imageAlt: "Daily Logic Lab Star-Battle-Rätselbrett"
    },
    nav: ["Spielen", "Rechner", "Regeln"],
    hero: {
      mode: "Tagesrätsel",
      h1: "Tägliches Star Battle",
      intro:
        "Ein klares Logikrätsel im Queens-Stil: jeden Tag eine neue Aufgabe oder so viele Trainingsrunden, wie du möchtest. Jedes Brett wird vom Solver geprüft.",
      proofs: ["Täglich neu", "Unbegrenzt üben", "Eindeutige Lösung", "Kein Konto"],
      stats: ["Zeit", "Sterne", "Serie"],
      boardLabel: "Star-Battle-Brett",
      startMode: "Tagesrätsel",
      startTitle: "Bereit zum Knobeln?",
      startBody: "Die Uhr startet erst, wenn du Start drückst. Setze je einen Stern in jede Zeile, Spalte und Farbfläche.",
      startButton: "Rätsel starten",
      status: "Drücke Start, wenn du bereit bist. Die Uhr wartet noch."
    },
    controls: {
      reset: "Zurücksetzen",
      hint: "Hinweis +30s",
      check: "Prüfen",
      practice: "Neues Training",
      share: "Teilen",
      daily: "Täglich",
      copyLink: "Link kopieren",
      copy: "Kopieren"
    },
    side: {
      today: "Heute",
      puzzle: "Rätsel",
      grid: "Raster",
      proof: "Eindeutig",
      verified: "Geprüft",
      best: "Bestzeit",
      share: "Daily Star Battle\nKnifflig, eindeutig, ohne Konto.",
      goal: "Ziel",
      rules: ["Ein Stern in jede Zeile.", "Ein Stern in jede Spalte.", "Ein Stern in jede Farbfläche.", "Sterne dürfen sich nicht berühren."],
      tip: "Tippe einmal für einen Stern, zweimal für eine gesperrte Zelle."
    },
    calculator: {
      eyebrow: "Rätselhilfe",
      title: "Killer-Sudoku-Käfigrechner",
      lede: "Gib Summe und Zellanzahl ein, um passende Ziffernkombinationen zu sehen.",
      sum: "Summe",
      cells: "Zellen",
      repeats: "Wiederholungen erlauben",
      digitsLabel: "Verfügbare Ziffern",
      count: "0 Kombinationen"
    },
    rules: {
      eyebrow: "Regeln",
      title: "Star Battle kurz erklärt",
      lede:
        "Du suchst sieben Sterne. Jede Zeile, jede Spalte und jede Farbfläche braucht genau einen, aber benachbarte Sterne sind verboten.",
      items: [
        "Setze genau einen Stern in jede Zeile.",
        "Setze genau einen Stern in jede Spalte.",
        "Setze genau einen Stern in jede Farbfläche.",
        "Sterne dürfen sich auch diagonal nicht berühren."
      ]
    },
    guide: [
      {
        eyebrow: "Logikrätsel im Queens-Stil",
        title: "Star Battle online spielen",
        paragraphs: [
          "Daily Logic Lab ist für kurze, saubere Logikrunden gedacht: kein Login, keine App, einfach öffnen und lösen. Das tägliche Brett wird nur veröffentlicht, wenn der Solver genau eine Lösung findet.",
          "Wenn du Queens, Sudoku-Varianten oder kleine Gitterrätsel magst, fühlt sich Star Battle sofort vertraut an. Der Reiz liegt darin, dass ein einzelner Stern gleichzeitig Zeile, Spalte, Farbe und Nachbarschaft einschränkt."
        ]
      },
      {
        eyebrow: "Killer-Sudoku-Hilfe",
        title: "Kombinationen schneller prüfen",
        paragraphs: [
          "Der Käfigrechner spart Rechenzeit beim Lösen von Killer Sudoku. Du setzt Zielsumme, Zellanzahl und verfügbare Ziffern, danach bekommst du die passenden Kombinationen.",
          "Das passt zu Suchanfragen rund um Killer-Sudoku-Kombinationen, Käfigsummen, Kakuro-Kombinationen und handliche Hilfen für Zahlenrätsel."
        ]
      }
    ],
    faqTitle: "Häufige Fragen",
    faqEyebrow: "FAQ",
    faq: [
      ["Was ist das Ziel von Star Battle?", "In jeder Zeile, jeder Spalte und jeder Farbfläche muss genau ein Stern stehen. Sterne dürfen sich nicht berühren, auch nicht diagonal."],
      ["Kann ein generiertes Rätsel unlösbar sein?", "Nein. Vor dem Anzeigen prüft ein Solver das Brett. Akzeptiert wird nur eine Aufgabe mit genau einer gültigen Lösung."],
      ["Wofür ist der Killer-Sudoku-Rechner gedacht?", "Er zeigt alle passenden Kombinationen für eine Käfigsumme und eine Zellanzahl, damit du beim Lösen schneller Kandidaten ausschließen kannst."],
      ["Brauche ich ein Konto?", "Nein. Tagesrätsel, Training, Hinweise, Prüfung, Teilen und Rechner laufen direkt im Browser."]
    ],
    explore: {
      eyebrow: "Mehr entdecken",
      title: "Logikrätsel-Guides",
      links: [
        ["Star Battle Regeln", "/de/star-battle"],
        ["Star Battle Hinweise", "/de/star-battle-hinweise"],
        ["Two Not Touch", "/de/two-not-touch"],
        ["Queens-Alternative", "/de/queens-alternative"],
        ["Killer-Sudoku-Rechner", "/de/killer-sudoku-kombinationen-rechner"]
      ]
    },
    footer: { about: "Über uns", contact: "Kontakt", privacy: "Datenschutz", sitemap: "Sitemap" }
  },
  {
    key: "es",
    htmlLang: "es",
    hreflang: "es",
    path: "/es/",
    out: "es/index.html",
    assets: "../",
    label: "Español",
    currentLabel: "Español",
    navAria: "Navegación principal",
    footerAria: "Pie de página",
    switchAria: "Cambiar idioma",
    meta: {
      title: "Star Battle diario - Puzzle lógico gratis sin registro",
      description:
        "Juega un Star Battle diario en español. Tableros 7x7 con solución única verificada, modo práctica ilimitado y calculadora para Killer Sudoku.",
      keywords:
        "star battle español, puzzle lógico diario, alternativa a queens puzzle, star battle online, juego de lógica gratis, puzzle sin registro, solución única",
      ogTitle: "Star Battle diario - Puzzle lógico con solución única",
      ogDescription:
        "Un reto diario tipo Queens y práctica ilimitada, todo gratis y sin crear cuenta.",
      imageAlt: "Tablero de Star Battle en Daily Logic Lab"
    },
    nav: ["Jugar", "Calculadora", "Reglas"],
    hero: {
      mode: "Reto diario",
      h1: "Star Battle diario",
      intro:
        "Un puzzle lógico rápido, cercano a Queens, para jugar cada día o practicar sin límite. Cada tablero se publica solo si el solver confirma una solución única.",
      proofs: ["Reto diario", "Práctica ilimitada", "Solución única", "Sin cuenta"],
      stats: ["Tiempo", "Estrellas", "Racha"],
      boardLabel: "Tablero de Star Battle",
      startMode: "Reto diario",
      startTitle: "¿Listo para resolver?",
      startBody: "El reloj empieza cuando pulsas Start. Coloca una estrella en cada fila, columna y región de color.",
      startButton: "Empezar",
      status: "Pulsa Start cuando quieras empezar. El reloj sigue parado."
    },
    controls: {
      reset: "Reset",
      hint: "Pista +30s",
      check: "Revisar",
      practice: "Nueva práctica",
      share: "Compartir",
      daily: "Diario",
      copyLink: "Copiar enlace",
      copy: "Copiar"
    },
    side: {
      today: "Hoy",
      puzzle: "Puzzle",
      grid: "Tablero",
      proof: "Única",
      verified: "Verificada",
      best: "Mejor",
      share: "Daily Star Battle\nReto corto, solución única, sin cuenta.",
      goal: "Objetivo",
      rules: ["Una estrella en cada fila.", "Una estrella en cada columna.", "Una estrella en cada zona.", "Las estrellas no se tocan."],
      tip: "Toca una casilla una vez para estrella y dos veces para marcarla como imposible."
    },
    calculator: {
      eyebrow: "Ayuda para puzzles",
      title: "Calculadora de cajas de Killer Sudoku",
      lede: "Introduce una suma y el número de casillas para ver combinaciones posibles.",
      sum: "Suma",
      cells: "Casillas",
      repeats: "Permitir repetidos",
      digitsLabel: "Dígitos disponibles",
      count: "0 combinaciones"
    },
    rules: {
      eyebrow: "Reglas",
      title: "Cómo se juega Star Battle",
      lede:
        "El tablero necesita siete estrellas, pero cada estrella afecta a su fila, columna, zona de color y casillas vecinas.",
      items: [
        "Coloca exactamente una estrella en cada fila.",
        "Coloca exactamente una estrella en cada columna.",
        "Coloca exactamente una estrella en cada región de color.",
        "Las estrellas no pueden tocarse, ni siquiera en diagonal."
      ]
    },
    guide: [
      {
        eyebrow: "Puzzle lógico tipo Queens",
        title: "Juega Star Battle online",
        paragraphs: [
          "Daily Logic Lab está pensado para quienes quieren un reto limpio de unos minutos: abres la página, pulsas Start y resuelves. No hay registro y cada tablero se comprueba antes de aparecer.",
          "Star Battle engancha a jugadores de Queens, sudoku y otros juegos de cuadrícula porque la regla es simple, pero cada decisión reduce muchas posibilidades a la vez."
        ]
      },
      {
        eyebrow: "Ayuda para Killer Sudoku",
        title: "Encuentra combinaciones sin hacer cuentas a mano",
        paragraphs: [
          "La calculadora de cajas de Killer Sudoku enumera combinaciones para una suma concreta. Ajusta las casillas y elimina dígitos usados para llegar antes a los candidatos reales.",
          "También sirve para flujos parecidos de kakuro, sumas de jaulas y notas rápidas durante una sesión de lápiz y papel."
        ]
      }
    ],
    faqTitle: "Preguntas frecuentes",
    faqEyebrow: "FAQ",
    faq: [
      ["¿Cuál es el objetivo de Star Battle?", "Colocar una estrella en cada fila, columna y región de color. Ninguna estrella puede tocar otra, ni en diagonal."],
      ["¿Puede salir un tablero sin solución?", "El generador lo revisa con un solver antes de mostrarlo. Solo se acepta si hay exactamente una solución válida."],
      ["¿Para qué sirve la calculadora de Killer Sudoku?", "Lista combinaciones posibles para una suma y un número de casillas, útil para descartar opciones durante la resolución."],
      ["¿Necesito una cuenta?", "No. El reto diario, las prácticas, pistas, revisión, compartir y calculadora funcionan en el navegador."]
    ],
    explore: {
      eyebrow: "Explorar",
      title: "Guías de puzzles lógicos",
      links: [
        ["Guía de Star Battle", "/es/star-battle"],
        ["Pistas de Star Battle", "/es/pistas-star-battle"],
        ["Two Not Touch", "/es/two-not-touch"],
        ["Alternativa a Queens", "/es/alternativa-queens"],
        ["Calculadora Killer Sudoku", "/es/calculadora-combinaciones-sudoku-killer"]
      ]
    },
    footer: { about: "Acerca de", contact: "Contacto", privacy: "Privacidad", sitemap: "Mapa del sitio" }
  },
  {
    key: "fr",
    htmlLang: "fr",
    hreflang: "fr",
    path: "/fr/",
    out: "fr/index.html",
    assets: "../",
    label: "Français",
    currentLabel: "Français",
    navAria: "Navigation principale",
    footerAria: "Pied de page",
    switchAria: "Changer de langue",
    meta: {
      title: "Star Battle quotidien - Puzzle logique gratuit sans compte",
      description:
        "Joue chaque jour à un Star Battle en français. Grilles 7x7 à solution unique vérifiée, entraînement illimité et calculatrice Killer Sudoku.",
      keywords:
        "star battle français, puzzle logique quotidien, alternative queens puzzle, star battle en ligne, jeu de logique gratuit, puzzle sans compte, solution unique",
      ogTitle: "Star Battle quotidien - Puzzle logique à solution unique",
      ogDescription:
        "Un puzzle façon Queens à jouer chaque jour, avec entraînement illimité et sans inscription.",
      imageAlt: "Grille Star Battle de Daily Logic Lab"
    },
    nav: ["Jouer", "Calculatrice", "Règles"],
    hero: {
      mode: "Puzzle du jour",
      h1: "Star Battle quotidien",
      intro:
        "Un petit puzzle logique dans l'esprit de Queens, à jouer chaque jour ou en entraînement libre. Chaque grille est contrôlée par un solveur avant publication.",
      proofs: ["Chaque jour", "Entraînement illimité", "Solution unique", "Sans compte"],
      stats: ["Temps", "Étoiles", "Série"],
      boardLabel: "Grille Star Battle",
      startMode: "Puzzle du jour",
      startTitle: "Prêt à résoudre ?",
      startBody: "Le chrono démarre seulement après Start. Place une étoile dans chaque ligne, colonne et zone colorée.",
      startButton: "Commencer",
      status: "Appuie sur Start quand tu es prêt. Le chrono est encore arrêté."
    },
    controls: {
      reset: "Reset",
      hint: "Indice +30s",
      check: "Vérifier",
      practice: "Nouvel entraînement",
      share: "Partager",
      daily: "Du jour",
      copyLink: "Copier le lien",
      copy: "Copier"
    },
    side: {
      today: "Aujourd'hui",
      puzzle: "Puzzle",
      grid: "Grille",
      proof: "Unique",
      verified: "Vérifiée",
      best: "Meilleur",
      share: "Daily Star Battle\nUne grille courte, unique, sans compte.",
      goal: "Objectif",
      rules: ["Une étoile par ligne.", "Une étoile par colonne.", "Une étoile par zone.", "Les étoiles ne se touchent pas."],
      tip: "Tape une case une fois pour une étoile, deux fois pour la barrer."
    },
    calculator: {
      eyebrow: "Aide de résolution",
      title: "Calculatrice de cages Killer Sudoku",
      lede: "Entre une somme et un nombre de cases pour afficher les combinaisons possibles.",
      sum: "Somme",
      cells: "Cases",
      repeats: "Autoriser les doublons",
      digitsLabel: "Chiffres disponibles",
      count: "0 combinaisons"
    },
    rules: {
      eyebrow: "Règles",
      title: "Les bases de Star Battle",
      lede:
        "La grille doit contenir sept étoiles. Les lignes, colonnes, zones de couleur et cases voisines limitent fortement chaque placement.",
      items: [
        "Place exactement une étoile dans chaque ligne.",
        "Place exactement une étoile dans chaque colonne.",
        "Place exactement une étoile dans chaque zone colorée.",
        "Deux étoiles ne peuvent pas se toucher, même en diagonale."
      ]
    },
    guide: [
      {
        eyebrow: "Puzzle logique façon Queens",
        title: "Jouer à Star Battle en ligne",
        paragraphs: [
          "Daily Logic Lab vise une partie courte et propre : une grille quotidienne, un bouton Start, puis la résolution. Pas de compte, pas d'installation, et seulement des grilles à solution unique.",
          "Si tu aimes Queens, les variantes de sudoku ou les petits jeux de logique en grille, Star Battle donne vite cette sensation de déduction compacte où chaque étoile compte."
        ]
      },
      {
        eyebrow: "Aide Killer Sudoku",
        title: "Voir les combinaisons utiles rapidement",
        paragraphs: [
          "La calculatrice de cages te donne les combinaisons qui correspondent à une somme. Tu peux retirer les chiffres déjà utilisés et copier les résultats dans tes notes.",
          "Elle couvre aussi les recherches autour des combinaisons Killer Sudoku, des sommes de cages, de Kakuro et des outils simples pour puzzles papier."
        ]
      }
    ],
    faqTitle: "Questions fréquentes",
    faqEyebrow: "FAQ",
    faq: [
      ["Quel est le but de Star Battle ?", "Mettre une étoile dans chaque ligne, chaque colonne et chaque zone de couleur, sans que deux étoiles se touchent."],
      ["Une grille peut-elle être impossible ?", "La grille est vérifiée par un solveur avant affichage. Elle n'est acceptée que si elle possède exactement une solution valide."],
      ["À quoi sert la calculatrice Killer Sudoku ?", "Elle liste les combinaisons possibles pour une somme et un nombre de cases, afin de réduire les candidats plus vite."],
      ["Faut-il créer un compte ?", "Non. Puzzle du jour, entraînement, indices, vérification, partage et calculatrice fonctionnent directement dans le navigateur."]
    ],
    explore: {
      eyebrow: "Explorer",
      title: "Guides de puzzles logiques",
      links: [
        ["Guide Star Battle", "/fr/star-battle"],
        ["Indices Star Battle", "/fr/indices-star-battle"],
        ["Two Not Touch", "/fr/two-not-touch"],
        ["Alternative à Queens", "/fr/alternative-queens"],
        ["Calculatrice Killer Sudoku", "/fr/#calculator"]
      ]
    },
    footer: { about: "À propos", contact: "Contact", privacy: "Confidentialité", sitemap: "Plan du site" }
  },
  {
    key: "ja",
    htmlLang: "ja",
    hreflang: "ja",
    path: "/ja/",
    out: "ja/index.html",
    assets: "../",
    label: "日本語",
    currentLabel: "日本語",
    navAria: "メインナビゲーション",
    footerAria: "フッター",
    switchAria: "言語を切り替える",
    meta: {
      title: "毎日遊べる Star Battle - 登録なしのロジックパズル",
      description:
        "日本語で遊べる無料の Star Battle（スター・バトル）。毎日の7x7パズル、唯一解チェック済みの練習問題、Killer Sudoku の組み合わせ計算を用意しています。",
      keywords:
        "スター バトル, star battle 日本語, 論理パズル 毎日, queens パズル 代替, 無料 パズル, 登録なし ゲーム, 唯一解 パズル",
      ogTitle: "毎日遊べる Star Battle - 唯一解のロジックパズル",
      ogDescription:
        "Queens系の短い論理パズルを毎日1問。登録なしで練習もできます。",
      imageAlt: "Daily Logic Lab の Star Battle 盤面"
    },
    nav: ["遊ぶ", "計算", "ルール"],
    hero: {
      mode: "今日のパズル",
      h1: "毎日遊べる Star Battle",
      intro:
        "Queensに近い感覚で遊べる、短時間向けの論理パズルです。毎日1問、または練習を好きなだけ。盤面はすべて唯一解を確認しています。",
      proofs: ["毎日更新", "練習し放題", "唯一解チェック済み", "登録なし"],
      stats: ["時間", "星", "連続"],
      boardLabel: "Star Battle の盤面",
      startMode: "今日のパズル",
      startTitle: "始めますか？",
      startBody: "Start を押すまでタイマーは動きません。各行、各列、各色エリアに星を1つずつ置きます。",
      startButton: "スタート",
      status: "準備できたら Start を押してください。タイマーはまだ止まっています。"
    },
    controls: {
      reset: "Reset",
      hint: "ヒント +30s",
      check: "チェック",
      practice: "新しい練習",
      share: "共有",
      daily: "今日の問題",
      copyLink: "リンクをコピー",
      copy: "コピー"
    },
    side: {
      today: "今日",
      puzzle: "問題",
      grid: "盤面",
      proof: "唯一解",
      verified: "確認済み",
      best: "ベスト",
      share: "Daily Star Battle\n短く遊べる、唯一解の論理パズル。",
      goal: "目的",
      rules: ["各行に星を1つ。", "各列に星を1つ。", "各色エリアに星を1つ。", "星どうしは接しません。"],
      tip: "マスを1回押すと星、2回押すと置けない印になります。"
    },
    calculator: {
      eyebrow: "パズル補助",
      title: "Killer Sudoku ケージ計算",
      lede: "合計とマス数を入れると、あり得る数字の組み合わせを表示します。",
      sum: "合計",
      cells: "マス数",
      repeats: "同じ数字を許可",
      digitsLabel: "使える数字",
      count: "0 通り"
    },
    rules: {
      eyebrow: "ルール",
      title: "Star Battle の基本",
      lede:
        "盤面には7つの星が必要です。ただし行、列、色エリア、隣接マスの制約があるため、置ける場所は少しずつ絞られます。",
      items: [
        "各行に星をちょうど1つ置きます。",
        "各列に星をちょうど1つ置きます。",
        "各色エリアに星をちょうど1つ置きます。",
        "星は縦横斜めに接してはいけません。"
      ]
    },
    guide: [
      {
        eyebrow: "Queens 系の論理パズル",
        title: "Star Battle をオンラインで遊ぶ",
        paragraphs: [
          "Daily Logic Lab は、数分で集中して解けるパズルのためのサイトです。今日の1問を開き、Start を押して、盤面と向き合うだけです。",
          "Queens、数独のバリエーション、グリッド系の論理ゲームが好きなら、Star Battle の制約の重なり方はすぐにしっくり来るはずです。"
        ]
      },
      {
        eyebrow: "Killer Sudoku 補助",
        title: "候補の組み合わせを素早く確認",
        paragraphs: [
          "ケージ計算では、指定した合計とマス数に合う数字の組み合わせを一覧できます。使えない数字を外せば、実際の候補に近づきます。",
          "Killer Sudoku、Kakuro、合計制約のある紙パズルを解くときのメモ代わりとして使えます。"
        ]
      }
    ],
    faqTitle: "よくある質問",
    faqEyebrow: "FAQ",
    faq: [
      ["Star Battle の目的は？", "各行、各列、各色エリアに星を1つずつ置きます。星は斜めを含めて隣り合ってはいけません。"],
      ["解けない問題が出ることはありますか？", "表示前に solver で確認しています。ちょうど1つの解がある盤面だけを採用します。"],
      ["Killer Sudoku の計算は何に使いますか？", "ケージの合計とマス数から候補の組み合わせを出し、手計算の時間を減らすための道具です。"],
      ["アカウントは必要ですか？", "不要です。今日の問題、練習、ヒント、チェック、共有、計算機はすべてブラウザで使えます。"]
    ],
    explore: {
      eyebrow: "さらに見る",
      title: "論理パズルガイド",
      links: [
        ["Star Battle ガイド", "/star-battle"],
        ["Star Battle ヒント", "/star-battle-hints"],
        ["Two Not Touch Puzzle", "/two-not-touch-puzzle"],
        ["Queens の代替パズル", "/queens-puzzle-alternative"],
        ["Killer Sudoku 計算機", "/killer-sudoku-combination-calculator"]
      ]
    },
    footer: { about: "このサイト", contact: "お問い合わせ", privacy: "プライバシー", sitemap: "サイトマップ" }
  },
  {
    key: "pt",
    htmlLang: "pt-BR",
    hreflang: "pt-BR",
    path: "/pt-br/",
    out: "pt-br/index.html",
    assets: "../",
    label: "Português",
    currentLabel: "Português",
    navAria: "Navegação principal",
    footerAria: "Rodapé",
    switchAria: "Trocar idioma",
    meta: {
      title: "Star Battle diário - Puzzle lógico grátis sem cadastro",
      description:
        "Jogue Star Battle em português todos os dias. Tabuleiros 7x7 com solução única verificada, treino ilimitado e calculadora para Killer Sudoku.",
      keywords:
        "star battle português, puzzle lógico diário, alternativa queens puzzle, star battle online, jogo de lógica grátis, puzzle sem cadastro, solução única",
      ogTitle: "Star Battle diário - Puzzle lógico com solução única",
      ogDescription:
        "Um desafio diário no estilo Queens, treino ilimitado e nenhuma conta para criar.",
      imageAlt: "Tabuleiro Star Battle do Daily Logic Lab"
    },
    nav: ["Jogar", "Calculadora", "Regras"],
    hero: {
      mode: "Desafio diário",
      h1: "Star Battle diário",
      intro:
        "Um puzzle lógico curto, no clima de Queens, para jogar todo dia ou treinar quanto quiser. Cada tabuleiro passa por um solver antes de aparecer.",
      proofs: ["Desafio diário", "Treino ilimitado", "Solução única", "Sem conta"],
      stats: ["Tempo", "Estrelas", "Sequência"],
      boardLabel: "Tabuleiro Star Battle",
      startMode: "Desafio diário",
      startTitle: "Pronto para resolver?",
      startBody: "O cronômetro só começa depois do Start. Coloque uma estrela em cada linha, coluna e região colorida.",
      startButton: "Começar",
      status: "Aperte Start quando estiver pronto. O cronômetro ainda está parado."
    },
    controls: {
      reset: "Reset",
      hint: "Dica +30s",
      check: "Conferir",
      practice: "Novo treino",
      share: "Compartilhar",
      daily: "Diário",
      copyLink: "Copiar link",
      copy: "Copiar"
    },
    side: {
      today: "Hoje",
      puzzle: "Puzzle",
      grid: "Grade",
      proof: "Única",
      verified: "Verificada",
      best: "Melhor",
      share: "Daily Star Battle\nCurto, lógico, sem cadastro.",
      goal: "Objetivo",
      rules: ["Uma estrela em cada linha.", "Uma estrela em cada coluna.", "Uma estrela em cada região.", "Estrelas não encostam."],
      tip: "Toque uma vez para estrela e duas vezes para marcar como impossível."
    },
    calculator: {
      eyebrow: "Ajuda de puzzle",
      title: "Calculadora de gaiolas Killer Sudoku",
      lede: "Informe a soma e a quantidade de casas para ver combinações possíveis.",
      sum: "Soma",
      cells: "Casas",
      repeats: "Permitir repetidos",
      digitsLabel: "Dígitos disponíveis",
      count: "0 combinações"
    },
    rules: {
      eyebrow: "Regras",
      title: "Como jogar Star Battle",
      lede:
        "O tabuleiro precisa de sete estrelas. Cada uma delas mexe com linha, coluna, região de cor e casas vizinhas.",
      items: [
        "Coloque exatamente uma estrela em cada linha.",
        "Coloque exatamente uma estrela em cada coluna.",
        "Coloque exatamente uma estrela em cada região colorida.",
        "Estrelas não podem se tocar, nem na diagonal."
      ]
    },
    guide: [
      {
        eyebrow: "Puzzle lógico no estilo Queens",
        title: "Jogue Star Battle online",
        paragraphs: [
          "Daily Logic Lab foi feito para uma partida rápida e limpa: abra, aperte Start e resolva. Não precisa instalar nada nem criar conta.",
          "Quem gosta de Queens, sudoku e jogos de grade costuma gostar de Star Battle porque a regra é simples, mas cada estrela corta várias possibilidades ao mesmo tempo."
        ]
      },
      {
        eyebrow: "Ajuda para Killer Sudoku",
        title: "Confira combinações sem fazer tudo de cabeça",
        paragraphs: [
          "A calculadora de gaiolas mostra combinações para uma soma específica. Ajuste a quantidade de casas e tire dígitos já usados para chegar aos candidatos úteis.",
          "Ela também ajuda em buscas e rotinas de Kakuro, somas de gaiolas e anotações rápidas em puzzles de lógica."
        ]
      }
    ],
    faqTitle: "Perguntas frequentes",
    faqEyebrow: "FAQ",
    faq: [
      ["Qual é o objetivo de Star Battle?", "Colocar uma estrela em cada linha, coluna e região colorida. Nenhuma estrela pode encostar em outra, nem na diagonal."],
      ["Pode aparecer um tabuleiro sem solução?", "Antes de aparecer, o tabuleiro passa por um solver. Ele só é aceito quando existe exatamente uma solução válida."],
      ["Para que serve a calculadora de Killer Sudoku?", "Ela lista combinações possíveis para uma soma e quantidade de casas, ajudando a eliminar candidatos mais rápido."],
      ["Preciso criar conta?", "Não. Desafio diário, treino, dicas, conferência, compartilhamento e calculadora funcionam no navegador."]
    ],
    explore: {
      eyebrow: "Explorar",
      title: "Guias de puzzles lógicos",
      links: [
        ["Guia Star Battle", "/star-battle"],
        ["Dicas de Star Battle", "/star-battle-hints"],
        ["Two Not Touch Puzzle", "/two-not-touch-puzzle"],
        ["Alternativa a Queens", "/queens-puzzle-alternative"],
        ["Calculadora Killer Sudoku", "/killer-sudoku-combination-calculator"]
      ]
    },
    footer: { about: "Sobre", contact: "Contato", privacy: "Privacidade", sitemap: "Mapa do site" }
  },
  {
    key: "zh",
    htmlLang: "zh-CN",
    hreflang: "zh-CN",
    path: "/zh-cn/",
    out: "zh-cn/index.html",
    assets: "../",
    label: "中文",
    currentLabel: "中文",
    navAria: "主导航",
    footerAria: "页脚",
    switchAria: "切换语言",
    meta: {
      title: "每日 Star Battle - 无需登录的逻辑小游戏",
      description:
        "每天玩一题免费的 Star Battle 逻辑谜题。7x7 盘面经过求解器验证，保证唯一解，也可以无限练习。",
      keywords:
        "star battle 中文, 每日逻辑谜题, queens puzzle 替代, star battle 在线, 不用登录小游戏, 唯一解谜题, 数独辅助工具",
      ogTitle: "每日 Star Battle - 唯一解逻辑谜题",
      ogDescription:
        "一个像 Queens 一样短平快的逻辑小游戏，每日一题，也能无限练习。",
      imageAlt: "Daily Logic Lab 的 Star Battle 盘面"
    },
    nav: ["开始玩", "计算器", "规则"],
    hero: {
      mode: "每日题",
      h1: "每日 Star Battle",
      intro:
        "这是一个接近 Queens 手感的短逻辑谜题：每天一题，也可以无限练习。每个盘面都会先经过求解器验证，只展示唯一解题目。",
      proofs: ["每日一题", "无限练习", "唯一解", "无需账号"],
      stats: ["时间", "星星", "连胜"],
      boardLabel: "Star Battle 盘面",
      startMode: "每日题",
      startTitle: "准备好了吗？",
      startBody: "点击开始后才会计时。你需要在每一行、每一列、每个色块里各放一颗星星。",
      startButton: "开始",
      status: "准备好了再点开始，计时器现在不会偷跑。"
    },
    controls: {
      reset: "重置",
      hint: "提示 +30s",
      check: "检查",
      practice: "新练习",
      share: "分享",
      daily: "每日题",
      copyLink: "复制链接",
      copy: "复制"
    },
    side: {
      today: "今日",
      puzzle: "题目",
      grid: "盘面",
      proof: "唯一解",
      verified: "已验证",
      best: "最佳",
      share: "Daily Star Battle\n短逻辑题，唯一解，无需登录。",
      goal: "目标",
      rules: ["每一行放一颗星。", "每一列放一颗星。", "每个色块放一颗星。", "星星之间不能相邻。"],
      tip: "点一次放星星，点两次标记为不可能。"
    },
    calculator: {
      eyebrow: "解题辅助",
      title: "杀手数独宫格组合计算器",
      lede: "输入目标和与格子数量，快速列出可能的数字组合。",
      sum: "总和",
      cells: "格数",
      repeats: "允许重复",
      digitsLabel: "可用数字",
      count: "0 组组合"
    },
    rules: {
      eyebrow: "规则",
      title: "Star Battle 基础规则",
      lede:
        "整个 7x7 盘面一共要放 7 颗星。难点在于行、列、色块和相邻关系会同时限制每一颗星的位置。",
      items: [
        "每一行必须正好有一颗星。",
        "每一列必须正好有一颗星。",
        "每个色块必须正好有一颗星。",
        "星星之间不能接触，包括斜角。"
      ]
    },
    guide: [
      {
        eyebrow: "Queens 风格逻辑谜题",
        title: "在线玩每日 Star Battle",
        paragraphs: [
          "Daily Logic Lab 适合想每天做一题短逻辑题的人：打开网页，点击开始，直接推理。没有登录流程，也不需要安装 App。",
          "如果你喜欢 Queens、数独变体、格子逻辑题或不想花太久的小游戏，Star Battle 的节奏会比较舒服。规则很少，但每一步都会影响多个约束。"
        ]
      },
      {
        eyebrow: "杀手数独辅助",
        title: "快速查看候选组合",
        paragraphs: [
          "杀手数独组合计算器可以根据目标和、格数和可用数字列出候选组合，省掉一部分重复心算。",
          "它也适合 Kakuro、笼和、数字组合推理等纸笔谜题场景。"
        ]
      }
    ],
    faqTitle: "常见问题",
    faqEyebrow: "FAQ",
    faq: [
      ["Star Battle 的目标是什么？", "在每一行、每一列、每个色块里各放一颗星，同时任意两颗星不能相邻，包括斜角。"],
      ["会不会生成无解题？", "不会直接展示未经验证的题。生成器会先用求解器检查，只有正好一个有效解的盘面才会被接受。"],
      ["杀手数独计算器有什么用？", "它按总和与格数列出可能组合，帮助你更快排除候选数字。"],
      ["需要注册账号吗？", "不需要。每日题、练习、提示、检查、分享和计算器都在浏览器里直接运行。"]
    ],
    explore: {
      eyebrow: "继续探索",
      title: "逻辑谜题指南",
      links: [
        ["Star Battle 指南", "/zh-cn/star-battle"],
        ["Star Battle 提示", "/star-battle-hints"],
        ["Two Not Touch Puzzle", "/two-not-touch-puzzle"],
        ["Queens 替代谜题", "/queens-puzzle-alternative"],
        ["杀手数独组合计算器", "/zh-cn/#calculator"]
      ]
    },
    footer: { about: "关于", contact: "联系", privacy: "隐私", sitemap: "站点地图" }
  }
];

const ariaLabels = {
  en: {
    promises: "Puzzle promises",
    stats: "Puzzle stats",
    controls: "Puzzle controls",
    notes: "Puzzle notes",
    quickRules: "Quick rules"
  },
  de: {
    promises: "Rätselversprechen",
    stats: "Rätselwerte",
    controls: "Rätselsteuerung",
    notes: "Rätselnotizen",
    quickRules: "Kurzregeln"
  },
  es: {
    promises: "Promesas del puzzle",
    stats: "Datos del puzzle",
    controls: "Controles del puzzle",
    notes: "Notas del puzzle",
    quickRules: "Reglas rápidas"
  },
  fr: {
    promises: "Promesses du puzzle",
    stats: "Statistiques du puzzle",
    controls: "Contrôles du puzzle",
    notes: "Notes du puzzle",
    quickRules: "Règles rapides"
  },
  ja: {
    promises: "パズルの特徴",
    stats: "パズルの状態",
    controls: "パズル操作",
    notes: "パズルメモ",
    quickRules: "かんたんルール"
  },
  pt: {
    promises: "Promessas do puzzle",
    stats: "Dados do puzzle",
    controls: "Controles do puzzle",
    notes: "Notas do puzzle",
    quickRules: "Regras rápidas"
  },
  zh: {
    promises: "谜题特点",
    stats: "谜题状态",
    controls: "谜题控制",
    notes: "谜题说明",
    quickRules: "快速规则"
  }
};

const seoProfiles = {
  en: {
    ogLocale: "en_US",
    languageName: "English",
    audience: "daily logic puzzle players, Queens puzzle players, Star Battle solvers, Killer Sudoku solvers",
    alternateNames: ["Star Battle", "Queens-style puzzle", "Two Not Touch", "Starstruck", "Killer Sudoku cage calculator"],
    keywords: [
      "daily star battle",
      "star battle puzzle",
      "queens style puzzle",
      "queens puzzle alternative",
      "two not touch puzzle",
      "starstruck puzzle",
      "star battle online",
      "unique solution logic puzzle",
      "killer sudoku cage calculator",
      "killer sudoku combinations"
    ],
    note:
      "Players also search for this style as Queens, Two Not Touch, Starstruck, or a no-touch stars puzzle."
  },
  de: {
    ogLocale: "de_DE",
    languageName: "Deutsch",
    audience: "deutschsprachige Logikrätsel-Spieler, Star-Battle-Spieler, Killer-Sudoku-Spieler",
    alternateNames: ["Star Battle", "Kampf der Sterne", "Queens", "Two Not Touch", "Starstruck", "Killer-Sudoku-Käfigrechner"],
    keywords: [
      "star battle deutsch",
      "kampf der sterne",
      "tägliches logikrätsel",
      "star battle online",
      "queens rätsel alternative",
      "stern rätsel",
      "logikspiel ohne anmeldung",
      "eindeutige lösung rätsel",
      "killer sudoku kombinationen",
      "killer sudoku käfigrechner"
    ],
    note:
      "Im deutschsprachigen Raum wird Star Battle auch als Kampf der Sterne gesucht; international tauchen außerdem Queens, Two Not Touch und Starstruck auf."
  },
  es: {
    ogLocale: "es_ES",
    languageName: "Español",
    audience: "jugadores de puzzles de lógica, jugadores de Queens, solvers de Star Battle y Sudoku Killer",
    alternateNames: ["Star Battle", "rompecabezas de lógica", "puzzle de lógica", "Queens", "Two Not Touch", "Starstruck"],
    keywords: [
      "star battle español",
      "star battle diario",
      "puzzle de lógica",
      "rompecabezas de lógica",
      "juego de lógica gratis",
      "alternativa a queens puzzle",
      "star battle online",
      "puzzle sin registro",
      "sudoku killer combinaciones",
      "calculadora sudoku killer"
    ],
    note:
      "En español conviene cubrir tanto puzzle de lógica como rompecabezas de lógica; Star Battle también se relaciona con Queens, Two Not Touch y Starstruck."
  },
  fr: {
    ogLocale: "fr_FR",
    languageName: "Français",
    audience: "joueurs de puzzles logiques, joueurs de Queens, amateurs de Star Battle et Killer Sudoku",
    alternateNames: ["Star Battle", "puzzle logique", "casse-tête logique", "Queens", "Two Not Touch", "Starstruck"],
    keywords: [
      "star battle français",
      "star battle quotidien",
      "puzzle logique",
      "casse-tête logique",
      "jeu de logique gratuit",
      "alternative queens puzzle",
      "star battle en ligne",
      "puzzle sans compte",
      "combinaisons killer sudoku",
      "calculatrice killer sudoku"
    ],
    note:
      "En français, les joueurs utilisent à la fois puzzle logique et casse-tête logique; les noms Queens, Two Not Touch et Starstruck décrivent le même voisinage de recherche."
  },
  ja: {
    ogLocale: "ja_JP",
    languageName: "日本語",
    audience: "日本語のロジックパズルプレイヤー、Queens プレイヤー、Star Battle と Killer Sudoku のソルバー",
    alternateNames: ["Star Battle", "スター・バトル", "ロジックパズル", "Queens", "Two Not Touch", "Starstruck"],
    keywords: [
      "star battle 日本語",
      "スター バトル",
      "毎日 ロジックパズル",
      "無料 パズル",
      "登録なし ゲーム",
      "queens パズル 代替",
      "two not touch",
      "唯一解 パズル",
      "killer sudoku 組み合わせ",
      "キラー数独 計算"
    ],
    note:
      "日本語では Star Battle、スター・バトル、ロジックパズルに加えて、Queens、Two Not Touch、Starstruck という名前でも探されることがあります。"
  },
  pt: {
    ogLocale: "pt_BR",
    languageName: "Português",
    audience: "jogadores de quebra-cabeças lógicos, jogadores de Queens, fãs de Star Battle e Killer Sudoku",
    alternateNames: ["Star Battle", "quebra-cabeça lógico", "jogo de lógica", "Queens", "Two Not Touch", "Starstruck"],
    keywords: [
      "star battle português",
      "star battle diário",
      "quebra-cabeça lógico",
      "jogo de lógica",
      "puzzle lógico",
      "alternativa queens puzzle",
      "star battle online",
      "jogo sem cadastro",
      "killer sudoku combinações",
      "calculadora killer sudoku"
    ],
    note:
      "Em português brasileiro, vale cobrir jogo de lógica e quebra-cabeça lógico; Star Battle também aparece ligado a Queens, Two Not Touch e Starstruck."
  },
  zh: {
    ogLocale: "zh_CN",
    languageName: "简体中文",
    audience: "中文逻辑谜题玩家、Queens 玩家、Star Battle 玩家和杀手数独玩家",
    alternateNames: ["Star Battle", "星之战", "逻辑谜题", "Queens", "Two Not Touch", "Starstruck", "杀手数独组合计算器"],
    keywords: [
      "star battle 中文",
      "星之战",
      "每日逻辑谜题",
      "逻辑小游戏",
      "queens puzzle 替代",
      "star battle 在线",
      "不用登录小游戏",
      "唯一解谜题",
      "杀手数独组合",
      "杀手数独计算器"
    ],
    note:
      "中文搜索里可以同时覆盖 Star Battle、星之战、逻辑谜题、Queens、Two Not Touch 和 Starstruck 这些相邻叫法。"
  }
};

const allAvailableLanguages = Object.values(seoProfiles).map((profile) => profile.languageName);
const supportSlugs = {
  about: "about",
  contact: "contact",
  privacy: "privacy-policy"
};

const localizedLongtailArticles = [
  {
    key: "starBattleHints",
    paths: {
      en: "/star-battle-hints",
      de: "/de/star-battle-hinweise",
      es: "/es/pistas-star-battle",
      fr: "/fr/indices-star-battle"
    },
    changefreq: "weekly",
    priority: "0.8",
    pages: {
      de: {
        title: "Star Battle Hinweise - Logisch lösen ohne Raten",
        description: "Praktische Star-Battle-Hinweise auf Deutsch: legale Felder zählen, Nachbarschaften sperren, Regionen vergleichen und sichere Sterne finden.",
        keywords: "star battle hinweise, star battle lösen, star battle strategie, kampf der sterne tipps",
        eyebrow: "Star Battle Hinweise",
        h1: "Star Battle Hinweise: lösen ohne Raten",
        ogTitle: "Star Battle Hinweise",
        ogDescription: "Eine kurze deutsche Anleitung für sichere Star-Battle-Schritte.",
        cta: { label: "Star Battle online spielen", href: "/de/#play" },
        sections: [
          {
            paragraphs: [
              "Gute Star-Battle-Hinweise zeigen nicht einfach eine Antwort, sondern den nächsten sicheren Schritt. Prüfe immer, welche Felder nach Zeile, Spalte, Region und Nicht-Berühren-Regel noch legal sind.",
              "Diese Anleitung passt zur 7x7-Version von Daily Logic Lab, funktioniert aber auch für viele andere Star-Battle- und Two-Not-Touch-Rätsel."
            ]
          },
          {
            heading: "Kurze Checkliste",
            list: [
              "Suche die Region, Zeile oder Spalte mit den wenigsten legalen Feldern.",
              "Setze einen Stern nur, wenn alle anderen Felder ausgeschlossen sind.",
              "Sperre nach jedem Stern alle acht Nachbarfelder.",
              "Entferne danach die übrigen Felder in derselben Zeile, Spalte und Region."
            ]
          },
          {
            heading: "Legale Felder zählen",
            paragraphs: [
              "Zähle nicht einfach leere Felder. Ein Feld ist nur legal, wenn es keinen Stern berührt und nicht zu einer bereits gelösten Zeile, Spalte oder Region gehört.",
              "Wenn eine Gruppe nur noch ein legales Feld hat, ist der Stern dort erzwungen. Das ist der wichtigste Unterschied zwischen einem Hinweis und einer Vermutung."
            ]
          },
          {
            heading: "Wenn du feststeckst",
            paragraphs: [
              "Vergleiche Regionen mit Zeilen und Spalten. Liegen alle Kandidaten einer Region in derselben Zeile, kann diese Zeile an anderer Stelle oft Kandidaten verlieren.",
              "Nutze den Hinweis-Button erst nach dieser Prüfung. So erkennst du, welches Muster du übersehen hast, statt nur die Lösung zu übernehmen."
            ]
          }
        ],
        faq: [
          ["Was ist der beste erste Hinweis?", "Beginne mit der Gruppe, die die wenigsten legalen Felder hat."],
          ["Dürfen Sterne diagonal benachbart sein?", "Nein. Diagonales Berühren ist genauso verboten wie horizontales oder vertikales Berühren."],
          ["Sollte man raten?", "Bei einem geprüften Rätsel sollte ein logischer Weg existieren. Suche zuerst nach erzwungenen Feldern."]
        ]
      },
      es: {
        title: "Pistas de Star Battle - Resolver sin adivinar",
        description: "Pistas prácticas de Star Battle en español: cuenta casillas legales, bloquea vecinos, compara regiones y encuentra estrellas forzadas.",
        keywords: "pistas star battle, resolver star battle, estrategia star battle, star battle español",
        eyebrow: "Pistas de Star Battle",
        h1: "Pistas de Star Battle para resolver sin adivinar",
        ogTitle: "Pistas de Star Battle",
        ogDescription: "Una guía breve para encontrar pasos seguros en Star Battle.",
        cta: { label: "Jugar Star Battle online", href: "/es/#play" },
        sections: [
          {
            paragraphs: [
              "Una buena pista de Star Battle no debería ser una apuesta. Debe mostrarte qué fila, columna o región ya tiene una única casilla legal para colocar una estrella.",
              "Esta guía usa la versión 7x7 de Daily Logic Lab, pero las mismas ideas sirven para muchos puzzles tipo Two Not Touch y Queens."
            ]
          },
          {
            heading: "Lista rápida",
            list: [
              "Busca la fila, columna o región con menos casillas legales.",
              "Coloca una estrella solo cuando la posición esté forzada.",
              "Bloquea las ocho casillas vecinas después de cada estrella.",
              "Elimina también el resto de su fila, columna y región."
            ]
          },
          {
            heading: "Cuenta casillas legales",
            paragraphs: [
              "No basta con contar casillas vacías. Una casilla deja de ser legal si toca una estrella o si pertenece a una fila, columna o región ya resuelta.",
              "Cuando una zona necesita una estrella y solo queda una casilla legal, tienes un paso seguro. Esa es la base de la mayoría de las deducciones."
            ]
          },
          {
            heading: "Si te atascas",
            paragraphs: [
              "Compara regiones con filas y columnas. Si todos los candidatos de una región están en la misma fila, esa fila puede bloquear candidatos en otras regiones.",
              "Usa la pista del juego después de hacer esta revisión. Así la pista confirma el patrón que faltaba, en lugar de sustituir tu razonamiento."
            ]
          }
        ],
        faq: [
          ["¿Cuál es la mejor primera pista?", "Empieza por el grupo con menos casillas legales."],
          ["¿Las estrellas pueden tocarse en diagonal?", "No. No pueden tocarse ni en horizontal, ni en vertical, ni en diagonal."],
          ["¿Conviene adivinar?", "En un tablero verificado debería existir un camino lógico. Busca primero casillas forzadas."]
        ]
      },
      fr: {
        title: "Indices Star Battle - Résoudre sans deviner",
        description: "Indices Star Battle en français : compter les cases légales, bloquer les voisines, comparer les régions et trouver les étoiles forcées.",
        keywords: "indices star battle, résoudre star battle, stratégie star battle, star battle français",
        eyebrow: "Indices Star Battle",
        h1: "Indices Star Battle pour résoudre sans deviner",
        ogTitle: "Indices Star Battle",
        ogDescription: "Une méthode courte pour trouver les prochains coups sûrs.",
        cta: { label: "Jouer à Star Battle en ligne", href: "/fr/#play" },
        sections: [
          {
            paragraphs: [
              "Un bon indice Star Battle ne remplace pas la logique : il pointe vers le prochain groupe vraiment contraint. Cherche les cases encore légales après les règles de ligne, colonne, région et non-contact.",
              "La version Daily Logic Lab est en 7x7, mais la méthode s'applique aussi aux grilles Star Battle et Two Not Touch plus grandes."
            ]
          },
          {
            heading: "Checklist rapide",
            list: [
              "Repère la ligne, colonne ou région avec le moins de cases légales.",
              "Place une étoile seulement si toutes les autres cases sont interdites.",
              "Bloque les huit cases voisines après chaque étoile.",
              "Supprime aussi les autres cases de sa ligne, colonne et région."
            ]
          },
          {
            heading: "Compter les cases légales",
            paragraphs: [
              "Une case vide n'est pas toujours possible. Elle est interdite si elle touche une étoile ou si son groupe possède déjà son étoile.",
              "Quand un groupe doit encore recevoir une étoile et qu'il ne reste qu'une case légale, le placement est forcé. C'est le signal le plus fiable."
            ]
          },
          {
            heading: "Quand la grille bloque",
            paragraphs: [
              "Compare les régions avec les lignes et les colonnes. Si tous les candidats d'une région sont dans la même ligne, cette ligne peut éliminer des candidats ailleurs.",
              "Utilise ensuite le bouton d'indice pour vérifier ton analyse. Le but est d'apprendre le motif, pas seulement d'obtenir la réponse."
            ]
          }
        ],
        faq: [
          ["Quel est le meilleur premier indice ?", "Commence par le groupe qui possède le moins de cases légales."],
          ["Les étoiles peuvent-elles se toucher en diagonale ?", "Non. Le contact diagonal est interdit."],
          ["Faut-il deviner ?", "Une grille vérifiée devrait avoir un chemin logique. Cherche d'abord les cases forcées."]
        ]
      }
    }
  },
  {
    key: "twoNotTouch",
    paths: {
      en: "/two-not-touch-puzzle",
      de: "/de/two-not-touch",
      es: "/es/two-not-touch",
      fr: "/fr/two-not-touch"
    },
    changefreq: "monthly",
    priority: "0.7",
    pages: {
      de: {
        title: "Two Not Touch Puzzle - Star Battle online spielen",
        description: "Two Not Touch auf Deutsch erklärt: Sterne dürfen sich nicht berühren. Spiele eine kostenlose Star-Battle-Variante mit eindeutiger Lösung.",
        keywords: "two not touch puzzle, star battle deutsch, nicht berühren rätsel, sterne rätsel",
        eyebrow: "Two Not Touch",
        h1: "Two Not Touch Puzzle online",
        ogTitle: "Two Not Touch Puzzle",
        ogDescription: "Eine Star-Battle-Variante, bei der Sterne sich nicht berühren dürfen.",
        cta: { label: "Two Not Touch online spielen", href: "/de/#play" },
        sections: [
          {
            paragraphs: [
              "Two Not Touch beschreibt eine einfache, aber starke Regel: gesetzte Teile dürfen sich nicht berühren, auch nicht diagonal. In Daily Logic Lab sind diese Teile Sterne auf einem Star-Battle-Brett.",
              "Das Ziel bleibt kompakt: je ein Stern in jede Zeile, Spalte und Farbregion. Die Nicht-Berühren-Regel sorgt dafür, dass ein einziger Stern viele Nachbarfelder ausschließt."
            ]
          },
          {
            heading: "Regeln dieser Version",
            list: [
              "Genau ein Stern in jeder Zeile.",
              "Genau ein Stern in jeder Spalte.",
              "Genau ein Stern in jeder Farbregion.",
              "Keine zwei Sterne berühren sich, auch nicht diagonal.",
              "Jedes Brett wird auf eine eindeutige Lösung geprüft."
            ]
          },
          {
            heading: "Warum die Regel wichtig ist",
            paragraphs: [
              "Ein Stern füllt nicht nur ein Feld. Er blockiert alle acht Nachbarn und kann dadurch eine andere Zeile, Spalte oder Region sofort einschränken.",
              "Wenn du nach jedem Stern die Umgebung markierst, entstehen oft Ketten aus erzwungenen Zügen. Genau das macht Two Not Touch so gut für kurze Logikrunden."
            ]
          }
        ],
        faq: [
          ["Was bedeutet Two Not Touch?", "Zwei gesetzte Teile dürfen sich weder an einer Kante noch an einer Ecke berühren."],
          ["Ist das dasselbe wie Star Battle?", "Es ist eng verwandt. Star Battle kombiniert die Nicht-Berühren-Regel mit Zeilen, Spalten und Regionen."],
          ["Kann ich mehr als ein Rätsel spielen?", "Ja. Neben dem Tagesrätsel gibt es neue Trainingsbretter."]
        ]
      },
      es: {
        title: "Two Not Touch Puzzle - Jugar Star Battle online",
        description: "Qué significa Two Not Touch en español: estrellas que no se tocan, reglas de Star Battle y práctica online gratis con solución única.",
        keywords: "two not touch puzzle, star battle español, estrellas no se tocan, puzzle lógico",
        eyebrow: "Two Not Touch",
        h1: "Two Not Touch Puzzle online",
        ogTitle: "Two Not Touch Puzzle",
        ogDescription: "Un puzzle tipo Star Battle donde las estrellas no pueden tocarse.",
        cta: { label: "Jugar Two Not Touch online", href: "/es/#play" },
        sections: [
          {
            paragraphs: [
              "Two Not Touch significa que dos piezas colocadas no pueden tocarse, ni siquiera por las esquinas. En Daily Logic Lab esa idea se juega como un tablero de Star Battle con estrellas.",
              "El objetivo es colocar una estrella en cada fila, columna y región de color. La regla de no tocarse convierte cada estrella en una fuente de eliminaciones."
            ]
          },
          {
            heading: "Reglas de esta versión",
            list: [
              "Una estrella en cada fila.",
              "Una estrella en cada columna.",
              "Una estrella en cada región de color.",
              "Ninguna estrella toca otra, tampoco en diagonal.",
              "Cada tablero se verifica para tener una solución única."
            ]
          },
          {
            heading: "Cómo resolver mejor",
            paragraphs: [
              "Después de colocar una estrella, marca las ocho casillas vecinas como imposibles. Luego revisa si alguna fila, columna o región quedó con una sola casilla legal.",
              "La mayoría de los avances aparecen cuando combinas la regla de no tocarse con las restricciones de fila, columna y región."
            ]
          }
        ],
        faq: [
          ["¿Qué significa Two Not Touch?", "Que dos piezas no pueden tocarse por un lado ni por una esquina."],
          ["¿Es lo mismo que Star Battle?", "Está muy relacionado. Star Battle añade filas, columnas y regiones a la regla de no tocarse."],
          ["¿Puedo jugar más de un tablero?", "Sí. Hay puzzle diario y tableros de práctica."]
        ]
      },
      fr: {
        title: "Two Not Touch Puzzle - Jouer à Star Battle en ligne",
        description: "Two Not Touch expliqué en français : les étoiles ne se touchent pas. Joue une grille Star Battle gratuite à solution unique.",
        keywords: "two not touch puzzle, star battle français, étoiles ne se touchent pas, puzzle logique",
        eyebrow: "Two Not Touch",
        h1: "Two Not Touch Puzzle en ligne",
        ogTitle: "Two Not Touch Puzzle",
        ogDescription: "Une grille Star Battle où les étoiles ne peuvent jamais se toucher.",
        cta: { label: "Jouer à Two Not Touch", href: "/fr/#play" },
        sections: [
          {
            paragraphs: [
              "Two Not Touch désigne une règle simple : deux pièces posées ne peuvent pas se toucher, même par un coin. Sur Daily Logic Lab, cette idée devient une grille Star Battle avec des étoiles.",
              "Chaque ligne, colonne et région doit recevoir une étoile. La règle de non-contact transforme chaque étoile placée en une série d'éliminations autour d'elle."
            ]
          },
          {
            heading: "Règles de cette version",
            list: [
              "Une étoile dans chaque ligne.",
              "Une étoile dans chaque colonne.",
              "Une étoile dans chaque région colorée.",
              "Aucune étoile ne touche une autre, même en diagonale.",
              "Chaque grille est vérifiée pour garder une solution unique."
            ]
          },
          {
            heading: "Méthode simple",
            paragraphs: [
              "Après chaque étoile, bloque les huit cases voisines. Vérifie ensuite si une ligne, colonne ou région n'a plus qu'une case possible.",
              "Ce va-et-vient entre non-contact et groupes à compléter donne la plupart des déductions sans deviner."
            ]
          }
        ],
        faq: [
          ["Que veut dire Two Not Touch ?", "Deux pièces ne peuvent pas se toucher par un côté ou un coin."],
          ["Est-ce Star Battle ?", "C'est très proche. Star Battle ajoute les contraintes de lignes, colonnes et régions."],
          ["Peut-on jouer gratuitement ?", "Oui. Le puzzle quotidien et les grilles d'entraînement sont accessibles dans le navigateur."]
        ]
      }
    }
  },
  {
    key: "queensAlternative",
    paths: {
      en: "/queens-puzzle-alternative",
      de: "/de/queens-alternative",
      es: "/es/alternativa-queens",
      fr: "/fr/alternative-queens"
    },
    changefreq: "weekly",
    priority: "0.8",
    pages: {
      de: {
        title: "Queens Alternative - Star Battle ohne Anmeldung spielen",
        description: "Suchst du eine Queens-Alternative? Spiele Star Battle online: Zeilen, Spalten, Regionen, Nicht-Berühren-Regel und unbegrenztes Training.",
        keywords: "queens alternative, queens rätsel alternative, star battle deutsch, queens style puzzle",
        eyebrow: "Queens Alternative",
        h1: "Eine Queens-Alternative: Star Battle online",
        ogTitle: "Queens Alternative",
        ogDescription: "Star Battle für Spieler, die mehr Queens-ähnliche Rätsel möchten.",
        cta: { label: "Queens-Alternative spielen", href: "/de/#play" },
        sections: [
          {
            paragraphs: [
              "Wenn du Queens magst und nach mehr Rätseln suchst, ist Star Battle ein naheliegender nächster Schritt. Auch hier zählen Zeilen, Spalten und Regionen, aber statt Kronen setzt du Sterne.",
              "Der wichtigste Zusatz ist die Nicht-Berühren-Regel: Sterne dürfen sich nicht horizontal, vertikal oder diagonal berühren. Dadurch fühlt sich jedes gesetzte Feld noch stärker an."
            ]
          },
          {
            heading: "Warum es für Queens-Spieler passt",
            list: [
              "Kurze Runden direkt im Browser.",
              "Tagesrätsel plus unbegrenzte Trainingsbretter.",
              "Keine Anmeldung nötig.",
              "Jedes Brett wird auf eine eindeutige Lösung geprüft.",
              "Hinweise helfen, ohne sofort alles zu verraten."
            ]
          },
          {
            heading: "Der wichtigste Unterschied",
            paragraphs: [
              "Bei Queens beendest du mit einem gesetzten Teil vor allem die Zeile, Spalte oder Region. Bei Star Battle blockiert ein Stern zusätzlich alle Nachbarfelder.",
              "Wenn du von Queens kommst, behalte dein Scanmuster bei und frage nach jedem Stern: Welche Felder berührt er? Diese Gewohnheit verhindert die meisten Fehler."
            ]
          },
          {
            heading: "Mehr als nur ein Tagesrätsel",
            paragraphs: [
              "Viele Spieler suchen nach einer Queens-Alternative, weil sie nach dem täglichen Brett weiter knobeln möchten. Daily Logic Lab trennt deshalb Tagesrätsel und Training: Das Tagesrätsel bleibt der Vergleichspunkt, Practice erzeugt weitere Bretter.",
              "So kannst du dieselbe Logikfamilie länger üben, ohne App-Installation, Login oder Wartezeit bis morgen."
            ]
          }
        ],
        faq: [
          ["Was ist eine gute Queens-Alternative?", "Star Battle ist eine starke Alternative, weil es ähnliche Platzierungslogik mit einer zusätzlichen Nicht-Berühren-Regel kombiniert."],
          ["Kann ich unbegrenzt üben?", "Ja. Nach dem Tagesrätsel kannst du weitere Trainingsbretter starten."],
          ["Brauche ich ein Konto?", "Nein. Alles läuft ohne Anmeldung im Browser."]
        ]
      },
      es: {
        title: "Alternativa a Queens - Jugar Star Battle sin registro",
        description: "¿Buscas una alternativa a Queens? Prueba Star Battle online con filas, columnas, regiones, regla de no tocarse y práctica ilimitada.",
        keywords: "alternativa queens, queens puzzle alternativa, star battle español, puzzle tipo queens",
        eyebrow: "Alternativa a Queens",
        h1: "Una alternativa a Queens: Star Battle online",
        ogTitle: "Alternativa a Queens",
        ogDescription: "Star Battle para jugadores que quieren más puzzles tipo Queens.",
        cta: { label: "Jugar la alternativa a Queens", href: "/es/#play" },
        sections: [
          {
            paragraphs: [
              "Si te gusta Queens y quieres más tableros, Star Battle es una continuación natural. Sigues razonando con filas, columnas y regiones, pero colocas estrellas.",
              "La diferencia clave es que las estrellas no pueden tocarse, ni siquiera en diagonal. Una sola estrella puede bloquear muchas casillas cercanas."
            ]
          },
          {
            heading: "Por qué encaja con jugadores de Queens",
            list: [
              "Partidas cortas en el navegador.",
              "Puzzle diario y práctica ilimitada.",
              "Sin crear cuenta.",
              "Tableros verificados con solución única.",
              "Pistas útiles para aprender patrones."
            ]
          },
          {
            heading: "Cómo cambiar de Queens a Star Battle",
            paragraphs: [
              "Mantén tu forma de escanear filas, columnas y regiones, pero añade una pregunta después de cada estrella: ¿qué casillas toca?",
              "Marcar esas vecinas como imposibles hace que el tablero se aclare rápido y evita colocaciones ilegales."
            ]
          },
          {
            heading: "Más que un puzzle diario",
            paragraphs: [
              "Mucha gente busca una alternativa a Queens porque quiere seguir jugando después del tablero del día. Daily Logic Lab separa el reto diario de la práctica: el diario es el punto de comparación y Practice genera más tableros.",
              "Así puedes entrenar la misma familia de lógica durante más tiempo, sin instalar una app, crear una cuenta o esperar a mañana."
            ]
          }
        ],
        faq: [
          ["¿Cuál es una buena alternativa a Queens?", "Star Battle es una buena opción porque conserva la lógica de colocación y añade la regla de no tocarse."],
          ["¿Hay práctica ilimitada?", "Sí. Puedes jugar el tablero diario y generar nuevos tableros de práctica."],
          ["¿Necesito registrarme?", "No. Funciona directamente en el navegador."]
        ]
      },
      fr: {
        title: "Alternative à Queens - Jouer à Star Battle sans compte",
        description: "Tu cherches une alternative à Queens ? Essaie Star Battle en ligne avec lignes, colonnes, régions, règle de non-contact et entraînement illimité.",
        keywords: "alternative queens, puzzle queens alternative, star battle français, puzzle type queens",
        eyebrow: "Alternative à Queens",
        h1: "Une alternative à Queens : Star Battle en ligne",
        ogTitle: "Alternative à Queens",
        ogDescription: "Star Battle pour les joueurs qui veulent plus de puzzles façon Queens.",
        cta: { label: "Jouer à l'alternative Queens", href: "/fr/#play" },
        sections: [
          {
            paragraphs: [
              "Si tu aimes Queens et que tu veux plus de grilles, Star Battle est une suite naturelle. On garde le raisonnement par lignes, colonnes et régions, mais on place des étoiles.",
              "La différence importante est la règle de non-contact : deux étoiles ne peuvent pas se toucher, même en diagonale. Un seul placement peut donc bloquer tout un voisinage."
            ]
          },
          {
            heading: "Pourquoi cela plaît aux joueurs de Queens",
            list: [
              "Parties courtes dans le navigateur.",
              "Puzzle du jour et entraînement illimité.",
              "Aucun compte requis.",
              "Grilles vérifiées avec solution unique.",
              "Indices utiles pour apprendre les motifs."
            ]
          },
          {
            heading: "Passer de Queens à Star Battle",
            paragraphs: [
              "Garde ton habitude de scanner les lignes, colonnes et régions, puis ajoute une question après chaque étoile : quelles cases touche-t-elle ?",
              "Bloquer ces voisines immédiatement rend la grille plus lisible et évite la plupart des erreurs de placement."
            ]
          },
          {
            heading: "Plus qu'un puzzle quotidien",
            paragraphs: [
              "Beaucoup de joueurs cherchent une alternative à Queens parce qu'ils veulent continuer après la grille du jour. Daily Logic Lab sépare donc le puzzle quotidien et l'entraînement : le premier sert de repère, le second génère d'autres grilles.",
              "Tu peux ainsi pratiquer la même famille logique plus longtemps, sans installer d'application, créer de compte ou attendre demain."
            ]
          }
        ],
        faq: [
          ["Quelle est une bonne alternative à Queens ?", "Star Battle est une bonne option car il garde la logique de placement et ajoute la règle de non-contact."],
          ["Peut-on s'entraîner sans limite ?", "Oui. Le puzzle quotidien peut être suivi de grilles d'entraînement."],
          ["Faut-il créer un compte ?", "Non. Le jeu fonctionne directement dans le navigateur."]
        ]
      }
    }
  }
];

const localizedLongtailGroups = [
  {
    paths: {
      en: "/star-battle",
      de: "/de/star-battle",
      es: "/es/star-battle",
      fr: "/fr/star-battle",
      zh: "/zh-cn/star-battle"
    },
    changefreq: "weekly",
    priority: "0.8"
  },
  {
    paths: {
      en: "/killer-sudoku-combination-calculator",
      de: "/de/killer-sudoku-kombinationen-rechner",
      es: "/es/calculadora-combinaciones-sudoku-killer"
    },
    changefreq: "monthly",
    priority: "0.8"
  },
  ...localizedLongtailArticles.map(({ paths, changefreq, priority }) => ({ paths, changefreq, priority }))
];

function seo(language) {
  return seoProfiles[language.key] || seoProfiles.en;
}

function supportPath(language, pageKey) {
  const slug = supportSlugs[pageKey];
  return language.key === "en" ? `/${slug}` : `${language.path}${slug}`;
}

function supportOutPath(language, pageKey) {
  const slug = supportSlugs[pageKey];
  if (language.key === "en") return `${slug}.html`;
  const localeDir = language.path.replace(/^\/|\/$/g, "");
  return `${localeDir}/${slug}.html`;
}

const supportContent = {
  en: {
    about: {
      schemaType: "AboutPage",
      title: "About Daily Logic Lab - Free Daily Logic Puzzles",
      description: "Learn about Daily Logic Lab, a free browser-based logic puzzle site with daily Star Battle puzzles and puzzle helper tools.",
      eyebrow: "About",
      h1: "About Daily Logic Lab",
      sections: [
        {
          paragraphs: [
            "Daily Logic Lab is a small browser-based puzzle site for short daily logic games and practical puzzle helper tools. The first game is Daily Star Battle, a Queens-style placement puzzle where every generated board is checked by a solver before it is shown."
          ]
        },
        {
          heading: "What the Site Offers",
          list: [
            "A free daily Star Battle puzzle.",
            "Unlimited practice boards with solver-verified unique solutions.",
            "A time-cost hint system, so hints help without removing the challenge.",
            "A Killer Sudoku cage combination calculator for pencil puzzle solving.",
            "No account requirement for the current puzzle experience."
          ]
        },
        {
          heading: "Why It Exists",
          paragraphs: [
            "The goal is to make small logic puzzles easy to start, fair to solve, and worth returning to. The site focuses on fast loading, clean puzzle controls, mobile-friendly play, and useful explanations for people discovering Star Battle or related grid puzzles."
          ]
        },
        {
          heading: "How Puzzles Are Generated",
          paragraphs: [
            "Star Battle boards are generated in the browser and checked against a solver. A board is accepted only when the solver finds exactly one valid solution."
          ]
        }
      ],
      cta: { label: "Play today's puzzle", href: "/#play" }
    },
    contact: {
      schemaType: "ContactPage",
      title: "Contact Daily Logic Lab - Puzzle Feedback and Site Support",
      description: "Contact Daily Logic Lab for puzzle feedback, bug reports, content corrections, and site questions.",
      eyebrow: "Contact",
      h1: "Contact Daily Logic Lab",
      sections: [
        {
          paragraphs: [
            "Use this page for puzzle feedback, bug reports, content corrections, and site questions. Daily Logic Lab does not require user accounts, so you do not need to send passwords or private account details."
          ]
        },
        {
          heading: "Report a Puzzle or Site Issue",
          paragraphs: [
            "The preferred contact method is the public GitHub issue tracker. It is useful for bug reports because you can include the page URL, browser, device, and a short description of what happened."
          ],
          links: [{ label: "Open a Daily Logic Lab issue on GitHub", href: "https://github.com/DennyHo0917/dailylogiclab/issues" }]
        },
        {
          heading: "Helpful Details to Include",
          list: [
            "The page where the issue happened.",
            "Your browser and device type.",
            "Whether you were playing the daily puzzle or practice mode.",
            "A short description of the expected result and the actual result."
          ]
        },
        {
          heading: "Content and Privacy Questions",
          paragraphs: [
            "For privacy-related questions, read the Privacy Policy first. For general site background, visit the About page."
          ]
        }
      ]
    },
    privacy: {
      schemaType: "WebPage",
      title: "Privacy Policy - Daily Logic Lab",
      description: "Read the Daily Logic Lab privacy policy, including information about analytics, local browser storage, cookies, and future advertising.",
      eyebrow: "Privacy",
      h1: "Privacy Policy",
      updatedLabel: "Last updated:",
      sections: [
        { paragraphs: ["Daily Logic Lab provides free browser-based logic puzzles and puzzle helper tools. This policy explains what information may be collected when you use the site."] },
        { heading: "Information You Provide", paragraphs: ["Daily Logic Lab does not currently require accounts, sign-ins, or payment details. If you contact the site through GitHub issues, the information you choose to post there is handled by GitHub and may be public."] },
        { heading: "Local Browser Storage", paragraphs: ["The puzzle experience may store small pieces of data in your browser, such as streak status, best times, solved dates, hint counts, and recent in-browser event records. You can clear it by clearing site data in your browser settings."] },
        { heading: "Analytics", paragraphs: ["Daily Logic Lab uses Google Analytics to understand aggregate site usage, such as page views, puzzle starts, hints, checks, and general device or browser information. Google may use cookies or similar technologies for measurement."] },
        { heading: "Advertising", paragraphs: ["Daily Logic Lab does not currently display advertising. If advertising is added later, the site may use Google AdSense or related Google advertising services. Google and its partners may use cookies to serve, measure, and personalize ads."] },
        { heading: "Third-Party Links", paragraphs: ["The site may link to external pages, such as GitHub or Google documentation. Daily Logic Lab is not responsible for the privacy practices of external websites."] },
        { heading: "Children's Privacy", paragraphs: ["Daily Logic Lab is a general-audience puzzle site and does not knowingly collect personal information from children."] },
        {
          heading: "Useful Privacy Links",
          links: [
            { label: "Google Privacy Policy", href: "https://policies.google.com/privacy" },
            { label: "Google Ads Settings", href: "https://adssettings.google.com/" }
          ]
        }
      ]
    }
  },
  de: {
    about: {
      schemaType: "AboutPage",
      title: "Über Daily Logic Lab - Kostenlose tägliche Logikrätsel",
      description: "Erfahre mehr über Daily Logic Lab, eine kostenlose Browser-Seite für tägliche Star-Battle-Rätsel und kleine Rätselhilfen.",
      eyebrow: "Über uns",
      h1: "Über Daily Logic Lab",
      sections: [
        { paragraphs: ["Daily Logic Lab ist eine kleine Browser-Seite für kurze Logikrätsel und praktische Rätselhilfen. Im Mittelpunkt steht Daily Star Battle, ein Platzierungsrätsel im Queens-Stil, bei dem jedes Brett vor dem Anzeigen mit einem Solver geprüft wird."] },
        { heading: "Was die Seite bietet", list: ["Ein kostenloses tägliches Star-Battle-Rätsel.", "Unbegrenzte Trainingsbretter mit geprüfter eindeutiger Lösung.", "Hinweise mit Zeitstrafe, damit der Reiz erhalten bleibt.", "Einen Killer-Sudoku-Rechner für Käfigsummen und Kombinationen.", "Keine Anmeldung für das aktuelle Spielerlebnis."] },
        { heading: "Warum es die Seite gibt", paragraphs: ["Das Ziel ist ein Rätsel, das schnell startet, fair lösbar ist und trotzdem zum Wiederkommen einlädt. Die Seite setzt auf kurze Ladezeiten, klare Steuerung und verständliche Erklärungen."] },
        { heading: "Wie die Rätsel entstehen", paragraphs: ["Star-Battle-Bretter werden im Browser erzeugt und gegen einen Solver geprüft. Ein Brett wird nur akzeptiert, wenn genau eine gültige Lösung existiert."] }
      ],
      cta: { label: "Heutiges Rätsel spielen", href: "/de/#play" }
    },
    contact: {
      schemaType: "ContactPage",
      title: "Kontakt - Daily Logic Lab",
      description: "Kontaktiere Daily Logic Lab für Rätsel-Feedback, Fehlerberichte, Inhaltskorrekturen und Fragen zur Website.",
      eyebrow: "Kontakt",
      h1: "Kontakt zu Daily Logic Lab",
      sections: [
        { paragraphs: ["Nutze diese Seite für Feedback, Fehlerberichte, Korrekturen oder allgemeine Fragen. Daily Logic Lab verlangt keine Konten, daher solltest du keine Passwörter oder privaten Kontodaten senden."] },
        { heading: "Problem melden", paragraphs: ["Am besten nutzt du den öffentlichen GitHub-Issue-Tracker. Dort kannst du Seiten-URL, Browser, Gerät und eine kurze Beschreibung ergänzen."], links: [{ label: "Ein Issue auf GitHub öffnen", href: "https://github.com/DennyHo0917/dailylogiclab/issues" }] },
        { heading: "Hilfreiche Angaben", list: ["Die Seite, auf der das Problem aufgetreten ist.", "Browser und Gerätetyp.", "Tagesrätsel oder Trainingsmodus.", "Was du erwartet hast und was tatsächlich passiert ist."] },
        { heading: "Datenschutzfragen", paragraphs: ["Lies bei Datenschutzfragen zuerst die Datenschutzerklärung. Hintergrund zur Seite findest du auf der Über-uns-Seite."] }
      ]
    },
    privacy: {
      schemaType: "WebPage",
      title: "Datenschutzerklärung - Daily Logic Lab",
      description: "Datenschutzhinweise zu Daily Logic Lab, einschließlich Analytics, lokalem Browserspeicher, Cookies und möglicher späterer Werbung.",
      eyebrow: "Datenschutz",
      h1: "Datenschutzerklärung",
      updatedLabel: "Zuletzt aktualisiert:",
      sections: [
        { paragraphs: ["Daily Logic Lab bietet kostenlose Logikrätsel und kleine Hilfswerkzeuge im Browser. Diese Erklärung beschreibt, welche Informationen bei der Nutzung anfallen können."] },
        { heading: "Von dir bereitgestellte Informationen", paragraphs: ["Aktuell gibt es keine Konten, Logins oder Zahlungsdaten. Wenn du über GitHub Issues Kontakt aufnimmst, werden die dort geposteten Informationen von GitHub verarbeitet und können öffentlich sein."] },
        { heading: "Lokaler Browserspeicher", paragraphs: ["Die Seite kann lokal Daten speichern, etwa Serie, Bestzeiten, gelöste Tage, Hinweise und jüngste In-Browser-Ereignisse. Du kannst diese Daten über die Website-Daten deines Browsers löschen."] },
        { heading: "Analytics", paragraphs: ["Daily Logic Lab nutzt Google Analytics, um aggregierte Nutzung zu verstehen, zum Beispiel Seitenaufrufe, Starts, Hinweise, Prüfungen sowie allgemeine Geräte- und Browserinformationen."] },
        { heading: "Werbung", paragraphs: ["Derzeit zeigt Daily Logic Lab keine Werbung. Wenn später Werbung ergänzt wird, kann Google AdSense oder ein verwandter Google-Dienst eingesetzt werden. Google und Partner können Cookies zur Auslieferung, Messung und Personalisierung von Anzeigen verwenden."] },
        { heading: "Externe Links", paragraphs: ["Die Seite kann zu GitHub, Google-Dokumentation oder anderen externen Seiten verlinken. Für deren Datenschutzpraxis ist Daily Logic Lab nicht verantwortlich."] },
        { heading: "Kinder", paragraphs: ["Daily Logic Lab ist eine allgemeine Rätselseite und sammelt wissentlich keine personenbezogenen Daten von Kindern."] },
        { heading: "Nützliche Datenschutzlinks", links: [{ label: "Google-Datenschutzerklärung", href: "https://policies.google.com/privacy" }, { label: "Google-Anzeigeneinstellungen", href: "https://adssettings.google.com/" }] }
      ]
    }
  },
  es: {
    about: {
      schemaType: "AboutPage",
      title: "Acerca de Daily Logic Lab - Puzzles lógicos gratis",
      description: "Conoce Daily Logic Lab, un sitio gratuito para jugar Star Battle diario y usar pequeñas herramientas para puzzles.",
      eyebrow: "Acerca de",
      h1: "Acerca de Daily Logic Lab",
      sections: [
        { paragraphs: ["Daily Logic Lab es un pequeño sitio de puzzles para navegador, pensado para retos cortos y herramientas útiles. Su primer juego es Daily Star Battle, un puzzle de colocación tipo Queens verificado con solver antes de mostrarse."] },
        { heading: "Qué ofrece", list: ["Un Star Battle diario gratis.", "Práctica ilimitada con solución única verificada.", "Pistas con penalización de tiempo.", "Una calculadora de combinaciones para Killer Sudoku.", "Sin cuenta para la experiencia actual."] },
        { heading: "Por qué existe", paragraphs: ["La idea es que un puzzle lógico sea fácil de empezar, justo de resolver y suficientemente bueno como para volver al día siguiente."] },
        { heading: "Cómo se generan los puzzles", paragraphs: ["Los tableros se generan en el navegador y se revisan con un solver. Solo se acepta un tablero si tiene exactamente una solución válida."] }
      ],
      cta: { label: "Jugar el reto de hoy", href: "/es/#play" }
    },
    contact: {
      schemaType: "ContactPage",
      title: "Contacto - Daily Logic Lab",
      description: "Contacta con Daily Logic Lab para enviar comentarios, reportar errores o hacer preguntas sobre el sitio.",
      eyebrow: "Contacto",
      h1: "Contacto Daily Logic Lab",
      sections: [
        { paragraphs: ["Usa esta página para comentarios, errores, correcciones de contenido o preguntas. Daily Logic Lab no usa cuentas, así que no envíes contraseñas ni datos privados."] },
        { heading: "Reportar un problema", paragraphs: ["El método recomendado es el issue tracker público de GitHub. Ayuda incluir la URL, navegador, dispositivo y una descripción breve."], links: [{ label: "Abrir un issue en GitHub", href: "https://github.com/DennyHo0917/dailylogiclab/issues" }] },
        { heading: "Datos útiles", list: ["La página donde ocurrió el problema.", "Tu navegador y dispositivo.", "Si estabas en el reto diario o en práctica.", "Qué esperabas y qué ocurrió."] },
        { heading: "Privacidad y contenido", paragraphs: ["Para privacidad, revisa primero la Política de privacidad. Para contexto del proyecto, visita la página Acerca de."] }
      ]
    },
    privacy: {
      schemaType: "WebPage",
      title: "Política de privacidad - Daily Logic Lab",
      description: "Política de privacidad de Daily Logic Lab sobre analítica, almacenamiento local, cookies y posible publicidad futura.",
      eyebrow: "Privacidad",
      h1: "Política de privacidad",
      updatedLabel: "Última actualización:",
      sections: [
        { paragraphs: ["Daily Logic Lab ofrece puzzles lógicos y herramientas gratuitas en el navegador. Esta política explica qué información puede recogerse al usar el sitio."] },
        { heading: "Información que proporcionas", paragraphs: ["No se requieren cuentas, inicios de sesión ni pagos. Si contactas mediante GitHub Issues, lo que publiques allí lo gestiona GitHub y puede ser público."] },
        { heading: "Almacenamiento local", paragraphs: ["El juego puede guardar datos pequeños en tu navegador, como racha, mejores tiempos, fechas resueltas, uso de pistas y eventos recientes. Puedes borrarlos limpiando los datos del sitio."] },
        { heading: "Analítica", paragraphs: ["Daily Logic Lab usa Google Analytics para entender el uso agregado, como páginas vistas, inicios de puzzles, pistas, revisiones e información general de dispositivo o navegador."] },
        { heading: "Publicidad", paragraphs: ["Actualmente no hay anuncios. Si se añaden más adelante, el sitio puede usar Google AdSense u otros servicios publicitarios de Google. Google y sus socios pueden usar cookies para medir, mostrar y personalizar anuncios."] },
        { heading: "Enlaces externos", paragraphs: ["El sitio puede enlazar a GitHub, documentación de Google u otras páginas externas. Daily Logic Lab no controla sus prácticas de privacidad."] },
        { heading: "Privacidad de menores", paragraphs: ["Daily Logic Lab es un sitio general de puzzles y no recopila conscientemente información personal de niños."] },
        { heading: "Enlaces útiles", links: [{ label: "Privacidad de Google", href: "https://policies.google.com/privacy" }, { label: "Configuración de anuncios de Google", href: "https://adssettings.google.com/" }] }
      ]
    }
  },
  fr: {
    about: {
      schemaType: "AboutPage",
      title: "À propos de Daily Logic Lab - Puzzles logiques gratuits",
      description: "Découvre Daily Logic Lab, un site gratuit de puzzles logiques avec Star Battle quotidien et outils d'aide.",
      eyebrow: "À propos",
      h1: "À propos de Daily Logic Lab",
      sections: [
        { paragraphs: ["Daily Logic Lab est un petit site de puzzles dans le navigateur, pensé pour des parties courtes et des outils pratiques. Le premier jeu est Daily Star Battle, un puzzle de placement façon Queens vérifié par solveur avant affichage."] },
        { heading: "Ce que propose le site", list: ["Un Star Battle quotidien gratuit.", "Des grilles d'entraînement illimitées à solution unique.", "Des indices avec pénalité de temps.", "Une calculatrice de combinaisons Killer Sudoku.", "Aucun compte nécessaire pour jouer."] },
        { heading: "Pourquoi ce site existe", paragraphs: ["Le but est de rendre les petits puzzles logiques rapides à lancer, justes à résoudre et agréables à reprendre chaque jour."] },
        { heading: "Génération des grilles", paragraphs: ["Les grilles Star Battle sont générées dans le navigateur puis vérifiées par un solveur. Une grille n'est acceptée que si elle possède exactement une solution valide."] }
      ],
      cta: { label: "Jouer le puzzle du jour", href: "/fr/#play" }
    },
    contact: {
      schemaType: "ContactPage",
      title: "Contact - Daily Logic Lab",
      description: "Contacter Daily Logic Lab pour un retour, un bug, une correction de contenu ou une question sur le site.",
      eyebrow: "Contact",
      h1: "Contacter Daily Logic Lab",
      sections: [
        { paragraphs: ["Utilise cette page pour les retours, bugs, corrections et questions. Daily Logic Lab ne demande pas de compte, donc n'envoie pas de mot de passe ni de données privées."] },
        { heading: "Signaler un problème", paragraphs: ["La méthode recommandée est le tracker public GitHub. Indique l'URL, le navigateur, l'appareil et une courte description."], links: [{ label: "Ouvrir un ticket GitHub", href: "https://github.com/DennyHo0917/dailylogiclab/issues" }] },
        { heading: "Détails utiles", list: ["La page concernée.", "Ton navigateur et ton appareil.", "Puzzle du jour ou mode entraînement.", "Le résultat attendu et ce qui s'est produit."] },
        { heading: "Confidentialité", paragraphs: ["Pour les questions de confidentialité, consulte d'abord la politique de confidentialité. Pour le contexte du site, lis la page À propos."] }
      ]
    },
    privacy: {
      schemaType: "WebPage",
      title: "Politique de confidentialité - Daily Logic Lab",
      description: "Politique de confidentialité de Daily Logic Lab concernant l'analytique, le stockage local, les cookies et la publicité future.",
      eyebrow: "Confidentialité",
      h1: "Politique de confidentialité",
      updatedLabel: "Dernière mise à jour :",
      sections: [
        { paragraphs: ["Daily Logic Lab propose des puzzles logiques gratuits et des outils d'aide dans le navigateur. Cette politique explique quelles informations peuvent être collectées."] },
        { heading: "Informations fournies", paragraphs: ["Le site ne demande actuellement ni compte, ni connexion, ni paiement. Si tu contactes le projet via GitHub Issues, les informations publiées sont gérées par GitHub et peuvent être publiques."] },
        { heading: "Stockage local", paragraphs: ["Le jeu peut enregistrer localement la série, les meilleurs temps, les dates résolues, les indices utilisés et des événements récents. Tu peux supprimer ces données dans les paramètres du navigateur."] },
        { heading: "Analytique", paragraphs: ["Daily Logic Lab utilise Google Analytics pour comprendre l'usage agrégé : pages vues, lancements de puzzle, indices, vérifications et informations générales de navigateur ou d'appareil."] },
        { heading: "Publicité", paragraphs: ["Le site n'affiche pas de publicité actuellement. Si cela change, Daily Logic Lab pourra utiliser Google AdSense ou des services publicitaires Google. Google et ses partenaires peuvent utiliser des cookies pour mesurer, afficher et personnaliser les annonces."] },
        { heading: "Liens externes", paragraphs: ["Le site peut renvoyer vers GitHub, Google ou d'autres pages externes. Daily Logic Lab n'est pas responsable de leurs pratiques de confidentialité."] },
        { heading: "Enfants", paragraphs: ["Daily Logic Lab est un site de puzzles grand public et ne collecte pas volontairement d'informations personnelles concernant les enfants."] },
        { heading: "Liens utiles", links: [{ label: "Politique de confidentialité Google", href: "https://policies.google.com/privacy" }, { label: "Paramètres des annonces Google", href: "https://adssettings.google.com/" }] }
      ]
    }
  },
  ja: {
    about: {
      schemaType: "AboutPage",
      title: "Daily Logic Lab について - 無料ロジックパズル",
      description: "Daily Logic Lab は、毎日遊べる Star Battle とパズル補助ツールを提供する無料のブラウザサイトです。",
      eyebrow: "このサイト",
      h1: "Daily Logic Lab について",
      sections: [
        { paragraphs: ["Daily Logic Lab は、短時間で遊べるロジックパズルと補助ツールのための小さなブラウザサイトです。最初のゲームは Daily Star Battle で、表示前に solver で唯一解を確認しています。"] },
        { heading: "できること", list: ["無料のデイリー Star Battle。", "唯一解チェック済みの練習問題。", "時間ペナルティ付きのヒント。", "Killer Sudoku の組み合わせ計算。", "現在のパズル体験ではアカウント不要。"] },
        { heading: "なぜ作ったか", paragraphs: ["すぐ始められて、納得して解けて、また翌日戻りたくなる小さなパズル体験を作るためです。"] },
        { heading: "盤面の生成", paragraphs: ["Star Battle の盤面はブラウザ内で生成され、solver で確認されます。有効な解がちょうど1つある盤面だけを採用します。"] }
      ],
      cta: { label: "今日のパズルを遊ぶ", href: "/ja/#play" }
    },
    contact: {
      schemaType: "ContactPage",
      title: "お問い合わせ - Daily Logic Lab",
      description: "Daily Logic Lab へのフィードバック、不具合報告、内容修正、サイトに関する質問はこちら。",
      eyebrow: "お問い合わせ",
      h1: "お問い合わせ",
      sections: [
        { paragraphs: ["フィードバック、不具合報告、内容の修正依頼、サイトに関する質問に使えます。Daily Logic Lab はアカウントを必要としないため、パスワードや個人情報は送らないでください。"] },
        { heading: "問題を報告する", paragraphs: ["推奨する連絡方法は公開 GitHub Issue です。URL、ブラウザ、端末、起きたことを短く書くと確認しやすくなります。"], links: [{ label: "GitHub で Issue を開く", href: "https://github.com/DennyHo0917/dailylogiclab/issues" }] },
        { heading: "書くと助かる情報", list: ["問題が起きたページ。", "ブラウザと端末。", "今日のパズルか練習モードか。", "期待した動作と実際の動作。"] },
        { heading: "プライバシー", paragraphs: ["プライバシーに関する質問は、まずプライバシーポリシーを確認してください。サイトの背景はこのサイトページにあります。"] }
      ]
    },
    privacy: {
      schemaType: "WebPage",
      title: "プライバシーポリシー - Daily Logic Lab",
      description: "Daily Logic Lab の解析、ローカル保存、Cookie、将来の広告に関するプライバシーポリシー。",
      eyebrow: "プライバシー",
      h1: "プライバシーポリシー",
      updatedLabel: "最終更新:",
      sections: [
        { paragraphs: ["Daily Logic Lab は、無料のブラウザ型ロジックパズルと補助ツールを提供します。このページでは、サイト利用時に扱われる可能性のある情報を説明します。"] },
        { heading: "利用者が提供する情報", paragraphs: ["現在、アカウント登録、ログイン、支払い情報は必要ありません。GitHub Issues で連絡した場合、投稿内容は GitHub によって扱われ、公開されることがあります。"] },
        { heading: "ブラウザ内の保存", paragraphs: ["連続記録、ベストタイム、解いた日、ヒント回数、最近のイベントなどがブラウザ内に保存されることがあります。ブラウザのサイトデータ削除で消せます。"] },
        { heading: "解析", paragraphs: ["Daily Logic Lab は Google Analytics を使い、ページ表示、パズル開始、ヒント、チェック、一般的な端末やブラウザ情報などを集計して改善に役立てます。"] },
        { heading: "広告", paragraphs: ["現在広告は表示していません。将来広告を追加する場合、Google AdSense などの Google 広告サービスを使う可能性があります。Google とパートナーは Cookie を使って広告の配信、測定、パーソナライズを行うことがあります。"] },
        { heading: "外部リンク", paragraphs: ["GitHub や Google ドキュメントなど外部サイトへのリンクがあります。外部サイトのプライバシー運用は Daily Logic Lab の管理外です。"] },
        { heading: "子どものプライバシー", paragraphs: ["Daily Logic Lab は一般向けパズルサイトであり、子どもの個人情報を意図して収集しません。"] },
        { heading: "関連リンク", links: [{ label: "Google プライバシーポリシー", href: "https://policies.google.com/privacy" }, { label: "Google 広告設定", href: "https://adssettings.google.com/" }] }
      ]
    }
  },
  pt: {
    about: {
      schemaType: "AboutPage",
      title: "Sobre o Daily Logic Lab - Puzzles lógicos grátis",
      description: "Conheça o Daily Logic Lab, um site grátis para jogar Star Battle diário e usar pequenas ferramentas de puzzle.",
      eyebrow: "Sobre",
      h1: "Sobre o Daily Logic Lab",
      sections: [
        { paragraphs: ["Daily Logic Lab é um pequeno site de puzzles no navegador, feito para partidas rápidas e ferramentas úteis. O primeiro jogo é Daily Star Battle, um puzzle de colocação no estilo Queens verificado por solver antes de aparecer."] },
        { heading: "O que o site oferece", list: ["Um Star Battle diário grátis.", "Treino ilimitado com solução única verificada.", "Dicas com penalidade de tempo.", "Calculadora de combinações para Killer Sudoku.", "Sem conta na experiência atual."] },
        { heading: "Por que existe", paragraphs: ["A proposta é tornar pequenos puzzles lógicos fáceis de começar, justos de resolver e bons o suficiente para voltar no dia seguinte."] },
        { heading: "Como os puzzles são gerados", paragraphs: ["Os tabuleiros são gerados no navegador e conferidos com um solver. Só entra no site um tabuleiro com exatamente uma solução válida."] }
      ],
      cta: { label: "Jogar o desafio de hoje", href: "/pt-br/#play" }
    },
    contact: {
      schemaType: "ContactPage",
      title: "Contato - Daily Logic Lab",
      description: "Entre em contato com o Daily Logic Lab para feedback, bugs, correções de conteúdo e dúvidas sobre o site.",
      eyebrow: "Contato",
      h1: "Contato Daily Logic Lab",
      sections: [
        { paragraphs: ["Use esta página para feedback, bugs, correções ou dúvidas. Daily Logic Lab não usa contas, então não envie senhas nem dados privados."] },
        { heading: "Reportar um problema", paragraphs: ["O melhor canal é o issue tracker público no GitHub. Inclua URL, navegador, dispositivo e uma descrição curta."], links: [{ label: "Abrir um issue no GitHub", href: "https://github.com/DennyHo0917/dailylogiclab/issues" }] },
        { heading: "Detalhes úteis", list: ["A página onde o problema aconteceu.", "Navegador e tipo de dispositivo.", "Desafio diário ou modo treino.", "Resultado esperado e resultado real."] },
        { heading: "Privacidade", paragraphs: ["Para privacidade, leia primeiro a Política de Privacidade. Para contexto do projeto, visite a página Sobre."] }
      ]
    },
    privacy: {
      schemaType: "WebPage",
      title: "Política de Privacidade - Daily Logic Lab",
      description: "Política de privacidade do Daily Logic Lab sobre analytics, armazenamento local, cookies e possível publicidade futura.",
      eyebrow: "Privacidade",
      h1: "Política de Privacidade",
      updatedLabel: "Última atualização:",
      sections: [
        { paragraphs: ["Daily Logic Lab oferece puzzles lógicos e ferramentas grátis no navegador. Esta política explica quais informações podem ser coletadas ao usar o site."] },
        { heading: "Informações que você fornece", paragraphs: ["Não há contas, login ou pagamento no momento. Se você entrar em contato por GitHub Issues, as informações publicadas ali são tratadas pelo GitHub e podem ser públicas."] },
        { heading: "Armazenamento local", paragraphs: ["O jogo pode salvar no navegador dados como sequência, melhores tempos, datas resolvidas, dicas usadas e eventos recentes. Você pode apagar isso limpando os dados do site no navegador."] },
        { heading: "Analytics", paragraphs: ["Daily Logic Lab usa Google Analytics para entender uso agregado, como visualizações, início de puzzles, dicas, conferências e informações gerais de dispositivo ou navegador."] },
        { heading: "Publicidade", paragraphs: ["O site não mostra anúncios atualmente. Se anúncios forem adicionados depois, o Daily Logic Lab pode usar Google AdSense ou serviços de publicidade do Google. Google e parceiros podem usar cookies para medir, mostrar e personalizar anúncios."] },
        { heading: "Links externos", paragraphs: ["O site pode linkar para GitHub, documentação do Google e outros sites. Daily Logic Lab não controla as práticas de privacidade desses sites."] },
        { heading: "Privacidade de crianças", paragraphs: ["Daily Logic Lab é um site geral de puzzles e não coleta intencionalmente informações pessoais de crianças."] },
        { heading: "Links úteis", links: [{ label: "Política de Privacidade do Google", href: "https://policies.google.com/privacy" }, { label: "Configurações de anúncios do Google", href: "https://adssettings.google.com/" }] }
      ]
    }
  },
  zh: {
    about: {
      schemaType: "AboutPage",
      title: "关于 Daily Logic Lab - 免费每日逻辑谜题",
      description: "了解 Daily Logic Lab，一个提供每日 Star Battle 和谜题辅助工具的免费浏览器网站。",
      eyebrow: "关于",
      h1: "关于 Daily Logic Lab",
      sections: [
        { paragraphs: ["Daily Logic Lab 是一个小型浏览器谜题站，适合每天做一题短逻辑题，也提供实用的解题辅助工具。第一个游戏是 Daily Star Battle，所有盘面展示前都会用求解器验证唯一解。"] },
        { heading: "网站提供什么", list: ["免费的每日 Star Battle。", "无限练习题，并验证唯一解。", "带时间代价的提示系统。", "杀手数独组合计算器。", "当前玩法无需注册账号。"] },
        { heading: "为什么做这个网站", paragraphs: ["目标是让小型逻辑谜题打开就能玩、规则公平、值得每天回来。网站重点是加载快、操作清楚、移动端可用，并解释清楚新玩家容易疑惑的地方。"] },
        { heading: "题目如何生成", paragraphs: ["Star Battle 盘面在浏览器中生成，并由求解器检查。只有正好一个有效解的盘面才会被接受。"] }
      ],
      cta: { label: "开始今日题", href: "/zh-cn/#play" }
    },
    contact: {
      schemaType: "ContactPage",
      title: "联系 Daily Logic Lab",
      description: "联系 Daily Logic Lab，提交谜题反馈、错误报告、内容修正或网站问题。",
      eyebrow: "联系",
      h1: "联系 Daily Logic Lab",
      sections: [
        { paragraphs: ["你可以在这里提交反馈、错误报告、内容修正或网站问题。Daily Logic Lab 当前不需要账号，因此不要发送密码或私人账号信息。"] },
        { heading: "报告题目或网站问题", paragraphs: ["推荐使用公开的 GitHub issue。提交时可以附上页面 URL、浏览器、设备和简短说明。"], links: [{ label: "在 GitHub 打开 issue", href: "https://github.com/DennyHo0917/dailylogiclab/issues" }] },
        { heading: "建议包含的信息", list: ["问题发生的页面。", "浏览器和设备类型。", "当时是在每日题还是练习模式。", "你预期的结果和实际发生的结果。"] },
        { heading: "隐私和内容问题", paragraphs: ["隐私相关问题请先阅读隐私政策。想了解网站背景，可以查看关于页面。"] }
      ]
    },
    privacy: {
      schemaType: "WebPage",
      title: "隐私政策 - Daily Logic Lab",
      description: "阅读 Daily Logic Lab 隐私政策，了解分析、浏览器本地存储、Cookie 和未来广告相关信息。",
      eyebrow: "隐私",
      h1: "隐私政策",
      updatedLabel: "最后更新：",
      sections: [
        { paragraphs: ["Daily Logic Lab 提供免费的浏览器逻辑谜题和解题辅助工具。本政策说明你使用网站时可能涉及的信息。"] },
        { heading: "你主动提供的信息", paragraphs: ["Daily Logic Lab 当前不要求注册、登录或付款。如果你通过 GitHub Issues 联系网站，你发布的信息由 GitHub 处理，并可能是公开的。"] },
        { heading: "浏览器本地存储", paragraphs: ["谜题体验可能在你的浏览器中保存少量数据，例如连胜、最佳时间、已完成日期、提示次数和近期浏览器内事件。你可以通过清除浏览器站点数据来删除。"] },
        { heading: "分析统计", paragraphs: ["Daily Logic Lab 使用 Google Analytics 了解聚合使用情况，例如页面浏览、开始题目、使用提示、检查盘面以及一般设备或浏览器信息。"] },
        { heading: "广告", paragraphs: ["Daily Logic Lab 当前不展示广告。如果未来添加广告，网站可能使用 Google AdSense 或相关 Google 广告服务。Google 及其合作伙伴可能使用 Cookie 来投放、衡量和个性化广告。"] },
        { heading: "第三方链接", paragraphs: ["网站可能链接到 GitHub、Google 文档或其他外部页面。Daily Logic Lab 不负责外部网站的隐私做法。"] },
        { heading: "儿童隐私", paragraphs: ["Daily Logic Lab 是面向一般用户的谜题网站，不会有意收集儿童个人信息。"] },
        { heading: "相关链接", links: [{ label: "Google 隐私政策", href: "https://policies.google.com/privacy" }, { label: "Google 广告设置", href: "https://adssettings.google.com/" }] }
      ]
    }
  }
};

const languageLinks = languages
  .map((language) => `<link rel="alternate" hreflang="${language.hreflang}" href="${SITE}${language.path}">`)
  .join("\n    ");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function paragraphs(items) {
  return items.map((item) => `<p>${escapeHtml(item)}</p>`).join("\n              ");
}

function list(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                  ");
}

function supportLinks(links = []) {
  return links
    .map((link) => {
      const external = link.href.startsWith("http");
      const rel = external ? ' rel="noopener noreferrer"' : "";
      return `<p><a href="${link.href}"${rel}>${escapeHtml(link.label)}</a></p>`;
    })
    .join("\n          ");
}

function supportSections(sections) {
  return sections
    .map((section) => {
      const heading = section.heading ? `\n        <h2>${escapeHtml(section.heading)}</h2>` : "";
      const body = section.paragraphs ? `\n        ${paragraphs(section.paragraphs)}` : "";
      const items = section.list ? `\n        <ul>\n                  ${list(section.list)}\n        </ul>` : "";
      const links = section.links ? `\n        ${supportLinks(section.links)}` : "";
      return `${heading}${body}${items}${links}`;
    })
    .join("\n");
}

function languageSwitcher(current, pageKey = "home") {
  const links = languages
    .map((language) => {
      const currentAttr = language.key === current.key ? ' aria-current="page"' : "";
      const href = pageKey === "home" ? language.path : supportPath(language, pageKey);
      return `<a href="${href}" lang="${language.htmlLang}" hreflang="${language.hreflang}"${currentAttr}>${escapeHtml(language.label)}</a>`;
    })
    .join("\n          ");

  return `<details class="language-switcher">
        <summary aria-label="${escapeHtml(current.switchAria)}">${escapeHtml(current.currentLabel)}</summary>
        <div class="language-menu">
          ${links}
        </div>
      </details>`;
}

function ogLocaleAlternates(current) {
  return languages
    .filter((language) => language.key !== current.key)
    .map((language) => `<meta property="og:locale:alternate" content="${escapeHtml(seo(language).ogLocale)}">`)
    .join("\n    ");
}

function aria(language, key) {
  return ariaLabels[language.key]?.[key] || ariaLabels.en[key];
}

function jsonLd(language) {
  const profile = seo(language);
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${SITE}${language.path}#website`,
      name: "Daily Logic Lab",
      url: `${SITE}${language.path}`,
      inLanguage: language.htmlLang,
      description: language.meta.description,
      keywords: profile.keywords.join(", "),
      availableLanguage: allAvailableLanguages
    },
    {
      "@type": "WebPage",
      "@id": `${SITE}${language.path}#webpage`,
      name: language.meta.title,
      headline: language.hero.h1,
      url: `${SITE}${language.path}`,
      inLanguage: language.htmlLang,
      isPartOf: { "@id": `${SITE}${language.path}#website` },
      description: language.meta.description,
      keywords: profile.keywords.join(", "),
      alternateName: profile.alternateNames
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE}${language.path}#app`,
      name: language.hero.h1,
      alternateName: profile.alternateNames,
      url: `${SITE}${language.path}`,
      inLanguage: language.htmlLang,
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      description: language.meta.description,
      keywords: profile.keywords.join(", "),
      availableLanguage: allAvailableLanguages,
      audience: {
        "@type": "Audience",
        audienceType: profile.audience
      }
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE}${language.path}#faq`,
      inLanguage: language.htmlLang,
      mainEntity: language.faq.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer
        }
      }))
    }
  ];

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 8);
}

function page(language) {
  const profile = seo(language);
  const canonical = `${SITE}${language.path}`;
  const asset = (file) => `${language.assets}${file}`;
  const guideArticles = language.guide
    .map((article, index) => {
      const seoNote = index === 0 && profile.note ? `\n            <p>${escapeHtml(profile.note)}</p>` : "";
      return `<article>
            <p class="eyebrow">${escapeHtml(article.eyebrow)}</p>
            <h2>${escapeHtml(article.title)}</h2>
            ${paragraphs(article.paragraphs)}${seoNote}
          </article>`;
    })
    .join("\n\n          ");
  const faqItems = language.faq
    .map(
      ([question, answer]) => `<details>
              <summary>${escapeHtml(question)}</summary>
              <p>${escapeHtml(answer)}</p>
            </details>`
    )
    .join("\n            ");
  const internalLinks = language.explore.links
    .map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`)
    .join("\n            ");

  return `<!doctype html>
<html lang="${language.htmlLang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6NY29HPM34"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-6NY29HPM34');
    </script>
    <title>${escapeHtml(language.meta.title)}</title>
    <meta name="description" content="${escapeHtml(language.meta.description)}">
    <meta name="keywords" content="${escapeHtml(profile.keywords.join(", "))}">
    <meta name="language" content="${escapeHtml(profile.languageName)}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="author" content="Daily Logic Lab">
    <meta name="theme-color" content="#245c53">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <script src="${asset("language-redirect.js")}"></script>
    <link rel="canonical" href="${canonical}">
    ${languageLinks}
    <link rel="alternate" hreflang="x-default" href="${SITE}/">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="${escapeHtml(profile.ogLocale)}">
    ${ogLocaleAlternates(language)}
    <meta property="og:site_name" content="Daily Logic Lab">
    <meta property="og:title" content="${escapeHtml(language.meta.ogTitle)}">
    <meta property="og:description" content="${escapeHtml(language.meta.ogDescription)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${SITE}/og-image.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${escapeHtml(language.meta.imageAlt)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(language.meta.ogTitle)}">
    <meta name="twitter:description" content="${escapeHtml(language.meta.ogDescription)}">
    <meta name="twitter:image" content="${SITE}/og-image.png">
    <meta name="twitter:image:alt" content="${escapeHtml(language.meta.imageAlt)}">
    <link rel="stylesheet" href="${asset("styles.css")}">
    <script type="application/ld+json">
      ${jsonLd(language)}
    </script>
  </head>
  <body>
    <header class="topbar">
      <a class="brand" href="#play" aria-label="Daily Logic Lab home">
        <span class="brand-mark">DL</span>
        <span>Daily Logic Lab</span>
      </a>
      <nav class="nav" aria-label="${escapeHtml(language.navAria)}">
        <a href="#play">${escapeHtml(language.nav[0])}</a>
        <a href="#calculator">${escapeHtml(language.nav[1])}</a>
        <a href="#rules">${escapeHtml(language.nav[2])}</a>
      </nav>
      ${languageSwitcher(language)}
    </header>

    <main>
      <section id="play" class="play-section">
        <div class="section-shell play-layout">
          <div class="game-column">
            <div class="game-head">
              <div>
                <p class="eyebrow" id="puzzleMode">${escapeHtml(language.hero.mode)}</p>
                <h1>${escapeHtml(language.hero.h1)}</h1>
                <p class="game-intro">${escapeHtml(language.hero.intro)}</p>
                <ul class="proof-points" aria-label="${escapeHtml(aria(language, "promises"))}">
                  ${list(language.hero.proofs)}
                </ul>
              </div>
              <div class="stats" aria-label="${escapeHtml(aria(language, "stats"))}">
                <div>
                  <span id="timer">00:00</span>
                  <small>${escapeHtml(language.hero.stats[0])}</small>
                </div>
                <div>
                  <span id="starCount">0/7</span>
                  <small>${escapeHtml(language.hero.stats[1])}</small>
                </div>
                <div>
                  <span id="streakCount">0</span>
                  <small>${escapeHtml(language.hero.stats[2])}</small>
                </div>
              </div>
            </div>

            <div class="board-wrap" aria-live="polite">
              <div class="board-stage">
                <div id="board" class="board" role="grid" aria-label="${escapeHtml(language.hero.boardLabel)}"></div>
                <div id="startOverlay" class="start-overlay">
                  <div class="start-card">
                    <p class="eyebrow" id="startLabel">${escapeHtml(language.hero.startMode)}</p>
                    <h2>${escapeHtml(language.hero.startTitle)}</h2>
                    <p>${escapeHtml(language.hero.startBody)}</p>
                    <button id="startBtn" type="button" class="primary">${escapeHtml(language.hero.startButton)}</button>
                  </div>
                </div>
              </div>
            </div>

            <p id="status" class="status" aria-live="polite">${escapeHtml(language.hero.status)}</p>

            <div class="toolbar" aria-label="${escapeHtml(aria(language, "controls"))}">
              <button id="resetBtn" type="button">${escapeHtml(language.controls.reset)}</button>
              <button id="hintBtn" type="button">${escapeHtml(language.controls.hint)}</button>
              <button id="checkBtn" type="button">${escapeHtml(language.controls.check)}</button>
              <button id="practiceBtn" type="button">${escapeHtml(language.controls.practice)}</button>
              <button id="shareBtn" type="button" class="primary">${escapeHtml(language.controls.share)}</button>
            </div>
          </div>

          <aside class="side-panel" aria-label="${escapeHtml(aria(language, "notes"))}">
            <div class="metric-strip">
              <div>
                <strong id="todayLabel">${escapeHtml(language.side.today)}</strong>
                <span>${escapeHtml(language.side.puzzle)}</span>
              </div>
              <div>
                <strong>7x7</strong>
                <span>${escapeHtml(language.side.grid)}</span>
              </div>
              <div>
                <strong id="proofLabel">${escapeHtml(language.side.proof)}</strong>
                <span>${escapeHtml(language.side.verified)}</span>
              </div>
              <div>
                <strong id="bestTime">--:--</strong>
                <span>${escapeHtml(language.side.best)}</span>
              </div>
            </div>
            <div id="sharePreview" class="share-preview">${escapeHtml(language.side.share)}</div>
            <div class="quick-rules" aria-label="${escapeHtml(aria(language, "quickRules"))}">
              <h2>${escapeHtml(language.side.goal)}</h2>
              <ul>
                ${list(language.side.rules)}
              </ul>
              <p>${escapeHtml(language.side.tip)}</p>
            </div>
            <div class="mini-actions">
              <button id="dailyBtn" type="button">${escapeHtml(language.controls.daily)}</button>
              <button id="copyLinkBtn" type="button">${escapeHtml(language.controls.copyLink)}</button>
            </div>
          </aside>
        </div>
      </section>

      <section id="calculator" class="tool-section">
        <div class="section-shell tool-layout">
          <div>
            <p class="eyebrow">${escapeHtml(language.calculator.eyebrow)}</p>
            <h2>${escapeHtml(language.calculator.title)}</h2>
            <p class="lede">${escapeHtml(language.calculator.lede)}</p>
          </div>

          <div class="calculator-panel">
            <form id="comboForm" class="combo-form">
              <label>
                <span>${escapeHtml(language.calculator.sum)}</span>
                <input id="sumInput" type="number" min="1" max="45" value="17" inputmode="numeric">
              </label>
              <label>
                <span>${escapeHtml(language.calculator.cells)}</span>
                <input id="cellsInput" type="number" min="1" max="9" value="3" inputmode="numeric">
              </label>
              <label class="check-label">
                <input id="repeatInput" type="checkbox">
                <span>${escapeHtml(language.calculator.repeats)}</span>
              </label>
            </form>

            <div class="digits" id="digits" aria-label="${escapeHtml(language.calculator.digitsLabel)}"></div>

            <div class="result-head">
              <strong id="comboCount">${escapeHtml(language.calculator.count)}</strong>
              <button id="copyCombosBtn" type="button">${escapeHtml(language.controls.copy)}</button>
            </div>
            <div id="comboResults" class="combo-results" aria-live="polite"></div>
          </div>
        </div>
      </section>

      <section id="rules" class="rules-section">
        <div class="section-shell rules-grid">
          <div>
            <p class="eyebrow">${escapeHtml(language.rules.eyebrow)}</p>
            <h2>${escapeHtml(language.rules.title)}</h2>
            <p class="lede">${escapeHtml(language.rules.lede)}</p>
          </div>
          <ul class="rules-list">
            ${list(language.rules.items)}
          </ul>
        </div>
      </section>

      <section id="guide" class="seo-section">
        <div class="section-shell seo-grid">
          ${guideArticles}
        </div>
      </section>

      <section id="faq" class="faq-section">
        <div class="section-shell">
          <p class="eyebrow">${escapeHtml(language.faqEyebrow)}</p>
          <h2>${escapeHtml(language.faqTitle)}</h2>
          <div class="faq-list">
            ${faqItems}
          </div>
        </div>
      </section>

      <section class="internal-links-section">
        <div class="section-shell">
          <p class="eyebrow">${escapeHtml(language.explore.eyebrow)}</p>
          <h2>${escapeHtml(language.explore.title)}</h2>
          <div class="internal-links">
            ${internalLinks}
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="section-shell">
        <span>Daily Logic Lab</span>
        <nav class="footer-links" aria-label="${escapeHtml(language.footerAria)}">
          <a href="${supportPath(language, "about")}">${escapeHtml(language.footer.about)}</a>
          <a href="${supportPath(language, "contact")}">${escapeHtml(language.footer.contact)}</a>
          <a href="${supportPath(language, "privacy")}">${escapeHtml(language.footer.privacy)}</a>
          <a href="/sitemap.xml">${escapeHtml(language.footer.sitemap)}</a>
        </nav>
      </div>
    </footer>

    <script src="${asset("app.js")}"></script>
  </body>
</html>
`;
}

function supportAlternateLinks(pageKey) {
  return languages
    .map((language) => `<link rel="alternate" hreflang="${language.hreflang}" href="${SITE}${supportPath(language, pageKey)}">`)
    .join("\n    ");
}

function longtailAlternateBlock(paths) {
  const alternates = Object.entries(paths)
    .map(([languageKey, url]) => {
      const language = languages.find((item) => item.key === languageKey);
      return `    <xhtml:link rel="alternate" hreflang="${language.hreflang}" href="${SITE}${url}" />`;
    })
    .join("\n");
  return `${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${paths.en}" />`;
}

function longtailAlternateLinks(paths) {
  const alternates = Object.entries(paths)
    .map(([languageKey, url]) => {
      const language = languages.find((item) => item.key === languageKey);
      return `<link rel="alternate" hreflang="${language.hreflang}" href="${SITE}${url}">`;
    })
    .join("\n    ");
  return `${alternates}\n    <link rel="alternate" hreflang="x-default" href="${SITE}${paths.en}">`;
}

function longtailLanguageSwitcher(current, paths) {
  const links = Object.entries(paths)
    .map(([languageKey, href]) => {
      const language = languages.find((item) => item.key === languageKey);
      const currentAttr = language.key === current.key ? ' aria-current="page"' : "";
      return `<a href="${href}" lang="${language.htmlLang}" hreflang="${language.hreflang}"${currentAttr}>${escapeHtml(language.label)}</a>`;
    })
    .join("\n          ");

  return `<details class="language-switcher">
        <summary aria-label="${escapeHtml(current.switchAria)}">${escapeHtml(current.currentLabel)}</summary>
        <div class="language-menu">
          ${links}
        </div>
      </details>`;
}

function longtailOutPath(url) {
  return `${url.replace(/^\//, "")}.html`;
}

function longtailSections(sections) {
  return sections
    .map((section) => {
      const heading = section.heading ? `\n        <h2>${escapeHtml(section.heading)}</h2>` : "";
      const body = section.paragraphs ? `\n        ${paragraphs(section.paragraphs)}` : "";
      const items = section.list ? `\n        <ul>\n                  ${list(section.list)}\n        </ul>` : "";
      const links = section.links ? `\n        ${supportLinks(section.links)}` : "";
      return `${heading}${body}${items}${links}`;
    })
    .join("\n");
}

function longtailArticleJsonLd(article, language, content) {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: content.h1,
          description: content.description,
          inLanguage: language.htmlLang,
          mainEntityOfPage: `${SITE}${article.paths[language.key]}`,
          isPartOf: { "@id": `${SITE}${language.path}#website` }
        },
        {
          "@type": "FAQPage",
          inLanguage: language.htmlLang,
          mainEntity: content.faq.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: {
              "@type": "Answer",
              text: answer
            }
          }))
        }
      ]
    },
    null,
    8
  );
}

function longtailArticlePage(article, language) {
  const content = article.pages[language.key];
  const profile = seo(language);
  const canonical = `${SITE}${article.paths[language.key]}`;
  const starBattlePath = localizedLongtailGroups[0].paths[language.key] || "/star-battle";
  const cta = content.cta ? `\n        <p><a href="${content.cta.href}">${escapeHtml(content.cta.label)}</a></p>` : "";
  const faqItems = content.faq
    .map(
      ([question, answer]) => `<details>
            <summary>${escapeHtml(question)}</summary>
            <p>${escapeHtml(answer)}</p>
          </details>`
    )
    .join("\n          ");

  return `<!doctype html>
<html lang="${language.htmlLang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6NY29HPM34"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-6NY29HPM34');
    </script>
    <title>${escapeHtml(content.title)}</title>
    <meta name="description" content="${escapeHtml(content.description)}">
    <meta name="keywords" content="${escapeHtml(content.keywords)}">
    <meta name="language" content="${escapeHtml(profile.languageName)}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="theme-color" content="#245c53">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <script src="../language-redirect.js"></script>
    <link rel="canonical" href="${canonical}">
    ${longtailAlternateLinks(article.paths)}
    <meta property="og:type" content="article">
    <meta property="og:locale" content="${escapeHtml(profile.ogLocale)}">
    <meta property="og:site_name" content="Daily Logic Lab">
    <meta property="og:title" content="${escapeHtml(content.ogTitle)}">
    <meta property="og:description" content="${escapeHtml(content.ogDescription)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${SITE}/og-image.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(content.ogTitle)}">
    <meta name="twitter:description" content="${escapeHtml(content.ogDescription)}">
    <meta name="twitter:image" content="${SITE}/og-image.png">
    <link rel="stylesheet" href="../styles.css">
    <script type="application/ld+json">
      ${longtailArticleJsonLd(article, language, content)}
    </script>
  </head>
  <body>
    <header class="topbar">
      <a class="brand" href="${language.path}#play">
        <span class="brand-mark">DL</span>
        <span>Daily Logic Lab</span>
      </a>
      <nav class="nav" aria-label="${escapeHtml(language.navAria)}">
        <a href="${language.path}#play">${escapeHtml(language.nav[0])}</a>
        <a href="${starBattlePath}">Star Battle</a>
        <a href="${language.path}#calculator">${escapeHtml(language.nav[1])}</a>
      </nav>
      ${longtailLanguageSwitcher(language, article.paths)}
    </header>

    <main class="content-page">
      <article class="section-shell content-card">
        <p class="eyebrow">${escapeHtml(content.eyebrow)}</p>
        <h1>${escapeHtml(content.h1)}</h1>
        ${longtailSections(content.sections)}${cta}

        <h2>FAQ</h2>
        <div class="faq-list">
          ${faqItems}
        </div>
      </article>
    </main>

    <footer class="site-footer">
      <div class="section-shell">
        <span>Daily Logic Lab</span>
        <nav class="footer-links" aria-label="${escapeHtml(language.footerAria)}">
          <a href="${supportPath(language, "about")}">${escapeHtml(language.footer.about)}</a>
          <a href="${supportPath(language, "contact")}">${escapeHtml(language.footer.contact)}</a>
          <a href="${supportPath(language, "privacy")}">${escapeHtml(language.footer.privacy)}</a>
          <a href="/sitemap.xml">${escapeHtml(language.footer.sitemap)}</a>
        </nav>
      </div>
    </footer>
  </body>
</html>
`;
}

function supportJsonLd(language, pageKey, content) {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": content.schemaType,
      name: content.h1,
      headline: content.h1,
      url: `${SITE}${supportPath(language, pageKey)}`,
      inLanguage: language.htmlLang,
      description: content.description,
      isPartOf: { "@id": `${SITE}${language.path}#website` }
    },
    null,
    8
  );
}

function supportPage(language, pageKey) {
  const content = supportContent[language.key][pageKey];
  const profile = seo(language);
  const canonical = `${SITE}${supportPath(language, pageKey)}`;
  const asset = language.key === "en" ? "./" : "../";
  const home = language.path;
  const updated = pageKey === "privacy" ? `\n        <p><strong>${escapeHtml(content.updatedLabel)}</strong> June 18, 2026</p>` : "";
  const cta = content.cta ? `\n        <p><a href="${content.cta.href}">${escapeHtml(content.cta.label)}</a></p>` : "";

  return `<!doctype html>
<html lang="${language.htmlLang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6NY29HPM34"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-6NY29HPM34');
    </script>
    <title>${escapeHtml(content.title)}</title>
    <meta name="description" content="${escapeHtml(content.description)}">
    <meta name="language" content="${escapeHtml(profile.languageName)}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="theme-color" content="#245c53">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <script src="${asset}language-redirect.js"></script>
    <link rel="canonical" href="${canonical}">
    ${supportAlternateLinks(pageKey)}
    <link rel="alternate" hreflang="x-default" href="${SITE}/${supportSlugs[pageKey]}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="${escapeHtml(profile.ogLocale)}">
    ${ogLocaleAlternates(language)}
    <meta property="og:site_name" content="Daily Logic Lab">
    <meta property="og:title" content="${escapeHtml(content.h1)}">
    <meta property="og:description" content="${escapeHtml(content.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${SITE}/og-image.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(content.h1)}">
    <meta name="twitter:description" content="${escapeHtml(content.description)}">
    <meta name="twitter:image" content="${SITE}/og-image.png">
    <link rel="stylesheet" href="${asset}styles.css">
    <script type="application/ld+json">
      ${supportJsonLd(language, pageKey, content)}
    </script>
  </head>
  <body>
    <header class="topbar">
      <a class="brand" href="${home}#play">
        <span class="brand-mark">DL</span>
        <span>Daily Logic Lab</span>
      </a>
      <nav class="nav" aria-label="${escapeHtml(language.navAria)}">
        <a href="${home}#play">${escapeHtml(language.nav[0])}</a>
        <a href="${home}#calculator">${escapeHtml(language.nav[1])}</a>
        <a href="${supportPath(language, "about")}">${escapeHtml(language.footer.about)}</a>
      </nav>
      ${languageSwitcher(language, pageKey)}
    </header>

    <main class="content-page">
      <article class="section-shell content-card">
        <p class="eyebrow">${escapeHtml(content.eyebrow)}</p>
        <h1>${escapeHtml(content.h1)}</h1>${updated}
        ${supportSections(content.sections)}${cta}
      </article>
    </main>

    <footer class="site-footer">
      <div class="section-shell">
        <span>Daily Logic Lab</span>
        <nav class="footer-links" aria-label="${escapeHtml(language.footerAria)}">
          <a href="${supportPath(language, "about")}">${escapeHtml(language.footer.about)}</a>
          <a href="${supportPath(language, "contact")}">${escapeHtml(language.footer.contact)}</a>
          <a href="${supportPath(language, "privacy")}">${escapeHtml(language.footer.privacy)}</a>
          <a href="/sitemap.xml">${escapeHtml(language.footer.sitemap)}</a>
        </nav>
      </div>
    </footer>
  </body>
</html>
`;
}

function sitemap() {
  const alternates = languages
    .map((language) => `    <xhtml:link rel="alternate" hreflang="${language.hreflang}" href="${SITE}${language.path}" />`)
    .join("\n");
  const alternateBlock = `${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/" />`;
  const primaryPages = languages
    .map(
      (language) => `  <url>
    <loc>${SITE}${language.path}</loc>
    <lastmod>${SITEMAP_LASTMOD}</lastmod>
${alternateBlock}
    <changefreq>daily</changefreq>
    <priority>${language.key === "en" ? "1.0" : "0.9"}</priority>
  </url>`
    )
    .join("\n");
  const localizedSupportPages = Object.keys(supportSlugs)
    .flatMap((pageKey) => {
      const supportAlternates = languages
        .map((language) => `    <xhtml:link rel="alternate" hreflang="${language.hreflang}" href="${SITE}${supportPath(language, pageKey)}" />`)
        .join("\n");
      const supportAlternateBlock = `${supportAlternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${supportPath(languages[0], pageKey)}" />`;
      return languages.map(
        (language) => `  <url>
    <loc>${SITE}${supportPath(language, pageKey)}</loc>
    <lastmod>${SITEMAP_LASTMOD}</lastmod>
${supportAlternateBlock}
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>`
      );
    })
    .join("\n");
  const localizedLongtailPages = localizedLongtailGroups
    .flatMap((group) => {
      const alternateBlock = longtailAlternateBlock(group.paths);
      return Object.values(group.paths).map(
        (url) => `  <url>
    <loc>${SITE}${url}</loc>
    <lastmod>${SITEMAP_LASTMOD}</lastmod>
${alternateBlock}
    <changefreq>${group.changefreq}</changefreq>
    <priority>${group.priority}</priority>
  </url>`
      );
    })
    .join("\n");
  const supportPages = "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${primaryPages}
${localizedSupportPages}
${localizedLongtailPages}
${supportPages}
</urlset>
`;
}

for (const language of languages) {
  const outPath = path.resolve(language.out);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, page(language), "utf8");
  for (const pageKey of Object.keys(supportSlugs)) {
    const supportOut = path.resolve(supportOutPath(language, pageKey));
    await mkdir(path.dirname(supportOut), { recursive: true });
    await writeFile(supportOut, supportPage(language, pageKey), "utf8");
  }
}

for (const article of localizedLongtailArticles) {
  for (const language of languages) {
    if (!article.pages[language.key]) continue;
    const articleOut = path.resolve(longtailOutPath(article.paths[language.key]));
    await mkdir(path.dirname(articleOut), { recursive: true });
    await writeFile(articleOut, longtailArticlePage(article, language), "utf8");
  }
}

await writeFile("sitemap.xml", sitemap(), "utf8");
