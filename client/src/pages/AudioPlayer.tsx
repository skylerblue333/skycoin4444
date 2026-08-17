import { useMemo, useState } from "react";
import {
  Headphones,
  Info,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const tracks = [
  {
    id: "track-1",
    title: "Skyline introduction",
    creator: "Skycoin preview library",
    duration: "03:42",
    category: "Orientation",
  },
  {
    id: "track-2",
    title: "Focus session",
    creator: "Skycoin preview library",
    duration: "12:08",
    category: "Learning",
  },
  {
    id: "track-3",
    title: "Community notes",
    creator: "Skycoin preview library",
    duration: "05:16",
    category: "Community",
  },
];

export default function AudioPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const track = tracks[trackIndex];
  const progressLabel = useMemo(
    () => `${Math.round(progress)}% preview position`,
    [progress]
  );
  const selectTrack = (index: number) => {
    setTrackIndex(index);
    setProgress(0);
    setPlaying(false);
    toast.success("Preview track selected", {
      description: "No audio source is connected in this screen.",
    });
  };
  const reset = () => {
    setTrackIndex(0);
    setPlaying(false);
    setProgress(0);
    setVolume(70);
    toast.success("Player preview reset");
  };
  const togglePlaying = () => {
    setPlaying(value => !value);
    toast.info(playing ? "Preview paused" : "Playback preview enabled", {
      description:
        "Audio playback remains unavailable until a verified source is connected.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {playing ? "Playback preview enabled" : "Playback preview paused"}.{" "}
          {progressLabel}.
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Headphones className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Audio player
                </h1>
                <Badge variant="secondary">Preview</Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Explore player states and metadata without implying that an
                audio stream is available.
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={reset} className="gap-2 self-start">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset preview
          </Button>
        </header>
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardContent className="flex gap-3 p-4 text-sm">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
              aria-hidden="true"
            />
            <p className="leading-5 text-foreground/75">
              <strong className="font-medium text-foreground">
                No audio source connected.
              </strong>{" "}
              The controls below demonstrate local player states only. This
              screen does not stream, download, or report completed playback.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-blue-700 p-8 text-primary-foreground">
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-white/15 p-4">
                  <Headphones className="h-8 w-8" aria-hidden="true" />
                </div>
                <Badge className="border-white/20 bg-white/15 text-white">
                  Metadata only
                </Badge>
              </div>
              <p className="mt-12 text-sm text-primary-foreground/75">
                Now selected
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{track.title}</h2>
              <p className="mt-1 text-sm text-primary-foreground/75">
                {track.creator} · {track.category}
              </p>
            </div>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Slider
                  value={[progress]}
                  max={100}
                  step={1}
                  onValueChange={values => setProgress(values[0] ?? 0)}
                  aria-label="Preview playback position"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progressLabel}</span>
                  <span>{track.duration}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    selectTrack(
                      (trackIndex + tracks.length - 1) % tracks.length
                    )
                  }
                  aria-label="Previous preview track"
                >
                  <SkipBack className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={togglePlaying}
                  aria-label={
                    playing ? "Pause playback preview" : "Play playback preview"
                  }
                >
                  {playing ? (
                    <Pause className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Play className="h-5 w-5" aria-hidden="true" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => selectTrack((trackIndex + 1) % tracks.length)}
                  aria-label="Next preview track"
                >
                  <SkipForward className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Volume2
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={values => setVolume(values[0] ?? 0)}
                  aria-label="Preview volume"
                />
                <span className="w-8 text-right text-xs text-muted-foreground">
                  {volume}%
                </span>
              </div>
            </CardContent>
          </Card>
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preview library</CardTitle>
                <CardDescription>
                  {tracks.length} metadata-only sample tracks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {tracks.map((item, index) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => selectTrack(index)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${track.id === item.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                    aria-pressed={track.id === item.id}
                  >
                    <div className="rounded-md bg-muted p-2 text-muted-foreground">
                      <Headphones className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.category} · {item.duration}
                      </p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  When audio is connected
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Real playback should disclose the source, loading state,
                  buffering, errors, and whether data is being downloaded.
                </p>
                <p>
                  This preview intentionally keeps controls local and never
                  claims that audio has played.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
