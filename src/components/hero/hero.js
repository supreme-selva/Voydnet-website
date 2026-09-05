/* ==========================================================================
   COMPONENT CONTROLLER: hero
   --------------------------------------------------------------------------
   Behaviour for the hero section:

     1. hydrate the [data-i18n] placeholders from the active content registry,
     2. build the primary "Get Voydnet" button (with a download icon) via the
        shared button factory and mount it into the CTA slot,
     3. return the uniform controller ({ destroy }).

   The controller keeps NO copy and NO styling of its own — text comes from
   strings.*.html, look comes from hero.css + button.css. That separation is
   what makes the section clean to translate and restyle.
   ========================================================================== */

import { createButton } from "../button/button.js";
import { t, hydrate } from "../../content/strings.js";
import { mountPhoneMockup } from "../phone-mockup/phone-mockup.js";
import { mount as mountEmbed } from "../embed-view/embed-view.js";
import { ASSETS } from "../../config/assets.js";

/* Inline download glyph for the CTA (stroke inherits button colour). */
const ICON_DOWNLOAD = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 3v12"></path>
    <path d="M7 10l5 5 5-5"></path>
    <path d="M5 21h14"></path>
  </svg>`;

/**
 * @param {HTMLElement} root  Element the hero partial was injected into.
 * @param {object} [props]
 * @param {Function} [props.onGetVoydnet]  Click handler for the primary CTA.
 * @returns {Promise<{ destroy: Function }>}
 */
export async function mount(root, props = {}) {
  // 1) Fill copy from the content registry.
  hydrate(root);

  // 2) Build + mount the primary CTA.
  const ctaHost = root.querySelector('[data-slot="cta"]');
  const primary = createButton({
    label: t("hero.cta.primary", "Get Voydnet"),
    variant: "primary",
    size: "lg",
    icon: ICON_DOWNLOAD,
    onClick: (e) => {
      if (typeof props.onGetVoydnet === "function") props.onGetVoydnet(e);
    },
  });
  if (ctaHost) ctaHost.appendChild(primary);

  // 3) Mount the floating model-1 phone on the right, backdrop-free, and
  //    loop the demo video inside its screen.
  const deviceHost = root.querySelector('[data-slot="device"]');
  let phone = null;
  let embed = null;
  if (deviceHost) {
    phone = await mountPhoneMockup(deviceHost, { model: "model-1" });
    if (phone.screenSlot) {
      embed = mountEmbed(phone.screenSlot, {
        kind: "video",
        src: ASSETS.demoVideo,
        autoplay: true,
        loop: true,
        muted: true,
        title: "Voydnet app demo",
      });
    }
  }

  return {
    destroy() {
      if (embed) embed.destroy();
      if (phone) phone.destroy();
    },
  };
}
