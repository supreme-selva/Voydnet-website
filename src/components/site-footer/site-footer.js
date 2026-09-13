/* ==========================================================================
   COMPONENT CONTROLLER: site-footer  (the closing "bottom sheet")
   --------------------------------------------------------------------------
   Wires the footer sheet:

     1. hydrate the [data-i18n] copy from the content registry,
     2. point the brand logo at the registered VoydNet asset,
     3. stamp the current year into the © line,
     4. wire the "Get VoydNet" store link to the download flow (falls back to
        a hash href so it still works with no controller props).

   The FAQs and Terms links resolve to hash routes you'll add separately; they
   are plain anchors here so no wiring changes are needed once those pages/
   sheets exist. Returns a controller with a no-op destroy for a consistent
   lifecycle contract.
   ========================================================================== */

import { hydrate } from "../../content/strings.js";
import { ASSETS } from "../../config/assets.js";

export function mount(root, props = {}) {
  // 1) Fill copy.
  hydrate(root);

  // 2) Brand logo.
  const logo = root.querySelector('[data-slot="logo"]');
  if (logo) logo.src = ASSETS.brandLogo;

  // 3) Current year in the copyright line.
  const year = root.querySelector('[data-slot="year"]');
  if (year) year.textContent = String(new Date().getFullYear());

  // 4) "Get VoydNet" store link → download flow when provided.
  const get = root.querySelector('[data-slot="get"]');
  if (get && typeof props.onGetVoydnet === "function") {
    get.addEventListener("click", (e) => {
      e.preventDefault();
      props.onGetVoydnet(e);
    });
  }

  return {
    destroy() {},
  };
}
