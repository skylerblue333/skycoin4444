import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "wouter";
import { Globe, Lock, MessageCircle, RefreshCw, Share2 } from "lucide-react";

export default function SocialMedia() {
  const { user, isAuthenticated } = useAuth();
  const [postContent, setPostContent] = useState("");
  const [postPrivacy, setPostPrivacy] = useState<"public" | "followers">("public");
  const utils = trpc.useUtils();
  const feedQuery = trpc.feed.list.useQuery({ limit: 50, offset: 0 });
  const createPost = trpc.feed.create.useMutation({
    onSuccess: async () => {
      setPostContent("");
      await utils.feed.list.invalidate();
      toast.success("Post published.");
    },
    onError: (error) => toast.error(error.message),
  });

  const publish = () => {
    const content = postContent.trim();
    if (!content) return;
    createPost.mutate({ content });
  };

  return (
    <main className="container max-w-3xl py-8 space-y-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Community</p>
        <h1 className="text-3xl font-semibold">Social feed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Posts shown here come from the persisted feed record. Reactions, comments, follows, and ranking remain unavailable until their contracts are implemented.
        </p>
      </header>

      {isAuthenticated && user ? (
        <Card className="p-4 space-y-3">
          <div className="text-sm font-medium">Share an update</div>
          <Textarea
            value={postContent}
            onChange={(event) => setPostContent(event.target.value)}
            placeholder="Write a post (1–255 characters)"
            maxLength={255}
            disabled={createPost.isPending}
          />
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setPostPrivacy((value) => value === "public" ? "followers" : "public")}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground"
              disabled={createPost.isPending}
            >
              {postPrivacy === "public" ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              {postPrivacy} visibility is informational until audience controls are implemented
            </button>
            <Button onClick={publish} disabled={!postContent.trim() || createPost.isPending}>
              {createPost.isPending ? "Publishing…" : "Publish"}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Sign in to publish a persisted post.</p>
          <Link href="/login"><Button variant="outline">Sign in</Button></Link>
        </Card>
      )}

      {feedQuery.isLoading && <Card className="p-8 text-center text-sm text-muted-foreground">Loading persisted posts…</Card>}
      {feedQuery.isError && (
        <Card className="p-8 text-center space-y-3">
          <p className="text-sm text-destructive">The feed could not be loaded.</p>
          <Button variant="outline" onClick={() => void feedQuery.refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </Card>
      )}
      {!feedQuery.isLoading && !feedQuery.isError && feedQuery.data?.length === 0 && (
        <Card className="p-10 text-center text-sm text-muted-foreground">No persisted posts yet.</Card>
      )}
      <section className="space-y-3" aria-label="Persisted posts">
        {feedQuery.data?.map((post) => (
          <Card key={post.id} className="p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Account {post.authorId}</span>
              {post.createdAt ? <time dateTime={new Date(post.createdAt).toISOString()}>{new Date(post.createdAt).toLocaleString()}</time> : <span>Time unavailable</span>}
            </div>
            <p className="whitespace-pre-wrap break-words text-sm leading-6">{post.content}</p>
            {post.mediaUrl && <a className="text-xs text-primary underline" href={post.mediaUrl} target="_blank" rel="noreferrer">Open attached media</a>}
            <div className="flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
              <span>{post.likeCount} recorded likes</span>
              <span>{post.commentCount} recorded comments</span>
              <span className="ml-auto inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> Interactions unavailable</span>
              <button type="button" onClick={() => { void navigator.clipboard?.writeText(window.location.href); toast.success("Feed link copied."); }} aria-label="Copy feed link"><Share2 className="h-3.5 w-3.5" /></button>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
