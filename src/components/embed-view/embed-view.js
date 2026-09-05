/* ==========================================================================
   COMPONENT CONTROLLER: embed-view
   --------------------------------------------------------------------------
   Owns everything about "what plays inside the phone screen". It renders one
   of two embed kinds into a given mount element:

     - kind: "video"  → a looping, muted, autoplaying <video>
     - kind: "iframe" → an <iframe> (for a live web UX or YouTube/Vimeo)

   All the autoplay-policy handling (muted-autoplay, file:// stalls, tap-to-
   start fallback) is encapsulated here so pages don't repeat it. This is the
   "embed view logic" layer the architecture calls for.

   Public API:
     mount(mountEl, props) -> { play, pause, setSource, destroy }
   ========================================================================== */

const ICON_PLAY = `
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z"></path>
  </svg>`;

/**
 * @param {HTMLElement} mountEl  Where the embed is rendered (phone screen slot).
 * @param {object} props
 * @param {"video"|"iframe"} [props.kind="video"]
 * @param {string} props.src     Media URL (mp4 for video, page URL for iframe).
 * @param {boolean} [props.autoplay=true]
 * @param {boolean} [props.loop=true]
 * @param {boolean} [props.muted=true]
 * @param {string}  [props.title]  Accessible title (used for iframes).
 * @returns {{ play:Function, pause:Function, setSource:Function, destroy:Function }}
 */
export function mount(mountEl, props = {}) {
  const {
    kind = "video",
    src,
    autoplay = true,
    loop = true,
    muted = true,
    title = "Embedded view",
  } = props;

  if (!mountEl) throw new Error("[embed-view] mount element is required.");
  if (!src) throw new Error("[embed-view] a `src` is required.");

  mountEl.innerHTML = "";
  let el;
  let hint = null;
  const cleanups = [];

  if (kind === "image") {
    // ---- Static image embed (e.g. an app illustration) ----
    el = document.createElement("img");
    el.className = "embed-frame";
    el.src = src;
    el.alt = title;
    el.decoding = "async";
    el.loading = "lazy";
    // Let callers choose how the image fits the screen (cover|contain|fill).
    if (props.fit) el.style.objectFit = props.fit;
    mountEl.appendChild(el);
  } else if (kind === "iframe") {
    el = document.createElement("iframe");
    el.className = "embed-frame";
    el.setAttribute("title", title);
    el.setAttribute("scrolling", "no");
    el.setAttribute("allow", "autoplay; fullscreen");
    el.src = src;
    mountEl.appendChild(el);
  } else {
    // ---- Video embed ----
    el = document.createElement("video");
    el.className = "embed-frame";
    el.src = src;
    el.muted = muted;         // required for autoplay in modern browsers
    el.loop = loop;
    el.playsInline = true;
    el.setAttribute("playsinline", "");
    if (autoplay) el.autoplay = true;
    mountEl.appendChild(el);

    // Tap-to-play affordance shown only if autoplay is blocked.
    hint = document.createElement("div");
    hint.className = "embed-play-hint is-hidden";
    hint.innerHTML = `<span class="play-glyph">${ICON_PLAY}</span>`;
    mountEl.appendChild(hint);

    const tryPlay = () => {
      const p = el.play();
      if (p && typeof p.then === "function") {
        p.then(() => hideHint()).catch(() => showHint());
      }
    };
    const showHint = () => hint && hint.classList.remove("is-hidden");
    const hideHint = () => hint && hint.classList.add("is-hidden");

    const onHintClick = () => { hideHint(); el.play().catch(() => {}); };
    const onDocClick = () => { el.play().catch(() => {}); };

    hint.addEventListener("click", onHintClick);
    document.addEventListener("click", onDocClick, { once: true });
    cleanups.push(() => hint.removeEventListener("click", onHintClick));
    cleanups.push(() => document.removeEventListener("click", onDocClick));

    if (autoplay) tryPlay();
  }

  return {
    play() {
      if (el.play) el.play().catch(() => {});
    },
    pause() {
      if (el.pause) el.pause();
    },
    setSource(nextSrc) {
      el.src = nextSrc;
      if (el.load) el.load();
    },
    destroy() {
      cleanups.forEach((fn) => fn());
      if (el && el.pause) el.pause();
      mountEl.innerHTML = "";
    },
  };
}
