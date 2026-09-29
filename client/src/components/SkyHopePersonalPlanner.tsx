import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, History, Target } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import {
  SKYHOPE_COMMITMENT_STORAGE_KEY,
  buildImpactPlan,
  impactPlanToText,
  impactPrograms,
  normalizeImpactCommitment,
  type ImpactCommitment,
  type ImpactProgramId,
} from "@/lib/skyHopeImpact";

const defaultCommitment: ImpactCommitment = {
  programId: "shelter-support",
  volunteerHours: 2,
  supplyKits: 0,
  focus: "",
};

function loadCommitment(): ImpactCommitment {
  if (typeof window === "undefined") return defaultCommitment;
  try {
    const raw = window.localStorage.getItem(SKYHOPE_COMMITMENT_STORAGE_KEY);
    return raw
      ? normalizeImpactCommitment(JSON.parse(raw))
      : defaultCommitment;
  } catch {
    return defaultCommitment;
  }
}

export default function SkyHopePersonalPlanner() {
  const [commitment, setCommitment] =
    useState<ImpactCommitment>(defaultCommitment);
  const [hydrated, setHydrated] = useState(false);
  const [savedMessage, setSavedMessage] = useState("Not saved in this session.");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCommitment(loadCommitment());
    setHydrated(true);
  }, []);

  const plan = useMemo(() => buildImpactPlan(commitment), [commitment]);
  const readiness = Math.round(
    ((Number(commitment.volunteerHours > 0) +
      Number(commitment.supplyKits > 0) +
      Number(commitment.focus.trim().length > 0)) /
      3) *
      100,
  );

  function update(patch: Partial<ImpactCommitment>) {
    setCommitment(current =>
      normalizeImpactCommitment({ ...current, ...patch }),
    );
    setCopied(false);
    setSavedMessage("Changed since last save.");
  }

  function save() {
    try {
      const normalized = normalizeImpactCommitment(commitment);
      window.localStorage.setItem(
        SKYHOPE_COMMITMENT_STORAGE_KEY,
        JSON.stringify(normalized),
      );
      setCommitment(normalized);
      setSavedMessage("Saved on this device.");
    } catch {
      setSavedMessage("Device storage is unavailable.");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(impactPlanToText(plan));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="border-emerald-300/20 bg-emerald-300/[0.035] text-white">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-300/12 text-emerald-100">
              Device-local planner
            </Badge>
            <Badge
              variant="outline"
              className="border-white/10 text-white/40"
            >
              Not impact evidence
            </Badge>
          </div>
          <CardTitle className="mt-2 flex items-center gap-2 text-white">
            <Target className="h-5 w-5 text-emerald-200" />
            Make one practical commitment
          </CardTitle>
          <CardDescription className="leading-6 text-white/45">
            Reserve time or prepare a supply plan without pretending the work is
            already complete.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/35">
              Impact direction
            </span>
            <select
              value={commitment.programId}
              onChange={event =>
                update({
                  programId: event.target.value as ImpactProgramId,
                })
              }
              className="h-11 w-full rounded-xl border border-white/10 bg-[#0b0b16] px-3 text-sm text-white"
            >
              {impactPrograms.map(program => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/35">
                Volunteer hours to reserve
              </span>
              <Input
                type="number"
                min={0}
                max={40}
                value={commitment.volunteerHours}
                onChange={event =>
                  update({ volunteerHours: Number(event.target.value) })
                }
                className="border-white/10 bg-black/20"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/35">
                Supply kits after confirmation
              </span>
              <Input
                type="number"
                min={0}
                max={100}
                value={commitment.supplyKits}
                onChange={event =>
                  update({ supplyKits: Number(event.target.value) })
                }
                className="border-white/10 bg-black/20"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/35">
              Personal focus
            </span>
            <Input
              maxLength={240}
              value={commitment.focus}
              onChange={event => update({ focus: event.target.value })}
              placeholder="Example: help a shelter sort donated technology"
              className="border-white/10 bg-black/20"
            />
          </label>

          <div>
            <div className="flex items-center justify-between text-xs text-white/35">
              <span>Plan readiness</span>
              <span>{readiness}%</span>
            </div>
            <Progress value={readiness} className="mt-2 h-2" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={save} disabled={!hydrated}>
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Save on device
            </Button>
            <Button
              variant="outline"
              className="border-white/15 bg-white/[0.03] text-white"
              onClick={copy}
            >
              <History className="mr-2 h-4 w-4" />
              {copied ? "Copied" : "Copy plan"}
            </Button>
          </div>

          <p className="text-xs leading-5 text-white/30">{savedMessage}</p>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-white">{plan.title} action plan</CardTitle>
          <CardDescription className="text-white/45">
            Generated deterministically from the packaged SkyHope planning core.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <ol className="space-y-3">
            {plan.steps.map((step, index) => (
              <li
                key={step}
                className="flex gap-3 text-sm leading-6 text-white/46"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] text-[10px] font-black text-emerald-100">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.035] p-4">
            <p className="text-sm font-bold text-amber-100">Evidence to keep</p>
            <ul className="mt-2 space-y-1 text-xs leading-5 text-white/38">
              {plan.evidenceChecklist.map(item => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <p className="text-xs leading-5 text-white/28">
            No payment, token transfer, tax receipt, charity partnership, or
            real-world outcome is created by saving this plan.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
