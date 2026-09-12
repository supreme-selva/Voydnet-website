/* ==========================================================================
   COMPONENT CONTROLLER: final-cta
   --------------------------------------------------------------------------
   Wires the closing section:

     1. hydrate the [data-i18n] copy from the content registry,
     2. build the "Download Voydnet" button via the shared button factory.

   The closing video now lives on the /download "Thank you" screen, which the
   download flow routes to.

   Returns a controller (no-op destroy) for a consistent lifecycle contract.
   ========================================================================== */

import { hydrate, t } from "../../content/strings.js";
import { createButton } from "../button/button.js";

const ICON_DOWNLOAD = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 3v12"></path><path d="M7 10l5 5 5-5"></path>
    <path d="M5 21h14"></path>
  </svg>`;

export function mount(root, props = {}) {
  // 1) Fill copy.
  hydrate(root);

  // 2) Build the CTA button.
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
    destroy() {},
  };
}
