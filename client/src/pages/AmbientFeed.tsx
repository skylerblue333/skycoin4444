import { Activity, Heart, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

export default function AmbientFeed() {
  const feed = trpc.social.getFeed.useQuery({ limit: 20, offset: 0 });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl space-y-5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold"><Activity className="h-5 w-5 text-purple-400" />SkyFeed</h1>
            <p className="text-xs text-muted-foreground">Newest posts from the SKYCOIN4444 database.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void feed.refetch()} disabled={feed.isFetching}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${feed.isFetching ? "animate-spin" : ""}`} />Refresh
          </Button>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/40 p-3 text-sm text-muted-foreground">
          Feed content and engagement counts below come from stored posts. Reaction/comment writes are added in the next social-interactions branch.
        </div>

        {feed.isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map(item => <div key={item} className="h-32 animate-pulse rounded-2xl border bg-card/50" />)}</div>
        ) : feed.error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{feed.error.message}</div>
        ) : !feed.data?.length ? (
          <div className="rounded-2xl border border-dashed p-12 text-center"><Activity className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" /><h2 className="font-semibold">No posts yet</h2><p className="mt-1 text-sm text-muted-foreground">SkyFeed will show posts here after they are created.</p></div>
        ) : (
          <div className="space-y-4">
            {feed.data.map(post => {
              const authorLabel = post.author?.name ?? post.author?.username ?? "Unknown user";
              return (
                <article key={post.id} className="rounded-2xl border border-border/60 bg-card p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="min-w-0"><div className="truncate font-semibold">{authorLabel}</div>{post.author?.username ? <div className="truncate text-xs text-muted-foreground">@{post.author.username}</div> : null}</div>
                    {post.author?.verified ? <Badge variant="outline">Verified</Badge> : null}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{post.content || ""}</p>
                  {post.media ? <a href={post.media} target="_blank" rel="noreferrer" className="mt-3 block truncate text-xs text-primary hover:underline">Attached media</a> : null}
                  <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border/50 pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{post.likeCount} likes</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{post.commentCount} comments</span>
                    <span className="ml-auto">{post.createdAt ? new Date(post.createdAt).toLocaleString() : "Time unavailable"}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
