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

console.log("Daily 1★, 2★, and 3★ puzzles are deterministic; all tested regions are connected.");
