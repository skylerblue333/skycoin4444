export type OrganizationRole = "owner" | "admin" | "member";

export interface OrganizationMember {
  userId: string;
  role: OrganizationRole;
}

export interface OrganizationRecord {
  id: string;
  name: string;
  members: readonly OrganizationMember[];
  revision: number;
}

export interface OrganizationSnapshotV1 {
  type: "sky.organization.snapshot.v1";
  organizationId: string;
  name: string;
  memberCount: number;
  revision: number;
}

function clean(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

function compareCodeUnits(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function normalizeMembers(members: readonly OrganizationMember[]): OrganizationMember[] {
  const seen = new Set<string>();
  return members
    .map((member) => ({ userId: clean(member.userId, "user id"), role: member.role }))
    .sort((a, b) => compareCodeUnits(a.userId, b.userId))
    .map((member) => {
      if (seen.has(member.userId)) throw new Error(`duplicate member: ${member.userId}`);
      seen.add(member.userId);
      return member;
    });
}

export function createOrganization(input: {
  id: string;
  name: string;
  ownerUserId: string;
}): OrganizationRecord {
  return {
    id: clean(input.id, "organization id"),
    name: clean(input.name, "organization name"),
    members: [{ userId: clean(input.ownerUserId, "owner user id"), role: "owner" }],
    revision: 1,
  };
}

export function addOrganizationMember(
  organization: OrganizationRecord,
  member: OrganizationMember,
): OrganizationRecord {
  const members = normalizeMembers([...organization.members, member]);
  if (members.filter((entry) => entry.role === "owner").length !== 1) {
    throw new Error("organization must have exactly one owner");
  }
  return { ...organization, members, revision: organization.revision + 1 };
}

export function removeOrganizationMember(
  organization: OrganizationRecord,
  userId: string,
): OrganizationRecord {
  const target = clean(userId, "user id");
  const current = organization.members.find((member) => member.userId === target);
  if (!current) return organization;
  if (current.role === "owner") throw new Error("organization owner cannot be removed");
  return {
    ...organization,
    members: organization.members.filter((member) => member.userId !== target),
    revision: organization.revision + 1,
  };
}

export function toOrganizationSnapshot(organization: OrganizationRecord): OrganizationSnapshotV1 {
  const normalizedMembers = normalizeMembers(organization.members);
  if (!Number.isSafeInteger(organization.revision) || organization.revision < 1) {
    throw new Error("revision must be a positive safe integer");
  }
  return {
    type: "sky.organization.snapshot.v1",
    organizationId: clean(organization.id, "organization id"),
    name: clean(organization.name, "organization name"),
    memberCount: normalizedMembers.length,
    revision: organization.revision,
  };
}
