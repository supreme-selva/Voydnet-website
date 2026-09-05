/* ==========================================================================
   CORE: component loader
   --------------------------------------------------------------------------
   Framework-free component system for a pure HTML/CSS/JS site. Because plain
   HTML has no import mechanism, this loader:

     1. fetches a component's .html partial,
     2. injects it into a target element,
     3. dynamically imports the matching controller module and calls its
        `mount(root, props)` contract,
     4. returns the controller instance so callers can talk to it and later
        `destroy()` it.

   Partials are fetched once and cached, so repeated mounts are cheap.

   Convention (keeps everything predictable):
     src/components/<name>/<name>.html   ← markup partial
     src/components/<name>/<name>.js      ← exports mount(root, props)
     src/components/<name>/<name>.css     ← imported via styles/main.css
   ========================================================================== */

const BASE = new URL("../components/", import.meta.url);
const htmlCache = new Map();

/**
 * Fetch (and cache) a component's HTML partial.
 * @param {string} name
 * @returns {Promise<string>}
 */
async function loadPartial(name) {
  if (htmlCache.has(name)) return htmlCache.get(name);
  const url = new URL(`${name}/${name}.html`, BASE);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`[component] failed to load partial "${name}" (${res.status})`);
  }
  const html = await res.text();
  htmlCache.set(name, html);
  return html;
}

/**
 * Mount a component into a target element.
 * @param {string} name              Component folder/file name.
 * @param {HTMLElement} target       Element to render into.
 * @param {object} [props]           Passed straight to the controller.
 * @returns {Promise<object>}        The controller instance (has destroy()).
 */
export async function loadComponent(name, target, props = {}) {
  if (!target) throw new Error(`[component] no target element for "${name}".`);

  const html = await loadPartial(name);
  target.innerHTML = html;

  // Dynamically import the controller. Vite/native ESM both resolve this URL.
  const modUrl = new URL(`${name}/${name}.js`, BASE);
  let controller = { destroy() {} };
  try {
    const mod = await import(/* @vite-ignore */ modUrl.href);
    if (typeof mod.mount === "function") {
      controller = mod.mount(target, props) || controller;
    }
  } catch (err) {
    // A component may be markup-only (no controller). That's fine.
    if (!/Failed to fetch|Cannot find|404/.test(String(err))) {
      console.warn(`[component] controller for "${name}" not mounted:`, err);
    }
  }

  return controller;
}
