/* ==========================================================================
   CONTENT: strings loader (i18n)
   --------------------------------------------------------------------------
   Loads a locale's content registry (strings.<locale>.html), parses every
   [data-key] element into a { key: html } map, and exposes:

     await loadStrings(locale)   → resolves once the map is ready
     t(key, fallback)            → look up a string by key
     hydrate(rootEl)             → replace [data-i18n] placeholders in markup

   Components stay free of hard-coded copy: they either call t("hero.headline")
   or drop <span data-i18n="hero.headline"></span> in their partial and let
   hydrate() fill it in. Switching languages is just loadStrings("fr").

   The active map is cached module-side so t()/hydrate() are synchronous after
   the initial load.
   ========================================================================== */

const REGISTRY_DIR = new URL("./", import.meta.url);

let active = { locale: null, map: new Map() };

/**
 * Load and activate a locale's strings.
 * @param {string} [locale="en"]
 * @returns {Promise<Map<string,string>>}
 */
export async function loadStrings(locale = "en") {
  const url = new URL(`strings.${locale}.html`, REGISTRY_DIR);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`[strings] failed to load locale "${locale}" (${res.status})`);
  }
  const html = await res.text();

  const doc = new DOMParser().parseFromString(html, "text/html");
  const map = new Map();
  doc.querySelectorAll("[data-key]").forEach((el) => {
    map.set(el.getAttribute("data-key"), el.innerHTML.trim());
  });

  active = { locale, map };
  document.documentElement.lang = locale;
  return map;
}

/**
 * Look up a string by key.
 * @param {string} key
 * @param {string} [fallback=""]
 * @returns {string} the string's HTML (may contain inline markup like <br>)
 */
export function t(key, fallback = "") {
  const val = active.map.get(key);
  if (val == null) {
    console.warn(`[strings] missing key "${key}" for locale "${active.locale}".`);
    return fallback;
  }
  return val;
}

/**
 * Replace [data-i18n] placeholders inside a root element with their strings.
 * @param {HTMLElement} root
 */
export function hydrate(root) {
  if (!root) return;
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.innerHTML = t(key, el.innerHTML);
  });
}

/** The currently active locale code. */
export const currentLocale = () => active.locale;
