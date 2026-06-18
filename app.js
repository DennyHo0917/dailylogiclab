const SIZE = 7;
const EMPTY = 0;
const STAR = 1;
const BLOCK = 2;
const REGION_LABELS = "ABCDEFG";
const MAX_GENERATION_ATTEMPTS = 5000;
const SITE_URL = "https://dailylogiclab.com/";
const DISCARD_CONFIRM_MS = 3500;
const HINT_PENALTIES = [30, 60, 120];
const VALID_SOLUTIONS = buildSolutionPermutations();

const els = {
  board: document.querySelector("#board"),
  status: document.querySelector("#status"),
  timer: document.querySelector("#timer"),
  starCount: document.querySelector("#starCount"),
  streakCount: document.querySelector("#streakCount"),
  puzzleMode: document.querySelector("#puzzleMode"),
  todayLabel: document.querySelector("#todayLabel"),
  proofLabel: document.querySelector("#proofLabel"),
  bestTime: document.querySelector("#bestTime"),
  sharePreview: document.querySelector("#sharePreview"),
  startOverlay: document.querySelector("#startOverlay"),
  startBtn: document.querySelector("#startBtn"),
  startLabel: document.querySelector("#startLabel"),
  resetBtn: document.querySelector("#resetBtn"),
  hintBtn: document.querySelector("#hintBtn"),
  checkBtn: document.querySelector("#checkBtn"),
  practiceBtn: document.querySelector("#practiceBtn"),
  shareBtn: document.querySelector("#shareBtn"),
  dailyBtn: document.querySelector("#dailyBtn"),
  copyLinkBtn: document.querySelector("#copyLinkBtn"),
  comboForm: document.querySelector("#comboForm"),
  sumInput: document.querySelector("#sumInput"),
  cellsInput: document.querySelector("#cellsInput"),
  repeatInput: document.querySelector("#repeatInput"),
  digits: document.querySelector("#digits"),
  comboCount: document.querySelector("#comboCount"),
  comboResults: document.querySelector("#comboResults"),
  copyCombosBtn: document.querySelector("#copyCombosBtn")
};

const storage = {
  streak: "dll-streak",
  solvedDate: "dll-solved-date",
  analytics: "dll-analytics-events",
  bestDailyPrefix: "dll-best-daily-",
  bestPractice: "dll-best-practice"
};

let state = createGameState(getDailyPuzzle(), "daily");
let timerId = null;
let elapsed = 0;
let startedAt = 0;
let pendingAction = null;
let pendingActionTimer = null;
let activeDigits = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

init();

window.__dailyLogicLab = {
  get state() {
    return state;
  },
  generateUniquePuzzle,
  solveStarBattle,
  countCurrentCompletions
};

function init() {
  renderBoard();
  updateStats();
  updateSharePreview();
  updateStartOverlay();
  updateControls();
  setStatus("Press Start when you are ready. The timer is paused.", "");
  bindGameEvents();
  renderDigits();
  bindCalculatorEvents();
  updateCombinations();
  trackEvent("site_loaded", {
    path: location.pathname || "/",
    title: document.title
  });
}

function bindGameEvents() {
  els.startBtn.addEventListener("click", startPuzzle);
  els.resetBtn.addEventListener("click", resetCurrentPuzzle);
  els.hintBtn.addEventListener("click", showHint);
  els.checkBtn.addEventListener("click", checkPuzzle);
  els.practiceBtn.addEventListener("click", loadPracticePuzzle);
  els.dailyBtn.addEventListener("click", loadDailyPuzzle);
  els.shareBtn.addEventListener("click", shareResult);
  els.copyLinkBtn.addEventListener("click", copyPageLink);
}

function bindCalculatorEvents() {
  els.comboForm.addEventListener("input", updateCombinations);
  els.copyCombosBtn.addEventListener("click", copyCombinations);
}

function createGameState(puzzle, mode) {
  return {
    puzzle,
    mode,
    cells: Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY)),
    hints: new Set(),
    errors: new Set(),
    hintCount: 0,
    hintPenalty: 0,
    solved: false,
    started: false
  };
}

