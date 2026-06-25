const SIZE = 7;
const EMPTY = 0;
const STAR = 1;
const BLOCK = 2;
const REGION_LABELS = "ABCDEFG";
const MAX_GENERATION_ATTEMPTS = 5000;
const SITE_URL = "https://dailylogiclab.com/";
const DISCARD_CONFIRM_MS = 3500;
const HINT_PENALTIES = [30, 60, 120];
const VALID_SOLUTIONS = buildSolutionPermutations();
const LANGUAGE_KEY = getLanguageKey();
const UI_TEXT = {
  en: {
    statusReady: "Press Start when you are ready. The timer is paused.",
    timerStarted: "Timer started. Solve it clean.",
    pressStartPlace: "Press Start before placing stars.",
    keepGoing: "Keep going.",
    resetConfirm: "Click Reset again to clear this board.",
    resetReady: "Puzzle reset. Press Start when you are ready.",
    dailyConfirm: "Click Daily again to discard this board.",
    generatingDaily: "Generating a unique daily puzzle...",
    dailyReady: "Daily puzzle ready. Press Start when you are ready.",
    practiceConfirm: "Click New Practice again to discard this board.",
    generatingPractice: "Generating a unique practice puzzle...",
    practiceReady: "Practice puzzle ready. Press Start when you are ready.",
    checkBeforeStart: "Press Start before checking the board.",
    checkConflict: "Something conflicts with the rules.",
    checkNoCompletion: "Your current marks have no valid completion. Remove a star or blocked mark.",
    checkIncomplete: "No conflicts yet. Some rows, columns, or regions still need stars.",
    hintBeforeStart: "Press Start before asking for a hint.",
    hintNoneLeft: "No hints left for this puzzle. Keep solving or start a new practice.",
    hintConflict: "Hint {index}: fix the highlighted conflict first. +{penalty}s",
    hintNoCompletion: "Hint {index}: your current marks have no valid completion. Undo one of them. +{penalty}s",
    hintFocus: "Hint 1: focus on {group}; it has the fewest options. +{penalty}s",
    hintSolutionStar: "Hint 3: this square is a star in the solution. +{penalty}s",
    hintSingleCandidate: "Hint {index}: only one candidate remains in {group}. +{penalty}s",
    hintNarrowGroup: "Hint {index}: these are the best candidates in {group}. +{penalty}s",
    hintNoUseful: "No useful hint found from the current marks.",
    nextDaily: "Share it or try New Practice.",
    nextPractice: "Share it or try another practice.",
    hintSummary: " Hints: {count} (+{penalty}s).",
    solvedMessage: "Solved in {time}. {result}{hintSummary} {nextStep}",
    newBest: "New best time.",
    nice: "Nice.",
    groupRow: "row {index}",
    groupCol: "column {index}",
    groupRegion: "color {label}",
    modeDaily: "Daily puzzle",
    modePractice: "Practice puzzle",
    startLabelDaily: "Daily puzzle #{id}",
    startLabelPractice: "Practice puzzle #{id}",
    startButtonDaily: "Start Daily Puzzle",
    startButtonPractice: "Start Practice",
    hintButton: "Hint +{penalty}s",
    noHintsLeft: "No Hints Left",
    todayDaily: "#{id} Today",
    todayPractice: "#{id} Practice",
    proofUnique: "Unique",
    cellLabel: "Row {row}, column {col}, color {region}, {mark}",
    markStar: "star",
    markBlocked: "blocked",
    markEmpty: "empty",
    shareTitleDaily: "Daily Two Not Touch #{id}",
    shareTitlePractice: "Two Not Touch Practice #{id}",
    shareSolved: "Solved in {time}",
    shareProgress: "In progress",
    shareStars: "Stars: {count}/{size}",
    shareHints: "Hints: {count} (+{penalty}s)",
    shareCopied: "Share text copied.",
    linkCopied: "Link copied.",
    comboCount: "{count} {label}",
    comboSingular: "combination",
    comboPlural: "combinations",
    comboNone: "No match",
    comboCopied: "Copied"
  },
  de: {
    statusReady: "Drücke Start, wenn du bereit bist. Die Uhr wartet noch.",
    timerStarted: "Die Zeit läuft. Löse das Feld in Ruhe.",
    pressStartPlace: "Starte zuerst das Rätsel, bevor du Sterne setzt.",
    keepGoing: "Weiter so.",
    resetConfirm: "Klicke noch einmal auf Zurücksetzen, um das Feld zu leeren.",
    resetReady: "Das Rätsel ist zurückgesetzt. Drücke Start, wenn du bereit bist.",
    dailyConfirm: "Klicke noch einmal auf Täglich, um dieses Feld zu verwerfen.",
    generatingDaily: "Das tägliche Rätsel wird eindeutig erzeugt...",
    dailyReady: "Das Tagesrätsel ist bereit. Drücke Start, wenn du loslegen willst.",
    practiceConfirm: "Klicke noch einmal auf Neues Training, um dieses Feld zu verwerfen.",
    generatingPractice: "Ein eindeutiges Trainingsrätsel wird erzeugt...",
    practiceReady: "Das Trainingsrätsel ist bereit. Drücke Start, wenn du bereit bist.",
    checkBeforeStart: "Drücke Start, bevor du das Feld prüfen lässt.",
    checkConflict: "Mindestens eine Markierung verstößt gegen die Regeln.",
    checkNoCompletion: "Mit den aktuellen Markierungen gibt es keine gültige Lösung. Entferne einen Stern oder eine Sperrmarkierung.",
    checkIncomplete: "Noch kein Konflikt. Einige Zeilen, Spalten oder Farbflächen brauchen noch Sterne.",
    hintBeforeStart: "Drücke Start, bevor du einen Hinweis nimmst.",
    hintNoneLeft: "Für dieses Rätsel sind keine Hinweise mehr übrig. Löse weiter oder starte ein neues Training.",
    hintConflict: "Hinweis {index}: Kläre zuerst den markierten Konflikt. +{penalty}s",
    hintNoCompletion: "Hinweis {index}: Deine aktuellen Markierungen führen zu keiner Lösung. Nimm eine davon zurück. +{penalty}s",
    hintFocus: "Hinweis 1: Schau dir {group} an; dort gibt es am wenigsten Möglichkeiten. +{penalty}s",
    hintSolutionStar: "Hinweis 3: Dieses Feld ist in der Lösung ein Stern. +{penalty}s",
    hintSingleCandidate: "Hinweis {index}: In {group} bleibt nur noch ein mögliches Feld. +{penalty}s",
    hintNarrowGroup: "Hinweis {index}: Das sind die besten Kandidaten in {group}. +{penalty}s",
    hintNoUseful: "Aus den aktuellen Markierungen ergibt sich gerade kein sinnvoller Hinweis.",
    nextDaily: "Teile dein Ergebnis oder versuche ein neues Training.",
    nextPractice: "Teile dein Ergebnis oder starte ein weiteres Training.",
    hintSummary: " Hinweise: {count} (+{penalty}s).",
    solvedMessage: "Gelöst in {time}. {result}{hintSummary} {nextStep}",
    newBest: "Neue Bestzeit.",
    nice: "Sauber.",
    groupRow: "Zeile {index}",
    groupCol: "Spalte {index}",
    groupRegion: "Farbfläche {label}",
    modeDaily: "Tagesrätsel",
    modePractice: "Training",
    startLabelDaily: "Tagesrätsel #{id}",
    startLabelPractice: "Training #{id}",
    startButtonDaily: "Tagesrätsel starten",
    startButtonPractice: "Training starten",
    hintButton: "Hinweis +{penalty}s",
    noHintsLeft: "Keine Hinweise mehr",
    todayDaily: "#{id} Heute",
    todayPractice: "#{id} Training",
    proofUnique: "Eindeutig",
    cellLabel: "Zeile {row}, Spalte {col}, Farbfläche {region}, {mark}",
    markStar: "Stern",
    markBlocked: "gesperrt",
    markEmpty: "leer",
    shareTitleDaily: "Daily Two Not Touch #{id}",
    shareTitlePractice: "Two Not Touch Training #{id}",
    shareSolved: "Gelöst in {time}",
    shareProgress: "Noch in Arbeit",
    shareStars: "Sterne: {count}/{size}",
    shareHints: "Hinweise: {count} (+{penalty}s)",
    shareCopied: "Text zum Teilen wurde kopiert.",
    linkCopied: "Link kopiert.",
    comboCount: "{count} {label}",
    comboSingular: "Kombination",
    comboPlural: "Kombinationen",
    comboNone: "Kein Treffer",
    comboCopied: "Kopiert"
  },
  es: {
    statusReady: "Pulsa Start cuando quieras empezar. El reloj sigue parado.",
    timerStarted: "El tiempo empezó. Resuelve sin prisas.",
    pressStartPlace: "Pulsa Start antes de colocar estrellas.",
    keepGoing: "Vas bien.",
    resetConfirm: "Pulsa Reset otra vez para limpiar este tablero.",
    resetReady: "Tablero reiniciado. Pulsa Start cuando estés listo.",
    dailyConfirm: "Pulsa Daily otra vez para descartar este tablero.",
    generatingDaily: "Generando un reto diario con solución única...",
    dailyReady: "El reto diario está listo. Pulsa Start para empezar.",
    practiceConfirm: "Pulsa New Practice otra vez para descartar este tablero.",
    generatingPractice: "Generando un tablero de práctica con solución única...",
    practiceReady: "La práctica está lista. Pulsa Start cuando quieras.",
    checkBeforeStart: "Pulsa Start antes de revisar el tablero.",
    checkConflict: "Hay algo que choca con las reglas.",
    checkNoCompletion: "Con tus marcas actuales no queda ninguna solución válida. Quita una estrella o una marca bloqueada.",
    checkIncomplete: "Aún no hay conflictos. Faltan estrellas en algunas filas, columnas o zonas.",
    hintBeforeStart: "Pulsa Start antes de pedir una pista.",
    hintNoneLeft: "No quedan pistas para este tablero. Sigue intentando o abre una práctica nueva.",
    hintConflict: "Pista {index}: resuelve primero el conflicto marcado. +{penalty}s",
    hintNoCompletion: "Pista {index}: tus marcas actuales no llevan a una solución. Deshaz una de ellas. +{penalty}s",
    hintFocus: "Pista 1: mira {group}; es donde quedan menos opciones. +{penalty}s",
    hintSolutionStar: "Pista 3: esta casilla es una estrella en la solución. +{penalty}s",
    hintSingleCandidate: "Pista {index}: en {group} solo queda una casilla posible. +{penalty}s",
    hintNarrowGroup: "Pista {index}: estos son los mejores candidatos en {group}. +{penalty}s",
    hintNoUseful: "Con las marcas actuales no hay una pista útil clara.",
    nextDaily: "Compártelo o prueba una práctica nueva.",
    nextPractice: "Compártelo o prueba otra práctica.",
    hintSummary: " Pistas: {count} (+{penalty}s).",
    solvedMessage: "Resuelto en {time}. {result}{hintSummary} {nextStep}",
    newBest: "Mejor tiempo nuevo.",
    nice: "Bien hecho.",
    groupRow: "la fila {index}",
    groupCol: "la columna {index}",
    groupRegion: "la zona {label}",
    modeDaily: "Reto diario",
    modePractice: "Práctica",
    startLabelDaily: "Reto diario #{id}",
    startLabelPractice: "Práctica #{id}",
    startButtonDaily: "Empezar reto diario",
    startButtonPractice: "Empezar práctica",
    hintButton: "Pista +{penalty}s",
    noHintsLeft: "Sin pistas",
    todayDaily: "#{id} Hoy",
    todayPractice: "#{id} Práctica",
    proofUnique: "Única",
    cellLabel: "Fila {row}, columna {col}, zona {region}, {mark}",
    markStar: "estrella",
    markBlocked: "bloqueada",
    markEmpty: "vacía",
    shareTitleDaily: "Daily Two Not Touch #{id}",
    shareTitlePractice: "Práctica Two Not Touch #{id}",
    shareSolved: "Resuelto en {time}",
    shareProgress: "En progreso",
    shareStars: "Estrellas: {count}/{size}",
    shareHints: "Pistas: {count} (+{penalty}s)",
    shareCopied: "Texto para compartir copiado.",
    linkCopied: "Enlace copiado.",
    comboCount: "{count} {label}",
    comboSingular: "combinación",
    comboPlural: "combinaciones",
    comboNone: "Sin resultado",
    comboCopied: "Copiado"
  },
  fr: {
    statusReady: "Appuie sur Start quand tu es prêt. Le chrono est encore arrêté.",
    timerStarted: "Le chrono tourne. À toi de jouer.",
    pressStartPlace: "Lance le puzzle avant de placer des étoiles.",
    keepGoing: "Continue.",
    resetConfirm: "Clique encore sur Reset pour vider cette grille.",
    resetReady: "La grille est remise à zéro. Appuie sur Start quand tu es prêt.",
    dailyConfirm: "Clique encore sur Daily pour abandonner cette grille.",
    generatingDaily: "Création du puzzle du jour avec solution unique...",
    dailyReady: "Le puzzle du jour est prêt. Appuie sur Start pour commencer.",
    practiceConfirm: "Clique encore sur New Practice pour abandonner cette grille.",
    generatingPractice: "Création d'une grille d'entraînement à solution unique...",
    practiceReady: "La grille d'entraînement est prête. Appuie sur Start quand tu veux.",
    checkBeforeStart: "Appuie sur Start avant de vérifier la grille.",
    checkConflict: "Une marque ne respecte pas les règles.",
    checkNoCompletion: "Avec ces marques, il ne reste aucune solution valide. Enlève une étoile ou une case barrée.",
    checkIncomplete: "Pas de conflit pour l'instant. Certaines lignes, colonnes ou zones attendent encore une étoile.",
    hintBeforeStart: "Appuie sur Start avant de demander un indice.",
    hintNoneLeft: "Il n'y a plus d'indices pour cette grille. Continue ou lance un entraînement.",
    hintConflict: "Indice {index} : corrige d'abord le conflit surligné. +{penalty}s",
    hintNoCompletion: "Indice {index} : tes marques actuelles bloquent toute solution. Annule l'une d'elles. +{penalty}s",
    hintFocus: "Indice 1 : regarde {group}, c'est là qu'il reste le moins d'options. +{penalty}s",
    hintSolutionStar: "Indice 3 : cette case contient une étoile dans la solution. +{penalty}s",
    hintSingleCandidate: "Indice {index} : il ne reste qu'une case possible dans {group}. +{penalty}s",
    hintNarrowGroup: "Indice {index} : voici les meilleurs candidats dans {group}. +{penalty}s",
    hintNoUseful: "Aucun indice vraiment utile avec les marques actuelles.",
    nextDaily: "Partage ton résultat ou tente un entraînement.",
    nextPractice: "Partage ton résultat ou lance une autre grille.",
    hintSummary: " Indices : {count} (+{penalty}s).",
    solvedMessage: "Résolu en {time}. {result}{hintSummary} {nextStep}",
    newBest: "Nouveau meilleur temps.",
    nice: "Bien joué.",
    groupRow: "la ligne {index}",
    groupCol: "la colonne {index}",
    groupRegion: "la zone {label}",
    modeDaily: "Puzzle du jour",
    modePractice: "Entraînement",
    startLabelDaily: "Puzzle du jour #{id}",
    startLabelPractice: "Entraînement #{id}",
    startButtonDaily: "Lancer le puzzle du jour",
    startButtonPractice: "Lancer l'entraînement",
    hintButton: "Indice +{penalty}s",
    noHintsLeft: "Plus d'indices",
    todayDaily: "#{id} Aujourd'hui",
    todayPractice: "#{id} Entraînement",
    proofUnique: "Unique",
    cellLabel: "Ligne {row}, colonne {col}, zone {region}, {mark}",
    markStar: "étoile",
    markBlocked: "barrée",
    markEmpty: "vide",
    shareTitleDaily: "Daily Two Not Touch #{id}",
    shareTitlePractice: "Entraînement Two Not Touch #{id}",
    shareSolved: "Résolu en {time}",
    shareProgress: "En cours",
    shareStars: "Étoiles : {count}/{size}",
    shareHints: "Indices : {count} (+{penalty}s)",
    shareCopied: "Texte de partage copié.",
    linkCopied: "Lien copié.",
    comboCount: "{count} {label}",
    comboSingular: "combinaison",
    comboPlural: "combinaisons",
    comboNone: "Aucun résultat",
    comboCopied: "Copié"
  },
  ja: {
    statusReady: "準備できたら Start を押してください。タイマーはまだ止まっています。",
    timerStarted: "タイマーが動き始めました。落ち着いて解きましょう。",
    pressStartPlace: "星を置く前に Start を押してください。",
    keepGoing: "その調子です。",
    resetConfirm: "もう一度 Reset を押すと、この盤面を消します。",
    resetReady: "盤面をリセットしました。準備できたら Start を押してください。",
    dailyConfirm: "もう一度 Daily を押すと、この盤面を破棄します。",
    generatingDaily: "一意解のデイリーパズルを作成中...",
    dailyReady: "今日のパズルができました。Start で始めましょう。",
    practiceConfirm: "もう一度 New Practice を押すと、この盤面を破棄します。",
    generatingPractice: "一意解の練習パズルを作成中...",
    practiceReady: "練習パズルができました。準備できたら Start を押してください。",
    checkBeforeStart: "盤面をチェックする前に Start を押してください。",
    checkConflict: "ルールに合わない配置があります。",
    checkNoCompletion: "今の印では有効な解に進めません。星かブロック印を一つ戻してください。",
    checkIncomplete: "まだ矛盾はありません。星が足りない行、列、色エリアがあります。",
    hintBeforeStart: "ヒントを見る前に Start を押してください。",
    hintNoneLeft: "この盤面で使えるヒントは残っていません。続けるか、新しい練習を始めてください。",
    hintConflict: "ヒント {index}: まずハイライトされた矛盾を直しましょう。+{penalty}s",
    hintNoCompletion: "ヒント {index}: 今の印では解けません。どれか一つ戻しましょう。+{penalty}s",
    hintFocus: "ヒント 1: {group} を見てください。選択肢がいちばん少ない場所です。+{penalty}s",
    hintSolutionStar: "ヒント 3: このマスは解答で星になります。+{penalty}s",
    hintSingleCandidate: "ヒント {index}: {group} には候補が一つだけ残っています。+{penalty}s",
    hintNarrowGroup: "ヒント {index}: {group} の有力候補です。+{penalty}s",
    hintNoUseful: "今の印からは、役に立つヒントを出せません。",
    nextDaily: "結果を共有するか、練習パズルに挑戦しましょう。",
    nextPractice: "結果を共有するか、もう一問解いてみましょう。",
    hintSummary: " ヒント: {count} 回 (+{penalty}s)。",
    solvedMessage: "{time} でクリア。{result}{hintSummary} {nextStep}",
    newBest: "自己ベスト更新。",
    nice: "いいですね。",
    groupRow: "{index} 行目",
    groupCol: "{index} 列目",
    groupRegion: "色エリア {label}",
    modeDaily: "今日のパズル",
    modePractice: "練習パズル",
    startLabelDaily: "今日のパズル #{id}",
    startLabelPractice: "練習 #{id}",
    startButtonDaily: "今日のパズルを始める",
    startButtonPractice: "練習を始める",
    hintButton: "ヒント +{penalty}s",
    noHintsLeft: "ヒントなし",
    todayDaily: "#{id} 今日",
    todayPractice: "#{id} 練習",
    proofUnique: "一意解",
    cellLabel: "{row} 行 {col} 列、色 {region}、{mark}",
    markStar: "星",
    markBlocked: "ブロック",
    markEmpty: "空き",
    shareTitleDaily: "Daily Two Not Touch #{id}",
    shareTitlePractice: "Two Not Touch 練習 #{id}",
    shareSolved: "{time} でクリア",
    shareProgress: "挑戦中",
    shareStars: "星: {count}/{size}",
    shareHints: "ヒント: {count} 回 (+{penalty}s)",
    shareCopied: "共有テキストをコピーしました。",
    linkCopied: "リンクをコピーしました。",
    comboCount: "{count} {label}",
    comboSingular: "通り",
    comboPlural: "通り",
    comboNone: "該当なし",
    comboCopied: "コピーしました"
  },
  pt: {
    statusReady: "Aperte Start quando estiver pronto. O cronômetro ainda está parado.",
    timerStarted: "O tempo começou. Resolva com calma.",
    pressStartPlace: "Aperte Start antes de colocar estrelas.",
    keepGoing: "Continue assim.",
    resetConfirm: "Aperte Reset de novo para limpar este tabuleiro.",
    resetReady: "Tabuleiro reiniciado. Aperte Start quando estiver pronto.",
    dailyConfirm: "Aperte Daily de novo para descartar este tabuleiro.",
    generatingDaily: "Gerando o desafio diário com solução única...",
    dailyReady: "O desafio diário está pronto. Aperte Start para começar.",
    practiceConfirm: "Aperte New Practice de novo para descartar este tabuleiro.",
    generatingPractice: "Gerando um treino com solução única...",
    practiceReady: "O treino está pronto. Aperte Start quando quiser.",
    checkBeforeStart: "Aperte Start antes de conferir o tabuleiro.",
    checkConflict: "Alguma marcação entra em conflito com as regras.",
    checkNoCompletion: "Com as marcações atuais, não sobra nenhuma solução válida. Remova uma estrela ou uma marca bloqueada.",
    checkIncomplete: "Ainda não há conflito. Algumas linhas, colunas ou regiões ainda precisam de estrelas.",
    hintBeforeStart: "Aperte Start antes de pedir uma dica.",
    hintNoneLeft: "Não há mais dicas para este tabuleiro. Continue tentando ou abra um novo treino.",
    hintConflict: "Dica {index}: resolva primeiro o conflito destacado. +{penalty}s",
    hintNoCompletion: "Dica {index}: suas marcações atuais não levam a uma solução. Desfaça uma delas. +{penalty}s",
    hintFocus: "Dica 1: olhe para {group}; é onde restam menos opções. +{penalty}s",
    hintSolutionStar: "Dica 3: esta casa é uma estrela na solução. +{penalty}s",
    hintSingleCandidate: "Dica {index}: só resta uma candidata em {group}. +{penalty}s",
    hintNarrowGroup: "Dica {index}: estes são os melhores candidatos em {group}. +{penalty}s",
    hintNoUseful: "Com as marcações atuais, não apareceu uma dica útil.",
    nextDaily: "Compartilhe o resultado ou tente um novo treino.",
    nextPractice: "Compartilhe o resultado ou tente outro treino.",
    hintSummary: " Dicas: {count} (+{penalty}s).",
    solvedMessage: "Resolvido em {time}. {result}{hintSummary} {nextStep}",
    newBest: "Novo melhor tempo.",
    nice: "Boa.",
    groupRow: "a linha {index}",
    groupCol: "a coluna {index}",
    groupRegion: "a região {label}",
    modeDaily: "Desafio diário",
    modePractice: "Treino",
    startLabelDaily: "Desafio diário #{id}",
    startLabelPractice: "Treino #{id}",
    startButtonDaily: "Começar desafio diário",
    startButtonPractice: "Começar treino",
    hintButton: "Dica +{penalty}s",
    noHintsLeft: "Sem dicas",
    todayDaily: "#{id} Hoje",
    todayPractice: "#{id} Treino",
    proofUnique: "Única",
    cellLabel: "Linha {row}, coluna {col}, região {region}, {mark}",
    markStar: "estrela",
    markBlocked: "bloqueada",
    markEmpty: "vazia",
    shareTitleDaily: "Daily Two Not Touch #{id}",
    shareTitlePractice: "Treino Two Not Touch #{id}",
    shareSolved: "Resolvido em {time}",
    shareProgress: "Em andamento",
    shareStars: "Estrelas: {count}/{size}",
    shareHints: "Dicas: {count} (+{penalty}s)",
    shareCopied: "Texto de compartilhamento copiado.",
    linkCopied: "Link copiado.",
    comboCount: "{count} {label}",
    comboSingular: "combinação",
    comboPlural: "combinações",
    comboNone: "Sem resultado",
    comboCopied: "Copiado"
  },
  zh: {
    statusReady: "准备好了再点开始，计时器现在不会偷跑。",
    timerStarted: "开始计时，慢慢推理。",
    pressStartPlace: "先点击开始，再放星星。",
    keepGoing: "继续推。",
    resetConfirm: "再点一次重置，会清空当前盘面。",
    resetReady: "盘面已重置。准备好后点击开始。",
    dailyConfirm: "再点一次每日题，会放弃当前盘面。",
    generatingDaily: "正在生成唯一解每日题...",
    dailyReady: "每日题已准备好。准备好后点击开始。",
    practiceConfirm: "再点一次新练习，会放弃当前盘面。",
    generatingPractice: "正在生成唯一解练习题...",
    practiceReady: "练习题已准备好。准备好后点击开始。",
    checkBeforeStart: "先点击开始，再检查盘面。",
    checkConflict: "有标记违反了规则。",
    checkNoCompletion: "按照当前标记已经没有可行解了。撤回一个星星或排除标记。",
    checkIncomplete: "目前没有冲突，但还有行、列或色块缺星星。",
    hintBeforeStart: "先点击开始，再使用提示。",
    hintNoneLeft: "这题的提示已经用完了。继续推，或者换一题练习。",
    hintConflict: "提示 {index}：先处理高亮出来的冲突。+{penalty}s",
    hintNoCompletion: "提示 {index}：当前标记无法继续得到解，撤回其中一个。+{penalty}s",
    hintFocus: "提示 1：先看{group}，这里候选最少。+{penalty}s",
    hintSolutionStar: "提示 3：这个格子在答案里是星星。+{penalty}s",
    hintSingleCandidate: "提示 {index}：{group}只剩一个候选格。+{penalty}s",
    hintNarrowGroup: "提示 {index}：这些是{group}里最值得看的候选。+{penalty}s",
    hintNoUseful: "根据当前标记，暂时没有有效提示。",
    nextDaily: "可以分享结果，或者再做一题练习。",
    nextPractice: "可以分享结果，或者再换一题练习。",
    hintSummary: " 提示：{count} 次（+{penalty}s）。",
    solvedMessage: "{time} 完成。{result}{hintSummary} {nextStep}",
    newBest: "刷新最佳时间。",
    nice: "不错。",
    groupRow: "第 {index} 行",
    groupCol: "第 {index} 列",
    groupRegion: "色块 {label}",
    modeDaily: "每日题",
    modePractice: "练习题",
    startLabelDaily: "每日题 #{id}",
    startLabelPractice: "练习题 #{id}",
    startButtonDaily: "开始每日题",
    startButtonPractice: "开始练习",
    hintButton: "提示 +{penalty}s",
    noHintsLeft: "提示已用完",
    todayDaily: "#{id} 今日",
    todayPractice: "#{id} 练习",
    proofUnique: "唯一解",
    cellLabel: "第 {row} 行，第 {col} 列，色块 {region}，{mark}",
    markStar: "星星",
    markBlocked: "排除",
    markEmpty: "空格",
    shareTitleDaily: "Daily Two Not Touch #{id}",
    shareTitlePractice: "Two Not Touch 练习 #{id}",
    shareSolved: "{time} 完成",
    shareProgress: "进行中",
    shareStars: "星星：{count}/{size}",
    shareHints: "提示：{count} 次（+{penalty}s）",
    shareCopied: "分享文本已复制。",
    linkCopied: "链接已复制。",
    comboCount: "{count} {label}",
    comboSingular: "组组合",
    comboPlural: "组组合",
    comboNone: "没有匹配",
    comboCopied: "已复制"
  }
};
const uiText = UI_TEXT[LANGUAGE_KEY] || UI_TEXT.en;

