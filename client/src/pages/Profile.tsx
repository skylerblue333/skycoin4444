import { useState, useRef } from "react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Heart, MessageCircle, Share2, Bookmark, Calendar, MapPin,
  Link as LinkIcon, Zap, Camera, Crown, CheckCircle2, Share2 as TwitterIcon,
  Play as YoutubeIcon, Globe, Edit3, UserPlus, UserMinus,
  Star, Trophy, Flame, TrendingUp, BarChart3, Users,
  Grid3X3, Play, Sparkles, Shield, DollarSign
} from "lucide-react";

function timeAgo(date: Date | string) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function ReputationBadge({ score }: { score: number }) {
  const tiers = [
    { min: 0, label: "Newcomer", color: "text-slate-400", bg: "bg-slate-500/10", icon: "🌱" },
    { min: 100, label: "Explorer", color: "text-blue-400", bg: "bg-blue-500/10", icon: "🔭" },
    { min: 500, label: "Builder", color: "text-purple-400", bg: "bg-purple-500/10", icon: "🔨" },
    { min: 1000, label: "Creator", color: "text-pink-400", bg: "bg-pink-500/10", icon: "✨" },
    { min: 5000, label: "Legend", color: "text-yellow-400", bg: "bg-yellow-500/10", icon: "👑" },
    { min: 10000, label: "Mythic", color: "text-orange-400", bg: "bg-orange-500/10", icon: "🔥" },
  ];
  const tier = [...tiers].reverse().find(t => score >= t.min) || tiers[0];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${tier.bg} ${tier.color}`}>
      <span>{tier.icon}</span> {tier.label}
    </span>
  );
}

function LevelBadge({ level }: { level: number }) {
  const color = level >= 10 ? "text-yellow-400 bg-yellow-500/10" : level >= 5 ? "text-purple-400 bg-purple-500/10" : "text-blue-400 bg-blue-500/10";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
      <Zap className="w-3 h-3" /> Lv.{level}
    </span>
  );
}

function PostCard({ post }: { post: any }) {
  return (
    <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all">
      {post.mediaUrl && (
        <div className="relative rounded-xl overflow-hidden mb-3 bg-black/30">
          {post.type === "video" || post.type === "reel" ? (
            <div className="relative aspect-video flex items-center justify-center bg-black/50">
              <Play className="w-10 h-10 text-white/60" />
            </div>
          ) : (
            <img src={post.mediaUrl} alt="" className="w-full max-h-64 object-cover" loading="lazy" />
          )}
        </div>
      )}
      {post.content && (
        <p className="text-sm text-white/80 leading-relaxed mb-3">
          {post.content.length > 200 ? post.content.slice(0, 200) + "…" : post.content}
        </p>
      )}
      <div className="flex items-center gap-3 text-xs text-white/30">
        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {post.likeCount ?? "—"}</span>
        <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {post.commentCount || 0}</span>
        <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /></span>
        <span className="ml-auto">{timeAgo(post.createdAt)}</span>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user: me, isAuthenticated } = useAuth();
  const [, params] = useRoute("/profile/:username");
  const username = params?.username;

  // Load profile by username or fall back to own profile
  const { data: profileData, isLoading } = username
    ? trpc.user.profileByUsername.useQuery({ username }, { enabled: !!username })
    : { data: me, isLoading: false };

  const utils = trpc.useUtils();
  const { data: myPosts } = trpc.feed.list.useQuery();
  const [postDraft, setPostDraft] = useState("");

  const createPost = trpc.feed.create.useMutation({
    onSuccess: async () => {
      setPostDraft("");
      await utils.feed.list.invalidate();
      toast.success("Post published.");
    },
    onError: (err) => toast.error(err.message),
  });

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => toast.success("Profile updated!"),
    onError: () => toast.error("Update failed"),
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const isOwnProfile = !username || (me && (profileData as any)?.id === me.id);
  const profile = (profileData as any) || me;

  const uploadAvatar = trpc.user.uploadAvatar.useMutation({
    onSuccess: () => {
      toast.success("Avatar updated!");
      void utils.user.profile.invalidate();
    },
    onError: (err) => toast.error("Upload failed: " + err.message),
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      setAvatarPreview(dataUrl);
      uploadAvatar.mutate({ data: dataUrl, type: "avatar", mimeType: file.type || "image/jpeg" });
    };
    reader.readAsDataURL(file);
  };

  const userPosts = myPosts?.filter((p: any) => p.authorId === profile?.id) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07050f] flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading profile…</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#07050f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">Profile not found</p>
          <Link href="/social"><Button size="sm" variant="outline" className="border-white/10 text-white/60">Back to Feed</Button></Link>
        </div>
      </div>
    );
  }

  const displayName = profile.name || "User";
  const handle = profile.username ? `@${profile.username}` : "@unclaimed";
  const avatar = avatarPreview || profile.avatar;

  const ACHIEVEMENT_ICONS: Record<string, string> = {
    first_post: "📝", first_follow: "👥", first_like: "❤️", verified: "✅",
    level_5: "⭐", level_10: "🌟", top_creator: "👑", early_adopter: "🚀",
    community_builder: "🏗️", staker: "💎", donor: "💝", streamer: "🎥",
  };

  return (
    <div className="min-h-screen bg-[#07050f]">
      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <div className="w-full h-full" style={{ background: "linear-gradient(135deg, oklch(0.25 0.15 305), oklch(0.20 0.12 340), oklch(0.18 0.10 200))" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07050f] via-transparent to-transparent" />

      </div>

      <div className="max-w-screen-xl mx-auto px-4">
        {/* Profile header */}
        <div className="relative -mt-16 mb-6">
          <div className="flex items-end justify-between">
            <div className="relative">
              <div className="p-1 rounded-full bg-[#07050f] inline-block">
                <div className="p-0.5 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
                  <div className="p-0.5 rounded-full bg-[#07050f]">
                    <Avatar className="w-24 h-24 md:w-28 md:h-28">
                      <AvatarImage src={avatar ?? undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-3xl font-bold">
                        {displayName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
              {isOwnProfile && (
                <>
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <button onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-all shadow-lg">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 pb-2">
              {isOwnProfile ? (
                <Link href="/profile-edit">
                  <Button size="sm" variant="outline" className="border-white/10 text-white/70 hover:text-white hover:border-white/20 bg-transparent gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </Button>
                </Link>
              ) : isAuthenticated ? (
                <Button size="sm" disabled variant="outline" className="border-white/10 text-white/40 bg-transparent gap-1.5">
                  <UserPlus className="w-3.5 h-3.5" /> Follow unavailable
                </Button>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">Sign In to Follow</Button>
                </a>
              )}
              <Button size="sm" variant="outline" className="border-white/10 text-white/40 hover:text-white bg-transparent"
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Profile link copied!"); }}>
                <Share2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Name + badges */}
          <div className="mt-3">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-white">{displayName}</h1>
              {profile.verified && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
              {profile.role === "admin" && <Shield className="w-4 h-4 text-yellow-400" />}
            </div>
            <p className="text-sm text-white/40 mb-2">{handle}</p>
            <div className="mb-3 text-xs text-white/40">Account metadata is limited to verified profile records.</div>

            {profile.bio && <p className="text-sm text-white/70 leading-relaxed mb-3 max-w-xl">{profile.bio}</p>}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 mb-4">
              {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.location}</span>}
              {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-purple-400 transition-colors"><Globe className="w-3 h-3" />{profile.website.replace(/^https?:\/\//, "")}</a>}
              {profile.twitter && <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-sky-400 transition-colors"><Share2 className="w-3 h-3" />@{profile.twitter}</a>}
              {profile.instagram && <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-pink-400 transition-colors"><Share2 className="w-3 h-3" />@{profile.instagram}</a>}
              {profile.youtube && <a href={profile.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-red-400 transition-colors"><Play className="w-3 h-3" />YouTube</a>}
              {profile.createdAt && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Joined {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>}
            </div>

            <div className="text-sm text-white/50">{userPosts.length} persisted post{userPosts.length === 1 ? "" : "s"}</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="pb-12">
          <TabsList className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-1 mb-4 w-full">
            {[
              { value: "posts", label: "Posts", icon: Grid3X3 },
              { value: "media", label: "Media", icon: Play },
              { value: "likes", label: "Liked", icon: Heart },
            ].map(t => (
              <TabsTrigger key={t.value} value={t.value}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm data-[state=active]:bg-white/8 data-[state=active]:text-white text-white/40 rounded-xl transition-all">
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="posts">
            {isOwnProfile && isAuthenticated && (
              <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-4 mb-4">
                <label htmlFor="profile-post" className="block text-sm font-medium text-white/70 mb-2">Share an update</label>
                <textarea
                  id="profile-post"
                  value={postDraft}
                  onChange={(event) => setPostDraft(event.target.value)}
                  maxLength={255}
                  rows={3}
                  placeholder="Write something real and useful to your community…"
                  className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                  disabled={createPost.isPending}
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-white/35">{postDraft.length}/255</span>
                  <Button
                    size="sm"
                    onClick={() => createPost.mutate({ content: postDraft.trim() })}
                    disabled={createPost.isPending || postDraft.trim().length === 0}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                  >
                    {createPost.isPending ? "Publishing…" : "Publish"}
                  </Button>
                </div>
              </div>
            )}
            {userPosts.length > 0 ? (
              <div className="space-y-3">
                {userPosts.map((post: any) => <PostCard key={post.id} post={post} />)}
              </div>
            ) : (
              <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-12 text-center">
                <Sparkles className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
                <p className="text-white/40 text-sm">
                  {isOwnProfile ? "You haven't posted yet." : `${displayName} hasn't posted yet.`}
                </p>
                {isOwnProfile && (
                  <Link href="/social">
                    <Button size="sm" className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">Create First Post</Button>
                  </Link>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="media">
            {userPosts.filter((p: any) => p.mediaUrl).length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {userPosts.filter((p: any) => p.mediaUrl).map((post: any) => (
                  <div key={post.id} className="aspect-square rounded-xl overflow-hidden bg-black/30 relative group cursor-pointer">
                    <img src={post.mediaUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3 text-white text-xs">
                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{post.likeCount || 0}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{post.commentCount || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-12 text-center">
                <Play className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No media posts yet.</p>
              </div>
            )}
          </TabsContent>

                    <TabsContent value="likes">
            <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-12 text-center">
              <Heart className="w-10 h-10 text-pink-400/40 mx-auto mb-3" />
              <p className="text-white/40 text-sm">Liked posts are private.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
