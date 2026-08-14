(function initTwoNotTouchCore(root) {
  const profiles = {
    quick: { key: "quick", starMode: "1star", size: 7, starsPerGroup: 1 },
    classic: { key: "classic", starMode: "2star", size: 10, starsPerGroup: 2 },
    expert: { key: "expert", starMode: "3star", size: 14, starsPerGroup: 3 }
  };
  const quickSolutions = buildQuickSolutions(profiles.quick);

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

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

  function buildQuickSolutions(profile) {
    const permutations = [];
    function walk(cols) {
      const row = cols.length;
      if (row === profile.size) {
        permutations.push(cols.map((col) => [col]));
        return;
      }
      for (let col = 0; col < profile.size; col += 1) {
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

  function generateQuickRegions(solution, profile, rng) {
    const grid = Array.from({ length: profile.size }, () => Array(profile.size).fill(-1));
    const assigned = [];
    const unassigned = new Set();
    for (let row = 0; row < profile.size; row += 1) for (let col = 0; col < profile.size; col += 1) unassigned.add(`${row}-${col}`);
    solution.forEach(([col], row) => {
      grid[row][col] = row;
      assigned.push([row, col]);
      unassigned.delete(`${row}-${col}`);
    });
    let guard = 0;
    while (unassigned.size && guard < 10000) {
      guard += 1;
      const [sourceRow, sourceCol] = assigned[randomInt(rng, assigned.length)];
      const options = [[sourceRow - 1, sourceCol], [sourceRow + 1, sourceCol], [sourceRow, sourceCol - 1], [sourceRow, sourceCol + 1]]
        .filter(([row, col]) => row >= 0 && row < profile.size && col >= 0 && col < profile.size && unassigned.has(`${row}-${col}`));
      if (!options.length) continue;
      const [row, col] = options[randomInt(rng, options.length)];
      grid[row][col] = grid[sourceRow][sourceCol];
      assigned.push([row, col]);
      unassigned.delete(`${row}-${col}`);
    }
    return unassigned.size ? null : grid;
  }

  function solveQuick(regions, profile, limit = 2) {
    const solutions = [];
    const usedCols = Array(profile.size).fill(false);
    const usedRegions = Array(profile.size).fill(false);
    function walk(row, cols) {
      if (solutions.length >= limit) return;
      if (row === profile.size) {
        solutions.push(cols.map((col) => [col]));
        return;
      }
      for (let col = 0; col < profile.size; col += 1) {
        const region = regions[row][col];
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

  function transformGrid(grid, transform) {
    let result = grid.map((row) => [...row]);
    if (transform >= 4) result = result.map((row) => [...row].reverse());
    for (let turn = 0; turn < transform % 4; turn += 1) result = result[0].map((_, col) => result.map((row) => row[col]).reverse());
    return result;
  }

  function transformSolution(solution, size, transform) {
    const grid = Array.from({ length: size }, () => Array(size).fill(false));
    solution.forEach((cols, row) => cols.forEach((col) => { grid[row][col] = true; }));
    return transformGrid(grid, transform).map((row) => row.flatMap((star, col) => star ? [col] : []));
  }

  function generatePuzzle(profileKey, baseSeed, id, catalog = root.DLL_TWO_NOT_TOUCH_CATALOG || {}) {
    const profile = profiles[profileKey] || profiles.quick;
    const normalizedSeed = baseSeed >>> 0;
    if (profile.starsPerGroup > 1) {
      const source = catalog[profile.key];
      if (!source?.bases?.length) throw new Error(`Missing ${profile.key} Two Not Touch catalog.`);
      const variant = normalizedSeed % (source.bases.length * 8);
      const base = source.bases[Math.floor(variant / 8)];
      const transform = variant % 8;
      return { id, profileKey: profile.key, seed: normalizedSeed, attempt: 0, solution: transformSolution(base.solution, profile.size, transform), regions: transformGrid(base.regions, transform) };
    }
    for (let attempt = 0; attempt < 5000; attempt += 1) {
      const rng = createRng((normalizedSeed + attempt * 0x9e3779b9) >>> 0);
      const solution = quickSolutions[randomInt(rng, quickSolutions.length)];
      const regions = generateQuickRegions(solution, profile, rng);
      if (!regions) continue;
      const solutions = solveQuick(regions, profile, 2);
      if (solutions.length === 1) return { id, profileKey: profile.key, seed: normalizedSeed, attempt, solution: solutions[0], regions };
    }
    throw new Error("Could not generate a unique-solution Two Not Touch puzzle.");
  }

  function validateSolution(puzzle) {
    const profile = profiles[puzzle.profileKey];
    const rowCounts = Array(profile.size).fill(0);
    const colCounts = Array(profile.size).fill(0);
    const regionCounts = Array(profile.size).fill(0);
    const stars = [];
    puzzle.solution.forEach((cols, row) => cols.forEach((col) => {
      rowCounts[row] += 1;
      colCounts[col] += 1;
      regionCounts[puzzle.regions[row][col]] += 1;
      stars.push([row, col]);
    }));
    if (!rowCounts.every((count) => count === profile.starsPerGroup)) return false;
    if (!colCounts.every((count) => count === profile.starsPerGroup)) return false;
    if (!regionCounts.every((count) => count === profile.starsPerGroup)) return false;
    return stars.every(([row, col], index) => stars.slice(index + 1).every(([otherRow, otherCol]) => Math.abs(row - otherRow) > 1 || Math.abs(col - otherCol) > 1));
  }

  function fingerprint(puzzle) {
    return JSON.stringify(puzzle.regions);
  }

  root.DLL_TWO_NOT_TOUCH_CORE = { profiles, hashString, generatePuzzle, validateSolution, fingerprint, solveQuick };
})(typeof window === "undefined" ? globalThis : window);
