/* ==========================================================================
   PAGE: showcase  (route "/")
   --------------------------------------------------------------------------
   The landing page. It composes the site's sections top-to-bottom, each an
   independent component mounted into its own slot:

     1. hero            → headline + CTA, model-1 phone playing the demo video
     2. feature-protect → model-2 phone with illustration + protection copy

   Responsibilities kept deliberately thin: ensure the content registry is
   loaded, then mount each section. All copy lives in strings.*.html; all
   look lives in the components' own CSS.
   ========================================================================== */

import { loadComponent } from "../../core/component.js";
import { loadStrings } from "../../content/strings.js";

export async function render(outlet, ctx) {
  // Ensure copy is available before components hydrate their [data-i18n].
  await loadStrings("en");

  // Section host slots, stacked in document order.
  outlet.innerHTML = `
    <div data-slot="hero"></div>
    <div data-slot="feature-protect"></div>
    <div data-slot="feature-transparency"></div>
    <div data-slot="feature-seamless"></div>
    <div data-slot="feature-local"></div>
    <div data-slot="final-cta"></div>`;

  const heroHost = outlet.querySelector('[data-slot="hero"]');
  const protectHost = outlet.querySelector('[data-slot="feature-protect"]');
  const transparencyHost = outlet.querySelector('[data-slot="feature-transparency"]');
  const seamlessHost = outlet.querySelector('[data-slot="feature-seamless"]');
  const localHost = outlet.querySelector('[data-slot="feature-local"]');
  const finalCtaHost = outlet.querySelector('[data-slot="final-cta"]');

  // Mount each section component.
  const hero = await loadComponent("hero", heroHost, {
    onGetVoydnet: () => {
      // Wire to a real download / route later. Placeholder for now.
      console.info("[showcase] Get Voydnet clicked");
    },
  });

  const featureProtect = await loadComponent("feature-protect", protectHost);
  const featureTransparency = await loadComponent("feature-transparency", transparencyHost);
  const featureSeamless = await loadComponent("feature-seamless", seamlessHost);
  const featureLocal = await loadComponent("feature-local", localHost);
  const finalCta = await loadComponent("final-cta", finalCtaHost, {
    onDownload: () => console.info("[final-cta] Download Voydnet clicked"),
  });

  return {
    destroy() {
      if (hero) hero.destroy();
      if (featureProtect) featureProtect.destroy();
      if (featureTransparency) featureTransparency.destroy();
      if (featureSeamless) featureSeamless.destroy();
      if (featureLocal) featureLocal.destroy();
      if (finalCta) finalCta.destroy();
    },
  };
}
