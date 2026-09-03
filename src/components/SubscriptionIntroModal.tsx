import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAppLanguage } from '../hooks/useAppLanguage'

/**
 * Upsell mostrado UMA vez para o novo usuário (após o cadastro), no pico de
 * interesse. Destaca os benefícios das assinaturas — em especial a IA no WhatsApp —
 * e leva para a tela de planos. Não bloqueia: "Agora não" fecha e não repete.
 */
const C = { bg: '#0F0F23', card: '#1b1740', line: 'rgba(255,255,255,.12)', tx: '#efedfb', dim: '#a7a2c9', gold: '#f5c542', magenta: '#e879f9', indigo: '#8b7cf6' }

export default function SubscriptionIntroModal({ visible, onClose, onSeePlans }: {
  visible: boolean
  onClose: () => void
  onSeePlans: () => void
}) {
  const { language } = useAppLanguage()
  const lang = language as 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
  const tl = (pt: string, en: string, es: string, it: string) => ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it }[lang] || pt)

  const feats = [
    { i: 'logo-whatsapp', t: tl('Astrólogo IA no WhatsApp', 'AI astrologer on WhatsApp', 'Astrólogo IA en WhatsApp', 'Astrologo IA su WhatsApp'), s: tl('Pergunte qualquer coisa e receba a leitura do SEU mapa, na conversa.', 'Ask anything and get a reading of YOUR chart, in the chat.', 'Pregunta lo que sea y recibe la lectura de TU carta, en el chat.', 'Chiedi qualsiasi cosa e ricevi la lettura della TUA carta, in chat.') },
    { i: 'planet', t: tl('Leituras premium do seu mapa', 'Premium readings of your chart', 'Lecturas premium de tu carta', 'Letture premium della tua carta'), s: tl('Mapa, trânsitos e sinastria interpretados pela IA.', 'Chart, transits and synastry interpreted by AI.', 'Carta, tránsitos y sinastría interpretados por la IA.', 'Carta, transiti e sinastria interpretati dall\'IA.') },
    { i: 'calendar', t: tl('Previsões estendidas', 'Extended forecasts', 'Previsiones extendidas', 'Previsioni estese'), s: tl('Veja os melhores dias com semanas ou meses de antecedência.', 'See your best days weeks or months ahead.', 'Ve tus mejores días con semanas o meses de antelación.', 'Vedi i giorni migliori con settimane o mesi di anticipo.') },
    { i: 'heart', t: tl('Sinastria e Match completos', 'Full synastry and Match', 'Sinastría y Match completos', 'Sinastria e Match completi'), s: tl('Descubra com quem você mais combina e a leitura da dupla.', 'Find who you match with and the pair reading.', 'Descubre con quién combinas y la lectura de la pareja.', 'Scopri con chi combini e la lettura della coppia.') },
  ]

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.back}>
        <View style={s.sheet}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
            <View style={s.kickerRow}>
              <Text style={s.kicker}>✨ {tl('BEM-VINDO', 'WELCOME', 'BIENVENIDO', 'BENVENUTO')}</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><Ionicons name="close" size={24} color={C.dim} /></TouchableOpacity>
            </View>
            <Text style={s.title}>{tl('Desbloqueie o Tábula completo', 'Unlock the full Tábula', 'Desbloquea el Tábula completo', 'Sblocca il Tábula completo')} 🌙</Text>
            <Text style={s.sub}>{tl('Seu mapa já está aqui. Com a assinatura, ele ganha vida — com um astrólogo com IA no seu WhatsApp.', 'Your chart is here. With a plan it comes alive — with an AI astrologer on your WhatsApp.', 'Tu carta ya está aquí. Con la suscripción cobra vida — con un astrólogo IA en tu WhatsApp.', 'La tua carta è qui. Con l\'abbonamento prende vita — con un astrologo IA sul tuo WhatsApp.')}</Text>

            <View style={{ gap: 12, marginTop: 18 }}>
              {feats.map((f, i) => (
                <View key={i} style={s.feat}>
                  <View style={s.ico}><Ionicons name={f.i as any} size={19} color={C.gold} /></View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={s.featT}>{f.t}</Text>
                    <Text style={s.featS}>{f.s}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Text style={s.trial}>🎁 {tl('Comece com 3 dias grátis. Cancele quando quiser.', 'Start with 3 days free. Cancel anytime.', 'Empieza con 3 días gratis. Cancela cuando quieras.', 'Inizia con 3 giorni gratis. Disdici quando vuoi.')}</Text>

            <TouchableOpacity style={s.cta} activeOpacity={0.9} onPress={onSeePlans}>
              <Text style={s.ctaTx}>{tl('Ver planos', 'See plans', 'Ver planes', 'Vedi i piani')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.ghost} activeOpacity={0.8} onPress={onClose}>
              <Text style={s.ghostTx}>{tl('Agora não', 'Not now', 'Ahora no', 'Non ora')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  back: { flex: 1, backgroundColor: 'rgba(8,6,18,.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22, borderWidth: 1, borderColor: C.line, padding: 20, paddingBottom: 30, maxHeight: '90%' },
  kickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { color: C.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.tx, fontSize: 23, fontWeight: '900', marginTop: 8 },
  sub: { color: C.dim, fontSize: 14, lineHeight: 20, marginTop: 8 },
  feat: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 13 },
  ico: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(245,197,66,.14)', alignItems: 'center', justifyContent: 'center' },
  featT: { color: C.tx, fontSize: 14.5, fontWeight: '800' },
  featS: { color: C.dim, fontSize: 12.5, lineHeight: 17, marginTop: 2 },
  trial: { color: C.magenta, fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: 18 },
  cta: { backgroundColor: C.gold, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 14 },
  ctaTx: { color: '#0F0F23', fontSize: 16, fontWeight: '900' },
  ghost: { paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  ghostTx: { color: C.dim, fontSize: 14, fontWeight: '600' },
})
