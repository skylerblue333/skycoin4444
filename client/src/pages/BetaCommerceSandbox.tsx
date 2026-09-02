import { useMemo, useState } from "react";
import { quoteCheckout } from "../../../packages/sky-checkout/src/index";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export default function BetaCommerceSandbox() {
  const [quantity, setQuantity] = useState(1);
  const quote = useMemo(
    () =>
      quoteCheckout({
        checkoutId: "checkout:beta:sandbox",
        currency: "usd",
        lines: [{ sku: "COURSE-BETA", quantity, unitAmountMinor: 1250 }],
        taxAmountMinor: 200,
        discountAmountMinor: 100,
      }),
    [quantity]
  );

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <header className="border-b border-white/10 bg-[#050510]/95">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <Link
            href="/beta-journey"
            className="text-sm text-white/50 hover:text-white"
          >
            ← Beta journey
          </Link>
          <div className="h-4 w-px bg-white/15" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black">Commerce Sandbox</h1>
            <Badge variant="outline" className="border-sky-400/50 text-sky-200">
              Test only
            </Badge>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <section>
          <h2 className="text-3xl font-bold">
            Preview a deterministic checkout quote
          </h2>
          <p className="mt-3 max-w-2xl text-white/60">
            This sandbox exercises the checkout planning contract using fixed
            test data. It never charges a card, creates an order, settles funds,
            calls a payment provider, or claims inventory.
          </p>
        </section>
        <Card className="border-sky-400/30 bg-sky-400/[0.05]">
          <CardHeader>
            <CardTitle className="text-base">Test course item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex max-w-xs items-center gap-3">
              <label htmlFor="quantity" className="text-sm text-white/70">
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={event =>
                  setQuantity(
                    Math.min(10, Math.max(1, Number(event.target.value) || 1))
                  )
                }
              />
            </div>
            <div className="grid gap-2 text-sm text-white/65 sm:grid-cols-2">
              <p>
                Subtotal:{" "}
                <strong className="text-white">
                  ${(quote.subtotalMinor / 100).toFixed(2)}
                </strong>
              </p>
              <p>
                Tax fixture:{" "}
                <strong className="text-white">
                  ${(quote.taxAmountMinor / 100).toFixed(2)}
                </strong>
              </p>
              <p>
                Discount fixture:{" "}
                <strong className="text-white">
                  -${(quote.discountAmountMinor / 100).toFixed(2)}
                </strong>
              </p>
              <p>
                Total quote:{" "}
                <strong className="text-emerald-200">
                  ${(quote.totalAmountMinor / 100).toFixed(2)} {quote.currency}
                </strong>
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-amber-400/50 text-amber-200"
            >
              No payment or settlement performed
            </Badge>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
