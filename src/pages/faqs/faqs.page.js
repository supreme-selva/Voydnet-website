/* ==========================================================================
   PAGE: faqs  (route "/faqs")
   --------------------------------------------------------------------------
   "Questions? Answers." — a centered, editorial FAQ screen with an expandable
   accordion (click a question → its answer slides open; a +/× glyph flips).
   Below the list sits a quiet Help Desk / contact block.

   The page reuses the shared site header and the "legal" reading surface for
   the outer chrome (background, spacing, footer), then layers a dedicated
   .faq__* accordion styled in pages/faqs/faqs.css. Copy is authored ONCE here
   as semantic HTML; look-and-feel is entirely token-driven.
   ========================================================================== */

import { loadComponent } from "../../core/component.js";
import { loadStrings } from "../../content/strings.js";
import { createMotion } from "../../core/motion.js";
import { downloadVoydnet } from "../../config/assets.js";

/* The FAQ copy, authored as a small data model so the markup stays a single
   readable map. Each entry is a { q, a } pair; `a` is trusted HTML we author. */
const FAQS = [
  {
    q: "Does Voydnet block YouTube ads or Instagram sponsored posts?",
    a: `No. YouTube and Instagram serve their video ads from the exact same servers and
        domains as the actual video content. Because Voydnet filters traffic at the DNS and
        domain level, blocking those ad servers would completely break video playback. To
        block YouTube ads, browser-based cosmetic extensions (like uBlock Origin) or dedicated
        third-party clients are required.`,
  },
  {
    q: "What kind of ads and trackers does Voydnet block?",
    a: `Voydnet blocks third-party advertising networks, analytics trackers, telemetry pings,
        phishing domains, and intrusive web popups/banners across your browsers and installed
        Android apps.`,
  },
  {
    q: `Why does Android show a "VPN" key icon in my status bar?`,
    a: `Android requires the native <code>VpnService</code> interface to allow any app to
        inspect or filter network packets on-device. Voydnet uses this to create an internal
        loopback filter — a local firewall inside your phone. No traffic is routed outside your
        device to any remote proxy server.`,
  },
  {
    q: "Does Voydnet hide my IP address or change my location?",
    a: `No. Voydnet is a local network firewall, not a proxy tunnel. Your public IP address
        remains assigned by your mobile carrier or Wi-Fi provider, and your real geolocation is
        not altered.`,
  },
  {
    q: "Will Voydnet drain my battery or slow down my phone?",
    a: `Negligibly. Android attributes all network battery usage to whichever app holds the VPN
        interface, making it look like Voydnet consumes significant battery in system settings.
        In reality, Voydnet uses lightweight local lookups and often saves battery and mobile
        data by stopping heavy ad scripts and video banners from loading.`,
  },
  {
    q: "Does Voydnet log, store, or sell my browsing history?",
    a: `Never. Because packet matching and DNS filtering happen 100% locally in your device's
        memory, we do not operate proxy servers that could see, log, or monetize your search
        queries, visited domains, or personal data.`,
  },
  {
    q: "Can I run Voydnet alongside another VPN app (like WireGuard or Mullvad)?",
    a: `No. Android natively permits only one active <code>VpnService</code> connection at a
        time. Activating another VPN app will automatically disconnect Voydnet's local
        protection.`,
  },
  {
    q: "Why is a particular app, payment gateway, or website broken?",
    a: `Occasionally, community filter lists (like EasyList or HaGeZi) catch a required tracking
        or authentication domain by mistake (a "false positive"). You can temporarily toggle
        Voydnet off to complete the task, then report the broken link to our support desk so we
        can adjust rule exceptions.`,
  },
  {
    q: "I didn't receive my Magic Link sign-in email. What should I do?",
    a: `Check your Spam, Junk, and Promotions folders. If it's missing, ensure you wait at least
        60 seconds before requesting another code to prevent rate-limiting delays.`,
  },
  {
    q: "Do I need to manually update blocklists?",
    a: `No. Voydnet periodically synchronizes updated community rule lists in the background over
        HTTPS whenever your device is connected to an active network.`,
  },
];

