import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseStaticRoutes } from "./lib/route-catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appPath = path.join(root, "client/src/App.tsx");
const manifestPath = path.join(root, "client/src/lib/v4Beta.ts");
const pagePath = path.join(root, "client/src/pages/V4Beta.tsx");
const workspacePath = path.join(root, "client/src/pages/BetaWorkspace.tsx");

const expectedFlagships = [
  {
    id: "social",
    route: "/activity-feed",
    source: "client/src/pages/ActivityFeed.tsx",
    contract: "tests/release/competitive-ecosystem-beta.test.ts",
  },
  {
    id: "gaming",
    route: "/gaming",
    source: "client/src/pages/Gaming.tsx",
    contract: "tests/release/arcade-passport-gaming.test.ts",
  },
  {
    id: "live",
    route: "/live",
    source: "client/src/pages/Live.tsx",
    contract: "tests/release/competitive-ecosystem-beta.test.ts",
  },
  {
    id: "commerce",
    route: "/beta-commerce",
    source: "client/src/pages/BetaCommerceSandbox.tsx",
    contract: "tests/release/v3-commerce-depth.test.ts",
  },
  {
    id: "learning",
    route: "/course-catalog",
    source: "client/src/pages/CourseCatalog.tsx",
    contract: "tests/release/v3-learning-continuity.test.ts",
  },
  {
    id: "ai",
    route: "/hope-a-i",
    source: "client/src/pages/HopeAI.tsx",
    contract: "tests/release/v3-hopeai-depth.test.ts",
  },
  {
    id: "web3",
    route: "/beta-web3",
    source: "client/src/pages/BetaWeb3Sandbox.tsx",
    contract: "tests/release/v3-web3-depth.test.ts",
  },
];

async function requireFile(relativePath, minimumBytes = 1) {
  const absolute = path.join(root, relativePath);
  const file = await stat(absolute);
  if (!file.isFile()) throw new Error(`V4 required path is not a file: ${relativePath}`);
  if (file.size < minimumBytes) {
    throw new Error(`V4 required file is unexpectedly small: ${relativePath} (${file.size} bytes)`);
  }
  return readFile(absolute, "utf8");
}

const [appSource, manifestSource, pageSource, workspaceSource] = await Promise.all([
  readFile(appPath, "utf8"),
  readFile(manifestPath, "utf8"),
  readFile(pagePath, "utf8"),
  readFile(workspacePath, "utf8"),
]);

const staticRoutes = new Set(parseStaticRoutes(appSource).map(route => route.path));
const failures = [];

if (!workspaceSource.includes('export { default } from "./V4Beta"')) {
  failures.push("/beta-workspace is not routed through the V4 command center component");
}

for (const phrase of [
  "V4 engineering beta",
  "Stop counting screens. Ship complete loops.",
  "V4 is not a production certification",
  "seven flagship experiences",
  "tester-confirmed browser-local state",
]) {
  if (!pageSource.includes(phrase)) failures.push(`V4 page is missing truth/product phrase: ${phrase}`);
}

for (const token of [
  "V4_TEST_SESSION_KEY",
  "v4Flagships",
  "v4Missions",
  "normalizeV4TestSession",
  "getV4MissionProgress",
]) {
  if (!manifestSource.includes(token)) failures.push(`V4 manifest is missing ${token}`);
}

for (const flagship of expectedFlagships) {
  if (!staticRoutes.has(flagship.route)) {
    failures.push(`V4 flagship ${flagship.id} points to an unregistered route: ${flagship.route}`);
  }
  if (!manifestSource.includes(`id: "${flagship.id}"`)) {
    failures.push(`V4 manifest is missing flagship id ${flagship.id}`);
  }
  if (!manifestSource.includes(`entryRoute: "${flagship.route}"`)) {
    failures.push(`V4 manifest does not bind ${flagship.id} to ${flagship.route}`);
  }

  const source = await requireFile(flagship.source, 1200);
  const contract = await requireFile(flagship.contract, 500);
  if (!/\b(expect|describe|it)\b/.test(contract)) {
    failures.push(`V4 release contract lacks test assertions: ${flagship.contract}`);
  }
  if (!source.includes("export default") && !source.includes("export function")) {
    failures.push(`V4 flagship source has no exported page surface: ${flagship.source}`);
  }
}

for (const boundaryPhrase of [
  "No real-money wagering",
  "No real sellers",
  "No accreditation",
  "No external model/provider claim",
  "No wallet connection",
  "Direct small-room WebRTC only",
]) {
  if (!manifestSource.includes(boundaryPhrase)) {
    failures.push(`V4 manifest is missing required limitation: ${boundaryPhrase}`);
  }
}

if (expectedFlagships.length !== 7) failures.push("V4 audit must cover exactly seven flagships");

if (failures.length) {
  console.error("SKYCOIN4444 V4 flagship release audit FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("SKYCOIN4444 V4 flagship release audit passed");
  console.log(`Flagships: ${expectedFlagships.length}`);
  console.log(`Guided evidence stages: ${expectedFlagships.length * 6}`);
  console.log("Launch surface: /beta-workspace -> V4Beta");
  console.log("Truth boundary: engineering beta; this audit is not production certification.");
}
