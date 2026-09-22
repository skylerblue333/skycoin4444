import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  Boxes,
  Gamepad2,
  GraduationCap,
  Heart,
  Languages,
  Radio,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  UsersRound,
  Video,
  WandSparkles,
} from "lucide-react";
import { Link } from "wouter";
import routeCatalog from "@/data/routeCatalog.json";
import {
  filterV5Platforms,
  v5Platforms,
  type V5PlatformId,
} from "@/lib/v5Platforms";

const FAVORITES_KEY = "skycoin4444:v5:favorites";
const RECENTS_KEY = "skycoin4444:v5:recents";

const platformIcons: Record<V5PlatformId, typeof Activity> = {
  social: UsersRound,
  live: Radio,
  gaming: Gamepad2,
  commerce: ShoppingBag,
  learning: GraduationCap,
  hopeai: Bot,
  web3: Boxes,
  dating: Heart,
  global: Languages,
  creator: Video,
};

const platformVisuals: Record<
  V5PlatformId,
  { glow: string; chip: string; icon: string }
> = {
  social: {
    glow: "from-sky-500/22 via-cyan-400/8 to-transparent",
    chip: "border-sky-300/20 bg-sky-300/10 text-sky-100",
    icon: "bg-sky-400/15 text-sky-100",
  },
  live: {
    glow: "from-fuchsia-500/22 via-rose-400/8 to-transparent",
    chip: "border-fuchsia-300/20 bg-fuchsia-300/10 text-fuchsia-100",
    icon: "bg-fuchsia-400/15 text-fuchsia-100",
  },
  gaming: {
    glow: "from-violet-500/22 via-indigo-400/8 to-transparent",
    chip: "border-violet-300/20 bg-violet-300/10 text-violet-100",
    icon: "bg-violet-400/15 text-violet-100",
  },
  commerce: {
    glow: "from-emerald-500/22 via-teal-400/8 to-transparent",
    chip: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
    icon: "bg-emerald-400/15 text-emerald-100",
  },
  learning: {
    glow: "from-amber-500/20 via-orange-400/8 to-transparent",
    chip: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    icon: "bg-amber-400/15 text-amber-100",
  },
  hopeai: {
    glow: "from-cyan-500/22 via-blue-400/8 to-transparent",
    chip: "border-cyan-300/20 bg-cyan-300/10 text-amber-100",
    icon: "bg-cyan-400/15 text-amber-100",
  },
  web3: {
    glow: "from-blue-500/22 via-indigo-400/8 to-transparent",
    chip: "border-blue-300/20 bg-blue-300/10 text-blue-100",
    icon: "bg-blue-400/15 text-blue-100",
  },
  dating: {
    glow: "from-rose-500/22 via-pink-400/8 to-transparent",
    chip: "border-rose-300/20 bg-rose-300/10 text-rose-100",
    icon: "bg-rose-400/15 text-rose-100",
  },
  global: {
    glow: "from-teal-500/22 via-sky-400/8 to-transparent",
    chip: "border-teal-300/20 bg-teal-300/10 text-teal-100",
    icon: "bg-teal-400/15 text-teal-100",
  },
  creator: {
    glow: "from-orange-500/22 via-fuchsia-400/8 to-transparent",
    chip: "border-orange-300/20 bg-orange-300/10 text-orange-100",
    icon: "bg-orange-400/15 text-orange-100",
  },
};

function readIds(key: string): V5PlatformId[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? "[]");
    if (!Array.isArray(raw)) return [];
    const ids = new Set(v5Platforms.map(platform => platform.id));
    return raw.filter((value): value is V5PlatformId => ids.has(value));
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: V5PlatformId[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Product navigation remains fully usable when storage is unavailable.
  }
}

