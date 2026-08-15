import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const Logic = require("logic-solver");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE_COUNT = 64;

const PROFILES = {
  classic: {
    size: 10,
    stars: 2,
    templates: [
      [[0, 2], [4, 6], [0, 8], [2, 4], [6, 8], [1, 3], [5, 7], [1, 9], [3, 5], [7, 9]],
      [[0, 5], [2, 7], [4, 9], [1, 6], [3, 8], [0, 5], [2, 7], [4, 9], [1, 6], [3, 8]],
      [[0, 8], [2, 4], [6, 8], [1, 3], [5, 7], [1, 9], [3, 5], [7, 9], [0, 2], [4, 6]],
      [[1, 3], [5, 7], [1, 9], [3, 5], [0, 8], [4, 6], [0, 2], [6, 8], [2, 4], [7, 9]]
    ]
  },
  expert: {
    size: 14,
    stars: 3,
    templates: [
      [[0, 2, 4], [6, 8, 10], [0, 2, 12], [4, 6, 8], [0, 10, 12], [2, 4, 6], [8, 10, 12], [1, 3, 5], [7, 9, 11], [1, 3, 13], [5, 7, 9], [1, 11, 13], [3, 5, 7], [9, 11, 13]],
      [[0, 2, 12], [4, 6, 8], [0, 10, 12], [2, 4, 6], [8, 10, 12], [1, 3, 5], [7, 9, 11], [1, 3, 13], [5, 7, 9], [1, 11, 13], [3, 5, 7], [9, 11, 13], [0, 2, 4], [6, 8, 10]],
      [[0, 4, 9], [2, 6, 11], [4, 8, 13], [1, 6, 10], [3, 8, 12], [1, 5, 10], [3, 7, 12], [0, 5, 9], [2, 7, 11], [4, 9, 13], [1, 6, 11], [3, 8, 13], [0, 5, 10], [2, 7, 12]],
      [[0, 5, 9], [2, 7, 11], [4, 9, 13], [1, 6, 11], [4, 8, 13], [2, 6, 11], [0, 4, 9], [2, 7, 12], [0, 5, 10], [3, 8, 12], [1, 6, 10], [3, 8, 13], [1, 5, 10], [3, 7, 12]],
      [[0, 5, 10], [2, 7, 12], [0, 4, 9], [2, 6, 11], [4, 8, 13], [1, 6, 11], [4, 9, 13], [2, 7, 11], [0, 5, 9], [3, 7, 12], [1, 5, 10], [3, 8, 12], [1, 6, 10], [3, 8, 13]]
    ]
  }
};

function createRng(seed) {
  let value = seed >>> 0;
  return () => {
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

function shuffle(values, rng) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swap = randomInt(rng, index + 1);
    [values[index], values[swap]] = [values[swap], values[index]];
  }
  return values;
}

function transformGrid(grid, transform) {
  let result = grid.map((row) => [...row]);
  if (transform >= 4) result = result.map((row) => [...row].reverse());
  for (let turn = 0; turn < transform % 4; turn += 1) {
    result = result[0].map((_, col) => result.map((row) => row[col]).reverse());
  }
  return result;
}

function transformSolution(solution, size, transform) {
  const grid = Array.from({ length: size }, () => Array(size).fill(false));
  solution.forEach((cols, row) => cols.forEach((col) => { grid[row][col] = true; }));
  return transformGrid(grid, transform).map((row) => row.flatMap((star, col) => star ? [col] : []));
}

function partitionTerritories(adjacency, stars, rng) {
  const count = adjacency.length;
  const optionsByTerritory = Array.from({ length: count }, () => []);
  const seen = new Set();
  for (let first = 0; first < count; first += 1) {
    if (stars === 2) {
      for (const second of adjacency[first]) add([first, second]);
    } else {
      for (const second of adjacency[first]) {
        for (const third of new Set([...adjacency[first], ...adjacency[second]])) {
          if (third !== first && third !== second) add([first, second, third]);
        }
      }
    }
  }
  optionsByTerritory.forEach((options) => shuffle(options, rng));
  const used = new Uint8Array(count);
  const groups = [];
  return walk(count) ? groups : null;

  function add(group) {
    group.sort((a, b) => a - b);
    const key = group.join(",");
    if (seen.has(key)) return;
    seen.add(key);
    group.forEach((territory) => optionsByTerritory[territory].push(group));
  }

  function walk(remaining) {
    if (!remaining) return true;
    let options;
    for (let territory = 0; territory < count; territory += 1) {
      if (used[territory]) continue;
      const available = optionsByTerritory[territory].filter((group) => group.every((item) => !used[item]));
      if (!available.length) return false;
      if (!options || available.length < options.length) options = available;
    }
    for (const group of options) {
      group.forEach((territory) => { used[territory] = 1; });
      groups.push(group);
      if (walk(remaining - stars)) return true;
      groups.pop();
      group.forEach((territory) => { used[territory] = 0; });
    }
    return false;
  }
}

