import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Loader2,
  UserRound,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFileUpload } from "@/hooks/useFileUpload";
import { trpc } from "@/lib/trpc";

type ProfileForm = {
  name: string;
  username: string;
  bio: string;
};

const emptyForm: ProfileForm = {
  name: "",
  username: "",
  bio: "",
};

export default function ProfileEdit() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { upload, uploading } = useFileUpload();

  const profileQuery = trpc.user.me.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: async profile => {
      utils.user.me.setData(undefined, profile);
      await utils.auth.me.invalidate();
    },
  });

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }

    setForm({
      name: profileQuery.data.name ?? "",
      username: profileQuery.data.username ?? "",
      bio: profileQuery.data.bio ?? "",
    });
    setAvatarPreview(profileQuery.data.avatar ?? null);
  }, [profileQuery.data]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        name: form.name.trim(),
        username: form.username.trim().toLowerCase(),
        bio: form.bio.trim() || null,
      });
      toast.success("Profile saved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save your profile."
      );
    }
  };

  const handleAvatarChange = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    try {
      const result = await upload(file);
      const profile = await updateProfile.mutateAsync({ avatar: result.url });
      setAvatarPreview(profile.avatar ?? null);
      toast.success("Profile photo updated.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update your profile photo."
      );
    }
  };

  if (authLoading || (isAuthenticated && profileQuery.isLoading)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
        <Loader2
          className="h-6 w-6 animate-spin"
          aria-label="Loading profile editor"
        />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
        <div>
          <UserRound className="mx-auto mb-4 h-10 w-10 text-sky-400" />
          <h1 className="text-xl font-semibold">
            Sign in to edit your profile
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Your profile information is available only to the authenticated
            account holder.
          </p>
          <Link href="/">
            <Button className="mt-6">Return home</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
        <div>
          <h1 className="text-xl font-semibold">Profile unavailable</h1>
          <p className="mt-2 text-sm text-slate-300">
            {profileQuery.error?.message ?? "The profile could not be loaded."}
          </p>
          <Button
            className="mt-6"
            variant="outline"
            onClick={() => profileQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      </main>
    );
  }

  const isSaving = updateProfile.isPending || uploading;
  const initial = form.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-2xl">
        <Link href="/profile">
          <Button
            variant="ghost"
            className="mb-6 px-0 text-slate-300 hover:bg-transparent hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> View profile
          </Button>
        </Link>

        <Card className="border-slate-700 bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <UserRound className="h-5 w-5 text-sky-400" /> Edit profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section
              className="flex items-center gap-4"
              aria-label="Profile photo"
            >
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isSaving}
                className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-sky-400 bg-slate-800 text-3xl font-semibold text-white transition hover:border-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Change profile photo"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Current profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition hover:opacity-100">
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </span>
              </button>
              <div>
                <h2 className="font-medium text-white">Profile photo</h2>
                <p className="mt-1 text-sm text-slate-300">
                  PNG, JPEG, GIF, or WebP. Maximum 5 MB.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  disabled={isSaving}
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {uploading ? "Uploading…" : "Choose image"}
                </Button>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                className="hidden"
                onChange={event =>
                  void handleAvatarChange(event.target.files?.[0])
                }
              />
            </section>

            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="profile-name">Display name</Label>
                <Input
                  id="profile-name"
                  value={form.name}
                  maxLength={255}
                  disabled={isSaving}
                  onChange={event =>
                    setForm(current => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Your name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="profile-username">Username</Label>
                <Input
                  id="profile-username"
                  value={form.username}
                  maxLength={32}
                  disabled={isSaving}
                  onChange={event =>
                    setForm(current => ({
                      ...current,
                      username: event.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9_]/g, ""),
                    }))
                  }
                  placeholder="your_username"
                />
                <p className="text-xs text-slate-400">
                  Use 3–32 lowercase letters, numbers, or underscores.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="profile-bio">Bio</Label>
                <Textarea
                  id="profile-bio"
                  value={form.bio}
                  maxLength={255}
                  disabled={isSaving}
                  onChange={event =>
                    setForm(current => ({
                      ...current,
                      bio: event.target.value,
                    }))
                  }
                  placeholder="Tell people a little about yourself."
                />
                <p className="text-right text-xs text-slate-400">
                  {form.bio.length}/255
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-700 pt-5">
              <Button
                variant="outline"
                disabled={isSaving}
                onClick={() => profileQuery.refetch()}
              >
                Reset
              </Button>
              <Button
                disabled={
                  isSaving ||
                  !form.name.trim() ||
                  form.username.trim().length < 3
                }
                onClick={() => void handleSave()}
              >
                {updateProfile.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Save profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
