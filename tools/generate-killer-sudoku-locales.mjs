import fs from "node:fs";
import { createHash } from "node:crypto";

const SITE = "https://dailylogiclab.com";
const SOURCE = "killer-sudoku-combination-calculator.html";
const OG_IMAGE = `${SITE}/og-killer-sudoku.png`;
const DATE = "2026-08-15";
const stylesVersion = createHash("sha256").update(fs.readFileSync("styles.css", "utf8").replaceAll("\r\n", "\n")).digest("hex").slice(0, 10);

const routes = {
  en: "/killer-sudoku-combination-calculator",
  de: "/de/killer-sudoku-kombinationen-rechner",
  es: "/es/calculadora-combinaciones-sudoku-killer",
  fr: "/fr/calculateur-combinaisons-killer-sudoku",
  ja: "/ja/killer-sudoku-combination-calculator",
  pt: "/pt-br/calculadora-combinacoes-killer-sudoku",
  zh: "/zh-cn/killer-sudoku-combination-calculator"
};

const languageMeta = {
  en: { lang: "en", hreflang: "en", label: "English" },
  de: { lang: "de", hreflang: "de", label: "Deutsch" },
  es: { lang: "es", hreflang: "es", label: "Español" },
  fr: { lang: "fr", hreflang: "fr", label: "Français" },
  ja: { lang: "ja", hreflang: "ja", label: "日本語" },
  pt: { lang: "pt-BR", hreflang: "pt-BR", label: "Português" },
  zh: { lang: "zh-CN", hreflang: "zh-CN", label: "简体中文" }
};

