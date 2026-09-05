/* ==========================================================================
   PHONE MOCKUP — PUBLIC MOUNT API
   --------------------------------------------------------------------------
   The one function pages call to drop a 3D phone into the DOM. It hides all
   the plumbing (registry lookup, partial fetch + inject, controller import)
   behind a single call:

     const phone = await mountPhoneMockup(hostEl, { model: "model-2" });
     embedView.mount(phone.screenSlot, { ... });   // works for ANY model

   Every model returns the same shape ({ screenSlot, setPose, destroy }), so
   swapping "model-1" ⇄ "model-2" is a one-word change at the call site.
   ========================================================================== */

import { PHONE_MODELS, PHONE_MODEL_NAMES } from "./registry.js";

const partialCache = new Map();

async function fetchPartial(url) {
  if (partialCache.has(url)) return partialCache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`[phone-mockup] partial failed (${res.status}): ${url}`);
  const html = await res.text();
  partialCache.set(url, html);
  return html;
}

/**
 * Mount a phone model into a host element.
 * @param {HTMLElement} host
 * @param {object} [opts]
 * @param {string} [opts.model="model-1"]  Registered model name.
 * @param {object} [opts.props]            Passed to the model controller.
 * @returns {Promise<{screenSlot:HTMLElement|null, setPose:Function, destroy:Function, model:string}>}
 */
export async function mountPhoneMockup(host, opts = {}) {
  if (!host) throw new Error("[phone-mockup] a host element is required.");

  const model = opts.model || "model-1";
  const entry = PHONE_MODELS[model];
  if (!entry) {
    throw new Error(
      `[phone-mockup] unknown model "${model}". Available: ${PHONE_MODEL_NAMES.join(", ")}`
    );
  }

  const html = await fetchPartial(entry.partial);
  host.innerHTML = html;

  const mod = await entry.controller();
  const controller = mod.mount(host, opts.props || {});

  return { model, ...controller };
}

export { PHONE_MODEL_NAMES } from "./registry.js";
