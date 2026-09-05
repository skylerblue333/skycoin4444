export type PlatformReportRow = readonly [string, string | number];

export function buildPlatformReportCsv(rows: readonly PlatformReportRow[]): string {
  return rows
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export function platformReportFilename(range: string, language: string | null): string {
  const safe = (value: string) => value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  return `skycoin4444-platform-report-${safe(range)}-${safe(language ?? "all-languages")}.csv`;
}
