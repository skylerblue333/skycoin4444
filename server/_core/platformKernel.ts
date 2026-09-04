import type { Express } from "express";
import { skycoinBetaAreas } from "../../packages/area-registry/src/index";
import {
  compileCapabilityGraph,
  createCapabilitySnapshot,
  type CapabilityDefinition,
  type CapabilityDependency,
  type CapabilityObservation,
} from "../../packages/platform-kernel/src/index";
import { getRequestId } from "./requestContext";

const RELEASE_CHANNEL = "invitation-only-engineering-beta" as const;

const hard = (id: string): CapabilityDependency => ({ id, kind: "hard" });
const soft = (id: string): CapabilityDependency => ({ id, kind: "soft" });

const dependencyMap: Readonly<Record<string, readonly CapabilityDependency[]>> = {
  "identity-auth": [hard("core-platform")],
  profiles: [hard("core-platform"), soft("identity-auth")],
  settings: [hard("core-platform"), soft("identity-auth")],
  notifications: [hard("core-platform")],
  "admin-controls": [
    hard("core-platform"),
    hard("identity-auth"),
    hard("security"),
  ],
  security: [hard("core-platform")],
  wallet: [hard("core-platform"), hard("identity-auth"), hard("security")],
  portfolio: [hard("wallet")],
  "market-data": [hard("core-platform")],
  exchange: [hard("wallet"), hard("market-data")],
  skychain: [hard("core-platform"), hard("security")],
  "nft-gallery": [hard("skychain")],
  mining: [hard("skychain")],
  bridge: [hard("skychain"), hard("security")],
  hopeai: [hard("core-platform"), soft("identity-auth")],
  shadowchat: [hard("core-platform"), soft("identity-auth")],
  "ai-control-center": [hard("core-platform"), soft("hopeai")],
  "ai-marketplace": [hard("core-platform"), soft("hopeai")],
  skyschool: [hard("core-platform"), soft("identity-auth")],
  courses: [hard("skyschool")],
  quizzes: [hard("skyschool")],
  certifications: [hard("skyschool")],
  community: [hard("core-platform"), soft("identity-auth")],
  social: [hard("community")],
  "creator-tools": [hard("community")],
  marketplace: [hard("core-platform"), soft("identity-auth")],
  payments: [hard("marketplace"), hard("security")],
  analytics: [hard("core-platform")],
  observability: [hard("core-platform")],
};

const criticalCapabilities = new Set([
  "core-platform",
  "identity-auth",
  "security",
]);

function boundaryFor(domain: string): readonly string[] {
  if (domain === "financial" || domain === "blockchain") {
    return [
      "engineering/test boundary only",
      "no live settlement, custody, or chain side effect is implied",
    ];
  }
  if (domain === "ai") {
    return [
      "provider connectivity is not implied by registry state",
      "external model/data controls require separate release evidence",
    ];
  }
  return ["registry state is engineering evidence, not production certification"];
}

const definitions: readonly CapabilityDefinition[] = skycoinBetaAreas.map(area => ({
  id: area.id,
  version: "1",
  owner: area.domain,
  description: area.name,
  criticality: criticalCapabilities.has(area.id) ? "critical" : "important",
  dependencies: dependencyMap[area.id] ?? [],
  boundaries: boundaryFor(area.domain),
}));

const graph = compileCapabilityGraph(definitions);

function observationState(
  status: (typeof skycoinBetaAreas)[number]["status"]
): CapabilityObservation["state"] {
  switch (status) {
    case "implemented":
      return "available";
    case "integrating":
      return "degraded";
    case "planned":
      return "disabled";
    case "blocked":
      return "unavailable";
  }
}

const observations: readonly CapabilityObservation[] = skycoinBetaAreas.map(
  area => ({
    id: area.id,
    state: observationState(area.status),
    reason:
      "Mapped from canonical area-registry engineering status: " + area.status,
  })
);

export function getPlatformKernelSnapshot(generatedAt?: string) {
  return {
    contract: "skycoin4444.platform-kernel.v1" as const,
    releaseChannel: RELEASE_CHANNEL,
    productionReady: false as const,
    productionReadinessReason:
      "The kernel evaluates engineering capability dependencies only; provider, deployment, security, legal, and operational release evidence remain separate gates.",
    graph: {
      fingerprint: graph.fingerprint,
      topologicalOrder: graph.topologicalOrder,
      definitions: graph.definitions,
    },
    runtime: createCapabilitySnapshot(graph, observations, generatedAt),
  };
}

export function registerPlatformKernelRoutes(app: Express): void {
  app.get("/api/platform/kernel", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({
      requestId: getRequestId() ?? null,
      ...getPlatformKernelSnapshot(),
    });
  });

  app.get("/api/platform/kernel/capabilities/:id", (req, res) => {
    const snapshot = getPlatformKernelSnapshot();
    const definition = snapshot.graph.definitions.find(
      item => item.id === req.params.id
    );
    const assessment = snapshot.runtime.assessments.find(
      item => item.id === req.params.id
    );

    if (!definition || !assessment) {
      res.status(404).json({
        requestId: getRequestId() ?? null,
        error: "unknown_capability",
      });
      return;
    }

    res.set("Cache-Control", "no-store");
    res.json({
      requestId: getRequestId() ?? null,
      contract: snapshot.contract,
      releaseChannel: snapshot.releaseChannel,
      productionReady: false,
      fingerprint: snapshot.graph.fingerprint,
      definition,
      assessment,
    });
  });
}
