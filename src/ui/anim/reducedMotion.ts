import { Platform, AccessibilityInfo } from 'react-native'
import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
        const update = () => setReduced(!!mql.matches)
        update()
        mql.addEventListener?.('change', update)
        return () => mql.removeEventListener?.('change', update)
      } catch {
        setReduced(false)
      }
    } else {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduced).catch(() => setReduced(false))
      const sub = AccessibilityInfo.addEventListener?.('reduceMotionChanged', setReduced as any)
      return () => (sub as any)?.remove?.()
    }
  }, [])
  return reduced
}


