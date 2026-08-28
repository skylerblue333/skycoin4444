export type TalentProfile = {
  id: string;
  headline: string;
  skills: string[];
  location?: string;
  availability?: "available" | "limited" | "unavailable";
};

export type TalentQuery = {
  skills?: string[];
  location?: string;
  availability?: TalentProfile["availability"];
  limit?: number;
};

export type TalentMatch = {
  profile: TalentProfile;
  matchedSkills: string[];
  score: number;
};

const clean = (value: string, field: string, max = 200): string => {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  if (normalized.length > max) throw new Error(`${field} exceeds ${max} characters`);
  return normalized;
};

const unique = (values: string[]): string[] => [...new Set(values.map((v) => clean(v, "skill", 80).toLowerCase()))];

function validLimit(value: number | undefined): number {
  const limit = value ?? 20;
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error("limit must be 1-100");
  return limit;
}

function compareCodePoints(left: string, right: string): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

export function normalizeTalentProfile(input: TalentProfile): TalentProfile {
  const availability = input.availability ?? "available";
  if (!["available", "limited", "unavailable"].includes(availability)) throw new Error("invalid availability");
  return {
    id: clean(input.id, "profile id"),
    headline: clean(input.headline, "headline", 280),
    skills: unique(input.skills),
    ...(input.location?.trim() ? { location: clean(input.location, "location", 160) } : {}),
    availability,
  };
}

export function matchTalent(profiles: TalentProfile[], query: TalentQuery = {}): TalentMatch[] {
  const wanted = unique(query.skills ?? []);
  const limit = validLimit(query.limit);

  return profiles
    .map(normalizeTalentProfile)
    .filter((profile) => !query.location?.trim() || profile.location?.toLowerCase() === query.location.trim().toLowerCase())
    .filter((profile) => !query.availability || profile.availability === query.availability)
    .map((profile) => {
      const matchedSkills = wanted.filter((skill) => profile.skills.includes(skill));
      const score = wanted.length === 0 ? 0 : matchedSkills.length / wanted.length;
      return { profile, matchedSkills, score };
    })
    .filter((match) => wanted.length === 0 || match.matchedSkills.length > 0)
    .sort((a, b) => b.score - a.score || compareCodePoints(a.profile.id, b.profile.id))
    .slice(0, limit);
}

export function createTalentMatchRequested(query: TalentQuery) {
  return {
    type: "sky.talent.match.requested.v1" as const,
    skills: unique(query.skills ?? []),
    location: query.location?.trim() || undefined,
    availability: query.availability,
    limit: validLimit(query.limit),
  };
}
