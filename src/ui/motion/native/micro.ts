import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated'
import { MotionDurations } from '../motion/tokens'

export function usePressScale() {
  const s = useSharedValue(1)
  const onPressIn = () => { s.value = withTiming(0.98, { duration: MotionDurations.xs }) }
  const onPressOut = () => { s.value = withTiming(1.0, { duration: MotionDurations.sm }) }
  const style = useAnimatedStyle(()=>({ transform: [{ scale: s.value }] }))
  return { onPressIn, onPressOut, style }
}


