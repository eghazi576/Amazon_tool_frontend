import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import { routeMeta } from "@/lib/routes.js";
import { EFFECTIVE_DATE, LEGAL_PAGES } from "@/lib/legal";

/**
 * Shared shell for the three legal pages. They are prerendered like any other
 * public route, so the text is in the HTML a crawler receives.
 *
 * The typography plugin is not enabled in tailwind.config.ts, so `prose` is not
 * available -- the rhythm below is set by hand instead of silently falling back
 * to unstyled text.
 */
const LegalLayout = ({
  path,
  title,
  intro,
  children,
}: {
  /** Router path, e.g. "/privacy" — also keys the SEO metadata. */
  path: string;
  /** The page's single <h1>. */
  title: string;
  intro: string;
  children: React.ReactNode;
}) => {
  const meta = routeMeta(path);

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <Seo
        title={meta.title}
        description={meta.description}
        path={meta.path}
        noindex={!meta.index}
      />

      <Navbar />

      <main className="container mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-6">
        <header className="mb-10 border-b border-border/60 pb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">{intro}</p>
          <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">
            Effective {EFFECTIVE_DATE}
          </p>
        </header>

        {/*
          Section headings inside are <h2>, sub-points <h3> — one h1 per page and
          no skipped levels. Spacing lives on this wrapper so the sections
          themselves stay plain.
        */}
        <div
          className="space-y-10
            [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground
            [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground
            [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-muted-foreground
            [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-muted-foreground
            [&_li]:list-disc [&_li]:leading-relaxed [&_li]:marker:text-primary/60
            [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80
            [&_strong]:font-semibold [&_strong]:text-foreground"
        >
          {children}
        </div>

        <nav className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-border/60 pt-8 text-sm">
          <span className="text-muted-foreground">Also read:</span>
          {LEGAL_PAGES.filter((p) => p.path !== path).map((p) => (
            <Link key={p.path} to={p.path} className="text-primary underline underline-offset-2 hover:opacity-80">
              {p.label}
            </Link>
          ))}
        </nav>
      </main>

      <Footer />
    </div>
  );
};

export default LegalLayout;
