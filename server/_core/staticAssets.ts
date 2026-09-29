import express, { type Express } from "express";
import fs from "node:fs";
import path from "node:path";

export type StaticAssetBundle = Readonly<{
  distPath: string;
  indexPath: string;
}>;

type PathExists = (filePath: string) => boolean;
type ErrorLogger = (message: string) => void;

export function resolveStaticAssetBundle(
  env: NodeJS.ProcessEnv = process.env,
  moduleDir = import.meta.dirname
): StaticAssetBundle {
  const distPath =
    env.NODE_ENV === "development"
      ? path.resolve(moduleDir, "../..", "dist", "public")
      : path.resolve(moduleDir, "public");

  return Object.freeze({
    distPath,
    indexPath: path.resolve(distPath, "index.html"),
  });
}

export function assertStaticAssetBundle(
  bundle: StaticAssetBundle,
  env: NodeJS.ProcessEnv = process.env,
  pathExists: PathExists = fs.existsSync,
  logError: ErrorLogger = message => console.error(message)
): void {
  const missingPaths = [bundle.distPath, bundle.indexPath].filter(
    filePath => !pathExists(filePath)
  );

  if (missingPaths.length === 0) return;

  const message =
    `Static asset bundle is incomplete; missing: ${missingPaths.join(", ")}. ` +
    "Build the client before starting the server.";

  if (env.NODE_ENV === "production") {
    throw new Error(message);
  }

  logError(message);
}

export function serveStatic(
  app: Express,
  env: NodeJS.ProcessEnv = process.env
): void {
  const bundle = resolveStaticAssetBundle(env);
  assertStaticAssetBundle(bundle, env);

  app.use(express.static(bundle.distPath));

  // API fallbacks are registered before this function so only browser routes
  // reach the SPA shell.
  app.use("/{*splat}", (_req, res) => {
    res.sendFile(bundle.indexPath);
  });
}
