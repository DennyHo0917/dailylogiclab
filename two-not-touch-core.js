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

  function progressStorageKey(mode, profileKey) {
    return `dll-two-not-touch-progress-v2-${mode}-${profileKey}`;
  }

  function dateNumber(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return Math.floor(date.getTime() / 86400000);
  }

  function nextDailyStreak(previousDate, currentStreak, today) {
    const todayNumber = dateNumber(today);
    const previousNumber = dateNumber(previousDate);
    const streak = Number.isInteger(Number(currentStreak)) && Number(currentStreak) > 0 ? Number(currentStreak) : 0;
    if (todayNumber === null) return 1;
    if (previousNumber === todayNumber) return streak || 1;
    if (previousNumber === todayNumber - 1) return streak + 1;
    return 1;
  }

  function parseProgressJson(value) {
    if (typeof value !== "string" || !value) return null;
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  function normalizeProgress(saved, expected) {
    if (!saved || typeof saved !== "object" || Array.isArray(saved) || ![1, 2].includes(saved.version) ||
        (saved.version === 2 && saved.game !== "two-not-touch") || saved.mode !== expected.mode ||
        saved.profileKey !== expected.profileKey || !profiles[saved.profileKey]) return null;
    const puzzleDate = saved.version === 1 ? String(saved.date || "") : saved.puzzleDate;
    if (typeof puzzleDate !== "string" || (saved.mode === "daily"
      ? dateNumber(puzzleDate) === null || puzzleDate !== expected.puzzleDate
      : puzzleDate !== "")) return null;
    const validId = (typeof saved.id === "string" && saved.id.length > 0) ||
      (Number.isInteger(saved.id) && Number.isFinite(saved.id));
    const expectedPenalty = expected.hintPenalties.slice(0, saved.hintCount).reduce((sum, value) => sum + value, 0);
    if (!Number.isInteger(saved.seed) || saved.seed < 0 || saved.seed > 0xffffffff || saved.seed !== expected.seed ||
        !validId || saved.id !== expected.id || !Number.isFinite(saved.elapsed) || saved.elapsed < 0 ||
        (saved.version === 2 && !Number.isInteger(saved.elapsed)) || typeof saved.started !== "boolean" ||
        !Number.isInteger(saved.hintCount) || saved.hintCount < 0 || saved.hintCount > expected.maxHints ||
        !Number.isInteger(saved.hintPenalty) || saved.hintPenalty !== expectedPenalty ||
        (!saved.started && saved.elapsed !== 0)) return null;
    if (!Array.isArray(saved.cells) || saved.cells.length !== expected.size ||
        saved.cells.some((row) => !Array.isArray(row) || row.length !== expected.size || row.some((value) => ![0, 1, 2].includes(value)))) return null;
    return {
      version: 2,
      game: "two-not-touch",
      mode: saved.mode,
      profileKey: saved.profileKey,
      puzzleDate,
      seed: saved.seed,
      id: saved.id,
      cells: saved.cells.map((row) => [...row]),
      elapsed: Math.floor(saved.elapsed),
      started: saved.started,
      hintCount: saved.hintCount,
      hintPenalty: saved.hintPenalty
    };
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

  function countSolutions(puzzle, cells, limit = 2) {
    const profile = profiles[puzzle.profileKey];
    if (!profile || limit < 1) return 0;
    const { size, starsPerGroup } = profile;
    const index = (row, col) => row * size + col;
    const groups = [];
    for (let row = 0; row < size; row += 1) groups.push(Array.from({ length: size }, (_, col) => index(row, col)));
    for (let col = 0; col < size; col += 1) groups.push(Array.from({ length: size }, (_, row) => index(row, col)));
    for (let region = 0; region < size; region += 1) {
      const group = [];
      for (let row = 0; row < size; row += 1) for (let col = 0; col < size; col += 1) {
        if (puzzle.regions[row][col] === region) group.push(index(row, col));
      }
      groups.push(group);
    }
    const cellGroups = Array.from({ length: size * size }, () => []);
    groups.forEach((group, groupIndex) => group.forEach((cell) => cellGroups[cell].push(groupIndex)));
    const neighbors = Array.from({ length: size * size }, (_, cell) => {
      const row = Math.floor(cell / size);
      const col = cell % size;
      const nearby = [];
      for (let rowDelta = -1; rowDelta <= 1; rowDelta += 1) for (let colDelta = -1; colDelta <= 1; colDelta += 1) {
        if (!rowDelta && !colDelta) continue;
        const nextRow = row + rowDelta;
        const nextCol = col + colDelta;
        if (nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size) nearby.push(index(nextRow, nextCol));
      }
      return nearby;
    });
    const initial = Array.from({ length: size * size }, (_, cell) => {
      const row = Math.floor(cell / size);
      const col = cell % size;
      return [0, 1, 2].includes(cells?.[row]?.[col]) ? cells[row][col] : 0;
    });
    let count = 0;

    function assign(board, cell, value) {
      if (board[cell] && board[cell] !== value) return false;
      board[cell] = value;
      return true;
    }

    function propagate(board) {
      let changed = true;
      while (changed) {
        changed = false;
        for (let cell = 0; cell < board.length; cell += 1) {
          if (board[cell] !== 1) continue;
          for (const neighbor of neighbors[cell]) {
            if (board[neighbor] === 1) return false;
            if (board[neighbor] === 0) {
              board[neighbor] = 2;
              changed = true;
            }
          }
        }
        for (const group of groups) {
          const stars = group.filter((cell) => board[cell] === 1).length;
          const unknown = group.filter((cell) => board[cell] === 0);
          if (stars > starsPerGroup || stars + unknown.length < starsPerGroup) return false;
          if (stars === starsPerGroup || stars + unknown.length === starsPerGroup) {
            const value = stars === starsPerGroup ? 2 : 1;
            for (const cell of unknown) {
              if (!assign(board, cell, value)) return false;
              changed = true;
            }
          }
        }
      }
      return true;
    }

    function walk(board) {
      if (count >= limit) return;
      if (!propagate(board)) return;
      const unknown = board.flatMap((value, cell) => value === 0 ? [cell] : []);
      if (!unknown.length) {
        count += 1;
        return;
      }
      const cell = unknown.sort((first, second) => {
        const pressure = (candidate) => Math.min(...cellGroups[candidate].map((groupIndex) => groups[groupIndex].filter((item) => board[item] === 0).length));
        return pressure(first) - pressure(second);
      })[0];
      for (const value of [1, 2]) {
        const next = [...board];
        next[cell] = value;
        walk(next);
        if (count >= limit) return;
      }
    }
    walk(initial);
    return count;
  }

  /**
   * Return the first deterministic, local deduction visible from the marks.
   * Coordinates are [row, col] and use the same zero-based indexing as cells.
   */
  function analyzeBoard(puzzle, cells) {
    const profile = profiles[puzzle?.profileKey];
    const regions = puzzle?.regions;
    if (!profile || !Array.isArray(regions) || regions.length !== profile.size ||
        regions.some((row) => !Array.isArray(row) || row.length !== profile.size ||
          row.some((region) => !Number.isInteger(region) || region < 0 || region >= profile.size))) return null;

    const { size, starsPerGroup } = profile;
    const board = [];
    for (let row = 0; row < size; row += 1) {
      if (!Array.isArray(cells?.[row]) || cells[row].length !== size || cells[row].some((value) => ![0, 1, 2].includes(value))) return null;
      board.push([...cells[row]]);
    }

    const index = (row, col) => row * size + col;
    const coordinates = (cellIndexes) => cellIndexes.map((cell) => [Math.floor(cell / size), cell % size]);
    const rowStars = Array(size).fill(0);
    const columnStars = Array(size).fill(0);
    const regionStars = Array(size).fill(0);
    for (let row = 0; row < size; row += 1) for (let col = 0; col < size; col += 1) {
      if (board[row][col] !== 1) continue;
      rowStars[row] += 1;
      columnStars[col] += 1;
      regionStars[regions[row][col]] += 1;
    }
    if ([...rowStars, ...columnStars, ...regionStars].some((count) => count > starsPerGroup)) return null;

    const neighbors = (cell) => {
      const row = Math.floor(cell / size);
      const col = cell % size;
      const nearby = [];
      for (let rowDelta = -1; rowDelta <= 1; rowDelta += 1) for (let colDelta = -1; colDelta <= 1; colDelta += 1) {
        if (!rowDelta && !colDelta) continue;
        const nextRow = row + rowDelta;
        const nextCol = col + colDelta;
        if (nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size) nearby.push(index(nextRow, nextCol));
      }
      return nearby;
    };

    for (let cell = 0; cell < size * size; cell += 1) {
      if (board[Math.floor(cell / size)][cell % size] !== 1) continue;
      if (neighbors(cell).some((neighbor) => board[Math.floor(neighbor / size)][neighbor % size] === 1)) return null;
      const row = Math.floor(cell / size);
      const col = cell % size;
      const targets = neighbors(cell).filter((neighbor) => board[Math.floor(neighbor / size)][neighbor % size] === 0);
      if (targets.length) {
        return {
          technique: "star_adjacency",
          targetCells: coordinates(targets),
          evidenceCells: [[row, col]],
          action: "block",
          explanationData: { rule: "star-blocks-eight-neighbors", starCell: [row, col], adjacentCount: targets.length }
        };
      }
    }

    const groups = [];
    for (let row = 0; row < size; row += 1) groups.push({ type: "row", index: row, cells: Array.from({ length: size }, (_, col) => index(row, col)) });
    for (let col = 0; col < size; col += 1) groups.push({ type: "column", index: col, cells: Array.from({ length: size }, (_, row) => index(row, col)) });
    for (let region = 0; region < size; region += 1) {
      groups.push({
        type: "region",
        index: region,
        cells: Array.from({ length: size * size }, (_, cell) => cell).filter((cell) => regions[Math.floor(cell / size)][cell % size] === region)
      });
    }

    const legalCandidate = (cell) => {
      const row = Math.floor(cell / size);
      const col = cell % size;
      return board[row][col] === 0 &&
        !neighbors(cell).some((neighbor) => board[Math.floor(neighbor / size)][neighbor % size] === 1) &&
        rowStars[row] < starsPerGroup && columnStars[col] < starsPerGroup && regionStars[regions[row][col]] < starsPerGroup;
    };
    const compatibleStarSet = (targetCells) => {
      const targetSet = new Set(targetCells);
      const additions = Array.from({ length: size * 3 }, () => 0);
      for (const cell of targetCells) {
        if (neighbors(cell).some((neighbor) => targetSet.has(neighbor))) return false;
        const row = Math.floor(cell / size);
        const col = cell % size;
        additions[row] += 1;
        additions[size + col] += 1;
        additions[size * 2 + regions[row][col]] += 1;
      }
      return additions.every((count, groupIndex) => {
        const current = groupIndex < size ? rowStars[groupIndex]
          : groupIndex < size * 2 ? columnStars[groupIndex - size]
            : regionStars[groupIndex - size * 2];
        return current + count <= starsPerGroup;
      });
    };
    const groupStates = groups.map((group) => {
      const stars = group.cells.filter((cell) => board[Math.floor(cell / size)][cell % size] === 1);
      const empty = group.cells.filter((cell) => board[Math.floor(cell / size)][cell % size] === 0);
      return { group, stars, empty, candidates: empty.filter(legalCandidate) };
    });

    for (const state of groupStates) {
      if (state.stars.length === starsPerGroup && state.empty.length) {
        return {
          technique: "group_completed",
          targetCells: coordinates(state.empty),
          evidenceCells: coordinates(state.stars),
          action: "block",
          explanationData: {
            groupType: state.group.type,
            groupIndex: state.group.index,
            requiredStars: starsPerGroup,
            placedStars: state.stars.length,
            targetCount: state.empty.length
          }
        };
      }
    }

    for (const state of groupStates) {
      const remainingStars = starsPerGroup - state.stars.length;
      if (remainingStars > 0 && state.candidates.length === remainingStars && compatibleStarSet(state.candidates)) {
        const evidence = state.group.cells.filter((cell) => !state.candidates.includes(cell));
        return {
          technique: "forced_candidates",
          targetCells: coordinates(state.candidates),
          evidenceCells: coordinates(evidence.length ? evidence : state.candidates),
          action: "star",
          explanationData: {
            groupType: state.group.type,
            groupIndex: state.group.index,
            remainingStars,
            candidateCells: coordinates(state.candidates)
          }
        };
      }
    }

    const interactionDirections = [
      ["region", "row"],
      ["region", "column"],
      ["row", "region"],
      ["column", "region"]
    ];
    for (const [sourceType, targetType] of interactionDirections) {
      for (const source of groupStates.filter((state) => state.group.type === sourceType)) {
        const sourceRemaining = starsPerGroup - source.stars.length;
        if (sourceRemaining <= 0 || source.candidates.length < sourceRemaining) continue;
        const sourceSet = new Set(source.candidates);
        for (const target of groupStates.filter((state) => state.group.type === targetType)) {
          const targetRemaining = starsPerGroup - target.stars.length;
          if (targetRemaining !== sourceRemaining || target.candidates.length < targetRemaining) continue;
          const targetSet = new Set(target.candidates);
          if (!source.candidates.every((cell) => targetSet.has(cell))) continue;
          const eliminated = target.candidates.filter((cell) => !sourceSet.has(cell));
          if (!eliminated.length) continue;
          const sourceCandidateCells = coordinates(source.candidates);
          const targetCandidateCells = coordinates(target.candidates);
          return {
            technique: "group_interaction",
            targetCells: coordinates(eliminated),
            evidenceCells: sourceCandidateCells,
            action: "block",
            explanationData: {
              direction: `${sourceType}_to_${targetType}`,
              sourceGroupType: sourceType,
              sourceGroupIndex: source.group.index,
              targetGroupType: targetType,
              targetGroupIndex: target.group.index,
              remainingStars: sourceRemaining,
              sourceCandidateCells,
              targetCandidateCells,
              eliminatedCells: coordinates(eliminated)
            }
          };
        }
      }
    }
    return null;
  }

  function scoreHumanDifficulty(puzzle) {
    const weights = {
      star_adjacency: 1,
      group_completed: 1,
      forced_candidates: 2,
      group_interaction: 3
    };
    const techniqueCounts = Object.fromEntries(Object.keys(weights).map((technique) => [technique, 0]));
    const profile = profiles[puzzle?.profileKey];
    if (!profile) return { score: 0, level: null, techniqueCounts, steps: 0, stalled: true };

    const cells = Array.from({ length: profile.size }, () => Array(profile.size).fill(0));
    const hasUnknown = () => cells.some((row) => row.some((value) => value === 0));
    let score = 0;
    let steps = 0;
    let level = null;
    let levelWeight = 0;
    let stalled = false;

    while (hasUnknown()) {
      const deduction = analyzeBoard(puzzle, cells);
      const weight = deduction && weights[deduction.technique];
      if (!deduction || !weight || !Array.isArray(deduction.targetCells) || !deduction.targetCells.length) {
        stalled = true;
        break;
      }

      const value = deduction.action === "star" ? 1 : deduction.action === "block" ? 2 : 0;
      const targets = [];
      const seen = new Set();
      for (const cell of deduction.targetCells) {
        if (!Array.isArray(cell) || cell.length !== 2 || !Number.isInteger(cell[0]) || !Number.isInteger(cell[1]) ||
            cell[0] < 0 || cell[0] >= profile.size || cell[1] < 0 || cell[1] >= profile.size) {
          targets.length = 0;
          break;
        }
        const key = `${cell[0]}-${cell[1]}`;
        if (seen.has(key) || cells[cell[0]][cell[1]] !== 0) {
          targets.length = 0;
          break;
        }
        seen.add(key);
        targets.push(cell);
      }
      if (!value || !targets.length) {
        stalled = true;
        break;
      }

      targets.forEach(([row, col]) => { cells[row][col] = value; });
      techniqueCounts[deduction.technique] += 1;
      score += weight;
      steps += 1;
      if (weight > levelWeight) {
        level = deduction.technique;
        levelWeight = weight;
      }
    }

    if (!hasUnknown()) stalled = false;
    return { score, level, techniqueCounts, steps, stalled };
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

  root.DLL_TWO_NOT_TOUCH_CORE = { profiles, hashString, progressStorageKey, nextDailyStreak, parseProgressJson, normalizeProgress, countSolutions, analyzeBoard, scoreHumanDifficulty, generatePuzzle, validateSolution, fingerprint, solveQuick };
})(typeof window === "undefined" ? globalThis : window);
