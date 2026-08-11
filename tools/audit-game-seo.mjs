import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = "https://dailylogiclab.com";
const games = ["tents-and-trees", "hashi", "slitherlink", "nonogram"];
const locales = [
  ["", "en"], ["de/", "de"], ["es/", "es"], ["fr/", "fr"],
  ["ja/", "ja"], ["pt-br/", "pt-BR"], ["zh-cn/", "zh-CN"]
];
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const failures = [];

function match(html, pattern) {
  return html.match(pattern)?.[1] || "";
}

for (const [prefix, language] of locales) {
  for (const game of games) {
    const relative = `${prefix}${game}/`;
    const file = path.join(root, relative, "index.html");
    const html = fs.readFileSync(file, "utf8");
    const canonical = `${site}/${relative}`;
    const title = match(html, /<title>([^<]+)<\/title>/);
    const description = match(html, /<meta name="description" content="([^"]+)">/);
    const links = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)];
    const schemaText = match(html, /<script type="application\/ld\+json">([^<]+)<\/script>/);
    let schema;
    try { schema = JSON.parse(schemaText); } catch { schema = null; }

    if (!title || title.length > 70) failures.push(`${relative}: invalid title length ${title.length}`);
    if (description.length < 20 || description.length > 180) failures.push(`${relative}: invalid description length ${description.length}`);
    if (!html.includes(`<html lang="${language}">`)) failures.push(`${relative}: html lang mismatch`);
    if (!html.includes(`<link rel="canonical" href="${canonical}">`)) failures.push(`${relative}: canonical mismatch`);
    if (links.length !== 8) failures.push(`${relative}: expected 8 hreflang links, found ${links.length}`);
    if ((html.match(/<h1[ >]/g) || []).length !== 1) failures.push(`${relative}: expected one h1`);
    if (!html.includes(`<meta property="og:url" content="${canonical}">`)) failures.push(`${relative}: og:url mismatch`);
    for (const tag of ["og:title", "og:description", "og:image", "og:image:alt", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt"]) {
      if (!html.includes(`"${tag}"`)) failures.push(`${relative}: missing ${tag}`);
    }
    if (!schema?.["@graph"]?.some((node) => node["@type"] === "WebApplication" && node.inLanguage === language && node.dateModified === "2026-08-11")) failures.push(`${relative}: WebApplication schema mismatch`);
    if (!schema?.["@graph"]?.some((node) => node["@type"] === "FAQPage" && node.inLanguage === language)) failures.push(`${relative}: FAQ schema mismatch`);
    if ((html.match(/class="game-card compact-game-card"/g) || []).length !== 4) failures.push(`${relative}: expected 4 related-game cards`);
    if ((html.match(/class="mini-preview /g) || []).length !== 4) failures.push(`${relative}: expected 4 game previews`);
    if (!html.includes(`${prefix}#play">Two Not Touch</a>`)) failures.push(`${relative}: missing localized Two Not Touch link`);
    if (!html.includes('"generationError":')) failures.push(`${relative}: missing localized generation error`);
    if (!sitemap.includes(`<loc>${canonical}</loc>`)) failures.push(`${relative}: missing from sitemap`);
    for (const mode of ["daily", "practice"]) {
      const wrapper = path.join(root, relative, mode, "index.html");
      const wrapperHtml = fs.existsSync(wrapper) ? fs.readFileSync(wrapper, "utf8") : "";
      if (!wrapperHtml.includes('name="robots" content="noindex, follow"') || !wrapperHtml.includes(`<link rel="canonical" href="${canonical}">`)) failures.push(`${relative}${mode}/: wrapper signals mismatch`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("28 localized game pages passed SEO and related-card checks");
