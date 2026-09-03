/**
 * Sinastria COMPLETA no Match (baralho + tela de conexão), abaixo da roda. Espelha as
 * abas dos Grupos — Astral · Tzolkin · Chinês · Védico — mas privacy-safe: nada dos
 * dados de nascimento do outro é usado. Cada lente monta do que já temos no deck:
 *   Astral → grade de aspectos (leitura relacional inline, synastryAspectDetail)
 *   Tzolkin → Kins (getTzolkinMatchByKins, via TzolkinMatchView kins=)
 *   Chinês → animal do ano (afinidade animal; BaZi completo exige hora/local → n/a)
 *   Védico → Guna Milan já computado no backend (VedicMatchView precomputed=)
 */
import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import TzolkinMatchView from '../cosmos/TzolkinMatchView'
import VedicMatchView, { type GunaPrecomputed } from '../cosmos/VedicMatchView'
import ChineseMatchView, { type ChinesePrecomputed } from '../cosmos/ChineseMatchView'
import { synastryAspectDetail, synastryToneOf } from '../../astro/synastryReading'
import { animalRelation } from '../../astro/chinese/chineseTransit'
import { animalCompatReading } from '../../data/chinese/chineseTransitReadings'
import { BRANCHES } from '../../astro/chinese'
import { ELEMENT_HEX, ANIMAL_ESIT } from '../../data/chinese/chineseText'
import { lensColor } from '../../theme/lenses'
import type { GridAspect } from '../../services/DiscoveryService'

const TZOLKIN_ENABLED = process.env.EXPO_PUBLIC_TZOLKIN_ENABLED !== '0'
const CHINESE_ENABLED = process.env.EXPO_PUBLIC_CHINESE_ENABLED !== '0'
const VEDIC_ENABLED = process.env.EXPO_PUBLIC_VEDIC_ENABLED !== '0'

const TONE_HEX: Record<string, string> = { harmonioso: '#3ecf8e', tenso: '#f0a58c', neutro: '#f5c542' }

