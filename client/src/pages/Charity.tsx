import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Copy,
  Gamepad2,
  HandHeart,
  Heart,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  createImpactMission,
  IMPACT_MISSION_STORAGE_KEY,
  isImpactMission,
  type ImpactCause,
  type ImpactMission,
} from "@/lib/impactMission";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const causeOptions: ReadonlyArray<{
  id: ImpactCause;
  label: string;
  detail: string;
}> = [
  {
    id: "education",
    label: "Education",
    detail: "Learning access, skills, mentoring, or study support.",
  },
  {
    id: "community",
    label: "Community",
    detail: "Local service, mutual support, volunteering, or civic help.",
  },
  {
    id: "relief",
    label: "Relief",
    detail: "Food, shelter, emergency support, or recovery planning.",
  },
  {
    id: "environment",
    label: "Environment",
    detail: "Water, cleanup, parks, nature, or sustainability work.",
  },
];

const launchCards = [
  {
    title: "HopeAI",
    detail: "Turn an idea into a short deterministic action sprint.",
    href: "/hope-a-i",
    icon: Sparkles,
  },
  {
    title: "SkySchool",
    detail: "Learn the problem before claiming a solution.",
    href: "/sky-school",
    icon: BookOpen,
  },
  {
    title: "Impact Play Lab",
    detail: "Use no-value games as practice, not as fake donations.",
    href: "/gaming-for-charity",
    icon: Gamepad2,
  },
  {
    title: "Social progress",
    detail: "Share only what actually happened and what is still unknown.",
    href: "/activity-feed",
    icon: Users,
  },
] as const;

