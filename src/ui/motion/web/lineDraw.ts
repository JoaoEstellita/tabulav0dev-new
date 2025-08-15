// Animate SVG stroke drawing using WAAPI
export function lineDrawOnce(pathEl: SVGPathElement | SVGPolylineElement, opts?: { duration?: number }) {
  try {
    const total = (pathEl as any).getTotalLength?.() || 0
    pathEl.style.strokeDasharray = `${total}`
    pathEl.style.strokeDashoffset = `${total}`
    const duration = Math.max(200, Math.min(1200, opts?.duration ?? 600))
    pathEl.animate(
      [ { strokeDashoffset: total }, { strokeDashoffset: 0 } ],
      { duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
    )
  } catch {}
}


