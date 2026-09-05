/* ==========================================================================
   COMPONENT CONTROLLER: feature-transparency
   --------------------------------------------------------------------------
   Composes the third section: a layered pair of model-3 phones on the left,
   each showing one of the two "absolute transparency" illustrations, and the
   headline + copy on the right.

     1. hydrate the [data-i18n] copy from the content registry,
     2. mount two model-3 phones into their slots,
     3. render one illustration into each phone screen via embed-view (image).

   The illustrations are ~720x1600 (0.45) — the same ratio as the phone
   screen — so `fit: cover` fills the screen edge-to-edge with no cropping.
   Returns a controller that tears every child down on cleanup.
   ========================================================================== */

import { hydrate } from "../../content/strings.js";
import { mountPhoneMockup } from "../phone-mockup/phone-mockup.js";
import { mount as mountEmbed } from "../embed-view/embed-view.js";
import { ASSETS } from "../../config/assets.js";

/**
 * @param {HTMLElement} root  Element the partial was injected into.
 * @param {object} [props]
 * @returns {Promise<{ destroy: Function }>}
 */
export async function mount(root, props = {}) {
  // 1) Fill copy.
  hydrate(root);

  const teardown = [];

  // Helper: mount a model-3 phone into a slot and show an illustration in it.
  async function mountPhoneWith(slotName, src, title) {
    const host = root.querySelector(`[data-slot="${slotName}"]`);
    if (!host) return;
    const phone = await mountPhoneMockup(host, { model: "model-3" });
    let embed = null;
    if (phone.screenSlot) {
      embed = mountEmbed(phone.screenSlot, {
        kind: "image",
        src,
        fit: "cover",   // ratio matches the screen → fills with no crop
        title,
      });
    }
    teardown.push(() => { if (embed) embed.destroy(); phone.destroy(); });
  }

  // 2 + 3) Mount both phones with their illustrations.
  await mountPhoneWith("device-1", ASSETS.transparencyIllustration1, "Blocked activity, in real time");
  await mountPhoneWith("device-2", ASSETS.transparencyIllustration2, "Severed tracking connections");

  return {
    destroy() {
      teardown.forEach((fn) => fn());
    },
  };
}
