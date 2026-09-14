export type RouteHealthState = "working" | "controlled" | "recovery";

export interface RouteHealthEntry {
  id: string;
  area: string;
  route: string;
  state: RouteHealthState;
  evidence: string;
  recoveryRoute: string;
}

export const routeHealthRegistry: RouteHealthEntry[] = [
  { id: "home", area: "Home launchpad", route: "/", state: "working", evidence: "Launchpad, daily run, and recovery links are rendered locally.", recoveryRoute: "/" },
  { id: "social", area: "Social", route: "/activity-feed", state: "working", evidence: "Account-aware feed and composer are registered in the beta shell.", recoveryRoute: "/activity-feed" },
  { id: "learn", area: "Learn", route: "/course-catalog", state: "working", evidence: "Course catalog and authored modules are registered.", recoveryRoute: "/course-catalog" },
  { id: "school", area: "SkySchool", route: "/sky-school", state: "working", evidence: "Lesson journey and quiz routes are registered.", recoveryRoute: "/sky-school" },
  { id: "gaming", area: "Gaming", route: "/gaming", state: "working", evidence: "Gaming shell and Arcade route are registered.", recoveryRoute: "/gaming" },
  { id: "arcade", area: "Arcade Lab", route: "/arcade", state: "working", evidence: "Deterministic mini-game modes are available without real-money settlement.", recoveryRoute: "/arcade" },
  { id: "live", area: "SkyLive", route: "/live", state: "controlled", evidence: "Small-room WebRTC beta with explicit media and chat boundaries.", recoveryRoute: "/live" },
  { id: "shop", area: "SkyMarket", route: "/beta-commerce", state: "controlled", evidence: "Labeled fixture catalog and deterministic checkout rehearsal.", recoveryRoute: "/beta-commerce" },
  { id: "web3", area: "Digital Assets", route: "/beta-web3", state: "controlled", evidence: "Wallet and tipping education remain gated from custody and settlement.", recoveryRoute: "/beta-web3" },
  { id: "hopeai", area: "HopeAI", route: "/hope-a-i", state: "controlled", evidence: "Local AI workspace with speech input and persisted sprint recovery.", recoveryRoute: "/hope-a-i" },
  { id: "dating", area: "Dating", route: "/dating-profile-setup", state: "controlled", evidence: "Safety-first profile and discovery prototypes are bounded.", recoveryRoute: "/dating-profile-setup" },
  { id: "ops", area: "Operations", route: "/operational-readiness", state: "working", evidence: "Approved health and readiness endpoints are reported conservatively.", recoveryRoute: "/operational-readiness" },
];

export const routeHealthCounts = routeHealthRegistry.reduce((counts, entry) => {
  counts[entry.state] += 1;
  return counts;
}, { working: 0, controlled: 0, recovery: 0 } as Record<RouteHealthState, number>);