const els = {
  board: document.querySelector("#board"),
  status: document.querySelector("#status"),
  timer: document.querySelector("#timer"),
  starCount: document.querySelector("#starCount"),
  streakCount: document.querySelector("#streakCount"),
  puzzleMode: document.querySelector("#puzzleMode"),
  todayLabel: document.querySelector("#todayLabel"),
  proofLabel: document.querySelector("#proofLabel"),
  bestTime: document.querySelector("#bestTime"),
  sharePreview: document.querySelector("#sharePreview"),
  startOverlay: document.querySelector("#startOverlay"),
  startBtn: document.querySelector("#startBtn"),
  startLabel: document.querySelector("#startLabel"),
  resetBtn: document.querySelector("#resetBtn"),
  hintBtn: document.querySelector("#hintBtn"),
  checkBtn: document.querySelector("#checkBtn"),
  practiceBtn: document.querySelector("#practiceBtn"),
  shareBtn: document.querySelector("#shareBtn"),
  dailyBtn: document.querySelector("#dailyBtn"),
  copyLinkBtn: document.querySelector("#copyLinkBtn"),
  comboForm: document.querySelector("#comboForm"),
  sumInput: document.querySelector("#sumInput"),
  cellsInput: document.querySelector("#cellsInput"),
  repeatInput: document.querySelector("#repeatInput"),
  digits: document.querySelector("#digits"),
  comboCount: document.querySelector("#comboCount"),
  comboResults: document.querySelector("#comboResults"),
  copyCombosBtn: document.querySelector("#copyCombosBtn")
};

