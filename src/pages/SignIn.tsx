import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Seo from "@/components/Seo";
import { routeMeta } from "@/lib/routes.js";

const meta = routeMeta("/sign-in");

const schema = z.object({
  email:    z.string().trim().email({ message: "Enter a valid email" }).max(255),
  password: z.string().min(1, { message: "Password is required" }).max(100),
});

const SignIn = () => {
  const { toast }  = useToast();
  const navigate   = useNavigate();
  const { login }  = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<{ email?: string; password?: string }>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ email, password });
    if (!result.success) {
      const fe: typeof errors = {};
      result.error.issues.forEach((i) => { fe[i.path[0] as "email" | "password"] = i.message; });
      setErrors(fe); return;
    }
    setErrors({});
    setLoading(true);
    try {
      await login(email.trim(), password);
      toast({ title: "Welcome back!", description: "Signed in successfully." });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Sign in failed", description: err.message ?? "Check your credentials.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account"
      footer={<>Don't have an account?{" "}<Link to="/sign-up" className="font-medium text-primary hover:underline">Sign up</Link></>}
    >
      <Seo title={meta.title} description={meta.description} path={meta.path} noindex={!meta.index} />

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" aria-invalid={!!errors.email} />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Input id="password" type={showPwd ? "text" : "password"} autoComplete="current-password"
              placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="pr-10" aria-invalid={!!errors.password} />
            <button type="button" onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
          Remember me for 30 days
        </label>

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
};
export default SignIn;
