import {
  Crown,
  EyeOff,
  Filter,
  Heart,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Star,
  WandSparkles,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const concepts = [
  {
    icon: Filter,
    title: "Advanced discovery controls",
    description:
      "Potential future controls for additional profile fields after those fields are stored and tested.",
  },
  {
    icon: EyeOff,
    title: "Incognito-style visibility",
    description:
      "A future privacy concept that would require server-enforced visibility rules before it can be offered.",
  },
  {
    icon: WandSparkles,
    title: "Profile coaching",
    description:
      "Deterministic writing prompts or clearly labeled AI assistance if a real provider is connected later.",
  },
  {
    icon: Star,
    title: "Extra expression tools",
    description:
      "Additional reactions or presentation tools without claiming they improve match probability.",
  },
];

export default function DatingPremium() {
  const { isAuthenticated } = useAuth();
  const subscription = trpc.dating.subscription.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const tier = subscription.data?.tier ?? "free";

  return (
    <main className="min-h-screen bg-[#090404] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-[2rem] border border-amber-200/10 bg-white/[0.04] p-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-300/10 text-amber-200">
            <Crown className="h-7 w-7" />
          </div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-amber-100/50">
            Premium product concept
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Premium without fake checkout
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/55">
            The database can record a dating subscription tier, but billing,
            checkout, paid entitlement enforcement, renewals, boosts, and paid
            visibility are not integrated in this engineering beta. This page
            documents the product direction without presenting a fake purchase.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link href="/dating-home">
              <Button
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-white"
              >
                Dating home
              </Button>
            </Link>
            <Link href="/dating-discovery">
              <Button className="bg-pink-600 hover:bg-pink-500">
                <Heart className="mr-2 h-4 w-4" />
                Discovery
              </Button>
            </Link>
          </div>
        </header>

        <section className="mt-6 grid gap-5 md:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.04] p-6 text-white">
            <div className="flex items-center gap-2 text-pink-200">
              <Sparkles className="h-5 w-5" />
              <h2 className="font-black">Current beta tier</h2>
            </div>
            <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
                Server record
              </p>
              <p className="mt-2 text-3xl font-black capitalize">{tier}</p>
              <p className="mt-2 text-sm leading-6 text-white/45">
                {subscription.data?.note ??
                  "Sign in to read the authenticated dating subscription record."}
              </p>
            </div>
            <Button disabled className="mt-4 w-full">
              Billing unavailable in beta
            </Button>
          </Card>

          <Card className="border-emerald-300/15 bg-emerald-300/[0.05] p-6 text-white">
            <div className="flex items-center gap-2 text-emerald-200">
              <ShieldCheck className="h-5 w-5" />
              <h2 className="font-black">What stays available without payment</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-6 text-white/55">
              <p>Adult profile creation and persisted relationship intent.</p>
              <p>Age/gender discovery preferences and contextual filtering.</p>
              <p>Like, Super Like, pass, and mutual-match creation.</p>
              <p>Server-backed messaging for active mutual matches.</p>
              <p>Block, report, unmatch, and safety-center controls.</p>
            </div>
          </Card>
        </section>

        <section className="mt-6">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/30">
              Future concepts
            </p>
            <h2 className="mt-1 text-2xl font-black">
              Features that need real engineering before monetization
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {concepts.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="border-white/10 bg-white/[0.04] p-5 text-white"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-300/10 text-amber-200">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  {description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <Card className="mt-6 border-white/10 bg-white/[0.04] p-6 text-white">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-violet-200" />
            <div>
              <h2 className="font-black">Launch gate for real paid dating</h2>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Before a real paid tier can be offered, SKYCOIN4444 needs
                verified checkout, entitlement enforcement, cancellation and
                refund handling, receipt/audit evidence, failure testing,
                pricing/legal review, and truthful product terms. None of those
                are claimed complete here.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
