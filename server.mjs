import { createReadStream } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = __dirname;
const DEFAULT_REQUESTS_FILE = path.join(DEFAULT_ROOT, "data", "requests.local.json");
const STATUSES = new Set(["new", "scheduled", "completed", "archived"]);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

export function createUmojaServer(options = {}) {
  const root = options.root || DEFAULT_ROOT;
  const store = new RequestStore(options.requestsFile || process.env.UMOJA_REQUESTS_FILE || DEFAULT_REQUESTS_FILE);

  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://localhost");

      if (url.pathname === "/api/health") {
        sendJson(response, 200, { ok: true });
        return;
      }

      if (url.pathname === "/api/requests" && request.method === "GET") {
        const requests = await store.all();
        sendJson(response, 200, { requests });
        return;
      }

      if (url.pathname === "/api/requests" && request.method === "POST") {
        const body = await readJson(request);
        const payload = validateRequest(body);
        const created = await store.create(payload);
        sendJson(response, 201, { request: created });
        return;
      }

      const requestMatch = url.pathname.match(/^\/api\/requests\/([^/]+)$/);
      if (requestMatch && request.method === "PATCH") {
        const body = await readJson(request);
        const status = String(body.status || "").trim().toLowerCase();
        if (!STATUSES.has(status)) {
          sendJson(response, 422, { error: "Status must be new, scheduled, completed, or archived." });
          return;
        }
        const updated = await store.updateStatus(decodeURIComponent(requestMatch[1]), status);
        if (!updated) {
          sendJson(response, 404, { error: "Request not found." });
          return;
        }
        sendJson(response, 200, { request: updated });
        return;
      }

      if (url.pathname.startsWith("/api/")) {
        sendJson(response, 404, { error: "API route not found." });
        return;
      }

      await serveStatic(root, url.pathname, response);
    } catch (error) {
      sendJson(response, error.statusCode || 500, { error: error.message || "Server error." });
    }
  });
}

export class RequestStore {
  constructor(file) {
    this.file = file;
  }

  async all() {
    const items = await this.read();
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async create(payload) {
    const items = await this.read();
    const now = new Date().toISOString();
    const request = {
      id: `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
      status: "new",
      source: "api",
      ...payload
    };
    items.push(request);
    await this.write(items);
    return request;
  }

  async updateStatus(id, status) {
    const items = await this.read();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], status, updatedAt: new Date().toISOString() };
    await this.write(items);
    return items[index];
  }

  async read() {
    await mkdir(path.dirname(this.file), { recursive: true });
    try {
      const raw = await readFile(this.file, "utf8");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      await this.write([]);
      return [];
    }
  }

  async write(items) {
    await mkdir(path.dirname(this.file), { recursive: true });
    await writeFile(this.file, `${JSON.stringify(items, null, 2)}\n`);
  }
}

export function validateRequest(body) {
  const payload = {
    name: clean(body.name),
    phone: clean(body.phone),
    email: clean(body.email),
    service: clean(body.service),
    property: clean(body.property),
    timing: clean(body.timing || "Flexible"),
    location: clean(body.location),
    notes: clean(body.notes)
  };

  if (!payload.name) throw validationError("Name is required.");
  if (!payload.phone && !payload.email) throw validationError("Phone or email is required.");
  if (!payload.service) throw validationError("Service is required.");
  if (!payload.property) throw validationError("Property type is required.");
  if (payload.notes.length > 1600) throw validationError("Notes must be under 1600 characters.");

  return payload;
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 422;
  return error;
}

async function readJson(request) {
  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > 1_000_000) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
  }
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

async function serveStatic(root, pathname, response) {
  const safePath = decodeURIComponent(pathname).replace(/^\/+/, "") || "index.html";
  const candidate = path.resolve(root, safePath);
  if (!candidate.startsWith(path.resolve(root))) {
    sendJson(response, 403, { error: "Forbidden." });
    return;
  }

  let file = candidate;
  let stats;
  try {
    stats = await stat(file);
    if (stats.isDirectory()) {
      file = path.join(file, "index.html");
      stats = await stat(file);
    }
  } catch {
    file = path.join(root, "index.html");
    stats = await stat(file);
  }

  const ext = path.extname(file).toLowerCase();
  response.writeHead(200, {
    "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    "Content-Length": stats.size
  });
  createReadStream(file).pipe(response);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const port = Number(process.env.PORT || 5577);
  createUmojaServer().listen(port, () => {
    console.log(`Umoja site and API running at http://localhost:${port}`);
  });
}
