import { useMemo, useState } from "react";
import { Link } from "wouter";
import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  Gamepad2,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Landmark,
  MessageCircleMore,
  Radio,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  Video,
  WalletCards,
  X,
} from "lucide-react";
import routeCatalog from "@/data/routeCatalog.json";
import {
  betaExperienceAreas,
  betaExperienceStatusCopy,
  type BetaExperienceArea,
  type BetaExperienceCategory,
  type BetaExperienceStatus,
} from "@/data/betaExperienceAreas";

const categoryOptions: readonly {
  id: "all" | BetaExperienceCategory;
  label: string;
}[] = [
  { id: "all", label: "All areas" },
  { id: "connect", label: "Connect" },
  { id: "create", label: "Create" },
  { id: "learn", label: "Learn" },
  { id: "play", label: "Play" },
  { id: "money", label: "Money & commerce" },
  { id: "work", label: "Work & operations" },
  { id: "impact", label: "Impact" },
] as const;

const iconByArea: Record<string, LucideIcon> = {
  social: Users,
  "chat-calls": MessageCircleMore,
  gaming: Gamepad2,
  hopeai: Bot,
  "wallet-web3": WalletCards,
  marketplace: ShoppingBag,
  "school-language": GraduationCap,
  live: Radio,
  dating: HeartHandshake,
  global: Globe2,
  creator: Video,
  enterprise: BriefcaseBusiness,
  investor: Landmark,
  impact: HeartHandshake,
  "trust-safety": ShieldCheck,
  analytics: BarChart3,
};

const accentByArea: Record<string, string> = {
  social: "from-sky-400/25 to-cyan-400/5 border-sky-300/20",
  "chat-calls": "from-violet-400/25 to-fuchsia-400/5 border-violet-300/20",
  gaming: "from-emerald-400/25 to-lime-400/5 border-emerald-300/20",
  hopeai: "from-fuchsia-400/25 to-pink-400/5 border-fuchsia-300/20",
  "wallet-web3": "from-amber-400/25 to-yellow-400/5 border-amber-300/20",
  marketplace: "from-orange-400/25 to-rose-400/5 border-orange-300/20",
  "school-language": "from-indigo-400/25 to-blue-400/5 border-indigo-300/20",
  live: "from-rose-400/25 to-red-400/5 border-rose-300/20",
  dating: "from-pink-400/25 to-rose-400/5 border-pink-300/20",
  global: "from-cyan-400/25 to-blue-400/5 border-cyan-300/20",
  creator: "from-purple-400/25 to-violet-400/5 border-purple-300/20",
  enterprise: "from-slate-300/20 to-blue-400/5 border-slate-300/15",
  investor: "from-yellow-300/20 to-amber-400/5 border-yellow-300/15",
  impact: "from-teal-400/25 to-emerald-400/5 border-teal-300/20",
  "trust-safety": "from-blue-400/20 to-slate-400/5 border-blue-300/15",
  analytics: "from-cyan-300/20 to-violet-400/5 border-cyan-300/15",
};

const statusClasses: Record<BetaExperienceStatus, string> = {
  core_beta: "border-emerald-300/25 bg-emerald-300/[0.08] text-emerald-100",
  controlled_beta: "border-amber-300/25 bg-amber-300/[0.08] text-amber-100",
  preview: "border-slate-300/20 bg-slate-300/[0.06] text-slate-200",
};

const featuredIds = new Set([
  "social",
  "chat-calls",
  "gaming",
  "hopeai",
  "marketplace",
  "school-language",
]);

function AreaIcon({ area, className = "h-5 w-5" }: { area: BetaExperienceArea; className?: string }) {
  const Icon = iconByArea[area.id] ?? Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}

