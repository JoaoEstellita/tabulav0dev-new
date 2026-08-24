import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { getMatches, type MatchProfile } from '../../services/DiscoveryService'
import { requestConnection } from '../../services/ConnectionsService'

export default function MatchesScreen() {
  const navigation = useNavigation<any>()
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const [loading, setLoading] = useState(true)
  const [premium, setPremium] = useState(false)
  const [results, setResults] = useState<MatchProfile[]>([])
  const [teaser, setTeaser] = useState(0)
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const r = await getMatches()
        setPremium(r.premium)
        setResults(r.results || [])
        setTeaser(r.teaser || 0)
      } catch { /* mantém */ }
      setLoading(false)
    })()
  }, [])

  const connect = async (p: MatchProfile) => {
    try { await requestConnection(p.uid, null, false); setSentIds((s) => new Set(s).add(p.uid)) } catch { /* silencioso */ }
  }
  const trio = (p: MatchProfile) => [p.sunSign && `☉ ${p.sunSign}`, p.moonSign && `☽ ${p.moonSign}`, p.ascSign && `ASC ${p.ascSign}`].filter(Boolean).join('  ·  ')
  const scoreColor = (s: number) => (s >= 75 ? '#FF4D8D' : s >= 60 ? '#FFD700' : '#8892a4')
  const openPerson = (p: MatchProfile) => navigation.navigate('PersonProfile', { uid: p.uid, displayName: p.displayName, photoURL: p.photoURL, sunSign: p.sunSign, moonSign: p.moonSign, ascSign: p.ascSign, city: p.city })

  if (loading) return <View style={styles.center}><ActivityIndicator color="#FFD700" /></View>

  // Gate: não-premium vê o teaser + CTA de assinatura.
  if (!premium) {
    return (
      <View style={styles.center}>
        <Ionicons name="sparkles" size={48} color="#FFD700" />
        <Text style={styles.teaserBig}>
          {teaser > 0
            ? tl(`Você tem ${teaser} ${teaser === 1 ? 'match forte' : 'matches fortes'}`, `You have ${teaser} strong ${teaser === 1 ? 'match' : 'matches'}`, `Tienes ${teaser} ${teaser === 1 ? 'match fuerte' : 'matches fuertes'}`, `Hai ${teaser} ${teaser === 1 ? 'match forte' : 'match forti'}`)
            : tl('Descubra quem mais combina com você', 'Discover who matches you most', 'Descubre quien combina mas contigo', 'Scopri chi ti corrisponde di piu')}
        </Text>
        <Text style={styles.teaserSub}>
          {tl('Assine qualquer plano para ver quem são e se conectar.', 'Subscribe to any plan to see who they are and connect.', 'Suscribete a cualquier plan para ver quienes son y conectar.', 'Abbonati a un piano per vedere chi sono e connetterti.')}
        </Text>
        <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Premium', { openTab: 'features' })}>
          <Text style={styles.ctaText}>{tl('Ver planos', 'See plans', 'Ver planes', 'Vedi i piani')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>{tl('Quem mais combina com você', 'Who matches you most', 'Quien combina mas contigo', 'Chi ti corrisponde di piu')}</Text>
      <Text style={styles.headerSub}>{tl('Ranking de compatibilidade entre todas as pessoas da Rede.', 'Compatibility ranking across everyone in the Network.', 'Ranking de compatibilidad con toda la Red.', 'Classifica di compatibilita con tutta la Rete.')}</Text>
      {!results.length ? (
        <Text style={styles.empty}>{tl('Ainda não há gente suficiente na busca. Volte em breve.', 'Not enough people yet. Check back soon.', 'Aun no hay suficientes personas. Vuelve pronto.', 'Non c\'e ancora abbastanza gente. Torna presto.')}</Text>
      ) : null}
      {results.map((p, i) => (
        <TouchableOpacity key={p.uid} style={styles.card} activeOpacity={0.8} onPress={() => openPerson(p)}>
          <Text style={styles.rank}>{i + 1}</Text>
          {p.photoURL
            ? <Image source={{ uri: p.photoURL }} style={styles.avatar} />
            : <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.avatarInitial}>{(p.displayName || '?').slice(0, 1).toUpperCase()}</Text></View>}
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.name} numberOfLines={1}>{p.displayName || tl('Sem nome', 'No name', 'Sin nombre', 'Senza nome')}</Text>
            {trio(p) ? <Text style={styles.trio} numberOfLines={1}>{trio(p)}</Text> : null}
            {p.city ? <Text style={styles.city} numberOfLines={1}>📍 {p.city}</Text> : null}
          </View>
          <View style={styles.right}>
            <Text style={[styles.score, { color: scoreColor(p.score) }]}>{p.score}%</Text>
            <TouchableOpacity style={[styles.connectBtn, sentIds.has(p.uid) && styles.connectBtnDone]} disabled={sentIds.has(p.uid)} onPress={() => connect(p)}>
              <Text style={styles.connectBtnText}>{sentIds.has(p.uid) ? tl('Enviado', 'Sent', 'Enviado', 'Inviato') : tl('Conectar', 'Connect', 'Conectar', 'Connetti')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0F0F23' },
  center: { flex: 1, backgroundColor: '#0F0F23', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 },
  header: { color: '#EDEBF7', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#8892a4', fontSize: 13, marginTop: 4, marginBottom: 18, lineHeight: 18 },
  rank: { color: '#6E6F8C', fontSize: 14, fontWeight: '800', width: 18, textAlign: 'center', fontVariant: ['tabular-nums'] },
  teaserBig: { color: '#e2e8f0', fontSize: 22, fontWeight: '700', textAlign: 'center' },
  teaserSub: { color: '#8892a4', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  cta: { backgroundColor: '#FFD700', paddingHorizontal: 28, paddingVertical: 13, borderRadius: 12, marginTop: 8 },
  ctaText: { color: '#0B0A18', fontWeight: '700', fontSize: 16 },
  empty: { color: '#8892a4', fontSize: 14, textAlign: 'center', marginTop: 40 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#161728', borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#12101f' },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: '#FFD700', fontSize: 20, fontWeight: '700' },
  name: { color: '#e2e8f0', fontSize: 16, fontWeight: '600' },
  trio: { color: '#c9cfe0', fontSize: 12, marginTop: 2 },
  city: { color: '#8892a4', fontSize: 12, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 6 },
  score: { fontSize: 18, fontWeight: '800' },
  connectBtn: { backgroundColor: '#FFD700', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 9 },
  connectBtnDone: { backgroundColor: '#22C55E' },
  connectBtnText: { color: '#0B0A18', fontWeight: '700', fontSize: 12 },
})
