import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = ["app.js", "language-redirect.js", "logic-games-core.js", "logic-games.js", "styles.css"];
const versions = Object.fromEntries(assets.map((asset) => [
  asset,
  createHash("sha256").update(fs.readFileSync(path.join(root, asset))).digest("hex").slice(0, 10)
]));
const htmlFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith(".html")) htmlFiles.push(target);
  }
}

walk(root);
let changed = 0;
for (const file of htmlFiles) {
  const original = fs.readFileSync(file, "utf8");
  let html = original.replace(
    /(<link\b[^>]*\bhref="[^"]*styles\.css)(?:\?v=[^"]*)?(")/g,
    `$1?v=${versions["styles.css"]}$2`
  );
  for (const asset of assets.filter((name) => name.endsWith(".js"))) {
    const escaped = asset.replaceAll(".", "\\.");
    html = html.replace(
      new RegExp(`<script(?:\\s+defer)?\\s+src="([^"]*${escaped})(?:\\?v=[^"]*)?"></script>`, "g"),
      `<script defer src="$1?v=${versions[asset]}"></script>`
    );
  }
  if (html === original) continue;
  fs.writeFileSync(file, html, "utf8");
  changed += 1;
}

console.log(`${changed} HTML files updated with content-versioned static assets`);
