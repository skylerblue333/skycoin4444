import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  HandHeart,
  Heart,
  Info,
  Loader2,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

type CampaignView = {
  id: string;
  title: string;
  summary: string;
  category: string;
  goalMinor: number;
  pledgedMinor: number;
  currency: string;
  status: "open" | "paused" | "complete";
  evidenceLevel: "demo-catalog";
  fundUsePlan: readonly string[];
  impactMetric: {
    label: string;
    target: number;
    unit: string;
  };
};

function formatMoney(minor: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(minor / 100);
}

function createIntentKey() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    ("skyhope-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10))
  );
}

function PledgeDialog({
  campaign,
  onPlanned,
}: {
  campaign: CampaignView;
  onPlanned: (projectedMinor: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);

  const planner = trpc.charity.planPledge.useMutation({
    onSuccess: result => {
      if (!result.accepted) {
        toast.error("Pledge plan rejected: " + (result.reason ?? "invalid request"));
        return;
      }
      onPlanned(result.projectedPledgedMinor);
      toast.success("Pledge plan created. No payment was collected.");
      setAmount("");
      setOpen(false);
    },
    onError: () => toast.error("Could not validate this pledge plan."),
  });

  const parsed = Number(amount);
  const amountMinor =
    Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="sm">
          <Heart className="mr-2 h-4 w-4" />
          Plan a pledge
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plan support for {campaign.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-sm text-muted-foreground">
            This validates a support intent only. It does not charge a card, move
            tokens, create a donation receipt, or persist a donation.
          </div>
          <div>
            <label htmlFor={"pledge-" + campaign.id} className="mb-2 block text-sm font-medium">
              Planned amount ({campaign.currency})
            </label>
            <Input
              id={"pledge-" + campaign.id}
              inputMode="decimal"
              min="1"
              max="1000000"
              step="1"
              type="number"
              value={amount}
              onChange={event => setAmount(event.target.value)}
              placeholder="25"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map(value => (
              <Button
                key={value}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(String(value))}
              >
                {value}
              </Button>
            ))}
          </div>
          <Button
            className="w-full"
            disabled={amountMinor <= 0 || planner.isPending}
            onClick={() =>
              planner.mutate({
                campaignId: campaign.id,
                amountMinor,
                idempotencyKey: createIntentKey(),
              })
            }
          >
            {planner.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ClipboardCheck className="mr-2 h-4 w-4" />
            )}
            Validate pledge plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CampaignCard({
  campaign,
  authenticated,
}: {
  campaign: CampaignView;
  authenticated: boolean;
}) {
  const [projectedMinor, setProjectedMinor] = useState<number | null>(null);
  const current = projectedMinor ?? campaign.pledgedMinor;
  const progress = Math.min(100, Math.round((current / campaign.goalMinor) * 100));

  return (
    <article className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{campaign.category}</Badge>
        <Badge variant="secondary">Demo campaign</Badge>
        <Badge variant="outline">{campaign.status}</Badge>
      </div>
      <h3 className="mt-4 text-xl font-bold">{campaign.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {campaign.summary}
      </p>

      <div className="mt-5 space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatMoney(current, campaign.currency)} planned</span>
          <span>{formatMoney(campaign.goalMinor, campaign.currency)} demo goal</span>
        </div>
        <Progress value={progress} />
        <div className="text-right text-xs font-semibold">{progress}%</div>
      </div>

      <div className="mt-5 rounded-xl bg-muted/30 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Example fund-use plan
        </p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {campaign.fundUsePlan.map(item => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-border/50 p-3">
        <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="text-sm">
          <span className="font-semibold">{campaign.impactMetric.label}:</span>{" "}
          <span className="text-muted-foreground">
            {campaign.impactMetric.target} {campaign.impactMetric.unit} planned.
            This is a product target, not a verified real-world outcome.
          </span>
        </div>
      </div>

      <div className="mt-5">
        {authenticated ? (
          <PledgeDialog campaign={campaign} onPlanned={setProjectedMinor} />
        ) : (
          <a href={getLoginUrl()} className="block">
            <Button className="w-full" size="sm" variant="outline">
              Sign in to plan a pledge
            </Button>
          </a>
        )}
      </div>
    </article>
  );
}

export default function Charity() {
  const { isAuthenticated } = useAuth();
  const [category, setCategory] = useState<string>("All");

  const campaignsQuery = trpc.charity.campaigns.useQuery({});
  const statsQuery = trpc.charity.stats.useQuery();
  const volunteerQuery = trpc.charity.volunteer.useQuery();
  const boundaryQuery = trpc.charity.boundary.useQuery();

  const campaigns = (campaignsQuery.data ?? []) as CampaignView[];
  const filteredCampaigns = useMemo(
    () =>
      category === "All"
        ? campaigns
        : campaigns.filter(campaign => campaign.category === category),
    [campaigns, category],
  );
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(campaigns.map(campaign => campaign.category)))],
    [campaigns],
  );

  return (
    <main className="min-h-screen bg-background pb-24">
      <section className="border-b border-border/60 bg-gradient-to-b from-rose-500/10 via-background to-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-5" variant="outline">
              SKYHOPE · CONTROLLED ENGINEERING BETA
            </Badge>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              Help people without hiding the evidence boundary.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              SkyHope is the impact workspace for cause discovery, transparent
              planning, volunteer coordination UX, and evidence-aware impact
              design. The current catalog is demonstration data and the pledge
              planner does not collect money.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href="#causes">
                  <HandHeart className="mr-2 h-4 w-4" />
                  Explore demo causes
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/beta-feedback">Send SkyHope feedback</Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Open demo campaigns",
                value: statsQuery.data?.activeCampaigns ?? "—",
                icon: Target,
              },
              {
                label: "Planned demo goal",
                value: statsQuery.data
                  ? formatMoney(statsQuery.data.plannedGoalMinor)
                  : "—",
                icon: HandHeart,
              },
              {
                label: "Planned demo pledges",
                value: statsQuery.data
                  ? formatMoney(statsQuery.data.plannedPledgedMinor)
                  : "—",
                icon: Heart,
              },
              {
                label: "Volunteer examples",
                value: statsQuery.data?.volunteerExamples ?? "—",
                icon: Users,
              },
            ].map(item => (
              <div key={item.label} className="rounded-2xl border border-border/60 bg-card/70 p-4">
                <item.icon className="h-5 w-5 text-primary" />
                <div className="mt-3 text-2xl font-black">{item.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <h2 className="font-bold">What this beta can prove</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              The app can prove its own catalog, validation rules, navigation,
              tests, and pledge-plan output. It cannot yet prove a nonprofit,
              provider settlement, receipt, token transfer, blockchain
              transaction, or external impact outcome.
            </p>
          </div>
        </div>

        <Tabs defaultValue="causes" id="causes">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 md:grid-cols-4">
            <TabsTrigger value="causes">Causes</TabsTrigger>
            <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
            <TabsTrigger value="method">Impact method</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
          </TabsList>

          <TabsContent value="causes" className="mt-6">
            <div className="mb-5 flex flex-wrap gap-2">
              {categories.map(item => (
                <Button
                  key={item}
                  size="sm"
                  variant={category === item ? "default" : "outline"}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </Button>
              ))}
            </div>

            {campaignsQuery.isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(item => (
                  <div key={item} className="h-80 animate-pulse rounded-2xl bg-muted/30" />
                ))}
              </div>
            ) : campaignsQuery.isError ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                <h3 className="font-bold">SkyHope catalog unavailable</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  The demo catalog could not be loaded. No financial action was attempted.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCampaigns.map(campaign => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    authenticated={Boolean(isAuthenticated)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="volunteer" className="mt-6">
            <div className="mb-5 max-w-3xl">
              <h2 className="text-2xl font-black">Volunteer workflow examples</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                These cards test discovery, skills matching, and scheduling UX.
                They are not live volunteer openings and do not submit your
                information to an external organization.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {(volunteerQuery.data ?? []).map(item => (
                <article key={item.id} className="rounded-2xl border border-border/60 bg-card/70 p-5">
                  <Badge variant="outline">{item.category}</Badge>
                  <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.summary}
                  </p>
                  <div className="mt-4 rounded-xl bg-muted/30 p-3 text-sm">
                    {item.commitment}
                  </div>
                  <Badge className="mt-4" variant="secondary">
                    Coordinator integration required
                  </Badge>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="method" className="mt-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: BookOpenCheck,
                  title: "Define",
                  text: "Every campaign separates planned inputs, outputs, and outcomes so a progress bar is not confused with real-world impact.",
                },
                {
                  icon: ClipboardCheck,
                  title: "Evidence",
                  text: "Future live campaigns need source documents, timestamps, methodology, reviewer state, and privacy controls before outcome claims are promoted.",
                },
                {
                  icon: CheckCircle2,
                  title: "Report",
                  text: "The product should show what changed, what is still unknown, and which claims come from the platform versus an external organizer.",
                },
              ].map(item => (
                <article key={item.title} className="rounded-2xl border border-border/60 p-5">
                  <item.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="limits" className="mt-6">
            <div className="rounded-2xl border border-border/60 bg-card/70 p-6">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h2 className="text-xl font-black">Current execution boundary</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    SkyHope is useful today as a product and integration beta,
                    not as a live donation processor. The server returns this
                    boundary directly so the UI and API share the same truth source.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Verifies nonprofits", boundaryQuery.data?.verifiesNonprofits],
                  ["Executes payments", boundaryQuery.data?.executesPayments],
                  ["Persists donations", boundaryQuery.data?.persistsDonations],
                  ["Issues receipts", boundaryQuery.data?.issuesReceipts],
                  ["Holds custody", boundaryQuery.data?.holdsCustody],
                  ["Transfers tokens", boundaryQuery.data?.transfersTokens],
                  ["Broadcasts blockchain transactions", boundaryQuery.data?.broadcastsBlockchainTransactions],
                  ["Proves external impact", boundaryQuery.data?.provesExternalImpact],
                ].map(([label, enabled]) => (
                  <div key={String(label)} className="flex items-center justify-between rounded-xl border border-border/50 p-3 text-sm">
                    <span>{label}</span>
                    <Badge variant={enabled ? "default" : "secondary"}>
                      {enabled ? "Enabled" : "Not claimed"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
