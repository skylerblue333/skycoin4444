/*
 * Facebook-inspired social information architecture for the SKYCOIN4444
 * engineering beta. The experience uses persisted posts, account-owned
 * mutations, and real social-graph records. It does not fabricate audience
 * size, identity verification, stories, reactions, groups, or event activity.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Bookmark,
  Calendar,
  Coins,
  Flag,
  Globe,
  Heart,
  Home,
  Image,
  MessageSquare,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Send,
  Share2,
  ShieldCheck,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
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

const leftRailLinks = [
  { label: "Home feed", href: "/activity-feed", icon: Home },
  { label: "Friends & follows", href: "/social-graph", icon: Users },
  { label: "Communities", href: "/community", icon: Users },
  { label: "Events", href: "/social-events", icon: Calendar },
  { label: "Messages", href: "/unified-messaging", icon: MessageSquare },
] as const;

const savedShortcut = { label: "Saved", icon: Bookmark } as const;

const topTabs = [
  { label: "Home", href: "/activity-feed", icon: Home },
  { label: "Friends", href: "/social-graph", icon: Users },
  { label: "Groups", href: "/community", icon: Users },
  { label: "Video", href: "/reels", icon: Video },
  { label: "Events", href: "/social-events", icon: Calendar },
] as const;

function formatPostTime(value: unknown) {
  if (!value) return "Recently";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Recently";

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + "m";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + "h";
  const days = Math.floor(hours / 24);
  if (days < 7) return days + "d";
  return date.toLocaleDateString();
}

function initials(name?: string | null, username?: string | null) {
  return (name?.trim()?.[0] || username?.trim()?.[0] || "S").toUpperCase();
}

export default function ActivityFeed() {
  const { user, isAuthenticated, loading } = useAuth();
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [query, setQuery] = useState("");
  const [activePostId, setActivePostId] = useState<string>();
  const [commentDraft, setCommentDraft] = useState("");
  const [feedMode, setFeedMode] =
    useState<"all" | "video" | "text" | "saved">("all");
  const [composerOpen, setComposerOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    try {
      const parsed = JSON.parse(
        localStorage.getItem("sky4444.social.saved-posts") ?? "[]"
      );
      return Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === "string")
        : [];
    } catch {
      return [];
    }
  });
  const [tipPostId, setTipPostId] = useState<string>();
  const [tipAmount, setTipAmount] = useState(1);
  const [tipChecks, setTipChecks] = useState({
    recipient: false,
    irreversible: false,
  });
  const [tipReceipt, setTipReceipt] = useState("");
  const [reportedPostIds, setReportedPostIds] = useState<string[]>([]);
  const utils = trpc.useUtils();

  const feed = trpc.feed.getFeed.useQuery(
    { limit: 50, offset: 0 },
    { retry: false }
  );
  const suggestedFollows = trpc.user.suggestedFollows.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const createPost = trpc.social.createPost.useMutation({
    onSuccess: async () => {
      setContent("");
      setMediaUrl("");
      setComposerOpen(false);
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
    onSuccess: async () => {
      await Promise.all([
        utils.feed.getFeed.invalidate(),
        utils.user.suggestedFollows.invalidate(),
      ]);
    },
  });
  const unfollowUser = trpc.user.unfollow.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.feed.getFeed.invalidate(),
        utils.user.suggestedFollows.invalidate(),
      ]);
    },
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
      const isVideo = Boolean(
        post.media && /\.(mp4|webm|ogg)(\?|$)/i.test(post.media)
      );
      const matchesMode =
        feedMode === "all" ||
        (feedMode === "video"
          ? isVideo
          : feedMode === "text"
            ? !isVideo
            : savedPostIds.includes(post.id));
      const matchesQuery =
        !normalized ||
        (String(post.content ?? "") +
          " " +
          String(post.author?.name ?? "") +
          " " +
          String(post.author?.username ?? ""))
          .toLowerCase()
          .includes(normalized);
      return matchesMode && matchesQuery;
    });
  }, [feed.data, feedMode, query, savedPostIds]);

  const recentHighlights = useMemo(() => posts.slice(0, 5), [posts]);

  const interactionError =
    createPost.error ||
    likePost.error ||
    unlikePost.error ||
    addComment.error ||
    followUser.error ||
    unfollowUser.error;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07090f] p-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="h-14 animate-pulse rounded-2xl bg-white/10" />
          <div className="mt-6 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
            <div className="hidden h-72 animate-pulse rounded-2xl bg-white/[0.04] lg:block" />
            <div className="h-96 animate-pulse rounded-2xl bg-white/[0.04]" />
            <div className="hidden h-72 animate-pulse rounded-2xl bg-white/[0.04] lg:block" />
          </div>
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
        localStorage.setItem(
          "sky4444.social.saved-posts",
          JSON.stringify(next)
        );
      } catch {
        // Device-local saves remain usable when browser storage is unavailable.
      }
      return next;
    });
  }

  function openTipPractice(postId: string) {
    setTipPostId(current => (current === postId ? undefined : postId));
    setTipAmount(1);
    setTipChecks({ recipient: false, irreversible: false });
    setTipReceipt("");
  }

  function completeTipPractice(postId: string) {
    if (!tipChecks.recipient || !tipChecks.irreversible) return;
    setTipReceipt(
      "Practice complete: " +
        tipAmount +
        " SKY demo units reviewed for post " +
        postId.slice(0, 8) +
        ". No value moved."
    );
  }

  async function sharePost(postId: string) {
    const url =
      window.location.origin + "/activity-feed#post-" + encodeURIComponent(postId);
    setShareStatus("");
    try {
      if (navigator.share) {
        await navigator.share({
          title: "SKYCOIN4444 community post",
          url,
        });
        setShareStatus("Share sheet opened.");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareStatus("Post link copied.");
      } else {
        setShareStatus("Sharing is not available in this browser.");
      }
    } catch {
      setShareStatus("Share cancelled.");
    }
  }

  function publishUpdate() {
    const trimmedMediaUrl = mediaUrl.trim();
    if (trimmedMediaUrl) {
      try {
        const parsed = new URL(trimmedMediaUrl);
        if (parsed.protocol !== "https:") {
          throw new Error("Unsupported protocol");
        }
      } catch {
        setMediaError("Use a complete https:// image or video URL.");
        return;
      }
    }
    setMediaError("");
    createPost.mutate({
      content: content.trim(),
      media: trimmedMediaUrl || null,
    });
  }

  const composerAvatar = initials(user?.name, null);

  return (
    <main className="min-h-screen bg-[#07090f] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0d14]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-3 sm:px-5">
          <Link
            href="/activity-feed"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 text-sm font-black text-white shadow-lg shadow-sky-500/10"
            aria-label="SKYCOIN4444 Social home"
          >
            S4
          </Link>

          <div className="relative hidden w-64 md:block">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-white/35" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search Social"
              aria-label="Search social posts"
              className="h-10 w-full rounded-full border border-white/10 bg-white/[0.06] pl-9 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-sky-300/40"
            />
          </div>

          <nav
            className="mx-auto flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto"
            aria-label="Social primary navigation"
          >
            {topTabs.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    "flex min-w-14 shrink-0 flex-col items-center justify-center rounded-xl px-3 py-2 text-[11px] font-semibold transition sm:min-w-20 " +
                    (item.href === "/activity-feed"
                      ? "bg-sky-400/10 text-sky-200"
                      : "text-white/45 hover:bg-white/[0.05] hover:text-white")
                  }
                >
                  <Icon className="mb-0.5 h-5 w-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {!isAuthenticated ? (
              <Link href="/signin">
                <Button size="sm">Sign in</Button>
              </Link>
            ) : (
              <Link
                href="/user-profile"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white"
                aria-label="Open profile"
              >
                {composerAvatar}
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-5 px-3 py-5 sm:px-5 lg:grid-cols-[240px_minmax(0,720px)_280px] xl:grid-cols-[260px_minmax(0,760px)_300px]">
        <aside className="hidden lg:block">
          <div className="sticky top-21 space-y-4">
            {isAuthenticated ? (
              <Link
                href="/user-profile"
                className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/[0.05]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400/80 to-violet-500/80 font-bold">
                  {composerAvatar}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {user?.name || "Your profile"}
                  </p>
                  <p className="text-xs text-white/35">Profile & timeline</p>
                </div>
              </Link>
            ) : null}

            <nav className="space-y-1" aria-label="Social shortcuts">
              {leftRailLinks.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06]">
                      <Icon className="h-4 w-4 text-sky-200" />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFeedMode("saved");
                }}
                className={
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition " +
                  (feedMode === "saved"
                    ? "bg-sky-400/10 text-sky-100"
                    : "text-white/70 hover:bg-white/[0.05] hover:text-white")
                }
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06]">
                  <Bookmark className="h-4 w-4 text-sky-200" />
                </span>
                <span className="flex-1">{savedShortcut.label}</span>
                <span className="text-xs text-white/35">
                  {savedPostIds.length}
                </span>
              </button>
            </nav>

            <div className="border-t border-white/10 pt-4 text-xs leading-5 text-white/30">
              Social actions shown here are backed by beta records where stated.
              Saved posts and reports remain local in this iteration.
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {leftRailLinks.slice(1, 5).map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/65"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFeedMode("saved");
              }}
              className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/65"
            >
              <Bookmark className="h-4 w-4" />
              {savedShortcut.label}
              <span className="text-white/30">{savedPostIds.length}</span>
            </button>
          </div>

          <Card className="overflow-hidden border-white/10 bg-white/[0.035] text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base text-white">
                    Recent highlights
                  </CardTitle>
                  <CardDescription className="text-white/40">
                    Story-style cards derived from persisted feed records, not
                    fabricated stories.
                  </CardDescription>
                </div>
                <Link
                  href="/reels"
                  className="text-xs font-semibold text-sky-200 hover:text-sky-100"
                >
                  Open video
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => setComposerOpen(true)}
                    className="group relative flex h-44 w-28 shrink-0 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-sky-500/20 to-violet-500/20 p-3 text-left"
                  >
                    <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-sky-400 text-slate-950">
                      <Plus className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-bold">Create update</p>
                    <p className="mt-1 text-[11px] text-white/45">
                      Post to the real feed
                    </p>
                  </button>
                ) : (
                  <Link
                    href="/signin"
                    className="group relative flex h-44 w-28 shrink-0 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-sky-500/20 to-violet-500/20 p-3 text-left"
                  >
                    <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-sky-400 text-slate-950">
                      <Plus className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-bold">Create update</p>
                    <p className="mt-1 text-[11px] text-white/45">
                      Sign in to post
                    </p>
                  </Link>
                )}

                {recentHighlights.map(post => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => {
                      setActivePostId(post.id);
                      document
                        .getElementById("post-" + post.id)
                        ?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="relative h-44 w-28 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40 text-left"
                  >
                    {post.media && !/\.(mp4|webm|ogg)(\?|$)/i.test(post.media) ? (
                      <img
                        src={post.media}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-55"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-sky-500/10 to-black" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-10">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-sky-300 bg-slate-900 text-xs font-bold">
                        {initials(post.author?.name, post.author?.username)}
                      </div>
                      <p className="line-clamp-2 text-xs font-semibold text-white">
                        {post.author?.name ||
                          post.author?.username ||
                          "Community member"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {!isAuthenticated ? (
            <Card className="border-amber-300/20 bg-amber-300/[0.04] text-white">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                  <div>
                    <p className="font-semibold text-amber-100">
                      Browse publicly; participate with an account
                    </p>
                    <p className="mt-1 text-sm leading-6 text-white/45">
                      Sign in to publish, like, follow, or reply. Anonymous
                      browsing does not create a simulated user session.
                    </p>
                  </div>
                </div>
                <Link href="/signin">
                  <Button className="shrink-0">Sign in to participate</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-white/10 bg-white/[0.035] text-white">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400/80 to-violet-500/80 font-bold">
                    {composerAvatar}
                  </div>
                  <button
                    type="button"
                    onClick={() => setComposerOpen(true)}
                    className="h-10 flex-1 rounded-full border border-white/10 bg-white/[0.06] px-4 text-left text-sm text-white/40 transition hover:bg-white/[0.09]"
                  >
                    What's on your mind?
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-3 border-t border-white/10 pt-3">
                  <button
                    type="button"
                    onClick={() => setComposerOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-white/55 hover:bg-white/[0.05] hover:text-white"
                  >
                    <Video className="h-4 w-4 text-rose-300" />
                    Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-white/55 hover:bg-white/[0.05] hover:text-white"
                  >
                    <Image className="h-4 w-4 text-emerald-300" />
                    Photo
                  </button>
                  <Link
                    href="/social-events"
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-white/55 hover:bg-white/[0.05] hover:text-white"
                  >
                    <Calendar className="h-4 w-4 text-violet-300" />
                    Event
                  </Link>
                </div>

                {composerOpen ? (
                  <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Create post</p>
                        <p className="text-xs text-white/35">
                          Persisted to the engineering-beta feed
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        aria-label="Close post composer"
                        onClick={() => setComposerOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <Textarea
                      value={content}
                      onChange={event => setContent(event.target.value)}
                      maxLength={255}
                      placeholder="What's on your mind?"
                      aria-label="Social post content"
                      className="min-h-28 border-white/10 bg-black/20 text-base"
                    />

                    <div
                      className="flex flex-wrap gap-2"
                      aria-label="Post templates"
                    >
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
                      placeholder="Optional https:// image/video URL"
                      aria-label="Optional post media URL"
                      className="border-white/10 bg-black/25 text-white placeholder:text-white/25"
                    />
                    {mediaError ? (
                      <p className="text-xs text-rose-200" role="alert">
                        {mediaError}
                      </p>
                    ) : null}

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-white/35">
                        <Globe className="h-3.5 w-3.5" />
                        Beta community post
                        <span aria-hidden="true">·</span>
                        {content.length}/255
                      </div>
                      <Button
                        disabled={!content.trim() || createPost.isPending}
                        onClick={publishUpdate}
                      >
                        {createPost.isPending ? "Posting…" : "Post"}
                      </Button>
                    </div>
                  </div>
                ) : null}

                {createPost.isSuccess ? (
                  <p
                    className="mt-3 text-sm text-emerald-200"
                    role="status"
                    aria-live="polite"
                  >
                    Post saved to the beta feed.
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

          <Card className="border-white/10 bg-white/[0.025] text-white">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Radio className="h-5 w-5 text-sky-200" />
                    Feed
                  </CardTitle>
                  <CardDescription
                    id="activity-feed-status"
                    className="mt-1 text-white/45"
                  >
                    {feed.isLoading
                      ? "Loading posts…"
                      : posts.length +
                        " visible posts" +
                        (query.trim()
                          ? " matching “" + query.trim() + "”"
                          : "")}
                  </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(["all", "video", "text", "saved"] as const).map(mode => (
                    <Button
                      key={mode}
                      type="button"
                      size="sm"
                      variant={feedMode === mode ? "default" : "outline"}
                      onClick={() => setFeedMode(mode)}
                      className={
                        feedMode === mode
                          ? ""
                          : "border-white/10 bg-white/[0.02] text-white/60"
                      }
                    >
                      {mode === "all"
                        ? "Top"
                        : mode === "video"
                          ? "Video"
                          : mode === "text"
                            ? "Posts"
                            : "Saved"}
                    </Button>
                  ))}
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
                        "h-4 w-4 " +
                        (feed.isFetching ? "animate-spin" : "")
                      }
                    />
                  </Button>
                </div>
              </div>

              <div className="relative md:hidden">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-white/35" />
                <input
                  aria-describedby="activity-feed-status"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Search posts"
                  className="h-10 w-full rounded-full border border-white/10 bg-black/25 pl-9 pr-10 text-sm text-white outline-none placeholder:text-white/25 focus-visible:ring-2 focus-visible:ring-sky-300/40"
                />
                {query ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    aria-label="Clear post search"
                    onClick={() => setQuery("")}
                    className="absolute right-0 top-0 h-10 px-3 text-white/45"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
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
                    {feedMode === "saved"
                      ? "No saved posts on this device."
                      : query.trim()
                        ? "No matching posts."
                        : "No posts yet."}
                  </p>
                  <p className="mt-1 text-sm text-white/35">
                    {feedMode === "saved"
                      ? "Use Save on a post to keep a device-local shortcut here."
                      : query.trim()
                        ? "Clear the search or try a different phrase."
                        : "The feed will show real community activity when it is published."}
                  </p>
                </div>
              ) : null}

              {posts.map(post => (
                <article
                  id={"post-" + post.id}
                  key={post.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0f17]"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-500/60 to-violet-500/60 font-bold">
                          {post.author?.avatar ? (
                            <img
                              src={post.author.avatar}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials(
                              post.author?.name,
                              post.author?.username
                            )
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-semibold text-white">
                              {post.author?.name ||
                                post.author?.username ||
                                "Community member"}
                            </p>
                          </div>
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/35">
                            <span>{formatPostTime(post.createdAt)}</span>
                            <span aria-hidden="true">·</span>
                            <Globe className="h-3 w-3" aria-label="Community visible" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {isAuthenticated &&
                        post.author?.id &&
                        post.author.id !== user?.id ? (
                          <Button
                            type="button"
                            size="sm"
                            variant={
                              post.author.followedByMe ? "outline" : "default"
                            }
                            disabled={
                              followUser.isPending || unfollowUser.isPending
                            }
                            onClick={() =>
                              post.author?.followedByMe
                                ? unfollowUser.mutate({
                                    userId: post.author?.id ?? "",
                                  })
                                : followUser.mutate({
                                    userId: post.author?.id ?? "",
                                  })
                            }
                          >
                            {post.author.followedByMe
                              ? "Following"
                              : "Follow"}
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-[15px] leading-6 text-white/80">
                      {post.content}
                    </p>
                  </div>

                  {post.media ? (
                    /\.(mp4|webm|ogg)(\?|$)/i.test(post.media) ? (
                      <video
                        className="max-h-[34rem] w-full border-y border-white/10 bg-black object-contain"
                        controls
                        preload="metadata"
                        src={post.media}
                      />
                    ) : (
                      <img
                        className="max-h-[34rem] w-full border-y border-white/10 object-contain"
                        loading="lazy"
                        src={post.media}
                        alt="Attached community post media"
                      />
                    )
                  ) : null}

                  <div className="px-4 py-3 sm:px-5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-white/40">
                      <span>
                        {post.likeCount > 0
                          ? post.likeCount + " like" + (post.likeCount === 1 ? "" : "s")
                          : "Be the first to like"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleComments(post.id)}
                        className="hover:text-white"
                      >
                        {post.commentCount} comment
                        {post.commentCount === 1 ? "" : "s"}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
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
                        className={
                          post.likedByMe
                            ? "text-sky-300 hover:text-sky-200"
                            : "text-white/55 hover:text-white"
                        }
                      >
                        <Heart
                          className={
                            "mr-2 h-4 w-4 " +
                            (post.likedByMe ? "fill-current" : "")
                          }
                        />
                        Like
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleComments(post.id)}
                        aria-expanded={activePostId === post.id}
                        className="text-white/55 hover:text-white"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Comment
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => sharePost(post.id)}
                        className="text-white/55 hover:text-white"
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleSaved(post.id)}
                        aria-pressed={savedPostIds.includes(post.id)}
                        className="text-xs text-white/40"
                      >
                        <Bookmark
                          className={
                            "mr-2 h-3.5 w-3.5 " +
                            (savedPostIds.includes(post.id)
                              ? "fill-current"
                              : "")
                          }
                        />
                        {savedPostIds.includes(post.id) ? "Saved" : "Save"}
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => openTipPractice(post.id)}
                        aria-expanded={tipPostId === post.id}
                        className="text-xs text-white/40"
                      >
                        <Coins className="mr-2 h-3.5 w-3.5" />
                        Tip safety practice
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={reportedPostIds.includes(post.id)}
                        onClick={() =>
                          setReportedPostIds(current =>
                            current.includes(post.id)
                              ? current
                              : [...current, post.id]
                          )
                        }
                        className="ml-auto text-xs text-white/40"
                      >
                        <Flag className="mr-2 h-3.5 w-3.5" />
                        {reportedPostIds.includes(post.id)
                          ? "Reported locally"
                          : "Report"}
                      </Button>
                    </div>

                    {tipPostId === post.id ? (
                      <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-4">
                        <div className="flex items-start gap-3">
                          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                          <div>
                            <p className="font-semibold text-amber-100">
                              Crypto tip safety rehearsal
                            </p>
                            <p className="mt-1 text-xs leading-5 text-white/45">
                              Choose a demo amount and complete both checks.
                              This creates no wallet instruction, transfer,
                              receipt, payout, or financial value.
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {[1, 5, 10].map(amount => (
                            <Button
                              key={amount}
                              type="button"
                              size="sm"
                              variant={
                                tipAmount === amount ? "default" : "outline"
                              }
                              onClick={() => {
                                setTipAmount(amount);
                                setTipReceipt("");
                              }}
                            >
                              {amount} demo SKY
                            </Button>
                          ))}
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-white/65">
                          <label className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={tipChecks.recipient}
                              onChange={event =>
                                setTipChecks(current => ({
                                  ...current,
                                  recipient: event.target.checked,
                                }))
                              }
                              className="mt-1"
                            />
                            I would independently verify the recipient and
                            destination.
                          </label>
                          <label className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={tipChecks.irreversible}
                              onChange={event =>
                                setTipChecks(current => ({
                                  ...current,
                                  irreversible: event.target.checked,
                                }))
                              }
                              className="mt-1"
                            />
                            I understand a real blockchain transfer may be
                            irreversible.
                          </label>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          className="mt-4"
                          disabled={
                            !tipChecks.recipient || !tipChecks.irreversible
                          }
                          onClick={() => completeTipPractice(post.id)}
                        >
                          Complete safety practice
                        </Button>
                        {tipReceipt ? (
                          <p
                            className="mt-3 text-sm text-emerald-200"
                            role="status"
                          >
                            {tipReceipt}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    {activePostId === post.id ? (
                      <div className="mt-4 space-y-3 border-t border-white/[0.07] pt-4">
                        <div className="space-y-2">
                          {comments.isLoading ? (
                            <p className="text-sm text-white/40">
                              Loading comments…
                            </p>
                          ) : null}
                          {comments.isError ? (
                            <p className="text-sm text-rose-200">
                              Comments could not be loaded.
                            </p>
                          ) : null}
                          {!comments.isLoading &&
                          !comments.isError &&
                          !comments.data?.length ? (
                            <p className="text-sm text-white/35">
                              No comments yet.
                            </p>
                          ) : null}
                          {comments.data?.map(comment => (
                            <div
                              key={comment.id}
                              className="flex gap-2 rounded-xl bg-white/[0.035] p-3"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                                {initials(
                                  comment.author?.name,
                                  comment.author?.username
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-white/70">
                                  {comment.author?.name ||
                                    comment.author?.username ||
                                    "Community member"}
                                </p>
                                <p className="mt-1 text-sm text-white/75">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {isAuthenticated ? (
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400/70 to-violet-500/70 text-xs font-bold">
                              {composerAvatar}
                            </div>
                            <div className="flex min-w-0 flex-1 gap-2">
                              <input
                                aria-label="Write a comment"
                                value={commentDraft}
                                onChange={event =>
                                  setCommentDraft(event.target.value)
                                }
                                placeholder="Write a comment…"
                                maxLength={255}
                                className="h-10 min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none placeholder:text-white/25 focus-visible:ring-2 focus-visible:ring-sky-300/40"
                              />
                              <Button
                                type="button"
                                size="sm"
                                aria-label="Send comment"
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
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Link
                            href="/signin"
                            className="inline-flex items-center text-xs font-semibold text-sky-200"
                          >
                            Sign in to comment
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </CardContent>
          </Card>

          {shareStatus ? (
            <p
              className="text-center text-xs text-white/35"
              role="status"
              aria-live="polite"
            >
              {shareStatus}
            </p>
          ) : null}

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
            <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-200" />
            Persisted records only. This feed does not invent audience size, engagement,
            or social proof. Counts on this screen come from stored beta records.
            A profile database flag is not presented here as independent identity
            verification. Highlight cards are derived from existing posts.
            Saves and reports remain device-local. Tip practice is education only and
            never creates a transaction or balance.
          </section>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-21 space-y-4">
            <Card className="border-white/10 bg-white/[0.035] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-white">
                  People you may want to follow
                </CardTitle>
                <CardDescription className="text-white/40">
                  Real beta suggestions from the social graph.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {!isAuthenticated ? (
                  <p className="text-sm text-white/35">
                    Sign in to see account-specific suggestions.
                  </p>
                ) : suggestedFollows.isLoading ? (
                  <p className="text-sm text-white/35">
                    Loading suggestions…
                  </p>
                ) : suggestedFollows.data?.length ? (
                  suggestedFollows.data.slice(0, 5).map(person => (
                    <div key={person.id} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-xs font-bold">
                        {person.avatar ? (
                          <img
                            src={person.avatar}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initials(person.name, person.username)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {person.name ||
                            person.username ||
                            "Community member"}
                        </p>
                        <p className="truncate text-xs text-white/35">
                          {person.username
                            ? "@" + person.username
                            : "Suggested account"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        aria-label={
                          "Follow " +
                          (person.name ||
                            person.username ||
                            "suggested account")
                        }
                        disabled={followUser.isPending}
                        onClick={() =>
                          followUser.mutate({ userId: person.id })
                        }
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/35">
                    No suggestions available right now.
                  </p>
                )}

                <Link
                  href="/social-graph"
                  className="inline-flex items-center text-xs font-semibold text-sky-200"
                >
                  See social graph
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.035] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-white">
                  Explore Social
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Link
                  href="/community"
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm text-white/65 hover:bg-white/[0.05] hover:text-white"
                >
                  <Users className="h-4 w-4 text-violet-300" />
                  Communities
                </Link>
                <Link
                  href="/social-events"
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm text-white/65 hover:bg-white/[0.05] hover:text-white"
                >
                  <Calendar className="h-4 w-4 text-sky-300" />
                  Events
                </Link>
                <Link
                  href="/reels"
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm text-white/65 hover:bg-white/[0.05] hover:text-white"
                >
                  <Video className="h-4 w-4 text-rose-300" />
                  Video & reels
                </Link>
                <Link
                  href="/unified-messaging"
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm text-white/65 hover:bg-white/[0.05] hover:text-white"
                >
                  <MessageSquare className="h-4 w-4 text-emerald-300" />
                  Messages
                </Link>
              </CardContent>
            </Card>

            <Card className="border-sky-300/15 bg-sky-300/[0.03] text-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-200" />
                  <div>
                    <p className="text-sm font-semibold text-sky-100">
                      Engineering-beta boundary
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/40">
                      This social home intentionally avoids fake friends,
                      followers, stories, reactions, reach, or activity counts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </main>
  );
}
