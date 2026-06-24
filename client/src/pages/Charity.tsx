import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  Heart, HandHeart, Globe, Users, TrendingUp, Sparkles, Vote,
  Trophy, BarChart3, Target, Coins, Shield, Loader2, ThumbsUp,
  ThumbsDown, Award, Flame, Clock, CheckCircle2, ArrowUpRight
} from "lucide-react";

// DAO Proposals for charity fund allocation
const DAO_PROPOSALS = [
  {
    id: "prop-1",
    title: "Allocate 50,000 SKY444 to Clean Water Initiative",
    description: "Fund the deployment of water purification systems in 3 rural communities in East Africa.",
    category: "Environment",
    requestedAmount: 50000,
    votesFor: 847,
    votesAgainst: 123,
    status: "active" as const,
    endsIn: "3 days",
    proposer: "SkylerDev",
  },
  {
    id: "prop-2",
    title: "Fund 100 STEM Scholarships for Underserved Youth",
    description: "Provide full scholarships for coding bootcamps and university CS programs.",
    category: "Education",
    requestedAmount: 120000,
    votesFor: 1203,
    votesAgainst: 89,
    status: "active" as const,
    endsIn: "5 days",
    proposer: "CryptoKing",
  },
  {
    id: "prop-3",
    title: "Emergency Relief: Disaster Recovery Fund",
    description: "Rapid-response fund for natural disaster relief.",
    category: "Humanitarian",
    requestedAmount: 200000,
    votesFor: 2341,
    votesAgainst: 156,
    status: "passed" as const,
    endsIn: "Ended",
    proposer: "NFTQueen",
  },
];

// Top donors leaderboard
const LEADERBOARD = [
  { rank: 1, name: "SkylerDev", donated: 125000, campaigns: 12, badge: "Diamond Donor" },
  { rank: 2, name: "CryptoKing", donated: 89000, campaigns: 8, badge: "Platinum Donor" },
  { rank: 3, name: "AITrader", donated: 67000, campaigns: 15, badge: "Gold Donor" },
  { rank: 4, name: "NFTQueen", donated: 45000, campaigns: 6, badge: "Gold Donor" },
  { rank: 5, name: "DeFiPro", donated: 34000, campaigns: 9, badge: "Silver Donor" },
  { rank: 6, name: "GameDev", donated: 28000, campaigns: 4, badge: "Silver Donor" },
  { rank: 7, name: "BlockchainBob", donated: 22000, campaigns: 7, badge: "Bronze Donor" },
  { rank: 8, name: "CyberAlice", donated: 18000, campaigns: 5, badge: "Bronze Donor" },
];

