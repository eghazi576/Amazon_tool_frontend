import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-sans text-foreground">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8 sm:px-6 sm:py-12">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="gradient-text">WholesaleOS</span>
        </Link>

        <div className="my-auto py-10">
          <div className="animate-fade-up glass rounded-2xl p-6 shadow-card sm:p-8">
            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
            {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} WholesaleOS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
