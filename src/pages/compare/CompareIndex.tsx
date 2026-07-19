import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import { routeMeta } from "@/lib/routes.js";
import { COMPARISONS } from "@/lib/comparisons";

const meta = routeMeta("/compare");

const CompareIndex = () => (
  <div className="relative min-h-screen bg-background font-sans text-foreground">
    <Seo title={meta.title} description={meta.description} path={meta.path} />

    <Navbar />

    <main className="container mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">Comparisons</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        WholesaleOS compared to other Amazon tools
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Honest, side-by-side comparisons — including when the other tool is the better choice.
        WholesaleOS is a focused product and wholesale-brand scoring tool built on live Keepa data.
      </p>

      <div className="mt-10 space-y-3">
        {COMPARISONS.map((c) => (
          <Link
            key={c.slug}
            to={`/compare/${c.slug}`}
            className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/40"
          >
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight">
                WholesaleOS vs {c.competitor}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.positioning}</p>
            </div>
            <ArrowRight className="ml-4 h-5 w-5 shrink-0 text-primary" />
          </Link>
        ))}
      </div>
    </main>

    <Footer />
  </div>
);

export default CompareIndex;
