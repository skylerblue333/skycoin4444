const MAX_OPEN_ID_CHARACTERS = 512;

function validOpenId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_OPEN_ID_CHARACTERS
  );
}

/**
 * External identity data may enrich a verified session, but it may never
 * replace the identity already bound into the signed session token.
 */
export function assertOAuthProviderIdentity(
  sessionOpenId: unknown,
  providerOpenId: unknown
): string {
  if (!validOpenId(sessionOpenId)) {
    throw new Error("Signed session identity is invalid");
  }

  if (!validOpenId(providerOpenId) || providerOpenId !== sessionOpenId) {
    throw new Error("OAuth provider identity does not match signed session");
  }

  return providerOpenId;
}
