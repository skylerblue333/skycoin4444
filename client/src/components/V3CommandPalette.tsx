import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  Command,
  CornerDownLeft,
  Layers3,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import routeCatalog from "@/data/routeCatalog.json";
import HopeAISprintClosure from "@/components/HopeAISprintClosure";
import V3JourneyNavigator from "@/components/V3JourneyNavigator";
import V3JourneyEvidenceCompanion from "@/components/V3JourneyEvidenceCompanion";
import V4DemoCompanion from "@/components/V4DemoCompanion";
import {
  betaExperienceStatusCopy,
  findBetaExperienceAreaForRoute,
} from "@/data/betaExperienceAreas";
import {
  mergeRecentRoutePaths,
  mergeRouteCollections,
  resolveFavoriteRoutes,
  resolveRecentRoutes,
  searchRoutes,
  toggleFavoriteRoutePath,
  type DiscoverableRoute,
} from "@/lib/routeDiscovery";

const RECENT_KEY = "sky4444.v3-recent-routes";
const FAVORITES_KEY = "sky4444.v5-favorite-routes";
const QUICK_PATHS = [
  "/beta-workspace",
  "/platform-map",
  "/activity-feed",
  "/unified-messaging",
  "/sky-school",
  "/gaming",
  "/hope-a-i",
  "/live",
  "/beta-commerce",
  "/beta-web3",
] as const;

type WorkspaceRoute = DiscoverableRoute & {
  areaId: string | null;
  areaName: string;
  areaRoute: string;
  areaStatusLabel: string;
};

const routes: WorkspaceRoute[] = routeCatalog.routes.map(route => {
  const area = findBetaExperienceAreaForRoute(route.path, route.label);
  return {
    ...route,
    keywords: area ? [area.name, area.eyebrow, ...area.searchTerms] : [],
    areaId: area?.id ?? null,
    areaName: area?.name ?? "Route library",
    areaRoute: area?.route ?? "/platform-map",
    areaStatusLabel: area ? betaExperienceStatusCopy[area.status].label : "Library route",
  };
});

const byPath = new Map(routes.map(route => [route.path, route]));
const quickRoutes = QUICK_PATHS.map(path => byPath.get(path)).filter(
  (route): route is WorkspaceRoute => Boolean(route),
);

function readStoredPaths(key: string) {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function writeStoredPaths(key: string, paths: readonly string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(paths));
  } catch {
    // Preferences are progressive enhancement; navigation must still work.
  }
}

function optionId(path: string) {
  return `sky4444-route-option-${path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home"}`;
}

