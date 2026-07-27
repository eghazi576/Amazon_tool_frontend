import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import { routeMeta } from "@/lib/routes.js";
import { postsByDate } from "@/lib/blog";

const meta = routeMeta("/blog");

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

const BlogIndex = () => {
  const posts = postsByDate();

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <Seo title={meta.title} description={meta.description} path={meta.path} />

      <Navbar />

      <main className="container mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-6">
        <header className="mb-12 border-b border-border/60 pb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            The WholesaleOS Blog
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            Practical guides to Amazon product research, wholesale brand vetting, and reading the market
            data behind a sourcing decision. Written for FBA, wholesale and online-arbitrage sellers.
          </p>
        </header>

        <div className="space-y-4">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="block rounded-xl border border-border/60 bg-card/60 p-6 transition-colors hover:border-primary/40"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">{p.tag}</p>
              <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-foreground">{p.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{p.description}</p>
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                <time dateTime={p.date} className="text-muted-foreground">{formatDate(p.date)}</time>
                <span className="text-muted-foreground">· {p.readMinutes} min read</span>
                <span className="ml-auto inline-flex items-center gap-1">
                  Read <ArrowRight className="h-4 w-4" />
                </span>
              </p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogIndex;
