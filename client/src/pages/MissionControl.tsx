import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gauge,
  Trophy,
  Briefcase,
  Sparkles,
  Rocket,
  Store,
  ArrowUpRight,
} from "lucide-react";
import { GOLD } from "./mission-control/shared";
import { TodaySection } from "./mission-control/TodaySection";
import { ReputationSection } from "./mission-control/ReputationSection";
import { OpportunitiesSection } from "./mission-control/OpportunitiesSection";
import { MissionsSection } from "./mission-control/MissionsSection";
import { StartupSection } from "./mission-control/StartupSection";
import { MarketplaceSection } from "./mission-control/MarketplaceSection";

const BETA_JOURNEYS = [
  {
    path: "/beta-journey",
    label: "SkySchool journey",
    detail: "Read the approved education path and completion gates.",
  },
  {
    path: "/community-hub",
    label: "Community Hub",
    detail: "Browse communities, join, and publish a build thread.",
  },
  {
    path: "/activity-feed",
    label: "Activity Feed",
    detail: "Publish updates, react, and reply to real posts.",
  },
  {
    path: "/beta-web3",
    label: "Web3 evidence room",
    detail: "Inspect controlled local and testnet fixtures without writes.",
  },
  {
    path: "/beta-feedback",
    label: "Beta feedback",
    detail: "Send a monitored product report or reproduction note.",
  },
  {
    path: "/a-i-tools-hub",
    label: "Local AI sandbox",
    detail: "Draft, extract actions, and scan sensitive wording in-browser.",
  },
] as const;

const TABS = [
  {
    value: "today",
    label: "Today",
    icon: Gauge,
    status: "Unavailable",
    el: <TodaySection />,
  },
  {
    value: "missions",
    label: "Missions",
    icon: Sparkles,
    status: "Unavailable",
    el: <MissionsSection />,
  },
  {
    value: "opportunities",
    label: "Opportunities",
    icon: Briefcase,
    status: "Unavailable",
    el: <OpportunitiesSection />,
  },
  {
    value: "reputation",
    label: "Reputation",
    icon: Trophy,
    status: "Unavailable",
    el: <ReputationSection />,
  },
  {
    value: "startup",
    label: "Startup Builder",
    icon: Rocket,
    status: "Unavailable",
    el: <StartupSection />,
  },
  {
    value: "marketplace",
    label: "AI Marketplace",
    icon: Store,
    status: "Unavailable",
    el: <MarketplaceSection />,
  },
] as const;

export default function MissionControl() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center text-white/40">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050510] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">
                Skycoin4444
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight">
                Mission Control
              </h1>
              <p className="mt-2 max-w-2xl text-white/55">
                A truthful local beta launchpad. Start with a working journey;
                sign in only when you need protected persistence.
              </p>
            </div>
            <div className="flex gap-3">
              <a href={getLoginUrl()}>
                <Button style={{ backgroundColor: GOLD, color: "#000" }}>
                  Sign in
                </Button>
              </a>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-white/20 text-white/80"
                >
                  Home
                </Button>
              </Link>
            </div>
          </div>
          <div className="mb-8 rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-5">
            <p className="text-sm font-medium text-amber-100">
              Engineering-beta boundary
            </p>
            <p className="mt-2 text-sm leading-6 text-white/60">
              These are the routes currently intended for local testing.
              Financial settlement, custody, token transfers, signing,
              production-chain execution, and provider-backed AI remain
              unavailable.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {BETA_JOURNEYS.map(journey => (
              <Link
                key={journey.path}
                href={journey.path}
                className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-amber-300/50 hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-white">
                      {journey.label}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-white/50">
                      {journey.detail}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-amber-200/70 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <div
        className="border-b border-white/10 sticky top-0 z-30"
        style={{
          background: "rgba(5,5,16,0.92)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-white/40 hover:text-white/70 text-sm">
            ← Home
          </Link>
          <div className="w-px h-4 bg-white/15" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight">
                Mission <span style={{ color: GOLD }}>Control</span>
              </h1>
              <Badge
                variant="outline"
                className="border-amber-400/50 text-amber-200"
              >
                Engineering Beta
              </Badge>
            </div>
            <p className="text-[11px] text-white/40 -mt-0.5">
              Invitation-only capability discovery and feedback surface
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div
          role="status"
          className="mb-6 rounded-xl border border-amber-400/30 bg-amber-400/[0.06] px-4 py-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-amber-100">
              Mission Control engineering-beta boundary
            </p>
            <Badge
              variant="outline"
              className="border-amber-400/50 text-amber-200"
            >
              Capability discovery
            </Badge>
          </div>
          <p className="mt-1 text-sm leading-6 text-white/60">
            This beta presents only verified availability information. Tabs
            marked unavailable do not provide live mission data, reputation
            scores, marketplace services, financial activity, wallet custody,
            token actions, blockchain execution, or provider-backed AI behavior.
          </p>
        </div>
        <Tabs defaultValue="today">
          <TabsList className="bg-white/[0.03] border border-white/10 flex flex-wrap h-auto p-1 mb-6">
            {TABS.map(t => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 gap-1.5"
              >
                <t.icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
                <span className="text-[10px] text-amber-200/70">
                  {t.status}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map(t => (
            <TabsContent key={t.value} value={t.value} className="mt-0">
              {t.el}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