export default function V5PlatformHub() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<V5PlatformId[]>([]);
  const [recents, setRecents] = useState<V5PlatformId[]>([]);

  useEffect(() => {
    setFavorites(readIds(FAVORITES_KEY));
    setRecents(readIds(RECENTS_KEY));
  }, []);

  const visiblePlatforms = useMemo(() => filterV5Platforms(query), [query]);
  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const recentPlatforms = recents
    .map(id => v5Platforms.find(platform => platform.id === id))
    .filter(Boolean)
    .slice(0, 4);

  function toggleFavorite(id: V5PlatformId) {
    setFavorites(current => {
      const next = current.includes(id)
        ? current.filter(item => item !== id)
        : [id, ...current].slice(0, 10);
      writeIds(FAVORITES_KEY, next);
      return next;
    });
  }

  function recordRecent(id: V5PlatformId) {
    setRecents(current => {
      const next = [id, ...current.filter(item => item !== id)].slice(0, 6);
      writeIds(RECENTS_KEY, next);
      return next;
    });
  }

  return (
    <main className="relative overflow-hidden bg-[#090404] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-red-500/14 blur-[110px]" />
        <div className="absolute right-[-8rem] top-20 h-[34rem] w-[34rem] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-[-12rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-red-700/8 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:pt-12">
        <section className="sky-panel sky-red-glow overflow-hidden rounded-[2rem]">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.25fr_0.75fr] lg:p-10">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-amber-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  SKYCOIN4444 V5
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/55">
                  10 flagship platforms
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/55">
                  {routeCatalog.routes.length.toLocaleString()} routes discoverable
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Ten products.
                <span className="block bg-gradient-to-r from-amber-100 via-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  One useful ecosystem.
                </span>
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/55 sm:text-base">
                V5 turns the strongest parts of SKYCOIN4444 into ten recognizable
                destinations instead of asking people to understand a thousand-page
                route catalog. Browse every public demo surface immediately, then sign
                in only when an account-owned action actually needs an identity.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/activity-feed"
                  onClick={() => recordRecent("social")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 px-5 py-3 text-sm font-black text-[#1a0b04] shadow-[0_12px_34px_-16px_rgba(245,185,66,0.9)] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  Start with Social
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/platform-map"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white/75 transition hover:border-amber-300/25 hover:bg-white/[0.08] hover:text-white"
                >
                  Explore everything
                  <Search className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {[
                ["10", "flagship platforms"],
                ["30", "direct quick actions"],
                ["0", "platform demo locks"],
                ["1", "shared ecosystem identity"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="sky-kpi rounded-2xl p-4"
                >
                  <div className="text-3xl font-black tracking-tight text-white">
                    {value}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
                    {label}
                  </div>
                </div>
              ))}
              <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.055] p-4">
                <div className="flex items-start gap-3">
                  <WandSparkles className="mt-0.5 h-5 w-5 text-emerald-200" />
                  <div>
                    <strong className="text-sm text-emerald-100">
                      Open demo, protected actions
                    </strong>
                    <p className="mt-1 text-xs leading-5 text-white/45">
                      Navigation and product demos are open. Sign-in is reserved for
                      account-owned state; external money, custody, identity, or provider
                      actions stay truthful rather than being faked.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/45">
              Flagship launcher
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Pick a platform and do something useful.
            </h2>
          </div>
          <label className="relative block w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search Social, games, learning, AI…"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.045] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-amber-300/30 focus:ring-2 focus:ring-amber-300/10"
            />
          </label>
        </section>

        {recentPlatforms.length > 0 ? (
          <section className="mt-5 flex flex-wrap items-center gap-2" aria-label="Recently opened V5 platforms">
            <span className="mr-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
              Recent
            </span>
            {recentPlatforms.map(platform =>
              platform ? (
                <Link
                  key={platform.id}
                  href={platform.route}
                  onClick={() => recordRecent(platform.id)}
                  className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-white/55 transition hover:border-white/20 hover:text-white"
                >
                  {platform.name}
                </Link>
              ) : null
            )}
          </section>
        ) : null}

        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {visiblePlatforms.map((platform, index) => {
            const Icon = platformIcons[platform.id];
            const visual = platformVisuals[platform.id];
            const favorite = favoriteSet.has(platform.id);
            return (
              <article
                key={platform.id}
                className="group relative min-h-[25rem] overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b ${visual.glow}`}
                />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`grid h-11 w-11 place-items-center rounded-2xl ${visual.icon}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black tabular-nums text-white/20">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(platform.id)}
                        aria-label={favorite ? `Remove ${platform.name} from favorites` : `Favorite ${platform.name}`}
                        aria-pressed={favorite}
                        className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/20 text-white/35 transition hover:text-amber-50"
                      >
                        <Star className={`h-3.5 w-3.5 ${favorite ? "fill-current text-amber-200" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${visual.chip}`}>
                      {platform.kicker}
                    </span>
                    <h3 className="mt-3 text-xl font-black tracking-tight">
                      {platform.name}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-white/42">
                      {platform.description}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {platform.capabilities.map(capability => (
                      <span
                        key={capability}
                        className="rounded-full border border-white/[0.08] bg-black/20 px-2 py-1 text-[10px] font-semibold text-white/38"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-white/[0.07] pt-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/22">
                      Quick actions
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {platform.quickActions.map(action => (
                        <Link
                          key={action.route}
                          href={action.route}
                          onClick={() => recordRecent(platform.id)}
                          className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-black/15 px-3 py-2 text-[11px] font-semibold text-white/48 transition hover:border-white/15 hover:bg-white/[0.04] hover:text-white"
                        >
                          {action.label}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={platform.route}
                    onClick={() => recordRecent(platform.id)}
                    className="mt-auto flex items-center justify-between pt-5 text-sm font-black text-white"
                  >
                    Open {platform.name}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        {visiblePlatforms.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-dashed border-white/12 bg-white/[0.025] p-8 text-center">
            <Search className="mx-auto h-6 w-6 text-white/25" />
            <p className="mt-3 text-sm font-bold text-white/65">No flagship matches that search.</p>
            <p className="mt-1 text-xs text-white/35">
              Try social, gaming, learning, AI, creator, dating, live, or commerce.
            </p>
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.7rem] border border-white/10 bg-gradient-to-br from-cyan-300/[0.055] via-white/[0.025] to-violet-300/[0.05] p-6">
            <div className="flex items-start gap-3">
              <Activity className="mt-1 h-5 w-5 text-cyan-200" />
              <div>
                <h3 className="text-lg font-black">One ecosystem, not ten disconnected demos</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
                  V5 treats these as product destinations under the same navigation,
                  search, route registry, visual system, and evidence model. The long
                  tail still exists, but users no longer have to understand it before
                  finding something worth doing.
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/beta-feedback"
            className="group rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-6 transition hover:border-violet-300/20 hover:bg-white/[0.05]"
          >
            <WandSparkles className="h-5 w-5 text-violet-200" />
            <h3 className="mt-4 text-lg font-black">Tell us what still feels fake or thin.</h3>
            <p className="mt-2 text-sm leading-6 text-white/40">
              V5 should improve depth, usefulness, and feel—not hide missing implementation.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-xs font-black text-violet-100">
              Open beta feedback
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}
