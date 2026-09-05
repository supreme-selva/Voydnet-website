/* ==========================================================================
   COMPONENT CONTROLLER: final-cta
   --------------------------------------------------------------------------
   Wires the layered closing section:

     1. hydrate the [data-i18n] copy from the content registry,
     2. point both videos (birds background + centred mobile) at their assets
        and start them looping/playing simultaneously (muted → autoplay-safe,
        with a one-time click fallback if a browser stalls autoplay),
     3. build the "Download Voydnet" button via the shared button factory.

   Returns a controller that pauses the videos and removes listeners on
   cleanup so nothing keeps running after navigating away.
   ========================================================================== */

import { hydrate, t } from "../../content/strings.js";
import { createButton } from "../button/button.js";
import { ASSETS } from "../../config/assets.js";

const ICON_DOWNLOAD = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 3v12"></path><path d="M7 10l5 5 5-5"></path>
    <path d="M5 21h14"></path>
  </svg>`;

export function mount(root, props = {}) {
  // 1) Fill copy.
  hydrate(root);

  // 2) Wire and start both videos.
  const birds = root.querySelector('[data-slot="birds"]');
  const mobile = root.querySelector('[data-slot="mobile"]');
  const videos = [birds, mobile].filter(Boolean);

  videos.forEach((v) => {
    v.muted = true;          // required for simultaneous autoplay
    v.loop = true;           // loop forever
    v.playsInline = true;
    v.setAttribute("playsinline", "");
  });
  if (birds) birds.src = ASSETS.finalCtaBirdsVideo;
  if (mobile) mobile.src = ASSETS.finalCtaMobileVideo;

  const playAll = () => videos.forEach((v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); });
  playAll();
  // Fallback: if a browser blocks autoplay, start on first interaction.
  const onFirstClick = () => playAll();
  document.addEventListener("click", onFirstClick, { once: true });

  // 3) Build the CTA button.
  const ctaHost = root.querySelector('[data-slot="cta"]');
  const download = createButton({
    label: t("cta.button", "Download Voydnet"),
    variant: "primary",
    size: "lg",
    icon: ICON_DOWNLOAD,
    onClick: (e) => {
      if (typeof props.onDownload === "function") props.onDownload(e);
    },
  });
  if (ctaHost) ctaHost.appendChild(download);

  return {
    destroy() {
      document.removeEventListener("click", onFirstClick);
      videos.forEach((v) => { try { v.pause(); } catch (_) {} });
    },
  };
}
