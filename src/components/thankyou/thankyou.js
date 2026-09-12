/* ==========================================================================
   COMPONENT CONTROLLER: thankyou
   --------------------------------------------------------------------------
   Wires the /download "Thank you" screen: point the illustration above the
   headline at its registered asset, then hydrate the [data-i18n] copy from
   the content registry.

   Returns a controller with a no-op destroy for a consistent lifecycle.
   ========================================================================== */

import { hydrate, t } from "../../content/strings.js";
import { ASSETS } from "../../config/assets.js";

export function mount(root) {
  const img = root.querySelector('[data-slot="image"]');
  if (img) {
    img.src = ASSETS.thankyouImage;
    img.alt = t("thankyou.headline", "Thank you for choosing VoydNet");
  }

  hydrate(root);

  return {
    destroy() {},
  };
}
