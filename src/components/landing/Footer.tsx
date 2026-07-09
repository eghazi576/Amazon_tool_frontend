import { Link } from "react-router-dom";
import { Sparkles, Mail } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-background">
      {/* Main footer grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="gradient-text">WholesaleOS</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The AI-powered wholesale analyst for Amazon sellers. Research products, analyze profitability, and vet brands from one platform.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="X (Twitter)"
              >
                {/* X / Twitter */}
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="GitHub"
              >
                {/* GitHub */}
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
              <a
                href="mailto:support@wholesaleos.com"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#about" className="transition-colors hover:text-foreground">About</a></li>
              <li><a href="#features" className="transition-colors hover:text-foreground">Features</a></li>
              <li><a href="#how" className="transition-colors hover:text-foreground">How it works</a></li>
              <li><a href="#benefits" className="transition-colors hover:text-foreground">Benefits</a></li>
              <li><Link to="/faq" className="transition-colors hover:text-foreground">FAQ</Link></li>
              <li>
                <Link to="/dashboard/research" className="transition-colors hover:text-foreground">
                  Product Research
                </Link>
              </li>
              <li>
                <Link to="/dashboard/brand" className="transition-colors hover:text-foreground">
                  Brand Intelligence
                </Link>
              </li>
            </ul>
          </div>

          {/* Account column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Account</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/sign-in" className="transition-colors hover:text-foreground">Sign in</Link>
              </li>
              <li>
                <Link to="/sign-up" className="transition-colors hover:text-foreground">Create account</Link>
              </li>
              <li>
                <Link to="/forgot-password" className="transition-colors hover:text-foreground">Reset password</Link>
              </li>
              <li>
                <Link to="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="transition-colors hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Terms of Service</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Cookie Policy</a></li>
            </ul>

          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/40">
        <div className="container mx-auto px-6 py-5 text-center">
          <p className="text-xs text-muted-foreground">
            © {year} WholesaleOS. All rights reserved. Built for Amazon wholesale sellers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
