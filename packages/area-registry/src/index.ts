import type {
  AreaDomain,
  AreaManifest,
  AreaStatus,
  BetaAreaManifest,
  BetaAvailability,
} from "@skycoin/contracts";

/**
 * Canonical ownership map for the first 30 platform areas. This registry is
 * descriptive: an area is not considered implemented until its source and
 * validation evidence are linked here.
 */
const areaDefinitions: readonly [
  string,
  string,
  AreaManifest["domain"],
  AreaManifest["status"],
][] = [
  ["core-platform", "Core Platform", "platform", "implemented"],
  ["identity-auth", "Identity and Authentication", "identity", "integrating"],
  ["profiles", "Profiles", "identity", "implemented"],
  ["settings", "Settings", "identity", "implemented"],
  ["notifications", "Notifications", "platform", "implemented"],
  ["admin-controls", "Admin Controls", "security", "integrating"],
  ["wallet", "Wallet", "financial", "integrating"],
  ["portfolio", "Portfolio Management", "financial", "implemented"],
  ["market-data", "Live Market Data", "financial", "blocked"],
  ["exchange", "Exchange", "financial", "blocked"],
  ["nft-gallery", "NFT Gallery", "blockchain", "integrating"],
  ["mining", "Mining", "blockchain", "blocked"],
  ["skychain", "Skychain Protocol", "blockchain", "integrating"],
  ["bridge", "Cross-chain Bridge", "blockchain", "blocked"],
  ["hopeai", "HopeAI", "ai", "integrating"],
  ["shadowchat", "ShadowChat", "ai", "integrating"],
  ["ai-control-center", "AI Control Center", "ai", "integrating"],
  ["ai-marketplace", "AI Marketplace", "ai", "planned"],
  ["skyschool", "SkySchool", "education", "integrating"],
  ["courses", "Courses and Curriculum", "education", "implemented"],
  ["quizzes", "Quizzes", "education", "implemented"],
  ["certifications", "Certifications", "education", "planned"],
  ["community", "Community", "community", "planned"],
  ["social", "Social Graph", "community", "planned"],
  ["creator-tools", "Creator Tools", "content", "planned"],
  ["marketplace", "Digital Marketplace", "commerce", "integrating"],
  ["payments", "Payments", "commerce", "blocked"],
  ["analytics", "Analytics", "data", "planned"],
  ["security", "Security and Compliance", "security", "integrating"],
  ["observability", "Observability", "operations", "planned"],
];

export const skycoinAreas: readonly AreaManifest[] = areaDefinitions.map(
  ([id, name, domain, status]): AreaManifest => ({
    id,
    name,
    domain,
    status,
    sourceOfTruth:
      status === "implemented"
        ? "../../client and server"
        : "This area repository plus approved integration PRs",
    notes:
      status === "blocked"
        ? "External integration or production evidence is required; no success is fabricated."
        : "Status is provisional until CI and ownership checks pass.",
  })
);

const controlledTestDomains = new Set<AreaDomain>([
  "financial",
  "blockchain",
  "ai",
  "commerce",
]);

function betaAvailabilityFor(
  status: AreaStatus,
  domain: AreaDomain
): BetaAvailability {
  if (status === "blocked") return "gated_unavailable";
  if (controlledTestDomains.has(domain)) return "controlled_test_beta";
  if (status === "implemented") return "available_after_verification";
  return "integration_beta";
}

function requiredEvidenceFor(
  domain: AreaDomain,
  availability: BetaAvailability
): string[] {
  const sharedEvidence = [
    "Exact canonical commit with successful required CI checks",
    "Deployed route smoke test with named owner and rollback action",
  ];

  if (availability === "gated_unavailable") {
    return [
      "Independent security and operational review",
      "Provider, deployment, legal, and incident evidence where applicable",
      "Explicit approval to leave the fail-closed state",
    ];
  }

  if (domain === "financial" || domain === "blockchain") {
    return [
      ...sharedEvidence,
      "Test-mode or read-only boundary with no real settlement, custody, or live-chain side effect",
      "Independent security, provider, monitoring, and rollback evidence",
    ];
  }

  if (domain === "ai") {
    return [
      ...sharedEvidence,
      "Model/provider allowlist, data boundary, abuse controls, cost limits, and safe-failure evidence",
    ];
  }

  return [
    ...sharedEvidence,
    "Data classification, authorization, privacy, and failure-state evidence",
  ];
}

export const skycoinBetaAreas: readonly BetaAreaManifest[] = skycoinAreas.map(
  area => ({
    ...area,
    betaAvailability: betaAvailabilityFor(area.status, area.domain),
    requiredEvidence: requiredEvidenceFor(
      area.domain,
      betaAvailabilityFor(area.status, area.domain)
    ),
  })
);

export function getArea(id: string): AreaManifest | undefined {
  return skycoinAreas.find(area => area.id === id);
}

export function getBetaArea(id: string): BetaAreaManifest | undefined {
  return skycoinBetaAreas.find(area => area.id === id);
}
