import { lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary, ScreenLoadingFallback } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import LegacyRouteSwitch from "./routes/LegacyRouteSwitch";

const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BetaAreaCatalog = lazy(() => import("./pages/BetaAreaCatalog"));
const BetaJourney = lazy(() => import("./pages/BetaJourney"));
const BetaCommerceSandbox = lazy(() => import("./pages/BetaCommerceSandbox"));
const BetaWeb3Sandbox = lazy(() => import("./pages/BetaWeb3Sandbox"));
const BetaFeedback = lazy(() => import("./pages/BetaFeedback"));
const BetaWorkspace = lazy(() => import("./pages/BetaWorkspace"));
const OperationalReadiness = lazy(() => import("./pages/OperationalReadiness"));
const RouteHealth = lazy(() => import("./pages/RouteHealth"));
const DiscoveryCenter = lazy(() => import("./pages/DiscoveryCenter"));
const ImpactHub = lazy(() => import("./pages/ImpactHub"));
const BetaNavigation = lazy(() => import("./components/BetaNavigation"));
const GlobalExperienceRuntime = lazy(() => import("./components/GlobalExperienceRuntime"));

function Router() {
  return (
    <Suspense fallback={<ScreenLoadingFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/beta-workspace" component={BetaWorkspace} />
        <Route path="/operational-readiness" component={OperationalReadiness} />
        <Route path="/route-health" component={RouteHealth} />
        <Route path="/discovery-center" component={DiscoveryCenter} />
        <Route path="/impact-hub" component={ImpactHub} />
        <Route path="/beta-catalog" component={BetaAreaCatalog} />
        <Route path="/beta-journey" component={BetaJourney} />
        <Route path="/beta-commerce" component={BetaCommerceSandbox} />
        <Route path="/beta-web3" component={BetaWeb3Sandbox} />
        <Route path="/beta-feedback" component={BetaFeedback} />
        <Route path="/not-found" component={NotFound} />
        <Route path="/404" component={NotFound} />
        {/* Large legacy route catalog is partitioned and loaded by path bucket. */}
        <Route component={LegacyRouteSwitch} />
      </Switch>
    </Suspense>
  );
}

function GlobalNavigation() {
  const [location] = useLocation();
  // Live owns the developed ecosystem shell (sidebar plus responsive nav).
  // Do not render the generic beta chrome on top of that surface.
  return location === "/live" ? null : <BetaNavigation />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Suspense fallback={null}>
            <GlobalExperienceRuntime />
          </Suspense>
          <Suspense fallback={null}>
            <GlobalNavigation />
          </Suspense>
          <div id="sky4444-route-content" tabIndex={-1}>
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
