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

assert.equal(typeof core.analyzeBoard, "function", "explainable board analysis must be exported");
const analysisPuzzle = {
  profileKey: "quick",
  regions: Array.from({ length: 7 }, (_, row) => Array(7).fill(row))
};
const emptyAnalysisCells = Array.from({ length: 7 }, () => Array(7).fill(0));
assert.equal(core.analyzeBoard(analysisPuzzle, emptyAnalysisCells), null, "an empty board has no local forced deduction");

const noTouchCells = Array.from({ length: 7 }, () => Array(7).fill(0));
noTouchCells[0][0] = 1;
const noTouchSnapshot = JSON.stringify(noTouchCells);
assert.deepEqual(JSON.parse(JSON.stringify(core.analyzeBoard(analysisPuzzle, noTouchCells))), {
  technique: "star_adjacency",
  targetCells: [[0, 1], [1, 0], [1, 1]],
  evidenceCells: [[0, 0]],
  action: "block",
  explanationData: { rule: "star-blocks-eight-neighbors", starCell: [0, 0], adjacentCount: 3 }
}, "a star must block all eight neighboring cells");
assert.equal(JSON.stringify(noTouchCells), noTouchSnapshot, "analysis must not mutate the board");

const completeGroupCells = Array.from({ length: 7 }, () => Array(7).fill(0));
completeGroupCells[0][0] = 1;
completeGroupCells[0][1] = 2;
completeGroupCells[1][0] = 2;
completeGroupCells[1][1] = 2;
const completeGroup = core.analyzeBoard(analysisPuzzle, completeGroupCells);
assert.equal(completeGroup.technique, "group_completed", "a completed row should be explainable");
assert.deepEqual(JSON.parse(JSON.stringify(completeGroup.targetCells)), [[0, 2], [0, 3], [0, 4], [0, 5], [0, 6]], "completed row cells should be blocked");
assert.deepEqual(JSON.parse(JSON.stringify(completeGroup.evidenceCells)), [[0, 0]], "completed group evidence should identify its star");
assert.equal(completeGroup.action, "block", "completed groups produce block actions");
assert.deepEqual(JSON.parse(JSON.stringify(completeGroup.explanationData)), {
  groupType: "row", groupIndex: 0, requiredStars: 1, placedStars: 1, targetCount: 5
}, "completed group explanation should describe its counts");

const columnCells = Array.from({ length: 7 }, () => Array(7).fill(0));
columnCells[0].fill(2);
columnCells[0][0] = 1;
columnCells[1][0] = 2;
columnCells[1][1] = 2;
const completedColumn = core.analyzeBoard(analysisPuzzle, columnCells);
assert.equal(completedColumn.technique, "group_completed", "a completed column should be explainable");
assert.deepEqual(JSON.parse(JSON.stringify(completedColumn.targetCells)), [[2, 0], [3, 0], [4, 0], [5, 0], [6, 0]], "completed column cells should be blocked");
assert.deepEqual(JSON.parse(JSON.stringify(completedColumn.evidenceCells)), [[0, 0]], "column evidence should identify its star");
assert.equal(completedColumn.explanationData.groupType, "column", "column deductions should identify the group type");

const regionPuzzle = {
  profileKey: "quick",
  regions: Array.from({ length: 7 }, (_, row) => Array(7).fill(row))
};
regionPuzzle.regions[2][2] = 0;
const regionCells = Array.from({ length: 7 }, () => Array(7).fill(0));
regionCells[0].fill(2);
regionCells[0][0] = 1;
for (let row = 1; row < 7; row += 1) regionCells[row][0] = 2;
regionCells[1][1] = 2;
const completedRegion = core.analyzeBoard(regionPuzzle, regionCells);
assert.equal(completedRegion.technique, "group_completed", "a completed region should be explainable");
assert.deepEqual(JSON.parse(JSON.stringify(completedRegion.targetCells)), [[2, 2]], "completed region cells should be blocked");
assert.deepEqual(JSON.parse(JSON.stringify(completedRegion.evidenceCells)), [[0, 0]], "region evidence should identify its star");
assert.equal(completedRegion.explanationData.groupType, "region", "region deductions should identify the group type");

