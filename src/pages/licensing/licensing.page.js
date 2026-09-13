/* ==========================================================================
   PAGE: licensing  (route "/licencing")
   --------------------------------------------------------------------------
   The End-User License Agreement (EULA) & Open Source Attributions screen.
   A sibling of the Privacy Policy and Terms pages — it reuses the exact same
   editorial "legal" look-and-feel (shared .legal__* styles) so all three
   documents feel like one family: sticky site header, a tight two-row
   document header, a justified quick-nav strip, then calm, well-spaced
   long-form typography.

   The copy is authored ONCE here as semantic HTML that mirrors the source
   document. Look-and-feel lives in pages/privacy/privacy.css (the shared
   "legal" surface) plus the shared inline-link style in pages/terms/terms.css,
   so this module stays a thin composition root — like every other page.
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

    <section class="legal" data-component="licensing">

      <!-- Minimal two-row header, edge-to-edge (justified) — no card, no
           heavy shadow, no centered hero. Row 1: mark + title vs. the
           effective date. Row 2: a quiet, justified quick-nav strip. -->
      <header class="legal__head" data-reveal>

        <div class="legal__row legal__row--top">
          <div class="legal__id">
            <img class="legal__mark" src="${ASSETS.privacyPolicyImage}"
                 alt="" width="72" height="72" loading="eager" decoding="async" />
            <h1 class="legal__title">Licensing</h1>
          </div>
          <p class="legal__date">Updated Sep 13, 2026</p>
        </div>

        <nav class="legal__row legal__row--nav" aria-label="On this page">
          <button type="button" data-goto="sec-1">Proprietary License</button>
          <button type="button" data-goto="sec-2">Open Source</button>
          <button type="button" data-goto="sec-3">Disclaimers</button>
        </nav>
      </header>

      <div class="legal__doc">

        <p class="legal__lede">
          This document sets out the End-User License Agreement (EULA) governing your use of the
          Voydnet application, together with the open-source attributions for the community-maintained
          filter lists and software frameworks that power Voydnet's on-device blocking engine.
        </p>

        <h2 class="legal__h2" id="sec-1"><span class="legal__num">01</span>Voydnet Proprietary License</h2>
        <p class="legal__p">
          Voydnet and its original underlying source code, user interface, branding, and proprietary
          local-filtering algorithms are the exclusive property of Voydnet.
        </p>
        <ul class="legal__list">
          <li>
            <strong>Grant of License:</strong> We grant you a limited, non-exclusive,
            non-transferable, and revocable license to download, install, and use the Voydnet
            application on your personal Android device solely for your personal, non-commercial use.
          </li>
          <li>
            <strong>Restrictions:</strong> You may not decompile, reverse engineer, disassemble,
            attempt to derive the source code of, modify, or distribute derivative works of the
            Voydnet application. You may not distribute the app on unauthorized third-party platforms
            without explicit permission.
          </li>
        </ul>

        <h2 class="legal__h2" id="sec-2"><span class="legal__num">02</span>Open Source Licenses &amp; Third-Party Attributions</h2>
        <p class="legal__p">
          Voydnet's on-device blocking engine respects and utilizes publicly available,
          community-maintained filter lists to protect users from trackers and malicious domains. We
          do not claim ownership of these external rule sets. We are immensely grateful to the
          open-source community for their contributions to a private internet.
        </p>
        <ul class="legal__list">
          <li>
            <strong>EasyList:</strong> We utilize filter rules originating from EasyList. This
            material is attributed to The EasyList authors
            (<a class="legal__link" href="https://easylist.to/" target="_blank" rel="noopener noreferrer">easylist.to</a>)
            and is utilized under the dual-license of the GNU General Public License version 3
            (GPLv3) and Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0).
          </li>
          <li>
            <strong>HaGeZi:</strong> We utilize DNS blocklists compiled by HaGeZi
            (<a class="legal__link" href="https://github.com/hagezi" target="_blank" rel="noopener noreferrer">github.com/hagezi</a>).
            These lists are provided under the GNU General Public License version 3 (GPLv3).
          </li>
          <li>
            <strong>Application Frameworks:</strong> Voydnet integrates various open-source software
            development kits (SDKs) for authentication (Supabase) and Android native functions. These
            components operate under permissive licenses, primarily the MIT License and Apache License
            2.0.
          </li>
        </ul>

        <h3 class="legal__h3">Reference Links</h3>
        <dl class="legal__contact">
          <div class="legal__contact-row">
            <dt>GNU GPLv3</dt>
            <dd><a class="legal__link" href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer">gnu.org/licenses/gpl-3.0.html</a></dd>
          </div>
          <div class="legal__contact-row">
            <dt>Apache 2.0</dt>
            <dd><a class="legal__link" href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer">apache.org/licenses/LICENSE-2.0</a></dd>
          </div>
        </dl>

        <h2 class="legal__h2" id="sec-3"><span class="legal__num">03</span>Disclaimers and Limitation of Liability</h2>
        <p class="legal__p">
          Voydnet and its integrated filter lists are provided <strong>"as is"</strong> without
          warranty of any kind, express or implied. While Voydnet routes your traffic locally to
          aggressively block known trackers and malicious domains, we do not guarantee absolute
          protection against all unmapped digital threats or zero-day vulnerabilities.
        </p>
        <p class="legal__p">
          In no event shall Voydnet, its developers, or the authors of the integrated open-source
          lists be liable for any claim, damages, or other liability — whether in an action of
          contract, tort, or otherwise — arising from, out of, or in connection with the software or
          the use or other dealings in the software.
        </p>

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