const storage = {
  streak: "dll-streak",
  solvedDate: "dll-solved-date",
  bestDailyPrefix: "dll-best-daily-",
  bestPractice: "dll-best-practice"
};

let state = createGameState(getDailyPuzzle(), "daily");
let timerId = null;
let elapsed = 0;
let startedAt = 0;
let pendingAction = null;
let pendingActionTimer = null;
let activeDigits = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

init();

function getLanguageKey() {
  const lang = (document.documentElement.lang || "").toLowerCase();
  if (lang.startsWith("de")) return "de";
  if (lang.startsWith("es")) return "es";
  if (lang.startsWith("fr")) return "fr";
  if (lang.startsWith("ja")) return "ja";
  if (lang.startsWith("pt")) return "pt";
  if (lang.startsWith("zh")) return "zh";
  return "en";
}

function t(key, params = {}) {
  const template = uiText[key] || UI_TEXT.en[key] || "";
  return String(template).replace(/\{(\w+)\}/g, (_, name) => {
    if (params[name] === undefined || params[name] === null) return "";
    return String(params[name]);
  });
}

function init() {
  renderBoard();
  updateStats();
  updateSharePreview();
  updateStartOverlay();
  updateControls();
  setStatus(t("statusReady"), "");
  bindGameEvents();
  if (els.comboForm) {
    renderDigits();
    bindCalculatorEvents();
    updateCombinations();
  }
  trackEvent("site_loaded", {
    path: location.pathname || "/",
    title: document.title,
    language: LANGUAGE_KEY
  });
}

