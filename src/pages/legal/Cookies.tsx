import LegalLayout from "./LegalLayout";
import { LEGAL_EMAIL } from "@/lib/legal";

/** The real cookies, from controllers/auth/authController.js — not a generic list. */
const COOKIES = [
  {
    name: "access_token",
    purpose: "Proves you are signed in on each request. Without it you would be logged out on every page load.",
    life: "15 minutes",
    kind: "Strictly necessary",
  },
  {
    name: "refresh_token",
    purpose:
      "Issues a fresh access token when the short one expires, so you are not signed out every fifteen minutes. Sent only to the sign-in endpoints, and rotated each time it is used.",
    life: "7 days",
    kind: "Strictly necessary",
  },
];

const Cookies = () => (
  <LegalLayout
    path="/cookies"
    title="Cookie Policy"
    intro="WholesaleOS uses two cookies. Both exist to keep you signed in. Neither tracks you."
  >
    <section>
      <h2>The short version</h2>
      <ul>
        <li>
          <strong>The public pages set no cookies at all.</strong> The homepage, the FAQ and these
          policies can be read without a single cookie being written to your browser.
        </li>
        <li>
          <strong>Signing in sets two cookies.</strong> Both are strictly necessary to keep you signed
          in. Both are <strong>httpOnly</strong>, meaning JavaScript on the page cannot read them.
        </li>
        <li>
          <strong>There are no analytics, advertising or tracking cookies.</strong> Not from us, and we
          have not embedded anyone else's.
        </li>
        <li>
          <strong>We show no cookie banner</strong> — because we set nothing that would legally require
          your consent. Strictly necessary cookies do not.
        </li>
      </ul>
    </section>

    <section>
      <h2>The cookies we set</h2>
      {COOKIES.map((c) => (
        <div key={c.name} className="mt-5 rounded-xl border border-border/60 bg-card/60 p-5">
          <h3 className="!mt-0 font-mono text-sm text-primary">{c.name}</h3>
          <p className="!mt-2 text-sm">{c.purpose}</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
            <span>
              <strong className="text-foreground">Lifetime:</strong> {c.life}
            </span>
            <span>
              <strong className="text-foreground">Category:</strong> {c.kind}
            </span>
            <span>
              <strong className="text-foreground">httpOnly:</strong> yes
            </span>
          </div>
        </div>
      ))}
    </section>

    <section>
      <h2>Things stored in your browser (not cookies)</h2>
      <p>
        Two small values are kept in your browser's local storage. They never leave your device and are
        never sent to our server:
      </p>
      <ul>
        <li>
          <strong>theme</strong> — whether you chose light or dark mode, so the page does not flash the
          wrong one on load.
        </li>
        <li>
          <strong>asin_history</strong> — a short list of your recent lookups, so the interface can
          show them instantly instead of waiting on the network.
        </li>
      </ul>
      <p>Clearing your browser's site data removes both.</p>
    </section>

    <section>
      <h2>Third parties</h2>
      <p>We embed no advertising or analytics scripts. Two third parties are nevertheless involved in delivering the site:</p>
      <ul>
        <li>
          <strong>Cloudflare</strong> — sits in front of the site for security and caching. It may set
          its own security cookie to distinguish humans from bots. It is not used to track you across
          sites and we cannot read it.
        </li>
        <li>
          <strong>Google Fonts</strong> — the site's typefaces load from Google's servers. This sets no
          cookie, but it does mean your IP address reaches Google when a page loads.
        </li>
      </ul>
    </section>

    <section>
      <h2>Turning them off</h2>
      <p>
        You can block or delete cookies in your browser settings. Be aware that blocking our two
        cookies means <strong>you will not be able to stay signed in</strong> — they are what
        authentication is built on. The public pages will still work perfectly, because they never
        needed a cookie in the first place.
      </p>
    </section>

    <section>
      <h2>Changes</h2>
      <p>
        If we ever add a cookie, this page is updated before it ships, and the effective date at the top
        changes with it.
      </p>
    </section>

    <section>
      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>. See also the{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>
    </section>
  </LegalLayout>
);

export default Cookies;
