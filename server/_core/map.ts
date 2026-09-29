/**
 * Google Maps API integration through the configured Forge proxy.
 *
 * Provider requests are treated as an external trust boundary: endpoints and
 * parameters are validated, requests are time-bounded, and upstream response
 * bodies are never reflected through application errors.
 */

import { ENV } from "./env";

const MAPS_REQUEST_TIMEOUT_MS = 15_000;

type MapsConfig = {
  baseUrl: string;
  apiKey: string;
};

function isLoopbackHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
}

function getMapsConfig(): MapsConfig {
  const rawBaseUrl = ENV.forgeApiUrl.trim();
  const apiKey = ENV.forgeApiKey.trim();

  if (!rawBaseUrl || !apiKey) {
    throw new Error(
      "Google Maps proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY",
    );
  }

  let baseUrl: URL;
  try {
    baseUrl = new URL(rawBaseUrl);
  } catch {
    throw new Error("BUILT_IN_FORGE_API_URL is invalid");
  }

  const allowLoopbackHttp =
    process.env.NODE_ENV !== "production" &&
    baseUrl.protocol === "http:" &&
    isLoopbackHost(baseUrl.hostname);

  if (baseUrl.protocol !== "https:" && !allowLoopbackHttp) {
    throw new Error("BUILT_IN_FORGE_API_URL must use HTTPS");
  }

  if (baseUrl.username || baseUrl.password) {
    throw new Error("BUILT_IN_FORGE_API_URL must not contain credentials");
  }

  baseUrl.pathname = baseUrl.pathname.replace(/\/+$/, "") + "/";
  baseUrl.search = "";
  baseUrl.hash = "";

  return {
    baseUrl: baseUrl.toString(),
    apiKey,
  };
}

interface RequestOptions {
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
}

function normalizeEndpoint(endpoint: string) {
  if (
    typeof endpoint !== "string" ||
    endpoint.length === 0 ||
    endpoint !== endpoint.trim() ||
    !endpoint.startsWith("/") ||
    endpoint.startsWith("//") ||
    endpoint.includes("\\") ||
    endpoint.includes("?") ||
    endpoint.includes("#") ||
    /[\u0000-\u001f\u007f]/.test(endpoint) ||
    endpoint.split("/").includes("..")
  ) {
    throw new Error(
      "Google Maps endpoint must be a normalized absolute proxy path without query or fragment",
    );
  }

  return endpoint;
}

function serializeScalarParam(value: unknown, key: string): string {
  if (typeof value === "string") return value;
  if (typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(`Google Maps parameter "${key}" must be finite`);
    }
    return String(value);
  }

  throw new Error(
    `Google Maps parameter "${key}" must be a string, number, boolean, bigint, or array of those values`,
  );
}

function serializeParam(value: unknown, key: string) {
  if (Array.isArray(value)) {
    return value.map(item => serializeScalarParam(item, key)).join("|");
  }
  return serializeScalarParam(value, key);
}