const pages = {
  fr: {
    out: "fr/calculateur-combinaisons-killer-sudoku.html",
    title: "Calculateur de combinaisons Killer Sudoku",
    description: "Calculez les combinaisons d'une cage Killer Sudoku selon sa somme et son nombre de cases, avec un tableau complet sans répétition.",
    ogTitle: "Calculateur Killer Sudoku et tableau des sommes",
    ogDescription: "Trouvez les chiffres possibles d'une cage et consultez les combinaisons sans répétition de 2 à 9 cases.",
    imageAlt: "Calculateur de combinaisons et grille Killer Sudoku",
    navAria: "Navigation principale", switchAria: "Changer de langue", footerAria: "Navigation de pied de page",
    nav: ["Utiliser le calculateur", "Jouer", "Star Battle"],
    eyebrow: "Outil Killer Sudoku", h1: "Calculateur de combinaisons Killer Sudoku",
    factsTitle: "Le calculateur en bref",
    facts: [["Fonction", "Liste les groupes de chiffres correspondant à la somme et au nombre de cases."], ["Réglages", "Choisissez la somme, le nombre de cases, les chiffres disponibles et les répétitions."], ["Règle standard", "Laissez les répétitions désactivées pour une cage Killer Sudoku classique."], ["Accès", "L'outil est gratuit, sans compte, et fonctionne dans le navigateur."]],
    intro: ["Entrez la somme de la cage et son nombre de cases pour obtenir les groupes de chiffres possibles. Désactivez ensuite les chiffres déjà interdits par la ligne, la colonne ou le bloc.", "Le calculateur convient aux cages Killer Sudoku sans répétition. L'option de répétition reste disponible pour les variantes, le Kakuro, le KenKen ou d'autres puzzles de sommes qui l'autorisent."],
    calculatorAria: "Calculateur de combinaisons Killer Sudoku", calculatorTitle: "Trouver les combinaisons d'une cage", calculatorHelp: "Commencez par l'indice de la cage, puis retirez les chiffres devenus impossibles dans la grille.",
    calculatorTips: ["Sans répétition pour le Killer Sudoku classique.", "Activez les répétitions uniquement si les règles du puzzle les permettent.", "Copiez la liste pour comparer les candidats dans vos notes."],
    labels: { sum: "Somme", cells: "Cases", repeats: "Autoriser les répétitions", digits: "Chiffres disponibles", copy: "Copier", copied: "Copié", one: "combinaison", many: "combinaisons", none: "Aucun résultat" },
    chart: { title: "Tableau des combinaisons Killer Sudoku", intro: "Tableau complet des cages sans répétition : choisissez le nombre de cases, puis la somme recherchée.", cage: (n) => `Cages de ${n} cases`, sum: "Somme", combos: "Combinaisons possibles", reference: "Plages de sommes des cages", cells: "Cases", min: "Minimum", max: "Maximum", forced: "Combinaisons forcées ou uniques", forcedText: "Les sommes extrêmes ne laissent souvent qu'un groupe de chiffres : 3 en 2 cases vaut 1 + 2, 17 vaut 8 + 9, 10 en 4 cases vaut 1 + 2 + 3 + 4 et 30 vaut 6 + 7 + 8 + 9.", rule45: "La règle de 45", rule45Text: "Les chiffres de 1 à 9 totalisent 45. Dans une ligne, une colonne ou un bloc 3×3 complet, les sommes connues permettent donc de calculer les cases restantes." },
    howTitle: "Comment utiliser le calculateur", how: ["Saisissez la somme de la cage.", "Indiquez le nombre de cases.", "Gardez les répétitions désactivées pour le Killer Sudoku standard.", "Retirez les chiffres exclus par la ligne, la colonne, le bloc ou la cage.", "Conservez uniquement les candidats compatibles avec la grille."],
    exampleTitle: "Exemple : 17 en 3 cases", example: ["Une cage de 3 cases totalisant 17 possède sept groupes sans répétition : 1 + 7 + 9, 2 + 6 + 9, 2 + 7 + 8, 3 + 5 + 9, 3 + 6 + 8, 4 + 5 + 8 et 4 + 6 + 7.", "Le calculateur fait l'arithmétique, mais la grille décide du bon groupe. Les contraintes de ligne, colonne et bloc éliminent les combinaisons qui ne peuvent pas être placées."],
    patternsTitle: "Cages fréquentes", table: ["Indice", "Combinaisons habituelles", "Pourquoi c'est utile"], clues: ["3 en 2 cases", "17 en 2 cases", "10 en 4 cases", "30 en 4 cases"], reasons: ["Les deux chiffres sont imposés.", "Une paire élevée qui aide dans les lignes et les blocs.", "Une cage basse qui exclut les grands chiffres.", "Une cage élevée qui exclut les petits chiffres."],
    variantsTitle: "Killer Sudoku, Kakuro et KenKen", variants: "Le Killer Sudoku combine les règles du Sudoku avec les sommes de cages, généralement sans répétition. Le Kakuro et le KenKen utilisent aussi des contraintes de somme, mais leurs règles varient. Vérifiez toujours si les doublons sont autorisés avant d'activer l'option.",
    faqTitle: "Questions fréquentes", faq: [["À quoi sert ce calculateur ?", "Il liste les groupes de chiffres compatibles avec une somme et un nombre de cases, puis permet d'écarter les chiffres indisponibles."], ["Faut-il autoriser les répétitions ?", "Non pour un Killer Sudoku standard. Activez-les seulement si la variante jouée les permet."], ["Pourquoi la somme maximale peut-elle dépasser 45 ?", "Cela concerne uniquement les variantes avec répétitions ; sans répétition, les chiffres de 1 à 9 totalisent 45."], ["Peut-il résoudre toute la grille ?", "Non. Il calcule les cages ; la résolution complète dépend encore des lignes, colonnes, blocs et placements."]],
    relatedTitle: "Autres outils de logique", related: "Vous pouvez aussi jouer à Star Battle et consulter son guide des règles. Les puzzles fonctionnent sans compte.",
    footer: ["À propos", "Contact", "Confidentialité", "Plan du site"]
  },
  ja: {
    out: "ja/killer-sudoku-combination-calculator.html",
    title: "キラー数独の組み合わせ計算機・ケージ合計表",
    description: "キラー数独のケージ合計とマス数から数字の組み合わせを計算。2～9マスの重複なし組み合わせ表も確認できます。",
    ogTitle: "キラー数独 組み合わせ計算機",
    ogDescription: "ケージの合計とマス数から候補数字を絞り込める無料ツール。",
    imageAlt: "キラー数独のケージと組み合わせ計算機",
    navAria: "メインナビゲーション", switchAria: "言語を切り替える", footerAria: "フッターナビゲーション",
    nav: ["計算機を使う", "遊ぶ", "Star Battle"],
    eyebrow: "キラー数独 補助ツール", h1: "キラー数独の組み合わせ計算機",
    factsTitle: "この計算機でできること",
    facts: [["目的", "ケージの合計とマス数に合う数字の組み合わせを一覧表示します。"], ["入力", "合計、マス数、使用可能な数字、重複の可否を指定できます。"], ["通常のルール", "一般的なキラー数独では数字の重複をオフにします。"], ["利用方法", "登録不要で、ブラウザ上ですべて無料で使えます。"]],
    intro: ["ケージの合計とマス数を入力すると、条件に合う数字の組み合わせを一覧できます。同じ行・列・ブロックですでに使えない数字を外すと、候補をさらに絞れます。", "通常のキラー数独ではケージ内の数字は重複しません。重複を許可する設定は、Kakuro、KenKen、独自ルールの合計パズル向けです。"],
    calculatorAria: "キラー数独の組み合わせ計算機", calculatorTitle: "ケージの候補を探す", calculatorHelp: "まずケージの合計とマス数を入れ、盤面で使えない数字をボタンから外してください。",
    calculatorTips: ["通常のキラー数独では重複を許可しません。", "問題のルールに明記されている場合だけ重複をオンにします。", "候補をメモに移したいときはコピーできます。"],
    labels: { sum: "合計", cells: "マス数", repeats: "数字の重複を許可", digits: "使用可能な数字", copy: "コピー", copied: "コピーしました", one: "通り", many: "通り", none: "該当なし" },
    chart: { title: "キラー数独 組み合わせ表", intro: "通常ルール向けの重複なし一覧です。ケージのマス数を選び、合計から候補を確認してください。", cage: (n) => `${n}マスのケージ`, sum: "合計", combos: "組み合わせ", reference: "ケージ合計の範囲", cells: "マス数", min: "最小", max: "最大", forced: "一意に決まるケージ", forcedText: "端の合計は数字の組が一つに決まることがあります。2マスの3は1 + 2、17は8 + 9、4マスの10は1 + 2 + 3 + 4、30は6 + 7 + 8 + 9です。", rule45: "45の法則", rule45Text: "1から9までの合計は45です。行・列・3×3ブロック内のケージ合計が分かれば、残りのマスの合計を逆算できます。" },
    howTitle: "計算機の使い方", how: ["ケージに書かれた合計を入力します。", "ケージのマス数を入力します。", "通常のキラー数独では重複をオフにします。", "行・列・ブロックですでに除外できる数字を外します。", "残った組み合わせを盤面の候補と照合します。"],
    exampleTitle: "例：3マスで合計17", example: ["3マスで合計17、重複なしの場合、基本の組み合わせは7通りです：1 + 7 + 9、2 + 6 + 9、2 + 7 + 8、3 + 5 + 9、3 + 6 + 8、4 + 5 + 8、4 + 6 + 7。", "計算機は足し算を整理する道具です。実際に置ける組み合わせは、行・列・ブロックとケージの位置関係から判断します。"],
    patternsTitle: "よく使うケージ", table: ["条件", "重複なしの候補", "使いどころ"], clues: ["2マスで合計3", "2マスで合計17", "4マスで合計10", "4マスで合計30"], reasons: ["1と2の組が確定します。", "8と9の高い数字の組です。", "大きい数字を除外できる低い4マスケージです。", "小さい数字を除外できる高い4マスケージです。"],
    variantsTitle: "キラー数独・Kakuro・KenKen", variants: "キラー数独は数独の配置ルールとケージ合計を組み合わせ、通常はケージ内で同じ数字を使いません。KakuroやKenKenは似た計算を使いますが、重複の扱いは問題ごとに異なるため、必ずルールを確認してください。",
    faqTitle: "よくある質問", faq: [["組み合わせ計算機は何をするものですか？", "合計とマス数に合う数字の組を表示し、使用できない数字を除外できます。"], ["数字の重複を許可しますか？", "通常のキラー数独では許可しません。重複可と明記された別ルールの問題だけオンにします。"], ["最大合計が45を超えるのはなぜですか？", "重複を許可する変則ルールに対応するためです。重複なしなら1～9の合計は45です。"], ["盤面全体を解けますか？", "いいえ。ケージ候補を計算する道具なので、行・列・ブロックの数独ロジックは自分で適用します。"]],
    relatedTitle: "関連する論理パズル", related: "Daily Logic LabではStar Battleの毎日問題と練習問題も遊べます。ルールガイドも日本語で確認できます。",
    footer: ["このサイト", "お問い合わせ", "プライバシー", "サイトマップ"]
  },
  pt: {
    out: "pt-br/calculadora-combinacoes-killer-sudoku.html",
    title: "Calculadora de combinações de Killer Sudoku",
    description: "Calcule combinações de gaiolas de Killer Sudoku por soma e quantidade de casas, com tabela completa sem repetição de 2 a 9 casas.",
    ogTitle: "Calculadora Killer Sudoku e tabela de somas",
    ogDescription: "Encontre combinações de gaiolas e filtre os dígitos disponíveis direto no navegador.",
    imageAlt: "Calculadora e gaiola de Killer Sudoku",
    navAria: "Navegação principal", switchAria: "Trocar idioma", footerAria: "Navegação do rodapé",
    nav: ["Usar calculadora", "Jogar", "Star Battle"],
    eyebrow: "Ajuda para Killer Sudoku", h1: "Calculadora de combinações de Killer Sudoku",
    factsTitle: "Resumo da calculadora",
    facts: [["Função", "Lista conjuntos de dígitos que batem com a soma e a quantidade de casas."], ["Entradas", "Use soma, casas, dígitos disponíveis e a opção de repetição."], ["Uso padrão", "Deixe a repetição desligada nas gaiolas comuns de Killer Sudoku."], ["Acesso", "A ferramenta é grátis, sem cadastro e funciona no navegador."]],
    intro: ["Informe a soma da gaiola e a quantidade de casas para ver todas as combinações possíveis. Depois, desligue os dígitos que já foram descartados pela linha, coluna ou bloco.", "A configuração padrão segue o Killer Sudoku sem repetição dentro da gaiola. A opção de repetição serve para variantes, Kakuro, KenKen e outros puzzles que permitam números iguais."],
    calculatorAria: "Calculadora de combinações de Killer Sudoku", calculatorTitle: "Encontrar combinações da gaiola", calculatorHelp: "Comece pela soma e pelo número de casas; depois remova os dígitos que a grade já tornou impossíveis.",
    calculatorTips: ["Não permita repetição no Killer Sudoku comum.", "Ative repetição somente quando a regra do puzzle autorizar.", "Copie o resultado para comparar candidatos nas suas anotações."],
    labels: { sum: "Soma", cells: "Casas", repeats: "Permitir repetição", digits: "Dígitos disponíveis", copy: "Copiar", copied: "Copiado", one: "combinação", many: "combinações", none: "Nenhuma combinação" },
    chart: { title: "Tabela de combinações de Killer Sudoku", intro: "Tabela completa sem repetição para gaiolas padrão. Escolha a quantidade de casas e procure a soma.", cage: (n) => `Gaiolas de ${n} casas`, sum: "Soma", combos: "Combinações possíveis", reference: "Faixas de soma das gaiolas", cells: "Casas", min: "Mínimo", max: "Máximo", forced: "Combinações forçadas ou únicas", forcedText: "Somas extremas costumam deixar um único conjunto: 3 em 2 casas é 1 + 2, 17 é 8 + 9, 10 em 4 casas é 1 + 2 + 3 + 4 e 30 é 6 + 7 + 8 + 9.", rule45: "Regra dos 45", rule45Text: "Os dígitos de 1 a 9 somam 45. Em uma linha, coluna ou bloco 3×3 completo, as somas conhecidas ajudam a descobrir o total das casas restantes." },
    howTitle: "Como usar a calculadora", how: ["Digite a soma da gaiola.", "Informe quantas casas ela possui.", "Mantenha a repetição desligada no Killer Sudoku padrão.", "Desative dígitos excluídos pela linha, coluna, bloco ou gaiola.", "Compare as combinações restantes com as posições possíveis na grade."],
    exampleTitle: "Exemplo: 17 em 3 casas", example: ["Uma gaiola de 3 casas com soma 17 e sem repetição tem sete combinações básicas: 1 + 7 + 9, 2 + 6 + 9, 2 + 7 + 8, 3 + 5 + 9, 3 + 6 + 8, 4 + 5 + 8 e 4 + 6 + 7.", "A calculadora resolve a parte aritmética. A escolha final ainda depende das restrições de linha, coluna, bloco e da posição de cada casa na gaiola."],
    patternsTitle: "Gaiolas comuns", table: ["Pista", "Combinações sem repetição", "Como ajuda"], clues: ["3 em 2 casas", "17 em 2 casas", "10 em 4 casas", "30 em 4 casas"], reasons: ["Os dois dígitos ficam definidos.", "Par alto útil para eliminar candidatos em linhas e blocos.", "Gaiola baixa que exclui dígitos maiores.", "Gaiola alta que exclui dígitos menores."],
    variantsTitle: "Killer Sudoku, Kakuro e KenKen", variants: "Killer Sudoku combina as regras do Sudoku com somas de gaiolas e normalmente não repete dígitos. Kakuro e KenKen também usam combinações, mas podem ter regras diferentes. Confira o enunciado antes de permitir repetição.",
    faqTitle: "Perguntas frequentes", faq: [["Para que serve a calculadora?", "Ela lista conjuntos de dígitos compatíveis com uma soma e quantidade de casas, permitindo retirar números indisponíveis."], ["Devo permitir repetição?", "Não no Killer Sudoku padrão. Ative apenas em variantes que autorizem dígitos repetidos."], ["Por que a soma máxima pode passar de 45?", "Isso atende variantes com repetição. Sem repetição, os dígitos de 1 a 9 somam 45."], ["Ela resolve a grade inteira?", "Não. A ferramenta calcula as gaiolas; linhas, colunas, blocos e posições ainda exigem lógica de Sudoku."]],
    relatedTitle: "Outros puzzles de lógica", related: "Você também pode jogar Star Battle e consultar o guia de regras em português. Não é preciso criar conta.",
    footer: ["Sobre", "Contato", "Privacidade", "Mapa do site"]
  },
  zh: {
    out: "zh-cn/killer-sudoku-combination-calculator.html",
    title: "杀手数独组合计算器与笼和表",
    description: "根据杀手数独笼的总和与格数计算数字组合，并查看2至9格、不重复数字的完整组合表。",
    ogTitle: "杀手数独组合计算器",
    ogDescription: "输入笼和与格数，快速筛选可用数字组合。",
    imageAlt: "杀手数独笼和组合计算器",
    navAria: "主导航", switchAria: "切换语言", footerAria: "页脚导航",
    nav: ["使用计算器", "开始游戏", "Star Battle"],
    eyebrow: "杀手数独辅助工具", h1: "杀手数独组合计算器",
    factsTitle: "计算器简介",
    facts: [["用途", "按笼和与格数列出符合条件的数字组合。"], ["输入项", "可以设置总和、格数、可用数字以及是否允许重复。"], ["标准规则", "普通杀手数独的同一笼内不重复数字。"], ["使用方式", "工具免费、无需注册，直接在浏览器中运行。"]],
    intro: ["输入笼内总和与格数，计算器会列出所有可能的数字组合。再关闭同行、同列或同宫中已经不能使用的数字，就能进一步缩小范围。", "默认设置适用于笼内数字不重复的标准杀手数独。允许重复选项则适合明确允许重复的变体、Kakuro、KenKen或其他和数谜题。"],
    calculatorAria: "杀手数独组合计算器", calculatorTitle: "查找笼内组合", calculatorHelp: "先填写笼和与格数，再把棋盘上已经排除的数字关闭。",
    calculatorTips: ["标准杀手数独请保持数字不重复。", "只有题目规则明确允许时才开启重复。", "需要对照候选时，可以复制计算结果。"],
    labels: { sum: "总和", cells: "格数", repeats: "允许重复数字", digits: "可用数字", copy: "复制", copied: "已复制", one: "种组合", many: "种组合", none: "没有符合条件的组合" },
    chart: { title: "杀手数独组合表", intro: "以下是标准规则下、不重复数字的完整组合表。先选笼的格数，再查找对应总和。", cage: (n) => `${n}格笼`, sum: "总和", combos: "可能组合", reference: "笼和范围速查", cells: "格数", min: "最小值", max: "最大值", forced: "唯一或强制组合", forcedText: "接近极值的笼和往往只有一组数字：2格和为3只能是1 + 2，和为17只能是8 + 9；4格和为10只能是1 + 2 + 3 + 4，和为30只能是6 + 7 + 8 + 9。", rule45: "45法则", rule45Text: "1到9的总和是45。完整的一行、一列或一个3×3宫中，已知笼和可以帮助反推出剩余格子的总和。" },
    howTitle: "如何使用计算器", how: ["输入笼内标注的总和。", "输入这个笼包含的格数。", "标准杀手数独保持重复选项关闭。", "关闭同行、同列、同宫或同笼中已经排除的数字。", "把剩余组合与棋盘上的实际位置继续交叉排除。"],
    exampleTitle: "示例：3格和为17", example: ["3格笼和为17且数字不重复时，共有7种基础组合：1 + 7 + 9、2 + 6 + 9、2 + 7 + 8、3 + 5 + 9、3 + 6 + 8、4 + 5 + 8、4 + 6 + 7。", "计算器负责整理加法，真正的解题仍依赖数独规则。哪一组能放进笼里，要继续结合行、列、宫和每个格子的位置判断。"],
    patternsTitle: "常见笼型", table: ["条件", "常见不重复组合", "作用"], clues: ["2格和为3", "2格和为17", "4格和为10", "4格和为30"], reasons: ["两个数字作为一组被确定。", "高位数组合，便于在行与宫中排除。", "低和四格笼，可以排除较大数字。", "高和四格笼，可以排除较小数字。"],
    variantsTitle: "杀手数独、Kakuro与KenKen", variants: "杀手数独把数独的行列宫规则与笼和结合起来，通常不允许同笼重复数字。Kakuro和KenKen也会用到数字组合，但是否允许重复取决于具体规则，开启选项前请先核对题目说明。",
    faqTitle: "常见问题", faq: [["组合计算器有什么用？", "它按总和与格数列出数字组合，并允许关闭已经不能使用的数字。"], ["应该允许重复数字吗？", "标准杀手数独不允许。只有变体规则明确说明时才开启。"], ["为什么最大总和会超过45？", "这是为允许重复数字的变体准备的；不重复时1到9总和就是45。"], ["它能解完整盘面吗？", "不能。它只计算笼内组合，完整解题仍要使用行、列、宫和位置关系。"]],
    relatedTitle: "相关逻辑工具", related: "Daily Logic Lab还提供Star Battle每日题、练习题和中文规则说明，全部无需登录。",
    footer: ["关于", "联系", "隐私", "站点地图"]
  }
};

