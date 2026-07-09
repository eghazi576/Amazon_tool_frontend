import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

// Public marketing routes ship prerendered HTML (scripts/prerender.mjs), so the
// container already holds server-shaped markup and React should adopt it rather
// than throw it away and repaint. Authenticated routes fall back to index.html,
// whose #root is empty, and mount normally.
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
