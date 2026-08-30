import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../hooks/useAuth'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { getMomento, type MomentoIntention } from '../services/MomentoService'

// Mapa área da vida → intenção do Momento Certo. Áreas sem intenção 1:1
// (família/espiritualidade/transformação) usam 'decisao' (melhor dia geral).
const AREA_TO_INTENTION: Record<string, MomentoIntention> = {
  amor: 'amor', carreira: 'carreira', comunicacao: 'conversa', saude: 'saude',
  financas: 'contrato', familia: 'decisao', espiritualidade: 'decisao', transformacao: 'decisao',
}

// Card "melhor momento" dentro do modal de status — o melhor dia para agir NAQUELA área.
export default function MomentoAreaCard({ areaKey }: { areaKey: string }) {
  const navigation = useNavigation<any>()
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it } as any)[language] || pt
  const intention = AREA_TO_INTENTION[String(areaKey || '').toLowerCase()] || 'decisao'
  const [best, setBest] = useState<{ dateISO: string; score: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [gated, setGated] = useState(false)

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return }
    let alive = true
    setLoading(true); setBest(null); setGated(false)
    getMomento(user.uid, intention)
      .then((r) => {
        if (!alive) return
        if (r.gated) { setGated(true); return }
        if (r.windows.length) setBest({ dateISO: r.windows[0].dateISO, score: r.windows[0].score })
      })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [user?.uid, intention])

  // Não-assinante (gated) ou sem janela: não polui o modal.
  if (gated) return null
  if (!loading && !best) return null

  const fmt = (iso: string) => {
    try { return new Date(iso + 'T12:00:00').toLocaleDateString(language, { weekday: 'short', day: '2-digit', month: 'short' }) } catch { return iso }
  }
  const band = (s: number) => (
    s >= 70 ? tl('forte', 'strong', 'fuerte', 'forte')
      : s >= 55 ? tl('bom', 'good', 'bueno', 'buono')
        : s >= 40 ? tl('neutro', 'neutral', 'neutro', 'neutro')
          : tl('fraco', 'weak', 'debil', 'debole')
  )

  return (
    <TouchableOpacity activeOpacity={0.85} style={s.card} onPress={() => navigation.navigate('Forecast', { momentoIntention: intention })}>
      <View style={s.icon}><Text style={{ fontSize: 16 }}>⭐</Text></View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={s.title}>{tl('Melhor momento para agir', 'Best moment to act', 'Mejor momento para actuar', 'Miglior momento per agire')}</Text>
        {loading ? (
          <Text style={s.sub}>{tl('calculando…', 'calculating…', 'calculando…', 'calcolo…')}</Text>
        ) : best ? (
          <Text style={s.sub}><Text style={s.subStrong}>{fmt(best.dateISO)}</Text> · {band(best.score)} ({best.score})</Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color="#B8860B" />
    </TouchableOpacity>
  )
}

// Vive dentro do modal de status (fundo CLARO) → texto escuro p/ contraste.
const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF7D9', borderRadius: 12, borderWidth: 1, borderColor: '#E4C64D', paddingVertical: 11, paddingHorizontal: 12, marginTop: 10 },
  icon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FBE9A8', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#8A6D00', fontSize: 13.5, fontWeight: '800' },
  sub: { color: '#5A5A66', fontSize: 12.5, marginTop: 1 },
  subStrong: { color: '#1C1C2E', fontWeight: '800', textTransform: 'capitalize' },
})
