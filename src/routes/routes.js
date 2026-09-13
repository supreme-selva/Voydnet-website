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
  "/download": {
    title: "Thank you",
    load: () => import("../pages/thankyou/thankyou.page.js"),
  },
  "/Privacy&Policy": {
    title: "Privacy Policy",
    load: () => import("../pages/privacy/privacy.page.js"),
  },
  "/terms": {
    title: "Terms of Service",
    load: () => import("../pages/terms/terms.page.js"),
  },
  "/licencing": {
    title: "Licensing",
    load: () => import("../pages/licensing/licensing.page.js"),
  },
  "/faqs": {
    title: "FAQs & Support",
    load: () => import("../pages/faqs/faqs.page.js"),
  },
};
