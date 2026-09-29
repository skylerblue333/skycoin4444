import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  MapPin,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const verificationStages = [
  {
    title: "1. Plan",
    detail:
      "Create a bounded SkyHope action plan without counting intention as impact.",
  },
  {
    title: "2. Act",
    detail:
      "Complete the real-world activity with the recipient or organization.",
  },
  {
    title: "3. Verify",
    detail:
      "Keep only appropriate evidence: confirmation, receipt, dated activity record, or public source.",
  },
  {
    title: "4. Publish",
    detail:
      "Only then may a future impact map display a location or outcome as verified.",
  },
] as const;

export default function ImpactMap() {
  const boundary = trpc.charity.boundary.useQuery(undefined, { retry: false });
  const missions = trpc.charity.missions.useQuery(undefined, { retry: false });

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-emerald-950/40 via-[#050508] to-violet-950/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-300/12 text-emerald-100">
              Impact Evidence Map
            </Badge>
            <Badge
              variant="outline"
              className="border-white/10 text-white/45"
            >
              No fabricated geography
            </Badge>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
            A map should show verified impact, not invented dots.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/50">
            The previous screen hard-coded countries, donation totals,
            beneficiaries, campaigns, and a live-donation feed. Those values
            were not backed by verified release evidence. This screen now shows
            the verification pipeline that must exist before a real location is
            plotted.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-emerald-300/15 bg-emerald-300/[0.04] text-white">
            <CardContent className="p-5">
              <Globe2 className="h-5 w-5 text-emerald-200" />
              <p className="mt-4 text-3xl font-black">0</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/35">
                verified map locations in this release
              </p>
            </CardContent>
          </Card>
          <Card className="border-violet-300/15 bg-violet-300/[0.04] text-white">
            <CardContent className="p-5">
              <MapPin className="h-5 w-5 text-violet-200" />
              <p className="mt-4 text-3xl font-black">
                {missions.data?.length ?? boundary.data?.missionCount ?? "—"}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/35">
                planning missions
              </p>
            </CardContent>
          </Card>
          <Card className="border-amber-300/15 bg-amber-300/[0.04] text-white">
            <CardContent className="p-5">
              <ShieldCheck className="h-5 w-5 text-amber-200" />
              <p className="mt-4 text-2xl font-black">
                {boundary.data?.externalBeneficiaryVerification === false
                  ? "Not connected"
                  : "—"}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/35">
                external beneficiary verification
              </p>
            </CardContent>
          </Card>
        </section>

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TriangleAlert className="h-5 w-5 text-amber-200" />
              Why the map is intentionally empty
            </CardTitle>
            <CardDescription className="text-white/45">
              Empty is more trustworthy than synthetic impact.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-white/45">
            SKYCOIN4444 currently has no release evidence proving a set of
            charities, beneficiary locations, donation receipts, or measured
            regional outcomes. The beta therefore does not render fake global
            totals, beneficiary counts, or donation flows. Future pins should
            carry a verification state and source reference before they appear.
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {verificationStages.map(stage => (
            <Card key={stage.title} className="border-white/10 bg-white/[0.025] text-white">
              <CardContent className="p-5">
                <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                <h2 className="mt-4 font-black">{stage.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/42">
                  {stage.detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/charity">
            <Button>
              Open SkyHope planner
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/charity-leaderboard">
            <Button
              variant="outline"
              className="border-white/15 bg-white/[0.03] text-white"
            >
              Open mission index
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
