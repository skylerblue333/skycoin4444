import { describe, expect, it } from "vitest";
import {
  addOrganizationMember,
  createOrganization,
  removeOrganizationMember,
  toOrganizationSnapshot,
} from "./index";

describe("SkyOrganizations", () => {
  it("creates an organization with exactly one owner", () => {
    const org = createOrganization({ id: " org-1 ", name: " Acme ", ownerUserId: " owner-1 " });
    expect(org).toEqual({
      id: "org-1",
      name: "Acme",
      members: [{ userId: "owner-1", role: "owner" }],
      revision: 1,
    });
  });

  it("adds members deterministically and increments revision", () => {
    let org = createOrganization({ id: "org-1", name: "Acme", ownerUserId: "owner-1" });
    org = addOrganizationMember(org, { userId: "z-user", role: "member" });
    org = addOrganizationMember(org, { userId: "a-user", role: "admin" });
    expect(org.members.map((member) => member.userId)).toEqual(["a-user", "owner-1", "z-user"]);
    expect(org.revision).toBe(3);
  });

  it("rejects duplicate membership and owner removal", () => {
    const org = createOrganization({ id: "org-1", name: "Acme", ownerUserId: "owner-1" });
    expect(() => addOrganizationMember(org, { userId: " owner-1 ", role: "member" })).toThrow(
      "duplicate member: owner-1",
    );
    expect(() => removeOrganizationMember(org, "owner-1")).toThrow(
      "organization owner cannot be removed",
    );
  });

  it("emits the versioned organization snapshot contract", () => {
    const org = addOrganizationMember(
      createOrganization({ id: "org-1", name: "Acme", ownerUserId: "owner-1" }),
      { userId: "member-1", role: "member" },
    );
    expect(toOrganizationSnapshot(org)).toEqual({
      type: "sky.organization.snapshot.v1",
      organizationId: "org-1",
      name: "Acme",
      memberCount: 2,
      revision: 2,
    });
  });
});
