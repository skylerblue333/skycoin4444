import type { Express, RequestHandler } from "express";
import { skycoinBetaAreas } from "../../packages/area-registry/src/index";
import { db } from "../db";

const RELEASE_CHANNEL = "invitation-only-engineering-beta" as const;

type DatabaseProbe = () => Promise<unknown>;

export function createBetaReadinessHandler(probe: DatabaseProbe = () => db.query.users.findFirst({ columns: { id: true } })): RequestHandler {
  return async (_req, res) => {
    try {
      await probe();
      res.json({ status: "ready", database: "ok", liveFinancialOrChainExecution: false });
    } catch {
      res.status(503).json({ status: "not_ready", database: "unavailable", liveFinancialOrChainExecution: false });
    }
  };
}

export function registerBetaRoutes(app: Express) {
  app.get("/api/beta/health", (_req, res) => {
    res.json({
      status: "ok",
      releaseChannel: RELEASE_CHANNEL,
      catalogAreas: skycoinBetaAreas.length,
      liveFinancialOrChainExecution: false,
      generatedAt: new Date().toISOString(),
    });
  });

  app.get("/api/beta/readiness", createBetaReadinessHandler());

  app.get("/api/beta/areas", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({
      releaseChannel: RELEASE_CHANNEL,
      source: "packages/area-registry",
      areas: skycoinBetaAreas,
    });
  });
}
