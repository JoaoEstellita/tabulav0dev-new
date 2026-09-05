import React, { useEffect, useState } from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { subscribePwaInstall, promptInstall, type PwaInstallState } from '../utils/pwaInstall'
import { useAppLanguage } from '../hooks/useAppLanguage'

// Modal de boas-vindas no 1º acesso pelo NAVEGADOR, convidando a instalar o PWA
// (adicionar à tela inicial). Android: botão que dispara o prompt nativo. iOS:
// passo-a-passo (Apple não deixa forçar). Só na web mobile, não instalado, e não
// mostra de novo por 14 dias após dispensar. Nunca aparece no app nativo.

const DISMISS_KEY = 'pwa_install_modal_dismissed_at_v1'
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000

export default function PWAInstallModal() {
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const [pwa, setPwa] = useState<PwaInstallState | null>(null)
  const [visible, setVisible] = useState(false)
  const [checkedSnooze, setCheckedSnooze] = useState(false)

  useEffect(() => {
    if (Platform.OS !== 'web') return
    const unsub = subscribePwaInstall((s) => setPwa(s))
    AsyncStorage.getItem(DISMISS_KEY)
      .then((v) => {
        const at = Number(v || 0)
        if (!at || Date.now() - at > SNOOZE_MS) setCheckedSnooze(true)
      })
      .catch(() => setCheckedSnooze(true))
    return unsub
  }, [])

  useEffect(() => {
    if (Platform.OS !== 'web' || !checkedSnooze || !pwa) return
    // Só em mobile-web, não instalado, e (Android com prompt pronto OU iOS com passo-a-passo).
    const eligible = pwa.isMobile && !pwa.isInstalled && (pwa.canInstall || pwa.isIos)
    if (eligible) {
      const t = setTimeout(() => setVisible(true), 900) // deixa a tela carregar antes
      return () => clearTimeout(t)
    }
  }, [checkedSnooze, pwa])

  const dismiss = () => {
    setVisible(false)
    AsyncStorage.setItem(DISMISS_KEY, String(Date.now())).catch(() => {})
  }

  const onInstall = async () => {
    if (pwa?.isIos) return // iOS: só mostra o passo-a-passo, sem prompt programático
    const choice = await promptInstall()
    if (choice) dismiss()
  }

  if (Platform.OS !== 'web' || !visible || !pwa) return null

  return (
    <Modal transparent visible animationType="fade" onRequestClose={dismiss}>
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.emoji}>🌙</Text>
          <Text style={s.title}>{tl('Instale a Tábula Estelar', 'Install Tábula Estelar', 'Instala Tabula Estelar', 'Installa Tabula Estelar')}</Text>
          <Text style={s.body}>
            {tl(
              'Tenha seu mapa, os trânsitos do dia e o astrólogo sempre à mão — direto na tela inicial, como um app.',
              'Keep your chart, today\'s transits and the astrologer always at hand — right on your home screen, like an app.',
              'Ten tu mapa, los transitos del dia y el astrologo siempre a mano — en tu pantalla de inicio, como una app.',
              'Tieni la tua mappa, i transiti del giorno e l astrologo sempre a portata — sulla schermata home, come un\'app.',
            )}
          </Text>

          {pwa.isIos ? (
            <View style={s.iosSteps}>
              <View style={s.iosStep}>
                <Ionicons name="share-outline" size={20} color="#FFD700" />
                <Text style={s.iosText}>{tl('1. Toque em Compartilhar', '1. Tap Share', '1. Toca Compartir', '1. Tocca Condividi')}</Text>
              </View>
              <View style={s.iosStep}>
                <Ionicons name="add-circle-outline" size={20} color="#FFD700" />
                <Text style={s.iosText}>{tl('2. Toque em "Adicionar à Tela de Início"', '2. Tap "Add to Home Screen"', '2. Toca "Anadir a pantalla de inicio"', '2. Tocca "Aggiungi a Home"')}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={s.cta} activeOpacity={0.9} onPress={onInstall}>
              <Ionicons name="download-outline" size={18} color="#0F0F23" />
              <Text style={s.ctaText}>{tl('Instalar app', 'Install app', 'Instalar app', 'Installa app')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={dismiss} style={s.later}>
            <Text style={s.laterText}>{tl('Agora não', 'Not now', 'Ahora no', 'Non ora')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(6,6,16,0.72)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 380, backgroundColor: '#161728', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,215,0,0.25)', padding: 24, alignItems: 'center' },
  emoji: { fontSize: 40, marginBottom: 6 },
  title: { color: '#EDEBF7', fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  body: { color: '#C9CBE0', fontSize: 14.5, lineHeight: 21, textAlign: 'center', marginBottom: 18 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFD700', paddingVertical: 13, paddingHorizontal: 26, borderRadius: 12, width: '100%', justifyContent: 'center' },
  ctaText: { color: '#0F0F23', fontSize: 16, fontWeight: '800' },
  iosSteps: { width: '100%', gap: 12, marginBottom: 4 },
  iosStep: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#1E2038', borderRadius: 12, padding: 12 },
  iosText: { color: '#EDEBF7', fontSize: 14, flex: 1 },
  later: { marginTop: 16, padding: 8 },
  laterText: { color: '#9A9CB8', fontSize: 14, fontWeight: '600' },
})
