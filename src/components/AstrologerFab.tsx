import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { getAstrologerUnread } from '../services/AstrologerChatService'

/**
 * Botão flutuante ✦ que abre o Astrólogo (chat no app). Fica sobre as abas
 * principais; um brilho pulsa devagar. Um badge com NÚMERO mostra quantas
 * proativas (matinal, picos, match, avaliação…) estão não-lidas; some ao ler.
 */
export default function AstrologerFab() {
  const navigation = useNavigation<any>()
  const isFocused = useIsFocused()
  const pulse = useRef(new Animated.Value(0)).current
  const [unread, setUnread] = useState(0)

  // Conta não-lidas ao montar e sempre que a Home volta ao foco (após ler, zera).
  useEffect(() => {
    if (!isFocused) return
    let alive = true
    getAstrologerUnread().then((n) => { if (alive) setUnread(n || 0) }).catch(() => {})
    return () => { alive = false }
  }, [isFocused])

  const open = useCallback(() => {
    setUnread(0)
    navigation.navigate('AstrologerChat')
  }, [navigation])

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
      onPress={open}
      accessibilityLabel="Falar com o astrólogo"
    >
      <Animated.View style={[s.glow, glowStyle]} />
      <Text style={s.icon}>✦</Text>
      {unread > 0 && (
        <View style={s.badge}><Text style={s.badgeTx}>{unread > 9 ? '9+' : String(unread)}</Text></View>
      )}
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 18,
    bottom: Platform.OS === 'ios' ? 24 : 18, // logo acima da barra de abas (dentro da Home)
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: '#FFD700',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FFD700', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
    zIndex: 50,
  },
  glow: { position: 'absolute', width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFD700' },
  icon: { fontSize: 26, color: '#241A05', fontWeight: '900' },
  badge: { position: 'absolute', top: -2, right: -2, minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 4, backgroundColor: '#FF4D6D', borderWidth: 2, borderColor: '#0F0F23', alignItems: 'center', justifyContent: 'center' },
  badgeTx: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
})
