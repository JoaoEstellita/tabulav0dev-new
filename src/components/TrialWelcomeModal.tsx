import React, { useEffect, useState } from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { useSubscriptionCheck } from '../hooks/useSubscriptionCheck'
import { useAppLanguage } from '../hooks/useAppLanguage'

// Boas-vindas do TRIAL no 1º acesso: em vez do "cadeado surpresa" (a pessoa
// descobre o limite batendo nele), explica DESDE JÁ o que é grátis nos 3 dias e
// o que a assinatura destrava. Mostra UMA vez por usuário (flag AsyncStorage).

const SEEN_KEY = 'trial_welcome_seen_v1'

export default function TrialWelcomeModal() {
  const navigation = useNavigation<any>()
  const { language } = useAppLanguage()
  const { loading, trialActive, trialEndsAt, subscription, isAdmin } = useSubscriptionCheck()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const [visible, setVisible] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(SEEN_KEY).then((v) => setChecked(!v)).catch(() => setChecked(true))
  }, [])

  useEffect(() => {
    if (!checked || loading) return
    // Só quem está no trial (não assina, não admin) e ainda não viu.
    if (trialActive && !subscription?.active && !isAdmin) {
      const t = setTimeout(() => setVisible(true), 700)
      return () => clearTimeout(t)
    }
  }, [checked, loading, trialActive, subscription?.active, isAdmin])

  const close = () => {
    setVisible(false)
    AsyncStorage.setItem(SEEN_KEY, '1').catch(() => {})
  }
  const goPremium = () => {
    close()
    navigation.navigate('Premium', { openTab: 'features' })
  }

  if (!visible) return null
  const restam = trialEndsAt ? Math.max(1, Math.ceil((trialEndsAt.getTime() - Date.now()) / 86_400_000)) : 3

  const Free = ({ children }: { children: string }) => (
    <View style={s.row}><Ionicons name="checkmark-circle" size={18} color="#46d39a" /><Text style={s.rowText}>{children}</Text></View>
  )
  const Paid = ({ children }: { children: string }) => (
    <View style={s.row}><Ionicons name="lock-closed" size={16} color="#FFD700" /><Text style={s.rowText}>{children}</Text></View>
  )

  return (
    <Modal transparent visible animationType="fade" onRequestClose={close}>
      <View style={s.backdrop}>
        <View style={s.card}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={s.emoji}>🌙</Text>
            <Text style={s.title}>{tl(`Bem-vindo(a)! Você tem ${restam} dias grátis`, `Welcome! You have ${restam} free days`, `Bienvenido(a)! Tienes ${restam} dias gratis`, `Benvenuto(a)! Hai ${restam} giorni gratis`)}</Text>
            <Text style={s.sub}>{tl('Explore à vontade nesses dias — sem cartão, sem pegadinha.', 'Explore freely these days — no card, no catch.', 'Explora libremente estos dias — sin tarjeta, sin trampa.', 'Esplora liberamente in questi giorni — senza carta, senza trucchi.')}</Text>

            <Text style={s.groupTitle}>{tl('Grátis agora', 'Free now', 'Gratis ahora', 'Gratis ora')}</Text>
            <Free>{tl('Seu mapa natal completo — Ocidental, Védico, Tzolkin e Chinês', 'Your full natal chart — Western, Vedic, Tzolkin and Chinese', 'Tu carta natal completa — Occidental, Vedica, Tzolkin y China', 'La tua carta natale completa — Occidentale, Vedica, Tzolkin e Cinese')}</Free>
            <Free>{tl('Os trânsitos do seu dia', "Your day's transits", 'Los transitos de tu dia', 'I transiti del tuo giorno')}</Free>
            <Free>{tl('As 8 áreas da sua vida', 'The 8 areas of your life', 'Las 8 areas de tu vida', 'Le 8 aree della tua vita')}</Free>

            <Text style={s.groupTitle}>{tl('Destrava com a assinatura', 'Unlocks with a plan', 'Se desbloquea con el plan', 'Si sblocca con l abbonamento')}</Text>
            <Paid>{tl('Previsões — o que vem pela frente (30/90/360 dias)', 'Forecasts — what lies ahead (30/90/360 days)', 'Previsiones — lo que viene (30/90/360 dias)', 'Previsioni — cosa arriva (30/90/360 giorni)')}</Paid>
            <Paid>{tl('Sinastria — a compatibilidade com quem você ama', 'Synastry — compatibility with those you love', 'Sinastria — compatibilidad con quien amas', 'Sinastria — compatibilita con chi ami')}</Paid>
            <Paid>{tl('Grupos e perfis pra acompanhar quem você ama', 'Groups and profiles to follow your loved ones', 'Grupos y perfiles para seguir a los tuyos', 'Gruppi e profili per seguire i tuoi cari')}</Paid>
            <Paid>{tl('Momento Certo, Astrocartografia, Retorno Solar e Lunar', 'Right Moment, Astrocartography, Solar and Lunar Return', 'Momento Justo, Astrocartografia, Retorno Solar y Lunar', 'Momento Giusto, Astrocartografia, Ritorno Solare e Lunare')}</Paid>
            <Paid>{tl('E eu te acompanhando todo dia', 'And me by your side every day', 'Y yo acompanandote cada dia', 'E io al tuo fianco ogni giorno')}</Paid>

            <TouchableOpacity style={s.cta} activeOpacity={0.9} onPress={goPremium}>
              <Text style={s.ctaText}>{tl('Ver planos', 'See plans', 'Ver planes', 'Vedi i piani')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={close} style={s.later}>
              <Text style={s.laterText}>{tl('Explorar agora', 'Explore now', 'Explorar ahora', 'Esplora ora')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(6,6,16,0.75)', alignItems: 'center', justifyContent: 'center', padding: 22 },
  card: { width: '100%', maxWidth: 400, maxHeight: '86%', backgroundColor: '#161728', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,215,0,0.25)', padding: 22 },
  emoji: { fontSize: 38, textAlign: 'center' },
  title: { color: '#EDEBF7', fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: 6 },
  sub: { color: '#9A9CB8', fontSize: 14, textAlign: 'center', marginTop: 6, marginBottom: 16, lineHeight: 20 },
  groupTitle: { color: '#C7BCFF', fontSize: 12, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 14, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginBottom: 8 },
  rowText: { color: '#D8D9EC', fontSize: 14, lineHeight: 20, flex: 1 },
  cta: { backgroundColor: '#FFD700', paddingVertical: 13, borderRadius: 12, marginTop: 20, alignItems: 'center' },
  ctaText: { color: '#0F0F23', fontSize: 16, fontWeight: '800' },
  later: { marginTop: 10, padding: 8, alignItems: 'center' },
  laterText: { color: '#9A9CB8', fontSize: 14, fontWeight: '600' },
})
