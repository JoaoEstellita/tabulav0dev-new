import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { getSynastry, type SynastryResult } from '../services/DiscoveryService'
import SynastryWheel from './SynastryWheel'
import AspectGrid, { transitCellId } from './AspectGrid'
import SynastryAspectDetailModal from './SynastryAspectDetailModal'
import { useAuth } from '../hooks/useAuth'
import { db } from '../config/firebase'
import { doc, getDoc } from 'firebase/firestore'
import TzolkinMatchView from '../screens/cosmos/TzolkinMatchView'
import ChineseMatchView from '../screens/cosmos/ChineseMatchView'
import VedicMatchView from '../screens/cosmos/VedicMatchView'
import { tzolkinMatchScore } from '../astro/tzolkin'

const TZOLKIN_ENABLED = process.env.EXPO_PUBLIC_TZOLKIN_ENABLED !== '0'
const CHINESE_ENABLED = process.env.EXPO_PUBLIC_CHINESE_ENABLED !== '0'
const VEDIC_ENABLED = process.env.EXPO_PUBLIC_VEDIC_ENABLED !== '0'
// Peso do Tzolkin na "Visão Integrada" exibida (astro continua base). '0' esconde o combinado.
const TZ_DISPLAY_WEIGHT = Math.max(0, Math.min(1, Number(process.env.EXPO_PUBLIC_TZOLKIN_MATCH_WEIGHT ?? '0.3')))

/**
 * Modal de sinastria com UMA pessoa (conexão). Mesmo componente de roda + grade
 * do Match/Grupos — busca via `getSynastry` (PAGA). Reutilizável em qualquer
 * lugar que tenha um uid: lista de conexões, etc.
 */