function DonateDialog({ campaign, onSuccess }: { campaign: any; onSuccess: () => void }) {
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);

  const donate = trpc.charity.donate.useMutation({
    onSuccess: () => {
      toast.success(`Thank you! ${amount} SKY444 donated`);
      setAmount("");
      setOpen(false);
      onSuccess();
    },
    onError: () => {
      toast.error("Donation failed. Please try again.");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-xs h-7 bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600/30">
          <Heart className="w-3 h-3 mr-1" /> Donate
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-white">Donate to Campaign</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm">{campaign?.title || "Campaign"}</h4>
            <p className="text-xs text-muted-foreground mt-1">{campaign?.description || "Support this cause"}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Donation Amount (SKY444)</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-background/50 border-border/30 font-mono"
            />
            <div className="flex gap-2 mt-2">
              {[10, 50, 100, 500].map(v => (
                <button
                  key={v}
                  onClick={() => setAmount(String(v))}
                  className="px-3 py-1 rounded-md border border-border/30 bg-background/50 text-xs font-mono hover:border-primary/50 transition-all"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-purple-600/5 border border-purple-500/20">
            <div className="flex items-center gap-2 text-xs text-purple-400">
              <Shield className="w-3.5 h-3.5" />
              <span>100% of donations go directly to the cause.</span>
            </div>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 font-semibold"
            disabled={!amount || parseFloat(amount) <= 0 || donate.isPending}
            onClick={() => donate.mutate({ campaignId: campaign?.id, amount: parseFloat(amount) })}
          >
            {donate.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Heart className="w-4 h-4 mr-2" />}
            Confirm Donation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProposalCard({ proposal }: { proposal: typeof DAO_PROPOSALS[0] }) {
  const { isAuthenticated } = useAuth();
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

  return (
    <div className={`p-5 rounded-xl border ${proposal.status === "passed" ? "border-purple-500/30 bg-purple-600/5" : "border-border/50 bg-card/80"} backdrop-blur`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">{proposal.category}</Badge>
          <Badge className={`text-[10px] ${proposal.status === "passed" ? "bg-purple-600/10 text-purple-400 border-purple-500/30" : "bg-primary/10 text-primary border-primary/30"}`}>
            {proposal.status === "passed" ? <><CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Passed</> : <><Clock className="w-2.5 h-2.5 mr-0.5" /> {proposal.endsIn}</>}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">by {proposal.proposer}</span>
      </div>

      <h3 className="font-semibold mb-2">{proposal.title}</h3>
      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{proposal.description}</p>

      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-purple-400 font-mono">{proposal.votesFor} For</span>
        <span className="text-red-400 font-mono">{proposal.votesAgainst} Against</span>
      </div>
      <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-border/30 mb-3">
        <div className="h-full bg-purple-600 rounded-full" style={{ width: `${forPercent}%` }} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">
          <Coins className="w-3 h-3 inline mr-1" />{(proposal.requestedAmount ?? 0).toLocaleString()} SKY444
        </span>
        {proposal.status === "active" && (
          isAuthenticated ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs h-7 text-purple-400 border-purple-500/30 hover:bg-purple-600/10">
                <ThumbsUp className="w-3 h-3 mr-1" /> For
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-7 text-red-400 border-red-500/30 hover:bg-red-500/10">
                <ThumbsDown className="w-3 h-3 mr-1" /> Against
              </Button>
            </div>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="sm" variant="outline" className="text-xs h-7">Sign In to Vote</Button>
            </a>
          )
        )}
      </div>
    </div>
  );
}

export default function Charity() {
  const { isAuthenticated } = useAuth();
  const { data: campaigns, isLoading, refetch } = trpc.charity.campaigns.useQuery({});
  const { data: charityStats } = trpc.charity.stats.useQuery();

  const impactMetrics = [
    { label: "Active Campaigns", value: String(charityStats?.activeCampaigns ?? "—"), icon: Target, color: "text-primary" },
    { label: "Total Campaigns", value: String(charityStats?.totalCampaigns ?? "—"), icon: HandHeart, color: "text-purple-400" },
    { label: "SKY444 Raised", value: charityStats ? String(Math.round(charityStats.totalRaised ?? 0)) : "—", icon: Coins, color: "text-yellow-400" },
    { label: "Donors", value: String(charityStats?.totalDonors ?? "—"), icon: Users, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border py-16">
        <div className="container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 mb-6">
              <Heart className="h-3.5 w-3.5 text-red-400 animate-pulse" />
              <span className="text-xs font-bold text-red-400">TRANSPARENT GIVING — ON-CHAIN</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Charity Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Support causes, vote on fund allocation via DAO governance, and track real-world impact — all on-chain and fully transparent.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {impactMetrics.map((metric) => (
              <div key={metric.label} className="p-5 rounded-xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 bg-white/5">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div className={`text-3xl font-bold ${metric.color} mb-1`}>{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container">
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="w-full max-w-lg bg-card border border-border">
              <TabsTrigger value="campaigns" className="flex-1">
                <HandHeart className="w-4 h-4 mr-1.5" /> Campaigns
              </TabsTrigger>
              <TabsTrigger value="dao" className="flex-1">
                <Vote className="w-4 h-4 mr-1.5" /> DAO
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex-1">
                <Trophy className="w-4 h-4 mr-1.5" /> Leaderboard
              </TabsTrigger>
            </TabsList>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-5 rounded-xl border border-border animate-pulse">
                      <div className="h-4 bg-muted/20 rounded w-1/3 mb-3" />
                      <div className="h-5 bg-muted/20 rounded w-2/3 mb-2" />
                      <div className="h-3 bg-muted/20 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : campaigns && campaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaigns.map((c: any) => {
                    const progress = c.goalAmount > 0 ? (Number(c.raisedAmount) / Number(c.goalAmount)) * 100 : 0;
                    return (
                      <div key={c.id} className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-[10px]">{c.category || "Charity"}</Badge>
                          <Badge className={`text-[10px] ${c.status === "active" ? "bg-purple-600/10 text-purple-400" : "bg-muted/20"}`}>
                            {c.status || "active"}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-2">{c.title || "Campaign"}</h3>
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{c.description || "Support this cause"}</p>
                        <div className="mb-4">
                          <div className="h-3 bg-background/50 rounded-full overflow-hidden border border-border">
                            <div className="h-full bg-gradient-to-r from-primary to-purple-600" style={{ width: `${Math.min(100, progress)}%` }} />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>{Math.round(progress)}% funded</span>
                            <span>${(Number(c.raisedAmount) / 1000).toFixed(0)}K / ${(Number(c.goalAmount) / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                        <DonateDialog campaign={c} onSuccess={() => refetch()} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No active campaigns at the moment.</p>
                </div>
              )}
            </TabsContent>

            {/* DAO Tab */}
            <TabsContent value="dao" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                {DAO_PROPOSALS.map(proposal => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="mt-6">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="px-4 py-3">Rank</th>
                        <th className="px-4 py-3">Donor</th>
                        <th className="px-4 py-3">Donated</th>
                        <th className="px-4 py-3">Campaigns</th>
                        <th className="px-4 py-3">Badge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {LEADERBOARD.map(donor => (
                        <tr key={donor.rank} className="border-b border-border/30 hover:bg-background/50 transition-colors">
                          <td className="px-4 py-3 font-semibold">{donor.rank}</td>
                          <td className="px-4 py-3">{donor.name}</td>
                          <td className="px-4 py-3 font-mono">${(donor.donated / 1000).toFixed(0)}K</td>
                          <td className="px-4 py-3">{donor.campaigns}</td>
                          <td className="px-4 py-3">
                            <Badge className="text-xs" variant="outline">{donor.badge}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
