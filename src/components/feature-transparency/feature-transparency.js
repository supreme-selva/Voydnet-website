/* ==========================================================================
   COMPONENT CONTROLLER: feature-transparency
   --------------------------------------------------------------------------
   Composes the third section: the "absolute transparency" illustration on the
   left, and the headline + copy on the right.

     1. hydrate the [data-i18n] copy from the content registry,
     2. set the illustration's source from the asset registry.

   Keeps no copy and no styling of its own — text comes from strings.*.html,
   look from feature-transparency.css.
   ========================================================================== */

import { hydrate, t } from "../../content/strings.js";
import { ASSETS } from "../../config/assets.js";

/**
 * @param {HTMLElement} root  Element the partial was injected into.
 * @param {object} [props]
 * @returns {{ destroy: Function }}
 */
export function mount(root, props = {}) {
  // 1) Fill copy.
  hydrate(root);

  // 2) Point the illustration at the registered asset.
  const img = root.querySelector('[data-slot="illustration"]');
  if (img) {
    img.src = ASSETS.transparencyIllustration;
    img.alt = t("transparency.headline", "Absolute transparency. Nothing stays hidden.");
  }

  return {
    destroy() {
      /* Nothing persistent to tear down. */
    },
  };
}
