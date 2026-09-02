/**
 * Sinastria chinesa (BaZi) entre 2 pessoas. Recebe os nascimentos (data+hora+long.),
 * calcula com o motor puro (getChineseMatch) e exibe score + relação de Day Master +
 * tags + Kin da relação (animais). Modelo do app, linguagem simbólica. Embedded flui
 * dentro de outra ScrollView.
 */
import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { getChineseMatch, BRANCHES, type ChineseInput } from '../../astro/chinese'
import { ELEMENT_HEX } from '../../data/chinese/chineseText'

type Birth = { birthDate?: string; birthTime?: string; longitude?: number }

function inputFromBirth(b?: Birth): ChineseInput | null {
  if (!b?.birthDate || !/^\d{4}-\d{2}-\d{2}/.test(b.birthDate)) return null
  const [y, m, dd] = b.birthDate.slice(0, 10).split('-').map(Number)
  const lon = typeof b.longitude === 'number' ? b.longitude : 0
  let hour: number | undefined; let minute: number | undefined
  if (b.birthTime && /^\d{1,2}:\d{2}/.test(b.birthTime)) { const [h, mi] = b.birthTime.split(':').map(Number); hour = h; minute = mi }
  const utcMs = Date.UTC(y, m - 1, dd, hour ?? 12, minute ?? 0) - (lon / 15) * 3600000
  return { year: y, month: m, day: dd, hour, minute, longitude: lon, utc: new Date(utcMs) }
}

function Bar({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
        <Text style={s.barLabel}>{label}</Text><Text style={s.barVal}>{value}</Text>
      </View>
      <View style={s.barBg}><View style={[s.barFill, { width: `${value}%`, backgroundColor: color || '#e4572e' }]} /></View>
    </View>
  )
}

