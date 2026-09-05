/* ==========================================================================
   COMPONENT CONTROLLER: feature-local
   --------------------------------------------------------------------------
   Composes the fifth section: the "works locally" illustration on the left,
   headline + copy on the right.

     1. hydrate the [data-i18n] copy from the content registry,
     2. set the illustration's source from the asset registry.

   Keeps no copy and no styling of its own — text comes from strings.*.html,
   look from feature-local.css.
   ========================================================================== */

import { hydrate, t } from "../../content/strings.js";
import { ASSETS } from "../../config/assets.js";

export function mount(root, props = {}) {
  hydrate(root);

  const img = root.querySelector('[data-slot="illustration"]');
  if (img) {
    img.src = ASSETS.worksLocallyIllustration;
    img.alt = t("local.headline", "Your data never leaves your hands.");
  }

  return {
    destroy() {
      /* Nothing persistent to tear down. */
    },
  };
}
