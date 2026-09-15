import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  TicketPercent,
} from "lucide-react";
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
import {
  buildCommerceSandboxQuotePlan,
  commerceSandboxDeliveryScenarios,
  commerceSandboxPromoFixtures,
  mergeWishlistIntoCommerceCart,
  normalizeCommercePromoCode,
  normalizeCommerceSandboxWishlist,
  toggleCommerceSandboxWishlist,
  type CommerceSandboxDeliveryScenario,
  type CommerceSandboxWishlist,
} from "@/lib/commerceSandbox";
import { Link } from "wouter";

const CART_STORAGE_KEY = "sky4444.commerce-sandbox-cart";
const WISHLIST_STORAGE_KEY = "sky4444.commerce-sandbox-wishlist.v1";
const categories = ["All", "Learning", "Creator", "Community"] as const;

function persistLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The commerce rehearsal remains usable when browser storage is unavailable.
  }
}

export default function BetaCommerceSandbox() {
  const [cart, setCart] = useState<CommerceSandboxCart>({});
  const [wishlist, setWishlist] = useState<CommerceSandboxWishlist>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const [promoDraft, setPromoDraft] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [deliveryScenario, setDeliveryScenario] =
    useState<CommerceSandboxDeliveryScenario>("collection");

  useEffect(() => {
    try {
      setCart(
        normalizeCommerceSandboxCart(
          JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "{}")
        )
      );
    } catch {
      setCart({});
    }

    try {
      setWishlist(
        normalizeCommerceSandboxWishlist(
          JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) ?? "[]")
        )
      );
    } catch {
      setWishlist([]);
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
      persistLocal(CART_STORAGE_KEY, next);
      return next;
    });
  };

  const toggleSaved = (sku: string) => {
    setWishlist(current => {
      const next = toggleCommerceSandboxWishlist(current, sku);
      persistLocal(WISHLIST_STORAGE_KEY, next);
      return next;
    });
  };

  const addSavedToCart = () => {
    setCart(current => {
      const next = mergeWishlistIntoCommerceCart(current, wishlist);
      persistLocal(CART_STORAGE_KEY, next);
      return next;
    });
  };

  const clearCart = () => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // State still clears in memory when storage access is blocked.
    }
    setCart({});
  };

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return commerceSandboxItems.filter(
      item =>
        (category === "All" || item.category === category) &&
        (!savedOnly || wishlist.includes(item.sku)) &&
        (!normalized ||
          item.name.toLowerCase().includes(normalized) ||
          item.description.toLowerCase().includes(normalized))
    );
  }, [category, query, savedOnly, wishlist]);

  const plan = useMemo(
    () => buildCommerceSandboxQuotePlan(cart, promoCode, deliveryScenario),
    [cart, deliveryScenario, promoCode]
  );
  const quote = plan.quote;

  const applyPromo = () => {
    const normalized = normalizeCommercePromoCode(promoDraft);
    setPromoDraft(normalized);
    setPromoCode(normalized);
  };

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
              Discover, save, cart, plan, and quote.
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-white/60">
              All {commerceSandboxItems.length} products are fictional test fixtures. You can now rehearse
              saved-item discovery, category promos, delivery-cost scenarios, cart persistence, and checkout
              math without creating a real seller, inventory record, order, payment, shipment, review, or commission.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/45">
              <Badge variant="outline" className="border-white/10 text-white/55">{commerceSandboxItems.length} fixtures</Badge>
              <Badge variant="outline" className="border-white/10 text-white/55">{categories.length - 1} categories</Badge>
              <Badge variant="outline" className="border-white/10 text-white/55">{wishlist.length} saved locally</Badge>
              <Badge variant="outline" className="border-white/10 text-white/55">Deterministic quote planner</Badge>
            </div>
          </div>
          <Card className="border-amber-400/30 bg-amber-400/[0.05]">
            <CardContent className="flex items-start gap-3 p-5">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-amber-200" />
              <div>
                <strong className="text-amber-100">
                  Payment and fulfillment are intentionally disabled
                </strong>
                <p className="mt-1 text-sm leading-6 text-white/55">
                  Promo, tax, and delivery values are deterministic fixture math. No address, card, bank,
                  wallet, carrier, shipment, settlement, or provider authorization is created.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_24rem]">
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
              <Button
                type="button"
                size="sm"
                variant={savedOnly ? "default" : "outline"}
                onClick={() => setSavedOnly(current => !current)}
              >
                <Heart className={`mr-1.5 h-4 w-4 ${savedOnly ? "fill-current" : ""}`} />
                Saved {wishlist.length}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
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
              {wishlist.length > 0 ? (
                <Button type="button" size="sm" variant="secondary" onClick={addSavedToCart}>
                  <ShoppingCart className="mr-1.5 h-4 w-4" />
                  Add saved to cart
                </Button>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {visibleItems.map(item => {
                const quantity = cart[item.sku] ?? 0;
                const saved = wishlist.includes(item.sku);
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
                        <button
                          type="button"
                          onClick={() => toggleSaved(item.sku)}
                          aria-label={saved ? `Remove ${item.name} from saved items` : `Save ${item.name} for later`}
                          className={
                            "grid h-9 w-9 place-items-center rounded-xl border transition " +
                            (saved
                              ? "border-rose-300/30 bg-rose-300/10 text-rose-200"
                              : "border-white/10 bg-white/[0.03] text-white/35 hover:text-white")
                          }
                        >
                          <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                        </button>
                      </div>
                      <CardTitle className="text-white">{item.name}</CardTitle>
                      <CardDescription className="leading-6 text-white/50">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-3">
                      <div>
                        <strong className="text-emerald-200">
                          {"$" + (item.unitAmountMinor / 100).toFixed(2)}
                        </strong>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/25">Test fixture</p>
                      </div>
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
                {savedOnly
                  ? "No saved fixture products match these filters. Turn off Saved or change the search."
                  : "No fixture products match this search."}
              </p>
            )}
          </div>

          <div className="space-y-4 lg:sticky lg:top-6 lg:h-fit">
            <Card className="border-sky-400/25 bg-sky-400/[0.05]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <ShoppingCart className="h-5 w-5" />
                    Test cart
                  </CardTitle>
                  <Badge variant="outline" className="text-sky-200">
                    {plan.itemCount} items
                  </Badge>
                </div>
                <CardDescription className="text-white/50">
                  Cart and saved items persist on this browser only.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.items.length ? (
                  <div className="space-y-3">
                    {plan.items.map(item => (
                      <div
                        key={item.sku}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <span className="text-white/65">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-white">
                          {"$" +
                            ((item.quantity * item.unitAmountMinor) / 100).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-white/45">
                    Add a fixture product to start the cart and quote loop.
                  </p>
                )}

                <div className="space-y-2 border-t border-white/10 pt-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-white/65" htmlFor="delivery-scenario">
                    <PackageCheck className="h-4 w-4 text-sky-200" />
                    Delivery-cost scenario
                  </label>
                  <select
                    id="delivery-scenario"
                    value={deliveryScenario}
                    onChange={event =>
                      setDeliveryScenario(event.target.value as CommerceSandboxDeliveryScenario)
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b0b1c] px-3 py-2.5 text-sm text-white outline-none focus:border-sky-300/40"
                  >
                    {commerceSandboxDeliveryScenarios.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] leading-5 text-white/35">{plan.delivery.message}</p>
                </div>

                <div className="space-y-2 border-t border-white/10 pt-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-white/65" htmlFor="promo-fixture">
                    <TicketPercent className="h-4 w-4 text-violet-200" />
                    Promo fixture
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="promo-fixture"
                      value={promoDraft}
                      onChange={event => setPromoDraft(event.target.value)}
                      onKeyDown={event => {
                        if (event.key === "Enter") applyPromo();
                      }}
                      placeholder="LEARN10"
                      className="border-white/10 bg-white/[0.04] text-white"
                    />
                    <Button type="button" variant="secondary" onClick={applyPromo}>
                      Apply
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {commerceSandboxPromoFixtures.map(promo => (
                      <button
                        key={promo.code}
                        type="button"
                        title={promo.description}
                        onClick={() => {
                          setPromoDraft(promo.code);
                          setPromoCode(promo.code);
                        }}
                        className="rounded-lg border border-violet-300/15 bg-violet-300/[0.05] px-2 py-1 text-[10px] font-bold text-violet-100/70 hover:bg-violet-300/10 hover:text-violet-100"
                      >
                        {promo.code}
                      </button>
                    ))}
                    {promoCode ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPromoDraft("");
                          setPromoCode("");
                        }}
                        className="rounded-lg border border-white/10 px-2 py-1 text-[10px] font-bold text-white/35 hover:text-white"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                  <p
                    className={
                      "text-[11px] leading-5 " +
                      (!plan.promo.recognized
                        ? "text-rose-200/70"
                        : plan.promo.applied
                          ? "text-emerald-200/70"
                          : "text-white/35")
                    }
                  >
                    {plan.promo.message}
                  </p>
                </div>

                {quote ? (
                  <div className="space-y-2 border-t border-white/10 pt-4 text-sm">
                    <div className="flex justify-between text-white/60">
                      <span>Subtotal</span>
                      <span>{"$" + (quote.subtotalMinor / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Promo fixture</span>
                      <span>
                        {plan.promo.discountMinor
                          ? "−$" + (plan.promo.discountMinor / 100).toFixed(2)
                          : "$0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>{plan.delivery.label}</span>
                      <span>{"$" + (quote.shippingAmountMinor / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Tax fixture (8% after promo)</span>
                      <span>{"$" + (quote.taxAmountMinor / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-3 text-base font-bold text-white">
                      <span>Total quote</span>
                      <span>
                        {"$" + (quote.totalAmountMinor / 100).toFixed(2)}{" "}
                        {quote.currency}
                      </span>
                    </div>
                    <p className="pt-1 text-[10px] leading-4 text-white/30">
                      Contract: {quote.contract}. This is inspectable quote math only—not an order or authorization.
                    </p>
                  </div>
                ) : (
                  <div className="border-t border-white/10 pt-4 text-sm text-white/45">
                    Your quote breakdown will appear after you add the first fixture.
                  </div>
                )}

                <Button type="button" className="w-full" disabled>
                  Payment unavailable in beta
                </Button>
                {plan.itemCount > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-white/45 hover:text-white"
                    onClick={clearCart}
                  >
                    Clear test cart
                  </Button>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.025]">
              <CardHeader>
                <CardTitle className="text-sm text-white">What this loop proves</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs leading-5 text-white/45">
                <p>• Fixture discovery, filtering, saved items, and cart state can be exercised repeatedly.</p>
                <p>• Promo, delivery, tax, and total math is deterministic and unit tested.</p>
                <p>• The existing checkout quote contract remains the calculation boundary.</p>
                <p>• No personal delivery address, payment credential, seller account, or fulfillment record is requested.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
