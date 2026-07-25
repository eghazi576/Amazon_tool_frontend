import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import { routeMeta } from "@/lib/routes.js";
import { ADDRESS, COMPANY, CONTACT_EMAIL, PHONE } from "@/lib/legal";

const meta = routeMeta("/legal");

const DOCS = [
  {
    to: "/privacy",
    title: "Privacy Policy",
    desc: "How we collect, use, store, protect, and process your personal information, your privacy rights, and the choices available to you.",
  },
  {
    to: "/terms",
    title: "Terms of Service",
    desc: "The legal agreement between you and Mentify LLC — user responsibilities, acceptable use, intellectual property, account management, liability limits, and disputes.",
  },
  {
    to: "/cookies",
    title: "Cookie Policy",
    desc: "How WholesaleOS uses cookies and similar technologies for functionality, security, and preferences — and why there is no tracking.",
  },
];

/**
 * Legal hub. Links to the three governing documents and states the umbrella
 * intellectual-property, disclaimer and contact terms in one place. Built
 * standalone (not via LegalLayout) so the document links can render as cards
 * rather than inheriting the underlined-link styling used inside the policies.
 */
const LegalInfo = () => (
  <div className="relative min-h-screen bg-background font-sans text-foreground">
    <Seo title={meta.title} description={meta.description} path={meta.path} />

    <Navbar />

    <main className="container mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-6">
      <header className="mb-10 border-b border-border/60 pb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Legal Information</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          The policies that govern your use of WholesaleOS, a product owned and operated by {COMPANY}.
        </p>
        <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">Last updated 16 July 2026</p>
      </header>

      <div className="space-y-10">
        <section>
          <p className="leading-relaxed text-muted-foreground">
            We are committed to operating our platform with transparency, integrity, and respect for the
            rights and privacy of our users. This page provides access to the legal policies that govern
            your use of WholesaleOS and explains the agreements between you and {COMPANY}.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            By accessing or using WholesaleOS, you acknowledge that you have read, understood, and agreed
            to be bound by the policies referenced on this page. If you do not agree with any of these
            policies, you should discontinue your use of our Services.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">Our legal documents</h2>
          <p className="mt-2 text-sm text-muted-foreground">The following documents govern your use of WholesaleOS:</p>
          <div className="mt-4 space-y-3">
            {DOCS.map((d) => (
              <Link
                key={d.to}
                to={d.to}
                className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/40"
              >
                <div>
                  <h3 className="font-semibold text-foreground">{d.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
                </div>
                <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">Intellectual property</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            All content, software, technology, algorithms, databases, trademarks, logos, designs,
            graphics, documentation, and other materials available through WholesaleOS are the exclusive
            property of {COMPANY} or its licensors and are protected by applicable intellectual property
            laws.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            No portion of the WholesaleOS platform may be copied, reproduced, modified, distributed,
            reverse engineered, or otherwise used without the prior written permission of {COMPANY},
            except where expressly permitted by applicable law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">Disclaimer</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            WholesaleOS is an analytical research platform designed to assist users in evaluating Amazon
            products and brands. The information, scores, recommendations, and research insights provided
            by WholesaleOS are intended solely for informational purposes and should not be interpreted as
            financial, legal, tax, investment, or professional advice.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Users remain solely responsible for conducting their own due diligence and making independent
            business decisions. {COMPANY} does not guarantee the accuracy, completeness, reliability, or
            future performance of any product, market, or business opportunity identified through the
            Services.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">Changes to our legal documents</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            We may revise or update our legal documents from time to time to reflect changes in our
            Services, business operations, legal requirements, or industry standards. Updated versions
            will become effective upon publication unless otherwise specified.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Your continued use of WholesaleOS following the publication of revised legal documents
            constitutes your acceptance of those changes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">Contact information</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            If you have questions regarding our legal documents or require additional information, please
            contact us:
          </p>
          <div className="mt-4 rounded-xl border border-border/60 bg-card/60 p-5 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">{COMPANY}</p>
            <p className="mt-1">{ADDRESS.street}</p>
            <p>{ADDRESS.city}, {ADDRESS.region} {ADDRESS.postalCode}</p>
            <p>United States</p>
            <p className="mt-3">
              <span className="font-medium text-foreground">Email:</span>{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-2 hover:opacity-80">
                {CONTACT_EMAIL}
              </a>
            </p>
            <p>
              <span className="font-medium text-foreground">Phone:</span> {PHONE}
            </p>
          </div>
        </section>
      </div>
    </main>

    <Footer />
  </div>
);

export default LegalInfo;
