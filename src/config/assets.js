/* ==========================================================================
   CONFIG: asset registry
   --------------------------------------------------------------------------
   A single, typed-ish map of every media asset the app references. Instead
   of sprinkling raw "assets/foo.webp" strings through the code, components
   read from here. Move or rename an asset and you update ONE line.

   Paths are resolved relative to this module so they work whether the site
   is opened from disk (file://) or served from any sub-path on a host.
   ========================================================================== */

const ROOT = new URL("../../assets/", import.meta.url);

/* Cache-busting version tag. Bump this string whenever you re-export or crop
   an asset that keeps the same filename — it appends ?v=… to every URL so the
   browser is forced to fetch the fresh file instead of serving a stale cache. */
const ASSET_VERSION = "4";

/** Build an absolute URL for an asset under /assets (with a cache-bust tag). */
const asset = (relativePath) => {
  const url = new URL(relativePath, ROOT);
  url.searchParams.set("v", ASSET_VERSION);
  return url.href;
};

export const ASSETS = {
  heroIntro: asset("images/One-tap-all-protected-illustration.webp"),
  oneTapProtectedIllustration: asset("images/One-tap-protected.webp"),
  transparencyIllustration: asset("images/Absolute-transparancy-2.webp"),
  transparencyIllustration1: asset("images/Absolute-transparancy-illustration1.webp"),
  transparencyIllustration2: asset("images/Absolute-transparancy-illustration2.webp"),
  unrestrictedInternetIllustration: asset("images/Unrestricted-internet-illustration.webp"),
  worksLocallyIllustration: asset("images/Works-locally-nothing-goes-out-illustration.webp"),
  thankyouImage: asset("images/Thankyou-screen-Image.webp"),
  // Brand logo shown left of the "Voydnet" wordmark in the site header.
  brandLogo: asset("images/BrandLogo-VoydNet.webp"),
};

/* --------------------------------------------------------------------------
   Download: the shipped Android APK. This is an external (Supabase) URL, so
   it is NOT run through asset()/ASSET_VERSION — it points straight at the
   published release. Every "Get Voydnet" / "Download Voydnet" CTA resolves
   here so there is a single place to bump the version.
   -------------------------------------------------------------------------- */
export const DOWNLOAD_URL =
  "https://rvxinwijmmekxemvplji.supabase.co/storage/v1/object/public/App%20releases%20apks/VoydNet-1.0.apk";

/**
 * Trigger a browser download of the VoydNet APK, then route to the /download
 * "Thank you" screen so the user lands on the closing video/message once the
 * download has started.
 *
 * @param {string} [url]            The APK URL (defaults to the shipped release).
 * @param {object} [opts]
 * @param {boolean} [opts.navigate=true]  Set false to download without routing.
 */
export function downloadVoydnet(url = DOWNLOAD_URL, opts = {}) {
  const { navigate = true } = opts;

  const a = document.createElement("a");
  a.href = url;
  a.download = "";                 // hint the browser to save rather than navigate
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();

  // Once the download has started, show the "Thank you" screen. Hash routing
  // means a plain hash change drives the router with no dependency on it here.
  if (navigate && location.hash.slice(1).split("?")[0] !== "/download") {
    location.hash = "#/download";
  }
}
