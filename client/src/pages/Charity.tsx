import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Bot,
  Gamepad2,
  GraduationCap,
  HandHeart,
  Heart,
  Loader2,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

type Campaign = {
  id: "education-access" | "shelter-support" | "emergency-readiness";
  title: string;
  description: string;
  category: string;
  goalMinor: number;
  currency: string;
  status: string;
  beneficiaryLabel: string;
  pledgedMinor: number;
  pledgeCount: number;
  goalProgressPercent: number;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300/70";

function formatUsdMinor(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value / 100);
}

function dollarsToMinor(value: string): number | null {
  const normalized = value.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(minor) && minor > 0 ? minor : null;
}

function makeIdempotencyKey(prefix: string) {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  return prefix + ":" + suffix;
}

const ecosystemLinks = [
  { label: "HopeAI", href: "/hope-a-i", icon: Bot, detail: "Plan an impact project or outreach draft" },
  { label: "Social", href: "/activity-feed", icon: MessageCircleMore, detail: "Share a real update with the community" },
  { label: "SkySchool", href: "/sky-school", icon: GraduationCap, detail: "Continue a persisted learning path" },
  { label: "Gaming", href: "/gaming", icon: Gamepad2, detail: "Play a synced no-value arcade run" },
] as const;

export default function Charity() {
  const { user, loading, isAuthenticated } = useAuth();
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

  const [selectedCampaignId, setSelectedCampaignId] =
    useState<Campaign["id"]>("education-access");
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [volunteerCampaignId, setVolunteerCampaignId] =
    useState<Campaign["id"]>("shelter-support");
  const [volunteerType, setVolunteerType] = useState<
    "service" | "education" | "outreach" | "fundraising-prep" | "community-support"
  >("community-support");
  const [volunteerMinutes, setVolunteerMinutes] = useState("30");
  const [volunteerNote, setVolunteerNote] = useState("");

  const campaignRows = (campaigns.data?.campaigns ?? []) as Campaign[];
  const selectedCampaign =
    campaignRows.find(campaign => campaign.id === selectedCampaignId) ??
    campaignRows[0];
  const pledgeMinor = dollarsToMinor(pledgeAmount);
  const volunteerMinutesNumber = Number(volunteerMinutes);
  const journey = summary.data?.journey;

  const impactSummary = useMemo(() => {
    if (!summary.data) return "No account impact evidence loaded.";
    return [
      summary.data.pledgeCount + " pledge" + (summary.data.pledgeCount === 1 ? "" : "s"),
      summary.data.volunteerMinutes + " volunteer minutes",
      journey ? journey.completedCount + "/" + journey.totalCount + " ecosystem missions" : null,
    ]
      .filter(Boolean)
      .join(" · ");
  }, [journey, summary.data]);

  if (loading) {
    return <main className="min-h-screen bg-[#09090f] p-8 text-white">Loading SkyHope…</main>;
  }

  return (
    <main className="min-h-screen bg-[#09090f] p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="relative overflow-hidden rounded-[2rem] border border-rose-300/15 bg-gradient-to-br from-rose-500/[0.10] via-[#111118] to-amber-300/[0.06] p-6 md:p-8">
          <div className="absolute right-[-5rem] top-[-5rem] h-56 w-56 rounded-full bg-rose-400/10 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-rose-300/20 bg-rose-400/10">
                <Heart className="h-6 w-6 text-rose-200" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-200/70">SkyHope impact center</p>
                <h1 className="mt-1 text-3xl font-black md:text-4xl">Turn intent into recorded action.</h1>
              </div>
              <Badge variant="outline" className="border-emerald-300/25 text-emerald-100">
                Account-owned beta
              </Badge>
            </div>
            <p className="mt-5 max-w-4xl text-sm leading-7 text-white/55">
              SkyHope now records pledge intent and volunteer effort instead of displaying fake donor totals,
              fabricated DAO votes, or pretending a payment settled. Use HopeAI to plan the work, SkySchool to learn,
              Gaming to stay engaged, and Social to share real progress.
            </p>
          </div>
        </header>

        {!isAuthenticated ? (
          <Card className="border-amber-300/20 bg-amber-300/[0.04]">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-black">Sign in to persist your impact activity</h2>
                <p className="mt-1 text-sm text-white/45">
                  Campaign information is public. Pledges, volunteer records, and ecosystem progress are account scoped.
                </p>
              </div>
              <Button onClick={() => startLogin()}>Sign in</Button>
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Your pledge intents"
            value={summary.data ? String(summary.data.pledgeCount) : "—"}
            detail={summary.data ? formatUsdMinor(summary.data.pledgedMinor) + " pledged, not settled" : "Account evidence"}
          />
          <MetricCard
            label="Volunteer effort"
            value={summary.data ? String(summary.data.volunteerMinutes) + " min" : "—"}
            detail={summary.data ? String(summary.data.volunteerActionCount) + " recorded actions" : "Account evidence"}
          />
          <MetricCard
            label="Ecosystem journey"
            value={journey ? String(journey.completionPercent) + "%" : "—"}
            detail={journey ? journey.completedCount + "/" + journey.totalCount + " evidence-backed missions" : "Social · Learn · Play · Impact"}
          />
          <MetricCard
            label="Persistence"
            value={campaigns.data?.persistenceReady ? "Ready" : "Migration needed"}
            detail="No payment-provider settlement is claimed"
          />
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-100/55">Campaign catalog</p>
              <h2 className="mt-1 text-2xl font-black">Choose where you want to help.</h2>
            </div>
            <span className="text-xs text-white/35">Totals below are pledge intent, not money received.</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {campaignRows.map(campaign => (
              <button
                key={campaign.id}
                type="button"
                onClick={() => setSelectedCampaignId(campaign.id)}
                className={
                  "rounded-3xl border p-5 text-left transition " +
                  (selectedCampaignId === campaign.id
                    ? "border-rose-300/30 bg-rose-400/[0.07]"
                    : "border-white/10 bg-[#111118] hover:border-white/20")
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="outline">{campaign.category}</Badge>
                  <span className="text-xs text-white/35">{campaign.pledgeCount} pledges</span>
                </div>
                <h3 className="mt-4 text-xl font-black">{campaign.title}</h3>
                <p className="mt-2 min-h-16 text-sm leading-6 text-white/45">{campaign.description}</p>
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-white/40">Pledged intent</span>
                    <span className="font-bold text-rose-100">{formatUsdMinor(campaign.pledgedMinor)}</span>
                  </div>
                  <Progress value={campaign.goalProgressPercent} />
                  <div className="mt-2 flex items-center justify-between text-[11px] text-white/30">
                    <span>{campaign.goalProgressPercent.toFixed(2)}%</span>
                    <span>planning goal {formatUsdMinor(campaign.goalMinor)}</span>
                  </div>
                </div>
              </button>
            ))}
            {campaigns.isLoading ? <div className="text-sm text-white/40">Loading campaigns…</div> : null}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-[#111118]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HandHeart className="h-5 w-5 text-rose-200" />
                Record a pledge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-white/45">
                A pledge is a persisted expression of intent. It does not charge a card, move crypto, reserve funds,
                prove tax deductibility, or verify a beneficiary.
              </p>
              <label className="text-xs text-white/45">
                Campaign
                <select
                  className={inputClass}
                  value={selectedCampaignId}
                  onChange={event => setSelectedCampaignId(event.target.value as Campaign["id"])}
                >
                  {campaignRows.map(campaign => (
                    <option key={campaign.id} value={campaign.id}>{campaign.title}</option>
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
              <Button
                disabled={!isAuthenticated || !selectedCampaign || pledgeMinor === null || pledge.isPending}
                onClick={() => {
                  if (!selectedCampaign || pledgeMinor === null) return;
                  pledge.mutate({
                    campaignId: selectedCampaign.id,
                    amountMinor: pledgeMinor,
                    idempotencyKey: makeIdempotencyKey("skyhope-pledge"),
                  });
                }}
              >
                {pledge.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Heart className="mr-2 h-4 w-4" />}
                Record pledge intent
              </Button>
              {pledge.error ? <p className="text-sm text-red-300">{pledge.error.message}</p> : null}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#111118]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-sky-200" />
                Record volunteer effort
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-white/45">
                Keep an account-owned log of time you actually spent helping. SkyHope records what you enter; it does
                not independently verify attendance or assign financial value to volunteer time.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-white/45">
                  Campaign
                  <select
                    className={inputClass}
                    value={volunteerCampaignId}
                    onChange={event => setVolunteerCampaignId(event.target.value as Campaign["id"])}
                  >
                    {campaignRows.map(campaign => (
                      <option key={campaign.id} value={campaign.id}>{campaign.title}</option>
                    ))}
                  </select>
                </label>
                <label className="text-xs text-white/45">
                  Action
                  <select
                    className={inputClass}
                    value={volunteerType}
                    onChange={event => setVolunteerType(event.target.value as typeof volunteerType)}
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
                    placeholder="What did you work on?"
                    value={volunteerNote}
                    onChange={event => setVolunteerNote(event.target.value)}
                  />
                </label>
              </div>
              <Button
                disabled={
                  !isAuthenticated ||
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
                {volunteer.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HandHeart className="mr-2 h-4 w-4" />}
                Save volunteer record
              </Button>
              {volunteer.error ? <p className="text-sm text-red-300">{volunteer.error.message}</p> : null}
            </CardContent>
          </Card>
        </section>

        {journey ? (
          <Card className="border-amber-300/15 bg-gradient-to-br from-amber-300/[0.05] to-[#111118]">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-100/55">Connected ecosystem</p>
                  <CardTitle className="mt-1">Your evidence-backed beta journey</CardTitle>
                </div>
                <Badge variant="outline">{impactSummary}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-4">
                {journey.missions.map(mission => (
                  <Link
                    key={mission.id}
                    href={mission.route}
                    className="rounded-2xl border border-white/10 bg-black/15 p-4 transition hover:border-amber-200/25"
                  >
                    <div className="flex items-center justify-between">
                      <strong>{mission.label}</strong>
                      <Badge variant="outline" className={mission.complete ? "border-emerald-300/30 text-emerald-100" : ""}>
                        {mission.complete ? "Done" : "Next"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-white/35">{mission.evidence}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={journey.nextMission.route}>
                  <Button>
                    Continue: {journey.nextMission.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/hope-a-i">
                  <Button variant="outline">
                    <Bot className="mr-2 h-4 w-4" />
                    Ask HopeAI to plan the next step
                  </Button>
                </Link>
                <Link href="/activity-feed">
                  <Button variant="ghost">
                    <MessageCircleMore className="mr-2 h-4 w-4" />
                    Share progress on Social
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ecosystemLinks.map(({ label, href, icon: Icon, detail }) => (
            <Link
              key={label}
              href={href}
              className="rounded-2xl border border-white/10 bg-[#111118] p-4 transition hover:-translate-y-0.5 hover:border-amber-200/20"
            >
              <Icon className="h-5 w-5 text-amber-100" />
              <h3 className="mt-3 font-black">{label}</h3>
              <p className="mt-1 text-xs leading-5 text-white/35">{detail}</p>
            </Link>
          ))}
        </section>

        <Card className="border-emerald-300/15 bg-emerald-300/[0.035]">
          <CardContent className="flex gap-3 p-5 text-sm leading-6 text-white/55">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200" />
            <p>
              SkyHope is an impact-recording engineering beta. It does not currently process donations, hold funds,
              broadcast blockchain transfers, verify charities or beneficiaries, determine tax deductibility, or
              guarantee outcomes. Future payment execution remains behind separate provider/legal/region controls.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card className="border-white/10 bg-[#111118]">
      <CardContent className="p-5">
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/35">{label}</div>
        <div className="mt-2 text-2xl font-black">{value}</div>
        <div className="mt-1 text-xs leading-5 text-white/30">{detail}</div>
      </CardContent>
    </Card>
  );
}
