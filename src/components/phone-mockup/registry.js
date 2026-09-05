/* ==========================================================================
   PHONE MOCKUP — MODEL REGISTRY
   --------------------------------------------------------------------------
   The single place that knows which phone models exist and where their parts
   live. Pages request a model by NAME ("model-1", "model-2", ...) and never
   hard-code file paths. Add a new model by:

     1. creating src/components/phone-mockup/models/model-N/ with
        model-N.html / .css / .js (see model-1 for the shape),
     2. @import the CSS in src/styles/main.css,
     3. registering one line below.

   Each entry provides the partial URL and a lazy controller import so a
   model's controller code only loads when that model is actually used.
   ========================================================================== */

const MODELS_ROOT = new URL("./models/", import.meta.url);

export const PHONE_MODELS = {
  "model-1": {
    label: "Hole-punch (thin bezel)",
    partial: new URL("model-1/model-1.html", MODELS_ROOT).href,
    controller: () => import("./models/model-1/model-1.js"),
  },
  "model-2": {
    label: "Metal frame (glass sheen)",
    partial: new URL("model-2/model-2.html", MODELS_ROOT).href,
    controller: () => import("./models/model-2/model-2.js"),
  },
  "model-3": {
    label: "Dual-phone layered composition",
    partial: new URL("model-3/model-3.html", MODELS_ROOT).href,
    controller: () => import("./models/model-3/model-3.js"),
  },
};

/** Convenience: list of registered model names, in declaration order. */
export const PHONE_MODEL_NAMES = Object.keys(PHONE_MODELS);