async function readJsonWithTimeout<T>(
  url: string,
  init: RequestInit,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    MAPS_REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    if (!response.ok) {
      try {
        await response.body?.cancel();
      } catch {
        // Best-effort cleanup only.
      }
      throw new Error(
        `Google Maps API request failed (HTTP ${response.status})`,
      );
    }

    try {
      return (await response.json()) as T;
    } catch {
      if (controller.signal.aborted) {
        throw new Error(
          `Google Maps API request timed out after ${MAPS_REQUEST_TIMEOUT_MS}ms`,
        );
      }
      throw new Error("Google Maps API returned invalid JSON");
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(
        `Google Maps API request timed out after ${MAPS_REQUEST_TIMEOUT_MS}ms`,
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Make an authenticated request to the configured Maps proxy.
 *
 * Array query parameters are serialized with `|`, matching Google Maps
 * multi-value query contracts such as origins, destinations, and waypoints.
 */
export async function makeRequest<T = unknown>(
  endpoint: string,
  params: Record<string, unknown> = {},
  options: RequestOptions = {},
): Promise<T> {
  const { baseUrl, apiKey } = getMapsConfig();
  const safeEndpoint = normalizeEndpoint(endpoint);
  const method = options.method ?? "GET";

  if (method === "GET" && options.body !== undefined) {
    throw new Error("Google Maps GET requests cannot include a request body");
  }

  const url = new URL(
    `v1/maps/proxy${safeEndpoint}`,
    baseUrl,
  );
  url.searchParams.set("key", apiKey);

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    url.searchParams.append(key, serializeParam(value, key));
  }

  return readJsonWithTimeout<T>(url.toString(), {
    method,
    headers: {
      accept: "application/json",
      ...(options.body ? { "content-type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
}

export type TravelMode = "driving" | "walking" | "bicycling" | "transit";
export type MapType = "roadmap" | "satellite" | "terrain" | "hybrid";
export type SpeedUnit = "KPH" | "MPH";

export type LatLng = {
  lat: number;
  lng: number;
};

export type DirectionsResult = {
  routes: Array<{
    legs: Array<{
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      start_address: string;
      end_address: string;
      start_location: LatLng;
      end_location: LatLng;
      steps: Array<{
        distance: { text: string; value: number };
        duration: { text: string; value: number };
        html_instructions: string;
        travel_mode: string;
        start_location: LatLng;
        end_location: LatLng;
      }>;
    }>;
    overview_polyline: { points: string };
    summary: string;
    warnings: string[];
    waypoint_order: number[];
  }>;
  status: string;
};

export type DistanceMatrixResult = {
  rows: Array<{
    elements: Array<{
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      status: string;
    }>;
  }>;
  origin_addresses: string[];
  destination_addresses: string[];
  status: string;
};

export type GeocodingResult = {
  results: Array<{
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    formatted_address: string;
    geometry: {
      location: LatLng;
      location_type: string;
      viewport: {
        northeast: LatLng;
        southwest: LatLng;
      };
    };
    place_id: string;
    types: string[];
  }>;
  status: string;
};

export type PlacesSearchResult = {
  results: Array<{
    place_id: string;
    name: string;
    formatted_address: string;
    geometry: {
      location: LatLng;
    };
    rating?: number;
    user_ratings_total?: number;
    business_status?: string;
    types: string[];
  }>;
  status: string;
};

export type PlaceDetailsResult = {
  result: {
    place_id: string;
    name: string;
    formatted_address: string;
    formatted_phone_number?: string;
    international_phone_number?: string;
    website?: string;
    rating?: number;
    user_ratings_total?: number;
    reviews?: Array<{
      author_name: string;
      rating: number;
      text: string;
      time: number;
    }>;
    opening_hours?: {
      open_now: boolean;
      weekday_text: string[];
    };
    geometry: {
      location: LatLng;
    };
  };
  status: string;
};

export type ElevationResult = {
  results: Array<{
    elevation: number;
    location: LatLng;
    resolution: number;
  }>;
  status: string;
};

export type TimeZoneResult = {
  dstOffset: number;
  rawOffset: number;
  status: string;
  timeZoneId: string;
  timeZoneName: string;
};

export type RoadsResult = {
  snappedPoints: Array<{
    location: LatLng;
    originalIndex?: number;
    placeId: string;
  }>;
};

/**
 * Common endpoint reference:
 * - /maps/api/geocode/json
 * - /maps/api/directions/json
 * - /maps/api/distancematrix/json
 * - /maps/api/place/textsearch/json
 * - /maps/api/place/nearbysearch/json
 * - /maps/api/place/details/json
 * - /maps/api/elevation/json
 * - /maps/api/timezone/json
 * - /v1/snapToRoads
 * - /v1/nearestRoads
 * - /v1/speedLimits
 * - /maps/api/place/autocomplete/json
 */
