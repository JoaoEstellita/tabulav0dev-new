import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { getMomento } from '../../services/MomentoService'

// Card de descoberta do Momento Certo na Home → abre a aba Previsões (default = Momento).
// Se já houver cache do dia (o usuário já visitou a aba), mostra a MELHOR janela real
// como teaser vivo. Usa cacheOnly → nunca dispara o motor pesado na Home.
export default function MomentoHomeCard() {
  const navigation = useNavigation<any>()
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it } as any)[language] || pt
  const [best, setBest] = useState<{ dateISO: string; score: number } | null>(null)

  useEffect(() => {
    if (!user?.uid) return
    let alive = true
    getMomento(user.uid, 'amor', { cacheOnly: true })
      .then((r) => { if (alive && r.windows.length) setBest({ dateISO: r.windows[0].dateISO, score: r.windows[0].score }) })
      .catch(() => {})
    return () => { alive = false }
  }, [user?.uid])

  const fmt = (iso: string) => {
    try { return new Date(iso + 'T12:00:00').toLocaleDateString(language, { weekday: 'short', day: '2-digit', month: 'short' }) } catch { return iso }
  }

  return (
    <TouchableOpacity activeOpacity={0.9} style={s.wrap} onPress={() => navigation.navigate('Forecast')}>
      <LinearGradient colors={['#2a2440', '#1b1830']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.card}>
        <View style={s.icon}><Text style={{ fontSize: 20 }}>⭐</Text></View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={s.title}>{tl('Momento Certo', 'Right Moment', 'Momento Justo', 'Momento Giusto')}</Text>
          {best ? (
            <Text style={s.sub} numberOfLines={2}>
              {tl('Melhor dia pro amor', 'Best day for love', 'Mejor dia para el amor', 'Miglior giorno per l\'amore')}:{' '}
              <Text style={s.subStrong}>{fmt(best.dateISO)}</Text> · {best.score}
            </Text>
          ) : (
            <Text style={s.sub} numberOfLines={2}>{tl('Descubra os melhores dias para agir — amor, carreira, decisões.', 'Find the best days to act — love, career, decisions.', 'Descubre los mejores dias para actuar — amor, carrera, decisiones.', 'Scopri i giorni migliori per agire — amore, carriera, decisioni.')}</Text>
          )}
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
  subStrong: { color: '#EDEBF7', fontWeight: '800', textTransform: 'capitalize' },
})
