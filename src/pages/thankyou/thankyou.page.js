/* ==========================================================================
   PAGE: thankyou  (route "/download")
   --------------------------------------------------------------------------
   The "Thank you" screen shown once a download has started. It composes a
   single section:

     1. thankyou → headline + the looping Final CTA video, resized responsively
                   to the horizontal space (never cropped).

   Responsibilities kept deliberately thin: ensure the content registry is
   loaded, then mount the section.
   ========================================================================== */

import { loadComponent } from "../../core/component.js";
import { loadStrings } from "../../content/strings.js";
import { createMotion } from "../../core/motion.js";
import { downloadVoydnet } from "../../config/assets.js";

export async function render(outlet, ctx) {
  // Ensure copy is available before components hydrate their [data-i18n].
  await loadStrings("en");

  outlet.innerHTML = `
    <div data-slot="site-nav"></div>
    <div data-slot="thankyou"></div>`;

  const siteNavHost = outlet.querySelector('[data-slot="site-nav"]');
  const thankyouHost = outlet.querySelector('[data-slot="thankyou"]');

  // Sticky header first (anchors the page). Its CTA re-triggers the download.
  const siteNav = await loadComponent("site-nav", siteNavHost, {
    onGetVoydnet: () => downloadVoydnet(),
  });

  const thankyou = await loadComponent("thankyou", thankyouHost);

  const motion = createMotion(outlet);

  return {
    destroy() {
      if (motion) motion.destroy();
      if (siteNav) siteNav.destroy();
      if (thankyou) thankyou.destroy();
    },
  };
}