function startPuzzle() {
  if (state.started || state.solved) return;
  clearPendingAction();
  state.started = true;
  elapsed = 0;
  startedAt = Date.now();
  startTimer();
  renderBoard();
  updateStartOverlay();
  updateControls();
  updateStats();
  setStatus("Timer started. Solve it clean.", "success");
  trackEvent("puzzle_start", getPuzzleEventData({ start_method: "button" }));
}

function preparePuzzle(message, tone = "") {
  clearPendingAction();
  stopTimer();
  elapsed = 0;
  startedAt = 0;
  state.hints.clear();
  state.errors.clear();
  setModeText();
  setStatus(message, tone);
  renderBoard();
  updateStats();
  updateSharePreview();
  updateStartOverlay();
  updateControls();
}

function getDailyPuzzle() {
  const start = Date.UTC(2026, 0, 1);
  const today = new Date();
  const day = Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - start) / 86400000);
  return generateUniquePuzzle(hashString(`daily-${getTodayKey()}`), day + 1);
}

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildSolutionPermutations() {
  const permutations = [];
  function walk(cols) {
    const row = cols.length;
    if (row === SIZE) {
      permutations.push([...cols]);
      return;
    }
    for (let col = 0; col < SIZE; col += 1) {
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

function generateUniquePuzzle(baseSeed, id) {
  const normalizedSeed = baseSeed >>> 0;
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const rng = createRng((normalizedSeed + attempt * 0x9e3779b9) >>> 0);
    const solution = VALID_SOLUTIONS[randomInt(rng, VALID_SOLUTIONS.length)];
    const regions = generateRegions(solution, rng);
    if (!regions) continue;

    const solutions = solveStarBattle(regions, 2);
    if (solutions.length === 1) {
      return {
        id,
        seed: normalizedSeed,
        attempt,
        solution: solutions[0],
        regions
      };
    }
  }
  throw new Error("Could not generate a unique-solution Star Battle puzzle.");
}

function generateRegions(solution, rng) {
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(-1));
  const assigned = [];
  const unassigned = new Set();

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      unassigned.add(getKey(row, col));
    }
  }

  solution.forEach((col, row) => {
    grid[row][col] = row;
    assigned.push([row, col]);
    unassigned.delete(getKey(row, col));
  });

  let guard = 0;
  while (unassigned.size && guard < 10000) {
    guard += 1;
    const [sourceRow, sourceCol] = assigned[randomInt(rng, assigned.length)];
    const options = orthogonalNeighbors(sourceRow, sourceCol).filter(([row, col]) =>
      unassigned.has(getKey(row, col))
    );
    if (!options.length) continue;

    const [row, col] = options[randomInt(rng, options.length)];
    grid[row][col] = grid[sourceRow][sourceCol];
    assigned.push([row, col]);
    unassigned.delete(getKey(row, col));
  }

  if (unassigned.size) return null;
  return grid.map((row) => row.map((region) => REGION_LABELS[region]).join(""));
}

