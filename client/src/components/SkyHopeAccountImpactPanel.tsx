import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Bot,
  Clock3,
  HeartHandshake,
  Loader2,
  MessageCircleMore,
  ShieldCheck,
} from "lucide-react";

type CampaignId =
  | "education-access"
  | "shelter-support"
  | "emergency-readiness";

type VolunteerType =
  | "service"
  | "education"
  | "outreach"
  | "fundraising-prep"
  | "community-support";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-rose-300/50";

function dollarsToMinor(value: string): number | null {
  const normalized = value.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(minor) && minor > 0 ? minor : null;
}

function usdMinor(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value / 100);
}

function idempotencyKey() {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  return "skyhope-pledge:" + suffix;
}

export default function SkyHopeAccountImpactPanel() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const campaigns = trpc.charity.campaigns.useQuery(undefined, { retry: false });
  const summary = trpc.charity.summary.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const pledge = trpc.charity.pledge.useMutation({
    onSuccess: async () => {
      setPledgeAmount("");
      await Promise.all([campaigns.refetch(), summary.refetch()]);
    },
  });
  const volunteer = trpc.charity.volunteer.useMutation({
    onSuccess: async () => {
      setVolunteerMinutes("30");
      setVolunteerNote("");
      await summary.refetch();
    },
  });

  const [campaignId, setCampaignId] =
    useState<CampaignId>("education-access");
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [volunteerCampaignId, setVolunteerCampaignId] =
    useState<CampaignId>("shelter-support");
  const [volunteerType, setVolunteerType] =
    useState<VolunteerType>("community-support");
  const [volunteerMinutes, setVolunteerMinutes] = useState("30");
  const [volunteerNote, setVolunteerNote] = useState("");

  const pledgeMinor = dollarsToMinor(pledgeAmount);
  const volunteerMinutesNumber = Number(volunteerMinutes);
  const journey = summary.data?.journey;

  return (
    <section className="rounded-[2rem] border border-emerald-300/15 bg-emerald-300/[0.035] p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200/65">
            Account-owned impact evidence
          </p>
          <h2 className="mt-2 text-2xl font-black">Persist what you actually do.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
            The planner above can stay device-local. This layer records pledge intent and volunteer time against
            your invited beta account and connects that evidence to Social, SkySchool, Gaming, and the beta journey.
          </p>
        </div>
        <Badge variant="outline" className="border-emerald-300/25 text-emerald-100">
          No payment execution
        </Badge>
      </div>

      {!authLoading && !isAuthenticated ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-4">
          <p className="font-bold">Sign in to persist impact activity.</p>
          <p className="mt-1 text-sm text-white/45">
            Campaign planning remains available without an account.
          </p>
          <Button className="mt-3" onClick={() => startLogin()}>
            Sign in
          </Button>
        </div>
      ) : null}

      {isAuthenticated ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              label="Pledge intents"
              value={summary.data ? String(summary.data.pledgeCount) : "—"}
              detail={summary.data ? usdMinor(summary.data.pledgedMinor) + " pledged, not settled" : "Loading evidence"}
            />
            <Metric
              label="Volunteer time"
              value={summary.data ? String(summary.data.volunteerMinutes) + " min" : "—"}
              detail={summary.data ? summary.data.volunteerActionCount + " recorded actions" : "Loading evidence"}
            />
            <Metric
              label="Connected journey"
              value={journey ? journey.completionPercent + "%" : "—"}
              detail={journey ? journey.completedCount + "/" + journey.totalCount + " missions complete" : "Social · Learn · Play · Impact"}
            />
            <Metric
              label="Impact database"
              value={summary.data?.persistenceReady ? "Ready" : "Migration needed"}
              detail="Migration 0015 activates account writes"
            />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-rose-300" />
                <h3 className="font-black">Record pledge intent</h3>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/40">
                This stores an intent record only. It does not charge a card, move crypto, reserve money,
                verify a beneficiary, or establish tax deductibility.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-white/45">
                  Cause track
                  <select
                    className={inputClass}
                    value={campaignId}
                    onChange={event => setCampaignId(event.target.value as CampaignId)}
                  >
                    {(campaigns.data?.campaigns ?? []).map(campaign => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs text-white/45">
                  Pledge amount (USD)
                  <input
                    className={inputClass}
                    inputMode="decimal"
                    placeholder="25.00"
                    value={pledgeAmount}
                    onChange={event => setPledgeAmount(event.target.value)}
                  />
                </label>
              </div>
              <Button
                className="mt-3"
                disabled={pledgeMinor === null || pledge.isPending}
                onClick={() => {
                  if (pledgeMinor === null) return;
                  pledge.mutate({
                    campaignId,
                    amountMinor: pledgeMinor,
                    idempotencyKey: idempotencyKey(),
                  });
                }}
              >
                {pledge.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save pledge intent
              </Button>
              {pledge.error ? <p className="mt-2 text-xs text-red-300">{pledge.error.message}</p> : null}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <div className="flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-sky-300" />
                <h3 className="font-black">Record volunteer activity</h3>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/40">
                Record time you actually spent helping. The beta stores your entry but does not independently
                verify attendance or convert volunteer time into financial value.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-white/45">
                  Cause track
                  <select
                    className={inputClass}
                    value={volunteerCampaignId}
                    onChange={event => setVolunteerCampaignId(event.target.value as CampaignId)}
                  >
                    {(campaigns.data?.campaigns ?? []).map(campaign => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs text-white/45">
                  Activity
                  <select
                    className={inputClass}
                    value={volunteerType}
                    onChange={event => setVolunteerType(event.target.value as VolunteerType)}
                  >
                    <option value="community-support">Community support</option>
                    <option value="service">Service</option>
                    <option value="education">Education</option>
                    <option value="outreach">Outreach</option>
                    <option value="fundraising-prep">Fundraising preparation</option>
                  </select>
                </label>
                <label className="text-xs text-white/45">
                  Minutes
                  <input
                    className={inputClass}
                    inputMode="numeric"
                    value={volunteerMinutes}
                    onChange={event => setVolunteerMinutes(event.target.value)}
                  />
                </label>
                <label className="text-xs text-white/45">
                  Note
                  <input
                    className={inputClass}
                    maxLength={255}
                    value={volunteerNote}
                    onChange={event => setVolunteerNote(event.target.value)}
                    placeholder="What did you work on?"
                  />
                </label>
              </div>
              <Button
                className="mt-3"
                variant="outline"
                disabled={
                  volunteer.isPending ||
                  !Number.isSafeInteger(volunteerMinutesNumber) ||
                  volunteerMinutesNumber < 5 ||
                  volunteerMinutesNumber > 1440
                }
                onClick={() =>
                  volunteer.mutate({
                    campaignId: volunteerCampaignId,
                    actionType: volunteerType,
                    minutes: volunteerMinutesNumber,
                    note: volunteerNote || undefined,
                  })
                }
              >
                {volunteer.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save volunteer record
              </Button>
              {volunteer.error ? <p className="mt-2 text-xs text-red-300">{volunteer.error.message}</p> : null}
            </div>
          </div>

          {journey ? (
            <div className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[0.035] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200/60">
                    Cross-system evidence
                  </p>
                  <h3 className="mt-1 font-black">Your connected beta loop</h3>
                </div>
                <span className="text-xs text-white/45">
                  {journey.completedCount}/{journey.totalCount} complete
                </span>
              </div>
              <Progress className="mt-3" value={journey.completionPercent} />
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {journey.missions.map(mission => (
                  <Link
                    key={mission.id}
                    href={mission.route}
                    className="rounded-xl border border-white/10 bg-black/15 p-3 transition hover:border-amber-200/20"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold">{mission.label}</span>
                      <Badge variant="outline" className={mission.complete ? "border-emerald-300/30 text-emerald-100" : ""}>
                        {mission.complete ? "Done" : "Open"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-[11px] leading-5 text-white/35">{mission.evidence}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={journey.nextMission.route}>
                  <Button size="sm">
                    Continue next step <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/hope-a-i">
                  <Button size="sm" variant="outline">
                    <Bot className="mr-1.5 h-4 w-4" />
                    Ask HopeAI
                  </Button>
                </Link>
                <Link href="/activity-feed">
                  <Button size="sm" variant="ghost">
                    <MessageCircleMore className="mr-1.5 h-4 w-4" />
                    Open Social
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}

          <div className="mt-5 flex gap-3 rounded-2xl border border-white/10 bg-black/10 p-4 text-xs leading-5 text-white/35">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />
            <p>
              Account impact evidence is non-financial. No payment settlement, custody, blockchain donation,
              beneficiary verification, tax status, or authoritative volunteer verification is created by these records.
            </p>
          </div>
        </>
      ) : null}
    </section>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">{label}</div>
      <div className="mt-2 text-2xl font-black">{value}</div>
      <div className="mt-1 text-[11px] leading-5 text-white/30">{detail}</div>
    </div>
  );
}
