/* ==========================================================================
   COMPONENT CONTROLLER: feature-seamless
   --------------------------------------------------------------------------
   Composes the fourth section: main copy (left), centred illustration
   (center), and a hover-reveal accordion (right).

     1. hydrate the [data-i18n] copy from the content registry,
     2. set the illustration source from the asset registry,
     3. progressively enhance the accordion so it also works on tap / keyboard
        (hover alone is handled purely in CSS). Only one item stays open.

   The primary reveal is CSS :hover per the design; this JS only adds tap and
   keyboard support so touch users and keyboard users get the same behaviour.
   ========================================================================== */

import { hydrate } from "../../content/strings.js";
import { ASSETS } from "../../config/assets.js";

export function mount(root, props = {}) {
  // 1) Fill copy.
  hydrate(root);

  // 2) Point the illustration at the registered asset.
  const img = root.querySelector('[data-slot="illustration"]');
  if (img) img.src = ASSETS.unrestrictedInternetIllustration;

  // 3) Tap / keyboard support for the accordion (one open at a time).
  const list = root.querySelector('[data-slot="list"]');
  const items = list ? [...list.querySelectorAll(".fseam__item")] : [];
  const cleanups = [];

  items.forEach((item) => {
    const title = item.querySelector(".fseam__item-title");
    if (!title) return;

    // Make the title focusable + announce it as an expandable control.
    title.setAttribute("tabindex", "0");
    title.setAttribute("role", "button");
    title.setAttribute("aria-expanded", "false");

    const open = (state) => {
      items.forEach((el) => {
        const on = el === item && state;
        el.classList.toggle("is-open", on);
        const t = el.querySelector(".fseam__item-title");
        if (t) t.setAttribute("aria-expanded", on ? "true" : "false");
      });
    };

    const onClick = () => open(!item.classList.contains("is-open"));
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(!item.classList.contains("is-open"));
      }
    };

    title.addEventListener("click", onClick);
    title.addEventListener("keydown", onKey);
    cleanups.push(() => {
      title.removeEventListener("click", onClick);
      title.removeEventListener("keydown", onKey);
    });
  });

  return {
    destroy() {
      cleanups.forEach((fn) => fn());
    },
  };
}
