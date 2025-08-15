export function fadeSlideIn(el: HTMLElement, opts?: { duration?: number; fromY?: number }) {
  try {
    const duration = Math.max(120, Math.min(600, opts?.duration ?? 260))
    const fromY = opts?.fromY ?? 12
    el.animate(
      [
        { opacity: 0, transform: `translateY(${fromY}px)` },
        { opacity: 1, transform: 'translateY(0px)' },
      ],
      { duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' }
    )
  } catch {}
}


