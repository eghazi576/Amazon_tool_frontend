import { Suspense, lazy, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Index from "./pages/Index.tsx";
import FAQ from "./pages/FAQ.tsx";
import Privacy from "./pages/legal/Privacy.tsx";
import Terms from "./pages/legal/Terms.tsx";
import Cookies from "./pages/legal/Cookies.tsx";
import CompareIndex from "./pages/compare/CompareIndex.tsx";
import ComparePage from "./pages/compare/ComparePage.tsx";
import BestWholesaleTools from "./pages/guides/BestWholesaleTools.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import NotFound from "./pages/NotFound.tsx";

// The public marketing routes stay eagerly imported: they are prerendered and
// must paint without waiting on a second request.
//
// Everything behind RequireAuth/RequireAdmin is code-split. It is ~185 kB of
// source and pulls in recharts, none of which a visitor reading the homepage
// will ever execute. Splitting it keeps that weight out of the entry chunk.
const DashboardLayout   = lazy(() => import("./components/dashboard/DashboardLayout.tsx"));
const Overview          = lazy(() => import("./pages/dashboard/Overview.tsx"));
const ProductResearch   = lazy(() => import("./pages/dashboard/ProductResearch.tsx"));
const HistoryPage       = lazy(() => import("./pages/dashboard/History.tsx"));
const ReportsPage       = lazy(() => import("./pages/dashboard/Reports.tsx"));
const BrandIntelligence = lazy(() => import("./pages/dashboard/BrandIntelligence.tsx"));
const AdminDashboard    = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AIInsights = lazy(() => import("./pages/dashboard/Stubs.tsx").then((m) => ({ default: m.AIInsights })));
const Settings   = lazy(() => import("./pages/dashboard/Settings.tsx"));

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/sign-in" replace />;
  return children;
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user?.isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestOnly({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

/**
 * Entry animations are suppressed on the first paint of a prerendered route,
 * whose content is already on screen (index.css, `html[data-prerendered]`).
 * Once the user navigates, pages are built by React from nothing and should
 * animate in as designed, so drop the flag on the first route change.
 */
function ReleasePrerenderedAnimations() {
  const { pathname } = useLocation();
  const initial = useRef(pathname);

  useEffect(() => {
    if (pathname !== initial.current) {
      delete document.documentElement.dataset.prerendered;
    }
  }, [pathname]);

  return null;
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ReleasePrerenderedAnimations />
          {/* fallback={null} matches what RequireAuth already renders while the
              session resolves, so a lazy chunk loading looks no different. */}
          <Suspense fallback={null}>
          <Routes>
            <Route path="/"                element={<Index />} />
            <Route path="/faq"             element={<FAQ />} />
            <Route path="/privacy"         element={<Privacy />} />
            <Route path="/terms"           element={<Terms />} />
            <Route path="/cookies"         element={<Cookies />} />
            <Route path="/compare"         element={<CompareIndex />} />
            <Route path="/compare/:slug"   element={<ComparePage />} />
            <Route path="/best-amazon-wholesale-tools" element={<BestWholesaleTools />} />
            <Route path="/sign-in"         element={<GuestOnly><SignIn /></GuestOnly>} />
            <Route path="/sign-up"         element={<GuestOnly><SignUp /></GuestOnly>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password"  element={<GuestOnly><ResetPassword /></GuestOnly>} />
            <Route
              path="/dashboard"
              element={<RequireAuth><DashboardLayout /></RequireAuth>}
            >
              <Route index              element={<Overview />} />
              <Route path="research"    element={<ProductResearch />} />
              <Route path="history"     element={<HistoryPage />} />
              <Route path="brand"       element={<BrandIntelligence />} />
              <Route path="ai"          element={<AIInsights />} />
              <Route path="reports"     element={<ReportsPage />} />
              <Route path="settings"    element={<Settings />} />
            </Route>
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
