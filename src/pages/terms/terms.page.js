/* ==========================================================================
   PAGE: terms  (route "/terms")
   --------------------------------------------------------------------------
   The Terms of Service screen. A sibling of the Privacy Policy page — it
   reuses the exact same editorial "legal" look-and-feel (shared .legal__*
   styles) so the two documents feel like one family: sticky site header,
   a tight two-row document header, a justified quick-nav strip, then calm,
   well-spaced long-form typography.

   The Terms copy is authored ONCE here as semantic HTML that mirrors the
   source document. Look-and-feel lives in pages/privacy/privacy.css (the
   shared "legal" surface) plus a tiny pages/terms/terms.css for parity, so
   this module stays a thin composition root — like every other page.
   ========================================================================== */

import { loadComponent } from "../../core/component.js";
import { loadStrings } from "../../content/strings.js";
import { createMotion } from "../../core/motion.js";
import { downloadVoydnet, ASSETS } from "../../config/assets.js";

export async function render(outlet, ctx) {
  // Ensure copy is available before components hydrate their [data-i18n].
  await loadStrings("en");

  outlet.innerHTML = `
    <div data-slot="site-nav"></div>

    <section class="legal" data-component="terms">

      <!-- Minimal two-row header, edge-to-edge (justified) — no card, no
           heavy shadow, no centered hero. Row 1: mark + title vs. the
           effective date. Row 2: a quiet, justified quick-nav strip. -->
      <header class="legal__head" data-reveal>

        <div class="legal__row legal__row--top">
          <div class="legal__id">
            <img class="legal__mark" src="${ASSETS.privacyPolicyImage}"
                 alt="" width="72" height="72" loading="eager" decoding="async" />
            <h1 class="legal__title">Terms of Service</h1>
          </div>
          <p class="legal__date">Effective Sep 13, 2026</p>
        </div>

        <nav class="legal__row legal__row--nav" aria-label="On this page">
          <button type="button" data-goto="sec-1">Service</button>
          <button type="button" data-goto="sec-2">License</button>
          <button type="button" data-goto="sec-3">Accounts</button>
          <button type="button" data-goto="sec-4">Privacy</button>
          <button type="button" data-goto="sec-5">Warranties</button>
          <button type="button" data-goto="sec-6">Liability</button>
          <button type="button" data-goto="sec-7">Third Parties</button>
          <button type="button" data-goto="sec-8">Changes</button>
          <button type="button" data-goto="sec-9">Governing Law</button>
          <button type="button" data-goto="sec-10">Contact</button>
        </nav>
      </header>

      <div class="legal__doc">

        <p class="legal__lede">
          Welcome to Voydnet. These Terms of Service ("Terms") govern your access to and use of the
          Voydnet mobile application, website (voydnet.digital), and related services (collectively,
          the "Service"). By downloading, installing, or using Voydnet, you agree to be bound by
          these Terms. If you do not agree to these Terms, do not use the Service.
        </p>

        <h2 class="legal__h2" id="sec-1"><span class="legal__num">01</span>Description of Service</h2>
        <p class="legal__p">
          Voydnet is a local network filtering and privacy utility designed to block trackers,
          advertisements, and known malicious domains on your device.
        </p>
        <ul class="legal__list">
          <li>
            <strong>Local Processing:</strong> Voydnet utilizes the Android <code>VpnService</code>
            API to create a local loopback interface. <strong>Voydnet is not a proxy VPN.</strong>
            We do not route your internet traffic through external servers, nor do we mask your IP
            address from your Internet Service Provider.
          </li>
          <li>
            <strong>Filter Lists:</strong> The Service relies on community-maintained rule sets to
            identify and block unwanted connections.
          </li>
        </ul>

        <h2 class="legal__h2" id="sec-2"><span class="legal__num">02</span>License and Acceptable Use</h2>
        <p class="legal__p">
          Subject to your compliance with these Terms, Voydnet grants you a limited, non-exclusive,
          non-transferable, and revocable license to install and use the Voydnet application on your
          personal Android devices.
        </p>
        <h3 class="legal__h3">You agree NOT to:</h3>
        <ul class="legal__list">
          <li>Reverse engineer, decompile, or disassemble the Voydnet application.</li>
          <li>
            Use the Service to mask illegal network activities, distribute malicious software, or
            bypass network security controls.
          </li>
          <li>
            Use the Service in any way that violates applicable local, state, national, or
            international laws (including the Information Technology Act, 2000 of India).
          </li>
          <li>Attempt to gain unauthorized access to Voydnet's authentication infrastructure.</li>
        </ul>

        <h2 class="legal__h2" id="sec-3"><span class="legal__num">03</span>User Accounts and Authentication</h2>
        <p class="legal__p">
          To access certain features of Voydnet, you may be required to authenticate using an email
          address.
        </p>
        <ul class="legal__list">
          <li>We utilize a passwordless "Magic Link" authentication system.</li>
          <li>
            You are responsible for maintaining the security of your email inbox. Any actions taken
            using an active Voydnet session tied to your email are your responsibility.
          </li>
          <li>
            We reserve the right to suspend or terminate access to your account if we detect abusive
            behavior or a violation of these Terms.
          </li>
        </ul>

        <h2 class="legal__h2" id="sec-4"><span class="legal__num">04</span>Privacy and Data Handling</h2>
        <p class="legal__p">
          Your privacy is our foundational priority. Our data practices, including our strict
          zero-network-logging policy, are governed by our
          <a class="legal__link" href="#/Privacy&Policy">Privacy Policy</a>. By using Voydnet, you
          acknowledge and consent to the data practices outlined in that policy.
        </p>

        <h2 class="legal__h2" id="sec-5"><span class="legal__num">05</span>Disclaimer of Warranties</h2>
        <p class="legal__p">
          Voydnet is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong>
          basis.
        </p>
        <ul class="legal__list">
          <li>
            <strong>No Guarantee of Perfection:</strong> While Voydnet continuously updates its
            filtering rules, the internet is highly dynamic. We do not warrant that the Service will
            block 100% of advertisements, trackers, or malicious domains, nor do we guarantee that
            the Service will be compatible with all third-party applications.
          </li>
          <li>
            <strong>No Warranties:</strong> We explicitly disclaim all warranties, whether express
            or implied, including the implied warranties of merchantability, fitness for a
            particular purpose, and non-infringement.
          </li>
        </ul>

        <h2 class="legal__h2" id="sec-6"><span class="legal__num">06</span>Limitation of Liability</h2>
        <p class="legal__p">
          To the maximum extent permitted by law, Voydnet and its developers shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages resulting from:
        </p>
        <ul class="legal__list">
          <li>Your use of or inability to use the Service.</li>
          <li>Any unauthorized access to or alteration of your device or data.</li>
          <li>Any interruptions, errors, or vulnerabilities within the Service.</li>
          <li>
            Conflicts between Voydnet's local filtering and other applications on your device
            causing connectivity issues.
          </li>
        </ul>

        <h2 class="legal__h2" id="sec-7"><span class="legal__num">07</span>Third-Party Content and Open Source</h2>
        <p class="legal__p">
          Voydnet utilizes publicly available, open-source blocklists to power its filtering engine.
          We do not claim ownership of these lists. Your use of the Service is also subject to the
          acknowledgments and licenses detailed on our
          <a class="legal__link" href="#/licencing">Open Source Licenses</a> page.
        </p>

        <h2 class="legal__h2" id="sec-8"><span class="legal__num">08</span>Changes to these Terms</h2>
        <p class="legal__p">
          We reserve the right to modify these Terms at any time. If we make material changes, we
          will notify you by updating the "Last Updated" date at the top of this page or by
          providing a notice within the application. Continued use of Voydnet after any such changes
          constitutes your consent to the updated Terms.
        </p>

        <h2 class="legal__h2" id="sec-9"><span class="legal__num">09</span>Governing Law and Jurisdiction</h2>
        <p class="legal__p">
          These Terms shall be governed by and construed in accordance with the laws of India. Any
          disputes arising out of or in connection with these Terms shall be subject to the
          exclusive jurisdiction of the courts located in Chennai, Tamil Nadu, India.
        </p>

        <h2 class="legal__h2" id="sec-10"><span class="legal__num">10</span>Contact Us</h2>
        <p class="legal__p">
          If you have any questions about these Terms, please contact us at:
        </p>
        <dl class="legal__contact">
          <div class="legal__contact-row">
            <dt>Entity</dt><dd>Voydnet Operations</dd>
          </div>
          <div class="legal__contact-row">
            <dt>Email</dt><dd>voydnet@gmail.com</dd>
          </div>
          <div class="legal__contact-row">
            <dt>Jurisdiction</dt><dd>Chennai, Tamil Nadu, India</dd>
          </div>
        </dl>

        <footer class="legal__foot">
          <p class="legal__foot-note">© 2026 Voydnet. Privacy in one tap.</p>
          <div class="legal__actions" data-slot="actions"></div>
        </footer>
      </div>
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

  // Contents links smooth-scroll to their section. We can't rely on plain
  // #id anchors here because the whole app runs under a hash router — the
  // fragment is the route, not an element id — so scroll in JS instead.
  const onTocClick = (e) => {
    const link = e.target.closest("[data-goto]");
    if (!link) return;
    e.preventDefault();
    const target = outlet.querySelector(`#${link.getAttribute("data-goto")}`);
    if (!target) return;
    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 68) -
      16;
    window.scrollTo({ top, behavior: "smooth" });
  };
  const toc = outlet.querySelector(".legal__row--nav");
  if (toc) toc.addEventListener("click", onTocClick);

  // Start scroll-choreography (drives any [data-reveal] entrances).
  const motion = createMotion(outlet);

  return {
    destroy() {
      if (toc) toc.removeEventListener("click", onTocClick);
      if (motion) motion.destroy();
      if (siteNav) siteNav.destroy();
    },
  };
}