const forcedCandidateCells = Array.from({ length: 7 }, () => Array(7).fill(0));
for (let col = 1; col < 7; col += 1) forcedCandidateCells[0][col] = 2;
const forcedCandidate = core.analyzeBoard(analysisPuzzle, forcedCandidateCells);
assert.equal(forcedCandidate.technique, "forced_candidates", "a group with exactly one legal cell should force a star");
assert.deepEqual(JSON.parse(JSON.stringify(forcedCandidate.targetCells)), [[0, 0]], "the only legal candidate should be selected");
assert.deepEqual(JSON.parse(JSON.stringify(forcedCandidate.evidenceCells)), [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]], "forced candidate evidence should show excluded group cells");
assert.equal(forcedCandidate.action, "star", "forced candidates produce star actions");
assert.deepEqual(JSON.parse(JSON.stringify(forcedCandidate.explanationData)), {
  groupType: "row", groupIndex: 0, remainingStars: 1, candidateCells: [[0, 0]]
}, "forced candidate explanation should expose the group and candidate count");

const nonForcedCandidateCells = Array.from({ length: 7 }, () => Array(7).fill(0));
for (let col = 2; col < 7; col += 1) nonForcedCandidateCells[0][col] = 2;
assert.equal(core.analyzeBoard(analysisPuzzle, nonForcedCandidateCells), null, "more legal candidates than remaining stars must not force a star");

const forcedClassicPuzzle = {
  profileKey: "classic",
  regions: Array.from({ length: 10 }, (_, row) => Array(10).fill(row))
};
const forcedClassicCells = Array.from({ length: 10 }, () => Array(10).fill(0));
for (let col = 1; col < 10; col += 1) if (col !== 2) forcedClassicCells[0][col] = 2;
const forcedClassic = core.analyzeBoard(forcedClassicPuzzle, forcedClassicCells);
assert.equal(forcedClassic.technique, "forced_candidates", "a two-star group with two legal cells should force both stars");
assert.deepEqual(JSON.parse(JSON.stringify(forcedClassic.targetCells)), [[0, 0], [0, 2]], "all N legal candidates should be selected");
assert.equal(forcedClassic.explanationData.remainingStars, 2, "forced candidate explanation should preserve N");
assert.deepEqual(JSON.parse(JSON.stringify(forcedClassic.explanationData.candidateCells)), [[0, 0], [0, 2]], "candidate cells should match the forced targets");

const forcedExpertPuzzle = {
  profileKey: "expert",
  regions: Array.from({ length: 14 }, (_, row) => Array(14).fill(row))
};
const forcedExpertCells = Array.from({ length: 14 }, () => Array(14).fill(0));
for (let col = 0; col < 14; col += 1) if (![0, 2, 4].includes(col)) forcedExpertCells[0][col] = 2;
const forcedExpert = core.analyzeBoard(forcedExpertPuzzle, forcedExpertCells);
assert.equal(forcedExpert.technique, "forced_candidates", "a three-star group should be explainable for Expert");
assert.deepEqual(JSON.parse(JSON.stringify(forcedExpert.targetCells)), [[0, 0], [0, 2], [0, 4]], "Expert should force all three legal candidates");
assert.equal(forcedExpert.explanationData.remainingStars, 3, "Expert forced candidate explanation should preserve N");

function interactionPuzzle(regionCells) {
  const selected = new Set(regionCells.map(([row, col]) => `${row}:${col}`));
  const regions = Array.from({ length: 7 }, (_, row) => Array.from({ length: 7 }, (_, col) => {
    const base = (row + col) % 7;
    return base === 0 && !selected.has(`${row}:${col}`) ? 1 : base;
  }));
  regionCells.forEach(([row, col]) => { regions[row][col] = 0; });
  return { profileKey: "quick", regions };
}

const regionToRowPuzzle = interactionPuzzle([[0, 0], [0, 1]]);
const regionToRowCells = Array.from({ length: 7 }, () => Array(7).fill(0));
for (let col = 3; col < 7; col += 1) regionToRowCells[0][col] = 2;
const regionToRow = core.analyzeBoard(regionToRowPuzzle, regionToRowCells);
assert.equal(regionToRow.technique, "group_interaction", "region candidates confined to a row should interact with that row");
assert.deepEqual(JSON.parse(JSON.stringify(regionToRow.targetCells)), [[0, 2]], "region-to-row interaction should block the row's outside candidate");
assert.deepEqual(JSON.parse(JSON.stringify(regionToRow.evidenceCells)), [[0, 0], [0, 1]], "region-to-row evidence should show the confined candidates");
assert.deepEqual(JSON.parse(JSON.stringify(regionToRow.explanationData)), {
  direction: "region_to_row",
  sourceGroupType: "region",
  sourceGroupIndex: 0,
  targetGroupType: "row",
  targetGroupIndex: 0,
  remainingStars: 1,
  sourceCandidateCells: [[0, 0], [0, 1]],
  targetCandidateCells: [[0, 0], [0, 1], [0, 2]],
  eliminatedCells: [[0, 2]]
}, "region-to-row explanation should contain both groups and candidate sets");

