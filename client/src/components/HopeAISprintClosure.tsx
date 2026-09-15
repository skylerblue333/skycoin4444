import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  History,
  RotateCcw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { summarizeHopeActivity, type HopePlan } from "@/lib/hopeCoach";
import {
  HOPE_SPRINT_HISTORY_KEY,
  createHopeSprintReceipt,
  getHopeIncompleteSteps,
  isHopeSprintComplete,
  normalizeHopeCompletedStepIds,
  normalizeHopePlanSnapshot,
  normalizeHopeSprintHistory,
  removeHopeSprintReceipt,
  upsertHopeSprintReceipt,
  type HopeSprintReceipt,
} from "@/lib/hopeSprintJournal";

const PLAN_KEY = "sky4444.hopeai.plan";
const COMPLETED_KEY = "sky4444.hopeai.completed-steps";

function readJson(key: string, fallback: unknown) {
  try {
    return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function persistHistory(history: readonly HopeSprintReceipt[]) {
  try {
    localStorage.setItem(HOPE_SPRINT_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Local closure remains visible for this session when storage is blocked.
  }
}

export default function HopeAISprintClosure() {
  const [location] = useLocation();
  const onHopeAI = location.split(/[?#]/, 1)[0] === "/hope-a-i";
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<HopePlan | null>(null);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [history, setHistory] = useState<HopeSprintReceipt[]>([]);
  const [reflection, setReflection] = useState("");
  const [message, setMessage] = useState("");

  const activity = trpc.activityEvidence.list.useQuery(undefined, {
    enabled: onHopeAI && open,
    retry: false,
  });
  const summary = useMemo(
    () => (activity.data ? summarizeHopeActivity(activity.data) : null),
    [activity.data]
  );

  if (!onHopeAI) return null;

  const loadSnapshot = () => {
    const nextPlan = normalizeHopePlanSnapshot(readJson(PLAN_KEY, null));
    const nextCompleted = nextPlan
      ? normalizeHopeCompletedStepIds(
          nextPlan,
          readJson(COMPLETED_KEY, [])
        )
      : [];
    setPlan(nextPlan);
    setCompletedStepIds(nextCompleted);
    setHistory(
      normalizeHopeSprintHistory(readJson(HOPE_SPRINT_HISTORY_KEY, []))
    );
    setReflection("");
    setMessage("");
  };

  const show = () => {
    loadSnapshot();
    setOpen(true);
  };

  const incomplete = getHopeIncompleteSteps(plan, completedStepIds);
  const complete = isHopeSprintComplete(plan, completedStepIds);
  const currentReceipt = plan
    ? history.find(receipt => receipt.planTitle === plan.title && receipt.focus === plan.focus)
    : undefined;

  const saveReceipt = () => {
    if (!plan || !summary) return;
    try {
      const receipt = createHopeSprintReceipt({
        plan,
        completedStepIds,
        reflection,
        activity: summary,
      });
      const next = upsertHopeSprintReceipt(history, receipt);
      setHistory(next);
      persistHistory(next);
      setReflection("");
      setMessage("Local sprint receipt saved. This is tester-confirmed closure, not model memory or analytics.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sprint closure could not be saved.");
    }
  };

  const removeReceipt = (receiptId: string) => {
    const next = removeHopeSprintReceipt(history, receiptId);
    setHistory(next);
    persistHistory(next);
    setMessage("Local receipt removed.");
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-2xl border border-cyan-300/20 bg-[#07141b]/95 px-4 py-3 text-xs font-black text-cyan-50 shadow-2xl shadow-black/40 backdrop-blur-xl hover:border-cyan-300/40 hover:bg-[#0a1b24]"
        title="Review and close the current HopeAI sprint"
      >
        <ClipboardCheck className="h-4 w-4 text-cyan-200" />
        Close HopeAI sprint
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[135] flex items-end justify-center bg-[#020208]/90 p-0 backdrop-blur-md sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hope-sprint-closure-title"
        >
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#071018] text-white shadow-2xl shadow-black/60 sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#071018]/95 px-5 py-5 backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200/55">
                  Deterministic sprint closure
                </p>
                <h2 id="hope-sprint-closure-title" className="mt-1 text-2xl font-black">
                  Finish the work, record what changed, choose what is next.
                </h2>
                <p className="mt-2 max-w-2xl text-xs leading-5 text-white/40">
                  Reads the same browser-local HopeAI sprint/checklist plus account-owned activity evidence. Receipts stay on this browser and are not hidden memory, usage analytics, or model training data.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close HopeAI sprint closure"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 text-white/45 hover:bg-white/[0.07] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-[1.05fr_0.95fr]">
              <section className="space-y-4">
                {!plan ? (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-6">
                    <BookOpenCheck className="h-7 w-7 text-white/25" />
                    <h3 className="mt-3 font-black">No valid saved sprint found</h3>
                    <p className="mt-2 text-sm leading-6 text-white/40">
                      Build a sprint in HopeAI first. Corrupted or non-deterministic plan snapshots are ignored rather than treated as evidence.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200/55">
                            Current sprint · {plan.focus}
                          </p>
                          <h3 className="mt-1 text-lg font-black">{plan.title}</h3>
                        </div>
                        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-white/45">
                          {completedStepIds.length}/{plan.steps.length} confirmed
                        </span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-cyan-300"
                          style={{
                            width: `${Math.round((completedStepIds.length / plan.steps.length) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {!complete ? (
                      <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-4">
                        <p className="text-xs font-black uppercase tracking-[0.15em] text-amber-100/65">
                          Closure is gated by the real checklist
                        </p>
                        <p className="mt-2 text-xs leading-5 text-white/40">
                          Finish and confirm every sprint step in the HopeAI coach before saving a completion receipt.
                        </p>
                        <div className="mt-3 space-y-2">
                          {incomplete.map(step => (
                            <div key={step.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-black/15 px-3 py-2">
                              <span className="text-xs text-white/55">{step.title}</span>
                              <Link href={step.href} onClick={() => setOpen(false)} className="inline-flex shrink-0 items-center text-[10px] font-bold text-sky-200 hover:text-white">
                                Open <ArrowRight className="ml-1 h-3 w-3" />
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.045] p-4">
                        <div className="flex items-center gap-2 text-emerald-100">
                          <CheckCircle2 className="h-4 w-4" />
                          <strong className="text-sm">All sprint steps are tester-confirmed</strong>
                        </div>
                        <label className="mt-4 block text-xs font-bold text-white/55" htmlFor="hope-sprint-reflection">
                          What changed or what did you learn?
                        </label>
                        <textarea
                          id="hope-sprint-reflection"
                          value={reflection}
                          maxLength={500}
                          onChange={event => setReflection(event.target.value)}
                          placeholder="Example: the route worked after refresh; the main friction was finding the return path."
                          className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-black/25 p-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-300/35"
                        />
                        <div className="mt-2 flex items-center justify-between text-[10px] text-white/30">
                          <span>{reflection.length}/500</span>
                          <span>5 characters minimum</span>
                        </div>
                        {activity.isLoading ? (
                          <p className="mt-3 text-xs text-white/35">Loading account activity evidence before closure…</p>
                        ) : activity.error ? (
                          <p className="mt-3 text-xs leading-5 text-amber-100/65">
                            Account activity evidence is unavailable. Closure is not saved until evidence can load; the coach itself remains usable without inventing missing counts.
                          </p>
                        ) : null}
                        <button
                          type="button"
                          onClick={saveReceipt}
                          disabled={!summary || reflection.trim().length < 5}
                          className="mt-4 w-full rounded-xl bg-white px-4 py-2.5 text-xs font-black text-[#071018] disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          {currentReceipt ? "Update local completion receipt" : "Save local completion receipt"}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {message ? (
                  <p className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs leading-5 text-white/55" role="status" aria-live="polite">
                    {message}
                  </p>
                ) : null}

                <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.035] p-4">
                  <div className="flex items-center gap-2 text-amber-100/70">
                    <ShieldCheck className="h-4 w-4" />
                    <strong className="text-xs">Truth boundary</strong>
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-white/40">
                    A receipt means a tester checked every listed sprint step and wrote a local reflection. It does not prove provider-backed AI, durable model memory, autonomous execution, production readiness, security, or business outcomes.
                  </p>
                </div>
              </section>

              <aside className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Local history</p>
                    <h3 className="mt-1 text-lg font-black">Recent closed sprints</h3>
                  </div>
                  <button type="button" onClick={loadSnapshot} className="inline-flex items-center text-[10px] font-bold text-white/35 hover:text-white">
                    <RotateCcw className="mr-1 h-3 w-3" /> Refresh
                  </button>
                </div>

                {history.length ? (
                  <div className="space-y-3">
                    {history.slice(0, 5).map(receipt => (
                      <article key={receipt.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-cyan-200/45">
                              {receipt.focus} · {receipt.stepCount} steps · local receipt
                            </p>
                            <h4 className="mt-1 text-sm font-black text-white/85">{receipt.planTitle}</h4>
                          </div>
                          <button type="button" aria-label={`Remove receipt for ${receipt.planTitle}`} onClick={() => removeReceipt(receipt.id)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 text-white/25 hover:text-rose-200">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-3 text-xs leading-5 text-white/45">{receipt.reflection}</p>
                        <div className="mt-3 rounded-xl border border-violet-300/10 bg-violet-300/[0.035] p-3">
                          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-violet-100/45">Deterministic next action</p>
                          <p className="mt-1 text-xs font-bold text-white/70">{receipt.nextAction.title}</p>
                          <p className="mt-1 text-[11px] leading-5 text-white/35">{receipt.nextAction.reason}</p>
                          <Link href={receipt.nextAction.href} onClick={() => setOpen(false)} className="mt-2 inline-flex items-center text-[10px] font-bold text-sky-200 hover:text-white">
                            Open next action <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </div>
                        <p className="mt-3 inline-flex items-center text-[9px] text-white/25">
                          <History className="mr-1 h-3 w-3" />
                          {new Date(receipt.completedAt).toLocaleString()}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center">
                    <History className="mx-auto h-7 w-7 text-white/20" />
                    <p className="mt-3 text-sm font-semibold text-white/60">No local sprint receipts yet</p>
                    <p className="mt-1 text-xs leading-5 text-white/30">Finish the current deterministic sprint and record a reflection to start the local history.</p>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
