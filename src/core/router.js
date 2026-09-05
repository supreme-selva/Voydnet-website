/* ==========================================================================
   CORE: hash router
   --------------------------------------------------------------------------
   A tiny client-side router built on `location.hash`. Hash routing is the
   right call for a pure static / no-build site because:

     - it needs zero server rewrite rules,
     - it works when opened directly from the file system (file://),
     - deep links and the back/forward buttons just work.

   A route maps a path to a page module that exports `render(outlet, ctx)`
   returning an optional cleanup (or a controller with destroy()). The router
   tears down the previous page before rendering the next, preventing leaks.

   Route table lives in src/routes/routes.js; this file is the engine.
   ========================================================================== */

export function createRouter({ outlet, routes, fallback = "/" }) {
  if (!outlet) throw new Error("[router] an outlet element is required.");

  let current = null; // { cleanup?:Function|object }

  /** Parse "#/path?a=b" → { path, query }. */
  function parse() {
    const raw = location.hash.slice(1) || fallback;   // strip leading '#'
    const [path, queryStr = ""] = raw.split("?");
    const query = Object.fromEntries(new URLSearchParams(queryStr));
    return { path: path || fallback, query };
  }

  function matchRoute(path) {
    return routes[path] || routes[fallback];
  }

  async function resolve() {
    const { path, query } = parse();
    const route = matchRoute(path);

    // Tear down the previous page.
    await teardown();

    outlet.innerHTML = "";
    const ctx = { path, query, router: api };

    try {
      const mod = await route.load();
      if (typeof mod.render !== "function") {
        throw new Error(`route "${path}" has no render() export`);
      }
      current = { cleanup: await mod.render(outlet, ctx) };
      document.title = route.title ? `Voydnet — ${route.title}` : "Voydnet";
    } catch (err) {
      console.error("[router] failed to render route:", err);
      outlet.innerHTML =
        '<div class="stage"><p style="color:var(--color-muted)">Route failed to load.</p></div>';
    }
  }

  async function teardown() {
    const c = current && current.cleanup;
    if (!c) return;
    try {
      if (typeof c === "function") c();
      else if (typeof c.destroy === "function") c.destroy();
    } catch (err) {
      console.warn("[router] teardown error:", err);
    }
    current = null;
  }

  const api = {
    /** Programmatic navigation. */
    go(path) {
      location.hash = path.startsWith("#") ? path : `#${path}`;
    },
    start() {
      window.addEventListener("hashchange", resolve);
      resolve();
      return api;
    },
    stop() {
      window.removeEventListener("hashchange", resolve);
    },
  };

  return api;
}
