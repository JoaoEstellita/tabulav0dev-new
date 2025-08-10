export function onEnterViewport(selector: string, cb: () => void, options?: IntersectionObserverInit) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
  const el = document.querySelector(selector)
  if (!el) return
  const io = new IntersectionObserver((entries) => {
    const first = entries[0]
    if (first && first.isIntersecting) {
      cb()
      io.disconnect()
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1, ...(options || {}) })
  io.observe(el)
}


