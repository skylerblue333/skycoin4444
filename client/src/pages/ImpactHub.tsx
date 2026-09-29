import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Bot,
  Check,
  Clipboard,
  Gamepad2,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
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
  buildImpactWorkspacePath,
  createImpactHopePrompt,
  createImpactSocialDraft,
  type ImpactCause,
  type ImpactWorkspaceArea,
} from "@/lib/impactMissionWorkspace";

const areaMeta: Record<
  ImpactWorkspaceArea,
  {
    label: string;
    icon: typeof Bot;
    description: string;
    route: string;
  }
> = {
  hopeai: {
    label: "HopeAI",
    icon: Bot,
    description: "Plan tasks, questions, evidence, risks, and dependencies.",
    route: "/hope-a-i",
  },
  education: {
    label: "Education",
    icon: GraduationCap,
    description: "Learn the cause and test understanding before asking people to act.",
    route: "/sky-school",
  },
  social: {
    label: "Social",
    icon: Users,
    description: "Draft truthful updates, invite volunteers, and collect feedback.",
    route: "/activity-feed",
  },
  gaming: {
    label: "Games",
    icon: Gamepad2,
    description: "Use demo games as awareness and learning challenges, not wagers.",
    route: "/gaming-for-charity",
  },
  charity: {
    label: "Charity",
    icon: HeartHandshake,
    description: "Keep beneficiary, evidence, provider, legal, and finance gates visible.",
    route: "/charity",
  },
};

const causes: Array<{ value: ImpactCause; label: string }> = [
  { value: "education", label: "Education access" },
  { value: "community", label: "Community support" },
  { value: "food", label: "Food access" },
  { value: "housing", label: "Housing support" },
  { value: "mental-health", label: "Mental health support" },
  { value: "environment", label: "Environment" },
  { value: "custom", label: "Other / custom" },
];

