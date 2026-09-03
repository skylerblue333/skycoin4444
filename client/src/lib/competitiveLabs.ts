export type StreamStudioDraft = {
  title: string;
  category: string;
  language: string;
  audience: "public" | "community" | "private-test";
  description: string;
};

export const emptyStreamStudioDraft: StreamStudioDraft = {
  title: "",
  category: "",
  language: "English",
  audience: "private-test",
  description: "",
};

export function validateStreamStudioDraft(draft: StreamStudioDraft) {
  const errors: string[] = [];
  if (draft.title.trim().length < 3)
    errors.push("Title must be at least 3 characters.");
  if (draft.category.trim().length < 2) errors.push("Category is required.");
  if (draft.language.trim().length < 2) errors.push("Language is required.");
  if (draft.description.trim().length > 500)
    errors.push("Description must be 500 characters or fewer.");
  return errors;
}

export function parseStreamStudioDraft(value: string | null) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<StreamStudioDraft>;
    if (
      typeof parsed.title !== "string" ||
      typeof parsed.category !== "string" ||
      typeof parsed.language !== "string" ||
      typeof parsed.description !== "string" ||
      !["public", "community", "private-test"].includes(parsed.audience ?? "")
    )
      return null;
    return parsed as StreamStudioDraft;
  } catch {
    return null;
  }
}

export type LanguageExchangeProfile = {
  nativeLanguage: string;
  learningLanguage: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  sessionMinutes: 30 | 45 | 60;
  availability: string;
  goals: string;
  topics: string;
};

export const emptyLanguageExchangeProfile: LanguageExchangeProfile = {
  nativeLanguage: "",
  learningLanguage: "",
  level: "A1",
  sessionMinutes: 30,
  availability: "",
  goals: "",
  topics: "",
};

export type LanguagePracticePlan = {
  title: string;
  totalMinutes: number;
  steps: Array<{ minutes: number; label: string; detail: string }>;
};

export function validateLanguageExchangeProfile(
  profile: LanguageExchangeProfile
) {
  const errors: string[] = [];
  if (profile.nativeLanguage.trim().length < 2)
    errors.push("Native language is required.");
  if (profile.learningLanguage.trim().length < 2)
    errors.push("Learning language is required.");
  if (
    profile.nativeLanguage.trim().toLowerCase() ===
    profile.learningLanguage.trim().toLowerCase()
  )
    errors.push("Choose two different languages.");
  if (profile.goals.trim().length < 5)
    errors.push("Add a short practice goal.");
  return errors;
}

export function parseLanguageExchangeProfile(value: string | null) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<LanguageExchangeProfile>;
    if (
      typeof parsed.nativeLanguage !== "string" ||
      typeof parsed.learningLanguage !== "string" ||
      typeof parsed.availability !== "string" ||
      typeof parsed.goals !== "string" ||
      typeof parsed.topics !== "string" ||
      !["A1", "A2", "B1", "B2", "C1", "C2"].includes(parsed.level ?? "") ||
      ![30, 45, 60].includes(parsed.sessionMinutes ?? 0)
    )
      return null;
    return parsed as LanguageExchangeProfile;
  } catch {
    return null;
  }
}

export function buildLanguagePracticePlan(
  profile: LanguageExchangeProfile
): LanguagePracticePlan {
  const warmup = 5;
  const reflection = 5;
  const shared = profile.sessionMinutes - warmup - reflection;
  const firstLanguage = Math.floor(shared / 2);
  const secondLanguage = shared - firstLanguage;
  const topic = profile.topics.trim() || "everyday life";
  return {
    title:
      profile.nativeLanguage + " ↔ " + profile.learningLanguage + " practice",
    totalMinutes: profile.sessionMinutes,
    steps: [
      {
        minutes: warmup,
        label: "Set expectations",
        detail: "Agree on corrections and introduce the topic: " + topic + ".",
      },
      {
        minutes: firstLanguage,
        label: "Practice " + profile.learningLanguage,
        detail:
          "Focus on the learner's " +
          profile.level +
          " goal: " +
          profile.goals.trim() +
          ".",
      },
      {
        minutes: secondLanguage,
        label: "Practice " + profile.nativeLanguage,
        detail:
          "Switch roles so both participants receive equal practice time.",
      },
      {
        minutes: reflection,
        label: "Reflect and follow up",
        detail:
          "Share one useful correction and one topic for the next session.",
      },
    ],
  };
}

export type CommerceSandboxItem = {
  sku: string;
  name: string;
  category: "Learning" | "Creator" | "Community";
  description: string;
  unitAmountMinor: number;
};

export const commerceSandboxItems: readonly CommerceSandboxItem[] = [
  {
    sku: "FIXTURE-LANGUAGE-CARDS",
    name: "Language practice card pack",
    category: "Learning",
    description: "Digital conversation prompts for testing cart behavior.",
    unitAmountMinor: 1200,
  },
  {
    sku: "FIXTURE-CREATOR-KIT",
    name: "Creator planning kit",
    category: "Creator",
    description: "A fictional stream-planning template bundle.",
    unitAmountMinor: 1800,
  },
  {
    sku: "FIXTURE-COMMUNITY-GUIDE",
    name: "Community host guide",
    category: "Community",
    description: "A fictional moderation checklist for product testing.",
    unitAmountMinor: 900,
  },
] as const;

export type CommerceSandboxCart = Record<string, number>;

export function normalizeCommerceSandboxCart(
  value: unknown
): CommerceSandboxCart {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const allowed = new Set(commerceSandboxItems.map(item => item.sku));
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([sku, quantity]) => allowed.has(sku) && Number(quantity) > 0)
      .map(([sku, quantity]) => [
        sku,
        Math.min(10, Math.max(1, Math.floor(Number(quantity)))),
      ])
  );
}