const alternateLinks = () => Object.entries(routes).map(([key, route]) => `    <link rel="alternate" hreflang="${languageMeta[key].hreflang}" href="${SITE}${route}">`).concat(`    <link rel="alternate" hreflang="x-default" href="${SITE}${routes.en}">`).join("\n");
const languageMenu = (current) => Object.entries(routes).map(([key, route]) => `          <a href="${route}" lang="${languageMeta[key].lang}" hreflang="${languageMeta[key].hreflang}"${key === current ? ' aria-current="page"' : ""}>${languageMeta[key].label}</a>`).join("\n");
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function localizedChart(copy) {
  const source = fs.readFileSync(SOURCE, "utf8");
  let chart = source.match(/<!-- KILLER_CHART_START -->([\s\S]*?)<!-- KILLER_CHART_END -->/)[1];
  chart = chart
    .replaceAll("Killer Sudoku Combination Chart", copy.title)
    .replace("Use this complete no-repeat chart for standard Killer Sudoku cages. Choose the cage size, then find its sum and possible digit sets.", copy.intro)
    .replaceAll("<th scope=\"col\">Sum</th><th scope=\"col\">Possible combinations</th>", `<th scope="col">${copy.sum}</th><th scope="col">${copy.combos}</th>`)
    .replace("Killer Sudoku Cage Sum Reference", copy.reference)
    .replace("<th scope=\"col\">Cells</th><th scope=\"col\">Minimum</th><th scope=\"col\">Maximum</th>", `<th scope="col">${copy.cells}</th><th scope="col">${copy.min}</th><th scope="col">${copy.max}</th>`)
    .replace("Forced and Unique Cage Combinations", copy.forced)
    .replace("Extreme cage sums often leave only one digit set: 3 in 2 cells is 1 + 2, 17 in 2 cells is 8 + 9, 10 in 4 cells is 1 + 2 + 3 + 4, and 30 in 4 cells is 6 + 7 + 8 + 9.", copy.forcedText)
    .replace("The 45 Rule", copy.rule45)
    .replace("Digits 1 through 9 total 45. In a complete row, column, or 3×3 box, known cage totals can therefore reveal the sum of the remaining cells.", copy.rule45Text);
  for (let size = 2; size <= 9; size += 1) chart = chart.replaceAll(`${size}-Cell Cages`, copy.cage(size));
  return chart;
}

