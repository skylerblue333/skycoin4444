import { describe, expect, it } from "vitest";
import { buildProviderRuntimeInventory } from "./providerHealth";
import { isProviderCallable } from "../features/service-registry/skyServiceRegistry";

describe("provider health inventory", () => {
  it("reports an absent provider as unavailable", () => {
    const [provider] = buildProviderRuntimeInventory({
      BUILT_IN_FORGE_API_URL: undefined,
      BUILT_IN_FORGE_API_KEY: undefined,
    });

    expect(provider).toMatchObject({
      providerId: "provider:built-in-forge",
      state: "unavailable",
      configured: false,
      authenticated: false,
      lastHealthCheckAt: null,
    });
    expect(isProviderCallable(provider, "live")).toBe(false);
  });

  it("reports partial configuration as unavailable", () => {
    const [provider] = buildProviderRuntimeInventory({
      BUILT_IN_FORGE_API_URL: "https://provider.example.invalid",
      BUILT_IN_FORGE_API_KEY: undefined,
    });

    expect(provider.state).toBe("unavailable");
    expect(provider.reason).toBe("provider configuration is incomplete");
    expect(provider.configured).toBe(false);
  });

  it("does not equate credential presence with authentication or live health", () => {
    const secret = "never-return-this-provider-secret";
    const [provider] = buildProviderRuntimeInventory({
      BUILT_IN_FORGE_API_URL: "https://provider.example.invalid",
      BUILT_IN_FORGE_API_KEY: secret,
    });

    expect(provider).toMatchObject({
      state: "pending",
      configured: true,
      authenticated: false,
      lastHealthCheckAt: null,
      latencyMs: null,
    });
    expect(isProviderCallable(provider, "live")).toBe(false);
    expect(JSON.stringify(provider)).not.toContain(secret);
    expect(JSON.stringify(provider)).not.toContain(
      "https://provider.example.invalid",
    );
  });
});
