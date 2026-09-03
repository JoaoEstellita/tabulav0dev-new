/**
 * MODO CHINÊS (BaZi / Quatro Pilares) da aba Mapa. Sub-abas: Visão Geral, BaZi,
 * Dinâmica. Motor puro em astro/chinese (sem IA). Hora solar local (mean+EoT) —
 * modo true-político é refino futuro. birth opcional (reuso no mapa do membro).
 */
import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { buildChineseChart, STEMS, BRANCHES } from '../../astro/chinese'
import type { ChineseProfile } from '../../astro/chinese/types'
import { elementLabel, ELEMENT_HEX, tenGodLabel, pillarTitle, pillarTheme, ANIMAL_ESIT, chineseDisclaimer } from '../../data/chinese/chineseText'
import { dayMasterReading } from '../../data/chinese/chineseReading'
import { animalReading } from '../../data/chinese/chineseAnimalReadings'
import { tenGodReading } from '../../data/chinese/chineseTenGodReadings'

type Sub = 'geral' | 'bazi' | 'dinamica'
type Birth = { birthDate?: string; birthTime?: string; longitude?: number }

function animalName(branch: number, lang: string): string {
  const b = BRANCHES[branch]
  if (lang === 'es-ES') return ANIMAL_ESIT[branch].es
  if (lang === 'it-IT') return ANIMAL_ESIT[branch].it
  return lang === 'en-US' ? b.animalEn : b.animalPt
}

