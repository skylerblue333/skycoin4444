import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Droplets } from "lucide-react";
import { toast } from "sonner";

const PAIRS = [
  { id: "SKY444-USDT", base: "SKY444", quote: "USDT", referencePrice: 4.44 },
  { id: "ETH-USDT", base: "ETH", quote: "USDT", referencePrice: 3891.2 },
  { id: "BTC-USDT", base: "BTC", quote: "USDT", referencePrice: 67420.5 },
  { id: "SOL-USDT", base: "SOL", quote: "USDT", referencePrice: 189.3 },
] as const;

function generateDepthData(midPrice: number) {
  const bids: Array<{ price: number; cumulative: number }> = [];
  const asks: Array<{ price: number; cumulative: number }> = [];
  let bidTotal = 0;
  let askTotal = 0;
  for (let index = 30; index >= 1; index--) {
    const size = 5 + ((index * 17) % 37);
    bidTotal += size;
    bids.push({ price: midPrice * (1 - index * 0.001), cumulative: bidTotal });
  }
  for (let index = 1; index <= 30; index++) {
    const size = 6 + ((index * 13) % 41);
    askTotal += size;
    asks.push({ price: midPrice * (1 + index * 0.001), cumulative: askTotal });
  }
  return { bids, asks };
}

function DepthChart({ midPrice }: { midPrice: number }) {
  const { bids, asks } = useMemo(() => generateDepthData(midPrice), [midPrice]);
  const combined = [
    ...bids.map(row => ({ price: row.price, bidDepth: row.cumulative, askDepth: null })),
    ...asks.map(row => ({ price: row.price, bidDepth: null, askDepth: row.cumulative })),
  ].sort((left, right) => left.price - right.price);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={combined} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="bidDepthGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} /></linearGradient>
          <linearGradient id="askDepthGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} /></linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="price" tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={value => `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={value => `${value} units`} />
        <Tooltip
          contentStyle={{ background: "#0e0a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          formatter={(value, name) => [`${Number(value ?? 0).toFixed(0)} units`, name === "bidDepth" ? "Simulated bid depth" : "Simulated ask depth"]}
        />
        <Area type="stepAfter" dataKey="bidDepth" stroke="#22c55e" fill="url(#bidDepthGradient)" connectNulls={false} />
        <Area type="stepAfter" dataKey="askDepth" stroke="#ef4444" fill="url(#askDepthGradient)" connectNulls={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function DEXDepthChart() {
  const [selectedPair, setSelectedPair] = useState<(typeof PAIRS)[number]["id"]>(PAIRS[0].id);
  const pair = PAIRS.find(item => item.id === selectedPair) ?? PAIRS[0];

  return (
    <div className="min-h-screen bg-[#07050f] p-4 text-white">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10"><Droplets className="h-5 w-5 text-purple-400" /></div>
            <div><h1 className="text-xl font-black">DEX Depth Simulator</h1><p className="text-xs text-slate-500">Synthetic visualization only — not a live order book or liquidity feed.</p></div>
          </div>
          <Select value={selectedPair} onValueChange={value => setSelectedPair(value as (typeof PAIRS)[number]["id"])}>
            <SelectTrigger className="w-44 border-white/10 bg-white/5"><SelectValue /></SelectTrigger>
            <SelectContent>{PAIRS.map(item => <SelectItem key={item.id} value={item.id}>{item.base}/{item.quote}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-200">
          Reference prices and depth curves on this screen are sample inputs for UI testing. No exchange, TVL, volume, spread, or trade execution is verified here.
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0e0a1a] p-4">
          <div className="mb-3 flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-sm font-semibold"><Activity className="h-4 w-4 text-purple-400" />{pair.base}/{pair.quote} simulated depth</h2><Badge variant="outline">Reference ${pair.referencePrice.toLocaleString()}</Badge></div>
          <DepthChart midPrice={pair.referencePrice} />
          <div className="mt-3 flex justify-center gap-6 text-xs"><span className="text-green-400">● Simulated bids</span><span className="text-red-400">● Simulated asks</span></div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.info("Liquidity actions are not implemented yet")}>Add Liquidity</Button>
          <Button variant="outline" onClick={() => toast.info("Swap execution is not implemented yet")}>Swap</Button>
        </div>
      </div>
    </div>
  );
}
