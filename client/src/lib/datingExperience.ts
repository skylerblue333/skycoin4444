export const DATING_SESSION_PROFILE_KEY = "sky4444.dating-profile-beta";

export type DatingDraftSignals = {
  displayName: string;
  bio: string;
  age: number;
  location: string;
  interests: string[];
  lookingFor: string;
  photoCount: number;
};

export type DatingCandidateSignals = {
  displayName: string;
  location: string;
  bio: string;
  interests: string[];
};

export type DatingReadiness = {
  score: number;
  missing: string[];
};

const normalize = (value: string) => value.trim().toLocaleLowerCase();

export function scoreDatingProfile(input: {
  displayName: string;
  bio: string;
  location: string;
  interests: string[];
  photoCount: number;
  lookingFor: string;
}): DatingReadiness {
  const checks = [
    {
      ready: input.displayName.trim().length >= 2,
      missing: "Add a display name",
    },
    {
      ready: input.location.trim().length >= 2,
      missing: "Add your location",
    },
    {
      ready: input.bio.trim().length >= 40,
      missing: "Write a little more about yourself (40+ characters)",
    },
    {
      ready: input.interests.length >= 3,
      missing: "Choose at least 3 interests",
    },
    {
      ready: input.photoCount >= 2,
      missing: "Choose at least 2 photos",
    },
    {
      ready: Boolean(input.lookingFor.trim()),
      missing: "Set what you are looking for",
    },
  ];

  const passed = checks.filter(item => item.ready).length;
  return {
    score: Math.round((passed / checks.length) * 100),
    missing: checks.filter(item => !item.ready).map(item => item.missing),
  };
}

export function parseDatingDraftSignals(value: string | null): DatingDraftSignals | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<DatingDraftSignals> & {
      storage?: unknown;
    };

    if (
      typeof parsed.displayName !== "string" ||
      typeof parsed.bio !== "string" ||
      typeof parsed.age !== "number" ||
      !Number.isFinite(parsed.age) ||
      parsed.age < 18 ||
      typeof parsed.location !== "string" ||
      !Array.isArray(parsed.interests) ||
      !parsed.interests.every(item => typeof item === "string") ||
      typeof parsed.lookingFor !== "string" ||
      typeof parsed.photoCount !== "number" ||
      !Number.isFinite(parsed.photoCount) ||
      parsed.photoCount < 0 ||
      parsed.storage !== "browser-session"
    ) {
      return null;
    }

    return {
      displayName: parsed.displayName,
      bio: parsed.bio,
      age: parsed.age,
      location: parsed.location,
      interests: parsed.interests,
      lookingFor: parsed.lookingFor,
      photoCount: parsed.photoCount,
    };
  } catch {
    return null;
  }
}

export function sharedDatingInterests(
  mine: string[],
  theirs: string[],
): string[] {
  const mineSet = new Set(mine.map(normalize).filter(Boolean));
  return theirs.filter((interest, index) => {
    const normalized = normalize(interest);
    return (
      Boolean(normalized) &&
      mineSet.has(normalized) &&
      theirs.findIndex(item => normalize(item) === normalized) === index
    );
  });
}

export function buildConnectionSignals(
  draft: DatingDraftSignals | null,
  candidate: DatingCandidateSignals,
): string[] {
  if (!draft) return [];

  const reasons: string[] = [];
  const shared = sharedDatingInterests(draft.interests, candidate.interests);

  if (shared.length > 0) {
    reasons.push(
      shared.length === 1
        ? `You both listed ${shared[0]}.`
        : `You share ${shared.slice(0, 2).join(" and ")}.`,
    );
  }

  const myLocationParts = draft.location
    .split(",")
    .map(normalize)
    .filter(Boolean);
  const theirLocationParts = candidate.location
    .split(",")
    .map(normalize)
    .filter(Boolean);
  const sharesLocationComponent =
    myLocationParts.length > 0 &&
    theirLocationParts.length > 0 &&
    myLocationParts.some(part => theirLocationParts.includes(part));

  if (sharesLocationComponent) {
    reasons.push("You listed the same general location.");
  }

  return reasons.slice(0, 3);
}

export function buildConversationStarters(
  candidate: DatingCandidateSignals,
): string[] {
  const starters: string[] = [];
  const interests = candidate.interests
    .map(interest => interest.trim())
    .filter(Boolean);

  if (interests[0]) starters.push(`What got you into ${interests[0]}?`);
  if (interests[1]) starters.push(`What do you enjoy most about ${interests[1]}?`);
  if (candidate.location.trim()) {
    starters.push(`What is a place you enjoy around ${candidate.location.trim()}?`);
  }
  if (!starters.length) starters.push("What are you looking forward to this week?");

  return Array.from(new Set(starters)).slice(0, 3);
}
