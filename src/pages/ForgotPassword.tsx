import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email" }).max(255),
});

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  return (
    <AuthLayout
      title={sent ? "Check your email" : "Forgot your password?"}
      subtitle={
        sent
          ? "We've sent a password reset link to your email"
          : "Enter your email and we'll send you a reset link"
      }
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
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            A reset link was sent to{" "}
            <span className="font-medium text-foreground">{email}</span>. Check your
            inbox and spam folder.
          </p>
          <Button
            type="button"
            variant="glass"
            className="w-full"
            onClick={() => setSent(false)}
          >
            Use a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                aria-invalid={!!error}
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : null}
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