function solveStarBattle(regions, limit = 2) {
  const solutions = [];
  const usedCols = Array(SIZE).fill(false);
  const usedRegions = Array(SIZE).fill(false);

  function walk(row, cols) {
    if (solutions.length >= limit) return;
    if (row === SIZE) {
      solutions.push([...cols]);
      return;
    }

    for (let col = 0; col < SIZE; col += 1) {
      const region = regionIndexFromRows(regions, row, col);
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

function countCurrentCompletions(limit = 2) {
  const currentStars = [];
  const blocked = new Set();
  const usedRows = Array(SIZE).fill(false);
  const usedCols = Array(SIZE).fill(false);
  const usedRegions = Array(SIZE).fill(false);

  forEachCell((row, col) => {
    if (state.cells[row][col] === BLOCK) blocked.add(getKey(row, col));
    if (state.cells[row][col] === STAR) currentStars.push([row, col]);
  });

  for (const [row, col] of currentStars) {
    const region = regionIndex(row, col);
    if (usedRows[row] || usedCols[col] || usedRegions[region]) return 0;
    for (const [otherRow, otherCol] of currentStars) {
      if (row === otherRow && col === otherCol) continue;
      if (Math.abs(row - otherRow) <= 1 && Math.abs(col - otherCol) <= 1) return 0;
    }
    usedRows[row] = true;
    usedCols[col] = true;
    usedRegions[region] = true;
  }

  let count = 0;
  function walk(row, cols) {
    if (count >= limit) return;
    if (row === SIZE) {
      count += 1;
      return;
    }

    const fixed = currentStars.find(([starRow]) => starRow === row);
    const columns = fixed ? [fixed[1]] : [...Array(SIZE).keys()];
    for (const col of columns) {
      const region = regionIndex(row, col);
      const key = getKey(row, col);
      const alreadyStar = fixed && fixed[1] === col;
      if (!alreadyStar && blocked.has(key)) continue;
      if (!alreadyStar && (usedCols[col] || usedRegions[region])) continue;
      if (row > 0 && cols[row - 1] !== undefined && Math.abs(col - cols[row - 1]) <= 1) continue;

      if (!alreadyStar) {
        usedCols[col] = true;
        usedRegions[region] = true;
      }
      cols[row] = col;
      walk(row + 1, cols);
      cols[row] = undefined;
      if (!alreadyStar) {
        usedRegions[region] = false;
        usedCols[col] = false;
      }
    }
  }

  walk(0, []);
  return count;
}

function orthogonalNeighbors(row, col) {
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1]
  ].filter(([nextRow, nextCol]) => inside(nextRow, nextCol));
}

function regionIndexFromRows(regions, row, col) {
  return regions[row].charCodeAt(col) - 65;
}

function createPracticeSeed() {
  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0];
  }
  return hashString(`${Date.now()}-${Math.random()}`);
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

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function renderBoard() {
  els.board.innerHTML = "";
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const cell = document.createElement("button");
      const key = getKey(row, col);
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      cell.dataset.region = String(regionIndex(row, col));
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", getCellLabel(row, col));
      cell.disabled = !state.started || state.solved;
      cell.addEventListener("click", () => cycleCell(row, col));
      cell.addEventListener("keydown", (event) => handleCellKeydown(event, row, col));
      if (state.cells[row][col] === STAR) {
        cell.classList.add("star");
        cell.textContent = "\u2605";
      }
      if (state.cells[row][col] === BLOCK) {
        cell.classList.add("blocked");
      }
      if (state.hints.has(key)) {
        cell.classList.add("hint");
      }
      if (state.errors.has(key)) {
        cell.classList.add("error");
      }
      els.board.appendChild(cell);
    }
  }
}

function cycleCell(row, col) {
  if (state.solved) return;
  if (!state.started) {
    setStatus("Press Start before placing stars.", "");
    updateStartOverlay();
    return;
  }
  state.cells[row][col] = (state.cells[row][col] + 1) % 3;
  commitCellChange(row, col);
}

function setCellValue(row, col, value) {
  if (state.solved || !state.started) return;
  state.cells[row][col] = value;
  commitCellChange(row, col);
}

function commitCellChange(row, col) {
  clearPendingAction();
  state.hints.clear();
  state.errors.clear();
  setStatus("Keep going.", "");
  renderBoard();
  updateStats();
  focusCell(row, col);
  if (isSolved().ok) {
    markSolved();
  }
}

function handleCellKeydown(event, row, col) {
  const movement = {
    ArrowUp: [-1, 0],
    ArrowRight: [0, 1],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1]
  }[event.key];

  if (movement) {
    event.preventDefault();
    focusCell(clamp(row + movement[0], 0, SIZE - 1), clamp(col + movement[1], 0, SIZE - 1));
    return;
  }

  const key = event.key.toLowerCase();
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    cycleCell(row, col);
  } else if (key === "s") {
    event.preventDefault();
    setCellValue(row, col, STAR);
  } else if (key === "x" || key === ".") {
    event.preventDefault();
    setCellValue(row, col, BLOCK);
  } else if (event.key === "Backspace" || event.key === "Delete" || key === "0") {
    event.preventDefault();
    setCellValue(row, col, EMPTY);
  }
}

function focusCell(row, col) {
  const cell = els.board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (cell && !cell.disabled) {
    cell.focus({ preventScroll: true });
  }
}