function bindGameEvents() {
  els.startBtn.addEventListener("click", startPuzzle);
  els.startOverlay.addEventListener("click", startPuzzle);
  els.resetBtn.addEventListener("click", resetCurrentPuzzle);
  els.hintBtn.addEventListener("click", showHint);
  els.checkBtn.addEventListener("click", checkPuzzle);
  els.practiceBtn.addEventListener("click", loadPracticePuzzle);
  els.dailyBtn.addEventListener("click", loadDailyPuzzle);
  els.shareBtn.addEventListener("click", shareResult);
  els.copyLinkBtn.addEventListener("click", copyPageLink);
}

function bindCalculatorEvents() {
  els.comboForm.addEventListener("input", updateCombinations);
  els.copyCombosBtn.addEventListener("click", copyCombinations);
}

function createGameState(puzzle, mode) {
  return {
    puzzle,
    mode,
    cells: Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY)),
    hints: new Set(),
    errors: new Set(),
    hintCount: 0,
    hintPenalty: 0,
    solved: false,
    started: false
  };
}

function startPuzzle() {
  if (state.started || state.solved) return;
  clearPendingAction();
  state.started = true;
  elapsed = 0;
  startedAt = Date.now();
  startTimer();
  renderBoard();
  updateStartOverlay();
  updateControls();
  updateStats();
  setStatus(t("timerStarted"), "success");
  trackEvent("puzzle_start", getPuzzleEventData({ start_method: "button" }));
}

