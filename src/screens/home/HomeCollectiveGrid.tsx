import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { formatTransitCompact, aspectNature } from '../../utils/astro/pt'

// Grade de "Trânsitos coletivos" no fim da Home: o céu de agora (aspectos entre
// planetas, iguais pra todo mundo). Botão-livro → lista completa (CollectiveTransits).
const NATURE_COLOR: Record<string, string> = { harmonico: '#9AE6B4', desafiador: '#FCA5A5', conjuncao: '#FDE68A', outro: '#C7C9E0' }

export default function HomeCollectiveGrid() {
  const navigation = useNavigation<any>()
  const { transitData } = useLifeAreas()
  const { language, t } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it } as any)[language] || pt

  const rawAll = (transitData?.dailyOverview?.collectiveKeyAspectsRich || []).filter((a: any) => a.planet1 !== a.planet2)
  const seen = new Set<string>()
  const list = rawAll
    .filter((a: any) => { const k = `${a.planet1}|${a.type}|${a.planet2}`; if (seen.has(k)) return false; seen.add(k); return true })
    .sort((a: any, b: any) => {
      const ax = new Date(a?.window?.exact || a?.window?.start || Date.now()).getTime()
      const bx = new Date(b?.window?.exact || b?.window?.start || Date.now()).getTime()
      return ax - bx
    })
    .slice(0, 6)

  if (!list.length) return null

  const fmtDate = (a: any) => {
    const iso = a?.window?.exact || a?.window?.start
    if (!iso) return ''
    try { return new Date(iso).toLocaleDateString(language, { day: '2-digit', month: 'short' }) } catch { return '' }
  }

  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <Text style={s.title}>✨ {t('transits.collective.title') || tl('Trânsitos coletivos', 'Collective transits', 'Tránsitos colectivos', 'Transiti collettivi')}</Text>
        <TouchableOpacity style={s.bookBtn} onPress={() => navigation.navigate('CollectiveTransits')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="book-outline" size={16} color="#0F0F23" />
        </TouchableOpacity>
      </View>
      <Text style={s.sub}>{tl('O céu de agora — o mesmo pra todo mundo.', 'The sky right now — the same for everyone.', 'El cielo de ahora — el mismo para todos.', 'Il cielo di adesso — lo stesso per tutti.')}</Text>
      <View style={s.grid}>
        {list.map((a: any, i: number) => {
          const nat = aspectNature(a.type)
          const color = NATURE_COLOR[nat] || NATURE_COLOR.outro
          return (
            <TouchableOpacity key={i} style={s.cell} activeOpacity={0.85} onPress={() => navigation.navigate('CollectiveTransits')}>
              <View style={[s.dot, { backgroundColor: color }]} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={s.cellTitle} numberOfLines={2}>{formatTransitCompact(a.planet1, a.type, a.planet2)}</Text>
                {fmtDate(a) ? <Text style={s.cellDate}>{fmtDate(a)}</Text> : null}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  wrap: { marginHorizontal: 16, marginTop: 8, marginBottom: 20, backgroundColor: '#171733', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: '#EDEBF7', fontSize: 15, fontWeight: '800' },
  bookBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFD700', alignItems: 'center', justifyContent: 'center' },
  sub: { color: '#9aa2b8', fontSize: 12, marginTop: 3, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1F1F3D', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', paddingVertical: 10, paddingHorizontal: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  cellTitle: { color: '#EDEBF7', fontSize: 12.5, fontWeight: '700', lineHeight: 16 },
  cellDate: { color: '#9aa2b8', fontSize: 11, marginTop: 2, textTransform: 'capitalize' },
})
