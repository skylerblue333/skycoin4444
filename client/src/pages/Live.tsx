import { useMemo, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Calendar, Eye, Heart, MessageCircle, Play, Radio, Search, Send, Share2, Sparkles, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExperienceShell, SurfaceCard } from "@/components/ecosystem/ExperienceShell";

const CATEGORIES = ["For you", "Gaming", "Music", "Education", "Crypto", "Technology"] as const;
const PREVIEW_STREAMS = [
  { id: "studio", title: "Creator Studio Walkthrough", creator: "SKYCOIN4444 Demo", category: "Technology", gradient: "from-violet-700 via-indigo-700 to-sky-500" },
  { id: "gaming", title: "Games Center Showcase", creator: "SKYCOIN4444 Demo", category: "Gaming", gradient: "from-fuchsia-700 via-purple-700 to-indigo-700" },
  { id: "learn", title: "Education Hub Tour", creator: "SKYCOIN4444 Demo", category: "Education", gradient: "from-emerald-600 via-cyan-600 to-blue-600" },
  { id: "market", title: "Market UI Preview", creator: "SKYCOIN4444 Demo", category: "Crypto", gradient: "from-amber-600 via-orange-600 to-rose-600" },
] as const;

type PreviewStreamId = (typeof PREVIEW_STREAMS)[number]["id"];
type PreviewCategory = (typeof CATEGORIES)[number];

