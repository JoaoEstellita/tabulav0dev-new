import { Platform, Animated, Easing, ViewProps } from 'react-native'
import React, { useEffect, useRef } from 'react'

type WebAnimateFn = (selector: string, opts?: { y?: number; duration?: number }) => void

let animeRef: any = null
async function ensureAnime() {
  if (animeRef) return animeRef
  try {
    const mod = await import('animejs/lib/anime.es.js')
    animeRef = mod.default || (mod as any)
  } catch {
    animeRef = null
  }
  return animeRef
}

export const animateOnMountWeb: WebAnimateFn = (selector, opts) => {
  if (Platform.OS !== 'web') return
  ensureAnime().then((anime) => {
    if (!anime) return
    anime({
      targets: selector,
      opacity: [0, 1],
      translateY: [opts?.y ?? 12, 0],
      duration: opts?.duration ?? 240,
      easing: 'easeOutQuad',
    })
  })
}

export function AnimatedMount({ children, style, delay = 0, distance = 12 }: { children: React.ReactNode; style?: ViewProps['style']; delay?: number; distance?: number }) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(distance)).current
  useEffect(() => {
    if (Platform.OS === 'web') return
    Animated.timing(opacity, { toValue: 1, duration: 240, delay, useNativeDriver: true, easing: Easing.out(Easing.quad) }).start()
    Animated.timing(translateY, { toValue: 0, duration: 240, delay, useNativeDriver: true, easing: Easing.out(Easing.quad) }).start()
  }, [delay, distance])
  if (Platform.OS === 'web') {
    return <>{children}</>
  }
  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  )
}