function preparePuzzle(message, tone = "") {
  clearPendingAction();
  stopTimer();
  elapsed = 0;
  startedAt = 0;
  state.hints.clear();
  state.errors.clear();
  setModeText();
  setStatus(message, tone);
  renderBoard();
  updateStats();
  updateSharePreview();
  updateStartOverlay();
  updateControls();
}

function getDailyPuzzle() {
  const start = Date.UTC(2026, 0, 1);
  const today = new Date();
  const day = Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - start) / 86400000);
  return generateUniquePuzzle(hashString(`daily-${getTodayKey()}`), day + 1);
}

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildSolutionPermutations() {
  const permutations = [];
  function walk(cols) {
    const row = cols.length;
    if (row === SIZE) {
      permutations.push([...cols]);
      return;
    }
    for (let col = 0; col < SIZE; col += 1) {
      if (cols.includes(col)) continue;
      if (row > 0 && Math.abs(col - cols[row - 1]) <= 1) continue;
      cols.push(col);
      walk(cols);
      cols.pop();
    }
  }
  walk([]);
  return permutations;
}

function generateUniquePuzzle(baseSeed, id) {
  const normalizedSeed = baseSeed >>> 0;
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const rng = createRng((normalizedSeed + attempt * 0x9e3779b9) >>> 0);
    const solution = VALID_SOLUTIONS[randomInt(rng, VALID_SOLUTIONS.length)];
    const regions = generateRegions(solution, rng);
    if (!regions) continue;

    const solutions = solveStarBattle(regions, 2);
    if (solutions.length === 1) {
      return {
        id,
        seed: normalizedSeed,
        attempt,
        solution: solutions[0],
        regions
      };
    }
  }
  throw new Error("Could not generate a unique-solution Star Battle puzzle.");
}

function generateRegions(solution, rng) {
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(-1));
  const assigned = [];
  const unassigned = new Set();

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      unassigned.add(getKey(row, col));
    }
  }

  solution.forEach((col, row) => {
    grid[row][col] = row;
    assigned.push([row, col]);
    unassigned.delete(getKey(row, col));
  });

  let guard = 0;
  while (unassigned.size && guard < 10000) {
    guard += 1;
    const [sourceRow, sourceCol] = assigned[randomInt(rng, assigned.length)];
    const options = orthogonalNeighbors(sourceRow, sourceCol).filter(([row, col]) =>
      unassigned.has(getKey(row, col))
    );
    if (!options.length) continue;

    const [row, col] = options[randomInt(rng, options.length)];
    grid[row][col] = grid[sourceRow][sourceCol];
    assigned.push([row, col]);
    unassigned.delete(getKey(row, col));
  }

  if (unassigned.size) return null;
  return grid.map((row) => row.map((region) => REGION_LABELS[region]).join(""));
}

function solveStarBattle(regions, limit = 2) {
  const solutions = [];
  const usedCols = Array(SIZE).fill(false);
  const usedRegions = Array(SIZE).fill(false);

  function walk(row, cols) {
    if (solutions.length >= limit) return;
    if (row === SIZE) {
      solutions.push([...cols]);
      return;
    }

    for (let col = 0; col < SIZE; col += 1) {
      const region = regionIndexFromRows(regions, row, col);
      if (usedCols[col] || usedRegions[region]) continue;
      if (row > 0 && Math.abs(col - cols[row - 1]) <= 1) continue;

      usedCols[col] = true;
      usedRegions[region] = true;
      cols.push(col);
      walk(row + 1, cols);
      cols.pop();
      usedRegions[region] = false;
      usedCols[col] = false;
    }
  }

  walk(0, []);
  return solutions;
}

function countCurrentCompletions(limit = 2) {
  const currentStars = [];
  const blocked = new Set();
  const usedRows = Array(SIZE).fill(false);
  const usedCols = Array(SIZE).fill(false);
  const usedRegions = Array(SIZE).fill(false);

  forEachCell((row, col) => {
    if (state.cells[row][col] === BLOCK) blocked.add(getKey(row, col));
    if (state.cells[row][col] === STAR) currentStars.push([row, col]);
  });

  for (const [row, col] of currentStars) {
    const region = regionIndex(row, col);
    if (usedRows[row] || usedCols[col] || usedRegions[region]) return 0;
    for (const [otherRow, otherCol] of currentStars) {
      if (row === otherRow && col === otherCol) continue;
      if (Math.abs(row - otherRow) <= 1 && Math.abs(col - otherCol) <= 1) return 0;
    }
    usedRows[row] = true;
    usedCols[col] = true;
    usedRegions[region] = true;
  }

  let count = 0;
  function walk(row, cols) {
    if (count >= limit) return;
    if (row === SIZE) {
      count += 1;
      return;
    }

    const fixed = currentStars.find(([starRow]) => starRow === row);
    const columns = fixed ? [fixed[1]] : [...Array(SIZE).keys()];
    for (const col of columns) {
      const region = regionIndex(row, col);
      const key = getKey(row, col);
      const alreadyStar = fixed && fixed[1] === col;
      if (!alreadyStar && blocked.has(key)) continue;
      if (!alreadyStar && (usedCols[col] || usedRegions[region])) continue;
      if (row > 0 && cols[row - 1] !== undefined && Math.abs(col - cols[row - 1]) <= 1) continue;

      if (!alreadyStar) {
        usedCols[col] = true;
        usedRegions[region] = true;
      }
      cols[row] = col;
      walk(row + 1, cols);
      cols[row] = undefined;
      if (!alreadyStar) {
        usedRegions[region] = false;
        usedCols[col] = false;
      }
    }
  }

  walk(0, []);
  return count;
}

