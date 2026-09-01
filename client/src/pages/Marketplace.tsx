import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import {
  BadgeCheck,
  Boxes,
  CreditCard,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExperienceShell, SurfaceCard } from "@/components/ecosystem/ExperienceShell";

const READINESS = [
  { icon: Boxes, label: "Catalog and inventory", detail: "Authoritative product, seller and stock contracts", status: "Pending" },
  { icon: CreditCard, label: "Checkout and payment", detail: "Server-side payment, refund and order-state handling", status: "Pending" },
  { icon: ShieldCheck, label: "Trust and fraud controls", detail: "Authorization, abuse protection and audit events", status: "Pending" },
  { icon: Truck, label: "Fulfillment", detail: "Verified delivery, returns and reconciliation contracts", status: "Pending" },
] as const;

const PREVIEW_CATEGORIES = [
  { icon: Store, label: "Marketplace" },
  { icon: PackageCheck, label: "Digital goods" },
  { icon: BadgeCheck, label: "Verified sellers" },
] as const;

export default function Marketplace() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500">Loading account state…</main>;
  }

  return (
    <ExperienceShell
      title="SkyShop Marketplace"
      subtitle="A production-minded commerce surface with explicit integration readiness."
      icon={ShoppingBag}
      accent="orange"
      badge="Engineering beta"
      actions={
        isAuthenticated && user ? (
          <Button variant="outline" disabled className="rounded-xl border-slate-200 bg-white">Orders unavailable</Button>
        ) : (
          <Button onClick={() => startLogin()} className="rounded-xl bg-orange-600 hover:bg-orange-700">Sign in</Button>
        )
      }
    >
      <div className="space-y-5">
        <SurfaceCard className="relative overflow-hidden bg-slate-950 p-6 text-white md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(249,115,22,.30),transparent_35%),radial-gradient(circle_at_15%_90%,rgba(59,130,246,.20),transparent_35%)]" />
          <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-orange-300">Commerce integration preview</span>
              <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight md:text-4xl">Premium storefront UX without fake inventory or checkout.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">The shopping interface is ready to host verified catalog data. Until authoritative services are connected, this page intentionally avoids synthetic products, prices, ratings, delivery claims, payments and successful-order states.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {PREVIEW_CATEGORIES.map(({ icon: Icon, label }) => <span key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200"><Icon className="h-4 w-4 text-orange-300" /> {label}</span>)}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-bold"><Search className="h-4 w-4 text-orange-300" /> Catalog search preview</div>
              <div className="relative mt-3"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><Input disabled placeholder="Catalog service not connected" className="h-11 rounded-xl border-white/10 bg-slate-900/80 pl-9 text-slate-300 placeholder:text-slate-600" /></div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400"><span>Inventory source</span><span className="rounded-full bg-slate-800 px-2 py-1 font-semibold text-slate-300">Not configured</span></div>
            </div>
          </div>
        </SurfaceCard>

        {!isAuthenticated || !user ? (
          <SurfaceCard className="flex flex-col items-start justify-between gap-4 border-orange-200 bg-orange-50/60 p-5 sm:flex-row sm:items-center">
            <div><h2 className="font-bold text-slate-900">Account-scoped marketplace services</h2><p className="mt-1 text-sm text-slate-600">Sign in to establish account context. Catalog and checkout remain unavailable until their backend contracts are activated.</p></div>
            <Button onClick={() => startLogin()} className="shrink-0 rounded-xl bg-orange-600 hover:bg-orange-700">Sign in</Button>
          </SurfaceCard>
        ) : (
          <SurfaceCard className="flex items-center gap-3 border-emerald-200 bg-emerald-50/60 p-4"><ShieldCheck className="h-5 w-5 text-emerald-600" /><div><div className="text-sm font-bold text-emerald-900">Account context available</div><div className="text-xs text-emerald-700">Commerce transactions are still disabled until marketplace services pass their activation gates.</div></div></SurfaceCard>
        )}

        <div>
          <div className="mb-3"><h2 className="text-lg font-bold">Activation readiness</h2><p className="mt-1 text-sm text-slate-500">The UI exposes each missing contract instead of masking it with mock success paths.</p></div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {READINESS.map(({ icon: Icon, label, detail, status }) => (
              <SurfaceCard key={label} className="p-5">
                <div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-700"><Icon className="h-5 w-5" /></span><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">{status}</span></div>
                <h3 className="mt-4 text-sm font-bold text-slate-900">{label}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
              </SurfaceCard>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <SurfaceCard className="p-5 md:p-6">
            <div className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-orange-600" /><h2 className="font-bold">Product-grid experience</h2></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {["Product media", "Verified price", "Inventory status"].map((label, index) => <div key={label} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3"><div className={`aspect-[4/3] rounded-xl ${index === 0 ? "bg-gradient-to-br from-orange-100 to-amber-50" : index === 1 ? "bg-gradient-to-br from-blue-100 to-indigo-50" : "bg-gradient-to-br from-emerald-100 to-cyan-50"}`} /><div className="mt-3 h-3 w-2/3 rounded bg-slate-200" /><div className="mt-2 h-2 w-1/2 rounded bg-slate-100" /><div className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label} pending</div></div>)}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5 md:p-6">
            <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /><h2 className="font-bold">Activation policy</h2></div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• No synthetic products or seller identities.</li>
              <li>• No payment action without server-side reconciliation.</li>
              <li>• No delivery, rating or inventory claims without source data.</li>
              <li>• No commission or order-success state without auditable records.</li>
            </ul>
            <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">This page is an engineering-beta storefront surface, not an active marketplace.</div>
          </SurfaceCard>
        </div>
      </div>
    </ExperienceShell>
  );
}
