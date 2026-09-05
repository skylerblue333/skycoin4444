import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Gamepad2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const missionThemes = [
  {
    name: "Education",
    detail:
      "Use knowledge games and lesson completion as a themed mission. No donation is triggered.",
    href: "/game-crypto-quiz",
    icon: BookOpen,
  },
  {
    name: "Clean water",
    detail:
      "Use Spark Tap as a themed awareness challenge. Sparks are game-only values.",
    href: "/game-token-tap",
    icon: Sparkles,
  },
  {
    name: "Community build",
    detail:
      "Use Block Builder as a themed teamwork/puzzle session. No funds or tokens move.",
    href: "/game-block-builder",
    icon: Gamepad2,
  },
] as const;

export default function GamingForCharity() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10rem] top-[-8rem] h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl" />
        <div className="absolute right-[-10rem] top-56 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-10">
        <header className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-100">
                Impact Play Lab
              </Badge>
              <Badge
                variant="outline"
                className="border-amber-300/25 text-amber-100"
              >
                No live donations
              </Badge>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              Play with a purpose theme—without pretending money moved.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/50">
              This legacy route used to display invented donation totals,
              player counts, charity rankings, and SKY444 transfers. Those
              claims are removed. The current beta keeps only themed game
              missions until a real charitable-giving integration is built and
              verified.
            </p>
          </div>
          <Link href="/gaming">
            <Button size="lg" className="w-full">
              <Gamepad2 className="mr-2 h-5 w-5" />
              Open Games Center
            </Button>
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {missionThemes.map(theme => {
            const Icon = theme.icon;
            return (
              <Card
                key={theme.name}
                className="border-white/10 bg-white/[0.035] text-white"
              >
                <CardHeader>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="mt-3 text-white">
                    {theme.name}
                  </CardTitle>
                  <CardDescription className="leading-6 text-white/45">
                    {theme.detail}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={theme.href}>
                    <Button
                      variant="outline"
                      className="w-full border-white/15 bg-white/[0.03] text-white"
                    >
                      Play themed mission
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Card className="border-violet-300/20 bg-violet-300/[0.04] text-white">
            <CardHeader>
              <HeartHandshake className="h-6 w-6 text-violet-200" />
              <CardTitle className="mt-2 text-white">
                What would make charity integration real?
              </CardTitle>
              <CardDescription className="text-white/45">
                A future giving feature needs verifiable money movement—not UI
                counters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-6 text-white/45">
              <p>• Approved payment/donation provider and beneficiary records</p>
              <p>• Server-side donation intent and settlement lifecycle</p>
              <p>• Idempotency, receipts, refunds/failure handling, and audit</p>
              <p>• Legal/compliance review appropriate to the jurisdictions</p>
              <p>• Tests proving game scores cannot fabricate a transfer</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <ShieldCheck className="h-6 w-6 text-emerald-200" />
              <CardTitle className="mt-2 text-white">
                Current beta boundary
              </CardTitle>
              <CardDescription className="text-white/45">
                Game sessions can be engaging without attaching financial value
                to every interaction.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-white/45">
              <p>Sparks, XP, scores, ranks, and combos are game-only values.</p>
              <p>No wallet, token payout, donation, settlement, or blockchain write occurs.</p>
              <p>No charity is described as verified or funded by this route.</p>
              <Link
                href="/beta-feedback"
                className="inline-flex items-center font-semibold text-sky-200"
              >
                Suggest a future impact mission
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
