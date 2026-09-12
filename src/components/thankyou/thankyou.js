/* ==========================================================================
   COMPONENT CONTROLLER: thankyou
   --------------------------------------------------------------------------
   Wires the /download "Thank you" screen: point the illustration above the
   headline at its registered asset, then hydrate the [data-i18n] copy from
   the content registry.

   Returns a controller with a no-op destroy for a consistent lifecycle.
   ========================================================================== */

import { hydrate, t } from "../../content/strings.js";
import { ASSETS, DOWNLOAD_URL, downloadVoydnet } from "../../config/assets.js";

export function mount(root) {
  const img = root.querySelector('[data-slot="image"]');
  if (img) {
    img.src = ASSETS.thankyouImage;
    img.alt = t("thankyou.headline", "Thank you for choosing VoydNet");
  }

  // Hydrate copy first so the [data-slot="download-link"] anchor (which lives
  // inside the download-hint string) exists before we wire it.
  hydrate(root);

  // Point the "click here" fallback link at the APK. It's a real, deep-linkable
  // URL so it works on right-click / share, and clicking it re-triggers the
  // download flow without leaving the page.
  const link = root.querySelector('[data-slot="download-link"]');
  let onClick;
  if (link) {
    link.href = DOWNLOAD_URL;
    onClick = (e) => {
      e.preventDefault();
      downloadVoydnet(DOWNLOAD_URL, { navigate: false });
    };
    link.addEventListener("click", onClick);
  }

  return {
    destroy() {
      if (link && onClick) link.removeEventListener("click", onClick);
    },
  };
}
