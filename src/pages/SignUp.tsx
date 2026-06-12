import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordStrength from "@/components/auth/PasswordStrength";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const schema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email" }).max(255),
  password: z.string().min(8, { message: "At least 8 characters" }).max(100),
  confirm: z.string(),
  terms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
}).refine((d) => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });

type Errors = Partial<Record<"email" | "password" | "confirm" | "terms", string>>;

const SignUp = () => {
  const { toast }    = useToast();
  const navigate     = useNavigate();
  const { register } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [terms, setTerms]       = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Errors>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ email, password, confirm, terms });
    if (!result.success) {
      const fe: Errors = {};
      result.error.issues.forEach((i) => { const k = i.path[0] as keyof Errors; if (!fe[k]) fe[k] = i.message; });
      setErrors(fe); return;
    }
    setErrors({});
    setLoading(true);
    try {
      await register(email.trim(), password);
      toast({ title: "Account created!", description: "Welcome aboard! You're now signed in." });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Sign up failed", description: err.message ?? "Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start researching Amazon products in minutes"
      footer={<>Already have an account?{" "}<Link to="/sign-in" className="font-medium text-primary hover:underline">Sign in</Link></>}
    >
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={showPwd ? "text" : "password"} autoComplete="new-password"
              placeholder="Min 8 characters"
              value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" aria-invalid={!!errors.password} />
            <button type="button" onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrength password={password} />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type={showPwd ? "text" : "password"} autoComplete="new-password"
            placeholder="Re-enter your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-invalid={!!errors.confirm} />
          {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
        </div>
        <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
          <Checkbox className="mt-0.5" checked={terms} onCheckedChange={(v) => setTerms(!!v)} />
          <span>I agree to the <a href="#" className="text-primary hover:underline">Terms</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a></span>
        </label>
        {errors.terms && <p className="text-xs text-destructive">{errors.terms}</p>}
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
};
export default SignUp;
