import type { Express } from "express";
import { skycoinBetaAreas } from "../../packages/area-registry/src/index";

const RELEASE_CHANNEL = "invitation-only-engineering-beta" as const;

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

  app.get("/api/beta/areas", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({
      releaseChannel: RELEASE_CHANNEL,
      source: "packages/area-registry",
      areas: skycoinBetaAreas,
    });
  });
}
