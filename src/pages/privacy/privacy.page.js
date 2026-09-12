/* ==========================================================================
   PAGE: privacy  (route "/Privacy&Policy")
   --------------------------------------------------------------------------
   The Privacy Policy screen. It composes the sticky site header (so the page
   never feels adrift) above a single long-form document section that renders
   the policy verbatim.

   The policy copy is authored ONCE here as semantic HTML that mirrors the
   source document word-for-word. Look-and-feel lives entirely in
   pages/privacy/privacy.css using the shared design tokens, so this module
   stays a thin composition root — consistent with every other page.
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

    <section class="legal" data-component="privacy">

      <!-- Minimal two-row header, edge-to-edge (justified) — no card, no
           heavy shadow, no centered hero. Row 1: icon + title vs. the
           effective date. Row 2: a quiet, justified quick-nav strip. -->
      <header class="legal__head" data-reveal>

        <div class="legal__row legal__row--top">
          <div class="legal__id">
            <img class="legal__mark" src="${ASSETS.privacyPolicyImage}"
                 alt="" width="72" height="72" loading="eager" decoding="async" />
            <h1 class="legal__title">Privacy Policy</h1>
          </div>
          <p class="legal__date">Effective Sep 12, 2026</p>
        </div>

        <nav class="legal__row legal__row--nav" aria-label="On this page">
          <button type="button" data-goto="sec-1">Architecture</button>
          <button type="button" data-goto="sec-2">VPN Disclosure</button>
          <button type="button" data-goto="sec-3">Data &amp; Telemetry</button>
          <button type="button" data-goto="sec-4">Third Parties</button>
          <button type="button" data-goto="sec-5">Compliance</button>
          <button type="button" data-goto="sec-6">Security</button>
          <button type="button" data-goto="sec-7">Children</button>
          <button type="button" data-goto="sec-8">Changes</button>
          <button type="button" data-goto="sec-9">Contact</button>
        </nav>
      </header>

      <div class="legal__doc">

        <p class="legal__lede">
          Voydnet ("we," "our," or "us") operates the Voydnet mobile application and related
          distribution platforms. This Privacy Policy governs how Voydnet handles personal data,
          device permissions, and network communications when you install, access, or use our
          software via direct APK download or through alternative application repositories such
          as the Indus Appstore.
        </p>

        <h2 class="legal__h2" id="sec-1"><span class="legal__num">01</span>Architectural Foundation: Local On-Device Processing</h2>
        <p class="legal__p">
          Voydnet is strictly designed as an endpoint privacy utility and local network filter.
          It does <strong>not</strong> operate as a conventional remote virtual private network
          (VPN) proxy or anonymization tunnel.
        </p>
        <ul class="legal__list">
          <li>
            <strong>No Remote Traffic Routing:</strong> All network filtering, Deep Packet
            Inspection (DPI) evasion routines, and domain matching occur 100% locally on your
            physical hardware. We do not direct your traffic to third-party proxy nodes or
            company-controlled remote servers.
          </li>
          <li>
            <strong>No Network Logs:</strong> Voydnet does not capture, store, log, inspect,
            monetize, or transmit:
            <ul class="legal__list">
              <li>Full-text browsing history or application usage histories.</li>
              <li>DNS lookup queries or unresolved hostnames.</li>
              <li>Destination IP addresses, packet payloads, or protocol metadata.</li>
              <li>Original public IP addresses assigned by your Internet Service Provider (ISP).</li>
            </ul>
          </li>
        </ul>
        <h2 class="legal__h2" id="sec-2"><span class="legal__num">02</span>Android VpnService API Disclosure &amp; Affirmative Consent</h2>
        <p class="legal__p">
          Android requires apps performing low-level packet inspection or encrypted DNS
          redirection to declare and implement the <code>android.net.VpnService</code> interface.
        </p>
        <ul class="legal__list">
          <li>
            <strong>Purpose of API Usage:</strong> Voydnet uses <code>VpnService</code> exclusively
            to construct a local virtual network interface (loopback adapter) on your device. This
            allows the app to intercept outbound DNS requests on-device and filter unwanted trackers
            or malicious domains against local rule lists before packets exit your physical network
            interface.
          </li>
          <li>
            <strong>No Remote Tunneling:</strong> The established loopback adapter terminates
            directly inside the app sandbox on your device. Packets are not forwarded through
            remote VPN servers.
          </li>
          <li>
            <strong>Explicit User Consent:</strong> Voydnet will never initiate the local
            <code>VpnService</code> background process without an upfront, prominent in-app
            explanation and your affirmative confirmation through the standard Android OS VPN
            authorization dialog.
          </li>
          <li>
            <strong>Service Termination:</strong> You retain complete control to pause, disconnect,
            or revoke <code>VpnService</code> permissions at any time directly through the
            application interface or your Android system settings.
          </li>
        </ul>
        <h2 class="legal__h2" id="sec-3"><span class="legal__num">03</span>Data Collection and Telemetry</h2>
        <p class="legal__p">
          Voydnet maintains a minimal data footprint. We distinguish strictly between technical
          diagnostic metrics and personal user data.
        </p>

        <h3 class="legal__h3">Telemetry &amp; Stability Data</h3>
        <p class="legal__p">
          Voydnet collects limited, non-identifying telemetry strictly for performance analysis
          and crash diagnosis:
        </p>
        <ul class="legal__list">
          <li>
            <strong>Anonymous Identifiers:</strong> A randomly generated client identifier (UUIDv4)
            that is regenerated upon app re-installation.
          </li>
          <li>
            <strong>Aggregate Metrics:</strong> Aggregate application uptime counters, feature
            engagement clicks (such as toggling a filter rule), and runtime crash reports.
          </li>
          <li>
            <strong>Technical Isolation:</strong> Telemetry signals contain zero network inspection
            records, domain logs, or persistent hardware markers (such as IMEI, Android ID, or MAC
            address).
          </li>
        </ul>

        <h3 class="legal__h3">Account and Authentication Data</h3>
        <p class="legal__p">If you sign up or authenticate an account within Voydnet:</p>
        <ul class="legal__list">
          <li>
            <strong>Email Address:</strong> Collected solely to deliver single-use authentication
            magic links and manage account status.
          </li>
          <li>
            <strong>Session Verification:</strong> Basic cryptographic tokens confirming active
            session validity.
          </li>
        </ul>
        <h2 class="legal__h2" id="sec-4"><span class="legal__num">04</span>Third-Party Service Providers</h2>
        <p class="legal__p">
          Voydnet limits integrations to essential backend infrastructure partners who operate
          under strict confidentiality and processing agreements:
        </p>
        <ul class="legal__list">
          <li>
            <strong>Authentication Infrastructure (Supabase):</strong> Account registration,
            authentication tokens, and minimal account status data are processed via Supabase
            backend services. Supabase functions strictly as a secure database and authentication
            conduit and has no access to your device's network traffic, filtered domains, or local
            data streams.
          </li>
          <li>
            <strong>Email Delivery Services:</strong> Transactional authentication emails (such as
            magic links) are dispatched via authorized SMTP providers solely to fulfill sign-in
            requests.
          </li>
          <li>
            <strong>Rule Definitions &amp; Community Lists:</strong> Voydnet synchronizes publicly
            available open-source blocklists (including EasyList and HaGeZi filter sets).
            Synchronization downloads static text rule definitions from trusted repositories via
            HTTPS directly to your local storage; no query history or profile criteria are shared
            during updates.
          </li>
        </ul>
        <h2 class="legal__h2" id="sec-5"><span class="legal__num">05</span>Regulatory Compliance &amp; Legal Classifications</h2>

        <h3 class="legal__h3">Indian Law &amp; CERT-In Directions Exemption</h3>
        <p class="legal__p">
          Under the Cyber Security Directions issued by the Indian Computer Emergency Response Team
          (CERT-In) under Section 70B of the Information Technology Act, 2000, traditional proxy VPN
          providers and cloud service platforms are subject to customer identity verification and
          5-year log retention mandates.
        </p>
        <ul class="legal__list">
          <li>
            <strong>Non-Applicability:</strong> Because Voydnet processes all packets on-device,
            operates zero remote proxy servers, and does not provide an external routing path to
            mask public IP addresses, Voydnet qualifies as <strong>local endpoint security and
            firewall software</strong>.
          </li>
          <li>
            <strong>Zero Retention Capacity:</strong> Voydnet does not maintain servers capable of
            capturing, logging, or storing subscriber browsing patterns, DNS requests, or public
            traffic flows. Voydnet is technically and legally unable to retain or produce records it
            does not collect or possess.
          </li>
        </ul>

        <h3 class="legal__h3">Digital Personal Data Protection (DPDP) Act, 2023 &amp; SPDI Rules</h3>
        <ul class="legal__list">
          <li>
            <strong>Specified Purpose:</strong> Personal data (limited to your email address for
            account maintenance) is collected exclusively upon lawful basis and affirmative consent.
          </li>
          <li>
            <strong>Data Erasure &amp; Access:</strong> You hold the right to request the complete
            deletion of your account record and associated telemetry IDs at any time.
          </li>
        </ul>

        <h3 class="legal__h3">App Store and Platform Rules</h3>
        <p class="legal__p">
          Voydnet maintains compliance with Indus Appstore Developer Terms and native Android
          security requirements by delivering clear permission prompts, honoring user opt-outs, and
          adhering to strict prohibitions on unauthorized tracking.
        </p>
        <h2 class="legal__h2" id="sec-6"><span class="legal__num">06</span>Security Architecture</h2>
        <p class="legal__p">
          All communications between the Voydnet client and our authentication infrastructure are
          secured using industry-standard Transport Layer Security (TLS 1.3/HTTPS). Local
          configurations, rule set caches, and user preferences remain quarantined within the
          private Android application sandbox (<code>/data/data/com.voydnet...</code>), preventing
          unauthorized cross-app access without elevated root permissions.
        </p>
        <h2 class="legal__h2" id="sec-7"><span class="legal__num">07</span>Children's Privacy</h2>
        <p class="legal__p">
          Voydnet does not deliberately collect, profile, or solicit personal information from
          individuals under 18 years of age. If we learn that account credentials belong to an
          unauthorized minor without parental consent, we will promptly purge those records from
          our authentication records.
        </p>
        <h2 class="legal__h2" id="sec-8"><span class="legal__num">08</span>Modifications to this Privacy Policy</h2>
        <p class="legal__p">
          We may amend this Privacy Policy periodically to reflect architectural updates, regulatory
          guidance, or feature releases. Any revised policy will be posted with an updated effective
          date. Continued use of Voydnet after updates constitute acknowledgment of the modified
          practices.
        </p>
        <h2 class="legal__h2" id="sec-9"><span class="legal__num">09</span>Grievance Officer &amp; Contact Information</h2>
        <p class="legal__p">
          In compliance with the Information Technology Act, 2000 and rules made thereunder, any
          queries, concerns, or requests regarding this Privacy Policy or the handling of your data
          may be directed to our Grievance Officer:
        </p>
        <dl class="legal__contact">
          <div class="legal__contact-row">
            <dt>Title</dt><dd>Grievance Officer</dd>
          </div>
          <div class="legal__contact-row">
            <dt>Entity</dt><dd>Voydnet Operations</dd>
          </div>
          <div class="legal__contact-row">
            <dt>Email</dt><dd>voydnet@gmail.com</dd>
          </div>
          <div class="legal__contact-row">
            <dt>Jurisdiction</dt><dd>India</dd>
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
