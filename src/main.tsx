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
// `dist/index.html` also serves as nginx's SPA fallback for routes that were not
// prerendered (/dashboard, /admin, unknown paths), so the container may hold
// homepage markup that has nothing to do with the current URL. Clearing it is
// what stops that markup leaking into the authenticated app.
container.replaceChildren();

// Paired with the guard prerender.mjs injects into dist/index.html, which hides
// #root when the fallback shell is served for a non-homepage URL. React owns the
// DOM from here, so the guard comes off.
document.documentElement.classList.remove("spa-fallback");

createRoot(container).render(<App />);
