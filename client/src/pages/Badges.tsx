import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Check,
  Filter,
  LockKeyhole,
  RotateCcw,
  Sparkles,
  Users,
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
import { Progress } from "@/components/ui/progress";

const examples = [
  {
    id: "learn",
    title: "First lesson",
    description: "Complete a sample learning milestone.",
    category: "Learning",
    progress: 100,
    earned: true,
    icon: BookOpen,
  },
  {
    id: "builder",
    title: "Builder path",
    description: "Explore the sample project-building path.",
    category: "Progress",
    progress: 64,
    earned: false,
    icon: Sparkles,
  },
  {
    id: "community",
    title: "Community welcome",
    description: "Participate in a sample community welcome flow.",
    category: "Community",
    progress: 35,
    earned: false,
    icon: Users,
  },
  {
    id: "explorer",
    title: "Ecosystem explorer",
    description: "Visit a set of sample ecosystem areas.",
    category: "Progress",
    progress: 78,
    earned: false,
    icon: Award,
  },
];

export default function Badges() {
  const [category, setCategory] = useState("All");
  const [statusMessage, setStatusMessage] = useState(
    "Badge examples are ready."
  );
  const categories = [
    "All",
    ...Array.from(new Set(examples.map(example => example.category))),
  ];
  const visible = useMemo(
    () =>
      category === "All"
        ? examples
        : examples.filter(example => example.category === category),
    [category]
  );
  const earned = examples.filter(example => example.earned).length;
  const reset = () => {
    setCategory("All");
    setStatusMessage("Badge filters reset.");
    toast.success("Badge filters reset");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Award className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Badges and achievements
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Local
                  preview
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Explore example milestones and progress states without mistaking
                a preview for a certification or earned reward.
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={reset} className="gap-2 self-start">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset filters
          </Button>
        </header>
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardContent className="flex gap-3 p-4 text-sm">
            <LockKeyhole
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
              aria-hidden="true"
            />
            <p className="leading-5 text-foreground/75">
              <strong className="font-medium text-foreground">
                Preview only.
              </strong>{" "}
              These are sample badge definitions and progress values. They are
              not user achievements, rewards, certifications, or proof of
              completed coursework.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <CardTitle>Achievement gallery</CardTitle>
                  <CardDescription>
                    {visible.length} of {examples.length} local examples shown.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Filter
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <select
                    value={category}
                    onChange={event => {
                      setCategory(event.target.value);
                      setStatusMessage(
                        `Showing ${event.target.value} badge examples.`
                      );
                    }}
                    aria-label="Filter badge examples"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {categories.map(value => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {visible.map(example => {
                const Icon = example.icon;
                return (
                  <Card key={example.id} className="border-border/70">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between">
                        <div
                          className={`rounded-xl p-3 ${example.earned ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <Badge variant={example.earned ? "default" : "outline"}>
                          {example.earned ? "Example earned" : "In progress"}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-medium">{example.title}</h3>
                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                          {example.description}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Preview progress</span>
                          <span>{example.progress}%</span>
                        </div>
                        <Progress
                          value={example.progress}
                          aria-label={`${example.title} preview progress`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
          <aside className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Progress snapshot</CardTitle>
                <CardDescription className="text-primary-foreground/75">
                  A local view of the example gallery.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">
                  {earned}{" "}
                  <span className="text-base font-normal text-primary-foreground/75">
                    of {examples.length} examples earned
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  How real achievements should work
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Real badges should be issued by a trusted service, tied to
                  verifiable events, and show clear criteria and issuer context.
                </p>
                <p>
                  Until those integrations exist, this screen intentionally
                  keeps all progress local and labeled as preview data.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
