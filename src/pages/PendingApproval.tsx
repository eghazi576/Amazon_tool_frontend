import { Navigate } from "react-router-dom";
import { Clock, ShieldX, LogOut } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Seo from "@/components/Seo";

/**
 * Shown to a signed-in user whose account is not yet APPROVED. New sign-ups land
 * here until an admin approves them from the dashboard; rejected accounts see the
 * declined message. Approved users and admins are bounced to the dashboard.
 */
const PendingApproval = () => {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/sign-in" replace />;
  if (user.isAdmin || user.status === "APPROVED") return <Navigate to="/dashboard" replace />;

  const rejected = user.status === "REJECTED";

  return (
    <AuthLayout
      title={rejected ? "Account not approved" : "Awaiting approval"}
      subtitle={user.email}
    >
      <Seo title="Account status | WholesaleOS" description="Your WholesaleOS account status." path="/pending" noindex />

      <div className="flex flex-col items-center text-center">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${rejected ? "bg-destructive/15" : "bg-primary/15"}`}>
          {rejected ? <ShieldX className="h-7 w-7 text-destructive" /> : <Clock className="h-7 w-7 text-primary" />}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          {rejected ? (
            <>You are not a student of <span className="font-medium text-foreground">FBA Accelerator by Nomads University</span>.
              If you think this is a mistake, contact the administrator.</>
          ) : (
            <>Thanks for signing in. An administrator needs to approve your account before you can use WholesaleOS.
              If you are a student of <span className="font-medium text-foreground">FBA Accelerator by Nomads University</span>,
              your account will be approved shortly.</>
          )}
        </p>

        <Button variant="outline" className="mt-8" onClick={() => logout()}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </AuthLayout>
  );
};

export default PendingApproval;