const C = { bg: '#0F0F23', card: '#161728', line: 'rgba(255,255,255,0.12)', gold: '#FFD700', magenta: '#FF4D8D', tx: '#EDEBF7', dim: '#9A9CB8' }
const CAP: Record<string, string> = { sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto' }

export default function SynastryModal({ visible, uid, name, onClose }: { visible: boolean; uid: string | null; name: string | null; onClose: () => void }) {
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it } as any)[language] || pt
  const [data, setData] = useState<SynastryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<{ mine: string; theirs: string; aspect: string; orb: number } | null>(null)
  const { user } = useAuth()
  type Person = { date?: string; time?: string; lon?: number }
  const [people, setPeople] = useState<{ a?: Person; b?: Person }>({})

  useEffect(() => {
    if (!visible || !uid) return
    setData(null); setLoading(true)
    getSynastry(uid).then(setData).catch(() => setData(null)).finally(() => setLoading(false))
  }, [visible, uid])

  // Sinastrias simbólicas (Tzolkin/Chinês/Védico): nascimento das 2 pessoas (aditivo, gated).
  useEffect(() => {
    if (!visible || !uid || !user?.uid) { setPeople({}); return }
    const toPerson = (d: any): Person => {
      const loc = d?.birthLocation || d?.birthData?.birthLocation || d?.birthData?.coordinates
      return { date: d?.birthDate, time: d?.birthTime, lon: typeof loc?.longitude === 'number' ? loc.longitude : undefined }
    }
    Promise.all([
      getDoc(doc(db, 'users', user.uid)).then(s => toPerson(s.data())).catch(() => ({} as Person)),
      getDoc(doc(db, 'users', uid)).then(s => toPerson(s.data())).catch(() => ({} as Person)),
    ]).then(([a, b]) => setPeople({ a, b }))
  }, [visible, uid, user?.uid])

  const moonOf = (pos?: { planetEn: string; longitude: number }[]) => {
    const m = (pos || []).find((p) => p.planetEn === 'moon')
    return typeof m?.longitude === 'number' ? m.longitude : null
  }

  const wheelAspects = (data?.aspects || []).map((a) => ({ mine: a.mine, theirs: a.theirs, labelPt: a.aspect, orb: a.orb }))
  const gridAspects = (data?.aspects || []).map((a) => ({ planet1: CAP[a.mine] || a.mine, planet2: CAP[a.theirs] || a.theirs, type: a.aspect, orb: a.orb }))
  const toGrid = (pos?: { planetEn: string; longitude: number }[]) => (pos || []).map((p) => ({ name: CAP[p.planetEn] || p.planetEn, longitude: p.longitude }))

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={s.screen}>
        <View style={s.head}>
          <Text style={s.title} numberOfLines={1}>{tl('Sinastria', 'Synastry', 'Sinastria', 'Sinastria')}{name ? ` · ${name}` : ''}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><Ionicons name="close" size={26} color={C.dim} /></TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {loading ? <ActivityIndicator color={C.gold} style={{ marginTop: 30 }} /> : !data ? (
            <Text style={s.empty}>{tl('Não consegui carregar a sinastria.', 'Could not load synastry.', 'No pude cargar la sinastria.', 'Non ho caricato la sinastria.')}</Text>
          ) : !data.premium ? (
            <View style={s.emptyCard}>
              <Ionicons name="lock-closed" size={30} color={C.gold} />
              <Text style={s.empty}>{tl('A sinastria completa é para assinantes.', 'Full synastry is for subscribers.', 'La sinastria completa es para suscriptores.', 'La sinastria completa e per abbonati.')}</Text>
            </View>
          ) : (
            <>
              {typeof data.score === 'number' ? (
                <View style={s.scoreBox}>
                  <Text style={s.scorePct}>{Math.round(data.score)}<Text style={s.scoreSym}>%</Text></Text>
                  <Text style={s.scoreLbl}>{tl('afinidade', 'affinity', 'afinidad', 'affinita')}</Text>
                </View>
              ) : null}

              {TZOLKIN_ENABLED && people.a?.date && people.b?.date ? (() => {
                const tz = tzolkinMatchScore(people.a!.date!, people.b!.date!)
                const astro = typeof data.score === 'number' ? Math.round(data.score) : null
                const combined = (astro != null && TZ_DISPLAY_WEIGHT > 0) ? Math.round(astro * (1 - TZ_DISPLAY_WEIGHT) + tz * TZ_DISPLAY_WEIGHT) : null
                return (
                  <View style={{ backgroundColor: 'rgba(139,124,246,.10)', borderWidth: 1, borderColor: 'rgba(139,124,246,.35)', borderRadius: 14, padding: 14, marginBottom: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#c9c5e2', fontSize: 13, fontWeight: '700' }}>Tzolkin Match</Text>
                      <Text style={{ color: '#8b7cf6', fontSize: 20, fontWeight: '900' }}>{tz}%</Text>
                    </View>
                    {combined != null ? (
                      <Text style={{ color: '#a7a2c9', fontSize: 12, marginTop: 4 }}>{tl('Visão integrada', 'Integrated view', 'Vision integrada', 'Visione integrata')}: {combined}% <Text style={{ color: '#6f6a90', fontSize: 11 }}>(astro + Tzolkin)</Text></Text>
                    ) : null}
                    <View style={{ marginTop: 10, marginHorizontal: -14, marginBottom: -14 }}>
                      <TzolkinMatchView embedded aDateISO={people.a!.date!} bDateISO={people.b!.date!} aName={tl('Você', 'You', 'Tu', 'Tu')} bName={name || undefined} />
                    </View>
                  </View>
                )
              })() : null}
              {CHINESE_ENABLED && people.a?.date && people.b?.date ? (
                <View style={{ backgroundColor: 'rgba(228,87,46,.09)', borderWidth: 1, borderColor: 'rgba(228,87,46,.30)', borderRadius: 14, padding: 14, marginBottom: 14 }}>
                  <Text style={{ color: '#e4572e', fontSize: 13, fontWeight: '800', marginBottom: 8 }}>{tl('Sinastria Chinesa (BaZi)', 'Chinese synastry (BaZi)', 'Sinastria China (BaZi)', 'Sinastria Cinese (BaZi)')}</Text>
                  <ChineseMatchView embedded aBirth={{ birthDate: people.a.date, birthTime: people.a.time, longitude: people.a.lon }} bBirth={{ birthDate: people.b.date, birthTime: people.b.time, longitude: people.b.lon }} aName={tl('Você', 'You', 'Tu', 'Tu')} bName={name || undefined} />
                </View>
              ) : null}
              {VEDIC_ENABLED && people.a?.date && people.b?.date && moonOf(data.myPositions) != null && moonOf(data.positions) != null ? (
                <View style={{ backgroundColor: 'rgba(139,124,246,.09)', borderWidth: 1, borderColor: 'rgba(139,124,246,.30)', borderRadius: 14, padding: 14, marginBottom: 14 }}>
                  <Text style={{ color: '#8B7CF6', fontSize: 13, fontWeight: '800', marginBottom: 8 }}>{tl('Sinastria Védica (Guna Milan)', 'Vedic synastry (Guna Milan)', 'Sinastria Vedica (Guna Milan)', 'Sinastria Vedica (Guna Milan)')}</Text>
                  <VedicMatchView embedded aMoonLon={moonOf(data.myPositions)} aBirthDate={people.a.date} bMoonLon={moonOf(data.positions)} bBirthDate={people.b.date} aName={tl('Você', 'You', 'Tu', 'Tu')} bName={name || undefined} />
                </View>
              ) : null}
              {data.myPositions?.length && data.positions?.length ? (
                <>
                  <Text style={s.sect}>{tl('Roda de sinastria', 'Synastry wheel', 'Rueda de sinastria', 'Ruota di sinastria')}</Text>
                  <SynastryWheel outer={data.myPositions} inner={data.positions} aspects={wheelAspects} size={310} outerLabel={tl('Você', 'You', 'Tu', 'Tu')} innerLabel={name || ''} />
                  <View style={{ marginTop: 14 }}>
                    <Text style={s.sect}>{tl('Grade de aspectos', 'Aspect grid', 'Grilla de aspectos', 'Griglia aspetti')}</Text>
                    <Text style={s.hint}>{tl('Toque num aspecto para a leitura da dupla', 'Tap an aspect for the pair reading', 'Toca un aspecto para la lectura de la pareja', 'Tocca un aspetto per la lettura della coppia')}</Text>
                    <AspectGrid
                      cross
                      rowPlanets={toGrid(data.myPositions)}
                      colPlanets={toGrid(data.positions)}
                      aspects={gridAspects}
                      onSelectCell={(cellId) => {
                        const hit = (data.aspects || []).find((a) => transitCellId(CAP[a.mine] || a.mine, a.aspect, CAP[a.theirs] || a.theirs) === cellId)
                        if (hit) setDetail(hit)
                      }}
                    />
                  </View>
                </>
              ) : (
                <Text style={s.empty}>{tl('Sem aspectos pessoais relevantes.', 'No relevant personal aspects.', 'Sin aspectos personales relevantes.', 'Nessun aspetto personale rilevante.')}</Text>
              )}
            </>
          )}
        </ScrollView>
      </View>
      <SynastryAspectDetailModal
        visible={!!detail}
        aspect={detail}
        nameA={tl('Você', 'You', 'Tu', 'Tu')}
        nameB={name || ''}
        onClose={() => setDetail(null)}
      />
    </Modal>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg, paddingTop: 52 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 },
  title: { color: C.tx, fontSize: 20, fontWeight: '900', flex: 1, marginRight: 12 },
  sect: { color: C.dim, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, marginTop: 4 },
  scoreBox: { alignItems: 'center', marginBottom: 16 },
  scorePct: { color: C.magenta, fontSize: 40, fontWeight: '900' },
  scoreSym: { fontSize: 20 },
  scoreLbl: { color: C.dim, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  empty: { color: C.dim, fontSize: 14, textAlign: 'center', marginTop: 16, paddingHorizontal: 20, lineHeight: 20 },
  hint: { color: C.dim, fontSize: 12, marginBottom: 8, fontStyle: 'italic' },
  emptyCard: { alignItems: 'center', gap: 12, paddingVertical: 40 },
})
