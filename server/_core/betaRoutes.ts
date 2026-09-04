import type { Express, RequestHandler } from "express";
import { skycoinBetaAreas } from "../../packages/area-registry/src/index";
import { db } from "../db";
import { betaAdmissionSnapshot } from "./betaAdmission";
import { inspectProductionBetaConfig } from "./productionConfig";

const RELEASE_CHANNEL = "invitation-only-engineering-beta" as const;

type DatabaseProbe = () => Promise<unknown>;
type ConfigProbe = () => ReturnType<typeof inspectProductionBetaConfig>;

function runtimeSnapshot() {
  const admission = betaAdmissionSnapshot();
  return {
    releaseChannel: RELEASE_CHANNEL,
    admissionMode: admission.mode,
    admissionConfigured: admission.configured,
    oauthConfigured: Boolean(
      process.env.VITE_APP_ID?.trim() &&
        process.env.OAUTH_SERVER_URL?.trim() &&
        process.env.VITE_OAUTH_PORTAL_URL?.trim()
    ),
    publicOriginConfigured: Boolean(process.env.BETA_PUBLIC_ORIGIN?.trim()),
    liveFinancialOrChainExecution: false,
  };
}

export function createBetaReadinessHandler(
  probe: DatabaseProbe = () =>
    db.query.users.findFirst({ columns: { id: true } }),
  configProbe: ConfigProbe = () =>
    process.env.NODE_ENV === "production"
      ? inspectProductionBetaConfig()
      : []
): RequestHandler {
  return async (_req, res) => {
    const configIssues = configProbe();
    if (configIssues.length > 0) {
      res.status(503).json({
        status: "not_ready",
        database: "unknown",
        configuration: "invalid",
        configurationIssueKeys: configIssues.map(issue => issue.key),
        ...runtimeSnapshot(),
      });
      return;
    }

    try {
      await probe();
      res.json({
        status: "ready",
        database: "ok",
        configuration: "ok",
        ...runtimeSnapshot(),
      });
    } catch {
      res.status(503).json({
        status: "not_ready",
        database: "unavailable",
        configuration: "ok",
        ...runtimeSnapshot(),
      });
    }
  };
}

export function registerBetaRoutes(app: Express) {
  app.get("/api/beta/health", (_req, res) => {
    res.json({
      status: "ok",
      catalogAreas: skycoinBetaAreas.length,
      generatedAt: new Date().toISOString(),
      ...runtimeSnapshot(),
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
