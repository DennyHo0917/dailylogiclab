import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const games = require("../logic-games-core.js");
const difficulties = ["easy", "medium", "hard"];
const seedCount = Number(process.env.DLL_SEEDS || 1000);
const limits = { average: 100, p95: 300, maximum: 1500 };

assert.equal(games.nextDailyStreak("2026-08-15", 3, "2026-08-15"), 3);
assert.equal(games.nextDailyStreak("2026-08-14", 3, "2026-08-15"), 4);
assert.equal(games.nextDailyStreak("2026-07-31", 3, "2026-08-01"), 4);
assert.equal(games.nextDailyStreak("2025-12-31", 3, "2026-01-01"), 4);
assert.equal(games.nextDailyStreak("2026-08-13", 3, "2026-08-15"), 1);
assert.equal(games.nextDailyStreak("invalid", "invalid", "2026-08-15"), 1);
assert.equal(games.nextDailyStreak("2026-08-16", 8, "2026-08-15"), 1);
const restoredProgress = games.normalizeProgress({
  version: 1, game: "hashi", mode: "practice", difficulty: "medium", seed: 123,
  elapsed: 92.8, started: true, bridges: [["0-1", 2]], hintCount: 0
}, { game: "hashi", mode: "practice", difficulty: "medium", today: "2026-08-15" });
assert.equal(restoredProgress.elapsed, 92);
assert.equal(restoredProgress.seed, 123);
assert.equal(games.normalizeProgress({ ...restoredProgress, mode: "daily", date: "2026-08-14" }, { game: "hashi", mode: "daily", difficulty: "medium", today: "2026-08-15" }), null);
assert.equal("DIFFICULTIES" in games, false, "unused DIFFICULTIES export must be removed");

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
  if (game === "slitherlink") return JSON.stringify(puzzle.clues);
  return JSON.stringify([puzzle.rowClues, puzzle.colClues]);
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
    puzzle.solution.forEach((row, rowIndex) => row.forEach((filled, colIndex) => { if (filled) marks.set(`${rowIndex}:${colIndex}`, 1); }));
    assert.equal(games.validateNonogram(puzzle, marks).completed, true);
  }
}

function percentile(values, percentage) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(sorted.length * percentage) - 1];
}

function validatorRegressionTests() {
  const tentsPuzzle = {
    size: 5,
    trees: [[2, 1], [4, 3]],
    rowClues: [0, 0, 1, 0, 1],
    colClues: [1, 0, 1, 0, 0],
    solutionTents: [[2, 0], [4, 2]]
  };
  const plausibleWrongTent = games.validateTents(tentsPuzzle, new Set(["2:2"]));
  assert.equal(plausibleWrongTent.errors.size, 0, "Tents validator leaked the stored solution");
  assert.equal(plausibleWrongTent.completed, false);
  assert.equal(games.validateTents(tentsPuzzle, new Set(["2:0", "4:2"])).completed, true);

  const nonogramPuzzle = {
    size: 3,
    rowClues: [[1], [1], [1]],
    colClues: [[1], [1], [1]],
    solution: [[true, false, false], [false, true, false], [false, false, true]]
  };
  const plausibleWrongFill = games.validateNonogram(nonogramPuzzle, new Map([["0:1", 1]]));
  assert.equal(plausibleWrongFill.errors.size, 0, "Nonogram validator leaked the stored solution");
  assert.equal(plausibleWrongFill.completed, false);
  const alternateClueMatch = new Map([["0:2", 1], ["1:1", 1], ["2:0", 1]]);
  assert.equal(games.validateNonogram(nonogramPuzzle, alternateClueMatch).completed, true, "Nonogram completion must use clues, not stored cells");
  const impossibleLine = new Map([["0:0", 1], ["0:2", 1]]);
  assert.ok(games.validateNonogram(nonogramPuzzle, impossibleLine).errors.size > 0, "Impossible Nonogram line was not reported");
  console.log("validator regressions: Tents and Nonogram do not reveal stored solution cells");
}

validatorRegressionTests();

