/* ==========================================================================
   APP BOOTSTRAP  —  the single entry module (loaded by index.html)
   --------------------------------------------------------------------------
   The composition root of the whole application. It:

     1. finds the route outlet in the shell,
     2. creates the router with the declarative route table,
     3. starts routing.

   index.html contains almost no markup and links exactly one stylesheet
   (styles/main.css) and one module (this file). Everything else is composed
   in JS from the modular pieces under src/. That's the "mature, modular"
   arrangement: a thin shell + independent, colocated components.
   ========================================================================== */

import { createRouter } from "./core/router.js";
import { routes } from "./routes/routes.js";

function boot() {
  const outlet = document.querySelector('[data-route-outlet]');
  if (!outlet) {
    console.error("[app] route outlet not found — check index.html shell.");
    return;
  }

  const router = createRouter({ outlet, routes, fallback: "/" });
  router.start();

  // Expose for debugging in the console (handy, harmless).
  window.__voydnet = { router };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
