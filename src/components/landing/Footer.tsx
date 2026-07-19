import { Link } from "react-router-dom";
import { Sparkles, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/legal";

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
            {/*
              The X and GitHub icons used to sit here pointing at href="#". Neither
              profile exists, and a dead social icon reads as an abandoned product.
              They come back when the accounts do -- and when they do, add them to
              `sameAs` in the Organization schema too.
            */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="Email WholesaleOS support"
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
              <li><Link to="/compare" className="transition-colors hover:text-foreground">Compare</Link></li>
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
              <li><Link to="/privacy" className="transition-colors hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="transition-colors hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/cookies" className="transition-colors hover:text-foreground">Cookie Policy</Link></li>
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
