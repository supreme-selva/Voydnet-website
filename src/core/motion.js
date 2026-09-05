/* ==========================================================================
   CORE: motion  —  the scroll-choreography engine
   --------------------------------------------------------------------------
   A tiny, framework-free engine that brings the page to life on scroll while
   staying true to the site's philosophy: no dependencies, declarative markup,
   token-driven look. Components opt in purely with data-attributes — they own
   no animation code themselves:

     data-reveal="up|down|left|right|scale|blur"
         → the element starts hidden/offset and eases into place the first
           time it enters the viewport (once).
     style="--reveal-index:N"
         → staggers a group so items cascade in one after another.
     data-parallax="0.06"
         → the element drifts gently against the scroll for depth.

   It also paints a whisper-thin scroll-progress line at the very top of the
   page — a quiet, premium touch.

   Everything is reduced-motion aware: when the user prefers less motion we
   reveal content instantly and skip parallax + the progress bar entirely.

   Public API (mirrors the rest of core — create + destroy):
     const motion = createMotion(root);   // observe everything under `root`
     motion.destroy();                     // full cleanup on route teardown

   Plus one helper used by components that want per-line text reveals:
     revealLines(headlineEl);              // wraps each <br>-line for stagger
   ========================================================================== */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --------------------------------------------------------------------------
   revealLines(el)
   Splits an element whose innerHTML may contain <br> into block "lines",
   each its own staggered reveal target. Lets a headline rise line-by-line.
   Safe to call once after the element's copy has been hydrated.
   -------------------------------------------------------------------------- */
export function revealLines(el) {
  if (!el) return;
  // Split on <br> (with optional whitespace/slash variants) into segments.
  const parts = el.innerHTML
    .split(/<br\s*\/?>/i)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return;

  el.innerHTML = parts
    .map(
      (line, i) =>
        `<span class="reveal-line" data-reveal="up" style="--reveal-index:${i}">${line}</span>`
    )
    .join("");
}

/* --------------------------------------------------------------------------
   createMotion(root)
   Wires reveal + parallax + progress under `root` and returns { destroy }.
   -------------------------------------------------------------------------- */
export function createMotion(root = document) {
  const cleanups = [];

  setupReveal(root, cleanups);
  if (!REDUCED) {
    setupParallax(root, cleanups);
    setupProgress(cleanups);
  }

  return {
    destroy() {
      cleanups.forEach((fn) => {
        try { fn(); } catch (_) { /* best-effort teardown */ }
      });
      cleanups.length = 0;
    },
  };
}

/* ---- Scroll reveal (IntersectionObserver, one-shot per element) --------- */
function setupReveal(root, cleanups) {
  const targets = [...root.querySelectorAll("[data-reveal]")];
  if (targets.length === 0) return;

  // No IntersectionObserver (or reduced motion) → just show everything.
  if (REDUCED || typeof IntersectionObserver === "undefined") {
    targets.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);   // reveal once, then forget it
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());
}

/* ---- Subtle parallax drift (rAF-throttled scroll) ----------------------- */
function setupParallax(root, cleanups) {
  const items = [...root.querySelectorAll("[data-parallax]")].map((el) => ({
    el,
    speed: parseFloat(el.getAttribute("data-parallax")) || 0.06,
  }));
  if (items.length === 0) return;

  let ticking = false;

  const update = () => {
    const mid = window.innerHeight / 2;
    items.forEach(({ el, speed }) => {
      const rect = el.getBoundingClientRect();
      // Distance of the element's centre from the viewport centre.
      const delta = (rect.top + rect.height / 2) - mid;
      el.style.transform = `translate3d(0, ${(-delta * speed).toFixed(2)}px, 0)`;
    });
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();   // set initial positions

  cleanups.push(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    items.forEach(({ el }) => { el.style.transform = ""; });
  });
}

/* ---- Whisper-thin scroll-progress line at the top of the page ----------- */
function setupProgress(cleanups) {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  let ticking = false;

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = `scaleX(${pct.toFixed(4)})`;
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();

  cleanups.push(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    bar.remove();
  });
}
