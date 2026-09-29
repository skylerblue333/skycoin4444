export type LanguagePair = {
  nativeLanguage: string;
  learningLanguage: string;
  topics?: string | null;
};

export type LanguageMatchKind =
  | "reciprocal"
  | "teaches-your-language"
  | "learns-your-language"
  | "none";

export function normalizeLanguage(value: string) {
  return value.trim().toLocaleLowerCase("en-US");
}

export function parseTopics(value?: string | null) {
  if (!value) return [];
  return [...new Set(
    value
      .split(",")
      .map(topic => topic.trim().toLocaleLowerCase("en-US"))
      .filter(Boolean)
  )].slice(0, 12);
}

export function languageMatchScore(
  viewer: LanguagePair,
  candidate: LanguagePair
): { score: number; kind: LanguageMatchKind; sharedTopics: string[] } {
  const viewerNative = normalizeLanguage(viewer.nativeLanguage);
  const viewerLearning = normalizeLanguage(viewer.learningLanguage);
  const candidateNative = normalizeLanguage(candidate.nativeLanguage);
  const candidateLearning = normalizeLanguage(candidate.learningLanguage);

  const teachesViewer = candidateNative === viewerLearning;
  const learnsViewer = candidateLearning === viewerNative;
  const reciprocal = teachesViewer && learnsViewer;

  const viewerTopics = new Set(parseTopics(viewer.topics));
  const sharedTopics = parseTopics(candidate.topics).filter(topic =>
    viewerTopics.has(topic)
  );

  const baseScore = reciprocal ? 100 : teachesViewer ? 70 : learnsViewer ? 55 : 0;
  return {
    score: Math.min(100, baseScore + Math.min(sharedTopics.length * 3, reciprocal ? 0 : 15)),
    kind: reciprocal
      ? "reciprocal"
      : teachesViewer
        ? "teaches-your-language"
        : learnsViewer
          ? "learns-your-language"
          : "none",
    sharedTopics,
  };
}