function StatusPill({ status }: { status: BetaExperienceStatus }) {
  const copy = betaExperienceStatusCopy[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${statusClasses[status]}`}
      title={copy.detail}
    >
      {copy.label}
    </span>
  );
}

function AreaCard({ area }: { area: BetaExperienceArea }) {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-gradient-to-br ${accentByArea[area.id] ?? "from-white/10 to-white/[0.02] border-white/10"}`}
    >
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-black/25 text-white shadow-inner">
            <AreaIcon area={area} />
          </span>
          <StatusPill status={area.status} />
        </div>

        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
          {area.eyebrow}
        </p>
        <h2 className="mt-2 text-xl font-black tracking-tight text-white">
          {area.name}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-white/58">
          {area.description}
        </p>

        <div className="mt-5 space-y-2">
          {area.highlights.map(item => (
            <Link
              key={item.route}
              href={item.route}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-black/15 px-3.5 py-3 transition hover:border-white/15 hover:bg-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white/85">
                  {item.label}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-white/38">
                  {item.note}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-white/25" />
            </Link>
          ))}
        </div>

        <Link
          href={area.route}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#050510] transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
        >
          {area.action}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export default function PlatformMap() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | BetaExperienceCategory>("all");

  const normalizedQuery = query.trim().toLowerCase();
  const registeredRouteCount = routeCatalog.routes.length;
  const coreCount = betaExperienceAreas.filter(area => area.status === "core_beta").length;
  const controlledCount = betaExperienceAreas.filter(
    area => area.status === "controlled_beta"
  ).length;

  const filteredAreas = useMemo(() => {
    return betaExperienceAreas.filter(area => {
      const categoryMatch = category === "all" || area.category === category;
      if (!categoryMatch) return false;
      if (!normalizedQuery) return true;

      const searchText = [
        area.name,
        area.eyebrow,
        area.description,
        ...area.searchTerms,
        ...area.highlights.flatMap(item => [item.label, item.note]),
      ]
        .join(" ")
        .toLowerCase();

      return searchText.includes(normalizedQuery);
    });
  }, [category, normalizedQuery]);

  const featuredAreas = betaExperienceAreas.filter(area => featuredIds.has(area.id));

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.14),transparent_30%),linear-gradient(145deg,#0b1022,#070711_60%)] p-6 shadow-2xl shadow-black/25 sm:p-9 lg:p-11">
          <div className="absolute right-6 top-6 hidden rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/45 sm:block">
            V6 area experience
          </div>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/[0.07] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-sky-100/80">
              <Globe2 className="h-3.5 w-3.5" />
              Explore SKYCOIN4444
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
              One ecosystem. Clear places to start.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/58 sm:text-lg">
              The beta has a large screen library, but testers should not have to
              understand the repository to use the product. Start with a real area,
              follow a focused flow, and use the deeper route library only when you
              need it.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-2xl font-black">{betaExperienceAreas.length}</p>
              <p className="mt-1 text-xs text-white/40">user-facing beta areas</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-2xl font-black">{registeredRouteCount.toLocaleString()}</p>
              <p className="mt-1 text-xs text-white/40">registered routes underneath</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-2xl font-black">{coreCount} + {controlledCount}</p>
              <p className="mt-1 text-xs text-white/40">core + controlled beta areas</p>
            </div>
          </div>
        </section>

        <section className="mt-7 rounded-3xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative block min-w-0 flex-1">
              <span className="sr-only">Search platform areas</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search chat, gaming, wallet, school, creators…"
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-11 text-sm text-white outline-none placeholder:text-white/28 focus:border-sky-300/35 focus:ring-2 focus:ring-sky-300/10"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-white/35 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </label>

            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:max-w-[58%]">
              {categoryOptions.map(option => {
                const active = category === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setCategory(option.id)}
                    className={
                      "shrink-0 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition " +
                      (active
                        ? "border-sky-300/30 bg-sky-300/10 text-sky-100"
                        : "border-white/[0.08] bg-black/10 text-white/45 hover:border-white/15 hover:text-white/75")
                    }
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {!query && category === "all" ? (
          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-200/55">
                  Recommended starting points
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  Start with what you came here to do
                </h2>
              </div>
              <Link
                href="/beta-workspace"
                className="inline-flex items-center gap-2 text-sm font-bold text-sky-200/80 hover:text-sky-100"
              >
                Open beta workspace <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {featuredAreas.map(area => (
                <Link
                  key={area.id}
                  href={area.route}
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/[0.06] text-white/80">
                    <AreaIcon area={area} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-white">{area.name}</span>
                    <span className="mt-1 block truncate text-xs text-white/38">{area.eyebrow}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-white/20 transition group-hover:translate-x-0.5 group-hover:text-sky-200" />
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/32">
                Ecosystem directory
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                {filteredAreas.length === betaExperienceAreas.length
                  ? "All beta areas"
                  : `${filteredAreas.length} matching area${filteredAreas.length === 1 ? "" : "s"}`}
              </h2>
            </div>
            <Link
              href="/beta-catalog"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2.5 text-xs font-bold text-white/60 transition hover:bg-white/[0.07] hover:text-white"
            >
              <ShieldCheck className="h-4 w-4" />
              Engineering readiness catalog
            </Link>
          </div>

          {filteredAreas.length ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredAreas.map(area => (
                <AreaCard key={area.id} area={area} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-14 text-center">
              <Search className="mx-auto h-7 w-7 text-white/20" />
              <h3 className="mt-4 text-lg font-black">No area matches that search.</h3>
              <p className="mt-2 text-sm text-white/40">
                Try a capability such as chat, games, wallet, school, live, AI, or shopping.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
                className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-[#050510]"
              >
                Show every area
              </button>
            </div>
          )}
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-amber-300/15 bg-amber-300/[0.045] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <CircleDollarSign className="mt-0.5 h-5 w-5 shrink-0 text-amber-200/75" />
              <div>
                <h2 className="font-black text-amber-50">Beta boundary is part of the product.</h2>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Wallet, Web3, commerce, investor, AI, and other provider-dependent areas may expose test interfaces without enabling live custody, settlement, blockchain execution, identity verification, regulated activity, or production provider guarantees. The readiness catalog remains the engineering source for those gates.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <Accessibility className="mt-0.5 h-5 w-5 shrink-0 text-sky-200/70" />
              <div>
                <h2 className="font-black">Need another way in?</h2>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  Use global Search in the top navigation for the full route library, or open accessibility preferences for display and interaction controls.
                </p>
                <Link
                  href="/accessibility-settings"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-sky-200/80 hover:text-sky-100"
                >
                  Accessibility settings <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
