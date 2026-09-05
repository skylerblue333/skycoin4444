/*
 * Production-shaped social beta surface: persisted records only, authenticated
 * publishing and reactions, and explicit empty/loading/error states.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Heart,
  MessageSquare,
  Radio,
  RefreshCw,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ActivityFeed() {
  const { isAuthenticated, loading } = useAuth();
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [activePostId, setActivePostId] = useState<string>();
  const [commentDraft, setCommentDraft] = useState("");
  const utils = trpc.useUtils();

  const feed = trpc.feed.getFeed.useQuery(
    { limit: 50, offset: 0 },
    { retry: false }
  );
  const createPost = trpc.social.createPost.useMutation({
    onSuccess: async () => {
      setContent("");
      await Promise.all([
        utils.feed.getFeed.invalidate(),
        utils.activation.status.invalidate(),
      ]);
    },
  });
  const likePost = trpc.social.likePost.useMutation({
    onSuccess: () => utils.feed.getFeed.invalidate(),
  });
  const unlikePost = trpc.social.unlikePost.useMutation({
    onSuccess: () => utils.feed.getFeed.invalidate(),
  });
  const comments = trpc.social.comments.useQuery(
    { postId: activePostId ?? "", limit: 30 },
    { enabled: Boolean(activePostId), retry: false }
  );
  const addComment = trpc.social.addComment.useMutation({
    onSuccess: async () => {
      setCommentDraft("");
      await Promise.all([
        utils.social.comments.invalidate({
          postId: activePostId ?? "",
          limit: 30,
        }),
        utils.feed.getFeed.invalidate(),
      ]);
    },
  });

  const posts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (feed.data ?? []).filter(
      post =>
        !normalized ||
        `${post.content} ${post.author?.name ?? ""} ${post.author?.username ?? ""}`
          .toLowerCase()
          .includes(normalized)
    );
  }, [feed.data, query]);

  const interactionError =
    createPost.error || likePost.error || unlikePost.error || addComment.error;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050510] p-8 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-52 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-6 h-48 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
        </div>
      </main>
    );
  }

  function toggleComments(postId: string) {
    setCommentDraft("");
    setActivePostId(current => (current === postId ? undefined : postId));
  }

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-sky-300/25 bg-sky-300/[0.04] text-sky-100"
              >
                Social beta
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                Persisted records only
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight">
              Activity feed
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
              Community posts, reactions, and replies come from stored beta
              records. The page does not invent audience size, engagement, or
              identity-verification status.
            </p>
          </div>

          {!isAuthenticated ? (
            <Link href="/signin">
              <Button>
                Open invitation sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-white/15 bg-white/[0.03] text-white"
              >
                Back to dashboard
              </Button>
            </Link>
          )}
        </header>

        {!isAuthenticated ? (
          <Card className="border-amber-300/20 bg-amber-300/[0.04] text-white">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                <div>
                  <p className="font-semibold text-amber-100">
                    Browsing is public; writing is account-owned
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/45">
                    Sign in to publish, like, or reply. Anonymous browsing does
                    not create a simulated user session.
                  </p>
                </div>
              </div>
              <Link href="/signin">
                <Button className="shrink-0">Sign in to participate</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Send className="h-5 w-5 text-sky-200" />
                Share an update
              </CardTitle>
              <CardDescription className="text-white/45">
                Post a build note, question, or useful discovery. The server
                trims and limits posts to 255 characters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={content}
                onChange={event => setContent(event.target.value)}
                maxLength={255}
                placeholder="What are you building or testing?"
                aria-label="Social post content"
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-white/35">
                  {content.length}/255
                </span>
                <Button
                  disabled={!content.trim() || createPost.isPending}
                  onClick={() =>
                    createPost.mutate({
                      content: content.trim(),
                      media: null,
                    })
                  }
                >
                  {createPost.isPending ? "Publishing…" : "Publish update"}
                </Button>
              </div>
              {createPost.isSuccess ? (
                <p
                  className="text-sm text-emerald-200"
                  role="status"
                  aria-live="polite"
                >
                  Update persisted to the beta feed.
                </p>
              ) : null}
            </CardContent>
          </Card>
        )}

        {interactionError ? (
          <div
            className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-sm text-rose-100"
            role="alert"
          >
            That social action could not be saved. Refresh the feed and try
            again.
          </div>
        ) : null}

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Radio className="h-5 w-5 text-violet-200" />
                  Community updates
                </CardTitle>
                <CardDescription
                  id="activity-feed-status"
                  className="mt-1 text-white/45"
                >
                  {feed.isLoading
                    ? "Loading posts…"
                    : `${posts.length} visible posts${
                        query.trim()
                          ? ` matching “${query.trim()}”`
                          : ""
                      }`}
                </CardDescription>
              </div>

              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1 sm:flex-none">
                  <label className="sr-only" htmlFor="activity-feed-search">
                    Search community posts
                  </label>
                  <input
                    id="activity-feed-search"
                    aria-describedby="activity-feed-status"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Search posts"
                    className="h-10 w-full min-w-0 rounded-xl border border-white/10 bg-black/25 px-3 pr-9 text-sm text-white outline-none placeholder:text-white/25 focus-visible:ring-2 focus-visible:ring-sky-300/40 sm:w-64"
                  />
                  {query ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      aria-label="Clear post search"
                      onClick={() => setQuery("")}
                      className="absolute right-0 top-0 h-10 px-2 text-white/45"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  aria-label="Refresh activity feed"
                  onClick={() => feed.refetch()}
                  disabled={feed.isFetching}
                  className="border-white/15 bg-white/[0.03] text-white"
                >
                  <RefreshCw
                    className={
                      "h-4 w-4 " + (feed.isFetching ? "animate-spin" : "")
                    }
                  />
                  <span className="sr-only">Refresh feed</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {feed.isError ? (
              <p
                className="rounded-xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-sm text-rose-100"
                role="alert"
              >
                The feed could not be loaded. Try refreshing the page.
              </p>
            ) : null}

            {!feed.isLoading && !feed.isError && !posts.length ? (
              <div className="py-12 text-center">
                <MessageSquare className="mx-auto h-8 w-8 text-white/20" />
                <p className="mt-3 font-medium text-white">
                  {query.trim() ? "No matching posts." : "No posts yet."}
                </p>
                <p className="mt-1 text-sm text-white/35">
                  {query.trim()
                    ? "Clear the search or try a different phrase."
                    : "The feed will show real community activity when it is published."}
                </p>
              </div>
            ) : null}

            {posts.map(post => (
              <article
                key={post.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div>
                  <p className="font-semibold text-white">
                    {post.author?.name ||
                      post.author?.username ||
                      "Community member"}
                  </p>
                  <p className="mt-0.5 text-xs text-white/30">
                    {post.author?.username
                      ? `@${post.author.username}`
                      : "Stored account record"}
                  </p>
                </div>

                <p className="mt-4 whitespace-pre-wrap leading-7 text-white/75">
                  {post.content}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={post.likedByMe ? "default" : "outline"}
                    disabled={
                      !isAuthenticated ||
                      likePost.isPending ||
                      unlikePost.isPending
                    }
                    onClick={() =>
                      post.likedByMe
                        ? unlikePost.mutate({ postId: post.id })
                        : likePost.mutate({ postId: post.id })
                    }
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    {post.likeCount}
                    <span className="sr-only"> likes</span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleComments(post.id)}
                    aria-expanded={activePostId === post.id}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {post.commentCount}
                    <span className="sr-only"> replies</span>
                  </Button>
                </div>

                {activePostId === post.id ? (
                  <div className="mt-4 space-y-3 border-t border-white/[0.07] pt-4">
                    <div className="space-y-2">
                      {comments.isLoading ? (
                        <p className="text-sm text-white/40">
                          Loading replies…
                        </p>
                      ) : null}
                      {comments.isError ? (
                        <p className="text-sm text-rose-200">
                          Replies could not be loaded.
                        </p>
                      ) : null}
                      {!comments.isLoading &&
                      !comments.isError &&
                      !comments.data?.length ? (
                        <p className="text-sm text-white/35">
                          No replies yet.
                        </p>
                      ) : null}
                      {comments.data?.map(comment => (
                        <div
                          key={comment.id}
                          className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3 text-sm"
                        >
                          <p className="text-white/75">{comment.content}</p>
                          <p className="mt-1 text-xs text-white/30">
                            by{" "}
                            {comment.author?.name ||
                              comment.author?.username ||
                              "Community member"}
                          </p>
                        </div>
                      ))}
                    </div>

                    {isAuthenticated ? (
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                          aria-label="Write a reply"
                          value={commentDraft}
                          onChange={event =>
                            setCommentDraft(event.target.value)
                          }
                          placeholder="Write a reply"
                          maxLength={255}
                          className="h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white outline-none placeholder:text-white/25 focus-visible:ring-2 focus-visible:ring-sky-300/40"
                        />
                        <Button
                          type="button"
                          disabled={
                            !commentDraft.trim() || addComment.isPending
                          }
                          onClick={() =>
                            addComment.mutate({
                              postId: post.id,
                              content: commentDraft.trim(),
                            })
                          }
                        >
                          {addComment.isPending ? "Sending…" : "Reply"}
                        </Button>
                      </div>
                    ) : (
                      <Link
                        href="/signin"
                        className="inline-flex items-center text-xs font-semibold text-sky-200"
                      >
                        Sign in to reply
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    )}
                  </div>
                ) : null}
              </article>
            ))}
          </CardContent>
        </Card>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-200" />
          Social counts on this screen come from stored beta records. A profile
          field or database flag is not presented here as independent identity
          verification.
        </section>
      </div>
    </main>
  );
}
