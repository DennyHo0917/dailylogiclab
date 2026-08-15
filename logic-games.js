(function initLogicGames(root) {
  "use strict";

  const core = root.DailyLogicGames;
  const game = document.body.dataset.game;
  if (!core || !game) return;

  const copy = {
    "tents-and-trees": {
      title: "Tents and Trees Online",
      intro: "Place one tent beside every tree. Tents never touch, even at the corners.",
      prompt: "Use the row and column counts to place every tent.",
      goal: ["One tent beside each tree", "No tents touch", "Match every row and column count"],
      rules: "Every tree needs one orthogonally adjacent tent. Tents cannot touch another tent horizontally, vertically, or diagonally.",
      how: "Tap a square to cycle Empty → Tent → Grass. Use Grass marks to rule out cells as you solve.",
      tips: "Start with trees that have only one possible neighboring square, then use rows and columns that are already full.",
      faq: [
        ["Can tents touch diagonally?", "No. A tent cannot touch another tent in any of the eight surrounding squares."],
        ["Is Practice unlimited?", "Yes. Practice creates as many free puzzles as you want without an account."]
      ]
    },
    hashi: {
      title: "Hashi Online – Free Bridges Puzzles",
      intro: "Connect every island with bridges while matching each island's number.",
      prompt: "Click two visible islands to cycle 0 → 1 → 2 → 0 bridges.",
      goal: ["Match every island clue", "Bridges do not cross", "One connected network"],
      rules: "Bridges run only horizontally or vertically, no pair has more than two bridges, bridges cannot cross, and all islands must connect.",
      how: "Select an island, then select a directly visible island in the same row or column. Repeat to cycle the bridge count.",
      tips: "Begin with islands whose clue is 1 or 2. A satisfied island cannot accept another bridge.",
      faq: [
        ["How many bridges can connect two islands?", "A pair can have zero, one, or two bridges."],
        ["Can a bridge pass through an island?", "No. The next visible island stops a possible bridge." ]
      ]
    },
    slitherlink: {
      title: "Slitherlink Online – Free Loop Puzzles",
      intro: "Draw one continuous loop around the numbered cells without branches or crossings.",
      prompt: "Click an edge to cycle Unknown → Line → X → Unknown.",
      goal: ["Match every number", "Make one closed loop", "Avoid branches and crossings"],
      rules: "Each number tells you how many of its four sides belong to the final loop. The finished loop is continuous, closed, and never branches.",
      how: "Tap an edge once for a line, twice for an X, and again to clear it. Use X marks to keep the loop clean.",
      tips: "A 0 has four X edges. A 3 has three lines. At every vertex, two lines must eventually meet.",
      faq: [
        ["What does each number mean?", "It is the exact number of loop edges around that cell."],
        ["Can the loop have a branch?", "No. Every used vertex in the final loop has exactly two line edges."]
      ]
    },
    nonogram: {
      title: "Nonogram Online – Free Picross Puzzles",
      intro: "Fill the hidden black-and-white picture using the row and column clues.",
      prompt: "Tap a square to cycle Unknown → Filled → X → Unknown.",
      goal: ["Match every row clue", "Match every column clue", "Reveal the pattern"],
      rules: "Numbers describe consecutive filled blocks in each row and column. Separate blocks need at least one empty square between them.",
      how: "Tap to fill a square, tap again to mark it X, and tap once more to clear it. The same controls work on touch screens.",
      tips: "Place the longest runs first. Compare the overlap of every possible placement with the current X marks.",
      faq: [
        ["What is a Nonogram?", "It is a picture logic puzzle also known as Picross or Griddlers."],
        ["Can I play on a phone?", "Yes. The three-state tap control is designed for touch screens; no hover is required."]
      ]
    }
  };

  const localized = root.DailyLogicGameCopy || {};
  const text = { ...copy[game], ...(localized.game || {}) };
  const ui = {
    todayReady: "Today's puzzle is ready. Start when you are ready.",
    practiceReady: "Practice puzzle ready. Start when you are ready.",
    timerStarted: "Timer started. Solve it clean.",
    puzzleReset: "Puzzle reset. Start when you are ready.",
    pressStartMove: "Press Start before making a move.",
    selectVisibleIsland: "Select a visible island to change its bridge count.",
    islandsNotVisible: "Those islands are not directly visible to each other.",
    hashiConflict: "There is a bridge, island, or crossing conflict.",
    markConflict: "Some marks conflict with the puzzle rules.",
    pressStartCheck: "Press Start before checking the puzzle.",
    checkConflicts: "Check found conflicts. Red marks show where to look.",
    noConflicts: "No direct conflicts yet. Keep solving.",
    generationError: "Could not generate this puzzle. Please try again.",
    complete: "Puzzle complete. Nice work.",
    modeDaily: "Daily puzzle",
    modePractice: "Unlimited practice",
    timerNote: "The timer starts only after you press Start.",
    unique: "Unique",
    valid: "Valid",
    inProgress: "Puzzle in progress",
    startDaily: "Start Daily Puzzle",
    startPractice: "Start Practice",
    treeCell: "Tree, row {row}, column {col}",
    boardCell: "Row {row}, column {col}",
    island: "Island {index}, needs {count} bridges",
    horizontalEdge: "Horizontal edge, row {row}, column {col}",
    verticalEdge: "Vertical edge, row {row}, column {col}",
    shareComplete: "Puzzle complete in {time}.",
    shareReady: "Result ready to share.",
    shareFallback: "Your result is ready to share from the page URL.",
    difficulties: { easy: "Easy", medium: "Medium", hard: "Hard" },
    ...(localized.ui || {})
  };
  if (!text) return;

  const els = {
    board: document.querySelector("#logicBoard"),
    status: document.querySelector("#gameStatus"),
    timer: document.querySelector("#timer"),
    gridSize: document.querySelector("#gridSize"),
    streak: document.querySelector("#streakCount"),
    bestTime: document.querySelector("#bestTime"),
    verified: document.querySelector("#verifiedLabel"),
    gameMode: document.querySelector("#gameMode"),
    title: document.querySelector("#gameTitle"),
    intro: document.querySelector("#gameIntro"),
    difficulty: document.querySelector("#difficulty"),
    startOverlay: document.querySelector("#startOverlay"),
    startLabel: document.querySelector("#startLabel"),
    startInstructions: document.querySelector("#startInstructions"),
    startBtn: document.querySelector("#startBtn"),
    resetBtn: document.querySelector("#resetBtn"),
    checkBtn: document.querySelector("#checkBtn"),
    newPuzzleBtn: document.querySelector("#newPuzzleBtn"),
    dailyBtn: document.querySelector("#dailyBtn"),
    practiceBtn: document.querySelector("#practiceBtn"),
    shareBtn: document.querySelector("#shareBtn"),
    completionPanel: document.querySelector("#completionPanel"),
    completionTime: document.querySelector("#completionTime"),
    completionDifficulty: document.querySelector("#completionDifficulty"),
    startNote: document.querySelector("#startNote"),
    rulesText: document.querySelector("#rulesText"),
    howText: document.querySelector("#howText"),
    tipsText: document.querySelector("#tipsText"),
    goalList: document.querySelector("#goalList"),
    faqList: document.querySelector("#gameFaq")
  };

  const statsKey = "dll-logic-stats";
  const preferenceKey = `dll-difficulty-${game}`;
  const todayKey = getTodayKey();
  let timerId = null;
  let state;

  init();

  function init() {
    els.title.textContent = text.title;
    els.intro.textContent = text.intro;
    els.rulesText.textContent = text.rules;
    els.howText.textContent = text.how;
    els.tipsText.textContent = text.tips;
    els.goalList.innerHTML = text.goal.map((item) => `<li>${item}</li>`).join("");
    els.faqList.innerHTML = text.faq.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join("");
    els.difficulty.value = localStorage.getItem(preferenceKey) || "easy";
    bindEvents();
    loadPuzzle(getModeFromLocation(), els.difficulty.value, "initial");
    document.querySelectorAll("[data-cross-game]").forEach((link) => {
      link.addEventListener("click", () => trackEvent("cross_game_click", {
        from_game: game,
        to_game: link.dataset.crossGame
      }));
    });
  }

  function bindEvents() {
    els.startBtn.addEventListener("click", startPuzzle);
    els.startOverlay.addEventListener("click", startPuzzle);
    els.resetBtn.addEventListener("click", resetPuzzle);
    els.checkBtn.addEventListener("click", () => checkPuzzle(true));
    els.newPuzzleBtn.addEventListener("click", () => loadPuzzle("practice", els.difficulty.value, "new_puzzle"));
    els.dailyBtn.addEventListener("click", () => loadPuzzle("daily", els.difficulty.value));
    els.practiceBtn.addEventListener("click", () => loadPuzzle("practice", els.difficulty.value, "new_puzzle"));
    els.shareBtn.addEventListener("click", shareResult);
    els.difficulty.addEventListener("change", () => {
      localStorage.setItem(preferenceKey, els.difficulty.value);
      trackEvent("difficulty_change", { game_name: game, mode: state.mode, difficulty: els.difficulty.value });
      loadPuzzle(state.mode, els.difficulty.value);
    });
    els.board.addEventListener("click", handleBoardClick);
    els.board.addEventListener("contextmenu", handleContextMenu);
  }

  function getModeFromLocation() {
    const path = window.location.pathname.replace(/\/+$/, "");
    if (path.endsWith("/practice") || new URLSearchParams(window.location.search).get("mode") === "practice") return "practice";
    return "daily";
  }

  function loadPuzzle(mode, difficulty, cause = "load") {
    stopTimer();
    const baseSeed = mode === "daily"
      ? core.hashString(`daily-${game}-${todayKey}-${difficulty}`)
      : createPracticeSeed();
    let generated;
    try {
      generated = core.generatePuzzleWithRetry(game, baseSeed, difficulty, mode);
    } catch (error) {
      state = { mode, difficulty, seed: baseSeed, generationFailed: true };
      if (cause !== "initial" || new URLSearchParams(window.location.search).has("mode")) syncRoute(mode);
      showGenerationError(error);
      return;
    }
    const { puzzle, seed } = generated;
    state = {
      puzzle,
      mode,
      difficulty,
      seed,
      started: false,
      solved: false,
      elapsed: 0,
      startedAt: 0,
      errors: new Set(),
      tents: new Set(),
      grass: new Set(),
      bridges: new Map(),
      selectedIsland: null,
      marks: new Map()
    };
    if (cause !== "initial" || new URLSearchParams(window.location.search).has("mode")) syncRoute(mode);
    render();
    setStatus(mode === "daily" ? ui.todayReady : ui.practiceReady, "");
    trackEvent("game_view", { game_name: game, mode, difficulty });
    if (cause === "new_puzzle") trackEvent("new_puzzle", { game_name: game, mode, difficulty });
  }

  function showGenerationError(error) {
    console.error("Puzzle generation failed:", ...(error.failures || [error]));
    els.board.className = "logic-board";
    els.board.textContent = ui.generationError;
    els.gameMode.textContent = state.mode === "daily" ? ui.modeDaily : ui.modePractice;
    els.startNote.textContent = ui.generationError;
    els.gridSize.textContent = "--";
    els.verified.textContent = "--";
    els.startOverlay.hidden = true;
    els.startBtn.disabled = true;
    els.resetBtn.disabled = true;
    els.checkBtn.disabled = true;
    els.shareBtn.disabled = true;
    els.newPuzzleBtn.disabled = false;
    setStatus(ui.generationError, "error");
    trackEvent("puzzle_generation_error", {
      game_name: game,
      difficulty: state.difficulty,
      mode: state.mode,
      retry_count: error.retryCount || 5
    });
  }

  function syncRoute(mode) {
    const base = document.body.dataset.basePath || `/${game}/`;
    const path = mode === "daily" ? `${base}daily/` : `${base}practice/`;
    if (window.location.pathname !== path) window.history.replaceState({}, "", path);
  }

  function startPuzzle() {
    if (state.started || state.solved) return;
    state.started = true;
    state.startedAt = Date.now();
    startTimer();
    render();
    setStatus(ui.timerStarted, "success");
    const params = { game_name: game, mode: state.mode, difficulty: state.difficulty };
    trackEvent("puzzle_start", params);
    if (state.mode === "daily") trackEvent("daily_puzzle_start", params);
  }

  function resetPuzzle() {
    if (state.started && !state.solved) trackEvent("puzzle_reset", getEventData());
    stopTimer();
    state.started = false;
    state.solved = false;
    state.elapsed = 0;
    state.startedAt = 0;
    state.errors.clear();
    state.tents.clear();
    state.grass.clear();
    state.bridges.clear();
    state.selectedIsland = null;
    state.marks.clear();
    render();
    setStatus(ui.puzzleReset, "");
  }

  function handleBoardClick(event) {
    const target = event.target.closest("button");
    if (!target) return;
    if (!state.started) {
      setStatus(ui.pressStartMove, "");
      return;
    }
    if (state.solved) return;
    if (game === "tents-and-trees") cycleTents(target);
    else if (game === "hashi") cycleHashi(target);
    else if (game === "slitherlink") cycleSlither(target);
    else cycleNonogram(target, false);
  }

  function handleContextMenu(event) {
    if (game !== "nonogram") return;
    const target = event.target.closest("button[data-row][data-col]");
    if (!target || !state.started || state.solved) return;
    event.preventDefault();
    cycleNonogram(target, true);
  }

  function cycleTents(target) {
    const row = Number(target.dataset.row);
    const col = Number(target.dataset.col);
    if (state.puzzle.trees.some(([treeRow, treeCol]) => treeRow === row && treeCol === col)) return;
    const key = core.cellKey(row, col);
    if (state.tents.has(key)) {
      state.tents.delete(key);
      state.grass.add(key);
    } else if (state.grass.has(key)) {
      state.grass.delete(key);
    } else {
      state.tents.add(key);
    }
    afterMove();
  }

  function cycleHashi(target) {
    const island = Number(target.dataset.island);
    if (!Number.isInteger(island)) return;
    if (state.selectedIsland === null) {
      state.selectedIsland = island;
      renderBoard();
      setStatus(ui.selectVisibleIsland, "");
      return;
    }
    if (state.selectedIsland === island) {
      state.selectedIsland = null;
      renderBoard();
      return;
    }
    const edge = state.puzzle.edges.find((candidate) =>
      (candidate.a === state.selectedIsland && candidate.b === island) ||
      (candidate.a === island && candidate.b === state.selectedIsland)
    );
    if (!edge) {
      state.selectedIsland = island;
      renderBoard();
      setStatus(ui.islandsNotVisible, "error");
      return;
    }
    state.bridges.set(edge.key, ((state.bridges.get(edge.key) || 0) + 1) % 3);
    state.selectedIsland = null;
    afterMove();
  }

  function cycleSlither(target) {
    const key = target.dataset.edge;
    state.marks.set(key, ((state.marks.get(key) || 0) + 1) % 3);
    afterMove();
  }

  function cycleNonogram(target, forceX) {
    const key = core.cellKey(Number(target.dataset.row), Number(target.dataset.col));
    const current = state.marks.get(key) || 0;
    state.marks.set(key, forceX ? (current === 2 ? 0 : 2) : (current + 1) % 3);
    afterMove();
  }

  function afterMove() {
    const result = evaluate();
    state.errors = result.errors;
    renderBoard();
    renderStats();
    if (result.completed) {
      completePuzzle();
    } else if (result.errors.size) {
      setStatus(game === "hashi" ? ui.hashiConflict : ui.markConflict, "error");
    } else {
      setStatus(text.prompt, "");
    }
  }

  function checkPuzzle(showMessage) {
    if (!state.started) {
      setStatus(ui.pressStartCheck, "");
      return;
    }
    const result = evaluate();
    state.errors = result.errors;
    renderBoard();
    if (result.completed) {
      completePuzzle();
    } else if (result.errors.size) {
      setStatus(ui.checkConflicts, "error");
    } else if (showMessage) {
      setStatus(ui.noConflicts, "success");
    }
  }

  function evaluate() {
    if (game === "tents-and-trees") return core.validateTents(state.puzzle, state.tents);
    if (game === "hashi") return core.validateHashi(state.puzzle, state.bridges);
    if (game === "slitherlink") return core.validateSlitherlink(state.puzzle, state.marks);
    return core.validateNonogram(state.puzzle, state.marks);
  }

  function completePuzzle() {
    if (state.solved) return;
    state.solved = true;
    stopTimer();
    saveCompletion();
    render();
    setStatus(ui.complete, "success");
    els.completionPanel.hidden = false;
    els.completionTime.textContent = formatTime(state.elapsed);
    els.completionDifficulty.textContent = ui.difficulties[state.difficulty];
    const params = getEventData({ completion_time: state.elapsed });
    trackEvent("puzzle_complete", params);
    if (state.mode === "daily") trackEvent("daily_puzzle_complete", params);
  }

  function render() {
    renderMeta();
    renderBoard();
    renderStats();
    els.completionPanel.hidden = !state.solved;
    els.completionTime.textContent = formatTime(state.elapsed);
    els.completionDifficulty.textContent = ui.difficulties[state.difficulty];
  }

  function renderMeta() {
    const waitingToStart = !state.started && !state.solved;
    els.gameMode.textContent = state.mode === "daily" ? ui.modeDaily : ui.modePractice;
    els.startNote.textContent = state.started ? text.prompt : ui.timerNote;
    els.startOverlay.hidden = !waitingToStart;
    els.startLabel.textContent = state.mode === "daily" ? ui.modeDaily : ui.modePractice;
    els.startInstructions.textContent = text.prompt;
    els.gridSize.textContent = `${state.puzzle.size}×${state.puzzle.size}`;
    els.verified.textContent = state.puzzle.unique ? ui.unique : ui.valid;
    els.startBtn.textContent = state.mode === "daily" ? ui.startDaily : ui.startPractice;
    els.startBtn.disabled = !waitingToStart;
    els.resetBtn.disabled = state.solved;
    els.checkBtn.disabled = !state.started || state.solved;
    els.shareBtn.disabled = !state.started && !state.solved;
  }

  function renderStats() {
    updateElapsed();
    els.timer.textContent = formatTime(state.elapsed);
    const stats = readStats();
    els.streak.textContent = String(stats.streak || 0);
    const best = stats.bestTimes?.[`${game}-${state.difficulty}-${state.mode}`];
    els.bestTime.textContent = best ? formatTime(best) : "--:--";
  }

  function renderBoard() {
    if (game === "tents-and-trees") renderTents();
    else if (game === "hashi") renderHashi();
    else if (game === "slitherlink") renderSlitherlink();
    else renderNonogram();
  }

  function renderTents() {
    const { size } = state.puzzle;
    els.board.className = "logic-board tents-board";
    els.board.style.gridTemplateColumns = `32px repeat(${size}, minmax(0, 1fr))`;
    els.board.style.gridTemplateRows = `30px repeat(${size}, minmax(0, 1fr))`;
    els.board.innerHTML = `<span class="board-corner"></span>${state.puzzle.colClues.map((clue) => `<span class="board-clue">${clue}</span>`).join("")}`;
    for (let row = 0; row < size; row += 1) {
      els.board.insertAdjacentHTML("beforeend", `<span class="board-clue row-clue">${state.puzzle.rowClues[row]}</span>`);
      for (let col = 0; col < size; col += 1) {
        const key = core.cellKey(row, col);
        const tree = state.puzzle.trees.some(([treeRow, treeCol]) => treeRow === row && treeCol === col);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "logic-cell";
        button.dataset.row = String(row);
        button.dataset.col = String(col);
        button.disabled = !state.started || state.solved || tree;
        button.setAttribute("aria-label", formatTemplate(tree ? ui.treeCell : ui.boardCell, { row: row + 1, col: col + 1 }));
        if (tree) {
          button.classList.add("tree-cell");
          button.textContent = "♣";
        } else if (state.tents.has(key)) {
          button.classList.add("tent-cell");
          button.textContent = "▲";
        } else if (state.grass.has(key)) {
          button.classList.add("grass-cell");
          button.textContent = "×";
        }
        if (state.errors.has(key)) button.classList.add("game-error");
        els.board.appendChild(button);
      }
    }
  }

  function renderHashi() {
    const { size } = state.puzzle;
    els.board.className = "logic-board hashi-board";
    els.board.style.setProperty("--board-size", size);
    els.board.innerHTML = "<div class=\"bridge-layer\"></div>";
    const layer = els.board.querySelector(".bridge-layer");
    state.puzzle.edges.forEach((edge) => {
      const count = state.bridges.get(edge.key) || 0;
      if (!count) return;
      const [firstRow, firstCol] = state.puzzle.islands[edge.a];
      const [secondRow, secondCol] = state.puzzle.islands[edge.b];
      const bridge = document.createElement("span");
      bridge.className = `bridge ${firstRow === secondRow ? "bridge-horizontal" : "bridge-vertical"}${count === 2 ? " bridge-double" : ""}`;
      bridge.style.left = `${((firstCol + secondCol) / 2 / (size - 1)) * 100}%`;
      bridge.style.top = `${((firstRow + secondRow) / 2 / (size - 1)) * 100}%`;
      bridge.style.width = firstRow === secondRow ? `${(Math.abs(firstCol - secondCol) / (size - 1)) * 100}%` : "8px";
      bridge.style.height = firstRow === secondRow ? "8px" : `${(Math.abs(firstRow - secondRow) / (size - 1)) * 100}%`;
      if (state.errors.has(edge.key)) bridge.classList.add("game-error");
      layer.appendChild(bridge);
    });
    state.puzzle.islands.forEach(([row, col], index) => {
      const island = document.createElement("button");
      island.type = "button";
      island.className = "island";
      island.dataset.island = String(index);
      island.style.left = `${(col / (size - 1)) * 100}%`;
      island.style.top = `${(row / (size - 1)) * 100}%`;
      island.disabled = !state.started || state.solved;
      island.textContent = String(state.puzzle.clues[index]);
      island.setAttribute("aria-label", formatTemplate(ui.island, { index: index + 1, count: state.puzzle.clues[index] }));
      if (state.selectedIsland === index) island.classList.add("selected");
      if (state.errors.has(`island:${index}`)) island.classList.add("game-error");
      els.board.appendChild(island);
    });
  }

  function renderSlitherlink() {
    const { size } = state.puzzle;
    els.board.className = "logic-board slither-board";
    els.board.style.setProperty("--board-size", size);
    els.board.innerHTML = "";
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const clue = document.createElement("span");
        clue.className = "slither-clue";
        clue.style.left = `${((col + 0.5) / size) * 100}%`;
        clue.style.top = `${((row + 0.5) / size) * 100}%`;
        clue.textContent = state.puzzle.clues[row][col] == null ? "" : String(state.puzzle.clues[row][col]);
        if (state.errors.has(`cell:${row}:${col}`)) clue.classList.add("game-error");
        els.board.appendChild(clue);
      }
    }
    core.slitherEdges(size).forEach((key) => {
      const [type, row, col] = key.split(":");
      const edge = document.createElement("button");
      const value = state.marks.get(key) || 0;
      edge.type = "button";
      edge.className = `slither-edge ${type === "h" ? "edge-horizontal" : "edge-vertical"} ${value === 1 ? "edge-line" : value === 2 ? "edge-cross" : ""}`;
      edge.dataset.edge = key;
      edge.style.left = `${((Number(col) + (type === "h" ? 0.5 : 0)) / size) * 100}%`;
      edge.style.top = `${((Number(row) + (type === "v" ? 0.5 : 0)) / size) * 100}%`;
      if (type === "h") edge.style.width = `${78 / size}%`;
      else edge.style.height = `${78 / size}%`;
      edge.disabled = !state.started || state.solved;
      edge.setAttribute("aria-label", formatTemplate(type === "h" ? ui.horizontalEdge : ui.verticalEdge, { row: Number(row) + 1, col: Number(col) + 1 }));
      if (state.errors.has(`edge:${key}`)) edge.classList.add("game-error");
      els.board.appendChild(edge);
    });
  }

  function renderNonogram() {
    const { size } = state.puzzle;
    els.board.className = "logic-board nonogram-board";
    els.board.style.gridTemplateColumns = `minmax(42px, auto) repeat(${size}, minmax(24px, 1fr))`;
    els.board.style.gridTemplateRows = `minmax(48px, auto) repeat(${size}, minmax(30px, 1fr))`;
    els.board.innerHTML = "<span class=\"board-corner\"></span>";
    state.puzzle.colClues.forEach((clues) => {
      const clue = document.createElement("span");
      clue.className = "nonogram-clue column-clue";
      clue.textContent = clues.join(" ") || "·";
      els.board.appendChild(clue);
    });
    for (let row = 0; row < size; row += 1) {
      const rowClue = document.createElement("span");
      rowClue.className = "nonogram-clue row-clue";
      rowClue.textContent = state.puzzle.rowClues[row].join(" ") || "·";
      els.board.appendChild(rowClue);
      for (let col = 0; col < size; col += 1) {
        const key = core.cellKey(row, col);
        const value = state.marks.get(key) || 0;
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = `logic-cell nonogram-cell ${value === 1 ? "filled-cell" : value === 2 ? "cross-cell" : ""}`;
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        cell.disabled = !state.started || state.solved;
        cell.textContent = value === 2 ? "×" : "";
        cell.setAttribute("aria-label", formatTemplate(ui.boardCell, { row: row + 1, col: col + 1 }));
        if (state.errors.has(key)) cell.classList.add("game-error");
        els.board.appendChild(cell);
      }
    }
  }

  function setStatus(message, tone) {
    els.status.textContent = message;
    els.status.className = `status${tone ? ` ${tone}` : ""}`;
  }

  function formatTemplate(template, values) {
    return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
  }

  function startTimer() {
    stopTimer();
    timerId = window.setInterval(() => {
      updateElapsed();
      els.timer.textContent = formatTime(state.elapsed);
    }, 1000);
  }

  function stopTimer() {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
  }

  function updateElapsed() {
    if (state?.started && !state.solved && state.startedAt) state.elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainder}`;
  }

  function readStats() {
    try {
      return JSON.parse(localStorage.getItem(statsKey) || "{}") || {};
    } catch {
      return {};
    }
  }

  function saveStats(stats) {
    localStorage.setItem(statsKey, JSON.stringify(stats));
  }

  function saveCompletion() {
    const stats = readStats();
    stats.gamesPlayed = Number(stats.gamesPlayed || 0) + 1;
    stats.recentGame = game;
    stats.bestTimes = stats.bestTimes || {};
    const bestKey = `${game}-${state.difficulty}-${state.mode}`;
    if (!stats.bestTimes[bestKey] || state.elapsed < stats.bestTimes[bestKey]) stats.bestTimes[bestKey] = state.elapsed;
    if (state.mode === "daily" && stats.dailyCompleted !== todayKey) {
      const previous = stats.dailyCompleted;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      stats.streak = previous === formatDate(yesterday) ? Number(stats.streak || 0) + 1 : 1;
      stats.dailyCompleted = todayKey;
    }
    saveStats(stats);
  }

  async function shareResult() {
    const shareText = `${text.title}\n${formatTemplate(ui.shareComplete, { time: formatTime(state.elapsed) })}\n${window.location.href}`;
    try {
      if (navigator.share) await navigator.share({ title: text.title, text: shareText });
      else await navigator.clipboard.writeText(shareText);
      setStatus(ui.shareReady, "success");
    } catch {
      setStatus(ui.shareFallback, "");
    }
  }

  function getEventData(extra = {}) {
    return { game_name: game, mode: state.mode, difficulty: state.difficulty, ...extra };
  }

  function trackEvent(name, params = {}) {
    if (typeof root.gtag === "function") root.gtag("event", name, params);
  }

  function createPracticeSeed() {
    if (root.crypto?.getRandomValues) {
      const values = new Uint32Array(1);
      root.crypto.getRandomValues(values);
      return values[0];
    }
    return core.hashString(`${Date.now()}-${Math.random()}`);
  }

  function getTodayKey() {
    return formatDate(new Date());
  }

  function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
})(typeof window !== "undefined" ? window : this);
