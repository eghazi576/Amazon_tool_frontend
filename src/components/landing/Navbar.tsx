import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="gradient-text">Aurix</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">Features</a>
          <a href="#how" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">How it works</a>
          <a href="#benefits" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">Benefits</a>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="hero" size="sm" className="rounded-lg">
            <Link to="/sign-up">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
