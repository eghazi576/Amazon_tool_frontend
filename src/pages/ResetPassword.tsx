import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordStrength from "@/components/auth/PasswordStrength";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Seo from "@/components/Seo";
import { routeMeta } from "@/lib/routes.js";

const meta = routeMeta("/reset-password");

const schema = z.object({
  password: z.string().min(8, { message: "At least 8 characters" }).max(100),
  confirm:  z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });

type Errors = Partial<Record<"password" | "confirm", string>>;

const ResetPassword = () => {
  const { toast }         = useToast();
  const navigate          = useNavigate();
  const { resetPassword } = useAuth();
  const [searchParams]    = useSearchParams();
  const token             = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Errors>({});
  const [done, setDone]         = useState(false);

  if (!token) {
    return (
      <AuthLayout
        title="Invalid link"
        subtitle="This reset link is missing a token."
        footer={<Link to="/forgot-password" className="font-medium text-primary hover:underline">Request a new link</Link>}
      >
        <Seo title={meta.title} description={meta.description} path={meta.path} noindex />

        <p className="text-sm text-muted-foreground text-center">
          Please request a new password reset link.
        </p>
      </AuthLayout>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ password, confirm });
    if (!result.success) {
      const fe: Errors = {};
      result.error.issues.forEach((i) => { const k = i.path[0] as keyof Errors; if (!fe[k]) fe[k] = i.message; });
      setErrors(fe); return;
    }
    setErrors({});
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err: any) {
      toast({ title: "Reset failed", description: err.message ?? "Invalid or expired link.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={done ? "Password updated" : "Set a new password"}
      subtitle={done ? "You can now sign in with your new password" : "Choose a strong password"}
      footer={
        <Link
          to="/sign-in"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      }
    >
      <Seo title={meta.title} description={meta.description} path={meta.path} noindex />

      {done ? (
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Your password has been updated successfully.
          </p>
          <Button
            type="button"
            variant="hero"
            size="lg"
            className="w-full"
            onClick={() => navigate("/sign-in")}
          >
            Sign in
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <PasswordStrength password={password} />
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type={showPwd ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={!!errors.confirm}
            />
            {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {loading ? "Updating..." : "Reset password"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