function getCellLabel(row, col) {
  const value = state.cells[row][col];
  const mark = value === STAR ? "star" : value === BLOCK ? "blocked" : "empty";
  return `Row ${row + 1}, column ${col + 1}, color ${REGION_LABELS[regionIndex(row, col)]}, ${mark}`;
}

function hasActiveProgress() {
  return state.started && !state.solved && state.cells.flat().some((value) => value !== EMPTY);
}

function requestDestructiveAction(actionKey, message, action) {
  if (!hasActiveProgress()) {
    clearPendingAction();
    action();
    return;
  }

  if (pendingAction === actionKey) {
    clearPendingAction();
    action();
    return;
  }

  pendingAction = actionKey;
  window.clearTimeout(pendingActionTimer);
  pendingActionTimer = window.setTimeout(clearPendingAction, DISCARD_CONFIRM_MS);
  setStatus(message, "");
  trackEvent("discard_prompt_shown", getPuzzleEventData({ action: actionKey }));
}

function clearPendingAction() {
  pendingAction = null;
  if (pendingActionTimer) {
    window.clearTimeout(pendingActionTimer);
    pendingActionTimer = null;
  }
}

function resetCurrentPuzzle() {
  requestDestructiveAction("reset", "Click Reset again to clear this board.", () => {
    trackEvent("puzzle_reset", getPuzzleEventData());
    state = createGameState(state.puzzle, state.mode);
    preparePuzzle("Puzzle reset. Press Start when you are ready.", "");
  });
}

function loadDailyPuzzle() {
  requestDestructiveAction("daily", "Click Daily again to discard this board.", () => {
    setStatus("Generating a unique daily puzzle...", "");
    state = createGameState(getDailyPuzzle(), "daily");
    preparePuzzle("Daily puzzle ready. Press Start when you are ready.", "success");
    trackEvent("daily_puzzle_loaded", getPuzzleEventData());
  });
}

function loadPracticePuzzle() {
  requestDestructiveAction("practice", "Click New Practice again to discard this board.", () => {
    setStatus("Generating a unique practice puzzle...", "");
    const next = generateUniquePuzzle(createPracticeSeed(), "P" + String(Date.now()).slice(-5));
    state = createGameState(next, "practice");
    preparePuzzle("Practice puzzle ready. Press Start when you are ready.", "success");
    trackEvent("new_practice_clicked", getPuzzleEventData());
  });
}

function checkPuzzle() {
  if (!state.started) {
    setStatus("Press Start before checking the board.", "");
    updateStartOverlay();
    return;
  }
  const result = isSolved();
  state.errors = result.errors;
  state.hints.clear();
  let outcome = "incomplete";
  if (result.ok) {
    outcome = "solved";
    markSolved();
  } else if (result.errors.size) {
    outcome = "conflict";
    setStatus("Something conflicts with the rules.", "error");
  } else if (countCurrentCompletions(1) === 0) {
    outcome = "no_valid_completion";
    setStatus("Your current marks have no valid completion. Remove a star or blocked mark.", "error");
  } else {
    setStatus("No conflicts yet. Some rows, columns, or regions still need stars.", "");
  }
  trackEvent("check_used", getPuzzleEventData({ outcome }));
  renderBoard();
}