function schema(page, key) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE}/#organization`, name: "Daily Logic Lab", url: SITE, logo: `${SITE}/icon-512.png`, sameAs: ["https://github.com/DennyHo0917/dailylogiclab"] },
      { "@type": "SoftwareApplication", name: page.h1, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", isAccessibleForFree: true, inLanguage: languageMeta[key].lang, author: { "@id": `${SITE}/#organization` }, publisher: { "@id": `${SITE}/#organization` }, image: OG_IMAGE, url: `${SITE}${routes[key]}`, description: page.description, datePublished: "2026-06-18", dateModified: DATE, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      { "@type": "FAQPage", inLanguage: languageMeta[key].lang, mainEntity: page.faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) }
    ]
  }, null, 8);
}

function render(page, key) {
  const meta = languageMeta[key];
  const facts = page.facts.map(([term, detail]) => `<div><dt>${esc(term)}</dt><dd>${esc(detail)}</dd></div>`).join("\n            ");
  const tips = page.calculatorTips.map((item) => `<li>${esc(item)}</li>`).join("\n              ");
  const how = page.how.map((item) => `<li>${esc(item)}</li>`).join("\n          ");
  const faq = page.faq.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("\n          ");
  const patterns = [["1 + 2"], ["8 + 9"], ["1 + 2 + 3 + 4"], ["6 + 7 + 8 + 9"]].map(([combo], index) => `<tr><td>${esc(page.clues[index])}</td><td>${combo}</td><td>${esc(page.reasons[index])}</td></tr>`).join("\n            ");
  const asset = key === "en" ? "./" : "../";
  const home = key === "en" ? "/" : `/${({ pt: "pt-br", zh: "zh-cn" })[key] || key}/`;
  const aboutBase = home === "/" ? "" : home.slice(0, -1);
  return `<!doctype html>
<html lang="${meta.lang}">
  <head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6NY29HPM34"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-6NY29HPM34');</script>
    <title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}"><meta name="robots" content="index, follow, max-image-preview:large"><meta name="theme-color" content="#245c53">
    <link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
    <link rel="canonical" href="${SITE}${routes[key]}">
${alternateLinks()}
    <meta property="og:title" content="${esc(page.ogTitle)}"><meta property="og:description" content="${esc(page.ogDescription)}"><meta property="og:type" content="website"><meta property="og:url" content="${SITE}${routes[key]}"><meta property="og:image" content="${OG_IMAGE}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(page.imageAlt)}">
    <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(page.ogTitle)}"><meta name="twitter:description" content="${esc(page.ogDescription)}"><meta name="twitter:image" content="${OG_IMAGE}"><meta name="twitter:image:alt" content="${esc(page.imageAlt)}">
    <link rel="stylesheet" href="${asset}styles.css?v=${stylesVersion}"><script type="application/ld+json">${schema(page, key)}</script>
  </head>
  <body>
    <header class="topbar"><a class="brand" href="${home}#play"><span class="brand-mark">DL</span><span>Daily Logic Lab</span></a>
      <nav class="nav" aria-label="${esc(page.navAria)}"><a href="#calculator">${esc(page.nav[0])}</a><a href="${home}#play">${esc(page.nav[1])}</a><a href="${home}star-battle">${esc(page.nav[2])}</a></nav>
      <details class="language-switcher"><summary aria-label="${esc(page.switchAria)}">${meta.label}</summary><div class="language-menu">
${languageMenu(key)}
        </div></details>
    </header>
    <main class="content-page"><article class="section-shell content-card">
      <p class="eyebrow">${esc(page.eyebrow)}</p><h1>${esc(page.h1)}</h1>
      <section class="answer-summary"><p class="eyebrow">${esc({ fr: "En bref", ja: "要点", pt: "Resumo", zh: "快速了解" }[key])}</p><h2>${esc(page.factsTitle)}</h2><dl class="facts-list">${facts}</dl></section>
      ${page.intro.map((text) => `<p>${esc(text)}</p>`).join("\n      ")}
      <section id="calculator" class="tool-layout content-tool" aria-label="${esc(page.calculatorAria)}"><div><h2>${esc(page.calculatorTitle)}</h2><p>${esc(page.calculatorHelp)}</p><ul>${tips}</ul></div>
        <div class="calculator-panel"><form id="pageComboForm" class="combo-form"><label><span>${esc(page.labels.sum)}</span><input id="pageSumInput" type="number" min="1" max="90" value="17" inputmode="numeric"></label><label><span>${esc(page.labels.cells)}</span><input id="pageCellsInput" type="number" min="1" max="9" value="3" inputmode="numeric"></label><label class="check-label"><input id="pageRepeatInput" type="checkbox"><span>${esc(page.labels.repeats)}</span></label></form>
          <div class="digits" id="pageDigits" aria-label="${esc(page.labels.digits)}"></div><div class="result-head"><strong id="pageComboCount">0 ${esc(page.labels.many)}</strong><button id="pageCopyCombosBtn" type="button">${esc(page.labels.copy)}</button></div><div id="pageComboResults" class="combo-results" aria-live="polite"></div></div>
      </section>
${localizedChart(page.chart)}
      <h2>${esc(page.howTitle)}</h2><ol>${how}</ol>
      <h2>${esc(page.exampleTitle)}</h2>${page.example.map((text) => `<p>${esc(text)}</p>`).join("\n      ")}
      <h2>${esc(page.patternsTitle)}</h2><table class="example-table"><thead><tr>${page.table.map((item) => `<th>${esc(item)}</th>`).join("")}</tr></thead><tbody>${patterns}</tbody></table>
      <h2>${esc(page.variantsTitle)}</h2><p>${esc(page.variants)}</p>
      <h2>${esc(page.faqTitle)}</h2><div class="faq-list">${faq}</div>
      <h2>${esc(page.relatedTitle)}</h2><p>${esc(page.related)} <a href="${home}#play">Star Battle</a> · <a href="${home}star-battle">${esc(page.nav[2])}</a></p>
    </article></main>
    <footer class="site-footer"><div class="section-shell"><span>Daily Logic Lab</span><nav class="footer-links" aria-label="${esc(page.footerAria)}"><a href="${aboutBase}/about">${esc(page.footer[0])}</a><a href="${aboutBase}/contact">${esc(page.footer[1])}</a><a href="${aboutBase}/privacy-policy">${esc(page.footer[2])}</a><a href="/sitemap.xml">${esc(page.footer[3])}</a></nav></div></footer>
    <script>(()=>{const activeDigits=new Set([1,2,3,4,5,6,7,8,9]),sumInput=document.querySelector('#pageSumInput'),cellsInput=document.querySelector('#pageCellsInput'),repeatInput=document.querySelector('#pageRepeatInput'),digits=document.querySelector('#pageDigits'),comboCount=document.querySelector('#pageComboCount'),comboResults=document.querySelector('#pageComboResults'),copyButton=document.querySelector('#pageCopyCombosBtn');for(let digit=1;digit<=9;digit+=1){const button=document.createElement('button');button.type='button';button.className='digit-toggle active';button.textContent=String(digit);button.setAttribute('aria-pressed','true');button.addEventListener('click',()=>{activeDigits.has(digit)?activeDigits.delete(digit):activeDigits.add(digit);button.classList.toggle('active',activeDigits.has(digit));button.setAttribute('aria-pressed',activeDigits.has(digit)?'true':'false');updateCombinations()});digits.appendChild(button)}document.querySelector('#pageComboForm').addEventListener('input',updateCombinations);copyButton.addEventListener('click',async()=>{const text=[...comboResults.querySelectorAll('.combo-pill')].map(node=>node.textContent).join('\\n');if(navigator.clipboard){await navigator.clipboard.writeText(text);comboCount.textContent=${JSON.stringify(page.labels.copied)};window.setTimeout(updateCombinations,900)}});updateCombinations();function updateCombinations(){const sum=clamp(Number(sumInput.value||0),1,90),count=clamp(Number(cellsInput.value||0),1,9),combos=findCombos(sum,count,[...activeDigits].sort((a,b)=>a-b),repeatInput.checked);comboCount.textContent=combos.length+' '+(combos.length===1?${JSON.stringify(page.labels.one)}:${JSON.stringify(page.labels.many)});comboResults.innerHTML='';if(!combos.length){appendPill(${JSON.stringify(page.labels.none)});return}combos.forEach(combo=>appendPill(combo.join(' + ')))}function appendPill(text){const pill=document.createElement('span');pill.className='combo-pill';pill.textContent=text;comboResults.appendChild(pill)}function findCombos(target,length,digitList,allowRepeats){const results=[];function walk(startIndex,combo,total){if(combo.length===length){if(total===target)results.push([...combo]);return}if(total>=target)return;for(let i=startIndex;i<digitList.length;i+=1){const digit=digitList[i];combo.push(digit);walk(allowRepeats?i:i+1,combo,total+digit);combo.pop()}}walk(0,[],0);return results}function clamp(value,min,max){return Math.min(max,Math.max(min,value))}})();</script>
  </body>
</html>\n`;
}

function refreshExisting(file, current) {
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/    <link rel="alternate" hreflang="en"[\s\S]*?    <link rel="alternate" hreflang="x-default"[^\n]*\n/, `${alternateLinks()}\n`);
  html = html.replace(/        <div class="language-menu">[\s\S]*?        <\/div>/, `        <div class="language-menu">\n${languageMenu(current)}\n        </div>`);
  html = html.replaceAll(`${SITE}/og-image.png`, OG_IMAGE).replaceAll("Daily Logic Lab Star Battle puzzle board", "Killer Sudoku cage combination calculator");
  html = html.replaceAll('dateModified": "2026-08-14"', `dateModified": "${DATE}"`);
  fs.writeFileSync(file, html);
}

refreshExisting(SOURCE, "en");
refreshExisting("de/killer-sudoku-kombinationen-rechner.html", "de");
refreshExisting("es/calculadora-combinaciones-sudoku-killer.html", "es");
for (const [key, page] of Object.entries(pages)) {
  fs.mkdirSync(page.out.slice(0, page.out.lastIndexOf("/")), { recursive: true });
  fs.writeFileSync(page.out, render(page, key));
}

console.log("Killer Sudoku pages synchronized for 7 languages");
