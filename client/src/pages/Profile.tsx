/*
 * Account surface: typed identity retrieval plus authorized profile/privacy
 * updates. No synthetic metrics or unsupported media claims.
 */
import { useEffect, useState } from "react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, UserRound } from "lucide-react";

type Visibility = "public" | "members" | "private";

export default function Profile() {
  const { user, loading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const profile = trpc.user.profile.useQuery(user ? { userId: user.id } : undefined, { enabled: Boolean(user) });
  const updateProfile = trpc.user.updateProfile.useMutation({ onSuccess: async () => { await utils.user.profile.invalidate(); } });
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");

  useEffect(() => {
    if (!profile.data) return;
    setName(profile.data.name ?? "");
    setUsername(profile.data.username ?? "");
    setBio(profile.data.bio ?? "");
    setVisibility(profile.data.profileVisibility as Visibility);
  }, [profile.data]);

  if (loading) return <main className="min-h-screen p-8">Loading account state…</main>;
  if (!isAuthenticated || !user) return <main className="flex min-h-screen items-center justify-center p-8"><Card className="w-full max-w-md"><CardHeader><CardTitle>Account profile</CardTitle><CardDescription>Sign in to manage your identity and privacy settings.</CardDescription></CardHeader><CardContent><Button className="w-full" onClick={() => startLogin()}>Sign in</Button></CardContent></Card></main>;

  const save = () => updateProfile.mutate({ name: name.trim(), username: username.trim(), bio: bio.trim() || null, profileVisibility: visibility });

  return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-3xl space-y-6"><header className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary"><UserRound className="h-5 w-5" /></span><div><div className="flex items-center gap-2"><h1 className="text-3xl font-bold">Your profile</h1><Badge variant="outline">Live account</Badge></div><p className="mt-1 text-sm text-muted-foreground">Manage the identity other beta members can see.</p></div></header>
    <Card><CardHeader><CardTitle>Identity</CardTitle><CardDescription>These fields are stored against your authenticated account.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2 text-sm font-medium">Display name<Input value={name} maxLength={255} onChange={(event) => setName(event.target.value)} /></label><label className="space-y-2 text-sm font-medium">Username<Input value={username} maxLength={64} onChange={(event) => setUsername(event.target.value)} /></label></div><label className="block space-y-2 text-sm font-medium">Bio<Textarea value={bio} maxLength={255} onChange={(event) => setBio(event.target.value)} placeholder="A short description of what you are building." /></label><div className="flex items-center justify-between gap-4"><span className="text-xs text-muted-foreground">{bio.length}/255</span><Button disabled={!name.trim() || !username.trim() || updateProfile.isPending} onClick={save}>{updateProfile.isPending ? "Saving…" : "Save profile"}</Button></div>{updateProfile.isSuccess && <p className="text-sm text-emerald-600">Profile saved.</p>}{updateProfile.error && <p className="text-sm text-destructive">{updateProfile.error.message}</p>}</CardContent></Card>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Privacy</CardTitle><CardDescription>Choose how your profile is presented to other authenticated users.</CardDescription></CardHeader><CardContent className="space-y-4"><label className="block space-y-2 text-sm font-medium">Profile visibility<select value={visibility} onChange={(event) => setVisibility(event.target.value as Visibility)} className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"><option value="public">Public — name, bio, and username visible</option><option value="members">Members — reserved for the members policy</option><option value="private">Private — redact profile details from other viewers</option></select></label><p className="text-sm leading-6 text-muted-foreground">Your own profile remains visible to you. Private profiles redact public identity fields and follower counts for other viewers.</p></CardContent></Card>
  </div></main>;
}