function showHint() {
  if (!state.started) {
    setStatus("Press Start before asking for a hint.", "");
    updateStartOverlay();
    return;
  }
  if (state.hintCount >= HINT_PENALTIES.length) {
    setStatus("No hints left for this puzzle. Keep solving or start a new practice.", "");
    return;
  }
  state.errors.clear();
  state.hints.clear();
  const result = isSolved();
  const hintLevel = state.hintCount;
  const penalty = HINT_PENALTIES[hintLevel];

  if (result.errors.size) {
    state.errors = result.errors;
    applyHintPenalty(penalty);
    setStatus(`Hint ${hintLevel + 1}: fix the highlighted conflict first. +${penalty}s`, "error");
    trackEvent("hint_used", getPuzzleEventData({ outcome: "conflict", hint_level: hintLevel + 1, penalty_seconds: penalty }));
    renderBoard();
    updateControls();
    updateSharePreview();
    return;
  }

  if (countCurrentCompletions(1) === 0) {
    applyHintPenalty(penalty);
    setStatus(`Hint ${hintLevel + 1}: your current marks have no valid completion. Undo one of them. +${penalty}s`, "error");
    trackEvent("hint_used", getPuzzleEventData({ outcome: "no_valid_completion", hint_level: hintLevel + 1, penalty_seconds: penalty }));
    renderBoard();
    updateControls();
    updateSharePreview();
    return;
  }

  const candidates = getCandidates();
  const groups = [
    ...groupHints("row", candidates),
    ...groupHints("col", candidates),
    ...groupHints("region", candidates)
  ];
  const sortedGroups = groups
    .filter((group) => group.cells.length)
    .sort((a, b) => a.cells.length - b.cells.length);

  if (hintLevel === 0 && sortedGroups.length) {
    const group = sortedGroups[0];
    applyHintPenalty(penalty);
    setStatus(`Hint 1: focus on ${describeHintGroup(group)}; it has the fewest options. +${penalty}s`, "");
    trackEvent("hint_used", getPuzzleEventData({ outcome: "focus_group", hint_type: group.type, hint_group: describeHintGroup(group), hint_level: 1, penalty_seconds: penalty }));
    renderBoard();
    updateControls();
    updateSharePreview();
    return;
  }

  if (hintLevel >= 2) {
    const starKey = getNextSolutionStarKey();
    if (starKey) {
      applyHintPenalty(penalty);
      state.hints.add(starKey);
      setStatus(`Hint 3: this square is a star in the solution. +${penalty}s`, "");
      trackEvent("hint_used", getPuzzleEventData({ outcome: "solution_star", hint_level: 3, penalty_seconds: penalty }));
      renderBoard();
      updateControls();
      updateSharePreview();
      return;
    }
  }

  const single = groups.find((group) => group.cells.length === 1);

  if (single) {
    applyHintPenalty(penalty);
    state.hints.add(single.cells[0]);
    setStatus(`Hint ${hintLevel + 1}: only one candidate remains in ${describeHintGroup(single)}. +${penalty}s`, "");
    trackEvent("hint_used", getPuzzleEventData({ outcome: "single_candidate", hint_type: single.type, hint_group: describeHintGroup(single), hint_level: hintLevel + 1, penalty_seconds: penalty }));
    renderBoard();
    updateControls();
    updateSharePreview();
    return;
  }

  const narrow = sortedGroups.find((group) => group.cells.length > 1);

  if (narrow) {
    applyHintPenalty(penalty);
    narrow.cells.forEach((key) => state.hints.add(key));
    setStatus(`Hint ${hintLevel + 1}: these are the best candidates in ${describeHintGroup(narrow)}. +${penalty}s`, "");
    trackEvent("hint_used", getPuzzleEventData({ outcome: "narrow_group", hint_type: narrow.type, hint_group: describeHintGroup(narrow), hint_level: hintLevel + 1, penalty_seconds: penalty }));
  } else {
    setStatus("No useful hint found from the current marks.", "");
    trackEvent("hint_used", getPuzzleEventData({ outcome: "no_hint", hint_level: hintLevel + 1, penalty_seconds: 0 }));
  }
  renderBoard();
  updateControls();
  updateSharePreview();
}

function applyHintPenalty(seconds) {
  updateElapsedFromClock();
  elapsed += seconds;
  state.hintCount += 1;
  state.hintPenalty += seconds;
  startedAt = Date.now() - elapsed * 1000;
  updateStats();
}

function getNextSolutionStarKey() {
  for (let row = 0; row < SIZE; row += 1) {
    const col = state.puzzle.solution[row];
    if (state.cells[row][col] !== STAR) {
      return getKey(row, col);
    }
  }
  return "";
}

