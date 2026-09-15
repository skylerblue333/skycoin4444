/*
 * Production-shaped social beta surface: persisted records only, authenticated
 * publishing and reactions, and explicit empty/loading/error states.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Bookmark,
  Coins,
  Flag,
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
import { Input } from "@/components/ui/input";

const postTemplates = [
  ["Build update", "Today I tested a small product loop and learned: "],
  ["Video drop", "New video: here is the idea I am exploring and why it matters. "],
  ["Wallet tip", "Wallet safety tip: verify the destination and never share recovery material. "],
  ["Dating safety", "Dating safety reminder: meet in public, protect personal details, and report pressure. "],
  ["Marketplace test", "Marketplace experiment: I am comparing value, quality, and delivery assumptions before buying. "],
] as const;

export default function ActivityFeed() {
  const { user, isAuthenticated, loading } = useAuth();
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [query, setQuery] = useState("");
  const [activePostId, setActivePostId] = useState<string>();
  const [commentDraft, setCommentDraft] = useState("");
  const [feedMode, setFeedMode] = useState<"all" | "video" | "text">("all");
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("sky4444.social.saved-posts") ?? "[]");
    } catch {
      return [];
    }
  });
  const [tipPostId, setTipPostId] = useState<string>();
  const [tipAmount, setTipAmount] = useState(1);
  const [tipChecks, setTipChecks] = useState({ recipient: false, irreversible: false });
  const [tipReceipt, setTipReceipt] = useState("");
  const [reportedPostIds, setReportedPostIds] = useState<string[]>([]);
  const utils = trpc.useUtils();

  const feed = trpc.feed.getFeed.useQuery(
    { limit: 50, offset: 0 },
    { retry: false }
  );
  const createPost = trpc.social.createPost.useMutation({
    onSuccess: async () => {
      setContent("");
      setMediaUrl("");
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
  const followUser = trpc.user.follow.useMutation({
    onSuccess: () => utils.feed.getFeed.invalidate(),
  });
  const unfollowUser = trpc.user.unfollow.useMutation({
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
    return (feed.data ?? []).filter(post => {
      const isVideo = Boolean(post.media && /\.(mp4|webm|ogg)(\?|$)/i.test(post.media));
      const matchesMode = feedMode === "all" || (feedMode === "video" ? isVideo : !isVideo);
      const matchesQuery = !normalized ||
        `${post.content} ${post.author?.name ?? ""} ${post.author?.username ?? ""}`
          .toLowerCase()
          .includes(normalized);
      return matchesMode && matchesQuery;
    });
  }, [feed.data, feedMode, query]);

  const interactionError =
    createPost.error || likePost.error || unlikePost.error || addComment.error || followUser.error || unfollowUser.error;

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

  function toggleSaved(postId: string) {
    setSavedPostIds(current => {
      const next = current.includes(postId)
        ? current.filter(id => id !== postId)
        : [...current, postId];
      try {
        localStorage.setItem("sky4444.social.saved-posts", JSON.stringify(next));
      } catch {
        // Saved-post UI remains usable when browser storage is unavailable.
      }
      return next;
    });
  }

  function openTipPractice(postId: string) {
    setTipPostId(current => current === postId ? undefined : postId);
    setTipAmount(1);
    setTipChecks({ recipient: false, irreversible: false });
    setTipReceipt("");
  }

  function completeTipPractice(postId: string) {
    if (!tipChecks.recipient || !tipChecks.irreversible) return;
    setTipReceipt(`Practice complete: ${tipAmount} SKY demo units reviewed for post ${postId.slice(0, 8)}. No value moved.`);
  }

  async function sharePost(postId: string) {
    const url = `${window.location.origin}/activity-feed#post-${postId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "SKYCOIN4444 community post", url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // Share cancellation and clipboard restrictions should not disrupt the feed.
    }
  }

  function publishUpdate() {
    const trimmedMediaUrl = mediaUrl.trim();
    if (trimmedMediaUrl) {
      try {
        const parsed = new URL(trimmedMediaUrl);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("Unsupported protocol");
      } catch {
        setMediaError("Use a complete http:// or https:// image or video URL.");
        return;
      }
    }
    setMediaError("");
    createPost.mutate({ content: content.trim(), media: trimmedMediaUrl || null });
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
                Post a build note, question, tip, or useful discovery. You can
                attach a direct image or video URL; only the post record is
                persisted by this beta.
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
              <div className="flex flex-wrap gap-2" aria-label="Post templates">
                {postTemplates.map(([label, template]) => (
                  <Button
                    key={label}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-white/10 bg-white/[0.02] text-white/65"
                    onClick={() => setContent(template)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <Input
                value={mediaUrl}
                onChange={event => {
                  setMediaUrl(event.target.value);
                  setMediaError("");
                }}
                maxLength={255}
                placeholder="Optional image/video URL (https://…)"
                aria-label="Optional post media URL"
                className="border-white/10 bg-black/25 text-white placeholder:text-white/25"
              />
              {mediaError ? <p className="text-xs text-rose-200" role="alert">{mediaError}</p> : null}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-white/35">
                  {content.length}/255
                </span>
                <Button
                  disabled={!content.trim() || createPost.isPending}
                  onClick={publishUpdate}
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

              <div className="flex flex-wrap gap-2" aria-label="Feed filters">
                {(["all", "video", "text"] as const).map(mode => (
                  <Button key={mode} type="button" size="sm" variant={feedMode === mode ? "default" : "outline"} onClick={() => setFeedMode(mode)} className={feedMode === mode ? "" : "border-white/10 bg-white/[0.02] text-white/60"}>
                    {mode === "all" ? "All posts" : mode === "video" ? "Video" : "Text & images"}
                  </Button>
                ))}
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
                <div className="flex items-start justify-between gap-3">
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
                  {isAuthenticated && post.author?.id && post.author.id !== user?.id ? (
                    <Button type="button" size="sm" variant={post.author.followedByMe ? "outline" : "default"} disabled={followUser.isPending || unfollowUser.isPending} onClick={() => post.author?.followedByMe ? unfollowUser.mutate({ userId: post.author?.id ?? "" }) : followUser.mutate({ userId: post.author?.id ?? "" })}>
                      {post.author.followedByMe ? "Following" : "Follow"}
                    </Button>
                  ) : null}
                </div>

                <p className="mt-4 whitespace-pre-wrap leading-7 text-white/75">
                  {post.content}
                </p>

                {post.media ? (
                  /\.(mp4|webm|ogg)(\?|$)/i.test(post.media) ? (
                    <video
                      className="mt-4 max-h-[28rem] w-full rounded-2xl border border-white/10 bg-black object-contain"
                      controls
                      preload="metadata"
                      src={post.media}
                    />
                  ) : (
                    <img
                      className="mt-4 max-h-[28rem] w-full rounded-2xl border border-white/10 object-contain"
                      loading="lazy"
                      src={post.media}
                      alt="Attached community post media"
                    />
                  )
                ) : null}

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

                  <Button type="button" size="sm" variant="ghost" onClick={() => toggleSaved(post.id)} aria-pressed={savedPostIds.includes(post.id)}>
                    <Bookmark className={`mr-2 h-4 w-4 ${savedPostIds.includes(post.id) ? "fill-current" : ""}`} />
                    {savedPostIds.includes(post.id) ? "Saved" : "Save"}
                  </Button>

                  <Button type="button" size="sm" variant="ghost" onClick={() => openTipPractice(post.id)} aria-expanded={tipPostId === post.id}>
                    <Coins className="mr-2 h-4 w-4" />
                    Practice tip
                  </Button>

                  <Button type="button" size="sm" variant="ghost" disabled={reportedPostIds.includes(post.id)} onClick={() => setReportedPostIds(current => current.includes(post.id) ? current : [...current, post.id])}>
                    <Flag className="mr-2 h-4 w-4" />
                    {reportedPostIds.includes(post.id) ? "Reported locally" : "Report"}
                  </Button>
                </div>

                {tipPostId === post.id ? (
                  <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                      <div>
                        <p className="font-semibold text-amber-100">Crypto tip safety rehearsal</p>
                        <p className="mt-1 text-xs leading-5 text-white/45">Choose a demo amount and complete both checks. This creates no wallet instruction, transfer, receipt, payout, or financial value.</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[1, 5, 10].map(amount => <Button key={amount} type="button" size="sm" variant={tipAmount === amount ? "default" : "outline"} onClick={() => { setTipAmount(amount); setTipReceipt(""); }}>{amount} demo SKY</Button>)}
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-white/65">
                      <label className="flex items-start gap-2"><input type="checkbox" checked={tipChecks.recipient} onChange={event => setTipChecks(current => ({ ...current, recipient: event.target.checked }))} className="mt-1" /> I would independently verify the recipient and destination.</label>
                      <label className="flex items-start gap-2"><input type="checkbox" checked={tipChecks.irreversible} onChange={event => setTipChecks(current => ({ ...current, irreversible: event.target.checked }))} className="mt-1" /> I understand a real blockchain transfer may be irreversible.</label>
                    </div>
                    <Button type="button" size="sm" className="mt-4" disabled={!tipChecks.recipient || !tipChecks.irreversible} onClick={() => completeTipPractice(post.id)}>Complete safety practice</Button>
                    {tipReceipt ? <p className="mt-3 text-sm text-emerald-200" role="status">{tipReceipt}</p> : null}
                  </div>
                ) : null}

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
          Saves and reports in this iteration remain device-local. Tip practice
          is education only and never creates a transaction or balance.
        </section>
      </div>
    </main>
  );
}