const regionToColumnPuzzle = interactionPuzzle([[0, 0], [1, 0]]);
const regionToColumnCells = Array.from({ length: 7 }, () => Array(7).fill(0));
for (let row = 3; row < 7; row += 1) regionToColumnCells[row][0] = 2;
const regionToColumn = core.analyzeBoard(regionToColumnPuzzle, regionToColumnCells);
assert.equal(regionToColumn.technique, "group_interaction", "region candidates confined to a column should interact with that column");
assert.deepEqual(JSON.parse(JSON.stringify(regionToColumn.targetCells)), [[2, 0]], "region-to-column interaction should block the column's outside candidate");
assert.equal(regionToColumn.explanationData.direction, "region_to_column", "region-to-column explanation should identify its direction");

const rowToRegionPuzzle = interactionPuzzle([[0, 0], [0, 1], [1, 0]]);
const rowToRegionCells = Array.from({ length: 7 }, () => Array(7).fill(0));
for (let col = 2; col < 7; col += 1) rowToRegionCells[0][col] = 2;
const rowToRegion = core.analyzeBoard(rowToRegionPuzzle, rowToRegionCells);
assert.equal(rowToRegion.technique, "group_interaction", "row candidates confined to a region should interact in reverse");
assert.deepEqual(JSON.parse(JSON.stringify(rowToRegion.targetCells)), [[1, 0]], "row-to-region interaction should block the region's outside candidate");
assert.equal(rowToRegion.explanationData.direction, "row_to_region", "row-to-region explanation should identify its direction");

const columnToRegionPuzzle = interactionPuzzle([[0, 0], [1, 0], [0, 1]]);
const columnToRegionCells = Array.from({ length: 7 }, () => Array(7).fill(0));
for (let row = 2; row < 7; row += 1) columnToRegionCells[row][0] = 2;
const columnToRegion = core.analyzeBoard(columnToRegionPuzzle, columnToRegionCells);
assert.equal(columnToRegion.technique, "group_interaction", "column candidates confined to a region should interact in reverse");
assert.deepEqual(JSON.parse(JSON.stringify(columnToRegion.targetCells)), [[0, 1]], "column-to-region interaction should block the region's outside candidate");
assert.equal(columnToRegion.explanationData.direction, "column_to_region", "column-to-region explanation should identify its direction");

const spanningPuzzle = interactionPuzzle([[0, 0], [1, 1]]);
const spanningCells = Array.from({ length: 7 }, () => Array(7).fill(0));
assert.equal(core.analyzeBoard(spanningPuzzle, spanningCells), null, "region candidates spanning rows and columns must not interact");

const noOutsidePuzzle = interactionPuzzle([[0, 0], [0, 1]]);
const noOutsideCells = Array.from({ length: 7 }, () => Array(7).fill(0));
for (let col = 2; col < 7; col += 1) noOutsideCells[0][col] = 2;
assert.equal(core.analyzeBoard(noOutsidePuzzle, noOutsideCells), null, "an interaction without outside candidates has no deduction");

const solvedPuzzle = core.generatePuzzle("quick", 123, "analysis-solved", catalog);
const solvedCells = Array.from({ length: 7 }, () => Array(7).fill(2));
solvedPuzzle.solution.forEach((cols, row) => cols.forEach((col) => { solvedCells[row][col] = 1; }));
assert.equal(core.analyzeBoard(solvedPuzzle, solvedCells), null, "a solved board has no next deduction");
assert.equal(core.analyzeBoard(solvedPuzzle, [[0]]), null, "malformed cells must return null");

assert.equal(typeof core.scoreHumanDifficulty, "function", "human difficulty scorer must be exported");
const emptyScore = core.scoreHumanDifficulty(analysisPuzzle);
assert.deepEqual(JSON.parse(JSON.stringify(emptyScore)), {
  score: 0,
  level: null,
  techniqueCounts: { star_adjacency: 0, group_completed: 0, forced_candidates: 0, group_interaction: 0 },
  steps: 0,
  stalled: true
}, "a board without an initial deduction should be marked stalled");

