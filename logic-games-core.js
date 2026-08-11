(function exposeLogicGameCore(root) {
  "use strict";

  const DIFFICULTIES = {
    easy: { label: "Easy", index: 0 },
    medium: { label: "Medium", index: 1 },
    hard: { label: "Hard", index: 2 }
  };

  const GAME_ORDER = ["tents-and-trees", "hashi", "slitherlink", "nonogram"];

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
    return function nextRandom() {
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

  function shuffle(items, rng) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = randomInt(rng, index + 1);
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function cellKey(row, col) {
    return `${row}:${col}`;
  }

  function parseCellKey(value) {
    return value.split(":").map(Number);
  }

  function inside(row, col, size) {
    return row >= 0 && row < size && col >= 0 && col < size;
  }

  function orthogonalNeighbors(row, col, size) {
    return [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1]
    ].filter(([nextRow, nextCol]) => inside(nextRow, nextCol, size));
  }

  function kingAdjacent(first, second) {
    return Math.abs(first[0] - second[0]) <= 1 && Math.abs(first[1] - second[1]) <= 1;
  }

  function countRuns(line) {
    const runs = [];
    let run = 0;
    for (const value of line) {
      if (value) {
        run += 1;
      } else if (run) {
        runs.push(run);
        run = 0;
      }
    }
    if (run) runs.push(run);
    return runs;
  }

  function sameArray(first, second) {
    return first.length === second.length && first.every((value, index) => value === second[index]);
  }

  // Tents and Trees -------------------------------------------------------

  const TENT_PROFILES = {
    easy: { size: 6, trees: 5 },
    medium: { size: 8, trees: 8 },
    hard: { size: 10, trees: 12 }
  };

  function tentCandidatesForTree(puzzle, tree) {
    const treeSet = new Set(puzzle.trees.map(([row, col]) => cellKey(row, col)));
    return orthogonalNeighbors(tree[0], tree[1], puzzle.size).filter(
      ([row, col]) => !treeSet.has(cellKey(row, col))
    );
  }

  function solveTents(puzzle, limit = 2) {
    const solutions = [];
    const treeOrder = puzzle.trees
      .map((tree, index) => ({ tree, index, candidates: tentCandidatesForTree(puzzle, tree) }))
      .sort((first, second) => first.candidates.length - second.candidates.length);
    const chosen = [];
    const used = new Set();
    const rowCounts = Array(puzzle.size).fill(0);
    const colCounts = Array(puzzle.size).fill(0);

    if (treeOrder.some(({ candidates }) => !candidates.length)) return solutions;

    function walk(index) {
      if (solutions.length >= limit) return;
      if (index === treeOrder.length) {
        if (rowCounts.every((count, row) => count === puzzle.rowClues[row]) &&
            colCounts.every((count, col) => count === puzzle.colClues[col])) {
          solutions.push(chosen.map(([row, col]) => [row, col]));
        }
        return;
      }

      const { candidates } = treeOrder[index];
      for (const [row, col] of candidates) {
        const key = cellKey(row, col);
        if (used.has(key) || rowCounts[row] >= puzzle.rowClues[row] || colCounts[col] >= puzzle.colClues[col]) {
          continue;
        }
        if (chosen.some((tent) => kingAdjacent(tent, [row, col]))) continue;
        used.add(key);
        chosen.push([row, col]);
        rowCounts[row] += 1;
        colCounts[col] += 1;
        walk(index + 1);
        colCounts[col] -= 1;
        rowCounts[row] -= 1;
        chosen.pop();
        used.delete(key);
      }
    }

    walk(0);
    return solutions;
  }

  function generateTents(seed, difficulty) {
    const profile = TENT_PROFILES[difficulty] || TENT_PROFILES.medium;
    const rng = createRng(seed);
    const allCells = Array.from({ length: profile.size }, (_, row) =>
      Array.from({ length: profile.size }, (_, col) => [row, col])
    ).flat();

    for (let attempt = 0; attempt < 400; attempt += 1) {
      const tents = [];
      const trees = [];
      const usedTrees = new Set();
      for (const [row, col] of shuffle(allCells, rng)) {
        if (tents.length >= profile.trees) break;
        if (tents.some((tent) => kingAdjacent(tent, [row, col]))) continue;
        const candidates = shuffle(orthogonalNeighbors(row, col, profile.size), rng).filter(
          ([treeRow, treeCol]) => !usedTrees.has(cellKey(treeRow, treeCol)) &&
            !tents.some(([tentRow, tentCol]) => tentRow === treeRow && tentCol === treeCol)
        );
        if (!candidates.length) continue;
        tents.push([row, col]);
        trees.push(candidates[0]);
        usedTrees.add(cellKey(candidates[0][0], candidates[0][1]));
      }
      if (tents.length !== profile.trees) continue;
      if (trees.some(([treeRow, treeCol]) => tents.filter(([tentRow, tentCol]) =>
        Math.abs(tentRow - treeRow) + Math.abs(tentCol - treeCol) === 1
      ).length !== 1)) continue;
      if (tents.some(([tentRow, tentCol]) => trees.filter(([treeRow, treeCol]) =>
        Math.abs(tentRow - treeRow) + Math.abs(tentCol - treeCol) === 1
      ).length !== 1)) continue;

      const rowClues = Array(profile.size).fill(0);
      const colClues = Array(profile.size).fill(0);
      tents.forEach(([row, col]) => {
        rowClues[row] += 1;
        colClues[col] += 1;
      });
      const puzzle = {
        type: "tents-and-trees",
        size: profile.size,
        trees,
        rowClues,
        colClues,
        solutionTents: tents
      };
      const solutions = solveTents(puzzle, 2);
      if (solutions.length === 1) {
        puzzle.solutionTents = solutions[0];
        puzzle.unique = true;
        return puzzle;
      }
    }

    throw new Error("Could not generate a unique Tents and Trees puzzle.");
  }

  function validateTents(puzzle, tentKeys) {
    const tents = [...tentKeys].map(parseCellKey);
    const solution = new Set(puzzle.solutionTents.map(([row, col]) => cellKey(row, col)));
    const treeSet = new Set(puzzle.trees.map(([row, col]) => cellKey(row, col)));
    const errors = new Set();
    const rowCounts = Array(puzzle.size).fill(0);
    const colCounts = Array(puzzle.size).fill(0);

    tents.forEach(([row, col]) => {
      const key = cellKey(row, col);
      rowCounts[row] += 1;
      colCounts[col] += 1;
      if (treeSet.has(key) || !solution.has(key)) errors.add(key);
    });
    for (let first = 0; first < tents.length; first += 1) {
      for (let second = first + 1; second < tents.length; second += 1) {
        if (kingAdjacent(tents[first], tents[second])) {
          errors.add(cellKey(...tents[first]));
          errors.add(cellKey(...tents[second]));
        }
      }
    }
    rowCounts.forEach((count, row) => {
      if (count > puzzle.rowClues[row]) tents.filter(([tentRow]) => tentRow === row)
        .forEach(([tentRow, col]) => errors.add(cellKey(tentRow, col)));
    });
    colCounts.forEach((count, col) => {
      if (count > puzzle.colClues[col]) tents.filter(([, tentCol]) => tentCol === col)
        .forEach(([row, tentCol]) => errors.add(cellKey(row, tentCol)));
    });
    const allCluesMatch = rowCounts.every((count, row) => count === puzzle.rowClues[row]) &&
      colCounts.every((count, col) => count === puzzle.colClues[col]);
    const everyTreeHasTent = puzzle.trees.every(([treeRow, treeCol]) =>
      tents.filter(([row, col]) => Math.abs(row - treeRow) + Math.abs(col - treeCol) === 1).length === 1
    );
    return {
      errors,
      completed: !errors.size && allCluesMatch && everyTreeHasTent && tents.length === puzzle.trees.length,
      rowCounts,
      colCounts
    };
  }

  // Hashi -----------------------------------------------------------------

  const HASHI_PROFILES = {
    easy: { size: 7, axes: 3, islands: 7, extraChance: 0.08, doubleChance: 0.12 },
    medium: { size: 9, axes: 4, islands: 10, extraChance: 0.16, doubleChance: 0.24 },
    hard: { size: 11, axes: 5, islands: 13, extraChance: 0.24, doubleChance: 0.34 }
  };

  function hashiEdgeKey(first, second) {
    return first < second ? `${first}-${second}` : `${second}-${first}`;
  }

  function getVisibleHashiEdges(islands) {
    const edges = [];
    for (let first = 0; first < islands.length; first += 1) {
      for (let second = first + 1; second < islands.length; second += 1) {
        const [firstRow, firstCol] = islands[first];
        const [secondRow, secondCol] = islands[second];
        if (firstRow !== secondRow && firstCol !== secondCol) continue;
        const between = islands.some(([row, col], index) => {
          if (index === first || index === second) return false;
          return firstRow === secondRow
            ? row === firstRow && col > Math.min(firstCol, secondCol) && col < Math.max(firstCol, secondCol)
            : col === firstCol && row > Math.min(firstRow, secondRow) && row < Math.max(firstRow, secondRow);
        });
        if (!between) edges.push({ a: first, b: second, key: hashiEdgeKey(first, second) });
      }
    }
    return edges;
  }

  function solveHashi(puzzle, limit = 2) {
    const edges = puzzle.edges;
    const incident = Array.from({ length: puzzle.islands.length }, () => []);
    edges.forEach((edge, index) => {
      incident[edge.a].push(index);
      incident[edge.b].push(index);
    });
    const crossings = edges.map(() => []);
    edges.forEach((first, index) => edges.slice(index + 1).forEach((second, offset) => {
      const secondIndex = index + 1 + offset;
      if (hashEdgesCross(puzzle, first, second)) {
        crossings[index].push(secondIndex);
        crossings[secondIndex].push(index);
      }
    }));
    const values = new Int8Array(edges.length).fill(-1);
    const degrees = new Int8Array(puzzle.islands.length);
    const solutions = [];

    function feasible() {
      for (let island = 0; island < incident.length; island += 1) {
        let capacity = degrees[island];
        for (const edgeIndex of incident[island]) if (values[edgeIndex] < 0) capacity += 2;
        if (degrees[island] > puzzle.clues[island] || capacity < puzzle.clues[island]) return false;
      }
      return true;
    }

    function legalValues(index) {
      const edge = edges[index];
      const blocked = crossings[index].some((other) => values[other] > 0);
      const max = blocked ? 0 : Math.min(2, puzzle.clues[edge.a] - degrees[edge.a], puzzle.clues[edge.b] - degrees[edge.b]);
      const result = [];
      for (let value = 0; value <= max; value += 1) result.push(value);
      return result;
    }

    function connected() {
      const seen = new Set([0]);
      const queue = [0];
      while (queue.length) {
        const current = queue.shift();
        incident[current].forEach((edgeIndex) => {
          if (values[edgeIndex] <= 0) return;
          const edge = edges[edgeIndex];
          const next = edge.a === current ? edge.b : edge.a;
          if (!seen.has(next)) { seen.add(next); queue.push(next); }
        });
      }
      return seen.size === puzzle.islands.length;
    }

    function walk(remaining) {
      if (solutions.length >= limit || !feasible()) return;
      if (!remaining) {
        if (!degrees.every((degree, island) => degree === puzzle.clues[island]) || !connected()) return;
        const solution = new Map();
        edges.forEach((edge, index) => { if (values[index] > 0) solution.set(edge.key, values[index]); });
        solutions.push(solution);
        return;
      }
      let chosen = -1;
      let choices = null;
      for (let index = 0; index < edges.length; index += 1) {
        if (values[index] >= 0) continue;
        const nextChoices = legalValues(index);
        if (!nextChoices.length) return;
        if (!choices || nextChoices.length < choices.length) {
          chosen = index;
          choices = nextChoices;
          if (choices.length === 1) break;
        }
      }
      const edge = edges[chosen];
      for (const value of choices) {
        values[chosen] = value;
        degrees[edge.a] += value;
        degrees[edge.b] += value;
        walk(remaining - 1);
        degrees[edge.b] -= value;
        degrees[edge.a] -= value;
        values[chosen] = -1;
        if (solutions.length >= limit) return;
      }
    }

    walk(edges.length);
    return solutions;
  }

  function generateHashi(seed, difficulty) {
    const profile = HASHI_PROFILES[difficulty] || HASHI_PROFILES.medium;
    const rng = createRng(seed);
    const coordinates = Array.from({ length: profile.size - 2 }, (_, index) => index + 1);

    for (let attempt = 0; attempt < 240; attempt += 1) {
      const rows = shuffle(coordinates, rng).slice(0, profile.axes).sort((a, b) => a - b);
      const cols = shuffle(coordinates, rng).slice(0, profile.axes).sort((a, b) => a - b);
      const candidates = rows.flatMap((row) => cols.map((col) => [row, col]));
      const selected = [candidates[randomInt(rng, candidates.length)]];
      const selectedKeys = new Set([cellKey(...selected[0])]);
      while (selected.length < profile.islands) {
        const frontier = candidates.filter(([row, col]) => !selectedKeys.has(cellKey(row, col)) && selected.some(([otherRow, otherCol]) =>
          (row === otherRow && Math.abs(cols.indexOf(col) - cols.indexOf(otherCol)) === 1) ||
          (col === otherCol && Math.abs(rows.indexOf(row) - rows.indexOf(otherRow)) === 1)
        ));
        if (!frontier.length) break;
        const next = frontier[randomInt(rng, frontier.length)];
        selected.push(next);
        selectedKeys.add(cellKey(...next));
      }
      if (selected.length !== profile.islands) continue;
      selected.sort(([firstRow, firstCol], [secondRow, secondCol]) => firstRow - secondRow || firstCol - secondCol);
      const puzzle = { type: "hashi", size: profile.size, islands: selected };
      puzzle.edges = getVisibleHashiEdges(selected);
      const parent = Array.from({ length: selected.length }, (_, index) => index);
      const find = (value) => parent[value] === value ? value : (parent[value] = find(parent[value]));
      const chosen = [];
      for (const edge of shuffle(puzzle.edges, rng)) {
        if (find(edge.a) === find(edge.b) || chosen.some((other) => hashEdgesCross(puzzle, edge, other))) continue;
        parent[find(edge.a)] = find(edge.b);
        chosen.push(edge);
      }
      if (new Set(parent.map((_, index) => find(index))).size !== 1) continue;
      for (const edge of shuffle(puzzle.edges, rng)) {
        if (chosen.includes(edge) || rng() >= profile.extraChance || chosen.some((other) => hashEdgesCross(puzzle, edge, other))) continue;
        chosen.push(edge);
      }
      const solution = new Map(chosen.map((edge) => [edge.key, rng() < profile.doubleChance ? 2 : 1]));
      puzzle.clues = Array(selected.length).fill(0);
      solution.forEach((count, key) => {
        const [a, b] = key.split("-").map(Number);
        puzzle.clues[a] += count;
        puzzle.clues[b] += count;
      });
      const solutions = solveHashi(puzzle, 2);
      if (solutions.length !== 1) continue;
      puzzle.solution = solutions[0];
      puzzle.unique = true;
      return puzzle;
    }
    throw new Error("Could not generate a unique Hashi puzzle.");
  }

  function hashEdgeDescriptor(puzzle, edge) {
    const [firstRow, firstCol] = puzzle.islands[edge.a];
    const [secondRow, secondCol] = puzzle.islands[edge.b];
    return {
      horizontal: firstRow === secondRow,
      row: firstRow === secondRow ? firstRow : Math.min(firstRow, secondRow),
      col: firstRow === secondRow ? Math.min(firstCol, secondCol) : firstCol,
      endRow: Math.max(firstRow, secondRow),
      endCol: Math.max(firstCol, secondCol)
    };
  }

  function hashEdgesCross(puzzle, first, second) {
    const a = hashEdgeDescriptor(puzzle, first);
    const b = hashEdgeDescriptor(puzzle, second);
    if (a.horizontal === b.horizontal) return false;
    const horizontal = a.horizontal ? a : b;
    const vertical = a.horizontal ? b : a;
    return vertical.col > horizontal.col && vertical.col < horizontal.endCol &&
      horizontal.row > vertical.row && horizontal.row < vertical.endRow;
  }

  function validateHashi(puzzle, bridges) {
    const errors = new Set();
    const degrees = Array(puzzle.islands.length).fill(0);
    const active = [];
    puzzle.edges.forEach((edge) => {
      const count = Number(bridges.get(edge.key) || 0);
      if (!Number.isInteger(count) || count < 0 || count > 2) {
        errors.add(edge.key);
        return;
      }
      degrees[edge.a] += count;
      degrees[edge.b] += count;
      if (count) active.push({ ...edge, count });
    });
    active.forEach((first, index) => {
      active.slice(index + 1).forEach((second) => {
        if (hashEdgesCross(puzzle, first, second)) {
          errors.add(first.key);
          errors.add(second.key);
        }
      });
    });
    degrees.forEach((degree, index) => {
      if (degree > puzzle.clues[index]) errors.add(`island:${index}`);
    });

    const connected = active.length > 0 && (() => {
      const seen = new Set([0]);
      const queue = [0];
      while (queue.length) {
        const current = queue.shift();
        active.forEach((edge) => {
          if (edge.a !== current && edge.b !== current) return;
          const next = edge.a === current ? edge.b : edge.a;
          if (!seen.has(next)) {
            seen.add(next);
            queue.push(next);
          }
        });
      }
      return seen.size === puzzle.islands.length;
    })();
    const complete = !errors.size && connected && degrees.every((degree, index) => degree === puzzle.clues[index]);
    return { errors, degrees, connected, completed: complete };
  }

  // Slitherlink -----------------------------------------------------------

  function slitherEdgeKey(type, row, col) {
    return `${type}:${row}:${col}`;
  }

  const SLITHER_PROFILES = {
    easy: { size: 5, area: 9, hidden: 0.1 },
    medium: { size: 7, area: 19, hidden: 0.24 },
    hard: { size: 8, area: 25, hidden: 0.32 }
  };

  function polyominoLoop(size, targetArea, rng) {
    const cells = new Set([cellKey(randomInt(rng, size), randomInt(rng, size))]);
    while (cells.size < targetArea) {
      const frontier = new Set();
      cells.forEach((key) => {
        const [row, col] = parseCellKey(key);
        orthogonalNeighbors(row, col, size).forEach(([nextRow, nextCol]) => {
          const nextKey = cellKey(nextRow, nextCol);
          if (!cells.has(nextKey)) frontier.add(nextKey);
        });
      });
      if (!frontier.size) break;
      const options = shuffle([...frontier], rng).sort((first, second) => {
        const count = (key) => {
          const [row, col] = parseCellKey(key);
          return orthogonalNeighbors(row, col, size).filter(([nextRow, nextCol]) => cells.has(cellKey(nextRow, nextCol))).length;
        };
        return count(first) - count(second);
      });
      cells.add(options[Math.min(randomInt(rng, Math.min(4, options.length)), options.length - 1)]);
    }
    const boundary = new Set();
    const toggle = (key) => boundary.has(key) ? boundary.delete(key) : boundary.add(key);
    cells.forEach((key) => {
      const [row, col] = parseCellKey(key);
      toggle(slitherEdgeKey("h", row, col));
      toggle(slitherEdgeKey("h", row + 1, col));
      toggle(slitherEdgeKey("v", row, col));
      toggle(slitherEdgeKey("v", row, col + 1));
    });
    return boundary;
  }

  function slitherClues(size, solution) {
    const clues = [];
    for (let row = 0; row < size; row += 1) {
      clues[row] = [];
      for (let col = 0; col < size; col += 1) {
        const surrounding = [
          slitherEdgeKey("h", row, col),
          slitherEdgeKey("h", row + 1, col),
          slitherEdgeKey("v", row, col),
          slitherEdgeKey("v", row, col + 1)
        ];
        clues[row][col] = surrounding.filter((key) => solution.has(key)).length;
      }
    }
    return clues;
  }

  function solveSlitherlink(puzzle, limit = 2) {
    const edges = slitherEdges(puzzle.size);
    const edgeIndexes = new Map(edges.map((key, index) => [key, index]));
    const clueGroups = [];
    for (let row = 0; row < puzzle.size; row += 1) for (let col = 0; col < puzzle.size; col += 1) {
      if (puzzle.clues[row][col] == null) continue;
      clueGroups.push({ target: puzzle.clues[row][col], indexes: [
        edgeIndexes.get(slitherEdgeKey("h", row, col)), edgeIndexes.get(slitherEdgeKey("h", row + 1, col)),
        edgeIndexes.get(slitherEdgeKey("v", row, col)), edgeIndexes.get(slitherEdgeKey("v", row, col + 1))
      ] });
    }
    const vertexGroups = new Map();
    edges.forEach((key, index) => slitherVertices(key).forEach(([row, col]) => {
      const vertex = cellKey(row, col);
      if (!vertexGroups.has(vertex)) vertexGroups.set(vertex, []);
      vertexGroups.get(vertex).push(index);
    }));
    const solutions = [];

    function assign(state, index, value) {
      if (state[index] >= 0) return state[index] === value;
      state[index] = value;
      return true;
    }

    function propagate(state) {
      let changed = true;
      while (changed) {
        changed = false;
        for (const group of clueGroups) {
          const lines = group.indexes.filter((index) => state[index] === 1).length;
          const unknown = group.indexes.filter((index) => state[index] < 0);
          if (lines > group.target || lines + unknown.length < group.target) return false;
          if (lines === group.target || lines + unknown.length === group.target) {
            const value = lines === group.target ? 0 : 1;
            for (const index of unknown) { if (!assign(state, index, value)) return false; changed = true; }
          }
        }
        for (const indexes of vertexGroups.values()) {
          const lines = indexes.filter((index) => state[index] === 1).length;
          const unknown = indexes.filter((index) => state[index] < 0);
          if (lines > 2 || (lines === 1 && !unknown.length)) return false;
          let value = null;
          if (lines === 2) value = 0;
          else if (lines === 1 && unknown.length === 1) value = 1;
          else if (lines === 0 && unknown.length === 1) value = 0;
          if (value != null) for (const index of unknown) { if (!assign(state, index, value)) return false; changed = true; }
        }
        const lines = new Set(edges.filter((_, index) => state[index] === 1));
        if (singleSlitherLoop(lines) && state.some((value) => value < 0)) {
          for (let index = 0; index < state.length; index += 1) if (state[index] < 0) { state[index] = 0; changed = true; }
        }
      }
      return true;
    }

    function walk(state) {
      if (solutions.length >= limit || !propagate(state)) return;
      const next = state.indexOf(-1);
      if (next < 0) {
        const lines = new Set(edges.filter((_, index) => state[index] === 1));
        if (singleSlitherLoop(lines)) solutions.push(lines);
        return;
      }
      for (const value of [1, 0]) {
        const copy = state.slice();
        copy[next] = value;
        walk(copy);
        if (solutions.length >= limit) return;
      }
    }

    walk(new Int8Array(edges.length).fill(-1));
    return solutions;
  }

  function generateSlitherlink(seed, difficulty) {
    const profile = SLITHER_PROFILES[difficulty] || SLITHER_PROFILES.medium;
    const rng = createRng(seed);
    for (let attempt = 0; attempt < 600; attempt += 1) {
      const area = profile.area + randomInt(rng, 5) - 2;
      const solution = polyominoLoop(profile.size, area, rng);
      if (!singleSlitherLoop(solution)) continue;
      const fullClues = slitherClues(profile.size, solution);
      const fullPuzzle = { type: "slitherlink", size: profile.size, clues: fullClues, solution };
      if (solveSlitherlink(fullPuzzle, 2).length !== 1) continue;
      const cells = shuffle(Array.from({ length: profile.size * profile.size }, (_, index) => index), rng);
      for (let pass = 0; pass < 4; pass += 1) {
        const hiddenCount = Math.floor(cells.length * profile.hidden * (1 - pass * 0.22));
        const hidden = new Set(cells.slice(0, hiddenCount));
        const clues = fullClues.map((row, rowIndex) => row.map((value, colIndex) => hidden.has(rowIndex * profile.size + colIndex) ? null : value));
        const puzzle = { type: "slitherlink", size: profile.size, clues, solution };
        const solutions = solveSlitherlink(puzzle, 2);
        if (solutions.length === 1) {
          puzzle.solution = solutions[0];
          puzzle.unique = true;
          return puzzle;
        }
      }
    }
    throw new Error("Could not generate a unique Slitherlink puzzle.");
  }

  function slitherEdges(size) {
    const edges = [];
    for (let row = 0; row <= size; row += 1) {
      for (let col = 0; col < size; col += 1) edges.push(slitherEdgeKey("h", row, col));
    }
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col <= size; col += 1) edges.push(slitherEdgeKey("v", row, col));
    }
    return edges;
  }

  function slitherVertices(edgeKey) {
    const [type, row, col] = edgeKey.split(":").map((value, index) => index ? Number(value) : value);
    return type === "h" ? [[row, col], [row, col + 1]] : [[row, col], [row + 1, col]];
  }

  function singleSlitherLoop(lineEdges) {
    if (!lineEdges.size) return false;
    const graph = new Map();
    lineEdges.forEach((edgeKey) => {
      const vertices = slitherVertices(edgeKey).map(([row, col]) => `${row}:${col}`);
      vertices.forEach((vertex) => {
        if (!graph.has(vertex)) graph.set(vertex, new Set());
      });
      graph.get(vertices[0]).add(vertices[1]);
      graph.get(vertices[1]).add(vertices[0]);
    });
    if ([...graph.values()].some((neighbors) => neighbors.size !== 2)) return false;
    const seen = new Set();
    const queue = [graph.keys().next().value];
    while (queue.length) {
      const vertex = queue.shift();
      if (seen.has(vertex)) continue;
      seen.add(vertex);
      graph.get(vertex).forEach((next) => queue.push(next));
    }
    return seen.size === graph.size;
  }

  function slitherLoopIssues(lineEdges) {
    const graph = new Map();
    const incident = new Map();
    lineEdges.forEach((edgeKey) => {
      const vertices = slitherVertices(edgeKey).map(([row, col]) => `${row}:${col}`);
      vertices.forEach((vertex) => {
        if (!graph.has(vertex)) graph.set(vertex, new Set());
        if (!incident.has(vertex)) incident.set(vertex, []);
        incident.get(vertex).push(edgeKey);
      });
      graph.get(vertices[0]).add(vertices[1]);
      graph.get(vertices[1]).add(vertices[0]);
    });
    const invalidEdges = new Set();
    incident.forEach((edges, vertex) => {
      if (edges.length > 2) edges.forEach((edgeKey) => invalidEdges.add(edgeKey));
    });
    return invalidEdges;
  }

  function validateSlitherlink(puzzle, marks) {
    const lines = new Set([...marks.entries()].filter(([, value]) => value === 1).map(([key]) => key));
    const errors = new Set();
    for (let row = 0; row < puzzle.size; row += 1) {
      for (let col = 0; col < puzzle.size; col += 1) {
        if (puzzle.clues[row][col] == null) continue;
        const surrounding = [
          slitherEdgeKey("h", row, col),
          slitherEdgeKey("h", row + 1, col),
          slitherEdgeKey("v", row, col),
          slitherEdgeKey("v", row, col + 1)
        ];
        const count = surrounding.filter((key) => lines.has(key)).length;
        const allKnown = surrounding.every((key) => marks.get(key));
        if (count > puzzle.clues[row][col] || (allKnown && count !== puzzle.clues[row][col])) {
          errors.add(`cell:${row}:${col}`);
        }
      }
    }
    const invalidEdges = slitherLoopIssues(lines);
    invalidEdges.forEach((key) => errors.add(`edge:${key}`));
    const cluesMatch = puzzle.clues.every((row, rowIndex) => row.every((target, colIndex) => target == null || [
      slitherEdgeKey("h", rowIndex, colIndex), slitherEdgeKey("h", rowIndex + 1, colIndex),
      slitherEdgeKey("v", rowIndex, colIndex), slitherEdgeKey("v", rowIndex, colIndex + 1)
    ].filter((key) => lines.has(key)).length === target));
    const completed = !errors.size && cluesMatch && singleSlitherLoop(lines);
    return { errors, invalidEdges, completed, lines };
  }

  // Nonogram --------------------------------------------------------------

  const NONOGRAM_PROFILES = {
    easy: { size: 5, filled: 10, clusters: 1 },
    medium: { size: 7, filled: 22, clusters: 2 },
    hard: { size: 10, filled: 42, clusters: 3 }
  };

  function nonogramLinePatterns(length, runs) {
    if (!runs.length) return [0];
    const results = [];
    function place(runIndex, start, mask) {
      if (runIndex === runs.length) { results.push(mask); return; }
      const remaining = runs.slice(runIndex + 1).reduce((sum, run) => sum + run, 0) + Math.max(0, runs.length - runIndex - 1);
      for (let position = start; position + runs[runIndex] + remaining <= length; position += 1) {
        let nextMask = mask;
        for (let offset = 0; offset < runs[runIndex]; offset += 1) nextMask |= 1 << (position + offset);
        place(runIndex + 1, position + runs[runIndex] + 1, nextMask);
      }
    }
    place(0, 0, 0);
    return results;
  }

  function solveNonogram(puzzle, limit = 2) {
    const rowOptions = puzzle.rowClues.map((runs) => nonogramLinePatterns(puzzle.size, runs));
    const initialColumns = puzzle.colClues.map((runs) => nonogramLinePatterns(puzzle.size, runs));
    const order = Array.from({ length: puzzle.size }, (_, index) => index).sort((a, b) => rowOptions[a].length - rowOptions[b].length);
    const chosen = Array(puzzle.size).fill(0);
    const solutions = [];

    function walk(index, columns) {
      if (solutions.length >= limit) return;
      if (index === order.length) {
        solutions.push(chosen.map((mask) => Array.from({ length: puzzle.size }, (_, col) => Boolean(mask & (1 << col)))));
        return;
      }
      const row = order[index];
      for (const mask of rowOptions[row]) {
        const nextColumns = columns.map((options, col) => options.filter((columnMask) => Boolean(columnMask & (1 << row)) === Boolean(mask & (1 << col))));
        if (nextColumns.some((options) => !options.length)) continue;
        chosen[row] = mask;
        walk(index + 1, nextColumns);
        if (solutions.length >= limit) return;
      }
    }

    walk(0, initialColumns);
    return solutions;
  }

  function proceduralNonogramShape(profile, rng) {
    const cells = new Set();
    const add = (row, col) => { if (inside(row, col, profile.size)) cells.add(cellKey(row, col)); };
    const grow = (start, count) => {
      add(...start);
      for (let step = 1; step < count; step += 1) {
        const frontier = new Set();
        cells.forEach((key) => {
          const [row, col] = parseCellKey(key);
          orthogonalNeighbors(row, col, profile.size).forEach(([nextRow, nextCol]) => {
            const nextKey = cellKey(nextRow, nextCol);
            if (!cells.has(nextKey)) frontier.add(nextKey);
          });
        });
        if (!frontier.size) break;
        cells.add(shuffle([...frontier], rng)[0]);
      }
    };
    const style = randomInt(rng, 5);
    if (style <= 1) {
      grow([randomInt(rng, profile.size), randomInt(rng, profile.size)], profile.filled);
      if (style === 1) [...cells].forEach((key) => {
        const [row, col] = parseCellKey(key);
        add(row, profile.size - 1 - col);
      });
    } else if (style === 2) {
      const strokes = 3 + randomInt(rng, profile.clusters + 2);
      for (let stroke = 0; stroke < strokes; stroke += 1) {
        const horizontal = rng() < 0.5;
        const fixed = randomInt(rng, profile.size);
        const start = randomInt(rng, Math.max(1, profile.size - 3));
        const length = 3 + randomInt(rng, Math.max(1, profile.size - start - 2));
        for (let offset = 0; offset < length; offset += 1) add(horizontal ? fixed : start + offset, horizontal ? start + offset : fixed);
      }
    } else if (style === 3) {
      const center = (profile.size - 1) / 2;
      const radius = Math.max(2, Math.floor(profile.size / 2));
      for (let row = 0; row < profile.size; row += 1) for (let col = 0; col < profile.size; col += 1) {
        const distance = Math.abs(row - center) + Math.abs(col - center);
        if (distance === radius || distance === radius - 1) add(row, col);
      }
      if (rng() < 0.5) for (let index = 1; index < profile.size - 1; index += 1) add(index, Math.floor(center));
    } else {
      for (let cluster = 0; cluster < profile.clusters; cluster += 1) {
        grow([randomInt(rng, profile.size), randomInt(rng, profile.size)], Math.ceil(profile.filled / profile.clusters));
      }
    }
    [...cells].forEach((key) => {
      const [row, col] = parseCellKey(key);
      if (!orthogonalNeighbors(row, col, profile.size).some(([nextRow, nextCol]) => cells.has(cellKey(nextRow, nextCol)))) cells.delete(key);
    });
    return Array.from({ length: profile.size }, (_, row) => Array.from({ length: profile.size }, (_, col) => cells.has(cellKey(row, col))));
  }

  function generateNonogram(seed, difficulty) {
    const profile = NONOGRAM_PROFILES[difficulty] || NONOGRAM_PROFILES.medium;
    const rng = createRng(seed);
    for (let attempt = 0; attempt < 180; attempt += 1) {
      const solution = proceduralNonogramShape(profile, rng);
      const filled = solution.flat().filter(Boolean).length;
      if (filled < profile.size || filled > profile.size * profile.size * 0.72) continue;
      const puzzle = {
        type: "nonogram", size: profile.size, solution,
        rowClues: solution.map(countRuns),
        colClues: Array.from({ length: profile.size }, (_, col) => countRuns(solution.map((row) => row[col])))
      };
      const solutions = solveNonogram(puzzle, 2);
      if (solutions.length !== 1) continue;
      puzzle.solution = solutions[0];
      puzzle.unique = true;
      return puzzle;
    }
    throw new Error("Could not generate a unique Nonogram puzzle.");
  }

  function validateNonogram(puzzle, marks) {
    const errors = new Set();
    const filled = [];
    for (let row = 0; row < puzzle.size; row += 1) {
      filled[row] = [];
      for (let col = 0; col < puzzle.size; col += 1) {
        const key = cellKey(row, col);
        const isFilled = marks.get(key) === 1;
        filled[row][col] = isFilled;
        if (isFilled !== puzzle.solution[row][col] && (isFilled || marks.get(key) === 2)) errors.add(key);
      }
    }
    const completed = filled.every((row, rowIndex) => row.every((value, colIndex) => value === puzzle.solution[rowIndex][colIndex]));
    return { errors, completed, filled };
  }

  function generatePuzzle(game, seed, difficulty) {
    if (game === "tents-and-trees") return generateTents(seed, difficulty);
    if (game === "hashi") return generateHashi(seed, difficulty);
    if (game === "slitherlink") return generateSlitherlink(seed, difficulty);
    if (game === "nonogram") return generateNonogram(seed, difficulty);
    throw new Error(`Unknown game: ${game}`);
  }

  const api = {
    DIFFICULTIES,
    GAME_ORDER,
    hashString,
    createRng,
    cellKey,
    parseCellKey,
    generatePuzzle,
    generateTents,
    solveTents,
    validateTents,
    generateHashi,
    solveHashi,
    hashiEdgeKey,
    getVisibleHashiEdges,
    hashEdgesCross,
    validateHashi,
    generateSlitherlink,
    solveSlitherlink,
    slitherEdgeKey,
    slitherEdges,
    validateSlitherlink,
    singleSlitherLoop,
    generateNonogram,
    solveNonogram,
    countRuns,
    validateNonogram
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.DailyLogicGames = api;
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
