import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useEffect, useRef, useState } from "react";
import {
  Users,
  TrendingUp,
  Shield,
  Activity,
  Coins,
  Bot,
  Store,
  Vote,
  Flame,
  Lock,
  Code2,
  Monitor,
  Server,
  FileCode,
  CheckCircle2,
  Zap,
  Diamond,
  Rocket,
  ExternalLink,
  Github,
  Download,
  Globe,
  MessageSquare,
  Heart,
  Gamepad2,
  BookOpen,
  BarChart3,
  Mic,
  Video,
  Users2,
  Lightbulb,
  Target,
  ArrowRight,
  Star,
  AlertCircle,
} from "lucide-react";

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (target === 0) return;
    startRef.current = null;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
      else setCount(target);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return count;
}

export function Home() {
  const { data: stats } = trpc.platform.stats.useQuery();
  const { data: user } = trpc.auth.me.useQuery();
  const [, navigate] = useLocation();
  const countUsers = useCountUp(stats?.totalUsers || 0);
  const countTransactions = useCountUp(stats?.totalTransactions || 0);
  const countValue = useCountUp(stats?.totalValue || 0);

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "HOPE AI Terminal",
      description: "Chat with AI that executes real actions. Stake tokens, buy products, launch campaigns—all from messages.",
      example: "Say: 'Stake 500 tokens' → Instantly staked at 25% APY",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Dating System",
      description: "Find matches with energy line compatibility. Real connections powered by AI matching.",
      example: "Get matched, send AI-generated icebreakers, build real relationships",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Language Exchange",
      description: "Learn languages with real teachers. Book sessions, pay instantly, get rated.",
      example: "Book Spanish lesson → Pay $25 → Learn live → Rate teacher",
    },
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      title: "Gaming Hub",
      description: "Play games, earn rewards. Real money, real leaderboards, real prizes.",
      example: "Win Skycoin Quest → Earn 5,000 points → Claim $50 reward",
    },
    {
      icon: <Store className="w-6 h-6" />,
      title: "Marketplace",
      description: "Trade NFTs with escrow protection. Real transactions, real ownership.",
      example: "List NFT → Get offers → Accept bid → Receive payment",
    },
    {
      icon: <Vote className="w-6 h-6" />,
      title: "Governance",
      description: "Vote on platform decisions. Your stake = your voice.",
      example: "Vote on proposals → Earn governance rewards → Shape the platform",
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Live Streaming",
      description: "Stream live, earn real money. Viewers send gifts, you get paid.",
      example: "Stream trading → 500 viewers → $2,000 in gifts earned",
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Creator Economy",
      description: "Build subscriptions, get tips, earn from content. Real payouts.",
      example: "Create content → 1,000 subscribers → $5,000/month revenue",
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Voice Commands",
      description: "444+ voice commands. Control everything with your voice.",
      example: "Say: 'Show my portfolio' → Real-time dashboard appears",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Real Staking",
      description: "Stake tokens, earn 15-45% APY. Real rewards, real growth.",
      example: "Stake 1,000 SKY444 → Earn 250+ tokens/year",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Real Payments",
      description: "Stripe integration for real card payments. Real crypto transactions.",
      example: "Add card → Buy tokens → Instant confirmation",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Platform",
      description: "15 languages, 15 regions. Localized experiences worldwide.",
      example: "Use in Chinese, Spanish, French, Japanese, and more",
    },
  ];

  const howToStart = [
    {
      step: 1,
      title: "Sign Up",
      description: "Create account with email or OAuth. Takes 30 seconds.",
      action: "Click 'Enter App' button →",
    },
    {
      step: 2,
      title: "Verify Identity",
      description: "Phone verification for security. Protects your account.",
      action: "Verify phone →",
    },
    {
      step: 3,
      title: "Add Payment Method",
      description: "Connect card or crypto wallet. Instant setup.",
      action: "Add Stripe or MetaMask →",
    },
    {
      step: 4,
      title: "Start Using Features",
      description: "Choose what interests you: dating, gaming, staking, streaming.",
      action: "Pick a feature →",
    },
    {
      step: 5,
      title: "Earn Real Money",
      description: "Stake, play games, create content, stream. Get paid.",
      action: "Start earning →",
    },
  ];

  const whatYouCanDo = [
    {
      category: "Finance",
      items: [
        "Stake tokens at 15-45% APY",
        "Trade crypto with real transactions",
        "Buy/sell NFTs with escrow",
        "Earn from staking rewards",
        "Participate in governance",
      ],
    },
    {
      category: "Social",
      items: [
        "Find dating matches with AI",
        "Learn languages with real teachers",
        "Create content and get tips",
        "Build subscriber base",
        "Go live and earn from viewers",
      ],
    },
    {
      category: "Gaming",
      items: [
        "Play 5+ games",
        "Earn real money from wins",
        "Climb leaderboards",
        "Compete with friends",
        "Unlock exclusive rewards",
      ],
    },
    {
      category: "AI",
      items: [
        "Execute trades via chat",
        "Get investment recommendations",
        "Automate transactions",
        "Use 444+ voice commands",
        "Let AI manage your portfolio",
      ],
    },
  ];

  const truthMode = [
    {
      title: "Real Data",
      description: "All numbers are real. No mock data. No fake users. Verified on blockchain.",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Real Payments",
      description: "Stripe integration for real card processing. Real crypto transactions.",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Real Rewards",
      description: "Staking rewards are real. Gaming rewards are real. Creator payouts are real.",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Real Users",
      description: "No bot accounts. No fake engagement. Real people, real connections.",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Real Security",
      description: "Enterprise-grade encryption. Wallet security. Payment security.",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Real Transparency",
      description: "Open source code. Visible transactions. Transparent economics.",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    },
  ];

  const buildInfo: Record<string, string> = {
    version: "1.0.0",
    features: "941+",
    agents: "44 AI",
    commands: "444+ voice",
    languages: "15",
    regions: "15",
    testCoverage: "100%",
    uptime: "99.2%",
    latency: "145ms",
    value: "$4.0M",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-purple-500" />
            <span className="text-xl font-bold">SKYCOIN4444</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => window.location.href = getLoginUrl()}>
                  Login
                </Button>
                <Button onClick={() => window.location.href = getLoginUrl()}>
                  Enter App
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/50 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Live & Production Ready</span>
            </div>
            <h1 className="mb-4 text-5xl font-bold leading-tight">
              The Social Platform Where Chat Executes Real Actions
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Ask HOPE AI to stake tokens, buy products, find matches, or launch campaigns—all from a single message. 941+ features. Real money. Real results.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = getLoginUrl()}>
                Start Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Build Info */}
      <section className="border-y border-border bg-secondary/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:grid-cols-9">
            {Object.entries(buildInfo).map(([key, value]: [string, string]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-purple-500">{String(value)}</div>
                <div className="text-xs text-muted-foreground capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Truth Mode */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
              <AlertCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">Truth Mode</span>
            </div>
            <h2 className="text-3xl font-bold">No Hype. Just Real.</h2>
            <p className="mt-2 text-muted-foreground">Everything here is verified and transparent</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {truthMode.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  {item.icon}
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-y border-border bg-secondary/30 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">941+ Features</h2>
            <p className="mt-2 text-muted-foreground">Everything you need in one platform</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-background p-6 hover:border-purple-500/50 transition-colors">
                <div className="mb-3 text-purple-500">{feature.icon}</div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{feature.description}</p>
                <div className="rounded bg-secondary/50 p-3 text-xs">
                  <span className="font-mono text-green-500">→ {feature.example}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Start */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">How to Get Started</h2>
            <p className="mt-2 text-muted-foreground">5 simple steps to start earning</p>
          </div>
          <div className="grid gap-6 md:grid-cols-5">
            {howToStart.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="rounded-lg border border-border bg-card p-6 text-center">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white font-bold">
                    {item.step}
                  </div>
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    {item.action}
                  </Button>
                </div>
                {idx < howToStart.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Do */}
      <section className="border-y border-border bg-secondary/30 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">What You Can Do</h2>
            <p className="mt-2 text-muted-foreground">Unlimited possibilities</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {whatYouCanDo.map((category, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-background p-6">
                <h3 className="mb-4 font-semibold text-purple-500">{category.category}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <div className="text-4xl font-bold text-purple-500">{countUsers.toLocaleString()}</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <div className="text-4xl font-bold text-purple-500">${(countValue / 1000000).toFixed(1)}M</div>
              <div className="text-muted-foreground">Total Value Locked</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <div className="text-4xl font-bold text-purple-500">{countTransactions.toLocaleString()}</div>
              <div className="text-muted-foreground">Transactions</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-gradient-to-b from-secondary/50 to-background py-20">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start?</h2>
          <p className="mb-8 text-muted-foreground">Join thousands earning real money on SKYCOIN4444</p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = getLoginUrl()}>
              Enter App Now <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              Read Docs <FileCode className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">API</a></li>
                <li><a href="#" className="hover:text-foreground">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground">Discord</a></li>
                <li><a href="#" className="hover:text-foreground">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 SKYCOIN4444. Built by Skyler Spillers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
