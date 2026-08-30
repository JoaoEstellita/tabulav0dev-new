import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { getSynastry, type SynastryResult } from '../services/DiscoveryService'
import SynastryWheel from './SynastryWheel'
import AspectGrid from './AspectGrid'

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

  useEffect(() => {
    if (!visible || !uid) return
    setData(null); setLoading(true)
    getSynastry(uid).then(setData).catch(() => setData(null)).finally(() => setLoading(false))
  }, [visible, uid])

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
              {data.myPositions?.length && data.positions?.length ? (
                <>
                  <Text style={s.sect}>{tl('Roda de sinastria', 'Synastry wheel', 'Rueda de sinastria', 'Ruota di sinastria')}</Text>
                  <SynastryWheel outer={data.myPositions} inner={data.positions} aspects={wheelAspects} size={310} outerLabel={tl('Você', 'You', 'Tu', 'Tu')} innerLabel={name || ''} />
                  <View style={{ marginTop: 14 }}>
                    <Text style={s.sect}>{tl('Grade de aspectos', 'Aspect grid', 'Grilla de aspectos', 'Griglia aspetti')}</Text>
                    <AspectGrid cross rowPlanets={toGrid(data.myPositions)} colPlanets={toGrid(data.positions)} aspects={gridAspects} />
                  </View>
                </>
              ) : (
                <Text style={s.empty}>{tl('Sem aspectos pessoais relevantes.', 'No relevant personal aspects.', 'Sin aspectos personales relevantes.', 'Nessun aspetto personale rilevante.')}</Text>
              )}
            </>
          )}
        </ScrollView>
      </View>
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
  emptyCard: { alignItems: 'center', gap: 12, paddingVertical: 40 },
})
