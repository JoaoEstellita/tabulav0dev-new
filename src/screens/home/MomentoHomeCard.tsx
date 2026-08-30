import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useAppLanguage } from '../../hooks/useAppLanguage'

// Card de descoberta do Momento Certo na Home → abre a aba Previsões (default = Momento).
export default function MomentoHomeCard() {
  const navigation = useNavigation<any>()
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it } as any)[language] || pt
  return (
    <TouchableOpacity activeOpacity={0.9} style={s.wrap} onPress={() => navigation.navigate('Forecast')}>
      <LinearGradient colors={['#2a2440', '#1b1830']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.card}>
        <View style={s.icon}><Text style={{ fontSize: 20 }}>⭐</Text></View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={s.title}>{tl('Momento Certo', 'Right Moment', 'Momento Justo', 'Momento Giusto')}</Text>
          <Text style={s.sub} numberOfLines={2}>{tl('Descubra os melhores dias para agir — amor, carreira, decisões.', 'Find the best days to act — love, career, decisions.', 'Descubre los mejores dias para actuar — amor, carrera, decisiones.', 'Scopri i giorni migliori per agire — amore, carriera, decisioni.')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#FFD700" />
      </LinearGradient>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  wrap: { marginHorizontal: 16, marginBottom: 4 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)', paddingVertical: 14, paddingHorizontal: 14 },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,215,0,0.14)', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFD700', fontSize: 15, fontWeight: '900' },
  sub: { color: '#B9BAD6', fontSize: 12.5, lineHeight: 17, marginTop: 2 },
})
