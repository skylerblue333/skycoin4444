import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import SkyHopeAccountImpactPanel from "@/components/SkyHopeAccountImpactPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SKYHOPE_CAUSE_TRACKS,
  SKYHOPE_DRAFT_KEY,
  createSkyHopeCampaignPlan,
  createVolunteerCapacityPlan,
  impactEvidenceLabels,
  normalizeSkyHopeCampaignDraft,
  scoreImpactReadiness,
  type ImpactEvidenceState,
  type SkyHopeCampaignDraft,
  type SkyHopeCampaignPlan,
} from "@/lib/skyHopeImpact";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  Gamepad2,
  HandHeart,
  HeartHandshake,
  MessageCircle,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

const DEFAULT_DRAFT: SkyHopeCampaignDraft = {
  title: "Community support sprint",
  mission:
    "Coordinate one bounded community-support effort with clear consent, evidence, and follow-up.",
  beneficiaryScope: "People who voluntarily opt into the local support effort",
  targetOutcome: "Completed support actions with a documented outcome check",
  targetCount: 25,
  durationDays: 30,
};

const DEFAULT_EVIDENCE: ImpactEvidenceState = {
  needDefined: true,
  baselineCaptured: false,
  consentPlanned: false,
  metricDefined: false,
  updateCadenceDefined: false,
  privacyReviewed: false,
};

function loadDraft(): SkyHopeCampaignDraft {
  if (typeof window === "undefined") return DEFAULT_DRAFT;
  try {
    const raw = window.localStorage.getItem(SKYHOPE_DRAFT_KEY);
    if (!raw) return DEFAULT_DRAFT;
    return normalizeSkyHopeCampaignDraft(JSON.parse(raw)) ?? DEFAULT_DRAFT;
  } catch {
    return DEFAULT_DRAFT;
  }
}

const ecosystemPaths = [
  {
    title: "Plan with HopeAI",
    description: "Turn a cause goal into a bounded brief, checklist, or outreach draft.",
    href: "/hope-a-i",
    icon: Brain,
  },
  {
    title: "Learn with SkySchool",
    description: "Build skills and durable learning evidence before leading a project.",
    href: "/sky-school",
    icon: BookOpen,
  },
  {
    title: "Coordinate in Social",
    description: "Share updates and organize community discussion on the persisted social feed.",
    href: "/activity-feed",
    icon: MessageCircle,
  },
  {
    title: "Use Impact Play",
    description: "Run game-only awareness and learning loops without real-money wagering.",
    href: "/gaming",
    icon: Gamepad2,
  },
] as const;

const financeGates = [
  "Verified beneficiary or organization evidence",
  "Approved external payment/donation provider",
  "Legal review for the intended region and flow",
  "Allowed region and required user eligibility checks",
  "Provider receipt / settlement evidence and reconciliation",
] as const;

