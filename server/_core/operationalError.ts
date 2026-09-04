const DEFAULT_MAX_ERROR_SUMMARY = 2_000;

function errorText(error: unknown): string {
  if (error instanceof Error) {
    return error.name + ": " + error.message;
  }
  return String(error);
}

export function sanitizeOperationalError(
  error: unknown,
  maxLength = DEFAULT_MAX_ERROR_SUMMARY
): string {
  if (
    !Number.isInteger(maxLength) ||
    maxLength < 64 ||
    maxLength > 10_000
  ) {
    throw new RangeError(
      "maxLength must be an integer between 64 and 10000"
    );
  }

  return errorText(error)
    .replace(
      /([a-z][a-z0-9+.-]*:\/\/)([^\s/:@]+):([^\s/@]+)@/gi,
      "$1[redacted]@"
    )
    .replace(
      /([?&](?:password|passwd|pwd|token|access_token|refresh_token|client_secret|api_key|apikey)=)[^&\s]+/gi,
      "$1[redacted]"
    )
    .replace(
      /(\bBearer\s+)[A-Za-z0-9._~+\/-]+=*/gi,
      "$1[redacted]"
    )
    .replace(
      /(\b(?:password|passwd|pwd|access[_-]?token|refresh[_-]?token|client[_-]?secret|api[_-]?key|apikey)\b\s*[:=]\s*)["']?[^,;\s"']+["']?/gi,
      "$1[redacted]"
    )
    .replace(
      /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
      "[redacted-jwt]"
    )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}
