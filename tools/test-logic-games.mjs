import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const games = require("../logic-games-core.js");
const difficulties = ["easy", "medium", "hard"];
const seedCount = Number(process.env.DLL_SEEDS || 1000);

function snapshot(puzzle) {
  return JSON.stringify({
    ...puzzle,
    solution: puzzle.solution instanceof Map ? [...puzzle.solution.entries()] : puzzle.solution instanceof Set ? [...puzzle.solution].sort() : puzzle.solution,
    solutionTents: puzzle.solutionTents
  });
}

function fingerprint(game, puzzle) {
  if (game === "tents-and-trees") return JSON.stringify([puzzle.trees, puzzle.rowClues, puzzle.colClues]);
  if (game === "hashi") return JSON.stringify([puzzle.islands, puzzle.clues]);
  if (game === "slitherlink") return JSON.stringify([...puzzle.solution].sort());
  return puzzle.solution.map((row) => row.map(Number).join("")).join("/");
}

function verify(game, puzzle) {
  assert.equal(puzzle.unique, true, `${game} must be unique`);
  if (game === "tents-and-trees") {
    assert.equal(games.solveTents(puzzle, 2).length, 1);
    assert.equal(games.validateTents(puzzle, new Set(puzzle.solutionTents.map(([row, col]) => `${row}:${col}`))).completed, true);
  } else if (game === "hashi") {
    assert.equal(games.solveHashi(puzzle, 2).length, 1);
    assert.equal(games.validateHashi(puzzle, puzzle.solution).completed, true);
  } else if (game === "slitherlink") {
    assert.equal(games.solveSlitherlink(puzzle, 2).length, 1);
    assert.equal(games.singleSlitherLoop(puzzle.solution), true);
    assert.equal(games.validateSlitherlink(puzzle, new Map([...puzzle.solution].map((key) => [key, 1]))).completed, true);
  } else {
    assert.equal(games.solveNonogram(puzzle, 2).length, 1);
    const marks = new Map();
    puzzle.solution.forEach((row, rowIndex) => row.forEach((filled, colIndex) => marks.set(`${rowIndex}:${colIndex}`, filled ? 1 : 2)));
    assert.equal(games.validateNonogram(puzzle, marks).completed, true);
  }
}

for (const game of games.GAME_ORDER) {
  const fingerprints = new Set();
  let elapsed = 0;
  let maximum = 0;
  for (let index = 0; index < seedCount; index += 1) {
    const difficulty = difficulties[index % difficulties.length];
    const seed = games.hashString(`${game}-${difficulty}-${index}`);
    const started = performance.now();
    const puzzle = games.generatePuzzle(game, seed, difficulty);
    const duration = performance.now() - started;
    elapsed += duration;
    maximum = Math.max(maximum, duration);
    verify(game, puzzle);
    if (index < 100) fingerprints.add(fingerprint(game, puzzle));
  }
  assert.ok(fingerprints.size >= 85, `${game} diversity too low: ${fingerprints.size}/100`);
  for (const difficulty of difficulties) {
    const dailySeed = games.hashString(`daily-${game}-2026-08-11-${difficulty}`);
    assert.equal(snapshot(games.generatePuzzle(game, dailySeed, difficulty)), snapshot(games.generatePuzzle(game, dailySeed, difficulty)), `${game}/${difficulty} daily is not deterministic`);
    const nextDay = games.generatePuzzle(game, games.hashString(`daily-${game}-2026-08-12-${difficulty}`), difficulty);
    assert.notEqual(fingerprint(game, games.generatePuzzle(game, dailySeed, difficulty)), fingerprint(game, nextDay), `${game}/${difficulty} adjacent daily seeds repeated`);
  }
  console.log(`${game}: ${seedCount} unique puzzles passed; diversity ${fingerprints.size}/100; avg ${(elapsed / seedCount).toFixed(1)}ms; max ${maximum.toFixed(1)}ms`);
}
