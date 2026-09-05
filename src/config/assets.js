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

/** Build an absolute URL for an asset under /assets. */
const asset = (relativePath) => new URL(relativePath, ROOT).href;

export const ASSETS = {
  demoVideo: asset("video/app-screen-video.mp4"),
  oneTapProtectedIllustration: asset("images/One-tap-all-protected-illustration.png"),
  transparencyIllustration1: asset("images/Absolute-transparancy-illustration1.png"),
  transparencyIllustration2: asset("images/Absolute-transparancy-illustration2.png"),
  unrestrictedInternetIllustration: asset("images/Unrestricted-internet-illustration.png"),
  worksLocallyIllustration: asset("images/Works-locally-nothing-goes-out-illustration.png"),
  finalCtaBirdsVideo: asset("video/final-cta-birds.mp4"),
  finalCtaMobileVideo: asset("video/final-cta-mobile.mp4"),
  // Add future assets here, e.g.:
  // logo:       asset("images/logo.svg"),
};
