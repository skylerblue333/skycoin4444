import { useState } from "react";
import { Activity, Bookmark, Brain, Heart, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FeedPost {
  id: number;
  author: string;
  content: string;
  tags: string[];
  energy: "low" | "medium" | "high";
}

const PREVIEW_POSTS: FeedPost[] = [
  { id: 1, author: "SkyDeveloper", content: "Preview: a future ecosystem update could appear here after SkyFeed is connected to a verified post API.", tags: ["development", "skyfeed"], energy: "high" },
  { id: 2, author: "SkyCommunity", content: "Preview: community discussions, reactions, and discovery will share this feed surface once the social backend is implemented.", tags: ["community"], energy: "medium" },
  { id: 3, author: "HopeAI", content: "Preview: AI-assisted highlights must be generated from real feed data before they are labeled as recommendations.", tags: ["ai", "preview"], energy: "medium" },
];

export default function AmbientFeed() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [aiPreview, setAiPreview] = useState(false);

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<number>>>, id: number) => {
    setter(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl space-y-5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="flex items-center gap-2 text-xl font-bold"><Activity className="h-5 w-5 text-purple-400" />Ambient Feed</h1><p className="text-xs text-muted-foreground">Typed interaction preview for the future SkyFeed backend.</p></div>
          <Button variant={aiPreview ? "default" : "outline"} size="sm" onClick={() => setAiPreview(value => !value)}><Brain className="mr-1.5 h-3.5 w-3.5" />AI preview {aiPreview ? "on" : "off"}</Button>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-200">
          This screen uses labeled preview posts. It does not claim live reactions, viewer counts, trending topics, or server-persisted likes/bookmarks yet.
        </div>

        {aiPreview ? <div className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 text-sm text-purple-200"><Sparkles className="h-4 w-4" />AI recommendation behavior is a UI preview only until HopeAI receives real feed context.</div> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {PREVIEW_POSTS.map((post: FeedPost) => (
            <article key={post.id} className="rounded-2xl border border-border/60 bg-card p-4">
              <div className="mb-3 flex items-center justify-between"><div className="font-semibold">{post.author}</div><Badge variant="outline">{post.energy} energy</Badge></div>
              <p className="text-sm leading-relaxed text-muted-foreground">{post.content}</p>
              <div className="mt-3 flex flex-wrap gap-1">{post.tags.map(tag => <Badge key={tag} variant="secondary">#{tag}</Badge>)}</div>
              <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-3">
                <Button size="sm" variant="ghost" onClick={() => toggle(setLiked, post.id)}><Heart className={`mr-1 h-4 w-4 ${liked.has(post.id) ? "fill-current text-pink-500" : ""}`} />{liked.has(post.id) ? "Liked locally" : "Preview like"}</Button>
                <Button size="sm" variant="ghost" disabled><MessageCircle className="mr-1 h-4 w-4" />Comments unavailable</Button>
                <Button size="sm" variant="ghost" onClick={() => toggle(setBookmarked, post.id)}><Bookmark className={`h-4 w-4 ${bookmarked.has(post.id) ? "fill-current" : ""}`} /></Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
