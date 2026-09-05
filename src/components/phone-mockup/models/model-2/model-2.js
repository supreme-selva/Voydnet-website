/* ==========================================================================
   PHONE MOCKUP — MODEL 2 CONTROLLER
   --------------------------------------------------------------------------
   Delegates to the shared model controller. Model 2 also uses the
   standardised --pm-rot-* pose variables, so no model-specific behaviour is
   needed here beyond the uniform contract.
   ========================================================================== */

import { createModelController } from "../../model-base.js";

export function mount(root, props = {}) {
  return createModelController(root, props);
}
