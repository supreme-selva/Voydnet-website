/* ==========================================================================
   PHONE MOCKUP — SHARED MODEL CONTROLLER BASE
   --------------------------------------------------------------------------
   Every phone model is behaviourally identical: it exposes the screen mount
   so embed-view can render into it, lets callers nudge the 3D pose, and
   cleans up on destroy. Rather than repeat that in each model.js, they all
   delegate here.

   Contract returned to the loader:  { screenSlot, setPose, destroy }
   Pose custom properties are read from a per-model map because each model
   names its rotation vars differently (--pm-rot-* here, standardised).
   ========================================================================== */

/**
 * @param {HTMLElement} root   Element the model partial was injected into.
 * @param {object} [props]
 * @param {{x?:number,y?:number,z?:number}} [props.pose]
 * @param {object} [poseVars]  Custom property names for each axis.
 * @returns {{screenSlot:HTMLElement|null, setPose:Function, destroy:Function}}
 */
export function createModelController(root, props = {}, poseVars = {}) {
  const {
    x = "--pm-rot-x",
    y = "--pm-rot-y",
    z = "--pm-rot-z",
  } = poseVars;

  const device = root.querySelector("[data-component='phone-mockup']");
  const screenSlot = root.querySelector("[data-slot='screen']");

  if (!device) {
    console.warn("[phone-mockup] device element not found in mount root.");
  }

  function setPose({ x: rx, y: ry, z: rz } = {}) {
    if (!device) return;
    if (typeof rx === "number") device.style.setProperty(x, `${rx}deg`);
    if (typeof ry === "number") device.style.setProperty(y, `${ry}deg`);
    if (typeof rz === "number") device.style.setProperty(z, `${rz}deg`);
  }

  if (props.pose) setPose(props.pose);

  return {
    screenSlot,
    setPose,
    destroy() {
      /* No persistent listeners/timers held; present for a uniform contract. */
    },
  };
}
