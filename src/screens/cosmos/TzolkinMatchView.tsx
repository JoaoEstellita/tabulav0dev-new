/**
 * Tzolkin Match entre 2 pessoas. Recebe 2 datas de nascimento, calcula com o
 * motor puro (getTzolkinMatch) e exibe scores + relações + cruzamento + Kin da
 * relação. Separado do score astrológico. Modelo do app, linguagem simbólica.
 */
import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SvgCss } from 'react-native-svg/css'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { getTzolkinMatch, getTzolkinMatchByKins, getKinDisplayName, sealOf, SEALS, COLOR_LABELS } from '../../astro/tzolkin'
import { SEAL_SVG } from '../../assets/tzolkin/sealGlyphs'
import { tagLabel, dimLabel, relationLabel, connLabel, matchDisclaimer } from '../../data/tzolkin/matchText'

function KinBadge({ kin, name, lang }: { kin: number; name?: string; lang: string }) {
  const seal = sealOf(kin)
  const hex = COLOR_LABELS[SEALS[seal - 1].color].hex
  const xml = SEAL_SVG[seal]
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      {xml ? (
        <View style={{ width: 46, height: 46 }}><SvgCss xml={xml} width="100%" height="100%" /></View>
      ) : (
        <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: hex, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#0F0F23', fontWeight: '900', fontSize: 12 }}>{seal}</Text>
        </View>
      )}
      {name ? <Text style={s.person} numberOfLines={1}>{name}</Text> : null}
      <Text style={s.kinNum}>KIN {kin}</Text>
      <Text style={[s.kinName, { color: hex }]}>{getKinDisplayName(kin, lang)}</Text>
    </View>
  )
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
        <Text style={s.barLabel}>{label}</Text><Text style={s.barVal}>{value}</Text>
      </View>
      <View style={s.barBg}><View style={[s.barFill, { width: `${value}%` }]} /></View>
    </View>
  )
}

