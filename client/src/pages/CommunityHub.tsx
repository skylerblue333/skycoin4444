import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Compass,
  Filter,
  Globe2,
  Heart,
  MessageCircle,
  RotateCcw,
  Search,
  Users,
  X,
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const STORAGE_KEY = "skycoin.community-hub-demo";
type DemoSpace = {
  id: string;
  name: string;
  description: string;
  category: "Education" | "Builders" | "Community";
  members: string;
  joined: boolean;
};
const defaults: DemoSpace[] = [
  {
    id: "demo-space-1",
    name: "SkySchool Study Circle",
    description:
      "A sample space for sharing course notes and learning prompts.",
    category: "Education",
    members: "Demo size",
    joined: false,
  },
  {
    id: "demo-space-2",
    name: "Builder Workshop",
    description:
      "A sample space for project feedback and implementation ideas.",
    category: "Builders",
    members: "Demo size",
    joined: true,
  },
  {
    id: "demo-space-3",
    name: "Community Welcome",
    description: "A sample space for introductions and platform orientation.",
    category: "Community",
    members: "Demo size",
    joined: false,
  },
];

function readSpaces(): DemoSpace[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return defaults;
    return parsed.filter(
      (value): value is DemoSpace =>
        Boolean(value) &&
        typeof value === "object" &&
        typeof (value as DemoSpace).id === "string" &&
        typeof (value as DemoSpace).name === "string" &&
        typeof (value as DemoSpace).description === "string" &&
        ((value as DemoSpace).category === "Education" ||
          (value as DemoSpace).category === "Builders" ||
          (value as DemoSpace).category === "Community") &&
        typeof (value as DemoSpace).members === "string" &&
        typeof (value as DemoSpace).joined === "boolean"
    );
  } catch {
    return defaults;
  }
}

export default function CommunityHub() {
  const [spaces, setSpaces] = useState<DemoSpace[]>(defaults);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DemoSpace["category"] | "All">(
    "All"
  );
  const [statusMessage, setStatusMessage] = useState(
    "Community examples are saved."
  );
  useEffect(() => {
    setSpaces(readSpaces());
  }, []);
  const filteredSpaces = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return spaces.filter(
      space =>
        (category === "All" || space.category === category) &&
        (!normalized ||
          `${space.name} ${space.description} ${space.category}`
            .toLowerCase()
            .includes(normalized))
    );
  }, [category, query, spaces]);
  const toggleJoin = (id: string) => {
    const next = spaces.map(space =>
      space.id === id ? { ...space, joined: !space.joined } : space
    );
    const changed = next.find(space => space.id === id);
    setSpaces(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setStatusMessage(
      changed?.joined
        ? `Joined the local example space ${changed.name}.`
        : `Left the local example space ${changed?.name ?? ""}.`
    );
    toast.success(
      changed?.joined ? "Joined example space" : "Left example space",
      {
        description:
          "This local demo action does not create a real membership.",
      }
    );
  };
  const reset = () => {
    setSpaces(defaults);
    setQuery("");
    setCategory("All");
    window.localStorage.removeItem(STORAGE_KEY);
    setStatusMessage("Community examples reset.");
    toast.success("Community examples reset");
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
              <Users className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Community hub
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Local
                  demo
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Explore sample spaces without implying live membership,
                synchronized posts, or real-time community activity.
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={reset} className="gap-2 self-start">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset examples
          </Button>
        </header>
        <Card className="border-sky-500/30 bg-sky-500/10">
          <CardContent className="flex gap-3 p-4 text-sm">
            <Globe2
              className="mt-0.5 h-4 w-4 shrink-0 text-sky-500"
              aria-hidden="true"
            />
            <p className="leading-5 text-foreground/75">
              <strong className="font-medium text-foreground">
                Local discovery preview.
              </strong>{" "}
              Spaces and membership states below are stored on this device.
              Joining an example does not create a real membership or send a
              notification.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <CardTitle>Discover spaces</CardTitle>
                <CardDescription>
                  {filteredSpaces.length} of {spaces.length} local examples
                  shown.
                </CardDescription>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Search examples"
                    aria-label="Search community examples"
                    className="pl-9 sm:w-56"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <select
                    value={category}
                    onChange={event =>
                      setCategory(
                        event.target.value as DemoSpace["category"] | "All"
                      )
                    }
                    aria-label="Filter community examples"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="All">All spaces</option>
                    <option value="Education">Education</option>
                    <option value="Builders">Builders</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSpaces.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredSpaces.map(space => (
                  <Card key={space.id} className="border-border/70">
                    <CardContent className="flex h-full flex-col gap-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                          <Compass className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <Badge variant={space.joined ? "default" : "outline"}>
                          {space.joined ? "Joined locally" : space.category}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">{space.name}</h3>
                        <p className="text-sm leading-5 text-muted-foreground">
                          {space.description}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-4">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MessageCircle
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          {space.members}
                        </span>
                        <Button
                          size="sm"
                          variant={space.joined ? "outline" : "default"}
                          onClick={() => toggleJoin(space.id)}
                          className="gap-2"
                        >
                          {space.joined ? (
                            <X className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Heart className="h-4 w-4" aria-hidden="true" />
                          )}
                          {space.joined ? "Leave" : "Join"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <Users
                  className="mx-auto h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />
                <h3 className="mt-3 font-medium">No matching spaces</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try another search or reset the local examples.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              When community integration is available
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Real spaces should load from authorized APIs, show clear
              membership states, and handle join failures or moderation rules
              explicitly.
            </p>
            <Separator />
            <p>
              This preview intentionally contains no live users, membership
              counts, post activity, or notification delivery.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
