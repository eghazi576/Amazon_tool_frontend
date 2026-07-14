import LegalLayout from "./LegalLayout";
import { ADDRESS_LINE, COMPANY, JURISDICTION, LEGAL_EMAIL } from "@/lib/legal";

const Terms = () => (
  <LegalLayout
    path="/terms"
    title="Terms of Service"
    intro="The agreement between you and WholesaleOS. The important parts are the data disclaimer and the fact that we are not Amazon — please read those."
  >
    <section>
      <h2>Agreement</h2>
      <p>
        These terms are between you and <strong>{COMPANY}</strong> ("WholesaleOS", "we", "us"), a
        limited liability company registered in New Mexico, United States, at {ADDRESS_LINE}. By
        creating an account or using the service, you accept them. If you do not accept them, do not
        use the service.
      </p>
    </section>

    <section>
      <h2>What WholesaleOS is</h2>
      <p>
        WholesaleOS is a research tool for Amazon sellers. You give it an ASIN or a brand; it retrieves
        market data, runs it through a scoring model, and shows you an analysis — price and Best Seller
        Rank history, estimated sales, fee and profit calculations, and a scored verdict.
      </p>
      <p>
        It is an instrument for making your own decision faster. It does not make the decision for you.
      </p>
    </section>

    <section>
      <h2>We are not Amazon</h2>
      <p>
        <strong>
          WholesaleOS is an independent tool. It is not affiliated with, endorsed by, sponsored by, or
          in any way officially connected to Amazon.com, Inc. or any of its subsidiaries.
        </strong>{" "}
        "Amazon", "Amazon FBA", "Seller Central" and related marks are trademarks of Amazon.com, Inc.
        We refer to them only to describe what this tool analyses.
      </p>
      <p>
        Likewise, we are not affiliated with Keepa, whose API supplies the market data we display.
      </p>
    </section>

    <section>
      <h2>The data is an estimate, not a promise</h2>
      <p>This is the clause that matters most. Please read it properly.</p>
      <ul>
        <li>
          <strong>Sales estimates are approximations.</strong> They are derived from Amazon's sales
          badge where available, from counting Best Seller Rank drops where it is not, and from a
          category lookup table as a last resort. They can be wrong.
        </li>
        <li>
          <strong>Fee and profit figures are calculated, not quoted.</strong> Referral, fulfilment and
          storage fees are estimated from published rates and from the product's weight and dimensions.
          Amazon's actual charges may differ.
        </li>
        <li>
          <strong>A score or verdict is an opinion produced by a model.</strong> "EXCELLENT" is not a
          guarantee of profit, and "REJECT" is not proof of loss.
        </li>
        <li>
          <strong>Third-party data may be stale or incorrect.</strong> We display what Keepa returns.
          We cannot guarantee its accuracy, completeness or timeliness.
        </li>
        <li>
          <strong>Gating and eligibility must be checked by you.</strong> Whether you can actually sell
          a product depends on your own account. Always verify in Seller Central.
        </li>
        <li>
          <strong>IP-complaint and brand checks are a starting point, not a legal clearance.</strong>{" "}
          They do not substitute for your own due diligence.
        </li>
      </ul>
      <p>
        <strong>
          Nothing in WholesaleOS is financial, investment, legal or tax advice. Sourcing decisions are
          yours, and so is the commercial risk. Verify anything you are about to spend money on.
        </strong>
      </p>
    </section>

    <section>
      <h2>Your account</h2>
      <ul>
        <li>Give an accurate email address; account recovery depends on it.</li>
        <li>Keep your password to yourself. You are responsible for activity under your account.</li>
        <li>Tell us promptly if you think someone else has access to it.</li>
        <li>You must be at least 16, and old enough to enter a contract where you live.</li>
      </ul>
    </section>

    <section>
      <h2>Acceptable use</h2>
      <p>Do not:</p>
      <ul>
        <li>Scrape, bulk-export, resell or redistribute the data or analysis you get from the service.</li>
        <li>Share your account, or resell access to it.</li>
        <li>Attempt to break, overload, probe or reverse-engineer the service or its infrastructure.</li>
        <li>Use the service to break the law, or to breach Amazon's or Keepa's own terms.</li>
        <li>Circumvent any rate limit or access control.</li>
      </ul>
      <p>We may suspend or terminate an account that does any of these, without refund.</p>
    </section>

    <section>
      <h2>Availability</h2>
      <p>
        We aim to keep WholesaleOS running, but we do not promise uptime. The service depends on
        third-party APIs that can slow down, change or fail. We may change, suspend or discontinue any
        feature. We will try to give notice of anything significant, but we may not always be able to.
      </p>
    </section>

    <section>
      <h2>Your content</h2>
      <p>
        Your search history and the figures you enter (such as cost of goods) remain yours. We store
        them to provide the service, as described in the <a href="/privacy">Privacy Policy</a>. We
        claim no ownership of them and do not sell them.
      </p>
    </section>

    <section>
      <h2>Our content</h2>
      <p>
        The WholesaleOS software, interface, scoring models and branding belong to us. Using the
        service does not transfer any of it to you.
      </p>
    </section>

    <section>
      <h2>Termination</h2>
      <p>
        You may stop using WholesaleOS and ask us to delete your account at any time. We may terminate
        an account that breaches these terms. On termination, your access ends and your data is deleted
        as described in the Privacy Policy.
      </p>
    </section>

    <section>
      <h2>Limitation of liability</h2>
      <p>
        The service is provided "as is" and "as available", without warranties of any kind, express or
        implied, including merchantability, fitness for a particular purpose, and non-infringement.
      </p>
      <p>
        <strong>
          To the maximum extent the law allows, we are not liable for lost profits, lost inventory,
          missed opportunities, account suspensions, or any indirect or consequential loss arising from
          your use of WholesaleOS or from decisions you made using it
        </strong>{" "}
        — including decisions based on its estimates, scores or verdicts.
      </p>
      <p>
        Where liability cannot lawfully be excluded, it is limited to the amount you paid us in the
        twelve months before the claim.
      </p>
    </section>

    <section>
      <h2>Changes to these terms</h2>
      <p>
        We may update these terms. The effective date at the top will change, and material changes will
        be announced to account holders by email. Continuing to use the service after a change means
        you accept it.
      </p>
    </section>

    <section>
      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of {JURISDICTION}, and any dispute will be handled by its
        courts.
      </p>
    </section>

    <section>
      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    </section>
  </LegalLayout>
);

export default Terms;
