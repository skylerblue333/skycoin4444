import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  ClipboardCopy,
  Gamepad2,
  HandHeart,
  HeartHandshake,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  buildSkyHopeImpactPlan,
  SKYHOPE_IMPACT_BOUNDARY,
  SKYHOPE_THEME_OPTIONS,
  type SkyHopeImpactPlan,
  type SkyHopeTheme,
} from "@/lib/skyHopeImpact";

const DRAFT_KEY = "skyhope.impact.drafts.v1";

type SavedDraft = {
  savedAt: string;
  plan: SkyHopeImpactPlan;
};

const pathways = [
  {
    title: "Coach with HopeAI",
    detail:
      "Generate a careful impact brief here, then take it to HopeAI for critique and next-step planning.",
    href: "/hope-a-i",
    icon: Bot,
  },
  {
    title: "Learn the method",
    detail:
      "SkySchool now includes a responsible-giving track on needs, evidence, delivery, safeguards, and reporting.",
    href: "/sky-school",
    icon: BookOpen,
  },
  {
    title: "Practice through play",
    detail:
      "Use the Impact Play Lab to balance planning priorities with a deterministic game-only score.",
    href: "/gaming-for-charity",
    icon: Gamepad2,
  },
  {
    title: "Build with community",
    detail:
      "Discuss ideas in the social beta without presenting discussion, likes, or profiles as proof that a cause is verified.",
    href: "/activity-feed",
    icon: Users,
  },
] as const;

const launchGates = [
  "Durable campaign and beneficiary records",
  "Documented beneficiary verification process",
  "Approved payment provider with authorization and receipts",
  "Refund, dispute, reconciliation, and fraud controls",
  "Legal and regional review for every live-value flow",
  "Outcome evidence and accessible public reporting",
] as const;

function readDrafts(): SavedDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(DRAFT_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      item =>
        item &&
        typeof item.savedAt === "string" &&
        item.plan?.contract === "skyhope.impact-plan.v1",
    );
  } catch {
    return [];
  }
}

