import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const analyticsSource = fs.readFileSync(new URL("../analytics.js", import.meta.url), "utf8");
const languages = ["en", "de", "es", "fr", "ja", "pt-BR", "zh-CN"];

function preview(hostname, language = "en") {
  const scripts = [];
  const window = { location: { hostname } };
  const context = vm.createContext({ window, document: {
    documentElement: { lang: language },
    createElement: () => ({}), head: { appendChild: (script) => scripts.push(script) }
  } });
  vm.runInContext(analyticsSource, context);
  vm.runInContext(analyticsSource, context);
  return { window, scripts };
}

for (const hostname of ["localhost", "127.0.0.1", "[::1]", "", "192.168.1.8", "dailylogiclab.preview.workers.dev", "dailylogiclab.com.example.org"]) {
  const { window, scripts } = preview(hostname);
  assert.equal(window.DailyLogicAnalytics.enabled, false, `${hostname}: production analytics disabled`);
  assert.equal(scripts.length, 0, `${hostname}: no Google script requests`);
  let eventCallback = 0;
  let clientId = "not called";
  window.gtag("event", "puzzle_complete", { event_callback: () => eventCallback++ });
  window.gtag("get", "G-6NY29HPM34", "client_id", (value) => { clientId = value; });
  assert.equal(eventCallback, 1, "disabled event callback must unblock navigation");
  assert.equal(clientId, undefined, "preview must not create a production client id");
  assert.equal(window.dataLayer, undefined, "preview events must not enter a production queue");
}

for (const hostname of ["dailylogiclab.com", "www.dailylogiclab.com"]) for (const language of languages) {
  const { window, scripts } = preview(hostname, language);
  assert.equal(window.DailyLogicAnalytics.enabled, true);
  assert.equal(window.DailyLogicAnalytics.language, language.toLowerCase());
  assert.equal(scripts.length, 1, "reinitializing must not duplicate the Google loader");
  assert.equal(scripts[0].src, "https://www.googletagmanager.com/gtag/js?id=G-6NY29HPM34");
  assert.equal(scripts[0].async, true);
  assert.equal(window.dataLayer.length, 2, "initialize GA4 only once");
  window.gtag("event", "puzzle_complete", { game_name: "slitherlink" });
  assert.equal(window.dataLayer[2][1], "puzzle_complete", "production game events still queue");
}

// Execute the actual completion handlers with rendering/storage fixtures.
// This verifies event coverage and repeat guards without solving every UI board.
function handler(source, name, nextName) {
  const start = source.indexOf(`function ${name}(`);
  const end = source.indexOf(`function ${nextName}(`, start + 1);
  assert.ok(start >= 0 && end > start, `missing ${name} handler`);
  return source.slice(start, end).trim();
}
const app = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const logic = fs.readFileSync(new URL("../logic-games.js", import.meta.url), "utf8");
const noop = () => {};
for (const language of languages) for (const mode of ["daily", "practice"]) {
  const events = [];
  const state = { mode, solved: false, puzzle: { id: "example", seed: 42 }, puzzleDate: "2026-10-02",
    errors: new Set(), hints: new Set(), hintCount: 0, hintPenalty: 0, cells: [[1]] };
  const sandbox = { state, elapsed: 12, STAR: 1, document: { documentElement: { lang: language } },
    getProfile: () => ({ key: "quick", size: 7, starMode: "1-star", starsPerGroup: 1 }),
    updateElapsedFromClock: noop, stopTimer: noop, saveBestTime: () => false,
    clearProgress: noop, setStatus: noop, renderBoard: noop, updateStats: noop,
    updateStartOverlay: noop, updateControls: noop, updateSharePreview: noop,
    formatTime: String, t: (key) => key, storage: { solvedDate: "solved", streak: "streak" },
    localStorage: { getItem: () => null, setItem: noop }, TWO_NOT_TOUCH_CORE: { nextDailyStreak: () => 1 },
    trackEvent: (name, params) => events.push({ name, params }) };
  vm.runInNewContext(`${handler(app, "getPuzzleEventData", "trackEvent")}\n${handler(app, "markSolved", "isSolved")}\nmarkSolved();markSolved();`, sandbox);
  checkCompletion(events, "two-not-touch", language, mode);

  for (const game of ["tents-and-trees", "hashi", "slitherlink", "nonogram"]) {
    const records = [];
    const context = { game, state: { mode, solved: false, elapsed: 12, difficulty: "easy" },
      document: { documentElement: { lang: language } }, stopTimer: noop, saveCompletion: noop,
      clearProgress: noop, render: noop, setStatus: noop, formatTime: String,
      ui: { complete: "Complete", difficulties: { easy: "Easy" } },
      els: { completionPanel: {}, completionTime: {}, completionDifficulty: {} },
      trackEvent: (name, params) => records.push({ name, params }) };
    vm.runInNewContext(`${handler(logic, "getEventData", "trackEvent")}\n${handler(logic, "completePuzzle", "render")}\ncompletePuzzle();completePuzzle();`, context);
    checkCompletion(records, game, language, mode);
  }
}

function checkCompletion(events, game, language, mode) {
  const completions = events.filter((event) => event.name === "puzzle_complete");
  assert.equal(completions.length, 1, `${game}/${language}/${mode}: exactly one completion`);
  assert.equal(events.filter((event) => event.name === "daily_puzzle_complete").length, mode === "daily" ? 1 : 0);
  assert.equal(events.some((event) => event.name === "puzzle_solved"), false, "legacy event must not double count");
  assert.equal(completions[0].params.game_name, game);
  assert.equal(completions[0].params.language, language.toLowerCase());
  assert.equal(completions[0].params.mode, mode);
  assert.equal(completions[0].params.time_seconds, 12);
}

console.log("Preview hosts send no GA4 events; production initialization and callbacks work.");
console.log("All 5 games × 7 languages × 2 modes report one unified completion.");
