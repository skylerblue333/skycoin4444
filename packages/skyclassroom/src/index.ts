export type ClassroomRole = "instructor" | "student" | "observer";
export type MembershipState = "invited" | "active" | "removed";

export interface ClassroomMembership {
  classroomId: string;
  userId: string;
  role: ClassroomRole;
  state: MembershipState;
}

const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

function validateId(value: string, field: string): string {
  const normalized = value.trim();
  if (!ID_RE.test(normalized)) throw new Error(`${field} is invalid`);
  return normalized;
}

export function inviteMember(
  input: Omit<ClassroomMembership, "state">
): ClassroomMembership {
  return {
    classroomId: validateId(input.classroomId, "classroomId"),
    userId: validateId(input.userId, "userId"),
    role: input.role,
    state: "invited",
  };
}

export function activateMembership(
  membership: ClassroomMembership
): ClassroomMembership {
  if (membership.state !== "invited") {
    throw new Error("only invited memberships can be activated");
  }
  return { ...membership, state: "active" };
}

export function removeMembership(
  membership: ClassroomMembership
): ClassroomMembership {
  if (membership.state === "removed") {
    throw new Error("membership is already removed");
  }
  return { ...membership, state: "removed" };
}

export function canManageMembership(
  actor: ClassroomMembership,
  target: ClassroomMembership
): boolean {
  return (
    actor.classroomId === target.classroomId &&
    actor.state === "active" &&
    actor.role === "instructor" &&
    actor.userId !== target.userId
  );
}