function markSolved() {
  if (state.solved) return;
  updateElapsedFromClock();
  state.solved = true;
  stopTimer();
  state.errors.clear();
  state.hints.clear();
  const isBest = saveBestTime();
  if (state.mode === "daily") {
    const today = getTodayKey();
    if (localStorage.getItem(storage.solvedDate) !== today) {
      const nextStreak = Number(localStorage.getItem(storage.streak) || "0") + 1;
      localStorage.setItem(storage.streak, String(nextStreak));
      localStorage.setItem(storage.solvedDate, today);
    }
  }
  const nextStep = state.mode === "daily" ? "Share it or try New Practice." : "Share it or try another practice.";
  const hintSummary = state.hintCount ? ` Hints: ${state.hintCount} (+${state.hintPenalty}s).` : "";
  setStatus(`Solved in ${formatTime(elapsed)}. ${isBest ? "New best time." : "Nice."}${hintSummary} ${nextStep}`, "success");
  trackEvent("puzzle_solved", getPuzzleEventData({ time_seconds: elapsed, new_best: isBest }));
  renderBoard();
  updateStats();
  updateStartOverlay();
  updateControls();
  updateSharePreview();
}

function isSolved() {
  const errors = new Set();
  const rowCounts = Array(SIZE).fill(0);
  const colCounts = Array(SIZE).fill(0);
  const regionCounts = Array(SIZE).fill(0);
  const stars = [];

  forEachCell((row, col) => {
    if (state.cells[row][col] === STAR) {
      rowCounts[row] += 1;
      colCounts[col] += 1;
      regionCounts[regionIndex(row, col)] += 1;
      stars.push([row, col]);
    }
  });

  for (let i = 0; i < SIZE; i += 1) {
    if (rowCounts[i] > 1) markGroup("row", i, errors);
    if (colCounts[i] > 1) markGroup("col", i, errors);
    if (regionCounts[i] > 1) markGroup("region", i, errors);
  }

  for (let i = 0; i < stars.length; i += 1) {
    for (let j = i + 1; j < stars.length; j += 1) {
      const [aRow, aCol] = stars[i];
      const [bRow, bCol] = stars[j];
      if (Math.abs(aRow - bRow) <= 1 && Math.abs(aCol - bCol) <= 1) {
        errors.add(getKey(aRow, aCol));
        errors.add(getKey(bRow, bCol));
      }
    }
  }

  const complete =
    stars.length === SIZE &&
    rowCounts.every((count) => count === 1) &&
    colCounts.every((count) => count === 1) &&
    regionCounts.every((count) => count === 1);

  return { ok: complete && errors.size === 0, errors };
}

function markGroup(type, index, errors) {
  forEachCell((row, col) => {
    if (state.cells[row][col] !== STAR) return;
    if (type === "row" && row === index) errors.add(getKey(row, col));
    if (type === "col" && col === index) errors.add(getKey(row, col));
    if (type === "region" && regionIndex(row, col) === index) errors.add(getKey(row, col));
  });
}

function getCandidates() {
  const candidates = new Set();
  forEachCell((row, col) => {
    if (state.cells[row][col] === STAR || state.cells[row][col] === BLOCK) return;
    if (rowHasStar(row) || colHasStar(col) || regionHasStar(regionIndex(row, col))) return;
    if (touchesStar(row, col)) return;
    candidates.add(getKey(row, col));
  });
  return candidates;
}

function groupHints(type, candidates) {
  const groups = [];
  for (let i = 0; i < SIZE; i += 1) {
    let alreadySolved = false;
    const cells = [];
    forEachCell((row, col) => {
      const key = getKey(row, col);
      const inGroup =
        (type === "row" && row === i) ||
        (type === "col" && col === i) ||
        (type === "region" && regionIndex(row, col) === i);
      if (!inGroup) return;
      if (state.cells[row][col] === STAR) alreadySolved = true;
      if (candidates.has(key)) cells.push(key);
    });
    if (!alreadySolved && cells.length) groups.push({ type, index: i, cells });
  }
  return groups;
}

function describeHintGroup(group) {
  if (group.type === "row") return `row ${group.index + 1}`;
  if (group.type === "col") return `column ${group.index + 1}`;
  return `color ${REGION_LABELS[group.index]}`;
}

function touchesStar(row, col) {
  for (let rowDelta = -1; rowDelta <= 1; rowDelta += 1) {
    for (let colDelta = -1; colDelta <= 1; colDelta += 1) {
      if (rowDelta === 0 && colDelta === 0) continue;
      const nextRow = row + rowDelta;
      const nextCol = col + colDelta;
      if (!inside(nextRow, nextCol)) continue;
      if (state.cells[nextRow][nextCol] === STAR) return true;
    }
  }
  return false;
}

