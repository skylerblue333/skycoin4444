/**
 * SocialGraph — DB-backed followers, following, and suggested connections.
 */
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Users, UserPlus, UserCheck, ChevronLeft, Network, Star, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

type SocialUser = {
  id: string;
  username: string | null;
  name: string | null;
  bio: string | null;
  avatar: string | null;
  verified: boolean | null;
};

function UserCard({
  user,
  onToggleFollow,
  isFollowing,
  disabled,
}: {
  user: SocialUser;
  onToggleFollow: (id: string) => void;
  isFollowing: boolean;
  disabled: boolean;
}) {
  const initial = (user.name?.[0] ?? user.username?.[0] ?? "?").toUpperCase();
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 p-3 transition-all hover:bg-white/5">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 text-sm font-bold text-white">
        {user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-white">{user.name ?? user.username ?? "Unnamed user"}</div>
        {user.username ? <div className="truncate text-xs text-muted-foreground">@{user.username}</div> : null}
        {user.bio ? <div className="mt-0.5 truncate text-xs text-muted-foreground">{user.bio}</div> : null}
      </div>
      <button
        disabled={disabled}
        onClick={() => onToggleFollow(user.id)}
        className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-50 ${
          isFollowing
            ? "border border-green-500/30 bg-green-500/20 text-green-400 hover:border-red-500/30 hover:bg-red-500/20 hover:text-red-400"
            : "border border-purple-500/30 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
        }`}
      >
        {isFollowing ? <UserCheck className="h-3 w-3" /> : <UserPlus className="h-3 w-3" />}
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

export default function SocialGraph() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"followers" | "following" | "suggested">("suggested");
  const utils = trpc.useUtils();

  const { data: followers = [] } = trpc.user.followers.useQuery(
    { userId: user?.id ?? "" },
    { enabled: Boolean(user?.id) }
  );
  const { data: following = [] } = trpc.user.following.useQuery(
    { userId: user?.id ?? "" },
    { enabled: Boolean(user?.id) }
  );
  const { data: suggested = [] } = trpc.user.suggestedFollows.useQuery(undefined, { enabled: Boolean(user?.id) });

  const refreshGraph = async () => {
    await Promise.all([
      utils.user.followers.invalidate(),
      utils.user.following.invalidate(),
      utils.user.suggestedFollows.invalidate(),
      utils.notifications.unreadCount.invalidate(),
    ]);
  };

  const followMutation = trpc.user.follow.useMutation({
    onSuccess: async result => {
      if (result.created) toast.success("Following");
      await refreshGraph();
    },
    onError: error => toast.error(error.message),
  });
  const unfollowMutation = trpc.user.unfollow.useMutation({
    onSuccess: async () => {
      toast.success("Unfollowed");
      await refreshGraph();
    },
    onError: error => toast.error(error.message),
  });

  const followingIds = useMemo(
    () => new Set(following.map(connection => String(connection.id))),
    [following]
  );

  const handleToggleFollow = (userId: string) => {
    if (followingIds.has(userId)) unfollowMutation.mutate({ userId });
    else followMutation.mutate({ userId });
  };

  const tabs = [
    { id: "suggested" as const, label: "Suggested", icon: Zap, data: suggested },
    { id: "followers" as const, label: "Followers", icon: Users, data: followers },
    { id: "following" as const, label: "Following", icon: UserCheck, data: following },
  ];
  const currentTab = tabs.find(item => item.id === tab)!;
  const isMutating = followMutation.isPending || unfollowMutation.isPending;

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/40 via-[#050508] to-purple-950/30 py-12">
        <div className="container relative z-10 mx-auto max-w-3xl px-4">
          <button onClick={() => navigate(-1 as any)} className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20"><Network className="h-5 w-5 text-indigo-400" /></div>
            <h1 className="rainbow-text text-3xl font-black">Social Graph</h1>
          </div>
          <p className="text-muted-foreground">Your real follower graph from the SKYCOIN4444 database.</p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            {[
              { label: "Followers", value: followers.length, icon: Users, color: "text-purple-400" },
              { label: "Following", value: following.length, icon: UserCheck, color: "text-cyan-400" },
              { label: "Suggested", value: suggested.length, icon: Star, color: "text-amber-400" },
            ].map(stat => {
              const Icon = stat.icon;
              return <div key={stat.label} className="flex items-center gap-2"><Icon className={`h-4 w-4 ${stat.color}`} /><span className={`text-lg font-black ${stat.color}`}>{stat.value}</span><span className="text-xs text-muted-foreground">{stat.label}</span></div>;
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        {!user ? (
          <div className="py-20 text-center text-muted-foreground">Sign in to view your social graph.</div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
              {tabs.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === item.id ? "border border-indigo-500/30 bg-indigo-500/20 text-indigo-300" : "text-muted-foreground hover:bg-white/5 hover:text-white"}`}
                  >
                    <Icon className="h-4 w-4" />{item.label}<span className="text-xs opacity-60">({item.data.length})</span>
                  </button>
                );
              })}
            </div>

            {currentTab.data.length === 0 ? (
              <div className="py-16 text-center"><Network className="mx-auto mb-3 h-12 w-12 text-muted-foreground opacity-30" /><div className="text-muted-foreground">{tab === "followers" ? "No followers yet." : tab === "following" ? "Not following anyone yet." : "No suggestions available right now."}</div></div>
            ) : (
              <div className="space-y-2">
                {currentTab.data.map(connection => (
                  <UserCard
                    key={connection.id}
                    user={connection as SocialUser}
                    isFollowing={followingIds.has(String(connection.id))}
                    onToggleFollow={handleToggleFollow}
                    disabled={isMutating}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
