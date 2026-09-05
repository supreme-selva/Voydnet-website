/* ==========================================================================
   ROUTES: the route table
   --------------------------------------------------------------------------
   The single declarative map of URL hash → page module. Pages are lazily
   imported (code-split by the browser) so a page's code only loads when its
   route is visited. Add a new page by dropping a folder in src/pages/ and
   registering one line here.

   Each page module must export:  render(outlet, ctx) -> cleanup|controller
   ========================================================================== */

export const routes = {
  "/": {
    title: "Showcase",
    load: () => import("../pages/showcase/showcase.page.js"),
  },
  "/about": {
    title: "About",
    load: () => import("../pages/about/about.page.js"),
  },
};
