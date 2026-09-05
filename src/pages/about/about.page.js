/* ==========================================================================
   PAGE: about  (route "/about")
   --------------------------------------------------------------------------
   A minimal second page whose only job is to prove the routing layer works
   end-to-end: navigating here tears down the showcase (stopping the video),
   renders this content, and a button routes back. Real marketing copy can
   be dropped in later without touching the router.
   ========================================================================== */

import { createButton } from "../../components/button/button.js";

export async function render(outlet, ctx) {
  outlet.innerHTML = `
    <section class="stage">
      <div class="container u-text-center">
        <p class="showcase__eyebrow">About</p>
        <h1 class="showcase__title u-mt-4">Built modular. On purpose.</h1>
        <p class="showcase__subtitle u-mt-4" style="margin-inline:auto;max-width:520px">
          This site is pure HTML, CSS and JavaScript — no framework, no build
          step. Components, styles, routing and embed logic each live in their
          own folder, wired together by a tiny core.
        </p>
        <div class="showcase__actions u-mt-5" data-slot="actions"
             style="justify-content:center"></div>
      </div>
    </section>`;

  const back = createButton({
    label: "Back to showcase",
    variant: "primary",
    size: "lg",
    onClick: () => ctx.router.go("/"),
  });
  outlet.querySelector('[data-slot="actions"]').appendChild(back);

  return { destroy() {} };
}
