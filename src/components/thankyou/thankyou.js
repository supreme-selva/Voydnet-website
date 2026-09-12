/* ==========================================================================
   COMPONENT CONTROLLER: thankyou
   --------------------------------------------------------------------------
   Wires the /download "Thank you" screen: hydrate the [data-i18n] copy from
   the content registry. The screen is just the headline, so there is nothing
   else to wire.

   Returns a controller with a no-op destroy for a consistent lifecycle.
   ========================================================================== */

import { hydrate } from "../../content/strings.js";

export function mount(root) {
  hydrate(root);

  return {
    destroy() {},
  };
}
