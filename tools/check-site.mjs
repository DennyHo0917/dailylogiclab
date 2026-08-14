import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = "https://dailylogiclab.com";
const files = [];
const pageRecords = [];
const versionedAssets = ["app.js", "language-redirect.js", "logic-games-core.js", "logic-games.js", "two-not-touch-core.js", "two-not-touch-catalog.js", "styles.css"];
const assetVersions = Object.fromEntries(versionedAssets.map((asset) => [
  asset,
  createHash("sha256").update(fs.readFileSync(path.join(root, asset))).digest("hex").slice(0, 10)
]));

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
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
  assert.ok(!html.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"), `${relative}: AdSense loader must not be present`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${relative}: duplicate id`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] || "";
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
  const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
    .map((match) => ({ language: match[1], url: match[2] }));
  const menu = html.match(/<div class="language-menu">([\s\S]*?)<\/div>/)?.[1] || "";
  const menuUrls = [...menu.matchAll(/<a href="([^"]+)"/g)].map((match) => new URL(match[1], `${site}/`).href);
  pageRecords.push({ file, relative, canonical, noindex, alternates, menuUrls });
  for (const asset of versionedAssets) {
    if (!html.includes(asset)) continue;
    assert.ok(html.includes(`${asset}?v=${assetVersions[asset]}`), `${relative}: stale ${asset} version`);
    if (asset.endsWith(".js")) assert.match(html, new RegExp(`<script defer src="[^"]*${asset.replaceAll(".", "\\.")}\\?v=`), `${relative}: ${asset} must be deferred`);
    if (asset === "styles.css") assert.match(html, /<link rel="stylesheet" href="[^"]*styles\.css\?v=[^"]+">/, `${relative}: styles.css must load before first paint`);
  }
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "sitemap.xml: duplicate loc");
assert.ok(sitemapUrls.includes(`${site}/es/calculadora-combinaciones-sudoku-killer`), "sitemap.xml: missing Spanish Killer Sudoku page");
const sitemapSet = new Set(sitemapUrls);
const indexablePages = pageRecords.filter((page) => page.canonical && !page.noindex);
const canonicalOwners = new Map();

function publicUrl(relative) {
  const normalized = relative.replaceAll("\\", "/");
  if (normalized === "index.html") return `${site}/`;
  if (normalized.endsWith("/index.html")) return `${site}/${normalized.slice(0, -"index.html".length)}`;
  return `${site}/${normalized.replace(/\.html$/, "")}`;
}

for (const page of pageRecords) {
  if (page.noindex) assert.ok(!sitemapSet.has(publicUrl(page.relative)), `${page.relative}: noindex URL must not be in sitemap`);
}

for (const page of indexablePages) {
  assert.ok(sitemapSet.has(page.canonical), `${page.relative}: canonical missing from sitemap`);
  assert.ok(!canonicalOwners.has(page.canonical), `${page.relative}: duplicate canonical also used by ${canonicalOwners.get(page.canonical)}`);
  canonicalOwners.set(page.canonical, page.relative);
}

for (const url of sitemapUrls) assert.ok(canonicalOwners.has(url), `sitemap.xml: ${url} has no indexable canonical page`);

const indexableByCanonical = new Map(indexablePages.map((page) => [page.canonical, page]));
for (const page of indexablePages) {
  const localizedAlternates = page.alternates.filter((alternate) => alternate.language !== "x-default");
  if (localizedAlternates.length > 1) {
    assert.ok(page.menuUrls.length, `${page.relative}: localized page group needs a language menu`);
    assert.deepEqual(new Set(page.menuUrls), new Set(localizedAlternates.map((alternate) => alternate.url)), `${page.relative}: language menu and hreflang differ`);
  }
  for (const alternate of localizedAlternates) {
    const target = indexableByCanonical.get(alternate.url);
    assert.ok(target, `${page.relative}: hreflang target is not indexable: ${alternate.url}`);
    assert.ok(target.alternates.some((candidate) => candidate.url === page.canonical), `${page.relative}: hreflang is not reciprocal with ${target.relative}`);
  }
}

for (const relative of [
  "killer-sudoku-combination-calculator.html",
  "de/killer-sudoku-kombinationen-rechner.html",
  "es/calculadora-combinaciones-sudoku-killer.html"
]) {
  const html = fs.readFileSync(path.join(root, relative), "utf8");
  assert.match(html, /id="killer-sudoku-combination-chart"/, `${relative}: missing static combination chart`);
  for (let cells = 2; cells <= 9; cells += 1) {
    assert.match(html, new RegExp(`id="cage-${cells}-cells"`), `${relative}: missing ${cells}-cell cage chart`);
  }
  assert.ok((html.match(/<th scope="row">/g) || []).length >= 128, `${relative}: incomplete static combination rows`);
}

for (const relative of ["two-not-touch/daily/index.html", "two-not-touch/practice/index.html"]) {
  const html = fs.readFileSync(path.join(root, relative), "utf8");
  assert.match(html, /<meta name="robots" content="noindex, follow">/, `${relative}: old mode URL must stay noindex`);
  assert.match(html, /<link rel="canonical" href="https:\/\/dailylogiclab\.com\/">/, `${relative}: old mode URL must canonicalize to the homepage`);
}

const headers = fs.readFileSync(path.join(root, "_headers"), "utf8");
assert.ok(headers.includes("Content-Security-Policy:"), "_headers: missing content security policy");
assert.ok(!headers.includes("static.cloudflareinsights.com"), "_headers: Cloudflare browser beacon must remain blocked");
for (const asset of versionedAssets) {
  assert.ok(headers.includes(`/${asset}`), `_headers: missing ${asset}`);
}
assert.equal((headers.match(/max-age=31536000, immutable/g) || []).length, versionedAssets.length, "_headers: static assets need one-year immutable caching");

const manifest = JSON.parse(fs.readFileSync(path.join(root, "site.webmanifest"), "utf8"));
for (const term of ["1-star", "2-star", "3-star", "Tents and Trees", "Hashi", "Slitherlink", "Nonogram"]) {
  assert.ok(manifest.description.includes(term), `site.webmanifest: missing ${term}`);
}
const llms = fs.readFileSync(path.join(root, "llms.txt"), "utf8");
for (const term of ["1-star Quick (7x7)", "2-star Classic (10x10)", "3-star Expert (14x14)", "Tents and Trees", "Hashi", "Slitherlink", "Nonogram"]) {
  assert.ok(llms.includes(term), `llms.txt: missing ${term}`);
}

const scriptFiles = files.filter((file) => /\.(?:m?js)$/.test(file));
for (const file of scriptFiles) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  assert.equal(result.status, 0, `${path.relative(root, file)}: ${result.stderr || result.stdout}`);
}

console.log(`${htmlFiles.length} HTML files and ${scriptFiles.length} JavaScript files passed static checks`);
