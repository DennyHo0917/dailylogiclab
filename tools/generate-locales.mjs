import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE = "https://dailylogiclab.com";

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
        ["Star Battle Guide", "/star-battle"],
        ["Star Battle Hinweise", "/star-battle-hints"],
        ["Two Not Touch Puzzle", "/two-not-touch-puzzle"],
        ["Queens-Alternative", "/queens-puzzle-alternative"],
        ["Killer-Sudoku-Rechner", "/killer-sudoku-combination-calculator"]
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
        ["Guía de Star Battle", "/star-battle"],
        ["Pistas de Star Battle", "/star-battle-hints"],
        ["Two Not Touch Puzzle", "/two-not-touch-puzzle"],
        ["Alternativa a Queens", "/queens-puzzle-alternative"],
        ["Calculadora Killer Sudoku", "/killer-sudoku-combination-calculator"]
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
        ["Guide Star Battle", "/star-battle"],
        ["Indices Star Battle", "/star-battle-hints"],
        ["Two Not Touch Puzzle", "/two-not-touch-puzzle"],
        ["Alternative à Queens", "/queens-puzzle-alternative"],
        ["Calculatrice Killer Sudoku", "/killer-sudoku-combination-calculator"]
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
        ["Star Battle 指南", "/star-battle"],
        ["Star Battle 提示", "/star-battle-hints"],
        ["Two Not Touch Puzzle", "/two-not-touch-puzzle"],
        ["Queens 替代谜题", "/queens-puzzle-alternative"],
        ["杀手数独组合计算器", "/killer-sudoku-combination-calculator"]
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

function seo(language) {
  return seoProfiles[language.key] || seoProfiles.en;
}

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

function languageSwitcher(current) {
  const links = languages
    .map((language) => {
      const currentAttr = language.key === current.key ? ' aria-current="page"' : "";
      return `<a href="${language.path}" lang="${language.htmlLang}" hreflang="${language.hreflang}"${currentAttr}>${escapeHtml(language.label)}</a>`;
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
          <a href="/about">${escapeHtml(language.footer.about)}</a>
          <a href="/contact">${escapeHtml(language.footer.contact)}</a>
          <a href="/privacy-policy">${escapeHtml(language.footer.privacy)}</a>
          <a href="/sitemap.xml">${escapeHtml(language.footer.sitemap)}</a>
        </nav>
      </div>
    </footer>

    <script src="${asset("app.js")}"></script>
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
${alternateBlock}
    <changefreq>daily</changefreq>
    <priority>${language.key === "en" ? "1.0" : "0.9"}</priority>
  </url>`
    )
    .join("\n");
  const supportPages = [
    ["/star-battle", "weekly", "0.8"],
    ["/star-battle-hints", "weekly", "0.8"],
    ["/two-not-touch-puzzle", "monthly", "0.7"],
    ["/queens-puzzle-alternative", "weekly", "0.7"],
    ["/killer-sudoku-combination-calculator", "monthly", "0.8"],
    ["/about", "yearly", "0.4"],
    ["/contact", "yearly", "0.4"],
    ["/privacy-policy", "yearly", "0.4"]
  ]
    .map(
      ([url, freq, priority]) => `  <url>
    <loc>${SITE}${url}</loc>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${primaryPages}
${supportPages}
</urlset>
`;
}

for (const language of languages) {
  const outPath = path.resolve(language.out);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, page(language), "utf8");
}

await writeFile("sitemap.xml", sitemap(), "utf8");
