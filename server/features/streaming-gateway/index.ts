export interface StreamRoute {
  id: string;
  protocol: "hls" | "dash" | "webrtc";
  region: string;
  priority: number;
  healthy: boolean;
}

export interface StreamRouteDecisionV1 {
  type: "sky.streaming.route.v1";
  routeId: string;
  protocol: StreamRoute["protocol"];
  region: string;
}

function clean(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

function compareCodeUnits(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export function selectStreamRoute(
  routes: readonly StreamRoute[],
  protocol: StreamRoute["protocol"],
  preferredRegion?: string,
): StreamRoute {
  const seen = new Set<string>();
  const eligible = routes.filter((route) => {
    const id = clean(route.id, "route id");
    if (seen.has(id)) throw new Error(`duplicate route id: ${id}`);
    seen.add(id);
    clean(route.region, "region");
    if (!Number.isSafeInteger(route.priority)) throw new Error("priority must be a safe integer");
    return route.healthy && route.protocol === protocol;
  });
  if (eligible.length === 0) throw new Error("no healthy stream route available");

  const region = preferredRegion?.trim();
  const preferred = region ? eligible.filter((route) => route.region === region) : [];
  const pool = preferred.length > 0 ? preferred : eligible;
  return [...pool].sort((a, b) => a.priority - b.priority || compareCodeUnits(a.id, b.id))[0];
}

export function toStreamRouteDecision(route: StreamRoute): StreamRouteDecisionV1 {
  return {
    type: "sky.streaming.route.v1",
    routeId: clean(route.id, "route id"),
    protocol: route.protocol,
    region: clean(route.region, "region"),
  };
}
