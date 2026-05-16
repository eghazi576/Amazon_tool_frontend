import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </span>
          <span className="gradient-text">Aurix</span>
        </a>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="transition-smooth hover:text-foreground">Home</a>
          <a href="#" className="transition-smooth hover:text-foreground">Dashboard</a>
        </div>

        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Aurix. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
