import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileWarning,
  Gauge,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ECOSYSTEM_BETA_PROGRESS_KEY,
  ecosystemAreas,
  getEcosystemProgressPercent,
  normalizeEcosystemProgress,
  setEcosystemAreaComplete,
  type EcosystemProgress,
} from "@/lib/ecosystemBeta";

const sharedTools = [
  {
    name: "Community hub",
    route: "/community-hub",
    detail: "Create and join persisted communities.",
  },
  {
    name: "Account activity",
    route: "/activity-evidence",
    detail: "Inspect your own persisted product evidence.",
  },
  {
    name: "Privacy settings",
    route: "/profile",
    detail: "Review account identity and privacy controls.",
  },
  {
    name: "HopeAI lab",
    route: "/a-i-tools-hub",
    detail: "Explore the verified safe local AI sandbox.",
  },
  {
    name: "Beta feedback",
    route: "/beta-feedback",
    detail: "Report a bug, safety issue, or evidence gap.",
  },
] as const;

const gatedCapabilities = [
  "Payment processing and financial settlement",
  "Wallet custody, signing, transfers, and production-chain execution",
  "Public livestream ingest, distribution, audience, and monetization",
  "Unverified people, sellers, products, ratings, or inventory",
  "Provider-backed AI actions and unsupported external integrations",
] as const;

export default function BetaWorkspace() {
  const [progress, setProgress] = useState<EcosystemProgress>({});

  useEffect(() => {
    try {
      setProgress(
        normalizeEcosystemProgress(
          JSON.parse(localStorage.getItem(ECOSYSTEM_BETA_PROGRESS_KEY) ?? "{}")
        )
      );
    } catch {
      setProgress({});
    }
  }, []);

  const toggleArea = (areaId: (typeof ecosystemAreas)[number]["id"]) => {
    setProgress(current => {
      const next = setEcosystemAreaComplete(current, areaId, !current[areaId]);
      localStorage.setItem(ECOSYSTEM_BETA_PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const percent = getEcosystemProgressPercent(progress);

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <header className="border-b border-white/10 bg-[#050510]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-white/45 hover:text-white">
                ← Home
              </Link>
              <div className="h-4 w-px bg-white/15" />
              <h1 className="font-black tracking-tight">
                Competitive Ecosystem Beta
              </h1>
              <Badge
                variant="outline"
                className="border-amber-400/50 text-amber-200"
              >
                Tester ready
              </Badge>
            </div>
            <p className="mt-1 text-xs text-white/40">
              Connected, evidence-led product journeys with explicit boundaries
            </p>
          </div>
          <Link
            href="/beta-catalog"
            className="hidden text-sm text-amber-200 hover:text-amber-100 sm:block"
          >
            32 launchable routes →
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/70">
              One coherent test surface
            </p>
            <h2 className="mt-3 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
              Social, creator, asset, commerce, language, dating, learning, and gaming journeys.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/60">
              Competitor-inspired interaction quality, implemented only where
              evidence exists. This is not a claim of traffic, scale, custody,
              streaming delivery, or feature parity.
            </p>
          </div>
          <Card className="border-amber-400/25 bg-amber-400/[0.06] text-white">
            <CardHeader>
              <Gauge className="h-5 w-5 text-amber-200" />
              <CardTitle className="mt-2 text-amber-100">
                Your test pass
              </CardTitle>
              <CardDescription className="text-white/55">
                Progress stays in this browser. Mark an area complete only after
                its stated goal passes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <strong className="text-3xl">{percent}%</strong>
                <span className="text-xs text-white/45">
                  {ecosystemAreas.filter(area => progress[area.id]).length} of{" "}
                  {ecosystemAreas.length}
                </span>
              </div>
              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-label="Competitive beta test progress"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-amber-300 transition-all"
                  style={{ width: percent + "%" }}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Headline experiences
            </p>
            <h3 className="mt-2 text-2xl font-bold">
              Test each area against a concrete goal
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ecosystemAreas.map(area => {
              const complete = Boolean(progress[area.id]);
              return (
                <Card
                  key={area.id}
                  className="flex h-full flex-col border-white/10 bg-white/[0.03]"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <Badge
                        variant="outline"
                        className="border-sky-400/40 text-sky-200"
                      >
                        {area.status}
                      </Badge>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className={
                          complete ? "text-emerald-200" : "text-white/50"
                        }
                        onClick={() => toggleArea(area.id)}
                      >
                        {complete ? (
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                        ) : (
                          <Circle className="mr-1 h-4 w-4" />
                        )}
                        {complete ? "Tested" : "Mark tested"}
                      </Button>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-200/70">
                        {area.inspiration}
                      </p>
                      <CardTitle className="mt-1 text-white">
                        {area.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="leading-6 text-white/55">
                      {area.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-4">
                    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/35">
                        Test goal
                      </p>
                      <p className="mt-1 text-sm leading-6 text-white/70">
                        {area.testGoal}
                      </p>
                    </div>
                    <p className="text-xs leading-5 text-white/40">
                      {area.boundary}
                    </p>
                    <Link
                      href={area.route}
                      className="inline-flex items-center text-sm font-semibold text-amber-200 hover:text-amber-100"
                    >
                      Open area <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <Sparkles className="h-5 w-5 text-violet-200" />
              <CardTitle className="mt-2">Shared platform tools</CardTitle>
              <CardDescription className="text-white/50">
                Use these across the headline test journeys.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {sharedTools.map(tool => (
                <Link
                  key={tool.route}
                  href={tool.route}
                  className="rounded-lg border border-white/10 bg-black/20 p-3 hover:border-amber-300/40"
                >
                  <strong className="text-sm text-white">{tool.name}</strong>
                  <p className="mt-1 text-xs leading-5 text-white/45">
                    {tool.detail}
                  </p>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <FileWarning className="h-5 w-5 text-amber-200" />
              <CardTitle className="mt-2">Intentionally unavailable</CardTitle>
              <CardDescription className="text-white/50">
                A page, fixture, or local draft does not prove these
                capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {gatedCapabilities.map(item => (
                <div
                  key={item}
                  className="flex gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white/60"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
          <div className="flex items-start gap-3">
            <Activity className="mt-1 h-5 w-5 text-emerald-200" />
            <div>
              <h3 className="font-bold text-emerald-100">
                Recommended test loop
              </h3>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-white/60">
                Create an account, publish social activity, test creator
                devices, inspect the asset boundary, build a fixture cart,
                generate a language plan, save an adult dating-profile draft,
                complete a learning step, play deterministic arcade games, then
                submit feedback. Refresh after each save to verify the
                documented persistence model.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
