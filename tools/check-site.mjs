import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else files.push(file);
  }
}

walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);
  assert.match(html, /^<!doctype html>/i, `${relative}: missing doctype`);
  assert.match(html, /<html[\s>]/i, `${relative}: missing html element`);
  assert.match(html, /<\/html>\s*$/i, `${relative}: missing closing html element`);
  assert.match(html, /<title>[^<]+<\/title>/i, `${relative}: missing title`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${relative}: duplicate id`);
}

const scriptFiles = files.filter((file) => /\.(?:m?js)$/.test(file));
for (const file of scriptFiles) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  assert.equal(result.status, 0, `${path.relative(root, file)}: ${result.stderr || result.stdout}`);
}

console.log(`${htmlFiles.length} HTML files and ${scriptFiles.length} JavaScript files passed static checks`);