export default function ChineseMatchView({ aBirth, bBirth, aName, bName, embedded }: { aBirth?: Birth; bBirth?: Birth; aName?: string; bName?: string; embedded?: boolean }) {
  const { language } = useAppLanguage()
  const lang = language || 'pt-BR'
  const tl = (pt: string, en: string, es: string, it: string) => (lang === 'en-US' ? en : lang === 'es-ES' ? es : lang === 'it-IT' ? it : pt)

  const m = useMemo(() => {
    const ia = inputFromBirth(aBirth); const ib = inputFromBirth(bBirth)
    return ia && ib ? getChineseMatch(ia, ib) : null
  }, [aBirth?.birthDate, aBirth?.birthTime, aBirth?.longitude, bBirth?.birthDate, bBirth?.birthTime, bBirth?.longitude])

  if (!m) return null

  const relLabel = (r: string) => ({
    'a-feeds-b': tl(`${aName || 'A'} nutre ${bName || 'B'}`, `${aName || 'A'} feeds ${bName || 'B'}`, `${aName || 'A'} nutre ${bName || 'B'}`, `${aName || 'A'} nutre ${bName || 'B'}`),
    'b-feeds-a': tl(`${bName || 'B'} nutre ${aName || 'A'}`, `${bName || 'B'} feeds ${aName || 'A'}`, `${bName || 'B'} nutre ${aName || 'A'}`, `${bName || 'B'} nutre ${aName || 'A'}`),
    'a-controls-b': tl('Dinâmica de controle/transformação', 'Control/transformation dynamic', 'Dinamica de control/transformacion', 'Dinamica di controllo/trasformazione'),
    'b-controls-a': tl('Dinâmica de controle/transformação', 'Control/transformation dynamic', 'Dinamica de control/transformacion', 'Dinamica di controllo/trasformazione'),
    same: tl('Mesmo elemento de Day Master — forte identificação', 'Same Day Master element — strong bond', 'Mismo elemento de Day Master', 'Stesso elemento di Day Master'),
    neutral: tl('Relação neutra entre os Day Masters', 'Neutral Day Master relation', 'Relacion neutra', 'Relazione neutra'),
  }[r] || '')

  const tagLabel = (t: string) => ({
    'high-sync': tl('Alta sintonia', 'High sync', 'Alta sintonia', 'Alta sintonia'),
    transformative: tl('Transformadora', 'Transformative', 'Transformadora', 'Trasformativa'),
    intense: tl('Intensa', 'Intense', 'Intensa', 'Intensa'),
    stable: tl('Estável', 'Stable', 'Estable', 'Stabile'),
    nurturing: tl('Nutridora', 'Nurturing', 'Nutridora', 'Nutriente'),
    complementary: tl('Complementar', 'Complementary', 'Complementaria', 'Complementare'),
    challenging: tl('Desafiadora', 'Challenging', 'Desafiante', 'Sfidante'),
    'few-relations': tl('Poucas conexões diretas', 'Few direct links', 'Pocas conexiones', 'Poche connessioni'),
  }[t] || t)

  const animalA = BRANCHES[m.a.zodiac.animalBranch]
  const animalB = BRANCHES[m.b.zodiac.animalBranch]
  const Wrap: any = embedded ? View : ScrollView
  const wrapProps: any = embedded ? {} : { style: { flex: 1 }, contentContainerStyle: { paddingBottom: 32 }, showsVerticalScrollIndicator: false }

  return (
    <Wrap {...wrapProps}>
      <View style={s.head}>
        <View style={s.person}>
          <View style={[s.animalTok, { backgroundColor: ELEMENT_HEX[animalA.element] + '26', borderColor: ELEMENT_HEX[animalA.element] }]}><Text style={[s.hanzi, { color: ELEMENT_HEX[animalA.element] }]}>{animalA.hanzi}</Text></View>
          {aName ? <Text style={s.pName} numberOfLines={1}>{aName}</Text> : null}
        </View>
        <Text style={s.overall}>{m.scores.overall}%</Text>
        <View style={s.person}>
          <View style={[s.animalTok, { backgroundColor: ELEMENT_HEX[animalB.element] + '26', borderColor: ELEMENT_HEX[animalB.element] }]}><Text style={[s.hanzi, { color: ELEMENT_HEX[animalB.element] }]}>{animalB.hanzi}</Text></View>
          {bName ? <Text style={s.pName} numberOfLines={1}>{bName}</Text> : null}
        </View>
      </View>

      <Text style={s.rel}>{relLabel(m.dayMasterRelation)}</Text>

      <Bar label={tl('Apoio', 'Support', 'Apoyo', 'Supporto')} value={m.scores.support} color="#3ecf8e" />
      <Bar label={tl('Ritmo', 'Rhythm', 'Ritmo', 'Ritmo')} value={m.scores.rhythm} color="#3d6fd1" />
      <Bar label={tl('Intensidade', 'Intensity', 'Intensidad', 'Intensita')} value={m.scores.intensity} color="#e4572e" />
      <Bar label={tl('Estabilidade', 'Stability', 'Estabilidad', 'Stabilita')} value={m.scores.stability} color="#d0a95c" />

      {m.tags.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {m.tags.map((t) => <View key={t} style={s.tag}><Text style={s.tagTx}>{tagLabel(t)}</Text></View>)}
        </View>
      ) : null}

      <Text style={s.disc}>{tl('Modelo simbólico do app baseado no BaZi (Day Master + pilares).', 'App symbolic model based on BaZi (Day Master + pillars).', 'Modelo simbolico del app basado en BaZi.', 'Modello simbolico del app basato sul BaZi.')}</Text>
    </Wrap>
  )
}

const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  person: { alignItems: 'center', flex: 1 },
  animalTok: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  hanzi: { fontSize: 24, fontWeight: '800' },
  pName: { color: '#c9c5e2', fontSize: 12, fontWeight: '700', marginTop: 4, maxWidth: 90, textAlign: 'center' },
  overall: { color: '#e4572e', fontSize: 30, fontWeight: '900', paddingHorizontal: 8 },
  rel: { color: '#efedfb', fontSize: 13.5, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  barLabel: { color: '#b8b3d6', fontSize: 12, fontWeight: '600' },
  barVal: { color: '#efedfb', fontSize: 12, fontWeight: '800' },
  barBg: { height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,.08)', overflow: 'hidden' },
  barFill: { height: 7, borderRadius: 4 },
  tag: { backgroundColor: 'rgba(228,87,46,.16)', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3 },
  tagTx: { color: '#f0a58c', fontSize: 11, fontWeight: '700' },
  disc: { color: '#8892a4', fontSize: 10.5, marginTop: 12, fontStyle: 'italic', lineHeight: 15 },
})
