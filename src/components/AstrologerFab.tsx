import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'

/**
 * Botão flutuante ✦ que abre o Astrólogo (chat no app). Fica sobre as abas
 * principais; um brilho pulsa devagar pra convidar sem incomodar.
 */
export default function AstrologerFab() {
  const navigation = useNavigation<any>()
  const pulse = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]))
    loop.start()
    return () => loop.stop()
  }, [pulse])

  const glowStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.6] }),
    transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] }) }],
  }

  return (
    <TouchableOpacity
      style={s.wrap}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('AstrologerChat')}
      accessibilityLabel="Falar com o astrólogo"
    >
      <Animated.View style={[s.glow, glowStyle]} />
      <Text style={s.icon}>✦</Text>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 18,
    bottom: Platform.OS === 'ios' ? 96 : 78, // acima da barra de abas
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: '#FFD700',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FFD700', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
    zIndex: 50,
  },
  glow: { position: 'absolute', width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFD700' },
  icon: { fontSize: 26, color: '#241A05', fontWeight: '900' },
})
