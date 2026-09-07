import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAstrologerHint } from '../services/AstrologerChatService'

const OPEN_KEY = 'astrologer_last_open'
const today = () => new Date().toISOString().slice(0, 10)

/**
 * Botão flutuante ✦ que abre o Astrólogo (chat no app). Fica sobre as abas
 * principais; um brilho pulsa devagar. Um badge sutil aparece quando a pessoa
 * ainda não abriu o chat HOJE (nudge do céu do dia) e some ao abrir.
 */
export default function AstrologerFab() {
  const navigation = useNavigation<any>()
  const pulse = useRef(new Animated.Value(0)).current
  const [badge, setBadge] = useState(false)

  useEffect(() => {
    // Badge só quando há NOVIDADE real (leitura do dia fresca) E a pessoa ainda
    // não abriu o chat hoje. Evita badge à toa.
    Promise.all([
      AsyncStorage.getItem(OPEN_KEY).catch(() => null),
      getAstrologerHint(),
    ]).then(([d, hasNews]) => setBadge(!!hasNews && d !== today())).catch(() => {})
  }, [])

  const open = useCallback(() => {
    setBadge(false)
    AsyncStorage.setItem(OPEN_KEY, today()).catch(() => {})
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
      {badge && <View style={s.badge} />}
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
  badge: { position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderRadius: 7, backgroundColor: '#FF4D6D', borderWidth: 2, borderColor: '#0F0F23' },
})
