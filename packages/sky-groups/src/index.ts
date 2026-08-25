export type GroupRole = "owner" | "moderator" | "member";
export interface GroupMember { userId: string; role: GroupRole; joinedAt: string; }
export interface Group { id: string; name: string; visibility: "private" | "public"; members: GroupMember[]; }

function text(value: string, field: string, max = 120): string { const v = value.trim(); if (!v) throw new Error(`${field} is required`); if (v.length > max) throw new Error(`${field} exceeds ${max} characters`); return v; }
export function createGroup(input: { id: string; name: string; ownerId: string; visibility?: "private" | "public"; now?: string }): Group {
  const now = new Date(input.now ?? new Date().toISOString());
  if (Number.isNaN(now.getTime())) throw new Error("now must be valid");
  return { id: text(input.id, "id"), name: text(input.name, "name"), visibility: input.visibility ?? "private", members: [{ userId: text(input.ownerId, "ownerId"), role: "owner", joinedAt: now.toISOString() }] };
}
export function addMember(group: Group, member: GroupMember, actorId: string): Group {
  const actor = group.members.find((m) => m.userId === actorId);
  if (!actor || !["owner", "moderator"].includes(actor.role)) throw new Error("actor is not allowed to add members");
  if (group.members.some((m) => m.userId === member.userId)) throw new Error("member already exists");
  if (member.role === "owner" && actor.role !== "owner") throw new Error("only owner can add another owner");
  return { ...group, members: [...group.members, { ...member, userId: text(member.userId, "userId"), joinedAt: new Date(member.joinedAt).toISOString() }] };
}
export function removeMember(group: Group, userId: string, actorId: string): Group {
  const actor = group.members.find((m) => m.userId === actorId);
  const target = group.members.find((m) => m.userId === userId);
  if (!actor || !target) throw new Error("member not found");
  if (target.role === "owner") throw new Error("owner cannot be removed by this operation");
  if (actor.role === "member") throw new Error("actor is not allowed to remove members");
  return { ...group, members: group.members.filter((m) => m.userId !== userId) };
}
