export interface FeedItem { id: string; actorId: string; kind: "post" | "share" | "system"; createdAt: string; visibility: "public" | "followers" | "private"; rank?: number; }
export interface FeedPage { items: FeedItem[]; nextCursor?: string; }
const ID=/^[A-Za-z0-9][A-Za-z0-9:_-]{2,127}$/;
export function normalizeFeedItem(item: FeedItem): FeedItem {
  if(!ID.test(item.id)||!ID.test(item.actorId)) throw new Error("invalid feed identifier");
  const ts=Date.parse(item.createdAt); if(!Number.isFinite(ts)) throw new Error("invalid createdAt");
  if(item.rank!==undefined && (!Number.isFinite(item.rank)||item.rank<0||item.rank>1_000_000)) throw new Error("invalid rank");
  return {...item,createdAt:new Date(ts).toISOString()};
}
export function buildFeedPage(items: FeedItem[], limit=20, cursor?: string): FeedPage {
  if(!Number.isInteger(limit)||limit<1||limit>100) throw new Error("invalid limit");
  const normalized=items.map(normalizeFeedItem).filter(i=>i.visibility!=="private").sort((a,b)=>(b.rank??0)-(a.rank??0)||Date.parse(b.createdAt)-Date.parse(a.createdAt)||a.id.localeCompare(b.id));
  const start=cursor?Math.max(0,normalized.findIndex(i=>i.id===cursor)+1):0;
  const page=normalized.slice(start,start+limit); const more=start+limit<normalized.length;
  return {items:page,nextCursor:more?page.at(-1)?.id:undefined};
}
export function toFeedIntegrationEvent(item: FeedItem){ const n=normalizeFeedItem(item); return {type:"feed.item_published" as const,itemId:n.id,actorId:n.actorId,kind:n.kind,visibility:n.visibility}; }