function rowHasStar(row) {
  return state.cells[row].includes(STAR);
}

function colHasStar(col) {
  return state.cells.some((row) => row[col] === STAR);
}

function regionHasStar(region) {
  let found = false;
  forEachCell((row, col) => {
    if (regionIndex(row, col) === region && state.cells[row][col] === STAR) {
      found = true;
    }
  });
  return found;
}

function regionIndex(row, col) {
  return state.puzzle.regions[row].charCodeAt(col) - 65;
}

function forEachCell(callback) {
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      callback(row, col);
    }
  }
}

function inside(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

function getKey(row, col) {
  return `${row}-${col}`;
}

function updateStartOverlay() {
  const shouldShow = !state.started && !state.solved;
  els.startOverlay.hidden = !shouldShow;
  els.startLabel.textContent =
    state.mode === "daily" ? `Daily puzzle #${state.puzzle.id}` : `Practice puzzle #${state.puzzle.id}`;
  els.startBtn.textContent = state.mode === "daily" ? "Start Daily Puzzle" : "Start Practice";
  els.startBtn.disabled = !shouldShow;
}

function updateControls() {
  const playable = state.started && !state.solved;
  const nextPenalty = HINT_PENALTIES[state.hintCount];
  els.hintBtn.textContent = nextPenalty ? `Hint +${nextPenalty}s` : "No Hints Left";
  els.hintBtn.disabled = !playable || !nextPenalty;
  els.checkBtn.disabled = !playable;
  els.shareBtn.disabled = !state.started && !state.solved;
}

function getBestTimeKey() {
  if (state.mode === "daily") {
    return `${storage.bestDailyPrefix}${getTodayKey()}`;
  }
  return storage.bestPractice;
}

function getBestTime() {
  return Number(localStorage.getItem(getBestTimeKey()) || "0");
}

function saveBestTime() {
  const best = getBestTime();
  if (!best || elapsed < best) {
    localStorage.setItem(getBestTimeKey(), String(elapsed));
    return true;
  }
  return false;
}

function updateStats() {
  const starTotal = state.cells.flat().filter((value) => value === STAR).length;
  const best = getBestTime();
  els.starCount.textContent = `${starTotal}/${SIZE}`;
  els.streakCount.textContent = localStorage.getItem(storage.streak) || "0";
  els.timer.textContent = formatTime(elapsed);
  els.bestTime.textContent = best ? formatTime(best) : "--:--";
  setModeText();
}

function setModeText() {
  els.puzzleMode.textContent = state.mode === "daily" ? "Daily puzzle" : "Practice puzzle";
  els.todayLabel.textContent = state.mode === "daily" ? `#${state.puzzle.id} Today` : `#${state.puzzle.id} Practice`;
  els.proofLabel.textContent = "Unique";
}

function startTimer() {
  stopTimer();
  startedAt = Date.now() - elapsed * 1000;
  timerId = window.setInterval(updateElapsedFromClock, 250);
}

function updateElapsedFromClock() {
  if (!state.started || state.solved || !startedAt) return;
  elapsed = Math.floor((Date.now() - startedAt) / 1000);
  els.timer.textContent = formatTime(elapsed);
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function setStatus(message, tone) {
  els.status.textContent = message;
  els.status.className = `status ${tone || ""}`.trim();
}

function getPuzzleEventData(extra = {}) {
  return {
    mode: state.mode,
    puzzle_id: String(state.puzzle.id),
    proof: "unique_solution",
    stars: state.cells.flat().filter((value) => value === STAR).length,
    elapsed_seconds: elapsed,
    hint_count: state.hintCount,
    hint_penalty_seconds: state.hintPenalty,
    ...extra
  };
}

function trackEvent(name, params = {}) {
  const payload = {
    event: name,
    ...params,
    timestamp: new Date().toISOString()
  };

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...params });
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
  if (typeof window.plausible === "function") {
    window.plausible(name, { props: params });
  }

  try {
    const recent = JSON.parse(localStorage.getItem(storage.analytics) || "[]");
    recent.push(payload);
    localStorage.setItem(storage.analytics, JSON.stringify(recent.slice(-50)));
  } catch (error) {
    // Analytics should never interrupt the puzzle.
  }

  document.dispatchEvent(new CustomEvent("dailylogiclab:event", { detail: payload }));
}

