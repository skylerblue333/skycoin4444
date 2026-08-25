export interface PriceInput {
  sku: string;
  baseAmountMinor: number;
  currency: string;
  quantity: number;
}

export interface PricingRule {
  id: string;
  discountBps: number;
  minimumQuantity?: number;
}

export interface PriceQuote {
  sku: string;
  currency: string;
  quantity: number;
  subtotalMinor: number;
  discountMinor: number;
  totalMinor: number;
  appliedRuleIds: string[];
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const CURRENCY = /^[A-Z]{3}$/;

export function validatePriceInput(input: PriceInput): PriceInput {
  if (!ID.test(input.sku)) throw new Error("invalid sku");
  if (
    !Number.isSafeInteger(input.baseAmountMinor) ||
    input.baseAmountMinor < 0
  ) {
    throw new Error("invalid baseAmountMinor");
  }
  if (!CURRENCY.test(input.currency)) throw new Error("invalid currency");
  if (
    !Number.isSafeInteger(input.quantity) ||
    input.quantity < 1 ||
    input.quantity > 1_000_000
  ) {
    throw new Error("invalid quantity");
  }
  return { ...input };
}

export function validatePricingRule(rule: PricingRule): PricingRule {
  if (!ID.test(rule.id)) throw new Error("invalid rule id");
  if (
    !Number.isInteger(rule.discountBps) ||
    rule.discountBps < 0 ||
    rule.discountBps > 10_000
  ) {
    throw new Error("invalid discountBps");
  }
  if (
    rule.minimumQuantity !== undefined &&
    (!Number.isSafeInteger(rule.minimumQuantity) || rule.minimumQuantity < 1)
  ) {
    throw new Error("invalid minimumQuantity");
  }
  return { ...rule };
}

export function quotePrice(
  input: PriceInput,
  rules: readonly PricingRule[]
): PriceQuote {
  const checked = validatePriceInput(input);
  const subtotalMinor = checked.baseAmountMinor * checked.quantity;
  if (!Number.isSafeInteger(subtotalMinor)) {
    throw new Error("subtotal exceeds safe integer range");
  }

  const applicable = rules
    .map(validatePricingRule)
    .filter(
      rule =>
        rule.minimumQuantity === undefined ||
        checked.quantity >= rule.minimumQuantity
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  const totalBps = Math.min(
    10_000,
    applicable.reduce((sum, rule) => sum + rule.discountBps, 0)
  );
  const discountMinor = Math.floor((subtotalMinor * totalBps) / 10_000);
  return {
    sku: checked.sku,
    currency: checked.currency,
    quantity: checked.quantity,
    subtotalMinor,
    discountMinor,
    totalMinor: subtotalMinor - discountMinor,
    appliedRuleIds: applicable.map(rule => rule.id),
  };
}