function generateRegions(profile, solution, seed) {
  const { size, stars } = profile;
  const rng = createRng(seed);
  const territoryCount = size * stars;
  const territories = Array.from({ length: size }, () => Array(size).fill(-1));
  const frontier = [];
  const unassigned = new Set();
  for (let row = 0; row < size; row += 1) for (let col = 0; col < size; col += 1) unassigned.add(`${row}:${col}`);
  let territory = 0;
  for (let row = 0; row < size; row += 1) {
    for (const col of solution[row]) {
      territories[row][col] = territory++;
      frontier.push([row, col]);
      unassigned.delete(`${row}:${col}`);
    }
  }
  while (unassigned.size) {
    const [sourceRow, sourceCol] = frontier[randomInt(rng, frontier.length)];
    const options = [[sourceRow - 1, sourceCol], [sourceRow + 1, sourceCol], [sourceRow, sourceCol - 1], [sourceRow, sourceCol + 1]]
      .filter(([row, col]) => row >= 0 && row < size && col >= 0 && col < size && unassigned.has(`${row}:${col}`));
    if (!options.length) continue;
    const [row, col] = options[randomInt(rng, options.length)];
    territories[row][col] = territories[sourceRow][sourceCol];
    frontier.push([row, col]);
    unassigned.delete(`${row}:${col}`);
  }
  const adjacency = Array.from({ length: territoryCount }, () => new Set());
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      for (const [rowDelta, colDelta] of [[1, 0], [0, 1]]) {
        const nextRow = row + rowDelta;
        const nextCol = col + colDelta;
        if (nextRow >= size || nextCol >= size) continue;
        const first = territories[row][col];
        const second = territories[nextRow][nextCol];
        if (first === second) continue;
        adjacency[first].add(second);
        adjacency[second].add(first);
      }
    }
  }
  const groups = partitionTerritories(adjacency, stars, rng);
  if (!groups) return null;
  const regionByTerritory = new Map();
  groups.forEach((group, region) => group.forEach((item) => regionByTerritory.set(item, region)));
  return territories.map((row) => row.map((item) => regionByTerritory.get(item)));
}

function solve(regions, profile, limit = 2) {
  const solver = new Logic.Solver();
  const { size, stars } = profile;
  const variables = Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, col) => `c${row}_${col}`));
  const exactly = (items) => Logic.equalBits(Logic.sum(items), Logic.constantBits(stars));
  variables.forEach((row) => solver.require(exactly(row)));
  for (let col = 0; col < size; col += 1) solver.require(exactly(variables.map((row) => row[col])));
  for (let region = 0; region < size; region += 1) {
    const items = [];
    for (let row = 0; row < size; row += 1) for (let col = 0; col < size; col += 1) if (regions[row][col] === region) items.push(variables[row][col]);
    solver.require(exactly(items));
  }
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      for (const [rowDelta, colDelta] of [[0, 1], [1, -1], [1, 0], [1, 1]]) {
        const nextRow = row + rowDelta;
        const nextCol = col + colDelta;
        if (nextRow < size && nextCol >= 0 && nextCol < size) solver.forbid(Logic.and(variables[row][col], variables[nextRow][nextCol]));
      }
    }
  }
  const flatVariables = variables.flat();
  const results = [];
  while (results.length < limit) {
    const solution = solver.solve();
    if (!solution) break;
    const starsFound = flatVariables.filter((name) => solution.evaluate(name));
    results.push(starsFound);
    const starSet = new Set(starsFound);
    solver.forbid(Logic.and(flatVariables.map((name) => starSet.has(name) ? name : Logic.not(name))));
  }
  return results;
}

