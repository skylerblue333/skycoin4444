import { useEffect, useMemo, useState } from "react";
import { WifiOff } from "lucide-react";
import { useLocation } from "wouter";
import routeCatalog from "@/data/routeCatalog.json";

type RouteRecord = {
  path: string;
  label: string;
  component: string;
};

const routes = routeCatalog.routes as RouteRecord[];
const routeByPath = new Map(routes.map(route => [route.path, route]));

function cleanPath(location: string) {
  return location.split("?")[0]?.split("#")[0] || "/";
}

function fallbackLabel(path: string) {
  if (path === "/") return "Home";
  return path
    .split("/")
    .filter(Boolean)
    .join(" ")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase()) || "Home";
}

export default function GlobalExperienceRuntime() {
  const [location] = useLocation();
  const [online, setOnline] = useState(true);

  const route = useMemo(() => {
    const path = cleanPath(location);
    return routeByPath.get(path) ?? {
      path,
      label: fallbackLabel(path),
      component: "Route",
    };
  }, [location]);

  useEffect(() => {
    document.title =
      route.path === "/"
        ? "SKYCOIN4444 · Engineering Beta"
        : `${route.label} · SKYCOIN4444`;
  }, [route.label, route.path]);

  useEffect(() => {
    const syncConnection = () => setOnline(navigator.onLine);
    syncConnection();
    window.addEventListener("online", syncConnection);
    window.addEventListener("offline", syncConnection);
    return () => {
      window.removeEventListener("online", syncConnection);
      window.removeEventListener("offline", syncConnection);
    };
  }, []);

  return (
    <>
      <a
        href="#sky4444-route-content"
        className="fixed left-3 top-3 z-[200] -translate-y-20 rounded-xl border border-amber-200/25 bg-[#120908] px-4 py-2 text-sm font-black text-amber-100 shadow-2xl transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-amber-300"
      >
        Skip to page content
      </a>

      <span
        key={location}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Opened {route.label}.
      </span>

      {!online ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-3 bottom-[5.25rem] z-[95] mx-auto flex max-w-xl items-start gap-3 rounded-2xl border border-amber-300/25 bg-[#1a0f08]/96 px-4 py-3 text-sm text-amber-50 shadow-2xl backdrop-blur-xl md:bottom-4"
        >
          <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" aria-hidden="true" />
          <span>
            <strong className="block font-black">You’re offline.</strong>
            <span className="mt-0.5 block text-xs leading-relaxed text-amber-50/65">
              Browser-local and already-loaded content may remain available. Server actions can fail until your connection returns.
            </span>
          </span>
        </div>
      ) : null}
    </>
  );
}
