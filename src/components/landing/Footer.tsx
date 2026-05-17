import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Mail } from "lucide-react";

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
              <span className="gradient-text">Aurix</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              AI-powered Amazon FBA research tool. Paste an ASIN, get a full profit analysis and buy / no-buy verdict in seconds.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="mailto:support@aurix.app"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product column */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#features" className="transition-colors hover:text-foreground">Features</a></li>
              <li><a href="#how" className="transition-colors hover:text-foreground">How it works</a></li>
              <li><a href="#benefits" className="transition-colors hover:text-foreground">Benefits</a></li>
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
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Account</h4>
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
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="transition-colors hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Terms of Service</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Cookie Policy</a></li>
            </ul>

            <div className="mt-8 rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-medium text-foreground">Data powered by</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Keepa API — real-time Amazon price & rank history
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/40">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} Aurix. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for Amazon wholesale FBA sellers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