export default function Charity() {
  const { user, isAuthenticated } = useAuth();
  const activity = trpc.activityEvidence.list.useQuery(undefined, {
    enabled: Boolean(user),
    retry: false,
  });
  const [goal, setGoal] = useState("");
  const [cause, setCause] = useState<ImpactCause>("community");
  const [mission, setMission] = useState<ImpactMission | null>(null);
  const [copied, setCopied] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(IMPACT_MISSION_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as unknown;
      if (isImpactMission(parsed)) {
        setMission(parsed);
        setGoal(parsed.goal);
        setCause(parsed.cause);
      } else {
        localStorage.removeItem(IMPACT_MISSION_STORAGE_KEY);
      }
    } catch {
      setStorageMessage(
        "Saved mission state could not be loaded. You can still build a new mission in this tab."
      );
    }
  }, []);

  const evidence = useMemo(() => {
    const events = activity.data ?? [];
    return {
      lessons: events.filter(event => event.type === "lesson_completed").length,
      posts: events.filter(event => event.type === "post_created").length,
      feedback: events.filter(event => event.type === "feedback_submitted").length,
    };
  }, [activity.data]);

  function persistMission(next: ImpactMission) {
    setMission(next);
    setCopied(false);
    try {
      localStorage.setItem(IMPACT_MISSION_STORAGE_KEY, JSON.stringify(next));
      setStorageMessage(
        "Mission saved on this device. This is local continuity, not a donation record."
      );
    } catch {
      setStorageMessage(
        "Browser storage is unavailable. The mission will remain usable until this page is closed."
      );
    }
  }

  function buildMission() {
    persistMission(createImpactMission({ goal, cause }));
  }

  function clearMission() {
    setMission(null);
    setGoal("");
    setCause("community");
    setCopied(false);
    setStorageMessage("");
    try {
      localStorage.removeItem(IMPACT_MISSION_STORAGE_KEY);
    } catch {
      // There may be nothing to clear in a storage-restricted context.
    }
  }

  async function copyShareText() {
    if (!mission) return;
    try {
      await navigator.clipboard.writeText(mission.shareText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-[-8rem] h-[32rem] w-[32rem] rounded-full bg-emerald-600/15 blur-3xl" />
        <div className="absolute right-[-10rem] top-52 h-[30rem] w-[30rem] rounded-full bg-violet-600/14 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-10">
        <header className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-100">
                SkyHope
              </Badge>
              <Badge
                variant="outline"
                className="border-emerald-300/20 text-emerald-100"
              >
                Impact Mission Center
              </Badge>
              <Badge
                variant="outline"
                className="border-amber-300/20 text-amber-100"
              >
                No live donations
              </Badge>
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
              Turn good intentions into actions you can actually prove.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/50">
              SkyHope is now an impact planning and evidence workspace. Build one
              bounded mission, learn the problem, practice through charity-safe
              games, and share progress without inventing donation totals,
              beneficiaries, votes, or blockchain settlement.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/hope-a-i">
              <Button size="lg" className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Plan with HopeAI
              </Button>
            </Link>
            <Link href="/gaming-for-charity">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/15 bg-white/[0.03] text-white"
              >
                <Gamepad2 className="mr-2 h-4 w-4" />
                Impact Play Lab
              </Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Learning evidence",
              value: isAuthenticated
                ? activity.isLoading
                  ? "…"
                  : evidence.lessons
                : "Local",
              icon: BookOpen,
            },
            {
              label: "Social evidence",
              value: isAuthenticated
                ? activity.isLoading
                  ? "…"
                  : evidence.posts
                : "Local",
              icon: Users,
            },
            {
              label: "Feedback evidence",
              value: isAuthenticated
                ? activity.isLoading
                  ? "…"
                  : evidence.feedback
                : "Local",
              icon: CheckCircle2,
            },
            {
              label: "Mission sprint",
              value: mission ? mission.totalMinutes + "m" : "—",
              icon: Target,
            },
          ].map(({ label, value, icon: Icon }) => (
            <Card
              key={label}
              className="border-white/10 bg-white/[0.035] text-white"
            >
              <CardContent className="p-5">
                <Icon className="h-5 w-5 text-emerald-200" />
                <p className="mt-4 text-3xl font-black">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/30">
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {activity.error ? (
          <div
            role="alert"
            className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-4 text-sm text-amber-100"
          >
            Account activity evidence could not be loaded. Mission planning
            remains available without pretending account evidence was verified.
          </div>
        ) : null}

        {!isAuthenticated ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/45">
            You can build a mission without signing in. The mission is stored on
            this device only. Sign in if you want account-owned lesson, post, or
            feedback evidence to appear in the counters above.
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-white/10 bg-white/[0.035] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <HandHeart className="h-5 w-5 text-emerald-200" />
                Build an impact mission
              </CardTitle>
              <CardDescription className="text-white/45">
                Keep the goal specific enough that another person could tell
                whether the action happened.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Textarea
                value={goal}
                maxLength={360}
                onChange={event => setGoal(event.target.value)}
                placeholder="Example: help local students practice safe technology skills through one lesson and one community activity"
                className="min-h-32 border-white/10 bg-black/25 text-white placeholder:text-white/25"
              />

              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-white/30">
                  Cause
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {causeOptions.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setCause(option.id)}
                      aria-pressed={cause === option.id}
                      className={
                        "rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 " +
                        (cause === option.id
                          ? "border-emerald-300/30 bg-emerald-300/[0.08]"
                          : "border-white/[0.08] bg-black/20 hover:border-white/20")
                      }
                    >
                      <strong className="block text-sm text-white/85">
                        {option.label}
                      </strong>
                      <span className="mt-1 block text-xs leading-5 text-white/35">
                        {option.detail}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button className="flex-1" size="lg" onClick={buildMission}>
                  <Heart className="mr-2 h-4 w-4" />
                  Build mission
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={clearMission}
                  className="border-white/15 bg-white/[0.03] text-white"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              {storageMessage ? (
                <p
                  className="text-xs leading-5 text-white/35"
                  role="status"
                  aria-live="polite"
                >
                  {storageMessage}
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-emerald-300/15 bg-gradient-to-br from-emerald-300/[0.06] via-white/[0.025] to-violet-300/[0.05] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="h-5 w-5 text-emerald-200" />
                Current mission
              </CardTitle>
              <CardDescription className="text-white/45">
                {mission
                  ? mission.title + " · " + mission.totalMinutes + " focused minutes"
                  : "Build a mission to connect learning, action planning, play, and truthful social progress."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!mission ? (
                <div className="grid min-h-96 place-items-center rounded-3xl border border-dashed border-white/15 bg-black/15 p-8 text-center">
                  <div>
                    <HandHeart className="mx-auto h-11 w-11 text-white/20" />
                    <p className="mt-4 font-semibold text-white/70">
                      No impact mission yet
                    </p>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
                      A mission is a planning contract, not a donation receipt.
                      Build one on the left or ask HopeAI to create the same
                      cross-product path for you.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100/55">
                      {mission.cause}
                    </p>
                    <h2 className="mt-2 text-xl font-black">{mission.goal}</h2>
                    <p className="mt-2 text-xs text-white/30">
                      Mission ID: {mission.id}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {mission.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-300/10 text-xs font-black text-emerald-100">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <strong className="text-sm text-white/85">
                                {step.title}
                              </strong>
                              <span className="text-xs text-white/30">
                                {step.minutes} min
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-white/40">
                              {step.detail}
                            </p>
                            <p className="mt-2 text-xs text-emerald-100/50">
                              Evidence: {step.evidence}
                            </p>
                            <Link
                              href={step.href}
                              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-100/75 hover:text-emerald-50"
                            >
                              Open step
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={copyShareText}
                      className="flex-1 border-white/15 bg-white/[0.03] text-white"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copied ? "Copied truthful update" : "Copy social update"}
                    </Button>
                    <Link href="/activity-feed" className="flex-1">
                      <Button className="w-full">
                        Open Social
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {launchCards.map(card => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href}>
                <Card className="h-full border-white/10 bg-white/[0.03] text-white transition hover:border-emerald-300/20 hover:bg-white/[0.05]">
                  <CardContent className="p-5">
                    <Icon className="h-5 w-5 text-emerald-200" />
                    <h3 className="mt-4 font-black">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/40">
                      {card.detail}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-100/65">
                      Open
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </section>

        <Card className="border-amber-300/20 bg-amber-300/[0.04] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-amber-200" />
              Financial and verification boundary
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm leading-6 text-white/45 lg:grid-cols-2">
            <div>
              <strong className="text-white/80">What this beta does</strong>
              <p className="mt-2">
                It plans impact missions, stores a device-local mission, links
                learning and practice routes, and can use account-owned lesson,
                post, and feedback evidence when you are signed in.
              </p>
            </div>
            <div>
              <strong className="text-white/80">What it does not do</strong>
              <p className="mt-2">
                It does not execute donations, move money, hold custody, verify
                a beneficiary, certify nonprofit status, broadcast blockchain
                transactions, or turn game scores into redeemable value.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