export async function render(outlet, ctx) {
  // Ensure copy is available before components hydrate their [data-i18n].
  await loadStrings("en");

  const items = FAQS.map(
    ({ q, a }, i) => `
      <div class="faq__item" data-faq-item>
        <h3 class="faq__q-wrap">
          <button type="button" class="faq__q" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
            <span class="faq__q-text">${q}</span>
            <span class="faq__icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="faq__a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}" hidden>
          <div class="faq__a-inner"><p>${a}</p></div>
        </div>
      </div>`
  ).join("");

  outlet.innerHTML = `
    <div data-slot="site-nav"></div>

    <section class="legal faq" data-component="faqs">

      <header class="faq__head" data-reveal>
        <h1 class="faq__title">Questions? Answers.</h1>
        <p class="faq__subtitle">Everything you need to know about Voydnet.</p>
      </header>

      <div class="faq__list" data-reveal>
        ${items}
      </div>

      <!-- Quiet Help Desk block -->
      <section class="faq__support" data-reveal aria-label="Help desk and contact">
        <h2 class="faq__support-title">Voydnet Help Desk &amp; Contact</h2>
        <p class="faq__support-lede">
          If you experience app crashes, unexpected connection drops, or discover a legitimate
          website being blocked, reach out and a person will reply.
        </p>
        <dl class="legal__contact">
          <div class="legal__contact-row">
            <dt>Email</dt>
            <dd>
              <a class="legal__link" href="mailto:voydnet@gmail.com">voydnet@gmail.com</a>
            </dd>
          </div>
          <div class="legal__contact-row">
            <dt>Response window</dt>
            <dd>24–48 business hours (Mon–Fri, 9:00 AM – 6:00 PM IST)</dd>
          </div>
          <div class="legal__contact-row">
            <dt>Details to include</dt>
            <dd>Device model &amp; Android version, Voydnet app version, and the affected app or website URL</dd>
          </div>
        </dl>
      </section>

      <div class="faq__still">
        <p class="faq__still-note">
          Still stuck?
          <a class="legal__link" href="mailto:voydnet@gmail.com">Email us</a>
          and a person will reply.
        </p>
      </div>

      <footer class="legal__foot">
        <p class="legal__foot-note">© 2026 Voydnet. Privacy in one tap.</p>
        <div class="legal__actions" data-slot="actions"></div>
      </footer>
    </section>`;

  const siteNavHost = outlet.querySelector('[data-slot="site-nav"]');

  // Sticky header first (anchors the page). Its CTA re-triggers the download.
  const siteNav = await loadComponent("site-nav", siteNavHost, {
    onGetVoydnet: () => downloadVoydnet(),
  });

  // A quiet "Back to home" affordance, built by the shared button factory.
  const { createButton } = await import("../../components/button/button.js");
  const back = createButton({
    label: "Back to home",
    variant: "primary",
    size: "lg",
    onClick: () => ctx.router.go("/"),
  });
  const actions = outlet.querySelector('[data-slot="actions"]');
  if (actions) actions.appendChild(back);

  // ---- Accordion behavior -------------------------------------------------
  // Single-open accordion: clicking a question opens it and closes any other.
  // We animate max-height from the measured content height for a smooth
  // drop-down, then clear it so reflow (e.g. resize) stays correct.
  const list = outlet.querySelector(".faq__list");

  const closePanel = (btn, panel) => {
    btn.setAttribute("aria-expanded", "false");
    // Set current height then transition to 0 so the collapse animates.
    panel.style.maxHeight = `${panel.scrollHeight}px`;
    requestAnimationFrame(() => {
      panel.style.maxHeight = "0px";
    });
    panel.addEventListener(
      "transitionend",
      () => {
        if (btn.getAttribute("aria-expanded") === "false") {
          panel.hidden = true;
          panel.style.maxHeight = "";
        }
      },
      { once: true }
    );
    btn.closest("[data-faq-item]").classList.remove("is-open");
  };

  const openPanel = (btn, panel) => {
    btn.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    panel.style.maxHeight = `${panel.scrollHeight}px`;
    panel.addEventListener(
      "transitionend",
      () => {
        if (btn.getAttribute("aria-expanded") === "true") {
          // Let open panels grow/shrink freely afterwards.
          panel.style.maxHeight = "none";
        }
      },
      { once: true }
    );
    btn.closest("[data-faq-item]").classList.add("is-open");
  };

  const onListClick = (e) => {
    const btn = e.target.closest(".faq__q");
    if (!btn || !list.contains(btn)) return;
    const panel = outlet.querySelector(`#${btn.getAttribute("aria-controls")}`);
    if (!panel) return;

    const isOpen = btn.getAttribute("aria-expanded") === "true";

    // Close any currently open sibling first (single-open behavior).
    list.querySelectorAll('.faq__q[aria-expanded="true"]').forEach((openBtn) => {
      if (openBtn === btn) return;
      const openPanelEl = outlet.querySelector(`#${openBtn.getAttribute("aria-controls")}`);
      if (openPanelEl) closePanel(openBtn, openPanelEl);
    });

    if (isOpen) closePanel(btn, panel);
    else openPanel(btn, panel);
  };

  if (list) list.addEventListener("click", onListClick);

  // Start scroll-choreography (drives [data-reveal] entrances).
  const motion = createMotion(outlet);

  return {
    destroy() {
      if (list) list.removeEventListener("click", onListClick);
      if (motion) motion.destroy();
      if (siteNav) siteNav.destroy();
    },
  };
}
