import * as cookieModule from "cookie";

type CookieValues = Record<string, string | undefined>;
type CookieParser = (cookieHeader: string) => CookieValues;

type CookieModuleExports = {
  parseCookie?: CookieParser;
  parse?: CookieParser;
};

const cookieParser = cookieModule as unknown as CookieModuleExports;

/**
 * Parses an HTTP Cookie header using the parser exposed by the installed
 * cookie package. The package renamed `parse` to `parseCookie` in its ESM API;
 * accepting either name keeps the server compatible with the locked runtime
 * and TypeScript's legacy declaration resolution.
 */
export function parseCookieHeader(cookieHeader: string): CookieValues {
  const parse = cookieParser.parseCookie ?? cookieParser.parse;
  if (!parse) {
    throw new Error("Installed cookie package does not expose a cookie parser");
  }

  return parse(cookieHeader);
}
