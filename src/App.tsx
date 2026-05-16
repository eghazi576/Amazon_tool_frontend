import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

import Index from "./pages/Index.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";
import Overview from "./pages/dashboard/Overview.tsx";
import ProductResearch from "./pages/dashboard/ProductResearch.tsx";
import HistoryPage from "./pages/dashboard/History.tsx";
import ReportsPage from "./pages/dashboard/Reports.tsx";
import BrandIntelligence from "./pages/dashboard/BrandIntelligence.tsx";
import { AIInsights, Settings } from "./pages/dashboard/Stubs.tsx";

const queryClient = new QueryClient();

// Route guard — redirect to sign-in if no Supabase session
function RequireAuth({ children }: { children: JSX.Element }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return null; // Loading — show nothing briefly
  if (!session) return <Navigate to="/sign-in" replace />;
  return children;
}

// Redirect already-logged-in users away from auth pages
function GuestOnly({ children }: { children: JSX.Element }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  if (session) return <Navigate to="/dashboard" replace />;
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/"                element={<Index />} />
          <Route path="/sign-in"         element={<GuestOnly><SignIn /></GuestOnly>} />
          <Route path="/sign-up"         element={<GuestOnly><SignUp /></GuestOnly>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={<DashboardLayout />}
          >
            <Route index              element={<Overview />} />
            <Route path="research"    element={<ProductResearch />} />
            <Route path="history"     element={<HistoryPage />} />
            <Route path="brand"       element={<BrandIntelligence />} />
            <Route path="ai"          element={<AIInsights />} />
            <Route path="reports"     element={<ReportsPage />} />
            <Route path="settings"    element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
