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
import { createMotion } from "../../core/motion.js";

export async function render(outlet, ctx) {
  // Ensure copy is available before components hydrate their [data-i18n].
  await loadStrings("en");

  // Section host slots, stacked in document order. The sticky nav is first so
  // it anchors the top of the page above every section.
  outlet.innerHTML = `
    <div data-slot="site-nav"></div>
    <div data-slot="hero"></div>
    <div data-slot="feature-protect"></div>
    <div data-slot="feature-transparency"></div>
    <div data-slot="feature-seamless"></div>
    <div data-slot="feature-local"></div>
    <div data-slot="final-cta"></div>`;

  const siteNavHost = outlet.querySelector('[data-slot="site-nav"]');
  const heroHost = outlet.querySelector('[data-slot="hero"]');
  const protectHost = outlet.querySelector('[data-slot="feature-protect"]');
  const transparencyHost = outlet.querySelector('[data-slot="feature-transparency"]');
  const seamlessHost = outlet.querySelector('[data-slot="feature-seamless"]');
  const localHost = outlet.querySelector('[data-slot="feature-local"]');
  const finalCtaHost = outlet.querySelector('[data-slot="final-cta"]');

  // Sticky header first (anchors the page, carries the primary CTA).
  const siteNav = await loadComponent("site-nav", siteNavHost, {
    onGetVoydnet: () => console.info("[site-nav] Get Voydnet clicked"),
  });

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

  // With every section in the DOM, start the scroll-choreography engine. It
  // drives all [data-reveal] entrances, [data-parallax] drift and the top
  // progress line declared in the section markup. One integration point for
  // the whole page; torn down with the page so nothing leaks between routes.
  const motion = createMotion(outlet);

  return {
    destroy() {
      if (motion) motion.destroy();
      if (siteNav) siteNav.destroy();
      if (hero) hero.destroy();
      if (featureProtect) featureProtect.destroy();
      if (featureTransparency) featureTransparency.destroy();
      if (featureSeamless) featureSeamless.destroy();
      if (featureLocal) featureLocal.destroy();
      if (finalCta) finalCta.destroy();
    },
  };
}