function remainsConnected(regions, region, removedRow, removedCol) {
  const cells = [];
  for (let row = 0; row < regions.length; row += 1) for (let col = 0; col < regions.length; col += 1) {
    if (regions[row][col] === region && (row !== removedRow || col !== removedCol)) cells.push([row, col]);
  }
  if (!cells.length) return false;
  const visited = new Set([cells[0].join(":")]);
  const queue = [cells[0]];
  while (queue.length) {
    const [row, col] = queue.shift();
    for (const [nextRow, nextCol] of [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]) {
      const key = `${nextRow}:${nextCol}`;
      if (nextRow < 0 || nextRow >= regions.length || nextCol < 0 || nextCol >= regions.length || visited.has(key)) continue;
      if (regions[nextRow][nextCol] === region && (nextRow !== removedRow || nextCol !== removedCol)) {
        visited.add(key);
        queue.push([nextRow, nextCol]);
      }
    }
  }
  return visited.size === cells.length;
}

function tighten(regions, profile, solution, seed) {
  const rng = createRng(seed ^ 0xa5a5a5a5);
  const target = new Set(solution.flatMap((cols, row) => cols.map((col) => `${row}:${col}`)));
  const previousRegion = new Map();
  for (let step = 0; step < 160; step += 1) {
    const alternatives = solve(regions, profile, 2);
    if (alternatives.length === 1) return { regions, steps: step };
    const solutionSets = alternatives.map((item) => new Set(item.map((name) => name.slice(1).replace("_", ":"))));
    const affectedRegions = new Set();
    solutionSets.forEach((item) => item.forEach((key) => {
      if (target.has(key)) return;
      const [row, col] = key.split(":").map(Number);
      affectedRegions.add(regions[row][col]);
    }));
    const candidates = [];
    for (let row = 0; row < profile.size; row += 1) for (let col = 0; col < profile.size; col += 1) {
      const key = `${row}:${col}`;
      if (target.has(key)) continue;
      const source = regions[row][col];
      if (!affectedRegions.has(source) || !remainsConnected(regions, source, row, col)) continue;
      const destinations = new Set([[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]
        .filter(([nextRow, nextCol]) => nextRow >= 0 && nextRow < profile.size && nextCol >= 0 && nextCol < profile.size)
        .map(([nextRow, nextCol]) => regions[nextRow][nextCol])
        .filter((region) => region !== source));
      const score = solutionSets.filter((item) => item.has(key)).length;
      for (const destination of destinations) {
        if (previousRegion.get(key) !== destination) candidates.push([row, col, destination, score]);
      }
    }
    if (!candidates.length) return null;
    const bestScore = Math.max(...candidates.map((candidate) => candidate[3]));
    const best = candidates.filter((candidate) => candidate[3] === bestScore);
    const [row, col, destination] = best[randomInt(rng, best.length)];
    previousRegion.set(`${row}:${col}`, regions[row][col]);
    regions[row][col] = destination;
  }
  return null;
}

function fingerprint(puzzle) {
  return JSON.stringify(puzzle.regions);
}

function generateBases(key, profile) {
  const bases = [];
  const seen = new Set();
  for (let candidate = 0; bases.length < BASE_COUNT && candidate < 5000; candidate += 1) {
    const template = profile.templates[candidate % profile.templates.length];
    const solution = transformSolution(template, profile.size, candidate % 8);
    const regions = generateRegions(profile, solution, (candidate * 0x9e3779b9) >>> 0);
    if (!regions) continue;
    const started = performance.now();
    const result = tighten(regions, profile, solution, candidate);
    if (!result) continue;
    const puzzle = { regions: result.regions, solution };
    const transformedFingerprints = new Set(Array.from({ length: 8 }, (_, transform) => fingerprint({ regions: transformGrid(puzzle.regions, transform) })));
    if ([...transformedFingerprints].some((value) => seen.has(value))) continue;
    transformedFingerprints.forEach((value) => seen.add(value));
    bases.push(puzzle);
    console.log(`${key}: base ${bases.length}/${BASE_COUNT}, candidate ${candidate}, tighten ${result.steps}, ${(performance.now() - started).toFixed(0)}ms`);
  }
  if (bases.length < BASE_COUNT) throw new Error(`${key}: generated only ${bases.length}/${BASE_COUNT} unique bases`);
  return bases;
}

const catalog = Object.fromEntries(Object.entries(PROFILES).map(([key, profile]) => [key, {
  size: profile.size,
  stars: profile.stars,
  bases: generateBases(key, profile)
}]));
const source = `window.DLL_TWO_NOT_TOUCH_CATALOG=${JSON.stringify(catalog)};\n`;
writeFileSync(path.join(ROOT, "two-not-touch-catalog.js"), source, "utf8");
console.log(`wrote two-not-touch-catalog.js with ${BASE_COUNT * 8} deterministic variants per multi-star mode`);
