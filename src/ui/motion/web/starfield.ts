// Lightweight starfield using anime.js (PWA only)
// Creates N stars with subtle twinkle and slow parallax-like drift

let cleanup: (() => void) | null = null

export function mountStarfield(container: HTMLElement, options?: { count?: number }) {
  try {
    const count = Math.min(80, Math.max(20, options?.count ?? 40))
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const cvs = document.createElement('canvas')
    cvs.style.position = 'absolute'
    cvs.style.inset = '0'
    cvs.style.pointerEvents = 'none'
    cvs.style.zIndex = '0'
    container.style.position = 'relative'
    container.prepend(cvs)

    const ctx = cvs.getContext('2d')!
    const stars = new Array(count).fill(0).map(()=>({ x: 0, y: 0, r: 0, a: 0 }))

    const resize = () => {
      cvs.width = Math.floor(container.clientWidth * dpr)
      cvs.height = Math.floor(container.clientHeight * dpr)
    }
    resize()

    const rand = (min:number, max:number)=> min + Math.random()*(max-min)
    const resetStar = (s:any) => {
      s.x = rand(0, cvs.width)
      s.y = rand(0, cvs.height)
      s.r = rand(0.5*dpr, 1.2*dpr)
      s.a = rand(0.2, 0.9)
    }
    stars.forEach(resetStar)

    let rafId = 0
    let tick = 0
    const draw = () => {
      tick++
      ctx.clearRect(0,0,cvs.width,cvs.height)
      for (const s of stars) {
        // gentle drift
        s.y += 0.03 * dpr
        if (s.y > cvs.height + 2) { s.y = -2; s.x += 8*dpr }
        // twinkle
        const tw = 0.25 + 0.25 * Math.sin((tick/60) + s.x*0.01)
        const alpha = Math.max(0, Math.min(1, s.a * tw))
        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2)
        ctx.fill()
      }
      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)

    const onVis = () => {
      const vis = document.visibilityState
      if (vis === 'hidden') cancelAnimationFrame(rafId)
      else rafId = requestAnimationFrame(draw)
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', resize)

    cleanup = () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
      try { container.removeChild(cvs) } catch {}
    }
  } catch (e) {
    console.log('starfield error', e)
  }
}

export function unmountStarfield(){ try { cleanup?.() } catch {} finally { cleanup = null } }