function orthogonalNeighbors(row, col) {
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1]
  ].filter(([nextRow, nextCol]) => inside(nextRow, nextCol));
}

function regionIndexFromRows(regions, row, col) {
  return regions[row].charCodeAt(col) - 65;
}

function createPracticeSeed() {
  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0];
  }
  return hashString(`${Date.now()}-${Math.random()}`);
}

function createRng(seed) {
  let value = seed >>> 0;
  return function nextRandom() {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(rng, max) {
  return Math.floor(rng() * max);
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function renderBoard() {
  els.board.innerHTML = "";
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const cell = document.createElement("button");
      const key = getKey(row, col);
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      cell.dataset.region = String(regionIndex(row, col));
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", getCellLabel(row, col));
      cell.disabled = !state.started || state.solved;
      cell.addEventListener("click", () => cycleCell(row, col));
      cell.addEventListener("keydown", (event) => handleCellKeydown(event, row, col));
      if (state.cells[row][col] === STAR) {
        cell.classList.add("star");
        cell.textContent = "\u2605";
      }
      if (state.cells[row][col] === BLOCK) {
        cell.classList.add("blocked");
      }
      if (state.hints.has(key)) {
        cell.classList.add("hint");
      }
      if (state.errors.has(key)) {
        cell.classList.add("error");
      }
      els.board.appendChild(cell);
    }
  }
}

function cycleCell(row, col) {
  if (state.solved) return;
  if (!state.started) {
    setStatus(t("pressStartPlace"), "");
    updateStartOverlay();
    return;
  }
  state.cells[row][col] = (state.cells[row][col] + 1) % 3;
  commitCellChange(row, col);
}

function setCellValue(row, col, value) {
  if (state.solved || !state.started) return;
  state.cells[row][col] = value;
  commitCellChange(row, col);
}

function commitCellChange(row, col) {
  clearPendingAction();
  state.hints.clear();
  state.errors.clear();
  setStatus(t("keepGoing"), "");
  renderBoard();
  updateStats();
  focusCell(row, col);
  if (isSolved().ok) {
    markSolved();
  }
}

function handleCellKeydown(event, row, col) {
  const movement = {
    ArrowUp: [-1, 0],
    ArrowRight: [0, 1],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1]
  }[event.key];

  if (movement) {
    event.preventDefault();
    focusCell(clamp(row + movement[0], 0, SIZE - 1), clamp(col + movement[1], 0, SIZE - 1));
    return;
  }

  const key = event.key.toLowerCase();
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    cycleCell(row, col);
  } else if (key === "s") {
    event.preventDefault();
    setCellValue(row, col, STAR);
  } else if (key === "x" || key === ".") {
    event.preventDefault();
    setCellValue(row, col, BLOCK);
  } else if (event.key === "Backspace" || event.key === "Delete" || key === "0") {
    event.preventDefault();
    setCellValue(row, col, EMPTY);
  }
}

function focusCell(row, col) {
  const cell = els.board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (cell && !cell.disabled) {
    cell.focus({ preventScroll: true });
  }
}

function getCellLabel(row, col) {
  const value = state.cells[row][col];
  const mark = value === STAR ? t("markStar") : value === BLOCK ? t("markBlocked") : t("markEmpty");
  return t("cellLabel", { row: row + 1, col: col + 1, region: REGION_LABELS[regionIndex(row, col)], mark });
}

function hasActiveProgress() {
  return state.started && !state.solved && state.cells.flat().some((value) => value !== EMPTY);
}

function requestDestructiveAction(actionKey, message, action) {
  if (!hasActiveProgress()) {
    clearPendingAction();
    action();
    return;
  }

  if (pendingAction === actionKey) {
    clearPendingAction();
    action();
    return;
  }

  pendingAction = actionKey;
  window.clearTimeout(pendingActionTimer);
  pendingActionTimer = window.setTimeout(clearPendingAction, DISCARD_CONFIRM_MS);
  setStatus(message, "");
  trackEvent("discard_prompt_shown", getPuzzleEventData({ action: actionKey }));
}

function clearPendingAction() {
  pendingAction = null;
  if (pendingActionTimer) {
    window.clearTimeout(pendingActionTimer);
    pendingActionTimer = null;
  }
}

function resetCurrentPuzzle() {
  requestDestructiveAction("reset", t("resetConfirm"), () => {
    trackEvent("puzzle_reset", getPuzzleEventData());
    state = createGameState(state.puzzle, state.mode);
    preparePuzzle(t("resetReady"), "");
  });
}

function loadDailyPuzzle() {
  requestDestructiveAction("daily", t("dailyConfirm"), () => {
    setStatus(t("generatingDaily"), "");
    state = createGameState(getDailyPuzzle(), "daily");
    preparePuzzle(t("dailyReady"), "success");
    trackEvent("daily_puzzle_loaded", getPuzzleEventData());
  });
}

function loadPracticePuzzle() {
  requestDestructiveAction("practice", t("practiceConfirm"), () => {
    setStatus(t("generatingPractice"), "");
    const next = generateUniquePuzzle(createPracticeSeed(), "P" + String(Date.now()).slice(-5));
    state = createGameState(next, "practice");
    preparePuzzle(t("practiceReady"), "success");
    trackEvent("new_practice_clicked", getPuzzleEventData());
  });
}

function checkPuzzle() {
  if (!state.started) {
    setStatus(t("checkBeforeStart"), "");
    updateStartOverlay();
    return;
  }
  const result = isSolved();
  state.errors = result.errors;
  state.hints.clear();
  let outcome = "incomplete";
  if (result.ok) {
    outcome = "solved";
    markSolved();
  } else if (result.errors.size) {
    outcome = "conflict";
    setStatus(t("checkConflict"), "error");
  } else if (countCurrentCompletions(1) === 0) {
    outcome = "no_valid_completion";
    setStatus(t("checkNoCompletion"), "error");
  } else {
    setStatus(t("checkIncomplete"), "");
  }
  trackEvent("check_used", getPuzzleEventData({ outcome }));
  renderBoard();
}

