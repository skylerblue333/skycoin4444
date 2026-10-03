export type EcosystemJourneyMetrics = Readonly<{
  socialPosts: number;
  lessonsCompleted: number;
  arcadePlays: number;
  charityPledges: number;
  volunteerMinutes: number;
}>;

export type EcosystemJourneyMission = Readonly<{
  id: "social" | "learn" | "play" | "impact";
  label: string;
  route: string;
  complete: boolean;
  evidence: string;
}>;

export type EcosystemJourney = Readonly<{
  contract: "sky.ecosystem.journey.v1";
  completionPercent: number;
  completedCount: number;
  totalCount: number;
  missions: readonly EcosystemJourneyMission[];
  nextMission: EcosystemJourneyMission;
  hopeAI: Readonly<{
    route: "/hope-a-i";
    role: "assist-across-ecosystem";
    persistedCompletionTracked: false;
  }>;
}>;

function nonNegativeInteger(value: number): number {
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

export function buildEcosystemJourney(
  input: EcosystemJourneyMetrics,
): EcosystemJourney {
  const metrics = {
    socialPosts: nonNegativeInteger(input.socialPosts),
    lessonsCompleted: nonNegativeInteger(input.lessonsCompleted),
    arcadePlays: nonNegativeInteger(input.arcadePlays),
    charityPledges: nonNegativeInteger(input.charityPledges),
    volunteerMinutes: nonNegativeInteger(input.volunteerMinutes),
  };

  const missions: EcosystemJourneyMission[] = [
    {
      id: "social",
      label: "Share one real update",
      route: "/activity-feed",
      complete: metrics.socialPosts > 0,
      evidence: metrics.socialPosts + " persisted post" + (metrics.socialPosts === 1 ? "" : "s"),
    },
    {
      id: "learn",
      label: "Complete one SkySchool lesson",
      route: "/sky-school",
      complete: metrics.lessonsCompleted > 0,
      evidence:
        metrics.lessonsCompleted +
        " completed lesson" +
        (metrics.lessonsCompleted === 1 ? "" : "s"),
    },
    {
      id: "play",
      label: "Play one flagship game",
      route: "/gaming",
      complete: metrics.arcadePlays > 0,
      evidence: metrics.arcadePlays + " synced arcade play" + (metrics.arcadePlays === 1 ? "" : "s"),
    },
    {
      id: "impact",
      label: "Record one SkyHope impact action",
      route: "/charity",
      complete: metrics.charityPledges > 0 || metrics.volunteerMinutes >= 15,
      evidence:
        metrics.charityPledges +
        " pledge" +
        (metrics.charityPledges === 1 ? "" : "s") +
        " · " +
        metrics.volunteerMinutes +
        " volunteer min",
    },
  ];

  const completedCount = missions.filter(mission => mission.complete).length;
  const nextMission =
    missions.find(mission => !mission.complete) ?? missions[0];

  return Object.freeze({
    contract: "sky.ecosystem.journey.v1",
    completionPercent: Math.round((completedCount / missions.length) * 100),
    completedCount,
    totalCount: missions.length,
    missions: Object.freeze(missions),
    nextMission,
    hopeAI: Object.freeze({
      route: "/hope-a-i",
      role: "assist-across-ecosystem",
      persistedCompletionTracked: false,
    }),
  });
}
