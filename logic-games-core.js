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
    let fallback = null;
    const allCells = Array.from({ length: profile.size }, (_, row) =>
      Array.from({ length: profile.size }, (_, col) => [row, col])
    ).flat();

    for (let attempt = 0; attempt < 240; attempt += 1) {
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
      if (!fallback && solutions.length) {
        puzzle.solutionTents = solutions[0];
        fallback = puzzle;
      }
    }

    if (fallback) return fallback;
    throw new Error("Could not generate a valid Tents and Trees puzzle.");
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

  // ponytail: fixed grid-shaped solution families keep the first version fast and predictable.
  const HASHI_BLUEPRINTS = {
    easy: {
      size: 7,
      islands: [[1, 1], [1, 5], [3, 1], [3, 5], [5, 1], [5, 5]],
      edges: [[0, 1, 1], [0, 2, 1], [1, 3, 1], [2, 3, 2], [2, 4, 1], [3, 5, 1], [4, 5, 1]]
    },
    medium: {
      size: 9,
      islands: [[1, 1], [1, 4], [1, 7], [4, 1], [4, 4], [4, 7], [7, 1], [7, 4], [7, 7]],
      edges: [[0, 1, 1], [1, 2, 1], [3, 4, 2], [4, 5, 1], [6, 7, 1], [7, 8, 2], [0, 3, 1], [3, 6, 1], [1, 4, 1], [4, 7, 1], [2, 5, 1], [5, 8, 1]]
    },
    hard: {
      size: 11,
      islands: [[1, 1], [1, 4], [1, 7], [1, 10], [5, 1], [5, 4], [5, 7], [5, 10], [9, 1], [9, 4], [9, 7], [9, 10]],
      edges: [[0, 1, 1], [1, 2, 2], [2, 3, 1], [4, 5, 1], [5, 6, 1], [6, 7, 2], [8, 9, 2], [9, 10, 1], [10, 11, 1], [0, 4, 1], [4, 8, 1], [1, 5, 1], [5, 9, 2], [2, 6, 1], [6, 10, 1], [3, 7, 1], [7, 11, 1]]
    }
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

  function generateHashi(seed, difficulty) {
    const blueprint = HASHI_BLUEPRINTS[difficulty] || HASHI_BLUEPRINTS.medium;
    const rng = createRng(seed);
    const solution = new Map();
    blueprint.edges.forEach(([a, b, count]) => {
      const extra = rng() > 0.72 && count === 1 ? 1 : 0;
      solution.set(hashiEdgeKey(a, b), Math.min(2, count + extra));
    });
    const clues = Array(blueprint.islands.length).fill(0);
    solution.forEach((count, key) => {
      const [a, b] = key.split("-").map(Number);
      clues[a] += count;
      clues[b] += count;
    });
    return {
      type: "hashi",
      size: blueprint.size,
      islands: blueprint.islands,
      clues,
      edges: getVisibleHashiEdges(blueprint.islands),
      solution,
      unique: false
    };
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

  function makeRectangleLoop(size, top, left, bottom, right) {
    const solution = new Set();
    for (let col = left; col < right; col += 1) {
      solution.add(slitherEdgeKey("h", top, col));
      solution.add(slitherEdgeKey("h", bottom, col));
    }
    for (let row = top; row < bottom; row += 1) {
      solution.add(slitherEdgeKey("v", row, left));
      solution.add(slitherEdgeKey("v", row, right));
    }
    return solution;
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

  function generateSlitherlink(seed, difficulty) {
    const size = difficulty === "easy" ? 5 : difficulty === "hard" ? 8 : 6;
    const rng = createRng(seed);
    const maxInset = Math.max(1, Math.floor(size / 3));
    const inset = randomInt(rng, maxInset + 1);
    const top = inset;
    const left = inset;
    const bottom = size - inset;
    const right = size - inset;
    const solution = makeRectangleLoop(size, top, left, bottom, right);
    return {
      type: "slitherlink",
      size,
      clues: slitherClues(size, solution),
      solution,
      unique: false
    };
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
    const completed = !errors.size && singleSlitherLoop(lines) &&
      lines.size === puzzle.solution.size && [...lines].every((key) => puzzle.solution.has(key));
    return { errors, invalidEdges, completed, lines };
  }

  // Nonogram --------------------------------------------------------------

  function generateNonogram(seed, difficulty) {
    const size = difficulty === "easy" ? 5 : difficulty === "hard" ? 10 : 7;
    const rng = createRng(seed);
    const style = randomInt(rng, 4);
    const offset = randomInt(rng, size);
    const center = (size - 1) / 2;
    const solution = Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, col) => {
      const distance = Math.abs(row - center) + Math.abs(col - center);
      if (style === 0) return distance <= Math.ceil(size * 0.7) && (row + col + offset) % 4 !== 0;
      if (style === 1) return Math.abs(col - center) <= Math.max(1, Math.floor((size - row) / 3)) || row === col;
      if (style === 2) return (row === col || row + col === size - 1) || (row > center - 1 && row < center + 2 && col > center - 1 && col < center + 2);
      return ((row * 5 + col * 3 + offset) % 7) < 3 || distance < size * 0.35;
    }));

    for (let row = 0; row < size; row += 1) {
      if (!solution[row].some(Boolean)) solution[row][row % size] = true;
    }
    for (let col = 0; col < size; col += 1) {
      if (!solution.some((row) => row[col])) solution[col % size][col] = true;
    }
    return {
      type: "nonogram",
      size,
      solution,
      rowClues: solution.map(countRuns),
      colClues: Array.from({ length: size }, (_, col) => countRuns(solution.map((row) => row[col]))),
      unique: false
    };
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
    hashiEdgeKey,
    getVisibleHashiEdges,
    hashEdgesCross,
    validateHashi,
    generateSlitherlink,
    slitherEdgeKey,
    slitherEdges,
    validateSlitherlink,
    singleSlitherLoop,
    generateNonogram,
    countRuns,
    validateNonogram
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.DailyLogicGames = api;
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