const retryBaseSeed = games.hashString("retry-regression");
function failFirstAttempt(game, seed, difficulty) {
  if (seed === retryBaseSeed) throw new Error("forced first-attempt failure");
  return games.generatePuzzle(game, seed, difficulty);
}
const recovered = games.generatePuzzleWithRetry("hashi", retryBaseSeed, "easy", "daily", failFirstAttempt);
const recoveredAgain = games.generatePuzzleWithRetry("hashi", retryBaseSeed, "easy", "daily", failFirstAttempt);
assert.equal(recovered.retryCount, 1);
assert.equal(recovered.seed, games.hashString(`${retryBaseSeed}-retry-1`));
assert.equal(snapshot(recovered.puzzle), snapshot(recoveredAgain.puzzle), "Daily recovery must be deterministic");
console.log("generation retry regression: recovered deterministically after a forced first-attempt failure");

for (const game of games.GAME_ORDER) {
  const fingerprints = Object.fromEntries(difficulties.map((difficulty) => [difficulty, new Set()]));
  const durations = Object.fromEntries(difficulties.map((difficulty) => [difficulty, []]));
  for (let index = 0; index < seedCount; index += 1) {
    const difficulty = difficulties[index % difficulties.length];
    const difficultyIndex = Math.floor(index / difficulties.length);
    const seed = games.hashString(`${game}-${difficulty}-${difficultyIndex}`);
    const started = performance.now();
    let puzzle;
    try {
      puzzle = games.generatePuzzle(game, seed, difficulty);
    } catch (error) {
      assert.fail(`${game}/${difficulty} generator failed at seed ${difficultyIndex}: ${error.message}`);
    }
    durations[difficulty].push(performance.now() - started);
    verify(game, puzzle);
    if (difficultyIndex < 100) fingerprints[difficulty].add(fingerprint(game, puzzle));
  }

  for (const difficulty of difficulties) {
    assert.ok(fingerprints[difficulty].size >= 85, `${game}/${difficulty} diversity too low: ${fingerprints[difficulty].size}/100`);
    const average = durations[difficulty].reduce((sum, duration) => sum + duration, 0) / durations[difficulty].length;
    const p95 = percentile(durations[difficulty], 0.95);
    const maximum = Math.max(...durations[difficulty]);
    assert.ok(average < limits.average, `${game}/${difficulty} average ${average.toFixed(1)}ms >= ${limits.average}ms`);
    assert.ok(p95 < limits.p95, `${game}/${difficulty} p95 ${p95.toFixed(1)}ms >= ${limits.p95}ms`);
    assert.ok(maximum < limits.maximum, `${game}/${difficulty} max ${maximum.toFixed(1)}ms >= ${limits.maximum}ms`);

    const dailySeed = games.hashString(`daily-${game}-2026-08-11-${difficulty}`);
    const today = games.generatePuzzleWithRetry(game, dailySeed, difficulty, "daily").puzzle;
    const repeated = games.generatePuzzleWithRetry(game, dailySeed, difficulty, "daily").puzzle;
    const tomorrow = games.generatePuzzleWithRetry(game, games.hashString(`daily-${game}-2026-08-12-${difficulty}`), difficulty, "daily").puzzle;
    assert.equal(snapshot(today), snapshot(repeated), `${game}/${difficulty} daily retry is not deterministic`);
    assert.notEqual(fingerprint(game, today), fingerprint(game, tomorrow), `${game}/${difficulty} adjacent daily seeds repeated`);
    console.log(`${game}/${difficulty}: diversity ${fingerprints[difficulty].size}/100; avg ${average.toFixed(1)}ms; p95 ${p95.toFixed(1)}ms; max ${maximum.toFixed(1)}ms`);
  }
  console.log(`${game}: ${seedCount} generated puzzles passed solver and unique-solution checks`);
}

assert.throws(
  () => games.generatePuzzleWithRetry("hashi", 1, "easy", "daily", () => { throw new Error("forced failure"); }),
  (error) => error.retryCount === 5 && error.failures.length === 5,
  "Generation retry must fail safely after five attempts"
);
console.log(`performance thresholds: avg < ${limits.average}ms; p95 < ${limits.p95}ms; max < ${limits.maximum}ms`);
