import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  Boxes,
  CheckCircle2,
  Circle,
  Gamepad2,
  GraduationCap,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "wouter";
import routeCatalog from "@/data/routeCatalog.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  V3_JOURNEY_PROGRESS_KEY,
  getNextV3JourneyStage,
  getV3JourneyCompletionPercent,
  normalizeV3JourneyProgress,
  type V3JourneyId,
  type V3JourneyProgress,
} from "@/lib/v3Journeys";
import {
  V4_TEST_SESSION_KEY,
  getV4Flagship,
  getV4Journey,
  getV4Mission,
  getV4MissionProgress,
  normalizeV4TestSession,
  setV4FlagshipComplete,
  setV4Mission,
  v4Flagships,
  v4Missions,
  type V4TestSession,
} from "@/lib/v4Beta";

const flagshipIcons: Record<V3JourneyId, typeof Activity> = {
  social: Activity,
  gaming: Gamepad2,
  live: Radio,
  commerce: ShoppingBag,
  learning: GraduationCap,
  ai: Bot,
  web3: Boxes,
};

function readJson(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}

function persistJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // V4 remains navigable when local storage is unavailable.
  }
}

export default function V4Beta() {
  const [session, setSession] = useState<V4TestSession>(() =>
    normalizeV4TestSession(null)
  );
  const [journeyProgress, setJourneyProgress] = useState<V3JourneyProgress>({});

  useEffect(() => {
    setSession(normalizeV4TestSession(readJson(V4_TEST_SESSION_KEY)));
    setJourneyProgress(
      normalizeV3JourneyProgress(readJson(V3_JOURNEY_PROGRESS_KEY))
    );
  }, []);

  useEffect(() => {
    persistJson(V4_TEST_SESSION_KEY, session);
  }, [session]);

  const mission = getV4Mission(session.missionId);
  const missionProgress = getV4MissionProgress(session);
  const nextFlagship = missionProgress.nextFlagshipId
    ? getV4Flagship(missionProgress.nextFlagshipId)
    : null;

  const stageCount = useMemo(
    () =>
      v4Flagships.reduce(
        (total, flagship) => total + getV4Journey(flagship.id).stages.length,
        0
      ),
    []
  );

  const completedChecklistCount = v4Flagships.filter(
    flagship => getV3JourneyCompletionPercent(journeyProgress, flagship.id) === 100
  ).length;

  function chooseMission(missionId: V4TestSession["missionId"]) {
    setSession(current => setV4Mission(current, missionId));
  }

  function toggleFlagshipPass(flagshipId: V3JourneyId) {
    const journeyPercent = getV3JourneyCompletionPercent(
      journeyProgress,
      flagshipId
    );
    if (journeyPercent < 100) return;
    const complete = session.completedFlagships.includes(flagshipId);
    setSession(current =>
      setV4FlagshipComplete(current, flagshipId, !complete)
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#04040d] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-[-12rem] h-[36rem] w-[36rem] rounded-full bg-cyan-500/12 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-[34rem] w-[34rem] rounded-full bg-violet-600/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
        <header className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-cyan-400/15 text-cyan-100">
                V4 engineering beta
              </Badge>
              <Badge
                variant="outline"
                className="border-violet-300/20 text-violet-100/75"
              >
                7 flagship loops · {stageCount} guided stages
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                {routeCatalog.routes.length.toLocaleString()} indexed routes behind the command center
              </Badge>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Stop counting screens. Ship complete loops.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55 sm:text-base">
              V4 is the product-integration layer for SKYCOIN4444. It deliberately
              compresses the wider route portfolio into seven flagship experiences
              that already have meaningful implementation, tests, and explicit
              limitations. Use the command center to choose a mission, finish the
              underlying six-stage test evidence, and then record a local tester pass.
            </p>
          </div>

          <Card className="border-amber-300/25 bg-amber-300/[0.045] text-white">
            <CardContent className="flex gap-3 p-5">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-amber-200" />
              <div>
                <strong className="text-amber-100">
                  V4 is not a production certification
                </strong>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  The checklist is tester-confirmed browser-local state. It does not
                  prove uptime, scale, security certification, payment capability,
                  custody, provider availability, regulatory approval, or deployment.
                </p>
              </div>
            </CardContent>
          </Card>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Flagship loops", v4Flagships.length],
            ["Guided stages", stageCount],
            ["Stage checklists at 100%", completedChecklistCount],
            ["Current mission", mission.name],
          ].map(([label, value]) => (
            <Card key={String(label)} className="border-white/10 bg-white/[0.03] text-white">
              <CardContent className="p-5">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/30">
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100/50">
                Mission mode
              </p>
              <h2 className="mt-2 text-2xl font-black">Pick the outcome, not the page.</h2>
            </div>
            <span className="text-xs text-white/35">
              Mission selection and tester passes stay in this browser only.
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {v4Missions.map(item => {
              const active = item.id === session.missionId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseMission(item.id)}
                  aria-pressed={active}
                  className={
                    "rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 " +
                    (active
                      ? "border-cyan-300/35 bg-cyan-300/[0.08]"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20")
                  }
                >
                  <Target className={"h-5 w-5 " + (active ? "text-cyan-200" : "text-white/25")} />
                  <strong className="mt-3 block text-sm">{item.name}</strong>
                  <span className="mt-2 block text-xs leading-5 text-white/40">
                    {item.description}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <Card className="overflow-hidden border-cyan-300/20 bg-gradient-to-br from-cyan-300/[0.07] via-white/[0.025] to-violet-300/[0.06] text-white">
            <CardHeader className="border-b border-white/[0.07]">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100/55">
                    Active V4 mission
                  </p>
                  <CardTitle className="mt-2 text-3xl text-white">
                    {mission.name}
                  </CardTitle>
                  <CardDescription className="mt-2 max-w-3xl text-white/45">
                    {mission.description}
                  </CardDescription>
                </div>
                {nextFlagship ? (
                  <Link href={nextFlagship.entryRoute}>
                    <Button size="lg">
                      Continue with {nextFlagship.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/beta-feedback?route=%2Fv4-beta">
                    <Button size="lg" variant="outline">
                      Mission tested · report findings
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-100">
                  Tester pass progress
                </span>
                <span className="text-white/45">
                  {missionProgress.completedCount}/{missionProgress.totalCount} flagships
                </span>
              </div>
              <Progress value={missionProgress.percent} className="h-2" />
              <div className="grid gap-3 md:grid-cols-2">
                {mission.flagshipIds.map(flagshipId => {
                  const flagship = getV4Flagship(flagshipId);
                  const journeyPercent = getV3JourneyCompletionPercent(
                    journeyProgress,
                    flagshipId
                  );
                  const passed = session.completedFlagships.includes(flagshipId);
                  const eligible = journeyPercent === 100;
                  return (
                    <div
                      key={flagshipId}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-4"
                    >
                      <button
                        type="button"
                        disabled={!eligible}
                        onClick={() => toggleFlagshipPass(flagshipId)}
                        aria-label={
                          eligible
                            ? `${passed ? "Remove" : "Record"} tester pass for ${flagship.name}`
                            : `${flagship.name} tester pass requires all six journey stages`
                        }
                        className="disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        {passed ? (
                          <CheckCircle2 className="h-6 w-6 text-emerald-200" />
                        ) : (
                          <Circle className="h-6 w-6 text-white/35" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <strong className="block truncate text-sm">{flagship.name}</strong>
                        <span className="text-xs text-white/35">
                          underlying journey checklist {journeyPercent}%
                          {eligible ? " · eligible for tester pass" : " · finish stages first"}
                        </span>
                      </div>
                      <Link
                        href={flagship.entryRoute}
                        className="text-xs font-semibold text-cyan-200 hover:text-white"
                      >
                        Open
                      </Link>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-100/45">
              Seven flagships
            </p>
            <h2 className="mt-2 text-2xl font-black">
              What V4 can actually prove today
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {v4Flagships.map(flagship => {
              const Icon = flagshipIcons[flagship.id];
              const journey = getV4Journey(flagship.id);
              const percent = getV3JourneyCompletionPercent(
                journeyProgress,
                flagship.id
              );
              const nextStage = getNextV3JourneyStage(
                journeyProgress,
                flagship.id
              );
              const passed = session.completedFlagships.includes(flagship.id);

              return (
                <Card
                  key={flagship.id}
                  className="border-white/10 bg-white/[0.03] text-white"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/[0.06] text-cyan-100">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <CardTitle className="text-xl text-white">
                            {flagship.name}
                          </CardTitle>
                          <CardDescription className="mt-1 text-white/40">
                            {flagship.evidenceLabel}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          passed
                            ? "border-emerald-300/30 text-emerald-100"
                            : "border-white/10 text-white/40"
                        }
                      >
                        {passed ? "V4 tester pass" : flagship.evidenceMode}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between text-xs text-white/35">
                        <span>{journey.stages.length}-stage journey evidence</span>
                        <span>{percent}% checked</span>
                      </div>
                      <Progress value={percent} className="mt-2 h-1.5" />
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                        Works now
                      </p>
                      <ul className="mt-3 space-y-2">
                        {flagship.worksNow.map(item => (
                          <li key={item} className="flex gap-2 text-sm leading-6 text-white/55">
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-200/70" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.035] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/55">
                        Truth boundary
                      </p>
                      <p className="mt-2 text-xs leading-5 text-white/45">
                        {flagship.boundary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link href={flagship.entryRoute}>
                        <Button size="sm">
                          Open flagship
                          <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Link href={nextStage.route}>
                        <Button size="sm" variant="outline">
                          Next evidence: {nextStage.title}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Link href="/operational-readiness">
            <Card className="h-full border-white/10 bg-white/[0.025] text-white transition hover:border-cyan-300/25">
              <CardContent className="p-5">
                <ShieldCheck className="h-5 w-5 text-cyan-200" />
                <strong className="mt-3 block">Operational readiness</strong>
                <p className="mt-2 text-xs leading-5 text-white/40">
                  Separate repository evidence from external infrastructure and production claims.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/route-health">
            <Card className="h-full border-white/10 bg-white/[0.025] text-white transition hover:border-cyan-300/25">
              <CardContent className="p-5">
                <Activity className="h-5 w-5 text-cyan-200" />
                <strong className="mt-3 block">Route health</strong>
                <p className="mt-2 text-xs leading-5 text-white/40">
                  Inspect wider screen health without pretending every indexed route is a flagship feature.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/beta-feedback?route=%2Fv4-beta">
            <Card className="h-full border-white/10 bg-white/[0.025] text-white transition hover:border-cyan-300/25">
              <CardContent className="p-5">
                <Sparkles className="h-5 w-5 text-cyan-200" />
                <strong className="mt-3 block">Close the tester loop</strong>
                <p className="mt-2 text-xs leading-5 text-white/40">
                  Record exact friction, broken evidence, or misleading boundaries with the V4 route attached.
                </p>
              </CardContent>
            </Card>
          </Link>
        </section>
      </div>
    </main>
  );
}
