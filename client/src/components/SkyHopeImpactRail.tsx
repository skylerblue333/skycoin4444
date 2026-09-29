import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Gamepad2,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ImpactContext = "education" | "gaming" | "charity";

const contextCopy: Record<
  ImpactContext,
  { eyebrow: string; title: string; detail: string }
> = {
  education: {
    eyebrow: "Service learning",
    title: "Turn a lesson into one useful community action.",
    detail:
      "Use SkyHope to convert learning into a bounded volunteer, resource, or digital-help plan. Completion is not counted as charity impact until the real-world action is independently verified.",
  },
  gaming: {
    eyebrow: "Play with purpose",
    title: "Games can prompt an action without pretending points are money.",
    detail:
      "Use a game as a themed challenge, then choose a real-world action in SkyHope. Scores, Sparks, XP, chips, and demo credits never become donations or financial value.",
  },
  charity: {
    eyebrow: "Impact loop",
    title: "Plan, learn, play, verify.",
    detail:
      "SkyHope connects practical action planning with SkySchool, Gaming, and HopeAI while keeping money movement and real-world claims outside the unverified beta boundary.",
  },
};

export default function SkyHopeImpactRail({
  context,
}: {
  context: ImpactContext;
}) {
  const copy = contextCopy[context];

  return (
    <section className="rounded-[2rem] border border-emerald-300/15 bg-gradient-to-br from-emerald-300/[0.055] via-white/[0.025] to-violet-300/[0.04] p-5 text-white sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-300/12 text-emerald-100">
              <HeartHandshake className="mr-1 h-3.5 w-3.5" />
              {copy.eyebrow}
            </Badge>
            <Badge
              variant="outline"
              className="border-white/10 text-white/45"
            >
              No live donations
            </Badge>
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
            {copy.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/48">
            {copy.detail}
          </p>
        </div>

        <Link href="/charity">
          <Button size="lg">
            Open SkyHope
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link href="/sky-school">
          <Card className="h-full border-white/10 bg-black/20 text-white transition hover:border-blue-300/20">
            <CardHeader className="pb-2">
              <BookOpen className="h-5 w-5 text-blue-200" />
              <CardTitle className="text-base text-white">Learn</CardTitle>
              <CardDescription className="text-white/40">
                Build the skill before the action.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/gaming-for-charity">
          <Card className="h-full border-white/10 bg-black/20 text-white transition hover:border-violet-300/20">
            <CardHeader className="pb-2">
              <Gamepad2 className="h-5 w-5 text-violet-200" />
              <CardTitle className="text-base text-white">Play</CardTitle>
              <CardDescription className="text-white/40">
                Use game themes without fake financial rewards.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/hope-a-i">
          <Card className="h-full border-white/10 bg-black/20 text-white transition hover:border-amber-300/20">
            <CardHeader className="pb-2">
              <Bot className="h-5 w-5 text-amber-200" />
              <CardTitle className="text-base text-white">Think</CardTitle>
              <CardDescription className="text-white/40">
                Open HopeAI for coaching; verify external facts separately.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <Card className="mt-3 border-white/10 bg-black/20 text-white">
        <CardContent className="flex items-start gap-3 p-4 text-xs leading-5 text-white/38">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />
          SkyHope planning and device-local commitments are not proof of a donation,
          charity partnership, beneficiary verification, tax status, settlement, or
          measured real-world outcome.
        </CardContent>
      </Card>
    </section>
  );
}