export default function Live() {
  const [selectedId, setSelectedId] = useState<PreviewStreamId>(PREVIEW_STREAMS[0].id);
  const [category, setCategory] = useState<PreviewCategory>("For you");
  const [channelFilter, setChannelFilter] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [liked, setLiked] = useState(false);

  const selected = PREVIEW_STREAMS.find((stream) => stream.id === selectedId) ?? PREVIEW_STREAMS[0];
  const visibleStreams = useMemo(() => {
    const normalized = channelFilter.trim().toLowerCase();
    return PREVIEW_STREAMS.filter((stream) => {
      const categoryMatch = category === "For you" || stream.category === category;
      const searchMatch = !normalized || `${stream.title} ${stream.creator} ${stream.category}`.toLowerCase().includes(normalized);
      return categoryMatch && searchMatch;
    });
  }, [category, channelFilter]);

  const selectStream = (streamId: PreviewStreamId) => {
    setSelectedId(streamId);
    setLiked(false);
    setMessages([]);
    setDraft("");
  };

  const sendMessage = () => {
    const message = draft.trim();
    if (!message) return;
    setMessages((items) => [...items, message]);
    setDraft("");
  };

  return (
    <ExperienceShell title="SkyLive" subtitle="A polished creator and streaming surface, ready for real media-service integration." icon={Radio} accent="indigo" badge="UI preview" actions={<Link href="/live-stream-setup"><Button className="rounded-xl bg-indigo-600 shadow-md shadow-indigo-200 hover:bg-indigo-700"><Video className="mr-2 h-4 w-4" /> Creator setup</Button></Link>}>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1" aria-label="Stream categories">
        {CATEGORIES.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${category === item ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{item}</button>)}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <SurfaceCard className="overflow-hidden">
            <div className={`relative aspect-video min-h-[320px] bg-gradient-to-br ${selected.gradient}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(255,255,255,.22),transparent_35%)]" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-indigo-300" /> Preview media</div>
              <div className="absolute right-4 top-4 rounded-full bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">No live viewer count</div>
              <div className="absolute inset-0 grid place-items-center"><button type="button" aria-label="Preview stream player" onClick={() => toast("Media playback is not connected in this engineering preview.")} className="grid h-20 w-20 place-items-center rounded-full border border-white/40 bg-white/20 text-white shadow-2xl backdrop-blur transition-transform hover:scale-105"><Play className="ml-1 h-8 w-8 fill-current" /></button></div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-5 pt-20 text-white"><div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{selected.category} · demo fixture</div><h2 className="mt-1 text-2xl font-black md:text-3xl">{selected.title}</h2><p className="mt-1 text-sm text-white/70">{selected.creator}</p></div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-2"><Button onClick={() => setLiked((value) => !value)} variant="outline" className={`rounded-xl ${liked ? "border-pink-200 bg-pink-50 text-pink-700" : "border-slate-200"}`}><Heart className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`} /> {liked ? "Liked" : "Like"}</Button><Button onClick={() => toast("Share targets are not connected in this engineering preview.")} variant="outline" className="rounded-xl border-slate-200"><Share2 className="mr-2 h-4 w-4" /> Share</Button></div>
              <div className="flex items-center gap-4 text-xs text-slate-400"><span className="flex items-center gap-1"><Eye className="h-4 w-4" /> Viewer metrics unavailable</span><span className="flex items-center gap-1"><Users className="h-4 w-4" /> Audience service pending</span></div>
            </div>
          </SurfaceCard>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Preview channels</h2><p className="text-xs text-slate-500">Interface fixtures only — not active broadcasts.</p></div><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={channelFilter} onChange={(event) => setChannelFilter(event.target.value)} className="h-9 w-52 rounded-xl border-slate-200 bg-white pl-9" placeholder="Filter channels" /></div></div>
            {visibleStreams.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{visibleStreams.map((stream) => <button key={stream.id} type="button" onClick={() => selectStream(stream.id)} className={`overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${selectedId === stream.id ? "border-indigo-300 ring-2 ring-indigo-100" : "border-slate-200"}`}><div className={`relative aspect-video bg-gradient-to-br ${stream.gradient}`}><span className="absolute left-2 top-2 rounded-full bg-slate-950/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Preview</span><div className="absolute inset-0 grid place-items-center"><Play className="h-7 w-7 fill-white/90 text-white/90" /></div></div><div className="p-3"><div className="line-clamp-1 text-sm font-bold text-slate-800">{stream.title}</div><div className="mt-1 text-xs text-slate-400">{stream.category}</div></div></button>)}</div> : <SurfaceCard className="p-8 text-center text-sm text-slate-500">No preview channel matches this filter.</SurfaceCard>}
          </div>
        </div>

        <div className="space-y-5">
          <SurfaceCard className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 p-4"><div><h2 className="font-bold">Live chat preview</h2><p className="text-xs text-slate-400">Local UI state only</p></div><MessageCircle className="h-5 w-5 text-indigo-600" /></div>
            <div className="h-80 space-y-3 overflow-y-auto bg-slate-50/70 p-4"><div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-xs leading-5 text-indigo-800">Chat is not connected to a realtime service. Messages entered here remain in this browser session and reset when the preview channel changes.</div>{messages.length === 0 ? <div className="grid h-44 place-items-center text-center"><div><MessageCircle className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-2 text-sm font-medium text-slate-500">No preview messages yet</p></div></div> : messages.map((message, index) => <div key={`${index}-${message}`} className="rounded-xl border border-slate-200 bg-white p-3"><div className="text-xs font-bold text-indigo-700">You · preview</div><p className="mt-1 text-sm text-slate-700">{message}</p></div>)}</div>
            <div className="flex gap-2 border-t border-slate-100 p-3"><Input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage()} className="rounded-xl border-slate-200" placeholder="Try the chat UI..." /><Button onClick={sendMessage} aria-label="Send preview message" className="rounded-xl bg-indigo-600 px-3 hover:bg-indigo-700"><Send className="h-4 w-4" /></Button></div>
          </SurfaceCard>
          <SurfaceCard className="p-5"><div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-indigo-600" /><h2 className="font-bold">Creator readiness</h2></div><div className="mt-4 space-y-3">{["Streaming provider", "Realtime chat", "Moderation controls", "Audience analytics"].map((item) => <div key={item} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm"><span className="text-slate-600">{item}</span><span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">Pending</span></div>)}</div><Link href="/live-stream-setup"><Button variant="outline" className="mt-4 w-full rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50"><Radio className="mr-2 h-4 w-4" /> Open creator setup</Button></Link></SurfaceCard>
        </div>
      </div>
    </ExperienceShell>
  );
}
