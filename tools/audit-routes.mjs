import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.DLL_AUDIT_PORT || 4187);
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [path.join(root, "tools", "preview-server.mjs"), String(port)], { stdio: "ignore" });

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git" || entry.name === "node_modules") return [];
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : file.endsWith(".html") ? [file] : [];
  });
}

function publicPath(file) {
  const relative = path.relative(root, file).replaceAll("\\", "/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  return `/${relative.replace(/\.html$/, "")}`;
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(origin)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Preview server did not start.");
}

try {
  await waitForServer();
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  const routes = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname));
  const locales = ["", "de/", "es/", "fr/", "ja/", "pt-br/", "zh-cn/"];
  const games = ["tents-and-trees", "hashi", "slitherlink", "nonogram"];
  for (const locale of locales) for (const game of games) for (const mode of ["daily", "practice"]) {
    routes.add(`/${locale}${game}/${mode}/`);
  }
  for (const file of htmlFiles(root)) {
    const html = fs.readFileSync(file, "utf8");
    const base = `${origin}${publicPath(file)}`;
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = new URL(match[1], base);
      if (url.origin === origin) routes.add(`${url.pathname}${url.search}`);
    }
  }
  for (const route of routes) {
    const response = await fetch(`${origin}${route}`);
    assert.equal(response.status, 200, `${route}: returned ${response.status}`);
  }
  console.log(`${routes.size} sitemap, alias, and internal asset routes returned 200`);
} finally {
  server.kill();
}
