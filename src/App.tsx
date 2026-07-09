import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Index from "./pages/Index.tsx";
import FAQ from "./pages/FAQ.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";
import Overview from "./pages/dashboard/Overview.tsx";
import ProductResearch from "./pages/dashboard/ProductResearch.tsx";
import HistoryPage from "./pages/dashboard/History.tsx";
import ReportsPage from "./pages/dashboard/Reports.tsx";
import BrandIntelligence from "./pages/dashboard/BrandIntelligence.tsx";
import { AIInsights, Settings } from "./pages/dashboard/Stubs.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";

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

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/"                element={<Index />} />
            <Route path="/faq"             element={<FAQ />} />
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
