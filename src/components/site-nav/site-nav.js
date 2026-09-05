/* ==========================================================================
   COMPONENT CONTROLLER: site-nav
   --------------------------------------------------------------------------
   Behaviour for the sticky header:

     1. hydrate the [data-i18n] brand wordmark from the content registry,
     2. build the compact "Get Voydnet" CTA via the shared button factory,
     3. toggle .is-scrolled once the page leaves the very top so the bar
        earns its frosted backing + hairline.

   Keeps no copy and no styling of its own — text comes from strings.*.html,
   look from site-nav.css + button.css.
   ========================================================================== */

import { createButton } from "../button/button.js";
import { t, hydrate } from "../../content/strings.js";

export function mount(root, props = {}) {
  // 1) Fill the brand wordmark.
  hydrate(root);

  // 2) Compact primary CTA on the right.
  const ctaHost = root.querySelector('[data-slot="cta"]');
  const cta = createButton({
    label: t("hero.cta.primary", "Get Voydnet"),
    variant: "primary",
    size: "sm",
    onClick: (e) => {
      if (typeof props.onGetVoydnet === "function") props.onGetVoydnet(e);
    },
  });
  if (ctaHost) ctaHost.appendChild(cta);

  // 3) Frost the bar once scrolled off the top (rAF-throttled).
  const bar = root.querySelector('[data-slot="root"]') || root.firstElementChild;
  let ticking = false;
  const apply = () => {
    if (bar) bar.classList.toggle("is-scrolled", window.scrollY > 12);
    ticking = false;
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(apply);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  apply(); // set initial state (handles reloads mid-page)

  return {
    destroy() {
      window.removeEventListener("scroll", onScroll);
    },
  };
}
