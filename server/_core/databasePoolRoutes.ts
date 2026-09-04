import type { Express } from "express";
import { databasePoolSnapshot } from "../db";

export function registerDatabasePoolRoutes(app: Express): void {
  app.get("/api/runtime/database-pool", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({
      contract: "skycoin4444.database-pool.v1",
      ...databasePoolSnapshot(),
    });
  });
}
