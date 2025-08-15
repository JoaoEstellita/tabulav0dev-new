// Simple path morph using WAAPI between two d strings (same number of points recommended)
export function morphPathOnce(pathEl: SVGPathElement, fromD: string, toD: string, opts?: { duration?: number }) {
  try {
    const duration = Math.max(200, Math.min(1200, opts?.duration ?? 700))
    pathEl.setAttribute('d', fromD)
    ;(pathEl as any).animate?.(
      [ { d: fromD }, { d: toD } ],
      { duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
    )
  } catch {}
}


