# Voydnet — Web Showcase

A marketing showcase for the Voydnet app, built as a **pure HTML / CSS / JavaScript** site — no framework, no build step, no bundler. It renders a floating 3D CSS phone with the app demo video playing live inside the screen, and routes between pages client-side.

The point of this repo is not just that it works, but *how it's organised*: every concern lives in its own folder and the pieces are wired together by a tiny core. You can open `index.html` directly and it runs.

---

## Running it

Open `index.html` in a modern browser.

> **Note on ES modules + `file://`:** this project uses native ES modules and `fetch()` to load component partials. A few browsers restrict `fetch` from `file://`. If the page is blank when opened directly, serve the folder over any static server, for example:
>
> ```bash
> # pick whichever you have
> npx serve .
> python -m http.server
> ```
>
> Then visit the printed `http://localhost:...` URL. No configuration is needed — hash routing works on any static host and any sub-path.

---

## Architecture at a glance

```
voydnet.digital.website/
├─ index.html                 ← thin shell: 1 stylesheet + 1 module, nothing else
│
├─ assets/                    ← all static media, grouped by type
│  ├─ video/                  ←   app-screen-video.mp4 (the demo video)
│  └─ images/
│
├─ src/
│  ├─ app.js                  ← composition root: builds + starts the router
│  │
│  ├─ core/                   ← the tiny framework-free engine
│  │  ├─ router.js            ←   hash router (works on file:// and any host)
│  │  └─ component.js         ←   loads .html partials + mounts controllers
│  │
│  ├─ routes/
│  │  └─ routes.js            ← declarative route table (URL hash → page)
│  │
│  ├─ pages/                  ← one folder per page (route target)
│  │  ├─ showcase/            ←   "/"      3D phone + video + CTAs
│  │  └─ about/               ←   "/about" proves routing end-to-end
│  │
│  ├─ components/             ← reusable UI, each self-contained
│  │  ├─ phone-mockup/        ←   family of interchangeable 3D phone models
│  │  │  ├─ phone-mockup.js   ←     public API: mountPhoneMockup(host,{model})
│  │  │  ├─ registry.js       ←     name → model parts map ("model-1"…)
│  │  │  ├─ model-base.js     ←     shared model controller (screenSlot/pose)
│  │  │  └─ models/
│  │  │     ├─ model-1/       ←       hole-punch, thin bezel (html+css+js)
│  │  │     └─ model-2/       ←       metal frame, glass sheen (html+css+js)
│  │  ├─ embed-view/          ←   video/iframe embed logic (autoplay handling)
│  │  └─ button/              ←   token-driven button (css + factory js)
│  │
│  ├─ styles/                 ← ITCSS cascade
│  │  ├─ tokens.css           ←   design variables (colours, spacing, motion…)
│  │  ├─ base.css             ←   reset + element defaults
│  │  ├─ layout.css           ←   structural objects (shell, stage, container)
│  │  ├─ utilities.css        ←   single-purpose helpers (loaded last)
│  │  └─ main.css             ←   the ONE stylesheet index.html links; @imports the rest
│  │
│  └─ config/
│     └─ assets.js            ← single registry of asset URLs
│
└─ docs/
   └─ reference/              ← original standalone mockups, kept for reference
```

### Design principles

- **Thin shell, composed at runtime.** `index.html` links exactly one stylesheet and one module. All markup is assembled by JS from independent pieces. Swapping a page or component never touches the shell.
- **Colocation.** A component owns its markup (`.html`), styling (`.css`) and behaviour (`.js`) in one folder. To understand or delete a component, you look in one place.
- **Layered CSS (ITCSS).** Styles flow from lowest specificity (tokens) to highest (utilities), so the cascade is predictable and overrides are intentional. `main.css` is the only file the page links; it `@import`s the layers in order.
- **Tokens are the single source of truth.** No component hard-codes a colour or spacing value; it references a token in `tokens.css`. Rebrand once, everywhere.
- **A uniform component contract.** Every component controller exports `mount(root, props)` and returns an object with `destroy()`. The loader and router rely on this so lifecycle and cleanup are consistent.
- **Hash routing on purpose.** Client-side routing with `location.hash` needs no server rewrites and works from the file system, which suits a static site. Pages are lazily imported, so a route's code loads only when visited.

---

## Phone models (a swappable family)

There are multiple 3D phone models, and more will be added. They live under
`src/components/phone-mockup/models/` named `model-1`, `model-2`, and so on.
Every model exposes the **same contract** — a `screenSlot` element plus
`setPose()` and `destroy()` — so any model can host the embed with zero
changes at the call site:

```js
import { mountPhoneMockup } from ".../phone-mockup/phone-mockup.js";

const phone = await mountPhoneMockup(hostEl, { model: "model-2" });
embedView.mount(phone.screenSlot, { kind: "video", src: ASSETS.demoVideo });
```

Try either model live by adding a query to the hash:

```
index.html#/            ← default (model-1)
index.html#/?model=model-2
```

- **model-1** — slim hole-punch device, thin 4px bezel, screen ratio tuned to `720×1600` (0.45).
- **model-2** — thicker metal-frame device with a volume rocker + power button, diagonal glass sheen, hole-punch camera, USB-C port and speaker grille.

### Add a model-3

1. Create `src/components/phone-mockup/models/model-3/` with `model-3.html`, `model-3.css`, `model-3.js` (copy model-1 for the shape — keep the `data-slot="screen"` mount and the `.pm`/`.pm--model-3` class scoping).
2. `@import "../components/phone-mockup/models/model-3/model-3.css";` in `src/styles/main.css`.
3. Register one line in `src/components/phone-mockup/registry.js`.

That's it — `mountPhoneMockup(host, { model: "model-3" })` now works.

## How the demo video is embedded

1. `pages/showcase` mounts a phone model, which exposes a `screenSlot`.
2. It then calls `embed-view` to render a `<video>` into that slot.
3. `embed-view` owns all autoplay-policy handling (muted autoplay, and a tap-to-play fallback if the browser blocks it).
4. For model-1 the screen's inner aspect ratio is matched to the video's native `720×1600` (0.45), so the video fills the screen with **no cropping**; other models use `object-fit: cover`.

Changing the video is a one-line edit in `src/config/assets.js`.

---

## Extending it

- **New page:** add `src/pages/<name>/<name>.page.js` exporting `render(outlet, ctx)`, then register one line in `src/routes/routes.js`.
- **New component:** add `src/components/<name>/` with `<name>.html`, `<name>.css`, `<name>.js` (exporting `mount`), and `@import` its CSS in `src/styles/main.css`.
- **New phone model:** see "Add a model-3" above.
- **New asset:** drop it under `assets/` and add it to `src/config/assets.js`.
