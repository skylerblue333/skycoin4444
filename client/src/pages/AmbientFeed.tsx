import { useState } from "react";
import { Activity, Heart, MessageCircle, RefreshCw, Send, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

function CommentPanel({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const utils = trpc.useUtils();
  const comments = trpc.social.comments.useQuery({ postId, limit: 30 });
  const addComment = trpc.social.addComment.useMutation({
    onSuccess: async () => {
      setContent("");
      await Promise.all([utils.social.comments.invalidate({ postId, limit: 30 }), utils.social.getFeed.invalidate()]);
    },
    onError: error => toast.error(error.message),
  });

  return (
    <div className="mt-3 space-y-3 rounded-xl border border-border/50 bg-background/40 p-3">
      {comments.isLoading ? <p className="text-xs text-muted-foreground">Loading comments…</p> : null}
      {comments.error ? <p className="text-xs text-destructive">{comments.error.message}</p> : null}
      {comments.data?.map(comment => (
        <div key={comment.id} className="rounded-lg border border-border/40 p-2">
          <div className="text-xs font-medium">{comment.author?.name ?? comment.author?.username ?? "Unknown user"}</div>
          <p className="mt-1 text-sm">{comment.content}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}</p>
        </div>
      ))}
      {user ? (
        <div className="flex gap-2">
          <Input value={content} onChange={event => setContent(event.target.value)} maxLength={255} placeholder="Write a comment…" onKeyDown={event => { if (event.key === "Enter" && content.trim()) addComment.mutate({ postId, content: content.trim() }); }} />
          <Button size="icon" disabled={!content.trim() || addComment.isPending} onClick={() => addComment.mutate({ postId, content: content.trim() })}><Send className="h-4 w-4" /></Button>
        </div>
      ) : <p className="text-xs text-muted-foreground">Sign in to comment.</p>}
    </div>
  );
}

export default function AmbientFeed() {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const utils = trpc.useUtils();
  const feed = trpc.social.getFeed.useQuery({ limit: 20, offset: 0 });

  const createPost = trpc.social.createPost.useMutation({
    onSuccess: async () => {
      setNewPost("");
      await utils.social.getFeed.invalidate();
      toast.success("Post published");
    },
    onError: error => toast.error(error.message),
  });
  const likePost = trpc.social.likePost.useMutation({
    onSuccess: async () => void utils.social.getFeed.invalidate(),
    onError: error => toast.error(error.message),
  });
  const unlikePost = trpc.social.unlikePost.useMutation({
    onSuccess: async () => void utils.social.getFeed.invalidate(),
    onError: error => toast.error(error.message),
  });
  const deletePost = trpc.social.deletePost.useMutation({
    onSuccess: async () => {
      await utils.social.getFeed.invalidate();
      toast.success("Post deleted");
    },
    onError: error => toast.error(error.message),
  });

  const toggleComments = (postId: string) => {
    setOpenComments(previous => {
      const next = new Set(previous);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      return next;
    });
  };

  const sharePost = async (postId: string, content: string | null) => {
    const url = `${window.location.origin}${window.location.pathname}#post-${postId}`;
    try {
      if (navigator.share) await navigator.share({ title: "SKYCOIN4444 SkyFeed", text: content ?? undefined, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Post link copied");
      }
    } catch (error) {
      if ((error as DOMException)?.name !== "AbortError") toast.error("Could not share post");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl space-y-5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="flex items-center gap-2 text-xl font-bold"><Activity className="h-5 w-5 text-purple-400" />SkyFeed</h1><p className="text-xs text-muted-foreground">Persisted posts, comments, and reactions.</p></div>
          <Button variant="outline" size="sm" onClick={() => void feed.refetch()} disabled={feed.isFetching}><RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${feed.isFetching ? "animate-spin" : ""}`} />Refresh</Button>
        </div>

        {user ? (
          <div className="rounded-2xl border border-border/60 bg-card p-4">
            <Textarea value={newPost} onChange={event => setNewPost(event.target.value)} maxLength={255} rows={3} placeholder="Share something with SkyFeed…" />
            <div className="mt-2 flex items-center justify-between"><span className="text-xs text-muted-foreground">{newPost.length}/255</span><Button size="sm" disabled={!newPost.trim() || createPost.isPending} onClick={() => createPost.mutate({ content: newPost.trim() })}>{createPost.isPending ? "Publishing…" : "Publish"}</Button></div>
          </div>
        ) : <div className="rounded-xl border border-border/60 bg-card/40 p-3 text-sm text-muted-foreground">Sign in to publish, react, or comment.</div>}

        {feed.isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map(item => <div key={item} className="h-32 animate-pulse rounded-2xl border bg-card/50" />)}</div>
        ) : feed.error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{feed.error.message}</div>
        ) : !feed.data?.length ? (
          <div className="rounded-2xl border border-dashed p-12 text-center"><Activity className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" /><h2 className="font-semibold">No posts yet</h2><p className="mt-1 text-sm text-muted-foreground">Create the first SkyFeed post.</p></div>
        ) : (
          <div className="space-y-4">
            {feed.data.map(post => {
              const authorLabel = post.author?.name ?? post.author?.username ?? "Unknown user";
              const commentsOpen = openComments.has(post.id);
              const isOwner = user?.id === post.userId;
              return (
                <article id={`post-${post.id}`} key={post.id} className="rounded-2xl border border-border/60 bg-card p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0"><div className="truncate font-semibold">{authorLabel}</div>{post.author?.username ? <div className="truncate text-xs text-muted-foreground">@{post.author.username}</div> : null}</div>
                    <div className="flex items-center gap-2">{post.author?.verified ? <Badge variant="outline">Verified</Badge> : null}{isOwner ? <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" disabled={deletePost.isPending} onClick={() => deletePost.mutate({ postId: post.id })}><Trash2 className="h-4 w-4" /></Button> : null}</div>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{post.content || ""}</p>
                  {post.media ? <a href={post.media} target="_blank" rel="noreferrer" className="mt-3 block truncate text-xs text-primary hover:underline">Attached media</a> : null}
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
                    <Button size="sm" variant="ghost" disabled={!user || likePost.isPending || unlikePost.isPending} onClick={() => post.likedByMe ? unlikePost.mutate({ postId: post.id }) : likePost.mutate({ postId: post.id })}><Heart className={`mr-1 h-4 w-4 ${post.likedByMe ? "fill-current text-pink-500" : ""}`} />{post.likeCount}</Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleComments(post.id)}><MessageCircle className="mr-1 h-4 w-4" />{post.commentCount}</Button>
                    <Button size="sm" variant="ghost" onClick={() => void sharePost(post.id, post.content)}><Share2 className="mr-1 h-4 w-4" />Share</Button>
                    <span className="ml-auto text-xs text-muted-foreground">{post.createdAt ? new Date(post.createdAt).toLocaleString() : "Time unavailable"}</span>
                  </div>
                  {commentsOpen ? <CommentPanel postId={post.id} /> : null}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
