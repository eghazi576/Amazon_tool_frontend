import { Fragment } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import { routeMeta, canonical, SITE_URL, OG_IMAGE } from "@/lib/routes.js";
import { postBySlug } from "@/lib/blog";

/**
 * One template renders every /blog/<slug>. The prerenderer visits each concrete
 * URL, so each post is snapshotted with its own content, title and BlogPosting
 * schema.
 *
 * Body paragraphs may contain [[/path|anchor]] tokens; renderText turns those
 * into real <Link>s so posts carry contextual internal links.
 */

const LINK_RE = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;

function renderText(text: string) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    nodes.push(
      <Link key={m.index} to={m[1]} className="text-primary underline underline-offset-2 hover:opacity-80">
        {m[2]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

const BlogPost = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/blog\//, "").replace(/\/$/, "");
  const post = postBySlug(slug);

  if (!post) {
    return (
      <div className="relative min-h-screen bg-background font-sans text-foreground">
        <Seo title="Post not found | WholesaleOS" description="This blog post does not exist." path={pathname} noindex />
        <Navbar />
        <main className="container mx-auto max-w-3xl px-5 pb-24 pt-32 text-center sm:px-6">
          <h1 className="font-display text-2xl font-bold">Post not found</h1>
          <p className="mt-3 text-muted-foreground">
            That post does not exist. See{" "}
            <Link to="/blog" className="text-primary underline underline-offset-2">all posts</Link>.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const meta = routeMeta(pathname.replace(/\/$/, ""));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "WholesaleOS", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "WholesaleOS",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: canonical(meta.path),
    image: OG_IMAGE,
  };

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <Seo title={meta.title} description={meta.description} path={meta.path} jsonLd={jsonLd} />

      <Navbar />

      <main className="container mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">{post.tag}</p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readMinutes} min read
        </p>

        <article
          className="mt-10 space-y-5
            [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground
            [&_p]:leading-relaxed [&_p]:text-muted-foreground
            [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:list-disc [&_li]:leading-relaxed [&_li]:text-muted-foreground [&_li]:marker:text-primary/60"
        >
          {post.body.map((b, i) => {
            if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
            if (b.type === "ul")
              return (
                <ul key={i}>
                  {b.items.map((it, j) => (
                    <li key={j}>{renderText(it)}</li>
                  ))}
                </ul>
              );
            return <p key={i}>{renderText(b.text)}</p>;
          })}
        </article>

        <div className="mt-12 flex flex-col items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-foreground">Score your next Amazon deal with live data.</p>
          <Button asChild variant="hero">
            <Link to="/sign-up">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <section className="mt-12 border-t border-border/60 pt-8">
          <h2 className="font-display text-lg font-bold tracking-tight">Related reading</h2>
          <ul className="mt-4 space-y-2">
            {post.related.map((r) => (
              <li key={r.to}>
                <Link to={r.to} className="text-sm text-primary underline underline-offset-2 hover:opacity-80">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            <Link to="/blog" className="text-primary underline underline-offset-2 hover:opacity-80">
              All blog posts
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