export default function V3CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [location, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [recentPaths, setRecentPaths] = useState<string[]>([]);
  const [favoritePaths, setFavoritePaths] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const searchResults = useMemo(
    () => (query.trim() ? searchRoutes(routes, query, 20) as WorkspaceRoute[] : []),
    [query],
  );
  const favoriteRoutes = useMemo(
    () => resolveFavoriteRoutes(routes, favoritePaths, 8) as WorkspaceRoute[],
    [favoritePaths],
  );
  const recentRoutes = useMemo(
    () => resolveRecentRoutes(routes, recentPaths, 8) as WorkspaceRoute[],
    [recentPaths],
  );

  const currentRoute = byPath.get(location);
  const currentAreaId = currentRoute?.areaId ?? null;
  const relatedRoutes = useMemo(() => {
    if (!currentAreaId) return [];
    return routes
      .filter(route => route.areaId === currentAreaId && route.path !== location)
      .slice(0, 8);
  }, [currentAreaId, location]);

  const defaultRoutes = useMemo(
    () => mergeRouteCollections(
      [favoriteRoutes, recentRoutes, relatedRoutes, quickRoutes],
      18,
    ) as WorkspaceRoute[],
    [favoriteRoutes, recentRoutes, relatedRoutes],
  );
  const visibleRoutes = query.trim() ? searchResults : defaultRoutes;
  const activeRoute = visibleRoutes[activeIndex] ?? null;

  useEffect(() => {
    setRecentPaths(readStoredPaths(RECENT_KEY));
    setFavoritePaths(readStoredPaths(FAVORITES_KEY));
  }, []);

  useEffect(() => {
    if (!byPath.has(location)) return;
    setRecentPaths(current => {
      const next = mergeRecentRoutePaths(current, location, 12);
      writeStoredPaths(RECENT_KEY, next);
      return next;
    });
  }, [location]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const editing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
        return;
      }

      if (!editing && event.key === "/") {
        event.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActiveIndex(0);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      previousFocusRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  const navigate = (route: WorkspaceRoute) => {
    onOpenChange(false);
    setLocation(route.path);
  };

  const toggleFavorite = (path: string) => {
    setFavoritePaths(current => {
      const next = toggleFavoriteRoutePath(current, path, 24);
      writeStoredPaths(FAVORITES_KEY, next);
      return next;
    });
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onOpenChange(false);
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter(element => element.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const moveActive = (direction: 1 | -1) => {
    if (!visibleRoutes.length) return;
    setActiveIndex(index => {
      const next = index + direction;
      if (next < 0) return visibleRoutes.length - 1;
      if (next >= visibleRoutes.length) return 0;
      return next;
    });
  };

  const renderRoute = (route: WorkspaceRoute) => {
    const index = visibleRoutes.findIndex(item => item.path === route.path);
    const active = index === activeIndex;
    const favorite = favoritePaths.includes(route.path);

    return (
      <div
        key={route.path}
        className={`flex items-center gap-2 rounded-2xl transition ${
          active ? "bg-amber-300/10 ring-1 ring-inset ring-amber-300/20" : "hover:bg-white/[0.045]"
        }`}
      >
        <button
          id={optionId(route.path)}
          type="button"
          role="option"
          aria-selected={active}
          onMouseEnter={() => setActiveIndex(index)}
          onFocus={() => setActiveIndex(index)}
          onClick={() => navigate(route)}
          className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
        >
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
              active ? "bg-amber-300/15 text-amber-100" : "bg-white/[0.05] text-white/40"
            }`}
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex min-w-0 items-center gap-2">
              <strong className="truncate text-sm text-white">{route.label}</strong>
              <span className="hidden shrink-0 rounded-full border border-white/[0.08] bg-white/[0.035] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white/35 sm:inline">
                {route.areaStatusLabel}
              </span>
            </span>
            <span className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-white/35">
              <span className="truncate">{route.areaName}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{route.path}</span>
            </span>
          </span>
          {active ? <CornerDownLeft className="h-4 w-4 shrink-0 text-amber-200/65" /> : null}
        </button>
        <button
          type="button"
          onClick={() => toggleFavorite(route.path)}
          className={`mr-2 grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition ${
            favorite
              ? "border-amber-300/25 bg-amber-300/10 text-amber-200"
              : "border-white/[0.07] text-white/25 hover:border-amber-300/20 hover:text-amber-100"
          }`}
          aria-label={favorite ? `Remove ${route.label} from favorites` : `Add ${route.label} to favorites`}
          title={favorite ? "Remove favorite" : "Save favorite"}
        >
          <Star className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
        </button>
      </div>
    );
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    collection: readonly WorkspaceRoute[],
    emptyCopy?: string,
  ) => {
    const sectionRoutes = collection.filter(route => visibleRoutes.some(item => item.path === route.path));
    if (!sectionRoutes.length && !emptyCopy) return null;

    return (
      <section className="py-1" aria-label={title}>
        <div className="flex items-center gap-2 px-3 pb-1 pt-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
          {icon}
          {title}
        </div>
        {sectionRoutes.length ? sectionRoutes.map(renderRoute) : (
          <p className="px-3 py-3 text-xs text-white/30">{emptyCopy}</p>
        )}
      </section>
    );
  };

  return (
    <>
      <V3JourneyNavigator />
      <V3JourneyEvidenceCompanion />
      <HopeAISprintClosure />
      <V4DemoCompanion />
      {open ? (
        <div
          className="fixed inset-0 z-[120] bg-[#020208]/84 p-3 backdrop-blur-md sm:p-6"
          role="presentation"
          onMouseDown={event => {
            if (event.target === event.currentTarget) onOpenChange(false);
          }}
        >
          <div
            ref={dialogRef}
            className="mx-auto mt-[5vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-amber-200/12 bg-[#0b0708] shadow-2xl shadow-black/70"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sky4444-route-workspace-title"
            aria-describedby="sky4444-route-workspace-description"
            onKeyDown={handleDialogKeyDown}
          >
            <div className="border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 shrink-0 text-amber-200" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      moveActive(1);
                    }
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      moveActive(-1);
                    }
                    if (event.key === "Enter" && activeRoute) {
                      event.preventDefault();
                      navigate(activeRoute);
                    }
                  }}
                  placeholder={`Search ${routes.length.toLocaleString()} routes, tools, screens, and product areas…`}
                  aria-label="Search routes and product areas"
                  role="combobox"
                  aria-expanded="true"
                  aria-autocomplete="list"
                  aria-controls="sky4444-route-results"
                  aria-activedescendant={activeRoute ? optionId(activeRoute.path) : undefined}
                  className="min-w-0 flex-1 bg-transparent py-2 text-base text-white outline-none placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/45 transition hover:bg-white/[0.07] hover:text-white"
                  aria-label="Close route workspace"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 pl-8 text-[10px] text-white/30">
                <span id="sky4444-route-workspace-title" className="font-black uppercase tracking-[0.16em] text-amber-100/55">
                  Universal route workspace
                </span>
                <span id="sky4444-route-workspace-description">
                  Search by capability, save favorites, revisit recent screens, or jump within the current product area.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              <span className="inline-flex items-center gap-1.5">
                {query.trim() ? <Search className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                {query.trim()
                  ? `${visibleRoutes.length} best matches`
                  : currentRoute
                    ? `Working from ${currentRoute.areaName}`
                    : "Personal workspace"}
              </span>
              <span className="hidden items-center gap-1 sm:inline-flex">
                <Command className="h-3 w-3" /> K or / to open
              </span>
            </div>

            <div id="sky4444-route-results" role="listbox" className="max-h-[62vh] overflow-y-auto p-2">
              {query.trim() ? (
                visibleRoutes.length ? visibleRoutes.map(renderRoute) : (
                  <div className="px-5 py-12 text-center">
                    <p className="font-semibold text-white/70">No route matched “{query}”.</p>
                    <p className="mt-2 text-sm text-white/35">
                      Try a capability, product area, screen label, component, or route path.
                    </p>
                  </div>
                )
              ) : (
                <>
                  {renderSection(
                    "Favorites",
                    <Star className="h-3 w-3" />,
                    favoriteRoutes,
                    "Save useful screens with the star button and they will stay at the top here.",
                  )}
                  {renderSection("Recent", <Clock3 className="h-3 w-3" />, recentRoutes)}
                  {renderSection(
                    currentRoute ? `More in ${currentRoute.areaName}` : "Related",
                    <Layers3 className="h-3 w-3" />,
                    relatedRoutes,
                  )}
                  {renderSection("Recommended", <Sparkles className="h-3 w-3" />, quickRoutes)}
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] px-5 py-3 text-[10px] text-white/25">
              <span>↑↓ select · Enter open · ★ save · Esc close</span>
              <span>Registry-backed discovery · Preferences stay on this device · route registry remains the source of truth</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
