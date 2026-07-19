import { useLocation, Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import { routeMeta } from "@/lib/routes.js";
import { faqPageSchema } from "@/lib/jsonld";
import { comparisonBySlug } from "@/lib/comparisons";

/**
 * One template renders every /compare/<slug> page. The prerenderer visits each
 * concrete URL, React Router matches /compare/:slug, and this reads the slug from
 * the path -- so each page is snapshotted with its own content, title and schema.
 *
 * The FAQ answers are rendered as plain visible text (not an accordion), so the
 * text is unambiguously present in the HTML that the FAQPage JSON-LD describes --
 * which is exactly what an AI answer engine reads and cites.
 */
const ComparePage = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/compare\//, "").replace(/\/$/, "");
  const c = comparisonBySlug(slug);

  // Only real comparison slugs are prerendered and in the sitemap, and nginx
  // already answers an unknown /compare/* URL with a 404. This guard covers the
  // runtime edge case (a mistyped slug after the JS has loaded): show a small,
  // noindexed pointer back to the index rather than a blank screen.
  if (!c) {
    return (
      <div className="relative min-h-screen bg-background font-sans text-foreground">
        <Seo title="Comparison not found | WholesaleOS" description="This comparison does not exist." path={pathname} noindex />
        <Navbar />
        <main className="container mx-auto max-w-3xl px-5 pb-24 pt-32 text-center sm:px-6">
          <h1 className="font-display text-2xl font-bold">Comparison not found</h1>
          <p className="mt-3 text-muted-foreground">
            That comparison does not exist. See{" "}
            <Link to="/compare" className="text-primary underline underline-offset-2">all comparisons</Link>.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const meta = routeMeta(pathname.replace(/\/$/, ""));

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <Seo
        title={meta.title}
        description={meta.description}
        path={meta.path}
        jsonLd={faqPageSchema(c.faqs)}
      />

      <Navbar />

      <main className="container mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Comparison</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          WholesaleOS vs {c.competitor}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{c.intro}</p>

        <p className="mt-6 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">In short:</strong> {c.positioning}
        </p>

        {/* Comparison table */}
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold tracking-tight">Side by side</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left">
                  <th className="p-3 font-semibold"></th>
                  <th className="p-3 font-semibold text-primary">WholesaleOS</th>
                  <th className="p-3 font-semibold">{c.competitor}</th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((r) => (
                  <tr key={r.dimension} className="border-t border-border/50 align-top">
                    <td className="p-3 font-medium text-foreground">{r.dimension}</td>
                    <td className="p-3 text-muted-foreground">{r.wholesaleos}</td>
                    <td className="p-3 text-muted-foreground">{r.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* When to choose which */}
        <section className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-card/60 p-5">
            <h2 className="font-display text-lg font-bold tracking-tight">Choose {c.competitor} if</h2>
            <ul className="mt-3 space-y-2">
              {c.chooseCompetitor.map((li) => (
                <li key={li} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <h2 className="font-display text-lg font-bold tracking-tight">Choose WholesaleOS if</h2>
            <ul className="mt-3 space-y-2">
              {c.chooseWholesaleOS.map((li) => (
                <li key={li} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ — plain text so it is in the HTML the schema describes */}
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold tracking-tight">
            WholesaleOS vs {c.competitor} — common questions
          </h2>
          <div className="mt-4 space-y-6">
            {c.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="text-base font-semibold text-foreground">{f.q}</h3>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-10 text-xs text-muted-foreground">
          {c.competitor} is a trademark of its respective owner and is not affiliated with WholesaleOS.
          Third-party tools change their features and pricing; verify current details on their own site.
        </p>

        <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-foreground">See how WholesaleOS scores your next deal.</p>
          <Button asChild variant="hero">
            <Link to="/sign-up">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-border/60 pt-8 text-sm">
          <span className="text-muted-foreground">More comparisons:</span>
          <Link to="/compare" className="text-primary underline underline-offset-2 hover:opacity-80">
            All comparisons
          </Link>
        </nav>
      </main>

      <Footer />
    </div>
  );
};

export default ComparePage;
