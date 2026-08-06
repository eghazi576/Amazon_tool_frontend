import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Clock, ShieldX, PartyPopper, LogOut, ArrowRight } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Seo from "@/components/Seo";

/**
 * Account-gate screen. New sign-ins wait here until an admin approves them:
 *  - APPROVED  → one-time welcome (RequireAuth passes onEnter to dismiss it).
 *  - REJECTED  → access-restricted message with the enrolment link.
 *  - PENDING   → awaiting-approval message.
 */
const PendingApproval = ({ onEnter }: { onEnter?: () => void }) => {
  const { user, isLoading, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  // While the account isn't approved yet, poll for the admin's decision so the
  // screen flips to "granted" or "restricted" live, without a manual refresh.
  const notApproved = !!user && !user.isAdmin && user.status !== "APPROVED";
  useEffect(() => {
    if (!notApproved) return;
    const id = setInterval(() => { refreshUser(); }, 15000);
    const onFocus = () => refreshUser();
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(id); window.removeEventListener("focus", onFocus); };
  }, [notApproved, refreshUser]);

  if (isLoading) return null;
  if (!user) return <Navigate to="/sign-in" replace />;

  const approved = user.isAdmin || user.status === "APPROVED";
  const rejected = user.status === "REJECTED";

  const enter = () => (onEnter ? onEnter() : navigate("/dashboard"));

  return (
    <AuthLayout
      title={approved ? "Access granted" : rejected ? "Access restricted" : "Awaiting approval"}
      subtitle={user.email}
    >
      <Seo title="Account status | WholesaleOS" description="Your WholesaleOS account status." path="/pending" noindex />

      <div className="flex flex-col items-center text-center">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${approved ? "bg-emerald-500/15" : rejected ? "bg-destructive/15" : "bg-primary/15"}`}>
          {approved ? <PartyPopper className="h-7 w-7 text-emerald-400" />
            : rejected ? <ShieldX className="h-7 w-7 text-destructive" />
            : <Clock className="h-7 w-7 text-primary" />}
        </div>

        {approved ? (
          <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p className="text-base font-semibold text-foreground">🎉 Congratulations! 🎉</p>
            <p className="font-medium text-foreground">Access Granted to WholesaleOS</p>
            <p>Welcome to <span className="font-medium text-foreground">WholesaleOS by Hussam Ansari</span>.</p>
            <p>Let's build your profitable wholesale business together!</p>
            <p className="text-xs">Team Nomads University</p>
          </div>
        ) : rejected ? (
          <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p className="text-base font-semibold text-foreground">🔒 Access Restricted</p>
            <p>You currently don't have access to <span className="font-medium text-foreground">WholesaleOS</span>.</p>
            <p>To get access, join <span className="font-medium text-foreground">FBA Accelerator Program by Nomads University</span>.</p>
            <p>
              👉 Enroll now:{" "}
              <a href="https://hussamansari.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2 hover:opacity-80">
                Nomads University
              </a>
            </p>
            <p className="text-xs">Team Nomads University</p>
          </div>
        ) : (
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Thanks for signing in. An administrator needs to approve your account before you can use WholesaleOS.
            If you are a student of <span className="font-medium text-foreground">FBA Accelerator by Nomads University</span>,
            your account will be approved shortly.
          </p>
        )}

        {approved ? (
          <Button variant="hero" className="mt-8 w-full" onClick={enter}>
            Enter WholesaleOS <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" className="mt-8" onClick={() => logout()}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        )}
      </div>
    </AuthLayout>
  );
};

export default PendingApproval;
