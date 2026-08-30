export type TeamRole = "owner" | "admin" | "member";
export type TeamMember = { userId: string; role: TeamRole };
export type TeamSnapshot = { contract: "sky.teams.snapshot.v1"; teamId: string; name: string; members: TeamMember[] };

const text = (v: string, field: string) => { const x = v.trim(); if (!x) throw new Error(`${field} is required`); return x; };

export function createTeam(teamId: string, name: string, ownerId: string): TeamSnapshot {
  return { contract: "sky.teams.snapshot.v1", teamId: text(teamId,"teamId"), name: text(name,"name"), members: [{ userId: text(ownerId,"ownerId"), role: "owner" }] };
}

export function addMember(team: TeamSnapshot, member: TeamMember): TeamSnapshot {
  const userId = text(member.userId,"userId");
  if (!(["owner","admin","member"] as string[]).includes(member.role)) throw new Error("invalid role");
  if (team.members.some(m => m.userId === userId)) throw new Error("member already exists");
  return { ...team, members: [...team.members, { userId, role: member.role }].sort((a,b)=>a.userId.localeCompare(b.userId)) };
}

export function removeMember(team: TeamSnapshot, userIdInput: string): TeamSnapshot {
  const userId = text(userIdInput,"userId");
  const target = team.members.find(m=>m.userId===userId);
  if (!target) throw new Error("member not found");
  const remaining = team.members.filter(m=>m.userId!==userId);
  if (!remaining.some(m=>m.role==="owner")) throw new Error("team must retain an owner");
  return { ...team, members: remaining };
}
