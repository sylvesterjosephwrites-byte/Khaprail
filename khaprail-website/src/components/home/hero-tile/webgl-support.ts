// One-shot capability probe for the hero's decorative 3D tile. Only real
// capability failure (no WebGL) or an explicit "reduced motion" preference
// changes behavior — see hero-tile/index.tsx for why we deliberately do NOT
// blanket-disable the 3D scene on mobile (that would remove the requested
// touch-drag interaction for most of this site's actual audience).
export function hasWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas")
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
}