export default function TzolkinMatchView({ aDateISO, bDateISO, kins, aName, bName, embedded }: { aDateISO?: string; bDateISO?: string; kins?: { a: number; b: number } | null; aName?: string; bName?: string; embedded?: boolean }) {
  const { language } = useAppLanguage()
  const lang = language || 'pt-BR'
  const tl = (pt: string, en: string, es: string, it: string) => lang === 'en-US' ? en : lang === 'es-ES' ? es : lang === 'it-IT' ? it : pt
  // Match: só temos os Kins (privacidade) → getTzolkinMatchByKins. Grupos/Mapa: datas → getTzolkinMatch.
  const m = useMemo(() => (kins ? getTzolkinMatchByKins(kins.a, kins.b) : getTzolkinMatch(aDateISO as string, bDateISO as string)), [aDateISO, bDateISO, kins?.a, kins?.b])

  const directLines: string[] = [
    ...m.directRelations.aToB.map(k => `${aName || 'A'} → ${bName || 'B'}: ${relationLabel(k, lang)}`),
    ...m.directRelations.bToA.map(k => `${bName || 'B'} → ${aName || 'A'}: ${relationLabel(k, lang)}`),
  ]

  // Embedded (dentro de outra ScrollView, ex.: SynastryModal): flui sem scroll próprio.
  const Wrap: any = embedded ? View : ScrollView
  const wrapProps: any = embedded ? {} : { style: { flex: 1 }, contentContainerStyle: { paddingBottom: 32 }, showsVerticalScrollIndicator: false }

  return (
    <Wrap {...wrapProps}>
      <View style={s.pair}>
        <KinBadge kin={m.a.kin} name={aName} lang={lang} />
        <Text style={s.plus}>+</Text>
        <KinBadge kin={m.b.kin} name={bName} lang={lang} />
      </View>

      <View style={s.overall}>
        <Text style={s.overallVal}>{m.scores.overall}</Text>
        <Text style={s.overallLabel}>{tl('Tzolkin Match (modelo do app)', 'Tzolkin Match (app model)', 'Tzolkin Match (modelo de la app)', 'Tzolkin Match (modello dell app)')}</Text>
        <View style={s.tagRow}>
          {m.tags.map(t => <View key={t} style={s.tag}><Text style={s.tagTxt}>{tagLabel(t, lang)}</Text></View>)}
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{tl('Dimensões', 'Dimensions', 'Dimensiones', 'Dimensioni')}</Text>
        {(['support', 'growth', 'communication', 'rhythm', 'intensity'] as const).map(d => (
          <Bar key={d} label={dimLabel(d, lang)} value={(m.scores as any)[d]} />
        ))}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{tl('Relações diretas', 'Direct relations', 'Relaciones directas', 'Relazioni dirette')}</Text>
        {directLines.length ? directLines.map((l, i) => <Text key={i} style={s.body}>• {l}</Text>)
          : <Text style={s.body}>{tl('Sem relação direta de oráculo — a conexão aparece no cruzamento abaixo.', 'No direct oracle relation — the connection shows in the crossing below.', 'Sin relacion directa de oraculo, la conexion aparece en el cruce abajo.', 'Nessuna relazione diretta di oracolo: la connessione appare nell incrocio sotto.')}</Text>}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{tl('Cruzamento dos oráculos', 'Oracle crossing', 'Cruce de oraculos', 'Incrocio degli oracoli')}</Text>
        {m.crossConnections.length ? m.crossConnections.map((c, i) => <Text key={i} style={s.body}>• {connLabel(c.type, lang)}</Text>)
          : <Text style={s.body}>—</Text>}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{tl('Kin da relação (método complementar)', 'Relationship Kin (complementary method)', 'Kin de la relacion (metodo complementario)', 'Kin della relazione (metodo complementare)')}</Text>
        <Text style={s.body}>KIN {m.relationshipKin} — {getKinDisplayName(m.relationshipKin, lang)}</Text>
      </View>

      <Text style={s.disclaimer}>{matchDisclaimer(lang)}</Text>
    </Wrap>
  )
}

const s = StyleSheet.create({
  pair: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 6 },
  plus: { color: '#f5c542', fontSize: 24, fontWeight: '900' },
  person: { color: '#efedfb', fontSize: 13, fontWeight: '800', marginTop: 6, maxWidth: 120 },
  kinNum: { color: '#a7a2c9', fontSize: 11, fontWeight: '700', marginTop: 2 },
  kinName: { fontSize: 13, fontWeight: '800', textAlign: 'center', marginTop: 1 },
  overall: { alignItems: 'center', paddingVertical: 8 },
  overallVal: { color: '#f5c542', fontSize: 44, fontWeight: '900' },
  overallLabel: { color: '#a7a2c9', fontSize: 11.5, fontWeight: '600', marginTop: -2 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 10, paddingHorizontal: 16 },
  tag: { backgroundColor: 'rgba(245,197,66,.14)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  tagTxt: { color: '#f5c542', fontSize: 11.5, fontWeight: '700' },
  card: { backgroundColor: 'rgba(255,255,255,.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', borderRadius: 14, padding: 14, marginHorizontal: 12, marginTop: 10 },
  cardTitle: { color: '#efedfb', fontSize: 14, fontWeight: '800', marginBottom: 6 },
  body: { color: '#c9c5e2', fontSize: 13.5, lineHeight: 20 },
  barLabel: { color: '#cfcbe6', fontSize: 12, fontWeight: '600' },
  barVal: { color: '#a7a2c9', fontSize: 12, fontWeight: '700' },
  barBg: { height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,.08)', overflow: 'hidden' },
  barFill: { height: 7, borderRadius: 4, backgroundColor: '#8b7cf6' },
  disclaimer: { color: '#8a86a8', fontSize: 11, lineHeight: 16, marginHorizontal: 16, marginTop: 16 },
})
