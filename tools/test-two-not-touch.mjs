import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const Logic = require("logic-solver");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "two-not-touch-core.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "two-not-touch-catalog.js"), "utf8"), context);
const core = context.window.DLL_TWO_NOT_TOUCH_CORE;
const catalog = context.window.DLL_TWO_NOT_TOUCH_CATALOG;
const seedCount = Number(process.env.DLL_TWO_NOT_TOUCH_SEEDS || 1000);
const limits = { average: 100, p95: 300, maximum: 1500 };

assert.equal(core.nextDailyStreak("2026-08-15", 4, "2026-08-15"), 4, "same-day completion must not increment streak");
assert.equal(core.nextDailyStreak("2026-08-14", 4, "2026-08-15"), 5, "yesterday must increment streak");
assert.equal(core.nextDailyStreak("2026-07-31", 4, "2026-08-01"), 5, "month boundary must increment streak");
assert.equal(core.nextDailyStreak("2025-12-31", 4, "2026-01-01"), 5, "year boundary must increment streak");
assert.equal(core.nextDailyStreak("2026-08-13", 4, "2026-08-15"), 1, "missed day must reset streak");
assert.equal(core.nextDailyStreak("broken", "broken", "2026-08-15"), 1, "damaged streak data must reset safely");
assert.equal(core.nextDailyStreak("2026-08-16", 9, "2026-08-15"), 1, "future completion date must reset safely");
assert.equal(core.parseProgressJson("{"), null, "damaged JSON must be discarded");
assert.equal(core.parseProgressJson("[]"), null, "non-object JSON must be discarded");
const progressKeys = new Set();
for (const mode of ["daily", "practice"]) for (const profileKey of Object.keys(core.profiles)) {
  progressKeys.add(core.progressStorageKey(mode, profileKey));
}
assert.equal(progressKeys.size, 6, "each Two Not Touch mode/profile needs its own archive key");

const savedCells = Array.from({ length: 7 }, () => Array(7).fill(0));
savedCells[2][3] = 1;
const savedSeed = core.hashString("daily-two-not-touch-2026-08-15-1star");
const savedPuzzle = core.generatePuzzle("quick", savedSeed, 227, catalog);
const expectedProgress = { mode: "daily", profileKey: "quick", puzzleDate: "2026-08-15", seed: savedPuzzle.seed, id: savedPuzzle.id, size: 7, maxHints: 3, hintPenalties: [30, 60, 120] };
const savedProgress = core.normalizeProgress({
  version: 1, mode: "daily", date: "2026-08-15", profileKey: "quick", seed: savedPuzzle.seed, id: savedPuzzle.id,
  cells: savedCells, elapsed: 61.9, hintCount: 2, hintPenalty: 90, started: true
}, expectedProgress);
assert.equal(savedProgress.elapsed, 61, "saved elapsed time must restore as whole seconds");
assert.equal(savedProgress.cells[2][3], 1, "saved board marks must restore");
assert.equal(savedProgress.hintCount, 2, "saved hint count must restore");
assert.equal(savedProgress.puzzleDate, "2026-08-15", "legacy daily date must migrate to puzzleDate");
assert.equal(core.nextDailyStreak("2026-08-14", 4, savedProgress.puzzleDate), 5, "completion after midnight must credit the puzzle date");
assert.equal(core.normalizeProgress({ ...savedProgress, puzzleDate: "2026-08-14" }, expectedProgress), null, "expired daily progress must be rejected");
assert.equal(core.normalizeProgress({ ...savedProgress, cells: [[0]] }, expectedProgress), null, "damaged progress must be rejected");
assert.equal(core.normalizeProgress({ ...savedProgress, seed: savedPuzzle.seed + 1 }, expectedProgress), null, "wrong daily seed must be rejected");
assert.equal(core.normalizeProgress({ ...savedProgress, elapsed: -1 }, expectedProgress), null, "invalid timer must be rejected");
assert.equal(core.normalizeProgress({ ...savedProgress, hintCount: 4 }, expectedProgress), null, "invalid hint count must be rejected");
assert.equal(core.normalizeProgress({ ...savedProgress, hintPenalty: 1 }, expectedProgress), null, "invalid hint penalty must be rejected");
assert.equal(core.normalizeProgress({ ...savedProgress, id: {} }, expectedProgress), null, "invalid puzzle id must be rejected");
for (const [from, to, label] of [["2026-07-31", "2026-08-01", "month"], ["2025-12-31", "2026-01-01", "year"]]) {
  assert.notEqual(core.hashString(`daily-two-not-touch-${from}-1star`), core.hashString(`daily-two-not-touch-${to}-1star`), `${label} boundary must change the daily seed`);
}

for (const profileKey of ["classic", "expert"]) {
  assert.ok(catalog[profileKey].bases.length >= 64, `${profileKey}: catalog must contain at least 64 bases`);
}

function percentile(values, percentage) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(sorted.length * percentage) - 1];
}

function connectedRegions(puzzle) {
  const { size } = core.profiles[puzzle.profileKey];
  for (let region = 0; region < size; region += 1) {
    const cells = [];
    for (let row = 0; row < size; row += 1) for (let col = 0; col < size; col += 1) if (puzzle.regions[row][col] === region) cells.push([row, col]);
    assert.ok(cells.length, `${puzzle.profileKey}: empty region ${region}`);
    const seen = new Set([cells[0].join(":")]);
    const queue = [cells[0]];
    while (queue.length) {
      const [row, col] = queue.shift();
      for (const [nextRow, nextCol] of [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]) {
        const key = `${nextRow}:${nextCol}`;
        if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size || seen.has(key) || puzzle.regions[nextRow][nextCol] !== region) continue;
        seen.add(key);
        queue.push([nextRow, nextCol]);
      }
    }
    assert.equal(seen.size, cells.length, `${puzzle.profileKey}: disconnected region ${region}`);
  }
}

