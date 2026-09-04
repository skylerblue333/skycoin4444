import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { skycoinBetaAreas } from "../../../packages/area-registry/src/index";

const statusLabel: Record<string, string> = {
  available_after_verification: "Available after verification",
  controlled_test_beta: "Controlled test beta",
  integration_beta: "Integration beta",
  gated_unavailable: "Gated / unavailable",
};

const screenSummary = [
  { label: "Registered routes", value: "1,068" },
  { label: "Launchable beta", value: "53" },
  { label: "Controlled / unavailable", value: "64" },
  { label: "Legacy unverified", value: "961" },
] as const;

const statusClass: Record<string, string> = {
  available_after_verification: "border-emerald-400/50 text-emerald-200",
  controlled_test_beta: "border-sky-400/50 text-sky-200",
  integration_beta: "border-amber-400/50 text-amber-200",
  gated_unavailable: "border-red-400/50 text-red-200",
};

export default function BetaAreaCatalog() {
  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050510]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
          <Link href="/" className="text-sm text-white/50 hover:text-white">
            ← Home
          </Link>
          <div className="h-4 w-px bg-white/15" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight">
                Skycoin Ecosystem Beta
              </h1>
              <Badge
                variant="outline"
                className="border-amber-400/50 text-amber-200"
              >
                30 areas
              </Badge>
            </div>
            <p className="text-[11px] text-white/40">
              Canonical capability register and release gates
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <section className="rounded-2xl border border-amber-400/30 bg-amber-400/[0.06] p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-amber-100">
              Evidence-based beta boundary
            </h2>
            <Badge
              variant="outline"
              className="border-amber-400/50 text-amber-200"
            >
              Invitation only
            </Badge>
          </div>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-white/65">
            This catalog shows the current engineering status of every
            registered Skycoin area. An area is not a live service merely
            because a package, page, or repository exists. Financial settlement,
            custody, token actions, blockchain execution, and unverified
            providers remain gated until their independent evidence requirements
            pass.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Full portfolio inventory
              </p>
              <h2 className="mt-2 text-xl font-bold text-white">
                Every route has a status, not a promise
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                The historical portfolio is mapped for development. Only the
                launchable beta routes below are intended for local user testing
                today.
              </p>
            </div>
            <Link
              href="/mission-control"
              className="text-sm font-semibold text-amber-200 hover:text-amber-100"
            >
              Open local launchpad →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {screenSummary.map(item => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-2xl font-black text-white">{item.value}</p>
                <p className="mt-1 text-xs leading-5 text-white/45">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skycoinBetaAreas.map(area => (
            <Card key={area.id} className="border-white/10 bg-white/[0.02]">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base text-white">
                      {area.name}
                    </CardTitle>
                    <p className="mt-1 text-xs capitalize text-white/40">
                      {area.domain}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={statusClass[area.betaAvailability]}
                  >
                    {statusLabel[area.betaAvailability]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-white/55">{area.notes}</p>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/35">
                    Required before promotion
                  </p>
                  <ul className="space-y-1 text-xs leading-5 text-white/60">
                    {area.requiredEvidence.map(evidence => (
                      <li key={evidence}>• {evidence}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-white/35">
          Source of truth:{" "}
          <Link
            href="/mission-control"
            className="text-amber-200/80 hover:text-amber-100"
          >
            Mission Control
          </Link>
          , `packages/area-registry`, and `docs/BETA_AREA_READINESS_MATRIX.md`.
        </p>
      </main>
    </div>
  );
}
