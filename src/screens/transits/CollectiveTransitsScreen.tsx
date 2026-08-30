import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { formatTransitCompact, aspectNature } from '../../utils/astro/pt'
import { useAppLanguage } from '../../hooks/useAppLanguage'

const NATURE = {
  harmonico: { color: '#9AE6B4', pt: 'Harmônico', en: 'Harmonic', es: 'Armonico', it: 'Armonico' },
  desafiador: { color: '#FCA5A5', pt: 'Desafiador', en: 'Challenging', es: 'Desafiante', it: 'Impegnativo' },
  conjuncao: { color: '#FDE68A', pt: 'Conjunção', en: 'Conjunction', es: 'Conjuncion', it: 'Congiunzione' },
  outro: { color: '#C7C9E0', pt: 'Neutro', en: 'Neutral', es: 'Neutro', it: 'Neutro' },
} as const

export default function CollectiveTransitsScreen() {
  const { t, language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it } as any)[language] || pt
  const { transitData } = useLifeAreas()
  const rawAll = (transitData?.dailyOverview?.collectiveKeyAspectsRich || []).filter((a: any) => a.planet1 !== a.planet2)

  const seen = new Set<string>()
  const list = rawAll
    .filter((a: any) => { const k = `${a.planet1}|${a.type}|${a.planet2}`; if (seen.has(k)) return false; seen.add(k); return true })
    .sort((a: any, b: any) => {
      const ax = new Date(a?.window?.exact || a?.window?.start || Date.now()).getTime()
      const bx = new Date(b?.window?.exact || b?.window?.start || Date.now()).getTime()
      return ax - bx
    })

  const fmtDate = (a: any) => {
    const iso = a?.window?.exact || a?.window?.start
    if (!iso) return ''
    try { return new Date(iso).toLocaleDateString(language, { weekday: 'short', day: '2-digit', month: 'short' }) } catch { return '' }
  }

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.title}>{t('transits.collective.title') || tl('Trânsitos coletivos', 'Collective transits', 'Tránsitos colectivos', 'Transiti collettivi')}</Text>
      <Text style={s.sub}>{tl('Os aspectos do céu de agora — os mesmos para todo mundo. Não dependem do seu mapa.', 'The sky\'s aspects right now — the same for everyone. They don\'t depend on your chart.', 'Los aspectos del cielo de ahora — los mismos para todos. No dependen de tu carta.', 'Gli aspetti del cielo di adesso — gli stessi per tutti. Non dipendono dalla tua carta.')}</Text>

      {list.length === 0 ? (
        <Text style={s.empty}>{tl('Nenhum aspecto coletivo forte no momento.', 'No strong collective aspect right now.', 'Ningun aspecto colectivo fuerte ahora.', 'Nessun aspetto collettivo forte al momento.')}</Text>
      ) : list.map((a: any, i: number) => {
        const nat = (NATURE as any)[aspectNature(a.type)] || NATURE.outro
        const natLabel = tl(nat.pt, nat.en, nat.es, nat.it)
        const date = fmtDate(a)
        return (
          <View key={i} style={s.card}>
            <View style={[s.bar, { backgroundColor: nat.color }]} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.cardTitle}>{formatTransitCompact(a.planet1, a.type, a.planet2)}</Text>
              <View style={s.metaRow}>
                <Text style={[s.natTag, { color: nat.color, borderColor: nat.color }]}>{natLabel}</Text>
                {date ? <Text style={s.date}>{date}</Text> : null}
              </View>
            </View>
          </View>
        )
      })}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0F0F23', minHeight: '100%' },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  sub: { color: '#9aa2b8', fontSize: 13, lineHeight: 18, marginBottom: 16 },
  empty: { color: '#9aa2b8', fontSize: 14, marginTop: 20, textAlign: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1C1C33', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 14, marginBottom: 10 },
  bar: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
  cardTitle: { color: '#EDEBF7', fontSize: 15, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  natTag: { fontSize: 11, fontWeight: '800', borderWidth: 1, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  date: { color: '#9aa2b8', fontSize: 12, textTransform: 'capitalize' },
})
