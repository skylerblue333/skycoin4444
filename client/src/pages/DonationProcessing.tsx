import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Clipboard,
  HeartHandshake,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  createSkyHopeDonationPreview,
  donationPlanningLabels,
  scoreDonationPlanningReadiness,
  type DonationPlanningChecklist,
  type SkyHopeDonationPreview,
} from "@/lib/skyHopeDonationIntent";

const DEFAULT_CHECKLIST: DonationPlanningChecklist = {
  campaignReviewed: false,
  beneficiaryEvidenceReviewed: false,
  providerSelected: false,
  legalBoundaryReviewed: false,
  reconciliationPlanDefined: false,
};

const HOPEAI_PRIVATE_HANDOFF_PROMPT =
  "Help me review a HopeAI Impact donation-intent planning brief. I will paste the private details into HopeAI myself. Do not claim a payment, donation, receipt, settlement, tax deduction, or beneficiary verification occurred.";

export default function DonationProcessing() {
  const [campaignId, setCampaignId] = useState("community-support-sprint");
  const [contributorReference, setContributorReference] = useState("beta-tester");
  const [amountMajor, setAmountMajor] = useState(25);
  const [currency, setCurrency] = useState("USD");
  const [checklist, setChecklist] =
    useState<DonationPlanningChecklist>(DEFAULT_CHECKLIST);
  const [preview, setPreview] = useState<SkyHopeDonationPreview | null>(null);
  const [error, setError] = useState("");

  const readiness = useMemo(
    () => scoreDonationPlanningReadiness(checklist),
    [checklist]
  );

  function buildPreview() {
    setError("");
    try {
      setPreview(
        createSkyHopeDonationPreview({
          campaignId,
          contributorReference,
          amountMajor,
          currency,
        })
      );
    } catch (cause) {
      setPreview(null);
      setError(
        cause instanceof Error ? cause.message : "Donation preview is invalid."
      );
    }
  }

  const privateReviewBrief = preview
    ? [
        "# HopeAI Impact donation-intent review",
        "",
        "Planning exercise only. No money moved.",
        "Campaign: " + preview.campaignId,
        "Contributor reference: " + preview.contributorReference,
        "Amount preview: " + preview.amountMajor.toFixed(2) + " " + preview.currency,
        "Planning readiness: " + readiness.score + "%.",
        readiness.missing.length
          ? "Missing planning gates: " + readiness.missing.join("; ")
          : "All local planning checklist items are marked complete, but external verification is still required.",
        "",
        "Review request: Give me the next safest planning and verification steps. Do not claim a payment, receipt, settlement, tax deduction, beneficiary verification, or provider execution occurred.",
      ].join("\n")
    : "";

  async function copyPrivateReviewBrief() {
    if (!privateReviewBrief) {
      toast.error("Build a local preview before copying the review brief.");
      return;
    }
    try {
      await navigator.clipboard.writeText(privateReviewBrief);
      toast.success("Private review brief copied. Paste it into HopeAI when ready.");
    } catch {
      toast.error("Clipboard access is unavailable.");
    }
  }

  const hopeHref =
    "/hope-a-i?source=skyhope&prompt=" +
    encodeURIComponent(HOPEAI_PRIVATE_HANDOFF_PROMPT);

  return (
    <main className="min-h-screen bg-[#07090f] px-4 py-12 text-white md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-rose-400/30 bg-rose-400/10 text-rose-100">
            <ReceiptText className="mr-1 h-3.5 w-3.5" />
            Donation intent preview
          </Badge>
          <Badge variant="outline" className="border-amber-300/25 text-amber-100">
            Local planning only
          </Badge>
        </div>

        <div className="mt-5 max-w-3xl">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Prepare the handoff without pretending money moved.
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/55 md:text-base">
            This surface validates a bounded contribution intent and a manual
            readiness checklist. It does not contact a payment provider, move
            funds, create a receipt, verify a charity, or perform settlement.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm leading-6 text-amber-50/80">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
            <p>
              Privacy boundary: campaign and contributor details are kept out of
              the HopeAI URL. Copy the private review brief explicitly, then paste
              it into HopeAI only if you want those details included in the chat.
              Avoid names, contact details, account numbers, medical details, or
              other sensitive beneficiary information unless it is genuinely
              necessary and appropriate to share.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-rose-300" />
              <h2 className="text-xl font-black">Contribution intent</h2>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold md:col-span-2">
                Campaign reference
                <Input
                  value={campaignId}
                  maxLength={80}
                  onChange={event => setCampaignId(event.target.value)}
                  className="mt-2"
                />
              </label>
              <label className="text-sm font-semibold">
                Contributor reference
                <Input
                  value={contributorReference}
                  maxLength={80}
                  onChange={event => setContributorReference(event.target.value)}
                  className="mt-2"
                />
              </label>
              <label className="text-sm font-semibold">
                Currency
                <Input
                  value={currency}
                  maxLength={3}
                  onChange={event => setCurrency(event.target.value.toUpperCase())}
                  className="mt-2 uppercase"
                />
              </label>
              <label className="text-sm font-semibold">
                Amount
                <Input
                  type="number"
                  min={0.01}
                  max={100000}
                  step={0.01}
                  value={amountMajor}
                  onChange={event => setAmountMajor(Number(event.target.value))}
                  className="mt-2"
                />
              </label>
            </div>

            {error ? (
              <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-100">
                {error}
              </p>
            ) : null}

            <Button onClick={buildPreview} className="mt-5">
              Build local preview
            </Button>

            {preview ? (
              <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4">
                <div className="flex items-center gap-2 text-emerald-100">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-black">Validated local preview</p>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-white/40">Normalized amount</dt>
                    <dd className="mt-1 font-bold">
                      {preview.amountMajor.toFixed(2)} {preview.currency}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/40">Minor units</dt>
                    <dd className="mt-1 font-bold">
                      {preview.amountMinor.toLocaleString()}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-white/40">Preview reference</dt>
                    <dd className="mt-1 break-all font-mono text-xs text-white/70">
                      {preview.previewReference}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs leading-5 text-white/40">
                  Provenance: {preview.provenance}. This identifier is not a
                  processor transaction ID or receipt.
                </p>
              </div>
            ) : null}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-200" />
              <h2 className="text-xl font-black">Planning gates</h2>
            </div>
            <div className="mt-5 flex items-end gap-3">
              <span className="text-4xl font-black">{readiness.score}%</span>
              <span className="pb-1 text-xs text-white/40">
                self-attested planning completeness
              </span>
            </div>
            <Progress value={readiness.score} className="mt-3" />

            <div className="mt-5 space-y-2">
              {donationPlanningLabels.map(item => {
                const checked = checklist[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setChecklist(current => ({
                        ...current,
                        [item.key]: !current[item.key],
                      }))
                    }
                    className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-left text-sm transition hover:border-white/20"
                  >
                    {checked ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
                    ) : (
                      <span className="h-5 w-5 shrink-0 rounded-full border border-white/25" />
                    )}
                    {item.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-xs leading-5 text-white/35">
              Checking a box records only your local planning state. SKYCOIN4444
              has not independently verified these items.
            </p>
          </section>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <Link
            href="/charity"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold transition hover:border-rose-300/25"
          >
            Back to HopeAI Impact <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
          <Link
            href="/fundraiser-tools"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold transition hover:border-rose-300/25"
          >
            Open fundraiser tools <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={copyPrivateReviewBrief}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left text-sm font-bold transition hover:border-white/20"
          >
            <Clipboard className="mr-1 inline h-4 w-4" />
            Copy private review brief
          </button>
          <Link
            href={hopeHref}
            className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.06] p-4 text-sm font-black text-rose-100 transition hover:border-rose-300/35"
          >
            <Sparkles className="mr-1 inline h-4 w-4" />
            Open HopeAI, then paste
          </Link>
        </div>
      </div>
    </main>
  );
}