function showHint() {
  if (!state.started) {
    setStatus(t("hintBeforeStart"), "");
    updateStartOverlay();
    return;
  }
  if (state.hintCount >= HINT_PENALTIES.length) {
    setStatus(t("hintNoneLeft"), "");
    return;
  }
  state.errors.clear();
  state.hints.clear();
  const result = isSolved();
  const hintLevel = state.hintCount;
  const penalty = HINT_PENALTIES[hintLevel];

  if (result.errors.size) {
    state.errors = result.errors;
    applyHintPenalty(penalty);
    setStatus(t("hintConflict", { index: hintLevel + 1, penalty }), "error");
    trackEvent("hint_used", getPuzzleEventData({ outcome: "conflict", hint_level: hintLevel + 1, penalty_seconds: penalty }));
    renderBoard();
    updateControls();
    updateSharePreview();
    return;
  }

  if (countCurrentCompletions(1) === 0) {
    applyHintPenalty(penalty);
    setStatus(t("hintNoCompletion", { index: hintLevel + 1, penalty }), "error");
    trackEvent("hint_used", getPuzzleEventData({ outcome: "no_valid_completion", hint_level: hintLevel + 1, penalty_seconds: penalty }));
    renderBoard();
    updateControls();
    updateSharePreview();
    return;
  }

  const candidates = getCandidates();
  const groups = [
    ...groupHints("row", candidates),
    ...groupHints("col", candidates),
    ...groupHints("region", candidates)
  ];
  const sortedGroups = groups
    .filter((group) => group.cells.length)
    .sort((a, b) => a.cells.length - b.cells.length);

  if (hintLevel === 0 && sortedGroups.length) {
    const group = sortedGroups[0];
    applyHintPenalty(penalty);
    setStatus(t("hintFocus", { group: describeHintGroup(group), penalty }), "");
    trackEvent("hint_used", getPuzzleEventData({ outcome: "focus_group", hint_type: group.type, hint_group: describeHintGroup(group), hint_level: 1, penalty_seconds: penalty }));
    renderBoard();
    updateControls();
    updateSharePreview();
    return;
  }

  if (hintLevel >= 2) {
    const starKey = getNextSolutionStarKey();
    if (starKey) {
      applyHintPenalty(penalty);
      state.hints.add(starKey);
      setStatus(t("hintSolutionStar", { penalty }), "");
      trackEvent("hint_used", getPuzzleEventData({ outcome: "solution_star", hint_level: 3, penalty_seconds: penalty }));
      renderBoard();
      updateControls();
      updateSharePreview();
      return;
    }
  }

  const single = groups.find((group) => group.cells.length === 1);

  if (single) {
    applyHintPenalty(penalty);
    state.hints.add(single.cells[0]);
    setStatus(t("hintSingleCandidate", { index: hintLevel + 1, group: describeHintGroup(single), penalty }), "");
    trackEvent("hint_used", getPuzzleEventData({ outcome: "single_candidate", hint_type: single.type, hint_group: describeHintGroup(single), hint_level: hintLevel + 1, penalty_seconds: penalty }));
    renderBoard();
    updateControls();
    updateSharePreview();
    return;
  }

  const narrow = sortedGroups.find((group) => group.cells.length > 1);

  if (narrow) {
    applyHintPenalty(penalty);
    narrow.cells.forEach((key) => state.hints.add(key));
    setStatus(t("hintNarrowGroup", { index: hintLevel + 1, group: describeHintGroup(narrow), penalty }), "");
    trackEvent("hint_used", getPuzzleEventData({ outcome: "narrow_group", hint_type: narrow.type, hint_group: describeHintGroup(narrow), hint_level: hintLevel + 1, penalty_seconds: penalty }));
  } else {
    setStatus(t("hintNoUseful"), "");
    trackEvent("hint_used", getPuzzleEventData({ outcome: "no_hint", hint_level: hintLevel + 1, penalty_seconds: 0 }));
  }
  renderBoard();
  updateControls();
  updateSharePreview();
}

function applyHintPenalty(seconds) {
  updateElapsedFromClock();
  elapsed += seconds;
  state.hintCount += 1;
  state.hintPenalty += seconds;
  startedAt = Date.now() - elapsed * 1000;
  updateStats();
}

function getNextSolutionStarKey() {
  for (let row = 0; row < SIZE; row += 1) {
    const col = state.puzzle.solution[row];
    if (state.cells[row][col] !== STAR) {
      return getKey(row, col);
    }
  }
  return "";
}

function markSolved() {
  if (state.solved) return;
  updateElapsedFromClock();
  state.solved = true;
  stopTimer();
  state.errors.clear();
  state.hints.clear();
  const isBest = saveBestTime();
  if (state.mode === "daily") {
    const today = getTodayKey();
    if (localStorage.getItem(storage.solvedDate) !== today) {
      const nextStreak = Number(localStorage.getItem(storage.streak) || "0") + 1;
      localStorage.setItem(storage.streak, String(nextStreak));
      localStorage.setItem(storage.solvedDate, today);
    }
  }
  const nextStep = state.mode === "daily" ? t("nextDaily") : t("nextPractice");
  const hintSummary = state.hintCount ? t("hintSummary", { count: state.hintCount, penalty: state.hintPenalty }) : "";
  setStatus(
    t("solvedMessage", {
      time: formatTime(elapsed),
      result: isBest ? t("newBest") : t("nice"),
      hintSummary,
      nextStep
    }),
    "success"
  );
  trackEvent("puzzle_solved", getPuzzleEventData({ time_seconds: elapsed, new_best: isBest }));
  renderBoard();
  updateStats();
  updateStartOverlay();
  updateControls();
  updateSharePreview();
}

function isSolved() {
  const errors = new Set();
  const rowCounts = Array(SIZE).fill(0);
  const colCounts = Array(SIZE).fill(0);
  const regionCounts = Array(SIZE).fill(0);
  const stars = [];

  forEachCell((row, col) => {
    if (state.cells[row][col] === STAR) {
      rowCounts[row] += 1;
      colCounts[col] += 1;
      regionCounts[regionIndex(row, col)] += 1;
      stars.push([row, col]);
    }
  });

  for (let i = 0; i < SIZE; i += 1) {
    if (rowCounts[i] > 1) markGroup("row", i, errors);
    if (colCounts[i] > 1) markGroup("col", i, errors);
    if (regionCounts[i] > 1) markGroup("region", i, errors);
  }

  for (let i = 0; i < stars.length; i += 1) {
    for (let j = i + 1; j < stars.length; j += 1) {
      const [aRow, aCol] = stars[i];
      const [bRow, bCol] = stars[j];
      if (Math.abs(aRow - bRow) <= 1 && Math.abs(aCol - bCol) <= 1) {
        errors.add(getKey(aRow, aCol));
        errors.add(getKey(bRow, bCol));
      }
    }
  }

  const complete =
    stars.length === SIZE &&
    rowCounts.every((count) => count === 1) &&
    colCounts.every((count) => count === 1) &&
    regionCounts.every((count) => count === 1);

  return { ok: complete && errors.size === 0, errors };
}

function markGroup(type, index, errors) {
  forEachCell((row, col) => {
    if (state.cells[row][col] !== STAR) return;
    if (type === "row" && row === index) errors.add(getKey(row, col));
    if (type === "col" && col === index) errors.add(getKey(row, col));
    if (type === "region" && regionIndex(row, col) === index) errors.add(getKey(row, col));
  });
}

function getCandidates() {
  const candidates = new Set();
  forEachCell((row, col) => {
    if (state.cells[row][col] === STAR || state.cells[row][col] === BLOCK) return;
    if (rowHasStar(row) || colHasStar(col) || regionHasStar(regionIndex(row, col))) return;
    if (touchesStar(row, col)) return;
    candidates.add(getKey(row, col));
  });
  return candidates;
}

function groupHints(type, candidates) {
  const groups = [];
  for (let i = 0; i < SIZE; i += 1) {
    let alreadySolved = false;
    const cells = [];
    forEachCell((row, col) => {
      const key = getKey(row, col);
      const inGroup =
        (type === "row" && row === i) ||
        (type === "col" && col === i) ||
        (type === "region" && regionIndex(row, col) === i);
      if (!inGroup) return;
      if (state.cells[row][col] === STAR) alreadySolved = true;
      if (candidates.has(key)) cells.push(key);
    });
    if (!alreadySolved && cells.length) groups.push({ type, index: i, cells });
  }
  return groups;
}

function describeHintGroup(group) {
  if (group.type === "row") return t("groupRow", { index: group.index + 1 });
  if (group.type === "col") return t("groupCol", { index: group.index + 1 });
  return t("groupRegion", { label: REGION_LABELS[group.index] });
}

function touchesStar(row, col) {
  for (let rowDelta = -1; rowDelta <= 1; rowDelta += 1) {
    for (let colDelta = -1; colDelta <= 1; colDelta += 1) {
      if (rowDelta === 0 && colDelta === 0) continue;
      const nextRow = row + rowDelta;
      const nextCol = col + colDelta;
      if (!inside(nextRow, nextCol)) continue;
      if (state.cells[nextRow][nextCol] === STAR) return true;
    }
  }
  return false;
}

function rowHasStar(row) {
  return state.cells[row].includes(STAR);
}

function colHasStar(col) {
  return state.cells.some((row) => row[col] === STAR);
}

