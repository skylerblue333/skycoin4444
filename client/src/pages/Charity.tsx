import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Compass,
  Gamepad2,
  GraduationCap,
  HandHeart,
  Heart,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  IMPACT_TRACKS,
  buildImpactPlan,
  createImpactJournalEntry,
  parseImpactJournal,
  type ImpactJournalEntry,
  type ImpactTrackId,
} from "@/lib/hopeImpact";

const JOURNAL_KEY = "sky4444.hope-impact-journal.v1";

const destinations = [
  {
    label: "Plan with HopeAI",
    detail: "Turn a service idea into questions, checklists, and next actions.",
    href: "/hope-a-i",
    icon: Bot,
  },
  {
    label: "Learn with SkySchool",
    detail: "Build the knowledge needed before helping in a new domain.",
    href: "/sky-school",
    icon: GraduationCap,
  },
  {
    label: "Practice in Gaming",
    detail: "Use no-value skill games as practice, never as a donation substitute.",
    href: "/gaming",
    icon: Gamepad2,
  },
  {
    label: "Share with Social",
    detail: "Share a real completion update without inventing impact or reach.",
    href: "/activity-feed",
    icon: Users,
  },
] as const;

export default function Charity() {
  const [trackId, setTrackId] = useState<ImpactTrackId>("shelter-care");
  const [availableMinutes, setAvailableMinutes] = useState(90);
  const [teamSize, setTeamSize] = useState(1);
  const [journal, setJournal] = useState<ImpactJournalEntry[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  const plan = useMemo(
    () =>
      buildImpactPlan({
        trackId,
        availableMinutes,
        teamSize,
      }),
    [availableMinutes, teamSize, trackId]
  );

  useEffect(() => {
    try {
      setJournal(parseImpactJournal(window.localStorage.getItem(JOURNAL_KEY)));
    } catch {
      setJournal([]);
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal.slice(0, 50)));
    } catch {
      // Storage is best-effort. The planner still works without persistence.
    }
  }, [journal, storageReady]);

  const savePlan = () => {
    const entry = createImpactJournalEntry(plan);
    setJournal(current => [entry, ...current].slice(0, 50));
  };

  const toggleCompleted = (id: string) => {
    setJournal(current =>
      current.map(entry =>
        entry.id === id ? { ...entry, completed: !entry.completed } : entry
      )
    );
  };

  const removeEntry = (id: string) => {
    setJournal(current => current.filter(entry => entry.id !== id));
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#060807] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-20 h-[32rem] w-[32rem] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-[-8rem] h-[30rem] w-[30rem] rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
        <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 lg:grid-cols-[1.15fr_.85fr] lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-100">SKYHOPE</Badge>
              <Badge variant="outline" className="border-white/10 text-white/50">
                Impact planning beta
              </Badge>
              <Badge variant="outline" className="border-amber-300/20 text-amber-100/70">
                No payment execution
              </Badge>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-[-0.045em] sm:text-6xl">
              Turn good intentions into
              <span className="block bg-gradient-to-r from-emerald-200 via-white to-amber-100 bg-clip-text text-transparent">
                a plan you can actually verify.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-white/55 sm:text-lg">
              SkyHope is now a working service-planning and device-local evidence
              lab. It helps you scope volunteer work, prepare safely, and record
              what you personally completed without pretending SKYCOIN4444 moved
              money, verified a charity, created official volunteer hours, or
              measured real-world impact.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button onClick={savePlan} size="lg" className="bg-emerald-300 text-black hover:bg-emerald-200">
                <Save className="mr-2 h-4 w-4" />
                Save this service plan
              </Button>
              <Link href="/hope-a-i">
                <Button size="lg" variant="outline" className="border-white/15 bg-white/[0.03] text-white">
                  <Bot className="mr-2 h-4 w-4" />
                  Continue in HopeAI
                </Button>
              </Link>
            </div>
          </div>

          <Card className="border-emerald-300/15 bg-black/25 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ShieldCheck className="h-5 w-5 text-emerald-200" />
                Truth boundary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-white/55">
              <p>
                The planner creates an engineering-beta service plan only. It does
                not send donations, move tokens, verify nonprofits, execute smart
                contracts, certify volunteer hours, or prove that a planned task
                was completed.
              </p>
              <p>
                Financial contribution flows stay disabled here until a real
                provider, compliance boundary, receipts, failure handling, and
                reconciliation path are implemented and independently verified.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {destinations.map(({ label, detail, href, icon: Icon }) => (
            <Link key={label} href={href}>
              <Card className="h-full border-white/10 bg-white/[0.03] text-white transition hover:-translate-y-1 hover:border-emerald-200/20">
                <CardContent className="p-5">
                  <Icon className="h-6 w-6 text-emerald-200" />
                  <p className="mt-4 font-black">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-white/45">{detail}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-100/80">
                    Open area <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[.82fr_1.18fr]">
          <Card className="border-white/10 bg-[#0a0d0b]/95 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-200" />
                Service planner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-white/40">
                  Impact track
                </label>
                <select
                  value={trackId}
                  onChange={event => setTrackId(event.target.value as ImpactTrackId)}
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-emerald-300/40"
                >
                  {IMPACT_TRACKS.map(track => (
                    <option key={track.id} value={track.id}>
                      {track.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs leading-5 text-white/38">
                  {plan.track.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.14em] text-white/40">
                    Minutes available
                  </label>
                  <Input
                    type="number"
                    min={15}
                    max={480}
                    value={availableMinutes}
                    onChange={event => setAvailableMinutes(Number(event.target.value))}
                    className="mt-2 border-white/10 bg-black/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.14em] text-white/40">
                    Team size
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={teamSize}
                    onChange={event => setTeamSize(Number(event.target.value))}
                    className="mt-2 border-white/10 bg-black/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <Clock className="h-4 w-4 text-emerald-200" />
                  <p className="mt-3 text-2xl font-black">{plan.availableMinutes}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/30">minutes</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <Users className="h-4 w-4 text-emerald-200" />
                  <p className="mt-3 text-2xl font-black">{plan.teamSize}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/30">people</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <Sparkles className="h-4 w-4 text-amber-200" />
                  <p className="mt-3 text-2xl font-black">{plan.plannedUnits}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/30">
                    planned {plan.track.unitLabel}
                  </p>
                </div>
              </div>

              <p className="rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-xs text-white/40">
                Plan receipt: {plan.receiptId}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HandHeart className="h-5 w-5 text-emerald-200" />
                  Action sequence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.steps.map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-black/15 p-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-300/10 text-xs font-black text-emerald-100">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-white/55">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-white/10 bg-white/[0.03] text-white">
                <CardHeader>
                  <CardTitle className="text-base">Role plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {plan.rolePlan.map(role => (
                    <p key={role} className="text-sm leading-6 text-white/48">
                      • {role}
                    </p>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/[0.03] text-white">
                <CardHeader>
                  <CardTitle className="text-base">Evidence checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {plan.evidenceChecklist.map(item => (
                    <p key={item} className="text-sm leading-6 text-white/48">
                      • {item}
                    </p>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-100/45">
                Device-local journal
              </p>
              <h2 className="mt-1 text-3xl font-black">Plans you chose to keep</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-white/40">
              These entries stay in this browser. Marking one complete records your
              own statement only; it is not independent verification.
            </p>
          </div>

          {journal.length === 0 ? (
            <Card className="border-dashed border-white/10 bg-white/[0.02] text-white">
              <CardContent className="flex min-h-40 flex-col items-center justify-center p-6 text-center">
                <Heart className="h-7 w-7 text-emerald-200/70" />
                <p className="mt-3 font-semibold">No saved service plans yet.</p>
                <p className="mt-1 text-sm text-white/40">
                  Build a plan above and save it when the scope looks realistic.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {journal.map(entry => (
                <Card key={entry.id} className="border-white/10 bg-white/[0.03] text-white">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="border-white/10 text-white/55">
                          {entry.trackName}
                        </Badge>
                        {entry.completed ? (
                          <Badge className="bg-emerald-500/15 text-emerald-100">
                            Personal completion mark
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-300/15 text-amber-100/60">
                            Planned
                          </Badge>
                        )}
                      </div>
                      <p className="mt-3 font-semibold">
                        {entry.availableMinutes} minutes · team {entry.teamSize} · {entry.plannedUnits} planned units
                      </p>
                      <p className="mt-1 font-mono text-xs text-white/30">{entry.receiptId}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleCompleted(entry.id)}
                        className="border-white/10 bg-white/[0.02] text-white"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {entry.completed ? "Mark planned" : "Mark completed"}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeEntry(entry.id)}
                        aria-label={"Delete " + entry.trackName + " plan"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Link href="/platform-map">
            <Card className="h-full border-white/10 bg-white/[0.03] text-white">
              <CardContent className="p-5">
                <Compass className="h-5 w-5 text-emerald-200" />
                <p className="mt-3 font-black">Explore the ecosystem</p>
                <p className="mt-2 text-sm leading-6 text-white/40">
                  Move from SkyHope into the rest of the developed beta paths.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/sky-school">
            <Card className="h-full border-white/10 bg-white/[0.03] text-white">
              <CardContent className="p-5">
                <GraduationCap className="h-5 w-5 text-blue-200" />
                <p className="mt-3 font-black">Prepare before serving</p>
                <p className="mt-2 text-sm leading-6 text-white/40">
                  Use SkySchool for learning and practice before taking on unfamiliar work.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/hope-a-i">
            <Card className="h-full border-white/10 bg-white/[0.03] text-white">
              <CardContent className="p-5">
                <Bot className="h-5 w-5 text-violet-200" />
                <p className="mt-3 font-black">Ask HopeAI to refine the plan</p>
                <p className="mt-2 text-sm leading-6 text-white/40">
                  Use the AI workspace for questions and planning; verify external facts independently.
                </p>
              </CardContent>
            </Card>
          </Link>
        </section>
      </div>
    </main>
  );
}
