import type { AreaManifest } from "@skycoin/contracts";

/**
 * Canonical ownership map for the first 30 platform areas. This registry is
 * descriptive: an area is not considered implemented until its source and
 * validation evidence are linked here.
 */
const areaDefinitions: readonly [string, string, AreaManifest["domain"], AreaManifest["status"]][] = [
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

export const skycoinAreas: readonly AreaManifest[] = areaDefinitions.map(([id, name, domain, status]): AreaManifest => ({
  id,
  name,
  domain,
  status,
  sourceOfTruth: status === "implemented" ? "../../client and server" : "This area repository plus approved integration PRs",
  notes: status === "blocked" ? "External integration or production evidence is required; no success is fabricated." : "Status is provisional until CI and ownership checks pass.",
}));

export function getArea(id: string): AreaManifest | undefined {
  return skycoinAreas.find((area) => area.id === id);
}
