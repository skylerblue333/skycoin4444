import { describe, expect, it } from "vitest";
import { normalizeSubscription, planWebhookDeliveries } from "./index";

describe("SkyWebhookHub",()=>{
  it("normalizes subscriptions and plans matching deliveries deterministically",()=>{
    const plan=planWebhookDeliveries({id:"e1",type:"Order.Created",payload:{}},[
      {id:"b",endpoint:"https://example.com/b",events:["order.created"]},
      {id:"a",endpoint:"https://example.com/a",events:["*"]},
    ]);
    expect(plan.httpDeliveryPerformed).toBe(false);
    expect(plan.deliveries.map(d=>d.subscriptionId)).toEqual(["a","b"]);
  });
  it("rejects unsafe endpoint forms and empty events",()=>{
    expect(()=>normalizeSubscription({id:"s",endpoint:"http://example.com",events:["x"]})).toThrow("https");
    expect(()=>normalizeSubscription({id:"s",endpoint:"https://u:p@example.com/#x",events:["x"]})).toThrow("credentials/fragments");
    expect(()=>normalizeSubscription({id:"s",endpoint:"https://example.com",events:[]})).toThrow("events are required");
  });
});