function regionHasStar(region) {
  let found = false;
  forEachCell((row, col) => {
    if (regionIndex(row, col) === region && state.cells[row][col] === STAR) {
      found = true;
    }
  });
  return found;
}

function regionIndex(row, col) {
  return state.puzzle.regions[row].charCodeAt(col) - 65;
}

function forEachCell(callback) {
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      callback(row, col);
    }
  }
}

function inside(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

function getKey(row, col) {
  return `${row}-${col}`;
}

function updateStartOverlay() {
  const shouldShow = !state.started && !state.solved;
  els.startOverlay.hidden = !shouldShow;
  els.startLabel.textContent =
    state.mode === "daily" ? t("startLabelDaily", { id: state.puzzle.id }) : t("startLabelPractice", { id: state.puzzle.id });
  els.startBtn.textContent = state.mode === "daily" ? t("startButtonDaily") : t("startButtonPractice");
  els.startBtn.disabled = !shouldShow;
}

function updateControls() {
  const playable = state.started && !state.solved;
  const nextPenalty = HINT_PENALTIES[state.hintCount];
  els.hintBtn.textContent = nextPenalty ? t("hintButton", { penalty: nextPenalty }) : t("noHintsLeft");
  els.hintBtn.disabled = !playable || !nextPenalty;
  els.checkBtn.disabled = !playable;
  els.shareBtn.disabled = !state.started && !state.solved;
}

function getBestTimeKey() {
  if (state.mode === "daily") {
    return `${storage.bestDailyPrefix}${getTodayKey()}`;
  }
  return storage.bestPractice;
}

function getBestTime() {
  return Number(localStorage.getItem(getBestTimeKey()) || "0");
}

function saveBestTime() {
  const best = getBestTime();
  if (!best || elapsed < best) {
    localStorage.setItem(getBestTimeKey(), String(elapsed));
    return true;
  }
  return false;
}

function updateStats() {
  const starTotal = state.cells.flat().filter((value) => value === STAR).length;
  const best = getBestTime();
  els.starCount.textContent = `${starTotal}/${SIZE}`;
  els.streakCount.textContent = localStorage.getItem(storage.streak) || "0";
  els.timer.textContent = formatTime(elapsed);
  els.bestTime.textContent = best ? formatTime(best) : "--:--";
  setModeText();
}

function setModeText() {
  els.puzzleMode.textContent = state.mode === "daily" ? t("modeDaily") : t("modePractice");
  els.todayLabel.textContent = state.mode === "daily" ? t("todayDaily", { id: state.puzzle.id }) : t("todayPractice", { id: state.puzzle.id });
  els.proofLabel.textContent = t("proofUnique");
}

function startTimer() {
  stopTimer();
  startedAt = Date.now() - elapsed * 1000;
  timerId = window.setInterval(updateElapsedFromClock, 250);
}

function updateElapsedFromClock() {
  if (!state.started || state.solved || !startedAt) return;
  elapsed = Math.floor((Date.now() - startedAt) / 1000);
  els.timer.textContent = formatTime(elapsed);
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function setStatus(message, tone) {
  els.status.textContent = message;
  els.status.className = `status ${tone || ""}`.trim();
}

function getPuzzleEventData(extra = {}) {
  return {
    mode: state.mode,
    puzzle_id: String(state.puzzle.id),
    proof: "unique_solution",
    language: LANGUAGE_KEY,
    stars: state.cells.flat().filter((value) => value === STAR).length,
    elapsed_seconds: elapsed,
    hint_count: state.hintCount,
    hint_penalty_seconds: state.hintPenalty,
    ...extra
  };
}

function trackEvent(name, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

function updateSharePreview() {
  els.sharePreview.textContent = buildShareText();
}

function buildShareText() {
  const title =
    state.mode === "daily" ? t("shareTitleDaily", { id: state.puzzle.id }) : t("shareTitlePractice", { id: state.puzzle.id });
  const solved = state.solved ? t("shareSolved", { time: formatTime(elapsed) }) : t("shareProgress");
  const stars = t("shareStars", { count: state.cells.flat().filter((value) => value === STAR).length, size: SIZE });
  const hints = t("shareHints", { count: state.hintCount, penalty: state.hintPenalty });
  return `${title}\n${solved}\n${stars}\n${hints}\n${getShareUrl()}`;
}

async function shareResult() {
  const text = buildShareText();
  trackEvent("share_clicked", getPuzzleEventData({ solved: state.solved }));
  if (navigator.share) {
    await navigator.share({ text }).catch(() => {});
    return;
  }
  await writeClipboard(text);
  setStatus(t("shareCopied"), "success");
}

async function copyPageLink() {
  await writeClipboard(getShareUrl());
  trackEvent("copy_link_clicked", getPuzzleEventData());
  setStatus(t("linkCopied"), "success");
}

function getShareUrl() {
  if (location.protocol === "file:") {
    return SITE_URL;
  }
  return location.href.split("#")[0];
}

async function writeClipboard(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

function renderDigits() {
  els.digits.innerHTML = "";
  for (let digit = 1; digit <= 9; digit += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "digit-toggle active";
    button.textContent = String(digit);
    button.setAttribute("aria-pressed", "true");
    button.addEventListener("click", () => {
      if (activeDigits.has(digit)) {
        activeDigits.delete(digit);
      } else {
        activeDigits.add(digit);
      }
      button.classList.toggle("active", activeDigits.has(digit));
      button.setAttribute("aria-pressed", activeDigits.has(digit) ? "true" : "false");
      updateCombinations();
    });
    els.digits.appendChild(button);
  }
}

function updateCombinations() {
  const sum = clamp(Number(els.sumInput.value || 0), 1, 90);
  const count = clamp(Number(els.cellsInput.value || 0), 1, 9);
  const allowRepeats = els.repeatInput.checked;
  const digits = [...activeDigits].sort((a, b) => a - b);
  const combos = findCombos(sum, count, digits, allowRepeats);

  els.comboCount.textContent = t("comboCount", {
    count: combos.length,
    label: combos.length === 1 ? t("comboSingular") : t("comboPlural")
  });
  els.comboResults.innerHTML = "";

  if (!combos.length) {
    const empty = document.createElement("span");
    empty.className = "combo-pill";
    empty.textContent = t("comboNone");
    els.comboResults.appendChild(empty);
    return;
  }

  combos.forEach((combo) => {
    const pill = document.createElement("span");
    pill.className = "combo-pill";
    pill.textContent = combo.join(" + ");
    els.comboResults.appendChild(pill);
  });
}

function findCombos(target, length, digits, allowRepeats) {
  const results = [];
  function walk(startIndex, combo, total) {
    if (combo.length === length) {
      if (total === target) results.push([...combo]);
      return;
    }
    if (total >= target) return;

    for (let i = startIndex; i < digits.length; i += 1) {
      const digit = digits[i];
      combo.push(digit);
      walk(allowRepeats ? i : i + 1, combo, total + digit);
      combo.pop();
    }
  }
  walk(0, [], 0);
  return results;
}

async function copyCombinations() {
  const text = [...els.comboResults.querySelectorAll(".combo-pill")]
    .map((node) => node.textContent)
    .join("\n");
  await writeClipboard(text);
  trackEvent("calculator_copy_clicked", {
    sum: Number(els.sumInput.value || 0),
    cells: Number(els.cellsInput.value || 0),
    allow_repeats: els.repeatInput.checked,
    active_digits: [...activeDigits].sort((a, b) => a - b).join(""),
    result_count: els.comboResults.querySelectorAll(".combo-pill").length
  });
  els.comboCount.textContent = t("comboCopied");
  window.setTimeout(updateCombinations, 900);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
