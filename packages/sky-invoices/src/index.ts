export type InvoiceStatus = "draft" | "issued" | "paid" | "void";

export interface InvoiceLineInput {
  description: string;
  quantity: number;
  unitPriceMinor: number;
}

export interface InvoiceLine extends InvoiceLineInput {
  lineTotalMinor: number;
}

export interface InvoiceRecord {
  id: string;
  customerId: string;
  currency: string;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  subtotalMinor: number;
  createdAt: number;
  issuedAt: number | null;
  paidAt: number | null;
  voidedAt: number | null;
}

export interface InvoiceLedgerContract {
  invoiceId: string;
  customerId: string;
  currency: string;
  amountMinor: number;
  event: "invoice.issued" | "invoice.paid" | "invoice.voided";
  occurredAt: number;
}

export interface InvoiceServiceOptions {
  now?: () => number;
  idFactory?: () => string;
  onLedgerEvent?: (event: InvoiceLedgerContract) => void;
}

const IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const CURRENCY = /^[A-Z]{3}$/;

export class InvoiceService {
  private readonly records = new Map<string, InvoiceRecord>();
  private readonly now: () => number;
  private readonly idFactory: () => string;
  private readonly onLedgerEvent?: (event: InvoiceLedgerContract) => void;

  constructor(options: InvoiceServiceOptions = {}) {
    this.now = options.now ?? Date.now;
    this.idFactory =
      options.idFactory ??
      (() => `inv_${Math.random().toString(36).slice(2, 18)}`);
    this.onLedgerEvent = options.onLedgerEvent;
  }

  create(input: {
    customerId: string;
    currency: string;
    lines: InvoiceLineInput[];
  }): InvoiceRecord {
    const customerId = validateIdentifier("customerId", input.customerId);
    const currency = input.currency.trim().toUpperCase();
    if (!CURRENCY.test(currency)) throw new Error("invalid_currency");
    if (
      !Array.isArray(input.lines) ||
      input.lines.length === 0 ||
      input.lines.length > 500
    ) {
      throw new Error("invalid_lines");
    }

    const lines = input.lines.map(validateLine);
    const subtotalMinor = lines.reduce(
      (sum, line) => safeAdd(sum, line.lineTotalMinor),
      0
    );
    const id = validateIdentifier("invoiceId", this.idFactory());
    if (this.records.has(id)) throw new Error("invoice_id_collision");

    const record: InvoiceRecord = {
      id,
      customerId,
      currency,
      status: "draft",
      lines,
      subtotalMinor,
      createdAt: this.now(),
      issuedAt: null,
      paidAt: null,
      voidedAt: null,
    };
    this.records.set(id, clone(record));
    return clone(record);
  }

  get(invoiceId: string): InvoiceRecord | undefined {
    const record = this.records.get(validateIdentifier("invoiceId", invoiceId));
    return record ? clone(record) : undefined;
  }

  issue(invoiceId: string): InvoiceRecord {
    const record = this.require(invoiceId);
    if (record.status !== "draft") throw new Error("invoice_not_draft");
    const occurredAt = this.now();
    const next = {
      ...record,
      status: "issued" as const,
      issuedAt: occurredAt,
    };
    return this.persistWithEvent(next, "invoice.issued", occurredAt);
  }

  markPaid(invoiceId: string): InvoiceRecord {
    const record = this.require(invoiceId);
    if (record.status !== "issued") throw new Error("invoice_not_payable");
    const occurredAt = this.now();
    const next = { ...record, status: "paid" as const, paidAt: occurredAt };
    return this.persistWithEvent(next, "invoice.paid", occurredAt);
  }

  void(invoiceId: string): InvoiceRecord {
    const record = this.require(invoiceId);
    if (record.status !== "draft" && record.status !== "issued") {
      throw new Error("invoice_not_voidable");
    }
    const occurredAt = this.now();
    const next = { ...record, status: "void" as const, voidedAt: occurredAt };
    return this.persistWithEvent(next, "invoice.voided", occurredAt);
  }

  private require(invoiceId: string): InvoiceRecord {
    const record = this.get(invoiceId);
    if (!record) throw new Error("invoice_not_found");
    return record;
  }

  private persistWithEvent(
    record: InvoiceRecord,
    event: InvoiceLedgerContract["event"],
    occurredAt: number
  ): InvoiceRecord {
    this.records.set(record.id, clone(record));
    this.onLedgerEvent?.({
      invoiceId: record.id,
      customerId: record.customerId,
      currency: record.currency,
      amountMinor: record.subtotalMinor,
      event,
      occurredAt,
    });
    return clone(record);
  }
}

function validateIdentifier(name: string, value: string): string {
  if (typeof value !== "string" || !IDENTIFIER.test(value)) {
    throw new Error(`invalid_${name}`);
  }
  return value;
}

function validateLine(input: InvoiceLineInput): InvoiceLine {
  const description = input.description.trim();
  if (
    !description ||
    description.length > 500 ||
    /[\u0000-\u001F\u007F]/.test(description)
  ) {
    throw new Error("invalid_line_description");
  }
  if (
    !Number.isSafeInteger(input.quantity) ||
    input.quantity <= 0 ||
    input.quantity > 1_000_000
  ) {
    throw new Error("invalid_line_quantity");
  }
  if (!Number.isSafeInteger(input.unitPriceMinor) || input.unitPriceMinor < 0) {
    throw new Error("invalid_unit_price");
  }
  const lineTotalMinor = safeMultiply(input.quantity, input.unitPriceMinor);
  return {
    description,
    quantity: input.quantity,
    unitPriceMinor: input.unitPriceMinor,
    lineTotalMinor,
  };
}

function safeMultiply(a: number, b: number): number {
  const value = a * b;
  if (!Number.isSafeInteger(value)) throw new Error("amount_overflow");
  return value;
}

function safeAdd(a: number, b: number): number {
  const value = a + b;
  if (!Number.isSafeInteger(value)) throw new Error("amount_overflow");
  return value;
}

function clone(record: InvoiceRecord): InvoiceRecord {
  return { ...record, lines: record.lines.map(line => ({ ...line })) };
}
