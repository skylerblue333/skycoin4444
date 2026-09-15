import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Layers3,
  RotateCcw,
  Route,
  X,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  V3_JOURNEY_PROGRESS_KEY,
  findJourneyForRoute,
  getNextV3JourneyStage,
  getV3JourneyCompletionPercent,
  normalizeV3JourneyProgress,
  setV3JourneyStageComplete,
  v3Journeys,
  type V3JourneyId,
  type V3JourneyProgress,
} from "@/lib/v3Journeys";

export default function V3JourneyNavigator() {
  const [location] = useLocation();
  const activeJourney = useMemo(() => findJourneyForRoute(location), [location]);
  const [open, setOpen] = useState(false);
  const [selectedJourneyId, setSelectedJourneyId] = useState<V3JourneyId>(
    activeJourney?.id ?? "social"
  );
  const [progress, setProgress] = useState<V3JourneyProgress>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setProgress(
        normalizeV3JourneyProgress(
          JSON.parse(localStorage.getItem(V3_JOURNEY_PROGRESS_KEY) ?? "{}")
        )
      );
    } catch {
      setProgress({});
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (activeJourney) setSelectedJourneyId(activeJourney.id);
  }, [activeJourney]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(V3_JOURNEY_PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // Local journey guidance remains usable if browser storage is blocked.
    }
  }, [hydrated, progress]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "Escape" && open) {
        setOpen(false);
        return;
      }
      if (!typing && event.shiftKey && event.key.toLowerCase() === "j") {
        event.preventDefault();
        setOpen(current => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const selectedJourney =
    v3Journeys.find(journey => journey.id === selectedJourneyId) ?? v3Journeys[0];
  const selectedComplete = new Set(progress[selectedJourney.id] ?? []);
  const selectedPercent = getV3JourneyCompletionPercent(progress, selectedJourney.id);
  const nextStage = getNextV3JourneyStage(progress, selectedJourney.id);
  const activePercent = activeJourney
    ? getV3JourneyCompletionPercent(progress, activeJourney.id)
    : 0;

  const toggleStage = (stageId: string) => {
    setProgress(current =>
      setV3JourneyStageComplete(
        current,
        selectedJourney.id,
        stageId,
        !selectedComplete.has(stageId)
      )
    );
  };

  const resetJourney = () => {
    setProgress(current => ({ ...current, [selectedJourney.id]: [] }));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open V3 product journeys"
        title="Product journeys · Shift+J"
        className="fixed bottom-4 right-4 z-40 inline-flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-violet-300/20 bg-[#0b0b1c]/95 px-4 py-3 text-left text-white shadow-2xl shadow-black/40 backdrop-blur-xl transition hover:border-violet-300/40 hover:bg-[#111128] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-300/10 text-violet-200">
          <Route className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <strong className="block truncate text-xs font-black">
            {activeJourney ? activeJourney.name : "Deep product journeys"}
          </strong>
          <span className="mt-0.5 block truncate text-[10px] text-white/40">
            {activeJourney
              ? `${activePercent}% journey complete · Shift+J`
              : "7 guided product loops · Shift+J"}
          </span>
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-[#020208]/90 p-0 backdrop-blur-md sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="v3-journey-title"
        >
          <div className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#080817] text-white shadow-2xl shadow-black/50 sm:rounded-3xl">
            <div className="sticky top-0 z-10 border-b border-white/[0.08] bg-[#080817]/95 px-4 py-4 backdrop-blur-xl sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-violet-200/60">
                    <Layers3 className="h-3.5 w-3.5" />
                    V3 product depth
                  </div>
                  <h2 id="v3-journey-title" className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                    Finish loops, not screens.
                  </h2>
                  <p className="mt-2 max-w-3xl text-xs leading-5 text-white/40 sm:text-sm">
                    Each journey turns a headline area into a repeatable sequence with a concrete outcome, recovery path, and explicit product boundary. Completion is a local testing checklist—not usage analytics or production certification.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close product journeys"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {v3Journeys.map(journey => {
                  const percent = getV3JourneyCompletionPercent(progress, journey.id);
                  const selected = journey.id === selectedJourney.id;
                  return (
                    <button
                      key={journey.id}
                      type="button"
                      onClick={() => setSelectedJourneyId(journey.id)}
                      className={
                        "shrink-0 rounded-xl border px-3 py-2 text-left transition " +
                        (selected
                          ? "border-violet-300/35 bg-violet-300/10 text-white"
                          : "border-white/[0.08] bg-white/[0.025] text-white/50 hover:bg-white/[0.05] hover:text-white")
                      }
                    >
                      <span className="block text-xs font-bold">{journey.name}</span>
                      <span className="mt-0.5 block text-[9px] text-white/35">{percent}% complete</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[0.72fr_1.28fr]">
              <aside className="space-y-4">
                <div className="rounded-2xl border border-violet-300/15 bg-violet-300/[0.05] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-200/55">
                    {selectedJourney.tagline}
                  </p>
                  <h3 className="mt-2 text-2xl font-black">{selectedJourney.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/50">{selectedJourney.outcome}</p>

                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <strong className="text-4xl font-black">{selectedPercent}%</strong>
                      <p className="mt-1 text-[10px] text-white/35">
                        {selectedComplete.size} of {selectedJourney.stages.length} testing stages
                      </p>
                    </div>
                    <Link
                      href={nextStage.route}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center rounded-xl bg-white px-3 py-2 text-xs font-black text-[#080817] hover:bg-white/90"
                    >
                      Continue
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label={`${selectedJourney.name} local journey progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={selectedPercent}>
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-300 to-sky-300 transition-all" style={{ width: `${selectedPercent}%` }} />
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-200/55">Truth boundary</p>
                  <p className="mt-2 text-xs leading-5 text-white/45">{selectedJourney.boundary}</p>
                </div>

                <button
                  type="button"
                  onClick={resetJourney}
                  className="inline-flex items-center text-xs font-semibold text-white/35 hover:text-white"
                >
                  <RotateCcw className="mr-2 h-3.5 w-3.5" />
                  Reset this local checklist
                </button>
              </aside>

              <section>
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Journey stages</p>
                    <h3 className="mt-1 text-lg font-black">Do the work end to end</h3>
                  </div>
                  <span className="hidden text-[10px] text-white/25 sm:block">Check stages only after the stated evidence exists.</span>
                </div>

                <div className="space-y-3">
                  {selectedJourney.stages.map((stage, index) => {
                    const complete = selectedComplete.has(stage.id);
                    return (
                      <div
                        key={stage.id}
                        className={
                          "rounded-2xl border p-4 transition " +
                          (complete
                            ? "border-emerald-300/20 bg-emerald-300/[0.045]"
                            : "border-white/[0.08] bg-white/[0.025]")
                        }
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => toggleStage(stage.id)}
                            aria-label={complete ? `Mark ${stage.title} incomplete` : `Mark ${stage.title} complete`}
                            className={
                              "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50 " +
                              (complete
                                ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                                : "border-white/10 bg-white/[0.04] text-white/35 hover:text-white")
                            }
                          >
                            {complete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <span className="text-[9px] font-black tracking-[0.2em] text-white/25">{String(index + 1).padStart(2, "0")}</span>
                                <h4 className="mt-0.5 font-black text-white/90">{stage.title}</h4>
                              </div>
                              <Link
                                href={stage.route}
                                onClick={() => setOpen(false)}
                                className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-bold text-sky-200 hover:bg-white/[0.08] hover:text-white"
                              >
                                Open step
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Link>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-white/45">{stage.description}</p>
                            <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2.5">
                              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25">Evidence to look for</p>
                              <p className="mt-1 text-[11px] leading-5 text-white/40">{stage.evidence}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
