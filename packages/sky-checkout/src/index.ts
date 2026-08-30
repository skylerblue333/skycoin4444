export type CheckoutLine = {
  sku: string;
  quantity: number;
  unitAmountMinor: number;
};

export type CheckoutRequest = {
  checkoutId: string;
  currency: string;
  lines: CheckoutLine[];
  shippingAmountMinor?: number;
  taxAmountMinor?: number;
  discountAmountMinor?: number;
};

export type CheckoutQuote = {
  contract: "sky.checkout.quote.v1";
  checkoutId: string;
  currency: string;
  subtotalMinor: number;
  shippingAmountMinor: number;
  taxAmountMinor: number;
  discountAmountMinor: number;
  totalAmountMinor: number;
};

function requireIntegerMinor(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${field} must be a non-negative safe integer`);
  }
  return value;
}

function requireText(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

export function quoteCheckout(input: CheckoutRequest): CheckoutQuote {
  const checkoutId = requireText(input.checkoutId, "checkoutId");
  const currency = requireText(input.currency, "currency").toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("currency must be a 3-letter code");
  if (!Array.isArray(input.lines) || input.lines.length === 0) throw new Error("lines are required");

  const subtotalMinor = input.lines.reduce((sum, line, index) => {
    requireText(line.sku, `lines[${index}].sku`);
    if (!Number.isSafeInteger(line.quantity) || line.quantity <= 0) {
      throw new Error(`lines[${index}].quantity must be a positive safe integer`);
    }
    const unit = requireIntegerMinor(line.unitAmountMinor, `lines[${index}].unitAmountMinor`);
    const lineTotal = unit * line.quantity;
    if (!Number.isSafeInteger(lineTotal) || !Number.isSafeInteger(sum + lineTotal)) {
      throw new Error("checkout subtotal exceeds safe integer range");
    }
    return sum + lineTotal;
  }, 0);

  const shippingAmountMinor = requireIntegerMinor(input.shippingAmountMinor ?? 0, "shippingAmountMinor");
  const taxAmountMinor = requireIntegerMinor(input.taxAmountMinor ?? 0, "taxAmountMinor");
  const discountAmountMinor = requireIntegerMinor(input.discountAmountMinor ?? 0, "discountAmountMinor");
  const gross = subtotalMinor + shippingAmountMinor + taxAmountMinor;
  if (!Number.isSafeInteger(gross)) throw new Error("checkout gross exceeds safe integer range");
  if (discountAmountMinor > gross) throw new Error("discountAmountMinor cannot exceed gross amount");

  return {
    contract: "sky.checkout.quote.v1",
    checkoutId,
    currency,
    subtotalMinor,
    shippingAmountMinor,
    taxAmountMinor,
    discountAmountMinor,
    totalAmountMinor: gross - discountAmountMinor,
  };
}
