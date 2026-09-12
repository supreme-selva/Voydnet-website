/* ==========================================================================
   COMPONENT CONTROLLER: thankyou
   --------------------------------------------------------------------------
   Wires the /download "Thank you" screen:

     1. hydrate the [data-i18n] copy from the content registry,
     2. point the single looping video at the Final CTA asset and start it
        (muted → autoplay-safe, with a one-time click fallback if a browser
        stalls autoplay).

   Returns a controller that pauses the video and removes listeners on cleanup
   so nothing keeps running after navigating away.
   ========================================================================== */

import { hydrate } from "../../content/strings.js";
import { ASSETS } from "../../config/assets.js";

export function mount(root) {
  // 1) Fill copy.
  hydrate(root);

  // 2) Wire the single looping video.
  const video = root.querySelector('[data-slot="video"]');
  var onFirstClick = null;
  if (video) {
    video.muted = true;          // required for autoplay
    video.loop = true;           // loop forever
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.src = ASSETS.finalCtaVideo;

    const play = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    play();
    // Fallback: if a browser blocks autoplay, start on first interaction.
    onFirstClick = () => play();
    document.addEventListener("click", onFirstClick, { once: true });
  }

  return {
    destroy() {
      if (typeof onFirstClick === "function") {
        document.removeEventListener("click", onFirstClick);
      }
      if (video) { try { video.pause(); } catch (_) {} }
    },
  };
}
