import { z } from "zod";

export const areaStatusSchema = z.enum([
  "implemented",
  "integrating",
  "planned",
  "blocked",
]);
export type AreaStatus = z.infer<typeof areaStatusSchema>;

export const areaDomainSchema = z.enum([
  "platform",
  "identity",
  "financial",
  "blockchain",
  "ai",
  "education",
  "community",
  "commerce",
  "operations",
  "security",
  "data",
  "developer",
  "mobile",
  "content",
]);
export type AreaDomain = z.infer<typeof areaDomainSchema>;

export const areaManifestSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  domain: areaDomainSchema,
  status: areaStatusSchema,
  sourceOfTruth: z.string().min(1),
  notes: z.string().min(1),
});
export type AreaManifest = z.infer<typeof areaManifestSchema>;

export const integrationStateSchema = z.object({
  available: z.boolean(),
  mode: z.enum(["live", "test", "unavailable"]),
  checkedAt: z.string().datetime(),
  reason: z.string().optional(),
});
export type IntegrationState = z.infer<typeof integrationStateSchema>;

export const betaAvailabilitySchema = z.enum([
  "available_after_verification",
  "controlled_test_beta",
  "integration_beta",
  "gated_unavailable",
]);
export type BetaAvailability = z.infer<typeof betaAvailabilitySchema>;

export const betaAreaManifestSchema = areaManifestSchema.extend({
  betaAvailability: betaAvailabilitySchema,
  requiredEvidence: z.array(z.string().min(1)).min(1),
});
export type BetaAreaManifest = z.infer<typeof betaAreaManifestSchema>;

export function assertLiveIntegration(
  state: IntegrationState,
  integrationName: string
): void {
  if (!state.available || state.mode !== "live") {
    throw new Error(`${integrationName} is not available in live mode`);
  }
}
