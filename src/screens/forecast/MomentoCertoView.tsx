import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAppLanguage } from '../../hooks/useAppLanguage'

/**
 * Momento Certo — astrologia eletiva pessoal ("quando agir"). ETAPA 1: casca +
 * teaser (o motor de ranqueamento de janelas entra na F1 do backend). Escolhe a
 * intenção; a lista de janelas vem depois. Grátis vê teaser + Assinar (opção A).
 */
const C = { bg: '#0F0F23', card: '#1C1C1E', card2: '#24242e', line: 'rgba(255,255,255,0.10)', gold: '#FFD700', tx: '#EDEBF7', dim: '#9aa2b8' }

export type Intention = 'amor' | 'carreira' | 'decisao' | 'conversa'

export default function MomentoCertoView({ premium }: { premium: boolean }) {
  const navigation = useNavigation<any>()
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it } as any)[language] || pt
  const [intention, setIntention] = useState<Intention>('amor')

  const INTENTIONS: { k: Intention; icon: string; label: string }[] = [
    { k: 'amor', icon: 'heart', label: tl('Amor', 'Love', 'Amor', 'Amore') },
    { k: 'carreira', icon: 'briefcase', label: tl('Carreira', 'Career', 'Carrera', 'Carriera') },
    { k: 'decisao', icon: 'compass', label: tl('Decisão', 'Decision', 'Decision', 'Decisione') },
    { k: 'conversa', icon: 'chatbubbles', label: tl('Conversa', 'Talk', 'Conversacion', 'Conversazione') },
  ]

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={s.hero}>
        <Text style={s.heroKicker}>⭐ {tl('MOMENTO CERTO', 'RIGHT MOMENT', 'MOMENTO JUSTO', 'MOMENTO GIUSTO')}</Text>
        <Text style={s.heroTitle}>{tl('Quando agir', 'When to act', 'Cuando actuar', 'Quando agire')}</Text>
        <Text style={s.heroSub}>{tl('Escolha uma intenção e veja as melhores janelas — dia e hora — em que o céu te apoia para aquilo.', 'Pick an intention and see the best windows — day and time — when the sky supports you for it.', 'Elige una intencion y ve las mejores ventanas — dia y hora — en que el cielo te apoya.', 'Scegli un\'intenzione e vedi le finestre migliori — giorno e ora — in cui il cielo ti sostiene.')}</Text>
      </View>

      <Text style={s.label}>{tl('Sua intenção', 'Your intention', 'Tu intencion', 'La tua intenzione')}</Text>
      <View style={s.grid}>
        {INTENTIONS.map((it) => {
          const on = intention === it.k
          return (
            <TouchableOpacity key={it.k} style={[s.card, on && s.cardOn]} activeOpacity={0.85} onPress={() => setIntention(it.k)}>
              <Ionicons name={it.icon as any} size={22} color={on ? '#0F0F23' : C.gold} />
              <Text style={[s.cardTx, on && s.cardTxOn]}>{it.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {premium ? (
        <View style={s.soon}>
          <Ionicons name="sparkles-outline" size={26} color={C.gold} />
          <Text style={s.soonTx}>{tl('Em breve: as melhores janelas para agir, calculadas do seu mapa.', 'Coming soon: the best windows to act, computed from your chart.', 'Pronto: las mejores ventanas para actuar, desde tu carta.', 'A breve: le migliori finestre per agire, dalla tua carta.')}</Text>
        </View>
      ) : (
        <TouchableOpacity style={s.paywall} activeOpacity={0.9} onPress={() => navigation.navigate('Premium', { openTab: 'features' })}>
          <Text style={s.paywallTitle}>{tl('Recurso Premium', 'Premium feature', 'Funcion Premium', 'Funzione Premium')}</Text>
          <Text style={s.paywallSub}>{tl('Descubra o momento certo para amor, carreira e decisões. Assine para desbloquear.', 'Discover the right moment for love, career and decisions. Subscribe to unlock.', 'Descubre el momento justo para amor, carrera y decisiones. Suscribete.', 'Scopri il momento giusto per amore, carriera e decisioni. Abbonati.')}</Text>
          <View style={s.paywallCta}><Text style={s.paywallCtaTx}>{tl('Ver planos', 'See plans', 'Ver planes', 'Vedi i piani')}</Text></View>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  hero: { marginBottom: 18 },
  heroKicker: { color: C.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  heroTitle: { color: C.tx, fontSize: 24, fontWeight: '900', marginTop: 4 },
  heroSub: { color: C.dim, fontSize: 14, lineHeight: 20, marginTop: 8 },
  label: { color: C.tx, fontSize: 14, fontWeight: '800', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 14 },
  cardOn: { backgroundColor: C.gold, borderColor: C.gold },
  cardTx: { color: C.tx, fontSize: 14.5, fontWeight: '700' },
  cardTxOn: { color: '#0F0F23', fontWeight: '800' },
  soon: { alignItems: 'center', gap: 10, backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.line, padding: 24, marginTop: 22 },
  soonTx: { color: C.dim, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  paywall: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,215,0,0.4)', padding: 20, marginTop: 22, alignItems: 'center' },
  paywallTitle: { color: C.gold, fontSize: 16, fontWeight: '900' },
  paywallSub: { color: C.dim, fontSize: 13.5, lineHeight: 19, textAlign: 'center', marginTop: 8 },
  paywallCta: { marginTop: 16, backgroundColor: C.gold, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 26 },
  paywallCtaTx: { color: '#0F0F23', fontWeight: '800', fontSize: 14 },
})
