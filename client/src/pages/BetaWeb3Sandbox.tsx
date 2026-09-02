/*
 * Controlled beta Web3 surface: Field Atlas evidence cards for read-only and
 * local/testnet planning. Never connect a wallet, sign, custody, transfer, or
 * execute against a chain from this page.
 */
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Activity, Database, Eye, LockKeyhole, Search, ShieldCheck } from "lucide-react";

type NFTFixture = {
  tokenId: string;
  collection: string;
  owner: string;
  metadataStatus: "indexed" | "pending";
  network: "local" | "testnet";
};

const indexedNFTs: NFTFixture[] = [
  { tokenId: "sky-demo-001", collection: "Field Atlas", owner: "owner:alpha", metadataStatus: "indexed", network: "local" },
  { tokenId: "sky-demo-002", collection: "Field Atlas", owner: "owner:beta", metadataStatus: "indexed", network: "local" },
  { tokenId: "sky-test-017", collection: "Test Collection", owner: "0xtest…7a2", metadataStatus: "pending", network: "testnet" },
];

const protocolSignals = [
  ["Environment", "Local fixture node", "verified"],
  ["Read path", "Deterministic snapshot", "verified"],
  ["Write path", "Disabled by policy", "gated"],
  ["Mainnet", "No connection configured", "unavailable"],
] as const;

const tokenMetadata = [
  { symbol: "SKY444", name: "Skycoin beta token metadata", network: "local", decimals: 8, address: "not deployed" },
  { symbol: "SKYTEST", name: "Testnet fixture token metadata", network: "testnet", decimals: 8, address: "0xtest…metadata" },
] as const;

export default function BetaWeb3Sandbox() {
  const [query, setQuery] = useState("");
  const [network, setNetwork] = useState<"all" | NFTFixture["network"]>("all");

  const filteredNFTs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return indexedNFTs.filter((item) => {
      const matchesNetwork = network === "all" || item.network === network;
      const matchesQuery = !normalized || `${item.tokenId} ${item.collection} ${item.owner}`.toLowerCase().includes(normalized);
      return matchesNetwork && matchesQuery;
    });
  }, [network, query]);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex max-w-6xl items-center gap-3 px-4 py-5">
          <Link href="/beta-catalog" className="text-sm text-muted-foreground hover:text-foreground">← Area catalog</Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black">Web3 Evidence Room</h1>
            <Badge variant="outline" className="border-amber-500/50 text-amber-700">Controlled test</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl space-y-8 px-4 py-10">
        <section className="max-w-3xl">
          <Badge variant="outline" className="mb-3">Read-only / local-testnet boundary</Badge>
          <h2 className="text-3xl font-bold tracking-tight">Inspect the evidence. Do not write to a chain.</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            This surface makes the second-wave Web3 boundary concrete with indexed fixtures and protocol signals. It does not connect wallets, request signatures, hold keys, transfer assets, or claim production-chain availability.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {protocolSignals.map(([label, value, status]) => (
            <Card key={label} className="border-border/60">
              <CardHeader className="pb-3"><CardDescription>{label}</CardDescription><CardTitle className="text-base">{value}</CardTitle></CardHeader>
              <CardContent><Badge variant={status === "verified" ? "default" : "outline"}>{status}</Badge></CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />Token metadata registry</CardTitle><CardDescription>Schema-validated display metadata only; no balances, pricing, minting, or transfer claims.</CardDescription></CardHeader>
            <CardContent className="space-y-3">{tokenMetadata.map((token) => <div key={token.symbol} className="rounded-lg border p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-semibold">{token.symbol}</p><p className="text-sm text-muted-foreground">{token.name}</p></div><Badge variant="outline">{token.network}</Badge></div><p className="mt-2 text-xs text-muted-foreground">Decimals: {token.decimals} · Contract: {token.address}</p></div>)}</CardContent>
          </Card>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole className="h-5 w-5" />Wallet observation</CardTitle><CardDescription>Connection and signing are not part of this beta.</CardDescription></CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground"><p>No address, balance, transaction history, or portfolio value is displayed.</p><p>No wallet connector, private-key input, signature request, custody, transfer, or chain submission is available.</p><Badge variant="outline" className="border-destructive/40 text-destructive">Wallet actions unavailable</Badge></CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div><CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" />Indexed NFT fixtures</CardTitle><CardDescription className="mt-1">Read-only records with provenance labels and network scope.</CardDescription></div>
                <div className="relative w-full sm:w-56"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search token or owner" className="pl-9" /></div>
              </div>
              <div className="flex gap-2 pt-3">
                {(["all", "local", "testnet"] as const).map((value) => <Button key={value} type="button" size="sm" variant={network === value ? "default" : "outline"} onClick={() => setNetwork(value)}>{value}</Button>)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredNFTs.map((item) => (
                <div key={item.tokenId} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div><p className="font-semibold">{item.tokenId}</p><p className="text-sm text-muted-foreground">{item.collection} · owner {item.owner}</p></div>
                  <div className="flex gap-2"><Badge variant="outline">{item.network}</Badge><Badge variant={item.metadataStatus === "indexed" ? "default" : "outline"}>{item.metadataStatus}</Badge></div>
                </div>
              ))}
              {!filteredNFTs.length && <p className="py-8 text-center text-sm text-muted-foreground">No indexed fixture matches this query.</p>}
            </CardContent>
          </Card>

          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole className="h-5 w-5" />Write boundary</CardTitle><CardDescription>These controls are intentionally absent.</CardDescription></CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
              <p><ShieldCheck className="mr-2 inline h-4 w-4 text-primary" />No wallet connection or private-key handling.</p>
              <p><Database className="mr-2 inline h-4 w-4 text-primary" />No token transfer, custody, or settlement.</p>
              <p><Activity className="mr-2 inline h-4 w-4 text-primary" />No mainnet provider or production protocol write.</p>
              <Badge variant="outline" className="border-destructive/40 text-destructive">Live Web3 unavailable</Badge>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
