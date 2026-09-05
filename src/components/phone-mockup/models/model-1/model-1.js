/* ==========================================================================
   PHONE MOCKUP — MODEL 1 CONTROLLER
   --------------------------------------------------------------------------
   Thin wrapper over the shared model controller. Model 1 uses the default
   --pm-rot-* pose variables, so there's nothing model-specific to add beyond
   delegating. Kept as its own file so each model remains independently
   discoverable and swappable.
   ========================================================================== */

import { createModelController } from "../../model-base.js";

export function mount(root, props = {}) {
  return createModelController(root, props);
}
