import React from 'react'
import { View, Text, Animated, Easing } from 'react-native'

export default function StarLoader({ size = 32, color = '#FFD700' }: { size?: number; color?: string }) {
  const rot = React.useRef(new Animated.Value(0)).current
  React.useEffect(() => {
    const loop = () => {
      rot.setValue(0)
      Animated.timing(rot, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }).start(loop)
    }
    loop()
    return () => { try { rot.stopAnimation() } catch {} }
  }, [])
  const rotate = rot.interpolate({ inputRange:[0,1], outputRange:['0deg','360deg'] })
  const scale = rot.interpolate({ inputRange:[0,0.5,1], outputRange:[0.9,1.05,0.9] })
  return (
    <Animated.View style={{ transform: [{ rotate }, { scale }], alignItems:'center', justifyContent:'center' }}>
      <Text style={{ fontSize: size, color }}>{'✦'}</Text>
    </Animated.View>
  )
}


