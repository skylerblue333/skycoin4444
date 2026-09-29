import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export async function readRouteRegistrySource(root) {
  const appPath = path.join(root, "client/src/App.tsx");
  const legacyDirectory = path.join(root, "client/src/routes/legacy");
  const legacyFiles = (await readdir(legacyDirectory))
    .filter(name => name.startsWith("LegacyRoutes") && name.endsWith(".tsx"))
    .sort();

  const sources = await Promise.all([
    readFile(appPath, "utf8"),
    ...legacyFiles.map(name => readFile(path.join(legacyDirectory, name), "utf8")),
  ]);

  return sources.join("\n");
}
