import { quoteCheckout, type CheckoutQuote } from "../../../packages/sky-checkout/src/index";
import {
  commerceSandboxItems,
  normalizeCommerceSandboxCart,
  type CommerceSandboxCart,
  type CommerceSandboxItem,
} from "./competitiveLabs";

export type CommerceSandboxWishlist = string[];
export type CommerceSandboxDeliveryScenario =
  | "collection"
  | "standard"
  | "express";

export type CommerceSandboxPromoResult = {
  code: string;
  label: string;
  recognized: boolean;
  applied: boolean;
  eligibleSubtotalMinor: number;
  discountMinor: number;
  message: string;
};

export type CommerceSandboxDeliveryQuote = {
  scenario: CommerceSandboxDeliveryScenario;
  label: string;
  amountMinor: number;
  message: string;
};

export type CommerceSandboxQuotePlan = {
  cart: CommerceSandboxCart;
  items: Array<CommerceSandboxItem & { quantity: number }>;
  itemCount: number;
  promo: CommerceSandboxPromoResult;
  delivery: CommerceSandboxDeliveryQuote;
  taxRate: number;
  taxAmountMinor: number;
  quote: CheckoutQuote | null;
};

export const commerceSandboxPromoFixtures = [
  {
    code: "LEARN10",
    label: "10% off Learning fixtures",
    description: "10% off Learning-category fixtures, capped at $15.00.",
  },
  {
    code: "CREATOR15",
    label: "15% off Creator fixtures",
    description: "15% off Creator-category fixtures, capped at $25.00.",
  },
  {
    code: "COMMUNITY5",
    label: "$5 Community fixture credit",
    description: "$5.00 off when Community-category fixtures total at least $20.00.",
  },
] as const;

export const commerceSandboxDeliveryScenarios: ReadonlyArray<{
  id: CommerceSandboxDeliveryScenario;
  label: string;
  description: string;
}> = [
  {
    id: "collection",
    label: "Collection rehearsal",
    description: "No delivery-cost fixture is added.",
  },
  {
    id: "standard",
    label: "Standard delivery fixture",
    description: "$5.99 plus $1.00 for each additional cart item.",
  },
  {
    id: "express",
    label: "Express delivery fixture",
    description: "$12.99 plus $2.00 for each additional cart item.",
  },
] as const;

const knownSkus = new Set(commerceSandboxItems.map(item => item.sku));

export function normalizeCommerceSandboxWishlist(
  value: unknown
): CommerceSandboxWishlist {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value.filter(
        (sku): sku is string => typeof sku === "string" && knownSkus.has(sku)
      )
    )
  ).slice(0, commerceSandboxItems.length);
}

export function toggleCommerceSandboxWishlist(
  wishlist: CommerceSandboxWishlist,
  sku: string
): CommerceSandboxWishlist {
  const normalized = normalizeCommerceSandboxWishlist(wishlist);
  if (!knownSkus.has(sku)) return normalized;
  return normalized.includes(sku)
    ? normalized.filter(candidate => candidate !== sku)
    : [...normalized, sku];
}

export function mergeWishlistIntoCommerceCart(
  cart: CommerceSandboxCart,
  wishlist: CommerceSandboxWishlist
): CommerceSandboxCart {
  const normalizedCart = normalizeCommerceSandboxCart(cart);
  const normalizedWishlist = normalizeCommerceSandboxWishlist(wishlist);
  const next = { ...normalizedCart };
  for (const sku of normalizedWishlist) {
    if (!next[sku]) next[sku] = 1;
  }
  return next;
}

function categorySubtotalMinor(
  cart: CommerceSandboxCart,
  category: CommerceSandboxItem["category"]
) {
  return commerceSandboxItems.reduce((sum, item) => {
    if (item.category !== category) return sum;
    return sum + (cart[item.sku] ?? 0) * item.unitAmountMinor;
  }, 0);
}

export function normalizeCommercePromoCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "").slice(0, 24);
}

