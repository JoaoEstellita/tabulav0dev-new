import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { translatePlanet, getAspectSymbol } from '../utils/astro/pt'
import { synastryAspectDetail, synastryToneOf } from '../astro/synastryReading'

type AspectLike = { mine: string; theirs: string; aspect: string; orb: number; tone?: string }

// Detalhe de UM aspecto de sinastria (clique numa célula da grade). Interpretação
// específica de relacionamento — reusado por Grupos e Match/Conexões.
const TONE = {
  harmonioso: { color: '#3ecf8e', pt: 'harmônico', en: 'harmonic', es: 'armonico', it: 'armonico' },
  tenso: { color: '#FCA5A5', pt: 'tenso', en: 'tense', es: 'tenso', it: 'teso' },
  neutro: { color: '#FFD700', pt: 'fusão', en: 'merge', es: 'fusion', it: 'fusione' },
} as const

export default function SynastryAspectDetailModal({
  visible, aspect, nameA, nameB, onClose,
}: { visible: boolean; aspect: AspectLike | null; nameA: string; nameB: string; onClose: () => void }) {
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it } as any)[language] || pt
  if (!aspect) return null

  const toneKey = aspect.tone || synastryToneOf(aspect.aspect)
  const tone = (TONE as any)[toneKey] || TONE.neutro
  const toneLabel = tl(tone.pt, tone.en, tone.es, tone.it)
  const { headline, body } = synastryAspectDetail(aspect, language)
  const planetA = translatePlanet(aspect.mine, language)
  const planetB = translatePlanet(aspect.theirs, language)
  const firstA = (nameA || tl('Você', 'You', 'Tu', 'Tu')).split(' ')[0]
  const firstB = (nameB || '').split(' ')[0]

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.back}>
        <View style={s.sheet}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={[s.toneTag, { borderColor: tone.color }]}><Text style={[s.toneTx, { color: tone.color }]}>{toneLabel}</Text></View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><Ionicons name="close" size={24} color="#9aa2b8" /></TouchableOpacity>
          </View>

          <Text style={s.title}>
            {tl('Seu', 'Your', 'Tu', 'Il tuo')} {planetA} <Text style={{ color: tone.color }}>{getAspectSymbol(aspect.aspect)}</Text> {planetB}{firstB ? ` ${tl('de', 'of', 'de', 'di')} ${firstB}` : ''}
          </Text>
          <Text style={s.orb}>{tl('orbe', 'orb', 'orbe', 'orbe')} {Number(aspect.orb).toFixed(1)}°</Text>

          {headline ? <Text style={s.headline}>{headline}</Text> : null}
          {body ? <Text style={s.body}>{body}</Text> : null}

          <Text style={s.foot}>{tl('A sinastria mostra a dinâmica — o que vocês fazem com ela é de vocês.', 'Synastry shows the dynamic — what you do with it is up to you.', 'La sinastria muestra la dinamica — lo que hacen con ella es de ustedes.', 'La sinastria mostra la dinamica — cosa ne fate dipende da voi.')}</Text>
        </View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  back: { flex: 1, backgroundColor: 'rgba(8,6,18,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#0F0F23', borderTopLeftRadius: 22, borderTopRightRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 20, paddingBottom: 34 },
  toneTag: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  toneTx: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { color: '#EDEBF7', fontSize: 20, fontWeight: '900', marginTop: 10 },
  orb: { color: '#9aa2b8', fontSize: 12.5, marginTop: 3 },
  headline: { color: '#FFD700', fontSize: 15, fontWeight: '700', lineHeight: 21, marginTop: 16 },
  body: { color: '#C7C9E0', fontSize: 14, lineHeight: 20, marginTop: 8 },
  foot: { color: '#9aa2b8', fontSize: 11.5, fontStyle: 'italic', lineHeight: 16, marginTop: 16 },
})