function satSolutionCount(puzzle, limit = 2) {
  const profile = core.profiles[puzzle.profileKey];
  const variables = Array.from({ length: profile.size }, (_, row) => Array.from({ length: profile.size }, (_, col) => `c${row}_${col}`));
  const solver = new Logic.Solver();
  const exactly = (items) => Logic.equalBits(Logic.sum(items), Logic.constantBits(profile.starsPerGroup));
  variables.forEach((row) => solver.require(exactly(row)));
  for (let col = 0; col < profile.size; col += 1) solver.require(exactly(variables.map((row) => row[col])));
  for (let region = 0; region < profile.size; region += 1) {
    const items = [];
    for (let row = 0; row < profile.size; row += 1) for (let col = 0; col < profile.size; col += 1) if (puzzle.regions[row][col] === region) items.push(variables[row][col]);
    solver.require(exactly(items));
  }
  for (let row = 0; row < profile.size; row += 1) for (let col = 0; col < profile.size; col += 1) {
    for (const [rowDelta, colDelta] of [[0, 1], [1, -1], [1, 0], [1, 1]]) {
      const nextRow = row + rowDelta;
      const nextCol = col + colDelta;
      if (nextRow < profile.size && nextCol >= 0 && nextCol < profile.size) solver.forbid(Logic.and(variables[row][col], variables[nextRow][nextCol]));
    }
  }
  const flat = variables.flat();
  let count = 0;
  while (count < limit) {
    const solution = solver.solve();
    if (!solution) break;
    count += 1;
    solver.forbid(Logic.and(flat.map((name) => solution.evaluate(name) ? name : Logic.not(name))));
  }
  return count;
}

for (const profileKey of ["quick", "classic", "expert"]) {
  const durations = [];
  const fingerprints = new Set();
  const solutionCounts = new Map();
  for (let seed = 0; seed < seedCount; seed += 1) {
    const started = performance.now();
    const puzzle = core.generatePuzzle(profileKey, seed, `P${seed}`, catalog);
    durations.push(performance.now() - started);
    assert.equal(core.validateSolution(puzzle), true, `${profileKey}/${seed}: stored solution is invalid`);
    if (seed < 100) {
      fingerprints.add(core.fingerprint(puzzle));
      connectedRegions(puzzle);
    }
    const fingerprint = core.fingerprint(puzzle);
    if (!solutionCounts.has(fingerprint)) {
      const count = profileKey === "quick"
        ? core.solveQuick(puzzle.regions, core.profiles.quick, 2).length
        : satSolutionCount(puzzle, 2);
      solutionCounts.set(fingerprint, count);
    }
    assert.equal(solutionCounts.get(fingerprint), 1, `${profileKey}/${seed}: puzzle is not unique`);
  }
  assert.ok(fingerprints.size >= 85, `${profileKey}: diversity ${fingerprints.size}/100 is below 85`);
  const average = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  const p95 = percentile(durations, 0.95);
  const maximum = Math.max(...durations);
  assert.ok(average < limits.average, `${profileKey}: average ${average.toFixed(1)}ms`);
  assert.ok(p95 < limits.p95, `${profileKey}: p95 ${p95.toFixed(1)}ms`);
  assert.ok(maximum < limits.maximum, `${profileKey}: max ${maximum.toFixed(1)}ms`);
  const dailySeed = core.hashString(`daily-two-not-touch-2026-08-14-${core.profiles[profileKey].starMode}`);
  const daily = core.generatePuzzle(profileKey, dailySeed, 226, catalog);
  const repeated = core.generatePuzzle(profileKey, dailySeed, 226, catalog);
  assert.equal(JSON.stringify(daily), JSON.stringify(repeated), `${profileKey}: daily puzzle is not deterministic`);
  console.log(`${profileKey}: ${seedCount} seeds; unique solution; diversity ${fingerprints.size}/100; avg ${average.toFixed(2)}ms; p95 ${p95.toFixed(2)}ms; max ${maximum.toFixed(2)}ms`);
}

for (const profileKey of ["quick", "classic", "expert"]) {
  const puzzle = core.generatePuzzle(profileKey, 123, "constraint-test", catalog);
  const size = core.profiles[profileKey].size;
  const marks = Array.from({ length: size }, () => Array(size).fill(0));
  assert.equal(core.countSolutions(puzzle, marks, 1), 1, `${profileKey}: empty marks must allow a completion`);
  const solutionCol = puzzle.solution[0][0];
  marks[0][solutionCol] = 2;
  assert.equal(core.countSolutions(puzzle, marks, 1), 0, `${profileKey}: blocking a required unique-solution cell must reject completion`);
}

const multiSolutionPuzzle = {
  profileKey: "quick",
  regions: Array.from({ length: 7 }, (_, row) => Array(7).fill(row))
};
const emptyQuickMarks = Array.from({ length: 7 }, () => Array(7).fill(0));
assert.equal(core.countSolutions(multiSolutionPuzzle, emptyQuickMarks, 1), 1, "solution counter must stop at limit 1");
assert.equal(core.countSolutions(multiSolutionPuzzle, emptyQuickMarks, 2), 2, "solution counter must honor limit 2");

console.log("Daily 1★, 2★, and 3★ puzzles are deterministic; all tested regions are connected.");
