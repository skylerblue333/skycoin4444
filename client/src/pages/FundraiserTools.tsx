import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Clipboard,
  HeartHandshake,
  Save,
  Sparkles,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SKYHOPE_DRAFT_KEY,
  createSkyHopeCampaignPlan,
  normalizeSkyHopeCampaignDraft,
  type SkyHopeCampaignDraft,
  type SkyHopeCampaignPlan,
} from "@/lib/skyHopeImpact";

const DEFAULT_DRAFT: SkyHopeCampaignDraft = {
  title: "Community support sprint",
  mission:
    "Coordinate one bounded community-support effort with consent, evidence, and follow-up.",
  beneficiaryScope: "People who voluntarily opt into the local support effort",
  targetOutcome: "Completed support actions with a documented outcome check",
  targetCount: 25,
  durationDays: 30,
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

export default function FundraiserTools() {
  const [draft, setDraft] = useState<SkyHopeCampaignDraft>(() => loadDraft());
  const [plan, setPlan] = useState<SkyHopeCampaignPlan | null>(null);
  const [error, setError] = useState("");

  const organizerBrief = useMemo(() => {
    if (!plan) return "";
    return [
      "# SkyHope organizer brief",
      "",
      "Campaign: " + plan.title,
      "Mission: " + plan.mission,
      "Beneficiary scope: " + plan.beneficiaryScope,
      "Measured outcome: " + plan.targetOutcome,
      "Target count: " + plan.targetCount,
      "Duration: " + plan.durationDays + " days",
      "",
      "Evidence checkpoints:",
      ...plan.milestones.map(
        milestone =>
          "- Day " +
          milestone.targetDay +
          ": " +
          milestone.label +
          " — " +
          milestone.evidencePrompt
      ),
      "",
      "Boundary: local planning artifact only. No campaign publication, donation collection, beneficiary verification, tax status, payment execution, custody, or settlement is asserted.",
    ].join("\n");
  }, [plan]);

  function buildPlan() {
    setError("");
    try {
      setPlan(createSkyHopeCampaignPlan(draft));
    } catch (cause) {
      setPlan(null);
      setError(
        cause instanceof Error ? cause.message : "Campaign plan is invalid."
      );
    }
  }

  function saveDraft() {
    try {
      window.localStorage.setItem(SKYHOPE_DRAFT_KEY, JSON.stringify(draft));
      toast.success("SkyHope draft saved on this device.");
    } catch {
      toast.error("Browser storage is unavailable.");
    }
  }

  async function copyBrief() {
    if (!organizerBrief) return;
    try {
      await navigator.clipboard.writeText(organizerBrief);
      toast.success("Organizer brief copied.");
    } catch {
      toast.error("Clipboard access is unavailable.");
    }
  }

  const hopePrompt = organizerBrief
    ? [
        "Review this SkyHope organizer brief and improve it as a planning document.",
        "Keep beneficiary privacy, consent, evidence quality, and realistic measurement central.",
        "Do not claim the campaign is published, verified, tax-deductible, funded, or connected to a payment provider.",
        "",
        organizerBrief,
      ].join("\n")
    : "Help me turn a SkyHope cause idea into a bounded organizer brief with evidence checkpoints and no unverified payment claims.";

  return (
    <main className="min-h-screen bg-[#07090f] px-4 py-12 text-white md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-rose-400/30 bg-rose-400/10 text-rose-100">
            <HeartHandshake className="mr-1 h-3.5 w-3.5" />
            SkyHope fundraiser tools
          </Badge>
          <Badge variant="outline" className="border-white/15 text-white/60">
            Organizer planning · no fundraising execution
          </Badge>
        </div>

        <div className="mt-5 max-w-3xl">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Turn a cause into an evidence-first organizer brief.
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/55 md:text-base">
            Build a deterministic campaign timeline, keep the draft on this
            device, copy the brief, and hand it to HopeAI for review. Nothing
            here publishes a fundraiser or collects money.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-rose-300" />
              <h2 className="text-xl font-black">Campaign draft</h2>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="text-sm font-semibold">
                Title
                <Input
                  value={draft.title}
                  onChange={event =>
                    setDraft(current => ({ ...current, title: event.target.value }))
                  }
                  className="mt-2"
                />
              </label>
              <label className="text-sm font-semibold">
                Mission
                <textarea
                  value={draft.mission}
                  onChange={event =>
                    setDraft(current => ({ ...current, mission: event.target.value }))
                  }
                  className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-rose-300/40"
                />
              </label>
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
              <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            {error ? (
              <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-100">
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={buildPlan}>
                <Sparkles className="mr-2 h-4 w-4" />
                Build organizer brief
              </Button>
              <Button variant="outline" onClick={saveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Save draft
              </Button>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
            <h2 className="text-xl font-black">Evidence timeline</h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              Checkpoints are generated from the campaign duration. They are
              prompts for evidence, not claims that work occurred.
            </p>

            {plan ? (
              <div className="mt-5 space-y-3">
                {plan.milestones.map(milestone => (
                  <div
                    key={milestone.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        <p className="font-black">{milestone.label}</p>
                      </div>
                      <Badge variant="outline">Day {milestone.targetDay}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/45">
                      {milestone.evidencePrompt}
                    </p>
                  </div>
                ))}

                <Button variant="outline" onClick={copyBrief} className="w-full">
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copy organizer brief
                </Button>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/15 p-6 text-sm leading-6 text-white/40">
                Build the brief to generate a bounded evidence timeline.
              </div>
            )}
          </section>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Link
            href="/charity"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold hover:border-rose-300/25"
          >
            Back to SkyHope <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
          <Link
            href="/donation-processing"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold hover:border-rose-300/25"
          >
            Donation intent preview <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
          <Link
            href={"/hope-a-i?source=skyhope&prompt=" + encodeURIComponent(hopePrompt)}
            className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.06] p-4 text-sm font-black text-rose-100 hover:border-rose-300/35"
          >
            <Sparkles className="mr-1 inline h-4 w-4" />
            Improve with HopeAI
          </Link>
        </div>
      </div>
    </main>
  );
}
