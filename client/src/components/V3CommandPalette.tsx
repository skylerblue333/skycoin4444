import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Clock3, Command, CornerDownLeft, Search, X } from "lucide-react";
import { useLocation } from "wouter";
import routeCatalog from "@/data/routeCatalog.json";
import HopeAISprintClosure from "@/components/HopeAISprintClosure";
import V3JourneyNavigator from "@/components/V3JourneyNavigator";
import V3JourneyEvidenceCompanion from "@/components/V3JourneyEvidenceCompanion";
import V4DemoCompanion from "@/components/V4DemoCompanion";
import {
  mergeRecentRoutePaths,
  resolveRecentRoutes,
  searchRoutes,
  type DiscoverableRoute,
} from "@/lib/routeDiscovery";

const RECENT_KEY = "sky4444.v3-recent-routes";
const QUICK_PATHS = [
  "/beta-workspace",
  "/platform-map",
  "/activity-feed",
  "/sky-school",
  "/gaming",
  "/live",
] as const;

const routes = routeCatalog.routes as DiscoverableRoute[];
const byPath = new Map(routes.map(route => [route.path, route]));
const quickRoutes = QUICK_PATHS.map(path => byPath.get(path)).filter((route): route is DiscoverableRoute => Boolean(route));

function readRecentPaths() {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default function V3CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [recentPaths, setRecentPaths] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () => (query.trim() ? searchRoutes(routes, query, 12) : resolveRecentRoutes(routes, recentPaths, 6)),
    [query, recentPaths],
  );
  const visibleRoutes = query.trim() ? results : results.length ? results : quickRoutes;

  useEffect(() => {
    setRecentPaths(readRecentPaths());
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  const navigate = (route: DiscoverableRoute) => {
    const nextRecent = mergeRecentRoutePaths(readRecentPaths(), route.path);
    setRecentPaths(nextRecent);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent));
    } catch {
      // Navigation must still work when storage is unavailable.
    }
    onOpenChange(false);
    setLocation(route.path);
  };

  return (
    <>
      <V3JourneyNavigator />
      <V3JourneyEvidenceCompanion />
      <HopeAISprintClosure />
      <V4DemoCompanion />
      {open ? (
        <div
          className="fixed inset-0 z-[120] bg-[#020208]/82 p-3 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Search SKYCOIN4444 routes"
          onMouseDown={event => {
            if (event.target === event.currentTarget) onOpenChange(false);
          }}
        >
          <div className="mx-auto mt-[8vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-white/12 bg-[#0a0a18] shadow-2xl shadow-black/70">
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
              <Search className="h-5 w-5 shrink-0 text-sky-200" />
              <input
                ref={inputRef}
                value={query}
                onChange={event => setQuery(event.target.value)}
                onKeyDown={event => {
                  if (event.key === "Escape") onOpenChange(false);
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActiveIndex(index => Math.min(index + 1, Math.max(visibleRoutes.length - 1, 0)));
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveIndex(index => Math.max(index - 1, 0));
                  }
                  if (event.key === "Enter" && visibleRoutes[activeIndex]) navigate(visibleRoutes[activeIndex]);
                }}
                placeholder={`Search ${routes.length.toLocaleString()} routes, tools, and screens…`}
                aria-label="Search routes"
                className="min-w-0 flex-1 bg-transparent py-2 text-base text-white outline-none placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/45 transition hover:bg-white/[0.07] hover:text-white"
                aria-label="Close route search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              <span className="inline-flex items-center gap-1.5">
                {query.trim() ? <Search className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
                {query.trim() ? `${visibleRoutes.length} best matches` : recentPaths.length ? "Recent routes" : "Recommended routes"}
              </span>
              <span className="hidden items-center gap-1 sm:inline-flex"><Command className="h-3 w-3" /> K to toggle</span>
            </div>

            <div className="max-h-[56vh] overflow-y-auto p-2">
              {visibleRoutes.length ? visibleRoutes.map((route, index) => (
                <button
                  key={route.path}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => navigate(route)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                    index === activeIndex ? "bg-sky-300/10 ring-1 ring-inset ring-sky-300/20" : "hover:bg-white/[0.05]"
                  }`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${index === activeIndex ? "bg-sky-300/15 text-sky-100" : "bg-white/[0.05] text-white/40"}`}>
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-sm text-white">{route.label}</strong>
                    <span className="mt-0.5 block truncate text-xs text-white/35">{route.path} · {route.component}</span>
                  </span>
                  {index === activeIndex ? <CornerDownLeft className="h-4 w-4 shrink-0 text-sky-200/60" /> : null}
                </button>
              )) : (
                <div className="px-5 py-10 text-center">
                  <p className="font-semibold text-white/70">No route matched “{query}”.</p>
                  <p className="mt-2 text-sm text-white/35">Try a product name, screen label, component, or route path.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] px-5 py-3 text-[10px] text-white/25">
              <span>↑↓ select · Enter open · Esc close</span>
              <span>Registry-backed discovery · no invented capabilities</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
