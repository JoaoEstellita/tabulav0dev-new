"use client"

import { useEffect, useMemo } from "react"
import { StyleSheet, Dimensions, View } from "react-native"
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg"

/**
 * Fundo cósmico animado da tela de Login (cross-platform: PWA + nativo).
 * - Campo de estrelas em 3 camadas que "piscam" fora de sincronia (twinkle).
 * - Estrela cadente ocasional (streak diagonal).
 * - Brilho radial dourado atrás do logo (nebulosa).
 * Sutil e performático: só ~5 valores animados no thread da UI; nenhuma
 * animação por estrela. pointerEvents="none" → não intercepta toques do form.
 */

const { width: W, height: H } = Dimensions.get("window")
const LAYERS = 3
const STARS_PER_LAYER = 18

// PRNG determinístico (mulberry32) → posições estáveis entre renders.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Star = { left: string; top: string; size: number; gold: boolean; baseOpacity: number }

function buildStars(rand: () => number): Star[] {
  return Array.from({ length: STARS_PER_LAYER }, () => {
    const gold = rand() < 0.22
    return {
      left: `${(rand() * 100).toFixed(2)}%`,
      top: `${(rand() * 100).toFixed(2)}%`,
      size: gold ? 1.6 + rand() * 2.2 : 1 + rand() * 2,
      gold,
      baseOpacity: 0.5 + rand() * 0.5,
    }
  })
}

function StarLayer({ stars }: { stars: Star[] }) {
  return (
    <>
      {stars.map((s, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: s.left as any,
            top: s.top as any,
            width: s.size,
            height: s.size,
            borderRadius: s.size / 2,
            opacity: s.baseOpacity,
            backgroundColor: s.gold ? "#FFE9A8" : "#FFFFFF",
          }}
        />
      ))}
    </>
  )
}

export default function CosmicBackground({ intensity = 1 }: { intensity?: number }) {
  // Estrelas pré-computadas (uma vez), 3 camadas com seeds distintas.
  const layers = useMemo(() => {
    return Array.from({ length: LAYERS }, (_, i) => buildStars(mulberry32(1234 + i * 977)))
  }, [])

  // Twinkle: uma shared value por camada, loop com durações diferentes.
  const t0 = useSharedValue(0.2)
  const t1 = useSharedValue(0.6)
  const t2 = useSharedValue(0.9)
  // Estrela cadente: progresso 0→1 com longa espera entre disparos.
  const shoot = useSharedValue(0)

  useEffect(() => {
    const twinkle = (sv: typeof t0, duration: number) => {
      sv.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }), -1, true)
    }
    twinkle(t0, 2200)
    twinkle(t1, 3100)
    twinkle(t2, 2600)
    // Dispara ~a cada 11s: 900ms de trajeto + ~10s parado.
    shoot.value = withDelay(
      2500,
      withRepeat(withSequence(withTiming(1, { duration: 900, easing: Easing.linear }), withDelay(10200, withTiming(0, { duration: 0 }))), -1)
    )
    return () => {
      cancelAnimation(t0)
      cancelAnimation(t1)
      cancelAnimation(t2)
      cancelAnimation(shoot)
    }
  }, [])

  const style0 = useAnimatedStyle(() => ({ opacity: (0.35 + t0.value * 0.65) * intensity }))
  const style1 = useAnimatedStyle(() => ({ opacity: (0.35 + t1.value * 0.65) * intensity }))
  const style2 = useAnimatedStyle(() => ({ opacity: (0.35 + t2.value * 0.65) * intensity }))

  const shootStyle = useAnimatedStyle(() => {
    const p = shoot.value
    const tx = -80 + p * (W + 160)
    const ty = -60 + p * (H * 0.55)
    const opacity = p <= 0 ? 0 : interpolate(p, [0, 0.12, 0.8, 1], [0, 1, 1, 0], "clamp")
    return { opacity, transform: [{ translateX: tx }, { translateY: ty }, { rotate: "24deg" }] }
  })

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Nebulosa: brilho radial dourado atrás do logo (estático, barato). */}
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="30%" rx="65%" ry="45%">
            <Stop offset="0%" stopColor="#FFD700" stopOpacity={0.16 * intensity} />
            <Stop offset="45%" stopColor="#5B4B8A" stopOpacity={0.1 * intensity} />
            <Stop offset="100%" stopColor="#0F0F23" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glow)" />
      </Svg>

      <Animated.View style={[StyleSheet.absoluteFill, style0]}>
        <StarLayer stars={layers[0]} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, style1]}>
        <StarLayer stars={layers[1]} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, style2]}>
        <StarLayer stars={layers[2]} />
      </Animated.View>

      {/* Estrela cadente */}
      <Animated.View style={[styles.shootingStar, shootStyle]} />
    </View>
  )
}

const styles = StyleSheet.create({
  shootingStar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 90,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    shadowColor: "#FFE9A8",
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
})
