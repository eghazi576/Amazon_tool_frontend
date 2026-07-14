import LegalLayout from "./LegalLayout";
import { ADDRESS_LINE, COMPANY, LEGAL_EMAIL, PHONE } from "@/lib/legal";

const Privacy = () => (
  <LegalLayout
    path="/privacy"
    title="Privacy Policy"
    intro="What WholesaleOS collects, why, and what it never does. Written from the code, in plain language."
  >
    <section>
      <h2>Who runs this service</h2>
      <p>
        WholesaleOS is a product of <strong>{COMPANY}</strong>, a limited liability company registered
        in New Mexico, United States. {COMPANY} is the data controller for the information described
        on this page.
      </p>
      <ul>
        <li><strong>Address</strong> — {ADDRESS_LINE}</li>
        <li><strong>Phone</strong> — {PHONE}</li>
        <li>
          <strong>Privacy and data requests</strong> —{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </li>
      </ul>
    </section>

    <section>
      <h2>What we never do</h2>
      <p>Stated first, because it is the part most policies bury:</p>
      <ul>
        <li>
          <strong>We do not sell or share your data.</strong> Not to advertisers, not to data brokers,
          not to anyone.
        </li>
        <li>
          <strong>We run no analytics and no advertising trackers.</strong> There is no Google
          Analytics, no Tag Manager, no Facebook pixel, no session recorder anywhere in this site.
        </li>
        <li>
          <strong>We do not build advertising profiles</strong> or use your research to target you.
        </li>
        <li>
          <strong>The public pages set no cookies at all.</strong> You can read the homepage, the FAQ
          and these policies without a single cookie being written.
        </li>
      </ul>
    </section>

    <section>
      <h2>What we collect</h2>

      <h3>Your account</h3>
      <ul>
        <li>
          <strong>Email address</strong> — used to identify your account, sign you in, and send
          password-reset links.
        </li>
        <li>
          <strong>Password</strong> — stored only as a bcrypt hash. We never store or see the password
          itself, and we cannot recover it for you; we can only let you reset it.
        </li>
        <li>
          <strong>Account timestamps</strong> — when the account was created and last updated.
        </li>
        <li>
          <strong>A temporary reset token</strong> — created only when you request a password reset,
          and it expires.
        </li>
      </ul>

      <h3>Your research</h3>
      <p>
        Every product lookup and brand evaluation you run is saved to your account so you can return
        to it from the History page. For a product lookup that record includes the ASIN, product title,
        brand, category, image URL, prices, your entered cost of goods, the calculated profit, ROI,
        margin and fees, Best Seller Rank figures, rating and review counts, FBA seller counts, and the
        resulting score and verdict. Brand evaluations store the equivalent brand-level fields.
      </p>
      <p>
        This exists to serve you the History and Reports features. It is not analysed for any other
        purpose and it is not shared with other users.
      </p>

      <h3>Technical data</h3>
      <p>
        Our server and our network provider keep standard request logs — IP address, timestamp, the
        page requested, and browser user-agent — for security, abuse prevention and debugging. These
        are ordinary web-server logs, not a tracking system.
      </p>
    </section>

    <section>
      <h2>Cookies</h2>
      <p>
        WholesaleOS uses exactly two cookies, both strictly necessary for signing in, and neither used
        for tracking. Full detail is on the <a href="/cookies">Cookie Policy</a> page.
      </p>
    </section>

    <section>
      <h2>Who else sees data</h2>
      <p>We use a small number of services to make the product work. None of them receive your research history.</p>
      <ul>
        <li>
          <strong>Keepa</strong> — when you look up an ASIN, that ASIN is sent to the Keepa API to
          retrieve Amazon market data. Keepa receives the ASIN. It does not receive your identity.
        </li>
        <li>
          <strong>Amazon</strong> — product images are loaded directly from Amazon's image servers, so
          your browser contacts Amazon to fetch them.
        </li>
        <li>
          <strong>Cloudflare</strong> — sits in front of the site for TLS, caching and protection, so
          it processes your IP address as part of delivering the page.
        </li>
        <li>
          <strong>DigitalOcean</strong> — hosts the server and the database.
        </li>
        <li>
          <strong>Google Fonts</strong> — the site's typefaces are currently loaded from Google's font
          servers, which means your browser's IP address reaches Google when a page loads.
        </li>
      </ul>
    </section>

    <section>
      <h2>How long we keep it</h2>
      <ul>
        <li><strong>Account data</strong> — for as long as your account exists.</li>
        <li><strong>Search and brand history</strong> — until you delete it, or the account is deleted.</li>
        <li><strong>Sign-in tokens</strong> — refresh tokens expire after 7 days and are rotated on use.</li>
        <li><strong>Password-reset tokens</strong> — expire shortly after being issued.</li>
        <li><strong>Server logs</strong> — kept only as long as needed for security and debugging.</li>
      </ul>
      <p>
        Ask us to delete your account and we delete the account, its search history and its brand
        evaluations. That deletion is permanent.
      </p>
    </section>

    <section>
      <h2>How we protect it</h2>
      <ul>
        <li>Passwords are hashed with bcrypt — never stored in a readable form.</li>
        <li>Sign-in cookies are <strong>httpOnly</strong>, so JavaScript cannot read them, which blunts token theft via cross-site scripting.</li>
        <li>Refresh tokens are stored as hashes and rotate each time they are used.</li>
        <li>All traffic is served over HTTPS.</li>
      </ul>
      <p>
        No system is perfectly secure, and we will not pretend otherwise. If we ever discover a breach
        affecting your data, we will tell you.
      </p>
    </section>

    <section>
      <h2>Your rights (including California)</h2>
      <p>
        If you are a California resident, the CCPA and CPRA give you the rights below. We extend the
        same rights to everyone, because it is simpler and fairer than checking where you live.
      </p>
      <ul>
        <li><strong>Know</strong> — ask what personal information we hold about you.</li>
        <li><strong>Access</strong> — get a copy of it.</li>
        <li><strong>Delete</strong> — have your account and its data erased.</li>
        <li><strong>Correct</strong> — have inaccurate information fixed.</li>
        <li>
          <strong>Opt out of sale or sharing</strong> — there is nothing to opt out of. We do not sell
          or share personal information, and we have not done so in the preceding twelve months.
        </li>
        <li>
          <strong>Non-discrimination</strong> — exercising any of these rights will not degrade your
          service or change what you pay.
        </li>
      </ul>
      <p>
        To exercise any of them, email <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> from the
        address on your account. We will respond within 45 days.
      </p>
    </section>

    <section>
      <h2>Children</h2>
      <p>
        WholesaleOS is a business tool and is not directed at children. We do not knowingly collect
        information from anyone under 16. If you believe a child has created an account, contact us and
        we will remove it.
      </p>
    </section>

    <section>
      <h2>Changes to this policy</h2>
      <p>
        If we change what we collect or who receives it, we will update this page and move the
        effective date at the top. Material changes will be announced to account holders by email.
      </p>
    </section>

    <section>
      <h2>Contact</h2>
      <p>
        Questions, requests, or complaints:{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    </section>
  </LegalLayout>
);

export default Privacy;
