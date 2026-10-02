import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, isAbsolute, join, relative as relativePath, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createTipCheckout } from "../server/stripe-checkout.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.argv[2] || 4173);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
    if (pathname === "/api/support/checkout") {
      const chunks = [];
      let length = 0;
      for await (const chunk of request) {
        length += chunk.length;
        if (length > 2048) {
          response.writeHead(413, { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" });
          response.end('{"error":"invalid_request"}');
          return;
        }
        chunks.push(chunk);
      }
      const origin = `http://127.0.0.1:${port}`;
      const input = new Request(`${origin}${pathname}`, {
        method: request.method,
        headers: request.headers,
        ...(!["GET", "HEAD"].includes(request.method) ? { body: Buffer.concat(chunks) } : {})
      });
      const result = await createTipCheckout(input, { ...process.env, SITE_ORIGIN: origin });
      response.writeHead(result.status, Object.fromEntries(result.headers));
      response.end(await result.text());
      return;
    }
    const relative = pathname.replace(/^\/+/, "");
    // Match the deploy boundary: local tooling and private dotfiles aren't assets.
    if (relative.split(/[\\/]/).some((part) => part.startsWith(".") || ["server", "tools", "node_modules"].includes(part))) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    const candidate = resolve(root, relative);
    const candidatePath = relativePath(root, candidate);
    if (candidatePath.startsWith("..") || isAbsolute(candidatePath)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    const info = await stat(candidate).catch(() => null);
    const cleanUrlFile = !info && !extname(candidate) ? `${candidate}.html` : candidate;
    const file = info?.isDirectory() ? join(candidate, "index.html") : cleanUrlFile;
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": types[extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`DailyLogicLab preview: http://127.0.0.1:${port}/`);
});
