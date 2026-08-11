import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const games = require("../logic-games-core.js");
const difficulties = ["easy", "medium", "hard"];

function snapshot(puzzle) {
  return JSON.stringify({
    ...puzzle,
    solution: puzzle.solution instanceof Map ? [...puzzle.solution.entries()] : puzzle.solution instanceof Set ? [...puzzle.solution] : puzzle.solution,
    solutionTents: puzzle.solutionTents
  });
}

for (const game of games.GAME_ORDER) {
  for (const difficulty of difficulties) {
    const seed = games.hashString(`${game}-${difficulty}-deterministic`);
    assert.equal(snapshot(games.generatePuzzle(game, seed, difficulty)), snapshot(games.generatePuzzle(game, seed, difficulty)));
    for (let index = 0; index < 120; index += 1) {
      const puzzle = games.generatePuzzle(game, games.hashString(`${game}-${difficulty}-${index}`), difficulty);
      if (game === "tents-and-trees") {
        assert.ok(games.solveTents(puzzle, 1).length > 0, `${game} ${difficulty} has no solution`);
        assert.equal(games.validateTents(puzzle, new Set(puzzle.solutionTents.map(([row, col]) => `${row}:${col}`))).completed, true);
      } else if (game === "hashi") {
        assert.equal(games.validateHashi(puzzle, puzzle.solution).completed, true);
      } else if (game === "slitherlink") {
        assert.equal(games.singleSlitherLoop(puzzle.solution), true);
        const marks = new Map([...puzzle.solution].map((key) => [key, 1]));
        assert.equal(games.validateSlitherlink(puzzle, marks).completed, true);
      } else {
        const marks = new Map();
        puzzle.solution.forEach((row, rowIndex) => row.forEach((filled, colIndex) => marks.set(`${rowIndex}:${colIndex}`, filled ? 1 : 2)));
        assert.equal(games.validateNonogram(puzzle, marks).completed, true);
      }
    }
    console.log(`${game}/${difficulty}: 120 seeded puzzles passed`);
  }
}
