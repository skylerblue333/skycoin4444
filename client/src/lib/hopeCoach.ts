export type HopeFocus = "build" | "learn" | "play" | "ship";

export type HopeActivitySummary = Readonly<{
  lessons: number;
  posts: number;
  feedback: number;
  other: number;
}>;

export type HopePlanStep = Readonly<{
  id: string;
  title: string;
  detail: string;
  href: string;
  minutes: number;
}>;

export type HopePlan = Readonly<{
  title: string;
  summary: string;
  focus: HopeFocus;
  sprintMinutes: number;
  steps: readonly HopePlanStep[];
  coachNote: string;
  provenance: "deterministic-local-planner";
}>;

const FOCUS_LABELS: Record<HopeFocus, string> = {
  build: "Build",
  learn: "Learn",
  play: "Play",
  ship: "Ship",
};

function clampGoal(goal: string) {
  return goal.trim().replace(/\s+/g, " ").slice(0, 500);
}

function keywordRoute(goal: string): HopePlanStep | null {
  const normalized = goal.toLowerCase();

  if (/game|gaming|arcade|rush|quiz|chess|play/.test(normalized)) {
    return {
      id: "goal-game",
      title: "Turn the goal into a playable loop",
      detail:
        "Open Gaming, pick one deterministic game, and test the loop before adding rewards or multiplayer claims.",
      href: "/gaming",
      minutes: 12,
    };
  }

  if (/school|course|learn|lesson|study|quiz|teach/.test(normalized)) {
    return {
      id: "goal-learn",
      title: "Convert the goal into one learning milestone",
      detail:
        "Open SkySchool, choose one authored lesson, answer its check, and persist completion if signed in.",
      href: "/sky-school",
      minutes: 15,
    };
  }

  if (/social|post|community|feed|creator/.test(normalized)) {
    return {
      id: "goal-social",
      title: "Test the social feedback loop",
      detail:
        "Publish one concise beta update, then inspect the persisted record in Activity Evidence.",
      href: "/activity-feed",
      minutes: 10,
    };
  }

  if (/profile|privacy|account|identity/.test(normalized)) {
    return {
      id: "goal-profile",
      title: "Tighten the account-owned surface",
      detail:
        "Review Profile and Privacy Center, save one deliberate setting, and confirm it appears in account evidence.",
      href: "/profile",
      minutes: 10,
    };
  }

  return null;
}

function activityPriority(
  activity: HopeActivitySummary
): HopePlanStep {
  if (activity.lessons === 0) {
    return {
      id: "activity-learning",
      title: "Create your first durable learning record",
      detail:
        "Complete one SkySchool lesson so the beta has real learning evidence instead of a simulated progress bar.",
      href: "/course-catalog",
      minutes: 15,
    };
  }

  if (activity.posts === 0) {
    return {
      id: "activity-social",
      title: "Create one real community record",
      detail:
        "Publish a short build note to the persisted social feed, then inspect it in Activity Evidence.",
      href: "/activity-feed",
      minutes: 8,
    };
  }

  if (activity.feedback === 0) {
    return {
      id: "activity-feedback",
      title: "Close the tester loop",
      detail:
        "Submit one structured feedback report from the screen you are testing so the current route is attached.",
      href: "/beta-feedback",
      minutes: 8,
    };
  }

  return {
    id: "activity-evidence",
    title: "Review what is actually persisted",
    detail:
      "Open Activity Evidence and pick the weakest real workflow for the next iteration instead of chasing vanity metrics.",
    href: "/activity-evidence",
    minutes: 6,
  };
}

function focusStep(focus: HopeFocus): HopePlanStep {
  switch (focus) {
    case "learn":
      return {
        id: "focus-learn",
        title: "Run a learn → recall → play cycle",
        detail:
          "Finish one authored lesson, then use Crypto Quiz or Sky Rush as a short retrieval break.",
        href: "/sky-school",
        minutes: 18,
      };
    case "play":
      return {
        id: "focus-play",
        title: "Run one replayable skill session",
        detail:
          "Play Sky Rush or another deterministic arcade module, then note one friction point instead of chasing fake rewards.",
        href: "/game-sky-rush",
        minutes: 10,
      };
    case "ship":
      return {
        id: "focus-ship",
        title: "Walk the tester path like a release candidate",
        detail:
          "Start at Dashboard, complete one real action, then submit feedback with the affected route attached.",
        href: "/dashboard",
        minutes: 12,
      };
    default:
      return {
        id: "focus-build",
        title: "Build the smallest visible improvement",
        detail:
          "Choose one current screen, improve one real interaction, and verify it through the persisted beta path.",
        href: "/beta-workspace",
        minutes: 12,
      };
  }
}

export function summarizeHopeActivity(
  events: ReadonlyArray<{ type: string }>
): HopeActivitySummary {
  return events.reduce<HopeActivitySummary>(
    (summary, event) => {
      if (event.type === "lesson_completed") {
        return { ...summary, lessons: summary.lessons + 1 };
      }
      if (event.type === "post_created") {
        return { ...summary, posts: summary.posts + 1 };
      }
      if (event.type === "feedback_submitted") {
        return { ...summary, feedback: summary.feedback + 1 };
      }
      return { ...summary, other: summary.other + 1 };
    },
    { lessons: 0, posts: 0, feedback: 0, other: 0 }
  );
}

export function createHopePlan(input: {
  goal: string;
  focus: HopeFocus;
  activity: HopeActivitySummary;
}): HopePlan {
  const goal = clampGoal(input.goal);
  const goalStep = goal ? keywordRoute(goal) : null;
  const steps = [
    goalStep,
    focusStep(input.focus),
    activityPriority(input.activity),
  ].filter((step): step is HopePlanStep => Boolean(step));

  const unique = Array.from(
    new Map(steps.map(step => [step.id, step])).values()
  ).slice(0, 3);

  const sprintMinutes = unique.reduce(
    (sum, step) => sum + step.minutes,
    0
  );

  return Object.freeze({
    title: goal
      ? `${FOCUS_LABELS[input.focus]} sprint: ${goal}`
      : `${FOCUS_LABELS[input.focus]} sprint for the current beta`,
    summary:
      "A deterministic next-step plan generated from your focus, typed goal, and account-owned activity evidence.",
    focus: input.focus,
    sprintMinutes,
    steps: Object.freeze(unique),
    coachNote:
      "HopeAI Coach in this beta is a deterministic planner. It does not call an external model, infer emotions, or claim model-generated intelligence.",
    provenance: "deterministic-local-planner",
  });
}
