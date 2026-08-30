export type WebhookSubscription = { id: string; endpoint: string; events: string[] };
export type WebhookEvent = { id: string; type: string; payload: Record<string, unknown> };
export type WebhookDeliveryPlan = { contract: "sky.webhook.delivery-plan.v1"; eventId: string; deliveries: { subscriptionId: string; endpoint: string; eventType: string }[]; httpDeliveryPerformed: false };

const required=(v:string,f:string)=>{const x=v.trim(); if(!x) throw new Error(`${f} is required`); return x;};
function endpoint(value:string):string { const raw=required(value,"endpoint"); const u=new URL(raw); if(u.protocol!=="https:") throw new Error("endpoint must use https"); if(u.username||u.password||u.hash) throw new Error("endpoint credentials/fragments are not allowed"); return u.toString(); }

export function normalizeSubscription(input: WebhookSubscription): WebhookSubscription {
  const events=[...new Set(input.events.map(e=>required(e,"event").toLowerCase()))].sort();
  if(!events.length) throw new Error("events are required");
  return { id: required(input.id,"id"), endpoint:endpoint(input.endpoint), events };
}

export function planWebhookDeliveries(event: WebhookEvent, subscriptions: WebhookSubscription[]): WebhookDeliveryPlan {
  const id=required(event.id,"event.id"); const type=required(event.type,"event.type").toLowerCase();
  const deliveries=subscriptions.map(normalizeSubscription).filter(s=>s.events.includes(type)||s.events.includes("*")).sort((a,b)=>a.id.localeCompare(b.id)).map(s=>({subscriptionId:s.id,endpoint:s.endpoint,eventType:type}));
  return { contract:"sky.webhook.delivery-plan.v1", eventId:id, deliveries, httpDeliveryPerformed:false };
}
