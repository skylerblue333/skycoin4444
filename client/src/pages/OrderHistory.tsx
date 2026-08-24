import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { DollarSign, Download, Package, RefreshCw, Search, Shield, ShoppingBag, Star } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; progress: number }> = {
  pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", progress: 15 },
  processing: { label: "Processing", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", progress: 40 },
  shipped: { label: "Shipped", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", progress: 70 },
  delivered: { label: "Delivered", color: "bg-green-500/20 text-green-400 border-green-500/30", progress: 100 },
  cancelled: { label: "Cancelled", color: "bg-red-500/20 text-red-400 border-red-500/30", progress: 0 },
  completed: { label: "Completed", color: "bg-green-500/20 text-green-400 border-green-500/30", progress: 100 },
};

function OrderCard({ order }: { order: any }) {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0e0a1a] p-4 transition-all hover:border-purple-500/20">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20"><Package className="h-6 w-6 text-purple-400" /></div>
          <div><p className="text-sm font-semibold text-white">{order.listingTitle || "Marketplace Item"}</p><p className="text-xs text-slate-500">Order #{order.id} · {new Date(order.createdAt).toLocaleDateString()}</p></div>
        </div>
        <Badge className={`text-[10px] ${status.color}`}>{status.label}</Badge>
      </div>
      {order.status !== "cancelled" ? <div className="mb-3"><Progress value={status.progress} className="h-1.5" /></div> : null}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /><span className="font-bold text-white">{Number(order.totalPrice || 0).toLocaleString()} SKY444</span></span>
          {order.escrowStatus ? <span className="flex items-center gap-1 text-cyan-400"><Shield className="h-3 w-3" />Escrow: {order.escrowStatus}</span> : null}
        </div>
        <div className="flex gap-2">
          {(order.status === "delivered" || order.status === "completed") ? <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.info("Review submission is not implemented yet")}><Star className="mr-1 h-3 w-3" />Review</Button> : null}
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.info("Invoice download is not implemented yet")}><Download className="mr-1 h-3 w-3" />Invoice</Button>
        </div>
      </div>
    </div>
  );
}

export default function OrderHistory() {
  const { isAuthenticated } = useAuth();
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [search, setSearch] = useState("");
  const { data: orders, isLoading, error, refetch } = trpc.marketplace.myOrders.useQuery({ role }, { enabled: isAuthenticated, retry: false });

  if (!isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center bg-[#07050f]"><div className="space-y-4 text-center"><ShoppingBag className="mx-auto h-16 w-16 text-slate-700" /><h2 className="text-xl font-bold text-white">Sign in to view orders</h2><a href={getLoginUrl()}><Button>Sign In</Button></a></div></div>;
  }

  const availableOrders = Array.isArray(orders) ? orders : [];
  const filtered = availableOrders.filter((order: any) => !search || (order.listingTitle || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#07050f] p-4 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader icon={ShoppingBag} title="Order History" subtitle="Track verified marketplace purchases and sales" backHref="/marketplace" />
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1 rounded-xl bg-white/5 p-1">{(["buyer", "seller"] as const).map(value => <button key={value} onClick={() => setRole(value)} className={`rounded-lg px-4 py-1.5 text-sm capitalize ${role === value ? "bg-purple-500/20 text-purple-300" : "text-slate-500"}`}>{value === "buyer" ? "My Purchases" : "My Sales"}</button>)}</div>
          <div className="relative min-w-48 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search orders..." className="h-9 border-white/10 bg-white/5 pl-9 text-white" /></div>
          <Button size="sm" variant="outline" className="h-9" onClick={() => void refetch()}><RefreshCw className="h-3.5 w-3.5" /></Button>
        </div>
        {error ? <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200">Order history is unavailable: {error.message}</div> : null}
        {isLoading ? <div className="py-12 text-center text-slate-500">Loading orders…</div> : filtered.length ? <div className="space-y-3">{filtered.map((order: any) => <OrderCard key={order.id} order={order} />)}</div> : <div className="py-16 text-center"><Package className="mx-auto mb-4 h-16 w-16 text-slate-700" /><h3 className="text-lg font-bold text-slate-400">No verified orders to display</h3><Link href="/marketplace"><Button className="mt-4">Browse Marketplace</Button></Link></div>}
      </div>
    </div>
  );
}
