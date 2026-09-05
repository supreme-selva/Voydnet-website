/* ==========================================================================
   COMPONENT FACTORY: button
   --------------------------------------------------------------------------
   Creates reusable button elements programmatically so pages/components can
   build UI without repeating markup. Pure factory (no partial HTML needed):
   returns a real <button> you append where you like.

   This keeps buttons consistent, accessible, and token-styled across the app.

   Example:
     import { createButton } from ".../button/button.js";
     const b = createButton({ label: "Get Voydnet", variant: "primary",
                              onClick: () => router.go("#/download") });
     container.appendChild(b);
   ========================================================================== */

/**
 * @param {object} opts
 * @param {string}  opts.label
 * @param {"primary"|"ghost"|"danger"} [opts.variant="primary"]
 * @param {"sm"|"md"|"lg"} [opts.size="md"]
 * @param {string} [opts.icon]      Inline SVG markup for a leading icon.
 * @param {string} [opts.href]      If set, navigates on click (hash route ok).
 * @param {Function} [opts.onClick]
 * @param {boolean} [opts.disabled=false]
 * @returns {HTMLButtonElement}
 */
export function createButton(opts = {}) {
  const {
    label = "",
    variant = "primary",
    size = "md",
    icon,
    href,
    onClick,
    disabled = false,
  } = opts;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = ["btn", `btn--${variant}`, `btn--${size}`].join(" ");
  btn.disabled = !!disabled;

  if (icon) {
    const ico = document.createElement("span");
    ico.className = "btn__icon";
    ico.innerHTML = icon;
    btn.appendChild(ico);
  }

  if (label) {
    const text = document.createElement("span");
    text.className = "btn__label";
    text.textContent = label;
    btn.appendChild(text);
  }

  btn.addEventListener("click", (e) => {
    if (btn.disabled || btn.classList.contains("is-loading")) return;
    if (typeof onClick === "function") onClick(e);
    if (href) window.location.hash = href.startsWith("#") ? href : `#${href}`;
  });

  /* Small imperative helpers hung off the element for convenience. */
  btn.setLoading = (state) => btn.classList.toggle("is-loading", !!state);
  btn.setDisabled = (state) => { btn.disabled = !!state; };

  return btn;
}
