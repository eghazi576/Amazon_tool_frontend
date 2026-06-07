import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-border/50 shadow-card"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
            <span className="absolute inset-0 rounded-lg bg-gradient-primary opacity-0 blur-sm transition-smooth hover:opacity-60" />
          </span>
          <span className="gradient-text">Aurix</span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {[
            { href: "#features", label: "Features" },
            { href: "#how",      label: "How it works" },
            { href: "#benefits", label: "Benefits" },
            { href: "#faq",      label: "FAQ" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm text-muted-foreground transition-smooth hover:text-foreground group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="hero" size="sm" className="rounded-lg shadow-elegant">
            <Link to="/sign-up">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
