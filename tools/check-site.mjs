import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [];
const versionedAssets = ["app.js", "language-redirect.js", "logic-games-core.js", "logic-games.js", "styles.css"];
const assetVersions = Object.fromEntries(versionedAssets.map((asset) => [
  asset,
  createHash("sha256").update(fs.readFileSync(path.join(root, asset))).digest("hex").slice(0, 10)
]));

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
  for (const asset of versionedAssets) {
    if (!html.includes(asset)) continue;
    assert.ok(html.includes(`${asset}?v=${assetVersions[asset]}`), `${relative}: stale ${asset} version`);
    if (asset.endsWith(".js")) assert.match(html, new RegExp(`<script defer src="[^"]*${asset.replaceAll(".", "\\.")}\\?v=`), `${relative}: ${asset} must be deferred`);
  }
}

const headers = fs.readFileSync(path.join(root, "_headers"), "utf8");
for (const asset of versionedAssets) {
  assert.ok(headers.includes(`/${asset}`), `_headers: missing ${asset}`);
}
assert.equal((headers.match(/max-age=31536000, immutable/g) || []).length, versionedAssets.length, "_headers: static assets need one-year immutable caching");

const scriptFiles = files.filter((file) => /\.(?:m?js)$/.test(file));
for (const file of scriptFiles) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  assert.equal(result.status, 0, `${path.relative(root, file)}: ${result.stderr || result.stdout}`);
}

console.log(`${htmlFiles.length} HTML files and ${scriptFiles.length} JavaScript files passed static checks`);
