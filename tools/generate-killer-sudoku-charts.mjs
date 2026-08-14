import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const START = "<!-- KILLER_CHART_START -->";
const END = "<!-- KILLER_CHART_END -->";

const pages = [
  {
    file: "killer-sudoku-combination-calculator.html",
    before: "        <h2>How to Use the Calculator</h2>",
    title: "Killer Sudoku Combination Chart",
    intro: "Use this complete no-repeat chart for standard Killer Sudoku cages. Choose the cage size, then find its sum and possible digit sets.",
    cells: (count) => `${count}-Cell Cages`,
    sum: "Sum",
    combinations: "Possible combinations",
    cellsHeader: "Cells",
    reference: "Killer Sudoku Cage Sum Reference",
    minimum: "Minimum",
    maximum: "Maximum",
    forced: "Forced and Unique Cage Combinations",
    forcedText: "Extreme cage sums often leave only one digit set: 3 in 2 cells is 1 + 2, 17 in 2 cells is 8 + 9, 10 in 4 cells is 1 + 2 + 3 + 4, and 30 in 4 cells is 6 + 7 + 8 + 9.",
    rule45: "The 45 Rule",
    rule45Text: "Digits 1 through 9 total 45. In a complete row, column, or 3×3 box, known cage totals can therefore reveal the sum of the remaining cells."
  },
  {
    file: "de/killer-sudoku-kombinationen-rechner.html",
    before: "        <h2>So verwendest du den Rechner</h2>",
    title: "Killer-Sudoku-Kombinationstabelle",
    intro: "Diese vollständige Tabelle gilt für normale Killer-Sudoku-Käfige ohne Ziffernwiederholung. Wähle die Zellanzahl und suche dann Summe und mögliche Zifferngruppen.",
    cells: (count) => `Käfige mit ${count} Zellen`,
    sum: "Summe",
    combinations: "Mögliche Kombinationen",
    cellsHeader: "Zellen",
    reference: "Referenz für Käfigsummen",
    minimum: "Minimum",
    maximum: "Maximum",
    forced: "Erzwungene und eindeutige Käfigkombinationen",
    forcedText: "Extreme Summen lassen oft nur eine Zifferngruppe zu: 3 in 2 Zellen ist 1 + 2, 17 in 2 Zellen ist 8 + 9, 10 in 4 Zellen ist 1 + 2 + 3 + 4 und 30 in 4 Zellen ist 6 + 7 + 8 + 9.",
    rule45: "Die 45er-Regel",
    rule45Text: "Die Ziffern 1 bis 9 ergeben zusammen 45. In einer vollständigen Zeile, Spalte oder 3×3-Box lässt sich damit aus bekannten Käfigsummen die Summe der übrigen Zellen ableiten."
  },
  {
    file: "es/calculadora-combinaciones-sudoku-killer.html",
    before: "        <h2>Cómo usarla</h2>",
    title: "Tabla de combinaciones de Sudoku Killer",
    intro: "Esta tabla completa usa la regla estándar de Sudoku Killer sin dígitos repetidos dentro de una jaula. Elige el tamaño y busca la suma y sus combinaciones posibles.",
    cells: (count) => `Jaulas de ${count} celdas`,
    sum: "Suma",
    combinations: "Combinaciones posibles",
    cellsHeader: "Celdas",
    reference: "Referencia de sumas de jaula",
    minimum: "Mínimo",
    maximum: "Máximo",
    forced: "Combinaciones forzadas y únicas",
    forcedText: "Las sumas extremas suelen dejar un solo grupo: 3 en 2 celdas es 1 + 2, 17 en 2 celdas es 8 + 9, 10 en 4 celdas es 1 + 2 + 3 + 4 y 30 en 4 celdas es 6 + 7 + 8 + 9.",
    rule45: "La regla del 45",
    rule45Text: "Los dígitos del 1 al 9 suman 45. En una fila, columna o caja de 3×3 completa, las sumas conocidas permiten deducir el total de las celdas restantes."
  }
];

function combinations(length) {
  const groups = new Map();
  function walk(start, current) {
    if (current.length === length) {
      const sum = current.reduce((total, digit) => total + digit, 0);
      if (!groups.has(sum)) groups.set(sum, []);
      groups.get(sum).push(current.join("+"));
      return;
    }
    for (let digit = start; digit <= 9; digit += 1) {
      current.push(digit);
      walk(digit + 1, current);
      current.pop();
    }
  }
  walk(1, []);
  return [...groups.entries()].sort((first, second) => first[0] - second[0]);
}

function render(page) {
  const index = Array.from({ length: 8 }, (_, offset) => offset + 2)
    .map((count) => `<a href="#cage-${count}-cells">${page.cells(count)}</a>`).join("\n            ");
  const tables = Array.from({ length: 8 }, (_, offset) => offset + 2).map((count) => {
    const rows = combinations(count).map(([sum, combos]) => `                <tr><th scope="row">${sum}</th><td>${combos.join(", ")}</td></tr>`).join("\n");
    return `          <section class="cage-chart" aria-labelledby="cage-${count}-cells">
            <h3 id="cage-${count}-cells">${page.cells(count)}</h3>
            <div class="combination-table-wrap"><table class="combination-table">
              <thead><tr><th scope="col">${page.sum}</th><th scope="col">${page.combinations}</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table></div>
          </section>`;
  }).join("\n");
  const ranges = Array.from({ length: 8 }, (_, offset) => offset + 2).map((count) => {
    const low = Array.from({ length: count }, (_, index) => index + 1);
    const high = Array.from({ length: count }, (_, index) => 9 - index).sort((a, b) => a - b);
    return `              <tr><th scope="row">${count}</th><td>${low.join(" + ")} = ${low.reduce((sum, value) => sum + value, 0)}</td><td>${high.join(" + ")} = ${high.reduce((sum, value) => sum + value, 0)}</td></tr>`;
  }).join("\n");
  return `${START}
        <section class="combination-chart-section" aria-labelledby="killer-sudoku-combination-chart">
          <h2 id="killer-sudoku-combination-chart">${page.title}</h2>
          <p>${page.intro}</p>
          <nav class="chart-index" aria-label="${page.title}">
            ${index}
          </nav>
${tables}
          <h2>${page.reference}</h2>
          <div class="combination-table-wrap"><table class="combination-table cage-range-table">
            <thead><tr><th scope="col">${page.cellsHeader}</th><th scope="col">${page.minimum}</th><th scope="col">${page.maximum}</th></tr></thead>
            <tbody>
${ranges}
            </tbody>
          </table></div>
          <h3>${page.forced}</h3>
          <p>${page.forcedText}</p>
          <h3>${page.rule45}</h3>
          <p>${page.rule45Text}</p>
        </section>
${END}`;
}

for (const page of pages) {
  const file = path.join(ROOT, page.file);
  let html = fs.readFileSync(file, "utf8");
  const block = render(page);
  const existing = new RegExp(`${START}[\\s\\S]*?${END}`);
  if (existing.test(html)) html = html.replace(existing, block);
  else if (html.includes(page.before)) html = html.replace(page.before, `${block}\n\n${page.before}`);
  else throw new Error(`${page.file}: insertion point not found`);
  fs.writeFileSync(file, html, "utf8");
}

console.log("Generated static no-repeat Killer Sudoku charts for English, German, and Spanish pages.");