export default function ImpactHub() {
  const [title, setTitle] = useState("Community learning mission");
  const [cause, setCause] = useState<ImpactCause>("education");
  const [goal, setGoal] = useState(
    "Teach one useful lesson, invite volunteers, run a demo challenge, and document what actually happened.",
  );
  const [selectedAreas, setSelectedAreas] = useState<ImpactWorkspaceArea[]>([
    "hopeai",
    "education",
    "social",
    "gaming",
    "charity",
  ]);
  const [copied, setCopied] = useState<"hope" | "social" | null>(null);

  const pathway = useMemo(
    () => buildImpactWorkspacePath(selectedAreas),
    [selectedAreas],
  );

  const hopePrompt = useMemo(() => {
    try {
      return createImpactHopePrompt({
        title,
        cause,
        goal,
        selectedAreas,
      });
    } catch {
      return "";
    }
  }, [cause, goal, selectedAreas, title]);

  const socialDraft = useMemo(() => {
    try {
      return createImpactSocialDraft({
        title,
        cause,
        update: goal,
      });
    } catch {
      return "";
    }
  }, [cause, goal, title]);

  function toggleArea(area: ImpactWorkspaceArea) {
    setSelectedAreas(current =>
      current.includes(area)
        ? current.filter(item => item !== area)
        : [...current, area],
    );
  }

  async function copyText(kind: "hope" | "social", value: string) {
    if (!value || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      window.setTimeout(() => setCopied(current => (current === kind ? null : current)), 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] pb-28 text-white md:pb-10">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-[-8rem] h-[30rem] w-[30rem] rounded-full bg-emerald-600/14 blur-3xl" />
        <div className="absolute right-[-10rem] top-48 h-[30rem] w-[30rem] rounded-full bg-violet-600/14 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="grid gap-7 border-b border-white/10 pb-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-400/15 text-emerald-100">
                SkyHope · Impact Mission Control
              </Badge>
              <Badge
                variant="outline"
                className="border-violet-300/20 text-violet-100"
              >
                HopeAI + charity + learning + community + games
              </Badge>
              <Badge
                variant="outline"
                className="border-amber-300/20 text-amber-100"
              >
                Planning beta · no automatic donations
              </Badge>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
              Turn hope into a mission you can actually work through.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/50">
              Start with a cause, use HopeAI to structure the work, learn before
              acting, invite the community, make participation fun, and keep
              charity evidence honest. This hub connects the major product paths
              without pretending that planning equals real-world impact.
            </p>
          </div>

          <Card className="border-emerald-300/20 bg-emerald-300/[0.045] text-white">
            <CardHeader>
              <ShieldCheck className="h-6 w-6 text-emerald-200" />
              <CardTitle className="text-white">Truth boundary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-6 text-white/50">
              <p>No AI provider call is made from this planner.</p>
              <p>No social post is auto-published.</p>
              <p>No game score triggers money.</p>
              <p>No donation, payment, custody, or settlement is executed here.</p>
            </CardContent>
          </Card>
        </header>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)]">
          <Card className="border-white/10 bg-white/[0.035] text-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-300/10 text-violet-100">
                  <Target className="h-5 w-5" />
                </span>
                <div>
                  <CardTitle className="text-white">Build a mission</CardTitle>
                  <CardDescription className="text-white/45">
                    This stays in your browser unless you choose another product route.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-white/35">
                  Mission title
                </span>
                <input
                  value={title}
                  onChange={event => setTitle(event.target.value)}
                  maxLength={160}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300/35"
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-white/35">
                  Cause
                </span>
                <select
                  value={cause}
                  onChange={event => setCause(event.target.value as ImpactCause)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0c0c18] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300/35"
                >
                  {causes.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-white/35">
                  Goal
                </span>
                <textarea
                  value={goal}
                  onChange={event => setGoal(event.target.value)}
                  maxLength={1000}
                  rows={5}
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-violet-300/35"
                />
              </label>

              <div>
                <span className="text-xs font-black uppercase tracking-[0.16em] text-white/35">
                  Product paths
                </span>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(Object.keys(areaMeta) as ImpactWorkspaceArea[]).map(area => {
                    const meta = areaMeta[area];
                    const Icon = meta.icon;
                    const selected = selectedAreas.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleArea(area)}
                        className={
                          "flex items-start gap-3 rounded-2xl border p-3 text-left transition " +
                          (selected
                            ? "border-emerald-300/25 bg-emerald-300/[0.07]"
                            : "border-white/[0.07] bg-white/[0.02] hover:border-white/15")
                        }
                      >
                        <span
                          className={
                            "grid h-9 w-9 shrink-0 place-items-center rounded-xl " +
                            (selected
                              ? "bg-emerald-300/12 text-emerald-100"
                              : "bg-white/[0.04] text-white/35")
                          }
                        >
                          {selected ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </span>
                        <span>
                          <strong className="block text-sm text-white/85">{meta.label}</strong>
                          <span className="mt-1 block text-xs leading-5 text-white/35">
                            {meta.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="border-violet-300/20 bg-violet-300/[0.04] text-white">
              <CardHeader>
                <Bot className="h-6 w-6 text-violet-200" />
                <CardTitle className="text-white">HopeAI mission brief</CardTitle>
                <CardDescription className="text-white/45">
                  Generates a structured prompt for the active HopeAI workspace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/[0.07] bg-black/25 p-4 text-xs leading-5 text-white/45">
                  {hopePrompt || "Add a mission title, goal, and at least one product path."}
                </pre>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="border-white/15 bg-white/[0.03] text-white"
                    disabled={!hopePrompt}
                    onClick={() => copyText("hope", hopePrompt)}
                  >
                    {copied === "hope" ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
                    {copied === "hope" ? "Copied" : "Copy brief"}
                  </Button>
                  <Link href="/hope-a-i">
                    <Button className="w-full">
                      Open HopeAI <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-sky-300/15 bg-sky-300/[0.035] text-white">
              <CardHeader>
                <Users className="h-6 w-6 text-sky-200" />
                <CardTitle className="text-white">Social mission draft</CardTitle>
                <CardDescription className="text-white/45">
                  Draft first. Publish intentionally. Never fabricate reach or results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-sm leading-6 text-white/45">
                  {socialDraft || "Add a mission title and update to prepare a community draft."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="border-white/15 bg-white/[0.03] text-white"
                    disabled={!socialDraft}
                    onClick={() => copyText("social", socialDraft)}
                  >
                    {copied === "social" ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
                    {copied === "social" ? "Copied" : "Copy social draft"}
                  </Button>
                  <Link href="/activity-feed">
                    <Button variant="outline" className="border-sky-300/20 bg-sky-300/[0.05] text-sky-100">
                      Open Social
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200/55">
                Major navigation path
              </p>
              <h2 className="mt-2 text-3xl font-black">
                One mission, five connected product areas
              </h2>
            </div>
            <Badge variant="outline" className="border-white/10 text-white/45">
              {pathway.length} selected step{pathway.length === 1 ? "" : "s"}
            </Badge>
          </div>

          <div className="grid gap-3 lg:grid-cols-5">
            {pathway.map((step, index) => {
              const meta = areaMeta[step.area];
              const Icon = meta.icon;
              return (
                <Link
                  key={step.area}
                  href={step.route}
                  className="group rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-emerald-300/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.05] text-white/60 group-hover:text-emerald-100">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 font-black text-white/85">{step.label}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/35">{step.detail}</p>
                  <p className="mt-3 border-t border-white/[0.06] pt-3 text-[11px] leading-5 text-white/25">
                    {step.proofPrompt}
                  </p>
                  <span className="mt-4 inline-flex items-center text-xs font-bold text-emerald-200/70">
                    Open area <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-amber-300/15 bg-amber-300/[0.035] text-white">
            <CardHeader>
              <GraduationCap className="h-6 w-6 text-amber-200" />
              <CardTitle className="text-white">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-white/45">
              <p>
                Use bounded quiz sessions, review missed questions, and keep scores
                separate from credentials or claims of mastery.
              </p>
              <Link href="/quizzes" className="inline-flex items-center font-bold text-amber-200/75">
                Open quizzes <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-fuchsia-300/15 bg-fuchsia-300/[0.035] text-white">
            <CardHeader>
              <Gamepad2 className="h-6 w-6 text-fuchsia-200" />
              <CardTitle className="text-white">Games for impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-white/45">
              <p>
                Turn demo game scores into awareness challenges. Scores do not
                create wagers, donations, payouts, or crypto rewards.
              </p>
              <Link href="/gaming-for-charity" className="inline-flex items-center font-bold text-fuchsia-200/75">
                Open Impact Play Lab <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-emerald-300/15 bg-emerald-300/[0.035] text-white">
            <CardHeader>
              <HeartHandshake className="h-6 w-6 text-emerald-200" />
              <CardTitle className="text-white">Charity controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-white/45">
              <p>
                Beneficiary verification, evidence planning, approved providers,
                legal review, region checks, and finance gates remain explicit.
              </p>
              <Link href="/charity" className="inline-flex items-center font-bold text-emerald-200/75">
                Open SkyHope <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-violet-300/15 bg-violet-300/[0.035] text-white">
            <CardHeader>
              <Sparkles className="h-6 w-6 text-violet-200" />
              <CardTitle className="text-white">Evidence over hype</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-white/45">
              <p>
                Track local learning, community, and game signals without upgrading
                them into externally verified impact or financial settlement.
              </p>
              <Link href="/impact-metrics" className="inline-flex items-center font-bold text-violet-200/75">
                Open impact metrics <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
