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
import LegalInfo from "./pages/legal/LegalInfo.tsx";
import Privacy from "./pages/legal/Privacy.tsx";
import Terms from "./pages/legal/Terms.tsx";
import Cookies from "./pages/legal/Cookies.tsx";
import CompareIndex from "./pages/compare/CompareIndex.tsx";
import ComparePage from "./pages/compare/ComparePage.tsx";
import BestWholesaleTools from "./pages/guides/BestWholesaleTools.tsx";
import BlogIndex from "./pages/blog/BlogIndex.tsx";
import BlogPost from "./pages/blog/BlogPost.tsx";
import SignIn from "./pages/SignIn.tsx";
import PendingApproval from "./pages/PendingApproval.tsx";
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
  // Admins bypass; everyone else must be approved before using the tool. Render
  // the waiting screen inline (no dedicated /pending URL to 404 on hard refresh).
  if (!user.isAdmin && user.status !== "APPROVED") return <PendingApproval />;
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
 * Reset the scroll position to the top on every route change.
 *
 * Without this, a single-page app keeps the previous page's scroll offset when
 * you navigate. Clicking a footer link (Privacy, Terms) from the bottom of a
 * long page loaded the new page still scrolled to the bottom, so the reader had
 * to scroll up by hand. The browser does this automatically for real navigations;
 * a client-side router has to do it itself.
 *
 * A hash link (#faq, #about) is left alone -- that navigation is meant to scroll
 * to a specific element, not to the top.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    // index.css sets `html { scroll-behavior: smooth }`, which makes a plain
    // scrollTo animate. On navigation we want an instant jump, not a visible
    // scroll-up, so disable smooth for this one call and restore it. Setting
    // scroll-behavior directly is the reliable way -- `behavior: "instant"` is
    // not in every browser's typings.
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
  }, [pathname, hash]);

  return null;
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
          <ScrollToTop />
          <ReleasePrerenderedAnimations />
          {/* fallback={null} matches what RequireAuth already renders while the
              session resolves, so a lazy chunk loading looks no different. */}
          <Suspense fallback={null}>
          <Routes>
            <Route path="/"                element={<Index />} />
            <Route path="/faq"             element={<FAQ />} />
            <Route path="/legal"           element={<LegalInfo />} />
            <Route path="/privacy"         element={<Privacy />} />
            <Route path="/terms"           element={<Terms />} />
            <Route path="/cookies"         element={<Cookies />} />
            <Route path="/compare"         element={<CompareIndex />} />
            <Route path="/compare/:slug"   element={<ComparePage />} />
            <Route path="/best-amazon-wholesale-tools" element={<BestWholesaleTools />} />
            <Route path="/blog"            element={<BlogIndex />} />
            <Route path="/blog/:slug"      element={<BlogPost />} />
            <Route path="/sign-in"         element={<GuestOnly><SignIn /></GuestOnly>} />
            {/* No public sign-up: signing in creates a pending account. */}
            <Route path="/sign-up"         element={<Navigate to="/sign-in" replace />} />
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
