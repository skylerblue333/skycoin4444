import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Search, ShieldCheck, ShoppingCart } from "lucide-react";
import { quoteCheckout } from "../../../packages/sky-checkout/src/index";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  commerceSandboxItems,
  normalizeCommerceSandboxCart,
  type CommerceSandboxCart,
} from "@/lib/competitiveLabs";
import { Link } from "wouter";

const STORAGE_KEY = "sky4444.commerce-sandbox-cart";
const categories = ["All", "Learning", "Creator", "Community"] as const;

export default function BetaCommerceSandbox() {
  const [cart, setCart] = useState<CommerceSandboxCart>({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");

  useEffect(() => {
    try {
      setCart(
        normalizeCommerceSandboxCart(
          JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")
        )
      );
    } catch {
      setCart({});
    }
  }, []);

  const updateQuantity = (sku: string, change: number) => {
    setCart(current => {
      const nextQuantity = Math.min(
        10,
        Math.max(0, (current[sku] ?? 0) + change)
      );
      const next = { ...current };
      if (nextQuantity === 0) delete next[sku];
      else next[sku] = nextQuantity;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return commerceSandboxItems.filter(
      item =>
        (category === "All" || item.category === category) &&
        (!normalized ||
          item.name.toLowerCase().includes(normalized) ||
          item.description.toLowerCase().includes(normalized))
    );
  }, [category, query]);

  const cartLines = commerceSandboxItems
    .filter(item => cart[item.sku])
    .map(item => ({
      sku: item.sku,
      quantity: cart[item.sku],
      unitAmountMinor: item.unitAmountMinor,
    }));
  const subtotalMinor = cartLines.reduce(
    (sum, line) => sum + line.quantity * line.unitAmountMinor,
    0
  );
  const quote = quoteCheckout({
    checkoutId: "checkout:beta:fixture-marketplace",
    currency: "usd",
    lines: cartLines,
    taxAmountMinor: Math.round(subtotalMinor * 0.08),
    discountAmountMinor: 0,
  });
  const itemCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <header className="border-b border-white/10 bg-[#050510]/95">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
          <Link
            href="/beta-workspace"
            className="text-sm text-white/50 hover:text-white"
          >
            ← Ecosystem beta
          </Link>
          <div className="h-4 w-px bg-white/15" />
          <h1 className="text-lg font-black">Privacy-first Commerce Sandbox</h1>
          <Badge variant="outline" className="border-sky-400/50 text-sky-200">
            Fixture catalog
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200/70">
              Safe product rehearsal
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Browse, search, cart, and quote.
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-white/60">
              All three products are fictional test fixtures. This sandbox never
              creates a real listing, seller, stock record, order, payment,
              shipment, review, or commission—and it does not enable prohibited
              or illicit trade.
            </p>
          </div>
          <Card className="border-amber-400/30 bg-amber-400/[0.05]">
            <CardContent className="flex items-start gap-3 p-5">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-amber-200" />
              <div>
                <strong className="text-amber-100">
                  Payment is intentionally disabled
                </strong>
                <p className="mt-1 text-sm leading-6 text-white/55">
                  Quote math is deterministic local evidence, not settlement or
                  provider authorization.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/35" />
                <Input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Search fixture products"
                  className="border-white/10 bg-white/[0.04] pl-9 text-white"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(option => (
                  <Button
                    type="button"
                    key={option}
                    size="sm"
                    variant={category === option ? "default" : "outline"}
                    onClick={() => setCategory(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {visibleItems.map(item => {
                const quantity = cart[item.sku] ?? 0;
                return (
                  <Card
                    key={item.sku}
                    className="border-white/10 bg-white/[0.03]"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <Badge
                          variant="outline"
                          className="border-white/20 text-white/60"
                        >
                          {item.category}
                        </Badge>
                        <span className="text-xs text-white/35">
                          Test fixture
                        </span>
                      </div>
                      <CardTitle className="text-white">{item.name}</CardTitle>
                      <CardDescription className="leading-6 text-white/50">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-3">
                      <strong className="text-emerald-200">
                        {"$" + (item.unitAmountMinor / 100).toFixed(2)}
                      </strong>
                      {quantity === 0 ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => updateQuantity(item.sku, 1)}
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            aria-label={"Remove one " + item.name}
                            onClick={() => updateQuantity(item.sku, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span
                            className="w-5 text-center text-sm font-semibold text-white"
                            aria-label={"Quantity " + quantity}
                          >
                            {quantity}
                          </span>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            aria-label={"Add one " + item.name}
                            disabled={quantity >= 10}
                            onClick={() => updateQuantity(item.sku, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {visibleItems.length === 0 && (
              <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-white/45">
                No fixture products match this search.
              </p>
            )}
          </div>

          <Card className="h-fit border-sky-400/25 bg-sky-400/[0.05] lg:sticky lg:top-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <ShoppingCart className="h-5 w-5" />
                  Test cart
                </CardTitle>
                <Badge variant="outline" className="text-sky-200">
                  {itemCount} items
                </Badge>
              </div>
              <CardDescription className="text-white/50">
                Persists locally after refresh.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartLines.length ? (
                <div className="space-y-3">
                  {cartLines.map(line => {
                    const item = commerceSandboxItems.find(
                      candidate => candidate.sku === line.sku
                    );
                    if (!item) return null;
                    return (
                      <div
                        key={line.sku}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <span className="text-white/65">
                          {item.name} × {line.quantity}
                        </span>
                        <span className="text-white">
                          {"$" +
                            (
                              (line.quantity * line.unitAmountMinor) /
                              100
                            ).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-white/45">
                  Add a fixture product to test the cart.
                </p>
              )}
              <div className="space-y-2 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>{"$" + (quote.subtotalMinor / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Tax fixture (8%)</span>
                  <span>{"$" + (quote.taxAmountMinor / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white">
                  <span>Total quote</span>
                  <span>
                    {"$" + (quote.totalAmountMinor / 100).toFixed(2)}{" "}
                    {quote.currency}
                  </span>
                </div>
              </div>
              <Button type="button" className="w-full" disabled>
                Payment unavailable in beta
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