function updateSharePreview() {
  els.sharePreview.textContent = buildShareText();
}

function buildShareText() {
  const title = state.mode === "daily" ? `Daily Star Battle #${state.puzzle.id}` : `Star Battle Practice #${state.puzzle.id}`;
  const solved = state.solved ? `Solved in ${formatTime(elapsed)}` : "In progress";
  const hints = `Hints: ${state.hintCount} (+${state.hintPenalty}s)`;
  return `${title}\n${solved}\nStars: ${state.cells.flat().filter((value) => value === STAR).length}/${SIZE}\n${hints}\n${getShareUrl()}`;
}

async function shareResult() {
  const text = buildShareText();
  trackEvent("share_clicked", getPuzzleEventData({ solved: state.solved }));
  if (navigator.share) {
    await navigator.share({ text }).catch(() => {});
    return;
  }
  await writeClipboard(text);
  setStatus("Share text copied.", "success");
}

async function copyPageLink() {
  await writeClipboard(getShareUrl());
  trackEvent("copy_link_clicked", getPuzzleEventData());
  setStatus("Link copied.", "success");
}

function getShareUrl() {
  if (location.protocol === "file:") {
    return SITE_URL;
  }
  return location.href.split("#")[0];
}

async function writeClipboard(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

function renderDigits() {
  els.digits.innerHTML = "";
  for (let digit = 1; digit <= 9; digit += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "digit-toggle active";
    button.textContent = String(digit);
    button.setAttribute("aria-pressed", "true");
    button.addEventListener("click", () => {
      if (activeDigits.has(digit)) {
        activeDigits.delete(digit);
      } else {
        activeDigits.add(digit);
      }
      button.classList.toggle("active", activeDigits.has(digit));
      button.setAttribute("aria-pressed", activeDigits.has(digit) ? "true" : "false");
      updateCombinations();
    });
    els.digits.appendChild(button);
  }
}

function updateCombinations() {
  const sum = clamp(Number(els.sumInput.value || 0), 1, 90);
  const count = clamp(Number(els.cellsInput.value || 0), 1, 9);
  const allowRepeats = els.repeatInput.checked;
  const digits = [...activeDigits].sort((a, b) => a - b);
  const combos = findCombos(sum, count, digits, allowRepeats);

  els.comboCount.textContent = `${combos.length} ${combos.length === 1 ? "combination" : "combinations"}`;
  els.comboResults.innerHTML = "";

  if (!combos.length) {
    const empty = document.createElement("span");
    empty.className = "combo-pill";
    empty.textContent = "No match";
    els.comboResults.appendChild(empty);
    return;
  }

  combos.forEach((combo) => {
    const pill = document.createElement("span");
    pill.className = "combo-pill";
    pill.textContent = combo.join(" + ");
    els.comboResults.appendChild(pill);
  });
}

function findCombos(target, length, digits, allowRepeats) {
  const results = [];
  function walk(startIndex, combo, total) {
    if (combo.length === length) {
      if (total === target) results.push([...combo]);
      return;
    }
    if (total >= target) return;

    for (let i = startIndex; i < digits.length; i += 1) {
      const digit = digits[i];
      combo.push(digit);
      walk(allowRepeats ? i : i + 1, combo, total + digit);
      combo.pop();
    }
  }
  walk(0, [], 0);
  return results;
}

async function copyCombinations() {
  const text = [...els.comboResults.querySelectorAll(".combo-pill")]
    .map((node) => node.textContent)
    .join("\n");
  await writeClipboard(text);
  trackEvent("calculator_copy_clicked", {
    sum: Number(els.sumInput.value || 0),
    cells: Number(els.cellsInput.value || 0),
    allow_repeats: els.repeatInput.checked,
    active_digits: [...activeDigits].sort((a, b) => a - b).join(""),
    result_count: els.comboResults.querySelectorAll(".combo-pill").length
  });
  els.comboCount.textContent = "Copied";
  window.setTimeout(updateCombinations, 900);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
