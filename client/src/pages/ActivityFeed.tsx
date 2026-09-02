/*
 * Production-shaped social beta surface: live records only, authenticated
 * publishing and reactions, and explicit empty/loading/error states.
 */
import { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageSquare, Radio, Send } from "lucide-react";

export default function ActivityFeed() {
  const { isAuthenticated, loading } = useAuth();
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [activePostId, setActivePostId] = useState<string>();
  const [commentDraft, setCommentDraft] = useState("");
  const utils = trpc.useUtils();
  const feed = trpc.feed.getFeed.useQuery({ limit: 50, offset: 0 });
  const createPost = trpc.social.createPost.useMutation({ onSuccess: async () => { setContent(""); await utils.feed.getFeed.invalidate(); } });
  const likePost = trpc.social.likePost.useMutation({ onSuccess: () => utils.feed.getFeed.invalidate() });
  const unlikePost = trpc.social.unlikePost.useMutation({ onSuccess: () => utils.feed.getFeed.invalidate() });
  const comments = trpc.social.comments.useQuery({ postId: activePostId ?? "", limit: 30 }, { enabled: Boolean(activePostId) });
  const addComment = trpc.social.addComment.useMutation({ onSuccess: async () => { setCommentDraft(""); await Promise.all([utils.social.comments.invalidate({ postId: activePostId ?? "", limit: 30 }), utils.feed.getFeed.invalidate()]); } });

  const posts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (feed.data ?? []).filter((post) => !normalized || `${post.content} ${post.author?.name ?? ""} ${post.author?.username ?? ""}`.toLowerCase().includes(normalized));
  }, [feed.data, query]);

  if (loading) return <main className="min-h-screen p-8">Loading account state…</main>;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><Badge variant="outline" className="mb-3">Skycoin social beta</Badge><h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1><p className="mt-2 text-muted-foreground">Live community posts from the database. Counts and identities appear only when records exist.</p></div>
          {!isAuthenticated && <Button onClick={() => startLogin()}>Sign in to post</Button>}
        </header>

        {isAuthenticated && <Card className="mb-6"><CardHeader><CardTitle className="flex items-center gap-2"><Send className="h-5 w-5" />Share an update</CardTitle><CardDescription>Post a build note, question, or useful discovery. Keep it under 255 characters.</CardDescription></CardHeader><CardContent className="space-y-3"><Textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={255} placeholder="What are you building?" /><div className="flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{content.length}/255</span><Button disabled={!content.trim() || createPost.isPending} onClick={() => createPost.mutate({ content: content.trim(), media: null })}>{createPost.isPending ? "Publishing…" : "Publish update"}</Button></div></CardContent></Card>}

        <Card>
          <CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle className="flex items-center gap-2"><Radio className="h-5 w-5" />Live updates</CardTitle><CardDescription>{feed.isLoading ? "Loading posts…" : `${posts.length} visible posts`}</CardDescription></div><input aria-label="Search posts" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts" className="h-10 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" /></div></CardHeader>
          <CardContent className="space-y-4">
            {feed.isError && <p className="rounded-md border border-destructive/40 p-4 text-sm text-destructive">The feed could not be loaded. Try refreshing the page.</p>}
            {!feed.isLoading && !feed.isError && !posts.length && <div className="py-10 text-center"><MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 font-medium">No matching posts yet.</p><p className="mt-1 text-sm text-muted-foreground">The feed will show real community activity when it is published.</p></div>}
            {posts.map((post) => <article key={post.id} className="rounded-lg border border-border/60 p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{post.author?.name || post.author?.username || "Community member"}</p><p className="text-xs text-muted-foreground">{post.author?.username ? `@${post.author.username}` : "Verified account record"}</p></div>{post.author?.verified && <Badge variant="outline">Verified</Badge>}</div><p className="mt-4 whitespace-pre-wrap leading-7">{post.content}</p><div className="mt-4 flex items-center gap-2"><Button type="button" size="sm" variant={post.likedByMe ? "default" : "outline"} disabled={!isAuthenticated || likePost.isPending || unlikePost.isPending} onClick={() => (post.likedByMe ? unlikePost.mutate({ postId: post.id }) : likePost.mutate({ postId: post.id }))}><Heart className="mr-2 h-4 w-4" />{post.likeCount}</Button><Button type="button" size="sm" variant="ghost" onClick={() => setActivePostId((current) => current === post.id ? undefined : post.id)}><MessageSquare className="mr-2 h-4 w-4" />{post.commentCount}</Button></div>{activePostId === post.id && <div className="mt-4 space-y-3 border-t pt-4"><div className="space-y-2">{comments.isLoading && <p className="text-sm text-muted-foreground">Loading replies…</p>}{!comments.isLoading && !comments.data?.length && <p className="text-sm text-muted-foreground">No replies yet.</p>}{comments.data?.map((comment) => <div key={comment.id} className="rounded-md bg-muted/50 p-3 text-sm"><p>{comment.content}</p><p className="mt-1 text-xs text-muted-foreground">by {comment.author?.name || comment.author?.username || "Community member"}</p></div>)}</div>{isAuthenticated ? <div className="flex gap-2"><input aria-label="Write a reply" value={commentDraft} onChange={(event) => setCommentDraft(event.target.value)} placeholder="Write a reply" maxLength={255} className="h-10 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /><Button type="button" disabled={!commentDraft.trim() || addComment.isPending} onClick={() => addComment.mutate({ postId: post.id, content: commentDraft.trim() })}>{addComment.isPending ? "Sending…" : "Reply"}</Button></div> : <p className="text-xs text-muted-foreground">Sign in to reply.</p>}</div>}</article>)}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
