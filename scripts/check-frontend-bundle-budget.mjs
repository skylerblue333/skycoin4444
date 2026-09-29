import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const OUTPUT_DIR = path.resolve("dist/public");
const INDEX_PATH = path.join(OUTPUT_DIR, "index.html");
const MAX_INITIAL_CHUNK_BYTES = 500 * 1024;

function captureSources(html, tagName, attribute, qualifier) {
  const expression = new RegExp(
    `<${tagName}\\b(?=[^>]*${qualifier})(?=[^>]*\\b${attribute}=["']([^"']+)["'])[^>]*>`,
    "gi"
  );
  return [...html.matchAll(expression)].map(match => match[1]).filter(Boolean);
}

function initialModuleSources(html) {
  const scripts = captureSources(
    html,
    "script",
    "src",
    String.raw`\btype=["']module["']`
  );
  const preloads = captureSources(
    html,
    "link",
    "href",
    String.raw`\brel=["']modulepreload["']`
  );
  return [...new Set([...scripts, ...preloads])];
}

function resolveLocalAsset(source) {
  if (
    source.startsWith("http://") ||
    source.startsWith("https://") ||
    source.startsWith("//")
  ) {
    return null;
  }

  const clean = source.split(/[?#]/, 1)[0];
  return path.resolve(OUTPUT_DIR, clean.startsWith("/") ? clean.slice(1) : clean);
}

const html = await readFile(INDEX_PATH, "utf8");
const entries = initialModuleSources(html)
  .map(resolveLocalAsset)
  .filter(Boolean);

if (entries.length === 0) {
  throw new Error(
    "bundle budget: no local module entry or modulepreload was found in dist/public/index.html"
  );
}

const measured = [];
for (const entryPath of entries) {
  const info = await stat(entryPath);
  if (path.extname(entryPath) !== ".js") continue;
  measured.push({ entryPath, size: info.size });
}

if (measured.length === 0) {
  throw new Error("bundle budget: initial module graph contained no JavaScript assets");
}

measured.sort((left, right) => right.size - left.size);
for (const { entryPath, size } of measured) {
  const sizeKb = (size / 1024).toFixed(1);
  process.stdout.write(
    `bundle budget: initial ${path.basename(entryPath)} ${sizeKb} kB <= 500 kB\n`
  );
  if (size > MAX_INITIAL_CHUNK_BYTES) {
    throw new Error(
      `bundle budget: ${path.basename(entryPath)} is ${sizeKb} kB; maximum initial chunk size is 500 kB`
    );
  }
}
