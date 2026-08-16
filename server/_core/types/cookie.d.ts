declare module "cookie" {
  export function parseCookie(
    str: string,
    options?: Record<string, unknown>
  ): Record<string, string>;
}
