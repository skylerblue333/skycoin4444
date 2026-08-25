import { describe, expect, it } from "vitest";
import {
  buildServiceCatalog,
  createServiceDescriptor,
  findServicesByCapability,
} from "./skyServiceRegistry";

describe("SkyServiceRegistry", () => {
  const auth = createServiceDescriptor({
    id: "service:auth",
    owner: "team:identity",
    version: "1.0.0-beta.1",
    lifecycle: "beta",
    healthPath: "/healthz",
    capabilities: ["auth.session", "identity.read", "auth.session"],
  });

  const rewards = createServiceDescriptor({
    id: "service:rewards",
    owner: "team:finance",
    version: "1.0.0",
    lifecycle: "stable",
    healthPath: "/health",
    capabilities: ["rewards.balance"],
  });

  it("normalizes capabilities deterministically", () => {
    expect(auth.capabilities).toEqual(["auth.session", "identity.read"]);
  });

  it("builds a unique service catalog", () => {
    const catalog = buildServiceCatalog([auth, rewards]);
    expect(catalog.size).toBe(2);
    expect(catalog.get("service:auth")).toEqual(auth);
  });

  it("rejects duplicate service identifiers", () => {
    expect(() => buildServiceCatalog([auth, auth])).toThrow(
      "duplicate service id: service:auth"
    );
  });

  it("finds services by capability", () => {
    const catalog = buildServiceCatalog([rewards, auth]);
    expect(findServicesByCapability(catalog, "auth.session")).toEqual([auth]);
  });
});
