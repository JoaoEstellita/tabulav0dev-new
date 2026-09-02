/**
 * MODO TZOLKIN (Dreamspell) da aba Mapa. Sub-abas: Kin (assinatura), Roda
 * (tabuleiro 13×20 + Oráculo da Quinta Força clicável), Onda (onda encantada),
 * Interpretações (leitura curada ×4). Motor puro em astro/tzolkin (sem IA).
 */
import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { buildProfile, kinOfDate, getKinDisplayName, sealOf, toneOf, SEALS, COLOR_LABELS, todayISO } from '../../astro/tzolkin'
import { getSealWords, getToneWords } from '../../data/tzolkin/tzolkinOverridesI18n'
import { SEAL_SVG, TONE_SVG } from '../../assets/tzolkin/sealGlyphs'
import { SvgCss } from 'react-native-svg/css'
import { readSeal, readTone, readSynthesis, oracleRole, familyText, castleText, disclaimer, todayRelation, wavespellQuestion } from '../../data/tzolkin/reading'

type SubTab = 'kin' | 'roda' | 'onda'
type Role = 'destiny' | 'guide' | 'analog' | 'antipode' | 'occult'

export default function TzolkinProfileContent({ birthDateISO }: { birthDateISO?: string }) {
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const lang = language || 'pt-BR'
  const tl = (pt: string, en: string, es: string, it: string) =>
    lang === 'en-US' ? en : lang === 'es-ES' ? es : lang === 'it-IT' ? it : pt

  const [date, setDate] = useState<string | undefined>(birthDateISO)
  const [tab, setTab] = useState<SubTab>('kin')

  useEffect(() => {
    if (birthDateISO) { setDate(birthDateISO); return }
    if (!user?.uid) return
    getDoc(doc(db, 'users', user.uid)).then((snap) => { setDate(snap.data()?.birthDate) }).catch(() => { })
  }, [user?.uid, birthDateISO])

  const profile = useMemo(() => (date ? buildProfile(date) : null), [date])
  const todayKin = useMemo(() => kinOfDate(todayISO()), [])

  if (!date) {
    return <View style={s.card}><Text style={s.cardText}>{tl('Cadastre sua data de nascimento para ver seu Kin.', 'Add your birth date to see your Kin.', 'Registra tu fecha de nacimiento para ver tu Kin.', 'Inserisci la tua data di nascita per vedere il tuo Kin.')}</Text></View>
  }
  if (!profile) return <View style={s.loadingWrap}><ActivityIndicator color="#FFD700" /></View>

  const color = COLOR_LABELS[SEALS[profile.seal - 1].color]

  return (
    <View style={{ flex: 1 }}>
      {/* Sub-abas */}
      <View style={s.tabs}>
        {([['kin', tl('Kin', 'Kin', 'Kin', 'Kin')], ['roda', tl('Roda', 'Wheel', 'Rueda', 'Ruota')], ['onda', tl('Onda', 'Wavespell', 'Onda', 'Onda')]] as [SubTab, string][]).map(([k, label]) => (
          <TouchableOpacity key={k} style={[s.tabBtn, tab === k && s.tabBtnActive]} activeOpacity={0.85} onPress={() => setTab(k)}>
            <Text style={[s.tabTxt, tab === k && s.tabTxtActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {tab === 'kin' && <KinView profile={profile} color={color} todayKin={todayKin} lang={lang} tl={tl} />}
        {tab === 'roda' && <RodaView profile={profile} lang={lang} tl={tl} />}
        {tab === 'onda' && <OndaView profile={profile} color={color} lang={lang} tl={tl} />}
        <Text style={s.disclaimer}>{disclaimer(lang)}</Text>
      </ScrollView>
    </View>
  )
}

// ── Glifo placeholder (círculo com cor + número do selo) ────────────────────
function Glyph({ seal, size = 56 }: { seal: number; size?: number }) {
  const c = COLOR_LABELS[SEALS[seal - 1].color]
  const xml = SEAL_SVG[seal]
  if (xml) return <View style={{ width: size, height: size }}><SvgCss xml={xml} width="100%" height="100%" /></View>
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.hex, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,.25)' }}>
      <Text style={{ color: '#0F0F23', fontWeight: '900', fontSize: size * 0.34 }}>{seal}</Text>
    </View>
  )
}

// Selo pequeno para listas (glifo SVG se houver, senão cor + número).
function MiniSeal({ seal, size = 30, highlight }: { seal: number; size?: number; highlight?: boolean }) {
  const hex = COLOR_LABELS[SEALS[seal - 1].color].hex
  const xml = SEAL_SVG[seal]
  if (xml) return (
    <View style={{ width: size, height: size, borderRadius: 6, borderWidth: highlight ? 2 : 0, borderColor: '#fff', overflow: 'hidden' }}>
      <SvgCss xml={xml} width="100%" height="100%" />
    </View>
  )
  return (
    <View style={{ width: size, height: size, borderRadius: 7, backgroundColor: highlight ? hex : hex + '55', alignItems: 'center', justifyContent: 'center', borderWidth: highlight ? 1.5 : 0, borderColor: '#fff' }}>
      <Text style={{ color: highlight ? '#0F0F23' : '#e6e3f5', fontWeight: '800', fontSize: size * 0.4 }}>{seal}</Text>
    </View>
  )
}

// Glifo do tom (SVG dos pontos/barras) — para a Onda e o cabeçalho.
function ToneGlyph({ tone, size = 26 }: { tone: number; size?: number }) {
  const xml = TONE_SVG[tone]
  if (!xml) return null
  return <View style={{ width: size, height: size }}><SvgCss xml={xml} width="100%" height="100%" /></View>
}

// ── Sub-aba KIN ─────────────────────────────────────────────────────────────
function KinView({ profile, color, todayKin, lang, tl }: any) {
  const sw = getSealWords(profile.seal, lang), tw = getToneWords(profile.tone, lang)
  const today = buildToday(todayKin)
  const rel = todayRelation(profile.kin, todayKin, profile.oracle, profile.seal, profile.tone, today.seal, today.tone, lang)
  return (
    <>
      <View style={[s.header, { borderColor: color.hex }]}>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <ToneGlyph tone={profile.tone} size={30} />
          <Glyph seal={profile.seal} size={58} />
        </View>
        <Text style={s.kinNum}>KIN {profile.kin}</Text>
        <Text style={[s.kinName, { color: color.hex }]}>{getKinDisplayName(profile.kin, lang)}</Text>
        <View style={s.chipRow}>
          <View style={s.chip}><Text style={s.chipTxt}>{tl('Selo', 'Seal', 'Sello', 'Sigillo')} {profile.seal} · {sw.name}</Text></View>
          <View style={s.chip}><Text style={s.chipTxt}>{tl('Tom', 'Tone', 'Tono', 'Tono')} {profile.tone} · {tw.name}</Text></View>
        </View>
      </View>
      <Card title={tl('Palavras-chave', 'Keywords', 'Palabras clave', 'Parole chiave')}>
        <Text style={s.body}>{tl('Selo', 'Seal', 'Sello', 'Sigillo')}: {sw.power} · {sw.action} · {sw.essence}</Text>
        <Text style={s.body}>{tl('Tom', 'Tone', 'Tono', 'Tono')}: {tw.essence} · {tw.power} · {tw.action}</Text>
      </Card>
      <Card title={tl('Sua essência (Selo)', 'Your essence (Seal)', 'Tu esencia (Sello)', 'La tua essenza (Sigillo)')}><Text style={s.body}>{readSeal(profile.seal, lang)}</Text></Card>
      <Card title={tl('Seu Tom Galáctico', 'Your Galactic Tone', 'Tu Tono Galactico', 'Il tuo Tono Galattico')}><Text style={s.body}>{readTone(profile.tone, lang)}</Text></Card>
      <Card title={tl('Selo + Tom', 'Seal + Tone', 'Sello + Tono', 'Sigillo + Tono')}><Text style={s.body}>{readSynthesis(profile.seal, profile.tone, lang)}</Text></Card>
      <Card title={familyText(profile.earthFamily, lang).title}><Text style={s.body}>{familyText(profile.earthFamily, lang).text}</Text></Card>
      <Card title={castleText(profile.castle.key, lang).title}><Text style={s.body}>{castleText(profile.castle.key, lang).text}</Text></Card>
      <Card title={tl('Kin de hoje', 'Kin of the day', 'Kin de hoy', 'Kin di oggi')}>
        <Text style={s.body}>KIN {todayKin} — {getKinDisplayName(todayKin, lang)}</Text>
        {rel ? <Text style={[s.body, { marginTop: 6, fontStyle: 'italic' }]}>{rel}</Text> : null}
      </Card>
    </>
  )
}

// ── Sub-aba RODA (tabuleiro 13×20 + Oráculo) ────────────────────────────────
function RodaView({ profile, lang, tl }: any) {
  const board = useMemo(() => {
    const g: number[][] = Array.from({ length: 20 }, () => Array(13).fill(0))
    for (let k = 1; k <= 260; k++) g[sealOf(k) - 1][toneOf(k) - 1] = k
    return g
  }, [])
  const [sel, setSel] = useState<Role>('destiny')
  const o = profile.oracle
  const posOf: Record<Role, any> = { destiny: o.destiny, guide: o.guide, analog: o.analog, antipode: o.antipode, occult: o.occult }
  const selPos = posOf[sel]
  const roleLabel = (r: Role) => r === 'destiny' ? tl('Destino', 'Destiny', 'Destino', 'Destino') : oracleRole(r as any, lang).title

  return (
    <>
      <Card title={tl('Oráculo da Quinta Força', 'Fifth Force Oracle', 'Oraculo de la Quinta Fuerza', 'Oracolo della Quinta Forza')}>
        <View style={s.oracle}>
          <OracleNode pos={o.guide} label={roleLabel('guide')} active={sel === 'guide'} onPress={() => setSel('guide')} />
          <View style={s.oracleRow}>
            <OracleNode pos={o.antipode} label={roleLabel('antipode')} active={sel === 'antipode'} onPress={() => setSel('antipode')} />
            <OracleNode pos={o.destiny} label={roleLabel('destiny')} active={sel === 'destiny'} onPress={() => setSel('destiny')} big />
            <OracleNode pos={o.analog} label={roleLabel('analog')} active={sel === 'analog'} onPress={() => setSel('analog')} />
          </View>
          <OracleNode pos={o.occult} label={roleLabel('occult')} active={sel === 'occult'} onPress={() => setSel('occult')} />
        </View>
        <View style={s.oracleInfo}>
          <Text style={s.oracleInfoTitle}>{roleLabel(sel)} — KIN {selPos.kin}</Text>
          <Text style={s.body}>{getKinDisplayName(selPos.kin, lang)}</Text>
          {sel !== 'destiny' ? <Text style={[s.body, { marginTop: 6 }]}>{oracleRole(sel as any, lang).text}</Text> : null}
        </View>
      </Card>

      <Card title={tl('Tabuleiro Tzolkin', 'Tzolkin board', 'Tablero Tzolkin', 'Tabellone Tzolkin')}>
        <Text style={[s.body, { marginBottom: 8 }]}>{tl('260 Kins — 20 selos (linhas) × 13 tons (colunas). Seu Kin em destaque.', '260 Kins — 20 seals (rows) × 13 tones (columns). Your Kin highlighted.', '260 Kines — 20 sellos (filas) × 13 tonos (columnas). Tu Kin destacado.', '260 Kin — 20 sigilli (righe) × 13 toni (colonne). Il tuo Kin in evidenza.')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {board.map((row, si) => (
              <View key={si} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
                <MiniSeal seal={si + 1} size={18} />
                {row.map((k, ti) => {
                  const hl = k === profile.kin
                  const c = COLOR_LABELS[SEALS[si].color].hex
                  return (
                    <View key={ti} style={{ width: 26, height: 18, marginLeft: 1, borderRadius: 2, backgroundColor: hl ? c : c + '40', borderWidth: hl ? 1 : 0, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: hl ? '#0F0F23' : 'rgba(230,227,245,.8)', fontSize: 8, fontWeight: hl ? '900' : '600' }}>{k}</Text>
                    </View>
                  )
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </Card>
    </>
  )
}

function OracleNode({ pos, label, active, onPress, big }: any) {
  const c = COLOR_LABELS[SEALS[pos.seal - 1].color].hex
  const d = big ? 54 : 46
  const xml = SEAL_SVG[pos.seal]
  return (
    <TouchableOpacity style={{ alignItems: 'center' }} activeOpacity={0.8} onPress={onPress}>
      <View style={{ width: d, height: d, borderRadius: xml ? 8 : d / 2, overflow: 'hidden', backgroundColor: xml ? 'transparent' : c, alignItems: 'center', justifyContent: 'center', borderWidth: active ? 2.5 : 1, borderColor: active ? '#fff' : 'rgba(255,255,255,.2)' }}>
        {xml ? <SvgCss xml={xml} width="100%" height="100%" /> : <Text style={{ color: '#0F0F23', fontWeight: '900', fontSize: 13 }}>{pos.kin}</Text>}
      </View>
      <Text style={s.oracleLabel}>{label}</Text>
      <Text style={{ color: '#8a86a8', fontSize: 9 }}>KIN {pos.kin}</Text>
    </TouchableOpacity>
  )
}

// ── Sub-aba ONDA ─────────────────────────────────────────────────────────────
function OndaView({ profile, lang, tl }: any) {
  const w = profile.wavespell
  const ruling = getSealWords(w.rulingSeal, lang)
  const [sel, setSel] = useState<number>(w.position) // posição selecionada (tom 1..13)
  const selKin = w.startKin + (sel - 1)
  const selTone = getToneWords(sel, lang)
  return (
    <>
      <Card title={tl('Onda Encantada', 'Wavespell', 'Onda Encantada', 'Onda Incantata')}>
        <Text style={s.body}>{tl('Onda do', 'Wavespell of', 'Onda del', 'Onda del')} {ruling.name} — {tl('Kin inicial', 'start Kin', 'Kin inicial', 'Kin iniziale')} {w.startKin}</Text>
        <Text style={[s.body, { marginTop: 2, marginBottom: 8 }]}>{tl('Sua posição', 'Your position', 'Tu posicion', 'La tua posizione')}: {w.position}/13 — {tl('toque cada tom para ler', 'tap each tone to read', 'toca cada tono para leer', 'tocca ogni tono per leggere')}</Text>
        {Array.from({ length: 13 }, (_, i) => {
          const posNum = i + 1
          const kin = w.startKin + i
          const tw = getToneWords(posNum, lang)
          const sw = getSealWords(sealOf(kin), lang)
          const isUser = kin === profile.kin
          const isSel = posNum === sel
          return (
            <TouchableOpacity key={posNum} activeOpacity={0.8} onPress={() => setSel(posNum)}
              style={[s.wRow, isSel && s.wRowSel]}>
              <View style={s.toneNum}><Text style={s.toneNumTx}>{posNum}</Text></View>
              <MiniSeal seal={sealOf(kin)} size={30} highlight={isUser} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={s.wTone} numberOfLines={1}>{tw.name} · {sw.name}</Text>
                <Text style={s.wKin}>KIN {kin}{isUser ? tl(' · você', ' · you', ' · tu', ' · tu') : ''}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </Card>

      <Card title={`${tl('Posição', 'Position', 'Posicion', 'Posizione')} ${sel} — ${selTone.name}`}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <ToneGlyph tone={sel} size={34} />
          <Text style={[s.body, { flex: 1, color: '#f5c542', fontWeight: '700', fontStyle: 'italic' }]}>“{wavespellQuestion(sel, lang)}”</Text>
        </View>
        <Text style={s.body}>{readTone(sel, lang)}</Text>
        <Text style={[s.body, { marginTop: 8, color: '#cfcbe6' }]}>KIN {selKin} — {getKinDisplayName(selKin, lang)}</Text>
        <Text style={[s.body, { marginTop: 6, fontStyle: 'italic', color: '#a7a2c9' }]}>
          {tl('Aqui o tom', 'Here the tone', 'Aqui el tono', 'Qui il tono')} {selTone.name} ({selTone.essence}) {tl('atua sobre o selo', 'acts on the seal', 'actua sobre el sello', 'agisce sul sigillo')} {getSealWords(sealOf(selKin), lang).name}.
        </Text>
      </Card>
    </>
  )
}

// ── Sub-aba INTERPRETAÇÕES ──────────────────────────────────────────────────
function InterpView({ profile, lang, tl }: any) {
  return (
    <>
      <Card title={tl('Sua essência (Selo)', 'Your essence (Seal)', 'Tu esencia (Sello)', 'La tua essenza (Sigillo)')}><Text style={s.body}>{readSeal(profile.seal, lang)}</Text></Card>
      <Card title={tl('Seu Tom Galáctico', 'Your Galactic Tone', 'Tu Tono Galactico', 'Il tuo Tono Galattico')}><Text style={s.body}>{readTone(profile.tone, lang)}</Text></Card>
      <Card title={tl('Selo + Tom', 'Seal + Tone', 'Sello + Tono', 'Sigillo + Tono')}><Text style={s.body}>{readSynthesis(profile.seal, profile.tone, lang)}</Text></Card>
      <Card title={familyText(profile.earthFamily, lang).title}><Text style={s.body}>{familyText(profile.earthFamily, lang).text}</Text></Card>
      <Card title={castleText(profile.castle.key, lang).title}><Text style={s.body}>{castleText(profile.castle.key, lang).text}</Text></Card>
    </>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.cardBox}>
      <Text style={s.cardTitle}>{title}</Text>
      {children}
    </View>
  )
}

function buildToday(kin: number) { return { kin, seal: sealOf(kin), tone: toneOf(kin) } }

const s = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 6, paddingHorizontal: 12, paddingVertical: 8 },
  tabBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,.06)', alignItems: 'center' },
  tabBtnActive: { backgroundColor: 'rgba(245,197,66,.18)', borderWidth: 1, borderColor: '#f5c542' },
  tabTxt: { color: '#a7a2c9', fontSize: 11.5, fontWeight: '700' },
  tabTxtActive: { color: '#f5c542' },
  header: { borderWidth: 1, borderRadius: 16, padding: 18, margin: 12, alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,.03)' },
  kinNum: { color: '#a7a2c9', fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
  kinName: { fontSize: 22, fontWeight: '900', textAlign: 'center' },
  chipRow: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' },
  chip: { backgroundColor: 'rgba(255,255,255,.07)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  chipTxt: { color: '#cfcbe6', fontSize: 12, fontWeight: '600' },
  cardBox: { backgroundColor: 'rgba(255,255,255,.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', borderRadius: 14, padding: 14, marginHorizontal: 12, marginTop: 10 },
  cardTitle: { color: '#efedfb', fontSize: 14, fontWeight: '800', marginBottom: 8 },
  body: { color: '#c9c5e2', fontSize: 13.5, lineHeight: 20 },
  card: { backgroundColor: 'rgba(255,255,255,.04)', borderRadius: 14, padding: 16, margin: 12 },
  cardText: { color: '#c9c5e2', fontSize: 14, lineHeight: 20 },
  loadingWrap: { padding: 40, alignItems: 'center' },
  disclaimer: { color: '#8a86a8', fontSize: 11, lineHeight: 16, marginHorizontal: 16, marginTop: 16 },
  cell: { flex: 1, aspectRatio: 1, margin: 0.5, borderRadius: 2 },
  oracle: { alignItems: 'center', gap: 10, paddingVertical: 8 },
  oracleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28 },
  oracleLabel: { color: '#a7a2c9', fontSize: 10, fontWeight: '700', marginTop: 3 },
  oracleInfo: { marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.08)', paddingTop: 12 },
  oracleInfoTitle: { color: '#f5c542', fontSize: 13, fontWeight: '800', marginBottom: 4 },
  wRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7, paddingHorizontal: 8, borderRadius: 10, marginBottom: 2 },
  wRowSel: { backgroundColor: 'rgba(139,124,246,.14)', borderWidth: 1, borderColor: 'rgba(139,124,246,.4)' },
  toneNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,.08)', alignItems: 'center', justifyContent: 'center' },
  toneNumTx: { color: '#cfcbe6', fontSize: 12, fontWeight: '800' },
  wTone: { color: '#efedfb', fontSize: 13, fontWeight: '700' },
  wKin: { color: '#a7a2c9', fontSize: 11.5, marginTop: 1 },
})