export default function Charity() {
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState<SkyHopeTheme>("education");
  const [beneficiaryGoal, setBeneficiaryGoal] = useState("50");
  const [objective, setObjective] = useState("");
  const [evidenceMetric, setEvidenceMetric] = useState("");
  const [plan, setPlan] = useState<SkyHopeImpactPlan | null>(null);
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);

  useEffect(() => {
    setDrafts(readDrafts());
  }, []);

  const boundaryRows = useMemo(
    () => [
      ["Payment execution", SKYHOPE_IMPACT_BOUNDARY.executesPayments ? "On" : "Off"],
      ["Custody", SKYHOPE_IMPACT_BOUNDARY.acceptsCustody ? "On" : "Off"],
      [
        "Beneficiary verification",
        SKYHOPE_IMPACT_BOUNDARY.verifiesBeneficiaries ? "Configured" : "Not configured",
      ],
      [
        "Blockchain writes",
        SKYHOPE_IMPACT_BOUNDARY.writesBlockchainTransactions ? "On" : "Off",
      ],
      ["Draft persistence", "Device-local"],
    ],
    [],
  );

  function buildPlan(event: FormEvent) {
    event.preventDefault();
    try {
      const next = buildSkyHopeImpactPlan({
        title,
        theme,
        beneficiaryGoal: Number(beneficiaryGoal),
        objective,
        evidenceMetric,
      });
      setPlan(next);
      toast.success("SkyHope impact plan created.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to build the impact plan.",
      );
    }
  }

  function saveDraft() {
    if (!plan) return;
    const next = [
      { savedAt: new Date().toISOString(), plan },
      ...drafts.filter(item => item.plan.id !== plan.id),
    ].slice(0, 12);
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    setDrafts(next);
    toast.success("Draft saved on this device.");
  }

  function removeDraft(id: string) {
    const next = drafts.filter(item => item.plan.id !== id);
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    setDrafts(next);
  }

  async function copyHopeAiBrief() {
    if (!plan) return;
    try {
      await navigator.clipboard.writeText(plan.hopeAiBrief);
      toast.success("HopeAI planning brief copied.");
    } catch {
      toast.error("Clipboard access is unavailable in this browser.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10rem] top-[-8rem] h-[32rem] w-[32rem] rounded-full bg-rose-600/15 blur-3xl" />
        <div className="absolute right-[-12rem] top-32 h-[34rem] w-[34rem] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-10">
        <header className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-rose-500/15 text-rose-100">
                SkyHope Impact Workspace
              </Badge>
              <Badge variant="outline" className="border-amber-300/25 text-amber-100">
                Engineering beta
              </Badge>
              <Badge variant="outline" className="border-white/10 text-white/50">
                No live donation execution
              </Badge>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Turn good intentions into an evidence-first impact plan.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/50">
              SkyHope now focuses on what this beta can actually prove: structured
              campaign planning, measurable checkpoints, responsible-giving
              education, practice games, and a HopeAI coaching brief. It does not
              manufacture donor totals, partner verification, on-chain proof, or
              completed payments.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Link href="/hope-a-i">
              <Button size="lg" className="w-full">
                <Bot className="mr-2 h-4 w-4" />
                Open HopeAI
              </Button>
            </Link>
            <Link href="/sky-school">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/15 bg-white/[0.03] text-white"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Learn impact design
              </Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {boundaryRows.map(([label, value]) => (
            <Card key={label} className="border-white/10 bg-white/[0.035] text-white">
              <CardContent className="p-5">
                <ShieldCheck className="h-5 w-5 text-emerald-200" />
                <p className="mt-4 text-xl font-black">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/30">
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pathways.map(pathway => {
            const Icon = pathway.icon;
            return (
              <Card
                key={pathway.title}
                className="border-white/10 bg-white/[0.035] text-white"
              >
                <CardHeader>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-300/10 text-rose-100">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="mt-3 text-white">{pathway.title}</CardTitle>
                  <CardDescription className="leading-6 text-white/45">
                    {pathway.detail}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={pathway.href}>
                    <Button
                      variant="outline"
                      className="w-full border-white/15 bg-white/[0.03] text-white"
                    >
                      Open
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-rose-300/15 bg-rose-300/[0.035] text-white">
            <CardHeader>
              <HandHeart className="h-6 w-6 text-rose-200" />
              <CardTitle className="mt-2 text-2xl text-white">
                Build an impact draft
              </CardTitle>
              <CardDescription className="leading-6 text-white/45">
                This creates a deterministic planning artifact. It does not create
                a charity, verify a beneficiary, or move money.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={buildPlan} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-white/55">
                    Campaign title
                  </label>
                  <Input
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    maxLength={120}
                    placeholder="Example: Neighborhood learning access pilot"
                    className="border-white/10 bg-black/20 text-white"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-white/55">
                      Theme
                    </label>
                    <select
                      value={theme}
                      onChange={event => setTheme(event.target.value as SkyHopeTheme)}
                      className="h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none"
                    >
                      {SKYHOPE_THEME_OPTIONS.map(option => (
                        <option key={option} value={option}>
                          {option.replaceAll("-", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-white/55">
                      Beneficiary planning goal
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={1_000_000}
                      step={1}
                      value={beneficiaryGoal}
                      onChange={event => setBeneficiaryGoal(event.target.value)}
                      className="border-white/10 bg-black/20 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-white/55">
                    Objective
                  </label>
                  <textarea
                    value={objective}
                    onChange={event => setObjective(event.target.value)}
                    maxLength={500}
                    placeholder="What should change, for whom, and under what constraints?"
                    className="min-h-28 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white outline-none placeholder:text-white/25 focus-visible:ring-2 focus-visible:ring-rose-300/30"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-white/55">
                    Evidence metric
                  </label>
                  <textarea
                    value={evidenceMetric}
                    onChange={event => setEvidenceMetric(event.target.value)}
                    maxLength={240}
                    placeholder="What evidence would show progress without exaggerating the outcome?"
                    className="min-h-24 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white outline-none placeholder:text-white/25 focus-visible:ring-2 focus-visible:ring-rose-300/30"
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Build evidence-first plan
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.035] text-white">
            <CardHeader>
              <Target className="h-6 w-6 text-emerald-200" />
              <CardTitle className="mt-2 text-2xl text-white">
                Plan preview
              </CardTitle>
              <CardDescription className="text-white/45">
                Four checkpoints keep delivery and evidence visible before any
                future live-value integration is considered.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!plan ? (
                <div className="grid min-h-96 place-items-center rounded-2xl border border-dashed border-white/10 bg-black/10 p-8 text-center">
                  <div>
                    <HeartHandshake className="mx-auto h-10 w-10 text-white/20" />
                    <p className="mt-4 font-semibold text-white/65">
                      Build a draft to see milestones and a HopeAI brief.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/35">
                      Nothing is sent to an external model or payment provider by
                      this planner.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/30">
                      {plan.contract}
                    </p>
                    <h3 className="mt-2 text-xl font-black">{plan.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/45">
                      {plan.objective}
                    </p>
                    <p className="mt-3 text-xs text-emerald-200">
                      Evidence: {plan.evidenceMetric}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {plan.milestones.map(item => (
                      <div
                        key={item.percent}
                        className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-rose-100">
                            {item.percent}%
                          </span>
                          <span className="text-xs text-white/35">
                            target {item.beneficiaryTarget}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/45">
                          {item.checkpoint}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button onClick={saveDraft} className="flex-1">
                      <Save className="mr-2 h-4 w-4" />
                      Save device-local draft
                    </Button>
                    <Button
                      onClick={copyHopeAiBrief}
                      variant="outline"
                      className="flex-1 border-white/15 bg-white/[0.03] text-white"
                    >
                      <ClipboardCopy className="mr-2 h-4 w-4" />
                      Copy HopeAI brief
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="text-white">Device-local drafts</CardTitle>
              <CardDescription className="text-white/45">
                Saved only in this browser. These are not server campaigns and do
                not imply beneficiary approval.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {drafts.length === 0 ? (
                <p className="text-sm text-white/35">No saved drafts yet.</p>
              ) : (
                <div className="space-y-3">
                  {drafts.map(item => (
                    <div
                      key={item.plan.id}
                      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{item.plan.title}</p>
                        <p className="mt-1 text-xs text-white/35">
                          {item.plan.theme.replaceAll("-", " ")} · target{" "}
                          {item.plan.beneficiaryGoal} · saved{" "}
                          {new Date(item.savedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/15 bg-white/[0.03] text-white"
                          onClick={() => setPlan(item.plan)}
                        >
                          Open
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label={`Delete ${item.plan.title}`}
                          onClick={() => removeDraft(item.plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-amber-300/15 bg-amber-300/[0.035] text-white">
            <CardHeader>
              <ShieldCheck className="h-6 w-6 text-amber-200" />
              <CardTitle className="mt-2 text-white">
                Gates before live donations
              </CardTitle>
              <CardDescription className="text-white/45">
                The platform should fail closed until these are real and tested.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {launchGates.map(gate => (
                <div key={gate} className="flex items-start gap-3 text-sm text-white/50">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-200/70" />
                  <span>{gate}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
