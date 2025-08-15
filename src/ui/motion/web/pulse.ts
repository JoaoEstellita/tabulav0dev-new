export function pulseOnce(el: HTMLElement, color: string = 'rgba(255,215,0,0.35)') {
  try {
    const overlay = document.createElement('div')
    overlay.style.position = 'absolute'
    overlay.style.inset = '0'
    overlay.style.borderRadius = '12px'
    overlay.style.pointerEvents = 'none'
    overlay.style.boxShadow = `0 0 0 0 ${color}`
    overlay.style.transition = 'box-shadow 600ms cubic-bezier(0.23, 1, 0.32, 1)'
    el.style.position = 'relative'
    el.appendChild(overlay)
    requestAnimationFrame(()=>{
      overlay.style.boxShadow = `0 0 0 12px rgba(0,0,0,0)`
    })
    setTimeout(()=>{ try { el.removeChild(overlay) } catch {} }, 700)
  } catch {}
}


