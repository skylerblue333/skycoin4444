import { useEffect, useState } from "react";
import { FileCheck2, X } from "lucide-react";
import { v3Journeys, type V3JourneyId } from "@/lib/v3Journeys";
import {
  V3_JOURNEY_EVIDENCE_KEY,
  createV3JourneyEvidenceReceipt,
  getV3JourneyEvidenceCoveragePercent,
  getV3JourneyStageReceipt,
  normalizeV3JourneyEvidenceJournal,
  removeV3JourneyEvidenceReceipt,
  upsertV3JourneyEvidenceReceipt,
  type V3JourneyEvidenceJournal,
} from "@/lib/v3JourneyEvidence";

function makeId() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `evidence-${Date.now()}`;
}

export default function V3JourneyEvidenceCompanion() {
  const [open, setOpen] = useState(false);
  const [journeyId, setJourneyId] = useState<V3JourneyId>("social");
  const [journal, setJournal] = useState<V3JourneyEvidenceJournal>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setJournal(
        normalizeV3JourneyEvidenceJournal(
          JSON.parse(localStorage.getItem(V3_JOURNEY_EVIDENCE_KEY) ?? "{}")
        )
      );
    } catch {
      setJournal({});
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(V3_JOURNEY_EVIDENCE_KEY, JSON.stringify(journal));
    } catch {
      // Keep the notebook usable in memory when storage is blocked.
    }
  }, [hydrated, journal]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (event.key === "Escape" && open) setOpen(false);
      if (!typing && event.shiftKey && event.key.toLowerCase() === "e") {
        event.preventDefault();
        setOpen(current => !current);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const journey = v3Journeys.find(item => item.id === journeyId) ?? v3Journeys[0];
  const coverage = getV3JourneyEvidenceCoveragePercent(journal, journey.id);

  const save = (stageId: string) => {
    const key = `${journey.id}:${stageId}`;
    const note = (drafts[key] ?? "").trim();
    if (note.length < 8) return;
    const receipt = createV3JourneyEvidenceReceipt({
      id: makeId(),
      journeyId: journey.id,
      stageId,
      note,
      recordedAt: new Date().toISOString(),
    });
    setJournal(current => upsertV3JourneyEvidenceReceipt(current, receipt));
    setDrafts(current => ({ ...current, [key]: "" }));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 rounded-xl border border-emerald-300/20 bg-[#0b0b1c]/95 px-3 py-2 text-xs font-bold text-emerald-100 shadow-xl"
      >
        Evidence · Shift+E
      </button>
      {open ? (
        <div className="fixed inset-0 z-[121] overflow-y-auto bg-[#020208]/95 p-4 text-white" role="dialog" aria-modal="true">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-[#080817] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200/60">Tester evidence notebook</p>
                <h2 className="mt-2 text-2xl font-black">Record what actually worked.</h2>
                <p className="mt-2 max-w-2xl text-sm text-white/45">Local tester-entered observations only—not telemetry, automated verification, security certification, or production-readiness proof.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close evidence notebook" className="rounded-xl border border-white/10 p-2 text-white/60">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <label className="text-xs font-bold text-white/60">
                Journey
                <select value={journeyId} onChange={event => setJourneyId(event.target.value as V3JourneyId)} className="mt-1 block w-full rounded-xl border border-white/10 bg-[#101024] px-3 py-2 text-white">
                  {v3Journeys.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
              <div className="rounded-xl border border-emerald-300/15 bg-emerald-300/[0.04] px-4 py-2 text-sm font-bold text-emerald-100">{coverage}% evidence coverage</div>
            </div>

            <p className="mt-4 rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-3 text-xs leading-5 text-white/45">{journey.boundary}</p>

            <div className="mt-4 space-y-3">
              {journey.stages.map(stage => {
                const receipt = getV3JourneyStageReceipt(journal, journey.id, stage.id);
                const key = `${journey.id}:${stage.id}`;
                const draft = drafts[key] ?? "";
                return (
                  <section key={stage.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-black">{stage.title}</h3>
                        <p className="mt-1 text-xs text-white/35">{stage.route}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">{receipt ? "receipt recorded" : "needs evidence"}</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-white/45">{stage.evidence}</p>
                    {receipt ? (
                      <div className="mt-3 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.03] p-3">
                        <p className="text-xs text-white/55">{receipt.note}</p>
                        <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-white/30">
                          <span>{new Date(receipt.recordedAt).toLocaleString()}</span>
                          <button type="button" onClick={() => setJournal(current => removeV3JourneyEvidenceReceipt(current, journey.id, stage.id))} className="font-bold text-white/55 hover:text-white">Remove</button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <textarea value={draft} maxLength={500} rows={2} onChange={event => setDrafts(current => ({ ...current, [key]: event.target.value }))} placeholder="What did you observe after completing this step?" className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70 outline-none" />
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-white/25">Minimum 8 characters · saved only in this browser</span>
                          <button type="button" disabled={draft.trim().length < 8} onClick={() => save(stage.id)} className="inline-flex items-center rounded-lg bg-emerald-200 px-2.5 py-1.5 text-[10px] font-black text-[#07120f] disabled:opacity-35">
                            <FileCheck2 className="mr-1 h-3 w-3" />Save receipt
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
