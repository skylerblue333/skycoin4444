import React, { Suspense, lazy } from "react";
import { Navigation } from "@/components/Navigation";
import { BottomTabBar } from "@/components/BottomTabBar";
import { PriceTicker } from "@/components/PriceTicker";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Redirect, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardLayoutSkeleton from "@/components/DashboardLayoutSkeleton";

// Lazy load all pages
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ComprehensiveEcosystemLanding = lazy(() => import("./pages/ComprehensiveEcosystemLanding"));
const HopeAIPage = lazy(() => import("./pages/HopeAIPage"));
const CryptoEnhancementsPage = lazy(() => import("./pages/CryptoEnhancementsPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const WalkthroughPage = lazy(() => import("./pages/WalkthroughPage"));

const App = () => {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return <DashboardLayoutSkeleton />;
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Top Navigation */}
            {location !== "/" && <Navigation />}
            
            {/* Price Ticker */}
            <PriceTicker />

            {/* Main Content */}
            <main className="flex-1">
              <Suspense fallback={<DashboardLayoutSkeleton />}>
                <Switch>
                  {/* Public Routes */}
                  <Route path="/" component={ComprehensiveEcosystemLanding} />
                  <Route path="/landing" component={LandingPage} />
                  <Route path="/walkthrough" component={WalkthroughPage} />
                  <Route path="/hope-ai" component={HopeAIPage} />
                  <Route path="/crypto" component={CryptoEnhancementsPage} />

                  {/* Protected Routes */}
                  {user && (
                    <>
                      <Route path="/dashboard" component={Dashboard} />
                    </>
                  )}

                  {/* 404 */}
                  <Route component={NotFound} />
                </Switch>
              </Suspense>
            </main>

            {/* Bottom Navigation */}
            <MobileBottomNav />
            <BottomTabBar />

            {/* Toast Notifications */}
            <Toaster />
          </div>
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
