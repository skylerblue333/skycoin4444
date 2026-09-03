import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Radio,
  Save,
  ShieldCheck,
  Square,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  emptyStreamStudioDraft,
  parseStreamStudioDraft,
  validateStreamStudioDraft,
  type StreamStudioDraft,
} from "@/lib/competitiveLabs";

const STORAGE_KEY = "sky4444.stream-studio-draft";

export default function LiveStreaming() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | undefined>(undefined);
  const [draft, setDraft] = useState<StreamStudioDraft>(emptyStreamStudioDraft);
  const [deviceState, setDeviceState] = useState<
    "idle" | "requesting" | "previewing" | "error"
  >("idle");
  const [deviceMessage, setDeviceMessage] = useState(
    "Camera and microphone access has not been requested."
  );
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const restored = parseStreamStudioDraft(localStorage.getItem(STORAGE_KEY));
    if (restored) setDraft(restored);
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const update = (patch: Partial<StreamStudioDraft>) => {
    setDraft(current => ({ ...current, ...patch }));
    setErrors([]);
    setSaved(false);
  };

  const stopPreview = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = undefined;
    if (videoRef.current) videoRef.current.srcObject = null;
    setDeviceState("idle");
    setDeviceMessage(
      "Preview stopped. No video or audio was uploaded or recorded."
    );
  };

  const startPreview = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setDeviceState("error");
      setDeviceMessage(
        "This browser does not expose camera and microphone preview access."
      );
      return;
    }
    setDeviceState("requesting");
    setDeviceMessage("Waiting for browser permission…");
    try {
      stopPreview();
      setDeviceState("requesting");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraEnabled(true);
      setMicrophoneEnabled(true);
      setDeviceState("previewing");
      setDeviceMessage(
        "Local device preview active. Media remains in this browser."
      );
    } catch (error) {
      setDeviceState("error");
      setDeviceMessage(
        error instanceof Error
          ? "Device preview unavailable: " + error.message
          : "Device preview unavailable."
      );
    }
  };

  const toggleCamera = () => {
    const next = !cameraEnabled;
    streamRef.current
      ?.getVideoTracks()
      .forEach(track => (track.enabled = next));
    setCameraEnabled(next);
  };

  const toggleMicrophone = () => {
    const next = !microphoneEnabled;
    streamRef.current
      ?.getAudioTracks()
      .forEach(track => (track.enabled = next));
    setMicrophoneEnabled(next);
  };

  const saveDraft = () => {
    const nextErrors = validateStreamStudioDraft(draft);
    setErrors(nextErrors);
    if (nextErrors.length) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        icon={Radio}
        title="Creator Live Studio"
        subtitle="Local device rehearsal and stream planning without a broadcast claim"
      />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <Card className="border-amber-400/30 bg-amber-400/[0.05]">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge
                variant="outline"
                className="border-amber-400/50 text-amber-700 dark:text-amber-200"
              >
                Local test lab
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                This page does not upload, broadcast, record, count viewers, run
                chat, sell subscriptions, or calculate creator revenue.
              </p>
            </div>
            <ShieldCheck className="h-7 w-7 shrink-0 text-amber-500" />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Camera and microphone rehearsal</CardTitle>
                  <CardDescription className="mt-1">
                    Browser permission is requested only when you start.
                  </CardDescription>
                </div>
                <Badge variant="outline">{deviceState}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  aria-label="Local camera preview"
                  className="h-full w-full object-cover"
                />
                {deviceState !== "previewing" && (
                  <div className="absolute inset-0 grid place-items-center text-center text-sm text-white/60">
                    <div>
                      <Camera className="mx-auto mb-2 h-8 w-8" />
                      Local preview is off
                    </div>
                  </div>
                )}
              </div>
              <p
                className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground"
                role="status"
              >
                {deviceMessage}
              </p>
              <div className="flex flex-wrap gap-2">
                {deviceState !== "previewing" ? (
                  <Button
                    type="button"
                    onClick={startPreview}
                    disabled={deviceState === "requesting"}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {deviceState === "requesting"
                      ? "Requesting access…"
                      : "Start local preview"}
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={toggleCamera}
                    >
                      {cameraEnabled ? (
                        <Camera className="mr-2 h-4 w-4" />
                      ) : (
                        <CameraOff className="mr-2 h-4 w-4" />
                      )}
                      Camera {cameraEnabled ? "on" : "off"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={toggleMicrophone}
                    >
                      {microphoneEnabled ? (
                        <Mic className="mr-2 h-4 w-4" />
                      ) : (
                        <MicOff className="mr-2 h-4 w-4" />
                      )}
                      Microphone {microphoneEnabled ? "on" : "off"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={stopPreview}
                    >
                      <Square className="mr-2 h-4 w-4" />
                      Stop preview
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stream brief</CardTitle>
              <CardDescription>
                Saved locally so a tester can restore the setup after refresh.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Title">
                <Input
                  value={draft.title}
                  onChange={event => update({ title: event.target.value })}
                  placeholder="What are you planning?"
                />
              </Field>
              <Field label="Category">
                <Input
                  value={draft.category}
                  onChange={event => update({ category: event.target.value })}
                  placeholder="Education, gaming, art…"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Language">
                  <Input
                    value={draft.language}
                    onChange={event => update({ language: event.target.value })}
                  />
                </Field>
                <Field label="Audience label">
                  <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={draft.audience}
                    onChange={event =>
                      update({
                        audience: event.target
                          .value as StreamStudioDraft["audience"],
                      })
                    }
                  >
                    <option value="private-test">Private test</option>
                    <option value="community">Community concept</option>
                    <option value="public">Public concept</option>
                  </select>
                </Field>
              </div>
              <Field label="Description">
                <Textarea
                  rows={4}
                  value={draft.description}
                  onChange={event =>
                    update({ description: event.target.value.slice(0, 500) })
                  }
                  placeholder="Opening, segment plan, and moderation notes"
                />
                <span className="text-xs text-muted-foreground">
                  {draft.description.length}/500
                </span>
              </Field>
              {errors.length > 0 && (
                <ul className="list-disc rounded-lg border border-destructive/40 bg-destructive/5 p-4 pl-8 text-sm text-destructive">
                  {errors.map(error => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              )}
              {saved && (
                <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-200">
                  Draft saved in this browser.
                </p>
              )}
              <Button type="button" onClick={saveDraft} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save local brief
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}
