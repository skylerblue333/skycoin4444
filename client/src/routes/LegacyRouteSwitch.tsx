import { lazy, Suspense, type ComponentType } from "react";
import { useLocation } from "wouter";
import { ScreenLoadingFallback } from "@/components/ErrorBoundary";

const LegacyRoutesAF = lazy(() => import("./legacy/LegacyRoutesAF"));
const LegacyRoutesGL = lazy(() => import("./legacy/LegacyRoutesGL"));
const LegacyRoutesMR = lazy(() => import("./legacy/LegacyRoutesMR"));
const LegacyRoutesSZ = lazy(() => import("./legacy/LegacyRoutesSZ"));
const LegacyRoutesOther = lazy(() => import("./legacy/LegacyRoutesOther"));

type LegacyBucket = ComponentType;

export function selectLegacyRouteBucket(pathname: string): LegacyBucket {
  const first = pathname.replace(/^\/+/, "").charAt(0).toLowerCase();
  if (first >= "a" && first <= "f") return LegacyRoutesAF;
  if (first >= "g" && first <= "l") return LegacyRoutesGL;
  if (first >= "m" && first <= "r") return LegacyRoutesMR;
  if (first >= "s" && first <= "z") return LegacyRoutesSZ;
  return LegacyRoutesOther;
}

export default function LegacyRouteSwitch() {
  const [location] = useLocation();
  const Bucket = selectLegacyRouteBucket(location);

  return (
    <Suspense fallback={<ScreenLoadingFallback />}>
      <Bucket />
    </Suspense>
  );
}
