import { protectedProcedure, router } from "../_core/trpc";
import {
  createProviderRuntimeReport,
  isProviderCallable,
  summarizeProviderRuntime,
  type ProviderRuntimeReport,
} from "../features/service-registry/skyServiceRegistry";

interface ProviderEnvironment {
  BUILT_IN_FORGE_API_URL?: string;
  BUILT_IN_FORGE_API_KEY?: string;
}

function present(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

/**
 * Build a secret-free view of provider readiness from configuration only.
 *
 * Credential presence is not authentication and configuration presence is not
 * a successful runtime health check. Until an adapter performs and records
 * those checks, this inventory deliberately remains pending/unavailable.
 */
export function buildProviderRuntimeInventory(
  env: ProviderEnvironment = process.env,
): ProviderRuntimeReport[] {
  const hasForgeUrl = present(env.BUILT_IN_FORGE_API_URL);
  const hasForgeKey = present(env.BUILT_IN_FORGE_API_KEY);
  const configured = hasForgeUrl && hasForgeKey;
  const partiallyConfigured = hasForgeUrl !== hasForgeKey;

  return [
    createProviderRuntimeReport({
      providerId: "provider:built-in-forge",
      serviceId: "service:external-provider",
      state: configured ? "pending" : "unavailable",
      configured,
      authenticated: false,
      lastHealthCheckAt: null,
      latencyMs: null,
      capabilities: ["provider.external"],
      reason: configured
        ? "provider credentials are configured, but authenticated runtime health has not been verified"
        : partiallyConfigured
          ? "provider configuration is incomplete"
          : "provider adapter is not configured",
    }),
  ];
}

export const providerHealthRouter = router({
  list: protectedProcedure.query(() => {
    const reports = buildProviderRuntimeInventory();
    return {
      providers: reports.map(report => ({
        ...report,
        liveCallable: isProviderCallable(report, "live"),
        testCallable: isProviderCallable(report, "test"),
      })),
      summary: summarizeProviderRuntime(reports),
    };
  }),
});
