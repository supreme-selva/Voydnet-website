/* ==========================================================================
   CONFIG: asset registry
   --------------------------------------------------------------------------
   A single, typed-ish map of every media asset the app references. Instead
   of sprinkling raw "assets/foo.mp4" strings through the code, components
   read from here. Move or rename an asset and you update ONE line.

   Paths are resolved relative to this module so they work whether the site
   is opened from disk (file://) or served from any sub-path on a host.
   ========================================================================== */

const ROOT = new URL("../../assets/", import.meta.url);

/* Cache-busting version tag. Bump this string whenever you re-export or crop
   an asset that keeps the same filename — it appends ?v=… to every URL so the
   browser is forced to fetch the fresh file instead of serving a stale cache. */
const ASSET_VERSION = "3";

/** Build an absolute URL for an asset under /assets (with a cache-bust tag). */
const asset = (relativePath) => {
  const url = new URL(relativePath, ROOT);
  url.searchParams.set("v", ASSET_VERSION);
  return url.href;
};

export const ASSETS = {
  demoVideo: asset("video/app-screen-video.mp4"),
  heroIntro: asset("images/One-tap-all-protected-illustration.png"),
  oneTapProtectedIllustration: asset("images/One-tap-protected.png"),
  transparencyIllustration: asset("images/Absolute-transparancy-2.png"),
  transparencyIllustration1: asset("images/Absolute-transparancy-illustration1.png"),
  transparencyIllustration2: asset("images/Absolute-transparancy-illustration2.png"),
  unrestrictedInternetIllustration: asset("images/Unrestricted-internet-illustration.png"),
  worksLocallyIllustration: asset("images/Works-locally-nothing-goes-out-illustration.png"),
  finalCtaBirdsVideo: asset("video/final-cta-birds.mp4"),
  finalCtaMobileVideo: asset("video/final-cta-mobile.mp4"),
  // Add future assets here, e.g.:
  // logo:       asset("images/logo.svg"),
};
