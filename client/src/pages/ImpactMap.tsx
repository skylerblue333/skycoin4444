import { Link } from "wouter";
import { Globe2, MapPin, ShieldCheck, ArrowRight, HeartHandshake } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ImpactMap() {
  const campaigns = trpc.charity.campaigns.useQuery({ limit: 100, offset: 0 });

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_35%)]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <Badge className="border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
            SkyHope impact readiness · Engineering beta
          </Badge>
          <div className="mt-5 flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200">
              <Globe2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Impact readiness map</h1>
              <p className="mt-3 max-w-3xl text-white/50">
                SkyHope does not yet have verified beneficiary coordinates, live donation flows, or external impact evidence.
                This surface shows the planning scenarios that must be connected to verified organizations and evidence before a geographic impact map can be truthful.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Verified live funds", "$0"],
            ["Verified beneficiary locations", "0"],
            ["Execution", "Disabled"],
          ].map(([label, value]) => (
            <Card key={label} className="border-white/10 bg-white/[0.035] text-white">
              <CardContent className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">{label}</p>
                <p className="mt-2 text-2xl font-black">{value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-200/70">Planning scenarios</p>
            <h2 className="mt-2 text-2xl font-black">What could become verified impact programs</h2>
          </div>

          {campaigns.isLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[0, 1, 2].map(index => <div key={index} className="h-56 animate-pulse rounded-2xl bg-white/[0.04]" />)}
            </div>
          ) : campaigns.error ? (
            <Card className="border-red-300/20 bg-red-300/[0.04] text-white">
              <CardContent className="p-6 text-sm text-red-100">
                Impact planning data is unavailable. No donation, settlement, or blockchain action was attempted.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {(campaigns.data ?? []).map(campaign => (
                <Card key={campaign.id} className="border-white/10 bg-white/[0.035] text-white">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="border-white/15 text-white/55">{campaign.category}</Badge>
                      <Badge className="bg-amber-300/10 text-amber-100">Unverified location</Badge>
                    </div>
                    <CardTitle className="mt-3 text-white">{campaign.title}</CardTitle>
                    <CardDescription className="leading-6 text-white/45">{campaign.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-white/50">
                      <MapPin className="h-4 w-4 text-amber-200" />
                      No verified beneficiary coordinates connected
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <HeartHandshake className="h-4 w-4 text-emerald-200" />
                      Live raised: $0
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
          <Card className="border-emerald-300/20 bg-emerald-300/[0.035] text-white">
            <CardHeader>
              <ShieldCheck className="h-7 w-7 text-emerald-200" />
              <CardTitle className="mt-2">Evidence required before map pins go live</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {[
                "Verified beneficiary or program entity",
                "Consent-safe geographic granularity",
                "Persisted contribution evidence",
                "Provider settlement and reconciliation",
                "Impact measurement source",
                "Audit trail for corrections and refunds",
              ].map(item => (
                <div key={item} className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/55">{item}</div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.035] text-white">
            <CardHeader>
              <CardTitle>Continue in SkyHope</CardTitle>
              <CardDescription className="text-white/45">
                Review campaign scenarios and create a non-executing contribution plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/charity">
                <Button className="w-full bg-emerald-300 text-slate-950 hover:bg-emerald-200">
                  Open SkyHope
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