export default function Charity() {
  const [draft, setDraft] = useState<SkyHopeCampaignDraft>(() => loadDraft());
  const [plan, setPlan] = useState<SkyHopeCampaignPlan | null>(null);
  const [planError, setPlanError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [evidence, setEvidence] =
    useState<ImpactEvidenceState>(DEFAULT_EVIDENCE);
  const [volunteerCount, setVolunteerCount] = useState(8);
  const [hoursPerWeek, setHoursPerWeek] = useState(2);
  const [weeks, setWeeks] = useState(6);

  const readiness = useMemo(() => scoreImpactReadiness(evidence), [evidence]);

  const volunteerPlan = useMemo(() => {
    try {
      return createVolunteerCapacityPlan({
        volunteerCount,
        hoursPerVolunteerPerWeek: hoursPerWeek,
        weeks,
      });
    } catch {
      return null;
    }
  }, [hoursPerWeek, volunteerCount, weeks]);

  function buildPlan() {
    setPlanError("");
    try {
      setPlan(createSkyHopeCampaignPlan(draft));
    } catch (error) {
      setPlan(null);
      setPlanError(
        error instanceof Error ? error.message : "Campaign plan is invalid."
      );
    }
  }

  function saveDraft() {
    try {
      window.localStorage.setItem(SKYHOPE_DRAFT_KEY, JSON.stringify(draft));
      setSavedMessage("Draft saved on this device.");
    } catch {
      setSavedMessage("Browser storage is unavailable; keep a copy manually.");
    }
  }

  return (
    <main className="min-h-screen bg-[#07090f] text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,.13),transparent_36%),radial-gradient(circle_at_top_left,rgba(59,130,246,.11),transparent_32%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-rose-400/30 bg-rose-400/10 text-rose-200">
              <HeartHandshake className="mr-1 h-3.5 w-3.5" />
              HopeAI · Impact
            </Badge>
            <Badge
              variant="outline"
              className="border-amber-400/30 text-amber-200"
            >
              Engineering beta
            </Badge>
            <Badge
              variant="outline"
              className="border-white/15 text-white/60"
            >
              No live donations or custody
            </Badge>
          </div>

          <div className="mt-6 max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-rose-300">
              Impact workspace
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
              Plan help. Measure impact.{" "}
              <span className="text-rose-300">Do not fake the evidence.</span>
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/60 md:text-lg">
              HopeAI includes an Impact workspace for useful planning, volunteer capacity, impact\n              evidence, and cross-ecosystem coordination. It does not pretend a\n              charity is verified, that money moved, or that a blockchain\n              transaction settled.
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {ecosystemPaths.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-rose-300/30 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <item.icon className="h-5 w-5 text-rose-300" />
                  <ArrowRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70" />
                </div>
                <h2 className="mt-4 font-black">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
        <SkyHopeAccountImpactPanel />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <Tabs defaultValue="causes">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-white/[0.04] p-1">
            <TabsTrigger value="causes">Cause tracks</TabsTrigger>
            <TabsTrigger value="planner">Campaign planner</TabsTrigger>
            <TabsTrigger value="volunteer">Volunteer capacity</TabsTrigger>
            <TabsTrigger value="evidence">Impact evidence</TabsTrigger>
            <TabsTrigger value="finance">Finance boundary</TabsTrigger>
          </TabsList>

          <TabsContent value="causes" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {SKYHOPE_CAUSE_TRACKS.map(track => (
                <article
                  key={track.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-rose-300" />
                    <h2 className="font-black">{track.label}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {track.description}
                  </p>
                  <Link
                    href={track.nextHref}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-rose-200 hover:text-rose-100"
                  >
                    {track.nextLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Link
                href="/fundraiser-tools"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold hover:border-white/20"
              >
                Fundraiser tools <ArrowRight className="ml-1 inline h-4 w-4" />
              </Link>
              <Link
                href="/impact-metrics"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold hover:border-white/20"
              >
                Impact metrics <ArrowRight className="ml-1 inline h-4 w-4" />
              </Link>
              <Link
                href="/gaming-for-charity"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold hover:border-white/20"
              >
                Impact Play Lab <ArrowRight className="ml-1 inline h-4 w-4" />
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="planner" className="mt-6">
            <div className="grid gap-6 xl:grid-cols-[1fr_.9fr]">
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-rose-300" />
                  <h2 className="text-xl font-black">
                    Deterministic campaign brief
                  </h2>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Build a bounded local plan. This does not publish a campaign
                  or collect money.
                </p>

                <div className="mt-5 grid gap-4">
                  <label className="text-sm font-semibold">
                    Title
                    <Input
                      value={draft.title}
                      onChange={event =>
                        setDraft(current => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      className="mt-2"
                    />
                  </label>

                  <label className="text-sm font-semibold">
                    Mission
                    <textarea
                      value={draft.mission}
                      onChange={event =>
                        setDraft(current => ({
                          ...current,
                          mission: event.target.value,
                        }))
                      }
                      className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-rose-300/40"
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="text-sm font-semibold">
                      Beneficiary scope
                      <Input
                        value={draft.beneficiaryScope}
                        onChange={event =>
                          setDraft(current => ({
                            ...current,
                            beneficiaryScope: event.target.value,
                          }))
                        }
                        className="mt-2"
                      />
                    </label>
                    <label className="text-sm font-semibold">
                      Measured outcome
                      <Input
                        value={draft.targetOutcome}
                        onChange={event =>
                          setDraft(current => ({
                            ...current,
                            targetOutcome: event.target.value,
                          }))
                        }
                        className="mt-2"
                      />
                    </label>
                    <label className="text-sm font-semibold">
                      Target count
                      <Input
                        type="number"
                        min={1}
                        max={1000000}
                        value={draft.targetCount}
                        onChange={event =>
                          setDraft(current => ({
                            ...current,
                            targetCount: Number(event.target.value),
                          }))
                        }
                        className="mt-2"
                      />
                    </label>
                    <label className="text-sm font-semibold">
                      Duration (days)
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        value={draft.durationDays}
                        onChange={event =>
                          setDraft(current => ({
                            ...current,
                            durationDays: Number(event.target.value),
                          }))
                        }
                        className="mt-2"
                      />
                    </label>
                  </div>

                  {planError ? (
                    <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
                      {planError}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={buildPlan}>
                      <ClipboardCheck className="mr-2 h-4 w-4" />
                      Build plan
                    </Button>
                    <Button variant="outline" onClick={saveDraft}>
                      <Save className="mr-2 h-4 w-4" />
                      Save on this device
                    </Button>
                  </div>
                  {savedMessage ? (
                    <p className="text-xs text-white/45">{savedMessage}</p>
                  ) : null}
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-xl font-black">Milestone evidence</h2>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Each checkpoint asks for evidence instead of inventing
                  progress.
                </p>
                {plan ? (
                  <div className="mt-5 space-y-3">
                    {plan.milestones.map(milestone => (
                      <div
                        key={milestone.id}
                        className="rounded-xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-bold">{milestone.label}</p>
                          <Badge variant="outline">
                            Day {milestone.targetDay}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/50">
                          {milestone.evidencePrompt}
                        </p>
                      </div>
                    ))}
                    <p className="text-xs text-white/35">
                      Provenance: {plan.provenance}
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border border-dashed border-white/15 p-6 text-sm leading-6 text-white/45">
                    Build a plan to generate deterministic evidence checkpoints.
                  </div>
                )}
              </section>
            </div>
          </TabsContent>

          <TabsContent value="volunteer" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]">
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-rose-300" />
                  <h2 className="text-xl font-black">
                    Volunteer capacity planner
                  </h2>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Estimate available volunteer hours only. It does not schedule
                  people, verify attendance, or claim completed service.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <label className="text-sm font-semibold">
                    Volunteers
                    <Input
                      type="number"
                      min={1}
                      value={volunteerCount}
                      onChange={event =>
                        setVolunteerCount(Number(event.target.value))
                      }
                      className="mt-2"
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    Hours / week
                    <Input
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={hoursPerWeek}
                      onChange={event =>
                        setHoursPerWeek(Number(event.target.value))
                      }
                      className="mt-2"
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    Weeks
                    <Input
                      type="number"
                      min={1}
                      value={weeks}
                      onChange={event => setWeeks(Number(event.target.value))}
                      className="mt-2"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-200">
                  Planned capacity
                </p>
                <p className="mt-3 text-5xl font-black">
                  {volunteerPlan
                    ? volunteerPlan.totalCapacityHours.toLocaleString()
                    : "—"}
                </p>
                <p className="mt-1 text-sm text-white/50">volunteer-hours</p>
                <p className="mt-5 text-xs leading-5 text-white/40">
                  Capacity is a planning number, not evidence that volunteer
                  work happened. Completion belongs in tester/organizer evidence.
                </p>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="evidence" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-rose-300" />
                  <h2 className="text-xl font-black">Readiness score</h2>
                </div>
                <div className="mt-6 flex items-end gap-3">
                  <span className="text-5xl font-black">{readiness.score}%</span>
                  <span className="pb-1 text-sm text-white/45">
                    {readiness.readyCount}/{readiness.totalCount} evidence gates
                  </span>
                </div>
                <Progress value={readiness.score} className="mt-4" />
                <p className="mt-4 text-xs leading-5 text-white/40">
                  This score measures whether the impact-evidence plan is
                  prepared. It does not score the social value of a cause or
                  certify outcomes.
                </p>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-xl font-black">Evidence checklist</h2>
                <div className="mt-4 space-y-2">
                  {impactEvidenceLabels.map(item => {
                    const checked = evidence[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          setEvidence(current => ({
                            ...current,
                            [item.key]: !current[item.key],
                          }))
                        }
                        className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-left transition hover:border-white/20"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
                        ) : (
                          <span className="h-5 w-5 shrink-0 rounded-full border border-white/25" />
                        )}
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="finance" className="mt-6">
            <section className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-200" />
                <h2 className="text-xl font-black">
                  Real-value execution is gated
                </h2>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
                The old Charity page implied real token donations, DAO fund
                allocation, on-chain verification, and donor payouts. Those
                claims are removed. Before any future real donation flow can be
                described as executable, every gate below needs provider-backed
                evidence.
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {financeGates.map(gate => (
                  <div
                    key={gate}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <div>
                      <p className="text-sm font-bold">{gate}</p>
                      <p className="mt-1 text-xs text-white/35">
                        Required before execution
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/hope-a-i"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-black text-black"
                >
                  <Sparkles className="h-4 w-4" />
                  Draft a charity plan with HopeAI
                </Link>
                <Link
                  href="/gaming-for-charity"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-bold text-white"
                >
                  <HandHeart className="h-4 w-4" />
                  Open Impact Play Lab
                </Link>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
