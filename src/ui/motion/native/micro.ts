// Importar dinamicamente para evitar dependência no bundle web (Vercel)
let Reanimated: any = null
try { Reanimated = require('react-native-reanimated') } catch {}
const useSharedValue = Reanimated?.useSharedValue || ((v: number)=>({ value: v }))
const withTiming = Reanimated?.withTiming || ((v: number)=>v)
const useAnimatedStyle = Reanimated?.useAnimatedStyle || ((fn: any)=>({}))
import { MotionDurations } from '../motion/tokens'

export function usePressScale() {
  const s = useSharedValue(1)
  const onPressIn = () => { s.value = withTiming(0.98, { duration: MotionDurations.xs }) }
  const onPressOut = () => { s.value = withTiming(1.0, { duration: MotionDurations.sm }) }
  const style = useAnimatedStyle(()=>({ transform: [{ scale: s.value }] }))
  return { onPressIn, onPressOut, style }
}


