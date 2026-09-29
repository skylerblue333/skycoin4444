export function deriveLoginMethod(
  platforms: unknown,
  fallback: string | null | undefined
): string | null {
  if (fallback && fallback.length > 0) return fallback;
  if (!Array.isArray(platforms) || platforms.length === 0) return null;

  const set = new Set<string>(
    platforms.filter(
      (platform): platform is string => typeof platform === "string"
    )
  );

  if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
  if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
  if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
  if (
    set.has("REGISTERED_PLATFORM_MICROSOFT") ||
    set.has("REGISTERED_PLATFORM_AZURE")
  ) {
    return "microsoft";
  }
  if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";

  const first = set.values().next().value;
  return first ? first.toLowerCase() : null;
}