export function resolveCommerceSandboxPromo(
  cart: CommerceSandboxCart,
  rawCode: string
): CommerceSandboxPromoResult {
  const normalizedCart = normalizeCommerceSandboxCart(cart);
  const code = normalizeCommercePromoCode(rawCode);

  if (!code) {
    return {
      code: "",
      label: "No promo fixture",
      recognized: true,
      applied: false,
      eligibleSubtotalMinor: 0,
      discountMinor: 0,
      message: "Enter a fixture promo code to rehearse deterministic discount math.",
    };
  }

  if (code === "LEARN10") {
    const eligibleSubtotalMinor = categorySubtotalMinor(normalizedCart, "Learning");
    const discountMinor = Math.min(1500, Math.round(eligibleSubtotalMinor * 0.1));
    return {
      code,
      label: "Learning 10% fixture",
      recognized: true,
      applied: discountMinor > 0,
      eligibleSubtotalMinor,
      discountMinor,
      message:
        discountMinor > 0
          ? "Applied to Learning fixtures only; discount is capped at $15.00."
          : "Add a Learning fixture before this rehearsal code can apply.",
    };
  }

  if (code === "CREATOR15") {
    const eligibleSubtotalMinor = categorySubtotalMinor(normalizedCart, "Creator");
    const discountMinor = Math.min(2500, Math.round(eligibleSubtotalMinor * 0.15));
    return {
      code,
      label: "Creator 15% fixture",
      recognized: true,
      applied: discountMinor > 0,
      eligibleSubtotalMinor,
      discountMinor,
      message:
        discountMinor > 0
          ? "Applied to Creator fixtures only; discount is capped at $25.00."
          : "Add a Creator fixture before this rehearsal code can apply.",
    };
  }

  if (code === "COMMUNITY5") {
    const eligibleSubtotalMinor = categorySubtotalMinor(normalizedCart, "Community");
    const discountMinor = eligibleSubtotalMinor >= 2000 ? 500 : 0;
    return {
      code,
      label: "Community $5 fixture",
      recognized: true,
      applied: discountMinor > 0,
      eligibleSubtotalMinor,
      discountMinor,
      message:
        discountMinor > 0
          ? "Applied after the Community fixture subtotal reached $20.00."
          : "Community fixtures must total at least $20.00 for this rehearsal code.",
    };
  }

  return {
    code,
    label: "Unknown promo fixture",
    recognized: false,
    applied: false,
    eligibleSubtotalMinor: 0,
    discountMinor: 0,
    message: "That code is not part of the controlled fixture promo set.",
  };
}

export function quoteCommerceSandboxDelivery(
  itemCount: number,
  scenario: CommerceSandboxDeliveryScenario
): CommerceSandboxDeliveryQuote {
  const safeCount = Number.isSafeInteger(itemCount) && itemCount > 0 ? itemCount : 0;
  if (scenario === "standard") {
    return {
      scenario,
      label: "Standard delivery fixture",
      amountMinor: safeCount ? 599 + Math.max(0, safeCount - 1) * 100 : 0,
      message: "Planning estimate only; no carrier, address, shipment, or fulfillment exists.",
    };
  }
  if (scenario === "express") {
    return {
      scenario,
      label: "Express delivery fixture",
      amountMinor: safeCount ? 1299 + Math.max(0, safeCount - 1) * 200 : 0,
      message: "Planning estimate only; no carrier, address, shipment, or fulfillment exists.",
    };
  }
  return {
    scenario: "collection",
    label: "Collection rehearsal",
    amountMinor: 0,
    message: "No delivery-cost fixture is included and no collection location is promised.",
  };
}

export function buildCommerceSandboxQuotePlan(
  cart: CommerceSandboxCart,
  promoCode = "",
  deliveryScenario: CommerceSandboxDeliveryScenario = "collection"
): CommerceSandboxQuotePlan {
  const normalizedCart = normalizeCommerceSandboxCart(cart);
  const items = commerceSandboxItems
    .filter(item => normalizedCart[item.sku])
    .map(item => ({ ...item, quantity: normalizedCart[item.sku] }));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const promo = resolveCommerceSandboxPromo(normalizedCart, promoCode);
  const delivery = quoteCommerceSandboxDelivery(itemCount, deliveryScenario);
  const subtotalMinor = items.reduce(
    (sum, item) => sum + item.quantity * item.unitAmountMinor,
    0
  );
  const taxableMerchandiseMinor = Math.max(0, subtotalMinor - promo.discountMinor);
  const taxRate = 0.08;
  const taxAmountMinor = Math.round(taxableMerchandiseMinor * taxRate);
  const lines = items.map(item => ({
    sku: item.sku,
    quantity: item.quantity,
    unitAmountMinor: item.unitAmountMinor,
  }));

  const quote = lines.length
    ? quoteCheckout({
        checkoutId: "checkout:beta:fixture-marketplace",
        currency: "usd",
        lines,
        shippingAmountMinor: delivery.amountMinor,
        taxAmountMinor,
        discountAmountMinor: promo.discountMinor,
      })
    : null;

  return {
    cart: normalizedCart,
    items,
    itemCount,
    promo,
    delivery,
    taxRate,
    taxAmountMinor,
    quote,
  };
}