export default function ChineseProfileContent({ birth: birthProp }: { birth?: Birth }) {
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const lang = language || 'pt-BR'
  const tl = (pt: string, en: string, es: string, it: string) => lang === 'en-US' ? en : lang === 'es-ES' ? es : lang === 'it-IT' ? it : pt
  const [birth, setBirth] = useState<Birth | undefined>(birthProp)
  const [tab, setTab] = useState<Sub>('geral')

  useEffect(() => {
    if (birthProp) { setBirth(birthProp); return }
    if (!user?.uid) return
    getDoc(doc(db, 'users', user.uid)).then((sn) => {
      const d = sn.data() || {}
      const loc = d.birthLocation || d.birthData?.birthLocation
      setBirth({ birthDate: d.birthDate, birthTime: d.birthTime, longitude: loc?.longitude })
    }).catch(() => { })
  }, [user?.uid, birthProp])

  const profile: ChineseProfile | null = useMemo(() => {
    if (!birth?.birthDate) return null
    const [y, m, dd] = birth.birthDate.slice(0, 10).split('-').map(Number)
    const lon = typeof birth.longitude === 'number' ? birth.longitude : 0
    let hour: number | undefined, minute: number | undefined
    if (birth.birthTime && /^\d{1,2}:\d{2}/.test(birth.birthTime)) {
      const [h, mi] = birth.birthTime.split(':').map(Number); hour = h; minute = mi
    }
    // UTC ≈ local menos o offset por longitude → hora solar local (mean+EoT).
    const utcMs = Date.UTC(y, m - 1, dd, hour ?? 12, minute ?? 0) - (lon / 15) * 3600000
    return buildChineseChart({ year: y, month: m, day: dd, hour, minute, longitude: lon, utc: new Date(utcMs) })
  }, [birth])

  if (!birth?.birthDate) return <View style={s.card}><Text style={s.cardText}>{tl('Cadastre sua data de nascimento para ver seu BaZi.', 'Add your birth date to see your BaZi.', 'Registra tu fecha de nacimiento para ver tu BaZi.', 'Inserisci la tua data di nascita per vedere il tuo BaZi.')}</Text></View>
  if (!profile) return <View style={s.loadingWrap}><ActivityIndicator color="#FFD700" /></View>

  return (
    <View style={{ flex: 1 }}>
      <View style={s.tabs}>
        {([['geral', tl('Visão Geral', 'Overview', 'Vista', 'Panoramica')], ['bazi', 'BaZi'], ['dinamica', tl('Dinâmica', 'Dynamics', 'Dinamica', 'Dinamica')]] as [Sub, string][]).map(([k, label]) => (
          <TouchableOpacity key={k} style={[s.tabBtn, tab === k && s.tabBtnActive]} activeOpacity={0.85} onPress={() => setTab(k)}>
            <Text style={[s.tabTxt, tab === k && s.tabTxtActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {tab === 'geral' && <Geral profile={profile} lang={lang} tl={tl} />}
        {tab === 'bazi' && <BaziView profile={profile} lang={lang} tl={tl} />}
        {tab === 'dinamica' && <Dinamica profile={profile} lang={lang} tl={tl} />}
        {!(birth?.birthTime && /^\d{1,2}:\d{2}/.test(birth.birthTime)) ? (
          <Text style={[s.disclaimer, { color: '#f0a58c' }]}>⚠️ {tl('Sem a hora de nascimento, o pilar da hora é aproximado (meio-dia).', 'Without the birth time, the hour pillar is approximate (noon).', 'Sin la hora de nacimiento, el pilar de la hora es aproximado (mediodia).', 'Senza l\'ora di nascita, il pilastro dell\'ora e approssimato (mezzogiorno).')}</Text>
        ) : null}
        <Text style={s.disclaimer}>{chineseDisclaimer(lang)}</Text>
      </ScrollView>
    </View>
  )
}

function PillarBox({ pk, p, lang, highlight }: any) {
  if (!p) return null
  const st = STEMS[p.stem], br = BRANCHES[p.branch]
  return (
    <View style={[s.pillar, highlight && { borderColor: '#f5c542', borderWidth: 1.5 }]}>
      <Text style={s.pillarLbl}>{pillarTitle(pk, lang)}</Text>
      <Text style={[s.hanzi, { color: ELEMENT_HEX[st.element as keyof typeof ELEMENT_HEX] }]}>{st.hanzi}</Text>
      <Text style={[s.hanzi, { color: ELEMENT_HEX[br.element as keyof typeof ELEMENT_HEX] }]}>{br.hanzi}</Text>
      <Text style={s.pillarSub}>{animalName(p.branch, lang)}</Text>
      <Text style={s.pillarSub2}>{elementLabel(st.element, lang)} {st.polarity === 'yang' ? 'Yang' : 'Yin'}</Text>
    </View>
  )
}

function Geral({ profile, lang, tl }: any) {
  const b = profile.bazi
  const dm = STEMS[b.dayMaster]
  const zAnimal = animalName(profile.zodiac.animalBranch, lang)
  const feMax = Math.max(...Object.values(b.fiveElements as Record<string, number>))
  return (
    <>
      <View style={[s.header, { borderColor: ELEMENT_HEX[profile.zodiac.element as keyof typeof ELEMENT_HEX] }]}>
        <Text style={s.kicker}>{tl('Seu signo chinês', 'Your Chinese sign', 'Tu signo chino', 'Il tuo segno cinese')}</Text>
        <Text style={[s.animal, { color: ELEMENT_HEX[profile.zodiac.element as keyof typeof ELEMENT_HEX] }]}>{zAnimal}</Text>
        <Text style={s.sub}>{elementLabel(profile.zodiac.element, lang)} {profile.zodiac.polarity === 'yang' ? 'Yang' : 'Yin'}</Text>
        <View style={s.dmRow}>
          <Text style={[s.dmHanzi, { color: ELEMENT_HEX[dm.element as keyof typeof ELEMENT_HEX] }]}>{dm.hanzi}</Text>
          <View>
            <Text style={s.dmLbl}>Day Master</Text>
            <Text style={s.dmName}>{elementLabel(dm.element, lang)} {dm.polarity === 'yang' ? 'Yang' : 'Yin'} · {dm.pinyin}</Text>
          </View>
        </View>
      </View>
      <View style={s.pillarsRow}>
        <PillarBox pk="year" p={b.year} lang={lang} />
        <PillarBox pk="month" p={b.month} lang={lang} />
        <PillarBox pk="day" p={b.day} lang={lang} highlight />
        <PillarBox pk="hour" p={b.hour} lang={lang} />
      </View>
      {!b.hour ? <Text style={s.note}>{tl('Sem horário de nascimento — mapa de 3 pilares (sem Pilar da Hora).', 'No birth time — 3-pillar chart (no Hour Pillar).', 'Sin hora de nacimiento — carta de 3 pilares (sin Pilar de la Hora).', 'Senza ora di nascita — carta a 3 pilastri (senza Pilastro dell Ora).')}</Text> : null}
      <Card title={tl(`Seu signo · ${zAnimal}`, `Your sign · ${zAnimal}`, `Tu signo · ${zAnimal}`, `Il tuo segno · ${zAnimal}`)}>
        <Text style={s.body}>{animalReading(profile.zodiac.animalBranch, lang)}</Text>
      </Card>
      <Card title={tl('Seu Day Master', 'Your Day Master', 'Tu Day Master', 'Il tuo Day Master')}>
        <Text style={s.body}>{dayMasterReading(b.dayMaster, lang)}</Text>
      </Card>
      <Card title={tl('Cinco Elementos (presença)', 'Five Elements (presence)', 'Cinco Elementos (presencia)', 'Cinque Elementi (presenza)')}>
        {(['wood', 'fire', 'earth', 'metal', 'water'] as const).map((e) => (
          <View key={e} style={{ marginTop: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
              <Text style={s.barLbl}>{elementLabel(e, lang)}</Text><Text style={s.barVal}>{b.fiveElements[e]}</Text>
            </View>
            <View style={s.barBg}><View style={{ height: 7, borderRadius: 4, backgroundColor: ELEMENT_HEX[e as keyof typeof ELEMENT_HEX], width: `${feMax ? (b.fiveElements[e] / feMax) * 100 : 0}%` }} /></View>
          </View>
        ))}
        <Text style={[s.note, { marginTop: 8 }]}>{tl('Presença estrutural no mapa — não é "força" nem indica elemento a "adicionar".', 'Structural presence — not "strength" nor an element to "add".', 'Presencia estructural, no "fuerza" ni elemento a "anadir".', 'Presenza strutturale, non "forza" ne elemento da "aggiungere".')}</Text>
      </Card>
    </>
  )
}

function BaziView({ profile, lang, tl }: any) {
  const b = profile.bazi
  const detail = (pk: 'year' | 'month' | 'day' | 'hour', p: any) => {
    if (!p) return null
    const st = STEMS[p.stem], br = BRANCHES[p.branch]
    return (
      <Card key={pk} title={`${pillarTitle(pk, lang)} · ${st.hanzi}${br.hanzi}`}>
        <Text style={s.body}>{elementLabel(st.element, lang)} {st.polarity === 'yang' ? 'Yang' : 'Yin'} ({st.pinyin}) · {animalName(p.branch, lang)}</Text>
        <Text style={[s.body, { marginTop: 4 }]}>{tl('Ocultos', 'Hidden', 'Ocultos', 'Nascosti')}: {br.hiddenStems.map((h: number) => STEMS[h].hanzi).join(' ')}</Text>
        <Text style={[s.body, { marginTop: 4, fontStyle: 'italic', color: '#a7a2c9' }]}>{pillarTheme(pk, lang)}</Text>
      </Card>
    )
  }
  return (
    <>
      <View style={s.pillarsRow}>
        <PillarBox pk="hour" p={b.hour} lang={lang} />
        <PillarBox pk="day" p={b.day} lang={lang} highlight />
        <PillarBox pk="month" p={b.month} lang={lang} />
        <PillarBox pk="year" p={b.year} lang={lang} />
      </View>
      {detail('day', b.day)}
      {detail('month', b.month)}
      {detail('year', b.year)}
      {detail('hour', b.hour)}
    </>
  )
}

function Dinamica({ profile, lang, tl }: any) {
  const b = profile.bazi
  const interLabel: Record<string, string> = {
    'six-harmony': tl('Harmonia (六合)', 'Harmony (六合)', 'Armonia (六合)', 'Armonia (六合)'),
    'six-clash': tl('Choque (六沖)', 'Clash (六沖)', 'Choque (六沖)', 'Scontro (六沖)'),
    'three-harmony': tl('Tripla harmonia (三合)', 'Three harmony (三合)', 'Triple armonia (三合)', 'Tripla armonia (三合)'),
    'harm': tl('Dano (六害)', 'Harm (六害)', 'Dano (六害)', 'Danno (六害)'),
    'punishment': tl('Punição (刑)', 'Punishment (刑)', 'Castigo (刑)', 'Punizione (刑)'),
  }
  return (
    <>
      <Card title={tl('Dez Deuses', 'Ten Gods', 'Diez Dioses', 'Dieci Dei')}>
        {[
          { w: tl('Ano', 'Year', 'Año', 'Anno'), g: b.tenGods.year },
          { w: tl('Mês', 'Month', 'Mes', 'Mese'), g: b.tenGods.month },
          ...(b.tenGods.hour ? [{ w: tl('Hora', 'Hour', 'Hora', 'Ora'), g: b.tenGods.hour }] : []),
        ].map((row: any, i: number) => (
          <View key={i} style={{ marginBottom: 10 }}>
            <Text style={[s.body, { fontWeight: '700' }]}>{row.w} · {tenGodLabel(row.g, lang)}</Text>
            <Text style={s.body}>{tenGodReading(row.g, lang)}</Text>
          </View>
        ))}
        <Text style={[s.note, { marginTop: 2 }]}>{tl('Relação de cada pilar com o Day Master.', 'Each pillar\'s relation to the Day Master.', 'Relacion de cada pilar con el Day Master.', 'Relazione di ogni pilastro col Day Master.')}</Text>
      </Card>
      <Card title={tl('Interações entre ramos', 'Branch interactions', 'Interacciones entre ramos', 'Interazioni tra rami')}>
        {b.interactions.length ? b.interactions.map((it: any, i: number) => (
          <Text key={i} style={s.body}>• {interLabel[it.type]}: {it.branches.map((br: number) => BRANCHES[br].hanzi).join(' ')}</Text>
        )) : <Text style={s.body}>{tl('Sem interações maiores entre os ramos.', 'No major branch interactions.', 'Sin interacciones mayores.', 'Nessuna interazione maggiore.')}</Text>}
        <Text style={[s.note, { marginTop: 6 }]}>{tl('Choque não é "ruim" nem harmonia é "bom" — dependem do conjunto.', 'A clash is not "bad" nor a harmony "good" — they depend on the whole.', 'Un choque no es "malo" ni una armonia "buena".', 'Uno scontro non e "male" ne un armonia "bene".')}</Text>
      </Card>
    </>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <View style={s.cardBox}><Text style={s.cardTitle}>{title}</Text>{children}</View>
}

const s = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 6, paddingHorizontal: 12, paddingVertical: 8 },
  tabBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,.06)', alignItems: 'center' },
  tabBtnActive: { backgroundColor: 'rgba(245,197,66,.18)', borderWidth: 1, borderColor: '#f5c542' },
  tabTxt: { color: '#a7a2c9', fontSize: 12, fontWeight: '700' },
  tabTxtActive: { color: '#f5c542' },
  header: { borderWidth: 1, borderRadius: 16, padding: 18, margin: 12, alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,.03)' },
  kicker: { color: '#a7a2c9', fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  animal: { fontSize: 26, fontWeight: '900' },
  sub: { color: '#cfcbe6', fontSize: 13, fontWeight: '600' },
  dmRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.08)', paddingTop: 12 },
  dmHanzi: { fontSize: 40, fontWeight: '900' },
  dmLbl: { color: '#a7a2c9', fontSize: 11, fontWeight: '800' },
  dmName: { color: '#efedfb', fontSize: 14, fontWeight: '700' },
  pillarsRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 12, marginTop: 4 },
  pillar: { flex: 1, backgroundColor: 'rgba(255,255,255,.04)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', padding: 8, alignItems: 'center' },
  pillarLbl: { color: '#a7a2c9', fontSize: 10, fontWeight: '700' },
  hanzi: { fontSize: 24, fontWeight: '900', lineHeight: 28 },
  pillarSub: { color: '#cfcbe6', fontSize: 10.5, marginTop: 2 },
  pillarSub2: { color: '#8a86a8', fontSize: 9.5, textAlign: 'center' },
  cardBox: { backgroundColor: 'rgba(255,255,255,.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', borderRadius: 14, padding: 14, marginHorizontal: 12, marginTop: 10 },
  cardTitle: { color: '#efedfb', fontSize: 14, fontWeight: '800', marginBottom: 8 },
  body: { color: '#c9c5e2', fontSize: 13.5, lineHeight: 20 },
  card: { backgroundColor: 'rgba(255,255,255,.04)', borderRadius: 14, padding: 16, margin: 12 },
  cardText: { color: '#c9c5e2', fontSize: 14, lineHeight: 20 },
  loadingWrap: { padding: 40, alignItems: 'center' },
  note: { color: '#8a86a8', fontSize: 11, lineHeight: 16, marginHorizontal: 12, marginTop: 6 },
  disclaimer: { color: '#8a86a8', fontSize: 11, lineHeight: 16, marginHorizontal: 16, marginTop: 16 },
  barLbl: { color: '#cfcbe6', fontSize: 12.5, fontWeight: '600' },
  barVal: { color: '#a7a2c9', fontSize: 12.5, fontWeight: '700' },
  barBg: { height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,.08)', overflow: 'hidden' },
})
