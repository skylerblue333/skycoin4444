import { Activity, Compass, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import SkyMarkEasterEgg from "@/components/SkyMarkEasterEgg";
import routeCatalog from "@/data/routeCatalog.json";
import V4Beta from "./V4Beta";

const routeCount = routeCatalog.routes.length;

const compatibilityEvidence = [
  {
    name: "Full route explorer",
    route: "/platform-map",
    detail: `Search the complete generated registry of ${routeCount.toLocaleString()} static routes.`,
  },
  {
    name: "Account activity evidence",
    route: "/activity-evidence",
    detail: "Inspect account-owned persisted product evidence without inferred engagement or financial analytics.",
  },
] as const;

const gatedCapabilities = [
  "Payment processing and financial settlement",
  "Wallet custody, signing, transfers, and production-chain execution",
  "Public livestream ingest, distribution, audience, and monetization",
  "Unverified people, sellers, products, ratings, or inventory",
  "Provider-backed AI actions and unsupported external integrations",
] as const;

export default function BetaWorkspace() {
  return (
    <div className="bg-[#04040d] text-white">
      <V4Beta />

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6" aria-label="V4 compatibility and evidence links">
        <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:grid-cols-[1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-white/75">
              <Compass className="h-4 w-4 text-cyan-200" />
              Wider ecosystem remains discoverable
            </div>
            <p className="mt-2 text-xs leading-6 text-white/40">
              V4 promotes seven flagships, but it does not erase the prior breadth. Use Ctrl/⌘ K or the full explorer when you need social, creator, asset, commerce, language, dating, learning, and gaming surfaces outside the flagship path. This breadth is not a claim of traffic, scale, custody, streaming delivery, or feature parity.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {compatibilityEvidence.map(item => (
                <Link
                  key={item.route}
                  href={item.route}
                  className="rounded-xl border border-white/10 bg-black/20 p-3 transition hover:border-cyan-300/30"
                >
                  <strong className="text-xs text-white/75">{item.name}</strong>
                  <p className="mt-1 text-[11px] leading-5 text-white/35">{item.detail}</p>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-amber-100/80">
              <ShieldCheck className="h-4 w-4" />
              High-risk capabilities remain gated
            </div>
            <div className="mt-3 space-y-2">
              {gatedCapabilities.map(item => (
                <div
                  key={item}
                  className="flex gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-xs leading-5 text-white/45"
                >
                  <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-200/65" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SkyMarkEasterEgg
          index={1}
          word="BUILD"
          message="A big vision becomes trustworthy one tested piece at a time. Build the piece in front of you, then make it better."
        />
      </section>
    </div>
  );
}
