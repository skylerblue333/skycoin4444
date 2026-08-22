import { BarChart3, Crown, ShieldAlert, Video, TrendingUp, CreditCard, PenTool, Lock } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

const CREATOR_TABS = [
  { href: "/creator", label: "Dashboard", icon: BarChart3 },
  { href: "/creator-studio", label: "Studio", icon: Video },
  { href: "/creator-analytics", label: "Analytics", icon: TrendingUp },
  { href: "/creator-monetization", label: "Monetize", icon: CreditCard },
  { href: "/creator-onboarding", label: "Onboarding", icon: PenTool },
  { href: "/shadowfans", label: "ShadowFans", icon: Lock },
] as const;

function CreatorHubNav() {
  const [location] = useLocation();
  return (
    <nav className="flex gap-1.5 overflow-x-auto pb-1" aria-label="Creator tools">
      {CREATOR_TABS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all ${location === href ? "bg-primary text-primary-foreground" : "border-border/50 bg-card/80 text-muted-foreground hover:bg-card hover:text-foreground"}`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export default function CreatorDashboard() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  if (authLoading) return <div className="flex min-h-screen items-center justify-center">Loading creator workspace...</div>;

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-border/50 bg-card/80 p-8 text-center">
          <Crown className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="mb-2 text-2xl font-bold">Creator Dashboard</h2>
          <p className="mb-6 text-muted-foreground">Sign in to access creator tools when their backing integrations are available.</p>
          <Button asChild><a href={getLoginUrl()}>Sign in to continue</a></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Creator <span className="text-primary">Hub</span></h1>
          <p className="mt-1 text-muted-foreground">Creator workspace with verified data boundaries.</p>
          <div className="mt-4"><CreatorHubNav /></div>
        </div>
        <section className="max-w-3xl rounded-xl border border-amber-400/30 bg-amber-400/10 p-6" aria-labelledby="creator-dashboard-status">
          <div className="mb-4 flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-amber-300" aria-hidden="true" />
            <h2 id="creator-dashboard-status" className="text-xl font-semibold">Creator metrics unavailable</h2>
          </div>
          <p className="text-muted-foreground">
            Earnings, subscriber counts, tips, payouts, views, revenue plans, and growth claims are not shown because this deployment has no verified creator ledger or payment-provider integration.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            The dashboard will remain explicit about this limitation until real authenticated data sources, persistence, authorization, and tests are available. No zero-valued cards are used as a substitute for missing data.
          </p>
        </section>
      </div>
    </div>
  );
}