export default function MatchSynastryLenses({ targetName, myKin, targetKin, myBranch, targetAnimal, vedicSynastry, chineseSynastry, grid }: {
  targetName: string
  myKin?: number | null
  targetKin?: number | null
  myBranch?: number | null
  targetAnimal?: number | null
  vedicSynastry?: GunaPrecomputed | null
  chineseSynastry?: ChinesePrecomputed | null
  grid?: GridAspect[]
}) {
  const { language } = useAppLanguage()
  const lang = language || 'pt-BR'
  const tl = (pt: string, en: string, es: string, it: string) => (lang === 'en-US' ? en : lang === 'es-ES' ? es : lang === 'it-IT' ? it : pt)

  // Aspectos com key resolvida (aspect | derivado do labelPt) → leitura relacional.
  const astralAspects = useMemo(() => (grid || [])
    .map((g) => ({ ...g, aspect: g.aspect || labelToKey(g.labelPt) }))
    .filter((g) => !!g.aspect)
    .sort((a, b) => (a.orb ?? 9) - (b.orb ?? 9)), [grid])

  const hasAstral = astralAspects.length > 0
  const hasTz = TZOLKIN_ENABLED && myKin != null && targetKin != null
  const hasCh = CHINESE_ENABLED && (!!chineseSynastry || (myBranch != null && targetAnimal != null))
  const hasVe = VEDIC_ENABLED && !!vedicSynastry

  const tabs = useMemo(() => {
    const t: { key: string; label: string; color: string }[] = []
    if (hasAstral) t.push({ key: 'astral', label: tl('Astral', 'Astro', 'Astral', 'Astrale'), color: lensColor('astro') })
    if (hasTz) t.push({ key: 'tzolkin', label: 'Tzolkin', color: lensColor('tzolkin') })
    if (hasCh) t.push({ key: 'chinese', label: tl('Chinês', 'Chinese', 'Chino', 'Cinese'), color: lensColor('chinese') })
    if (hasVe) t.push({ key: 'vedic', label: tl('Védico', 'Vedic', 'Vedico', 'Vedico'), color: lensColor('vedic') })
    return t
  }, [hasAstral, hasTz, hasCh, hasVe, lang])

  const [active, setActive] = useState<string>('')
  const cur = tabs.find((t) => t.key === active) || tabs[0]
  if (!tabs.length) return null

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={s.head}>{tl('Sinastria completa', 'Full synastry', 'Sinastria completa', 'Sinastria completa')}</Text>
      <View style={s.bar}>
        {tabs.map((t) => {
          const on = t.key === (cur?.key)
          return (
            <TouchableOpacity key={t.key} activeOpacity={0.8} onPress={() => setActive(t.key)} style={[s.tab, on && { backgroundColor: t.color + '22', borderColor: t.color }]}>
              <Text style={[s.tabTx, on && { color: t.color }]} numberOfLines={1}>{t.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={{ paddingTop: 12 }}>
        {cur?.key === 'astral' ? (
          <View>
            {astralAspects.map((a, i) => {
              const det = synastryAspectDetail({ mine: a.mine, theirs: a.theirs, aspect: a.aspect as string, orb: a.orb }, lang)
              const tone = synastryToneOf(a.aspect as string)
              const col = TONE_HEX[tone] || '#f5c542'
              return (
                <View key={i} style={[s.aspRow, { borderLeftColor: col }]}>
                  <Text style={s.aspHead}>{det.headline || `${cap(a.mine)} ${a.labelPt || ''} ${cap(a.theirs)}`}</Text>
                  {det.body ? <Text style={s.aspBody}>{det.body}</Text> : null}
                </View>
              )
            })}
            <Text style={s.disc}>{tl('Aspectos entre os dois mapas (planetas pessoais). O contato mostra a dinâmica — o que fazem com ela é de vocês.', 'Aspects between the two charts (personal planets). The contact shows the dynamic — what you do with it is up to you.', 'Aspectos entre las dos cartas (planetas personales). El contacto muestra la dinamica.', 'Aspetti tra le due carte (pianeti personali). Il contatto mostra la dinamica.')}</Text>
          </View>
        ) : null}

        {cur?.key === 'tzolkin' && hasTz ? (
          <TzolkinMatchView embedded kins={{ a: myKin as number, b: targetKin as number }} bName={targetName} aName={tl('Você', 'You', 'Tu', 'Tu')} />
        ) : null}

        {cur?.key === 'chinese' && hasCh ? (
          chineseSynastry
            ? <ChineseMatchView embedded precomputed={chineseSynastry} bName={targetName} aName={tl('Você', 'You', 'Tu', 'Tu')} />
            : <ChineseAffinity myBranch={myBranch as number} targetAnimal={targetAnimal as number} targetName={targetName} lang={lang} tl={tl} />
        ) : null}

        {cur?.key === 'vedic' && hasVe ? (
          <VedicMatchView embedded precomputed={vedicSynastry} bName={targetName} aName={tl('Você', 'You', 'Tu', 'Tu')} />
        ) : null}
      </View>
    </View>
  )
}

// Afinidade chinesa por animal do ano (privacy-safe). BaZi completo (Day Master +
// pilares) exige hora/local do outro → não disponível no Match.
function ChineseAffinity({ myBranch, targetAnimal, targetName, lang, tl }: { myBranch: number; targetAnimal: number; targetName: string; lang: string; tl: (pt: string, en: string, es: string, it: string) => string }) {
  const rel = animalRelation(myBranch, targetAnimal)
  const col = rel === 'secret-friend' || rel === 'ally' ? '#3ecf8e' : rel === 'clash' || rel === 'harm' ? '#e4572e' : '#9c96c6'
  const relLabel = ({
    same: tl('Mesmo animal', 'Same animal', 'Mismo animal', 'Stesso animale'),
    'secret-friend': tl('Amigo secreto (Liu He)', 'Secret friend (Liu He)', 'Amigo secreto (Liu He)', 'Amico segreto (Liu He)'),
    ally: tl('Aliado (San He)', 'Ally (San He)', 'Aliado (San He)', 'Alleato (San He)'),
    clash: tl('Choque (Chong)', 'Clash (Chong)', 'Choque (Chong)', 'Scontro (Chong)'),
    harm: tl('Dano (Hai)', 'Harm (Hai)', 'Dano (Hai)', 'Danno (Hai)'),
    neutral: tl('Neutro', 'Neutral', 'Neutro', 'Neutro'),
  } as Record<string, string>)[rel] || ''
  const aMe = BRANCHES[myBranch]; const aOt = BRANCHES[targetAnimal]
  const nm = (idx: number, br: typeof aMe) => (lang === 'es-ES' ? ANIMAL_ESIT[idx].es : lang === 'it-IT' ? ANIMAL_ESIT[idx].it : lang === 'en-US' ? br.animalEn : br.animalPt)
  return (
    <View>
      <View style={s.chHead}>
        <View style={s.chPerson}>
          <View style={[s.chTok, { backgroundColor: ELEMENT_HEX[aMe.element] + '26', borderColor: ELEMENT_HEX[aMe.element] }]}><Text style={[s.chHanzi, { color: ELEMENT_HEX[aMe.element] }]}>{aMe.hanzi}</Text></View>
          <Text style={[s.chNm, { color: ELEMENT_HEX[aMe.element] }]} numberOfLines={1}>{nm(myBranch, aMe)}</Text>
          <Text style={s.chYou}>{tl('Você', 'You', 'Tu', 'Tu')}</Text>
        </View>
        <Text style={s.chX}>×</Text>
        <View style={s.chPerson}>
          <View style={[s.chTok, { backgroundColor: ELEMENT_HEX[aOt.element] + '26', borderColor: ELEMENT_HEX[aOt.element] }]}><Text style={[s.chHanzi, { color: ELEMENT_HEX[aOt.element] }]}>{aOt.hanzi}</Text></View>
          <Text style={[s.chNm, { color: ELEMENT_HEX[aOt.element] }]} numberOfLines={1}>{nm(targetAnimal, aOt)}</Text>
          <Text style={s.chYou} numberOfLines={1}>{targetName}</Text>
        </View>
      </View>
      <Text style={[s.chRel, { color: col }]}>{relLabel}</Text>
      <Text style={s.aspBody}>{animalCompatReading(rel, lang)}</Text>
      <Text style={s.disc}>{tl('Afinidade pelo animal do ano. A leitura BaZi completa (Day Master) pede a hora e o local de nascimento do outro.', 'Affinity by year animal. Full BaZi reading (Day Master) needs the other person\'s birth time and place.', 'Afinidad por el animal del ano. La lectura BaZi completa pide hora y lugar del otro.', 'Affinita per l\'animale dell\'anno. La lettura BaZi completa richiede ora e luogo dell\'altro.')}</Text>
    </View>
  )
}

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)
// labelPt → key do aspecto (fallback quando o backend não mandou `aspect`).
function labelToKey(labelPt?: string): string | undefined {
  if (!labelPt) return undefined
  const l = labelPt.toLowerCase()
  if (l.includes('conjun')) return 'conjuncao'
  if (l.includes('sext')) return 'sextil'
  if (l.includes('quadr')) return 'quadratura'
  if (l.includes('tríg') || l.includes('trig')) return 'trigono'
  if (l.includes('opos')) return 'oposicao'
  return undefined
}

const s = StyleSheet.create({
  head: { color: '#efedfb', fontSize: 15, fontWeight: '900', marginBottom: 10 },
  bar: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,.10)', backgroundColor: 'rgba(255,255,255,.04)' },
  tabTx: { color: '#b8b3d6', fontSize: 13, fontWeight: '800' },
  aspRow: { borderLeftWidth: 3, paddingLeft: 10, marginTop: 10 },
  aspHead: { color: '#efedfb', fontSize: 14, fontWeight: '800', lineHeight: 19 },
  aspBody: { color: '#c9c5e2', fontSize: 13, lineHeight: 19, marginTop: 3 },
  disc: { color: '#8892a4', fontSize: 11, lineHeight: 16, marginTop: 12, fontStyle: 'italic' },
  chHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  chPerson: { alignItems: 'center', flex: 1 },
  chTok: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  chHanzi: { fontSize: 24, fontWeight: '800' },
  chNm: { fontSize: 12.5, fontWeight: '800', marginTop: 4 },
  chYou: { color: '#c9c5e2', fontSize: 11.5, fontWeight: '700', marginTop: 2, maxWidth: 100, textAlign: 'center' },
  chX: { color: '#8892a4', fontSize: 22, fontWeight: '700', paddingHorizontal: 10 },
  chRel: { fontSize: 14, fontWeight: '800', textAlign: 'center', marginTop: 4, marginBottom: 4 },
})