const scoringRegions = Array.from({ length: 7 }, (_, row) => Array.from({ length: 7 }, (_, col) => {
  if (row === 0 && col === 0) return 0;
  return row === 0 ? 1 : row;
}));
const scoringPuzzle = { profileKey: "quick", regions: scoringRegions };
const singletonDeduction = core.analyzeBoard(scoringPuzzle, emptyAnalysisCells);
assert.deepEqual(JSON.parse(JSON.stringify(singletonDeduction.evidenceCells)), [[0, 0]], "forced candidates must expose evidence even for a singleton group");
const scoringResult = core.scoreHumanDifficulty(scoringPuzzle);
assert.deepEqual(JSON.parse(JSON.stringify(scoringResult)), {
  score: 5,
  level: "forced_candidates",
  techniqueCounts: { star_adjacency: 1, group_completed: 2, forced_candidates: 1, group_interaction: 0 },
  steps: 4,
  stalled: true
}, "difficulty scoring should apply deductions and sum their technique weights");
assert.deepEqual(JSON.parse(JSON.stringify(core.scoreHumanDifficulty({ ...scoringPuzzle, solution: [[99]] }))),
  JSON.parse(JSON.stringify(scoringResult)), "difficulty scoring must not consult the final solution");
const interactionScore = core.scoreHumanDifficulty(regionToRowPuzzle);
assert.equal(interactionScore.score, 3, "group interaction should use weight three");
assert.equal(interactionScore.techniqueCounts.group_interaction, 1, "group interaction should count one deduction step");

const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const hintSource = appSource.slice(appSource.indexOf("function showHint()"), appSource.indexOf("function applyHintPenalty"));
const eventDataSource = appSource.slice(appSource.indexOf("function getPuzzleEventData"), appSource.indexOf("function trackEvent"));
assert.match(hintSource, /TWO_NOT_TOUCH_CORE\.analyzeBoard\(state\.puzzle, state\.cells\)/, "Two Not Touch Hint must use analyzeBoard");
assert.match(hintSource, /hintLevel >= 2 \? deduction\.targetCells : deduction\.evidenceCells/, "Hint levels must switch from evidence to target highlighting");
assert.match(hintSource, /hintLevel >= 2[\s\S]*getNextSolutionStarKey\(\)/, "solution fallback must remain at the final Hint level");
assert.ok(!hintSource.includes("getCandidates()") && !hintSource.includes("groupHints("), "legacy heuristic Hint path must not be used");
assert.equal((hintSource.match(/trackEvent\("hint_used"/g) || []).length, 1, "each Hint path must funnel through one guarded event call");
assert.match(hintSource, /let hintEventTracked = false[\s\S]*if \(hintEventTracked\) return[\s\S]*hintEventTracked = true/, "Hint events must be guarded against duplicate reporting");
for (const key of ["hintEvidence", "hintTechnique", "hintExplanation", "techniqueStarAdjacency", "techniqueGroupCompleted", "techniqueForcedCandidates", "techniqueGroupInteraction"]) {
  assert.match(appSource, new RegExp(`^\\s+${key}:`, "m"), `app.js: missing English ${key} copy`);
}
assert.match(appSource, /uiText\[key\] \|\| UI_TEXT\.en\[key\]/, "new Hint copy must safely fall back to English");
for (const key of ["game_name", "profile", "mode", "puzzle_id", "seed", "elapsed", "hint_stage", "technique"]) {
  assert.match(eventDataSource, new RegExp(`^\\s+${key}:`, "m"), `GA4 event data must include ${key}`);
}
assert.match(eventDataSource, /game_name: "two-not-touch"/, "GA4 game_name must use the existing Two Not Touch identifier");
assert.ok(!eventDataSource.includes("cells:"), "GA4 event data must not include the full board");
for (const event of ["puzzle_start", "puzzle_complete", "share_clicked"]) {
  assert.match(appSource, new RegExp(`trackEvent\\(\\"${event}\\", getPuzzleEventData\\(`), `${event} must use unified puzzle event data`);
}
assert.match(hintSource, /technique: deduction\.technique/, "hint_used must record the analyzer technique");

console.log("Daily 1★, 2★, and 3★ puzzles are deterministic; all tested regions are connected.");
