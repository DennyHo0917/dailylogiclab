import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, isAbsolute, join, relative as relativePath, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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
    const relative = pathname.replace(/^\/+/, "");
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
