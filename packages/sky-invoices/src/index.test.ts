import { describe, expect, it } from "vitest";
import { InvoiceService, type InvoiceLedgerContract } from "./index";

describe("SkyInvoices domain core", () => {
  it("calculates integer-minor-unit totals and emits a ledger integration contract", () => {
    let now = 100;
    const events: InvoiceLedgerContract[] = [];
    const service = new InvoiceService({
      now: () => now,
      idFactory: () => "inv_1",
      onLedgerEvent: event => events.push(event),
    });

    const invoice = service.create({
      customerId: "customer_1",
      currency: "usd",
      lines: [
        { description: "Platform access", quantity: 2, unitPriceMinor: 1250 },
        { description: "Support", quantity: 1, unitPriceMinor: 500 },
      ],
    });

    expect(invoice.subtotalMinor).toBe(3000);
    expect(invoice.currency).toBe("USD");
    now = 200;
    service.issue(invoice.id);
    expect(events[0]).toEqual({
      invoiceId: "inv_1",
      customerId: "customer_1",
      currency: "USD",
      amountMinor: 3000,
      event: "invoice.issued",
      occurredAt: 200,
    });
  });

  it("enforces valid state transitions", () => {
    const service = new InvoiceService({ idFactory: () => "inv_2" });
    const invoice = service.create({
      customerId: "customer_1",
      currency: "USD",
      lines: [{ description: "Service", quantity: 1, unitPriceMinor: 100 }],
    });

    expect(() => service.markPaid(invoice.id)).toThrow("invoice_not_payable");
    service.issue(invoice.id);
    expect(service.markPaid(invoice.id).status).toBe("paid");
    expect(() => service.void(invoice.id)).toThrow("invoice_not_voidable");
  });

  it("validates untrusted invoice inputs and safe integer arithmetic", () => {
    const service = new InvoiceService({ idFactory: () => "inv_3" });
    expect(() =>
      service.create({ customerId: "bad customer", currency: "USD", lines: [] }),
    ).toThrow("invalid_customerId");
    expect(() =>
      service.create({
        customerId: "customer_1",
        currency: "US",
        lines: [{ description: "Service", quantity: 1, unitPriceMinor: 1 }],
      }),
    ).toThrow("invalid_currency");
    expect(() =>
      service.create({
        customerId: "customer_1",
        currency: "USD",
        lines: [{ description: "Service", quantity: Number.MAX_SAFE_INTEGER, unitPriceMinor: 2 }],
      }),
    ).toThrow();
  });

  it("returns defensive copies", () => {
    const service = new InvoiceService({ idFactory: () => "inv_4" });
    const invoice = service.create({
      customerId: "customer_1",
      currency: "USD",
      lines: [{ description: "Service", quantity: 1, unitPriceMinor: 100 }],
    });
    invoice.lines[0].description = "tampered";
    expect(service.get(invoice.id)?.lines[0].description).toBe("Service");
  });
});
