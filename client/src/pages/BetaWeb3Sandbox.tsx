import { useState } from "react";
import {
  applyTransfer,
  createNFTRecord,
  planTransfer,
} from "../../../packages/sky-nft-core/src/index";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

const initialRecord = createNFTRecord(
  "token:beta:demo",
  "owner:alpha",
  "ipfs://beta-demo-metadata"
);

export default function BetaWeb3Sandbox() {
  const [record, setRecord] = useState(initialRecord);
  const [lastPlan, setLastPlan] = useState<ReturnType<
    typeof planTransfer
  > | null>(null);

  function simulateTransfer() {
    const transfer = planTransfer(
      record,
      record.ownerId === "owner:alpha" ? "owner:beta" : "owner:alpha",
      1
    );
    setLastPlan(transfer);
    setRecord(applyTransfer(record, transfer));
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <header className="border-b border-white/10 bg-[#050510]/95">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <Link
            href="/beta-catalog"
            className="text-sm text-white/50 hover:text-white"
          >
            ← Area catalog
          </Link>
          <div className="h-4 w-px bg-white/15" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black">Web3 Sandbox</h1>
            <Badge variant="outline" className="border-sky-400/50 text-sky-200">
              Local only
            </Badge>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <section>
          <h2 className="text-3xl font-bold">
            Preview ownership planning without chain execution
          </h2>
          <p className="mt-3 max-w-2xl text-white/60">
            This sandbox uses the existing NFT domain contract with
            deterministic local records. It never connects a wallet, signs a
            transaction, transfers a token, touches mainnet or testnet, or holds
            custody.
          </p>
        </section>
        <Card className="border-sky-400/30 bg-sky-400/[0.05]">
          <CardHeader>
            <CardTitle className="text-base">
              Deterministic NFT fixture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-2 text-white/65 sm:grid-cols-2">
              <p>
                Token: <strong className="text-white">{record.tokenId}</strong>
              </p>
              <p>
                Owner: <strong className="text-white">{record.ownerId}</strong>
              </p>
              <p>
                Version:{" "}
                <strong className="text-white">{record.version}</strong>
              </p>
              <p>
                Metadata:{" "}
                <strong className="text-white">{record.metadataUri}</strong>
              </p>
            </div>
            <Button onClick={simulateTransfer}>
              Simulate local ownership plan
            </Button>
            {lastPlan && (
              <pre className="overflow-auto rounded-lg border border-white/10 bg-black/20 p-4 text-xs text-white/60">
                {JSON.stringify(lastPlan, null, 2)}
              </pre>
            )}
            <Badge
              variant="outline"
              className="border-amber-400/50 text-amber-200"
            >
              No wallet, custody, signing, or chain execution
            </Badge>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
