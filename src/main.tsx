import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

// Public routes ship prerendered HTML (scripts/prerender.mjs) so that crawlers
// receive real markup. We deliberately do NOT hydrate it.
//
// The snapshot is captured from a *client* render, so React's useId values are
// the client flavour (`:r0:`). A hydration pass generates the server flavour
// (`:R0:`), so every Radix id and aria-controls in the FAQ accordions mismatches,
// React throws #418/#423/#425 and discards the whole root anyway. Hydrating a
// client-render snapshot only buys console errors. Mount fresh instead.
//
// createRoot empties the container as part of its first commit, so the swap from
// prerendered markup to React's tree happens in a single paint. Clearing it here
// first would expose a blank frame -- measured, one frame at 4x CPU throttle.
// That commit-time clear is also what keeps `dist/index.html`, which nginx reuses
// as the SPA fallback, from leaking homepage markup into /dashboard.

// Paired with the guard prerender.mjs injects into dist/index.html, which hides
// #root when the fallback shell is served for a non-homepage URL. React owns the
// DOM from here, so the guard comes off.
document.documentElement.classList.remove("spa-fallback");

// `data-prerendered` names the route this HTML was captured for. It suppresses
// entry animations (index.css) on the paint that already shows its content. When
// the fallback shell serves some other URL, this document is not that route's
// snapshot, nothing was painted for it, and the animations should run normally.
if (document.documentElement.dataset.prerendered !== window.location.pathname) {
  delete document.documentElement.dataset.prerendered;
}

createRoot(container).render(<App />);
