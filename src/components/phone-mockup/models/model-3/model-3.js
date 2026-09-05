/* ==========================================================================
   PHONE MOCKUP — MODEL 3 CONTROLLER
   --------------------------------------------------------------------------
   Delegates to the shared model controller. Uses the standardised --pm-rot-*
   pose variables, so no model-specific behaviour is needed beyond the uniform
   contract ({ screenSlot, setPose, destroy }).
   ========================================================================== */

import { createModelController } from "../../model-base.js";

export function mount(root, props = {}) {
  return createModelController(root, props);
}
