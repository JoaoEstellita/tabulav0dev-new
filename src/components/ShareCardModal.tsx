// Card compartilhável (imagem) — o usuário escolhe "Mapa Natal" ou "Meu céu hoje",
// e compartilha um card branded via Share nativo. Captura a View com view-shot.
import React, { useState, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { captureRef } from 'react-native-view-shot'

const SIGN_GLYPH: Record<string, string> = {
  'aries': '♈', 'touro': '♉', 'gemeos': '♊', 'cancer': '♋', 'leao': '♌', 'virgem': '♍',
  'libra': '♎', 'escorpiao': '♏', 'sagitario': '♐', 'capricornio': '♑', 'aquario': '♒', 'peixes': '♓',
}
const glyph = (sign?: string) => {
  const k = String(sign || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  return SIGN_GLYPH[k] || '✦'
}

export type ShareCardData = {
  name?: string
  sunSign?: string
  ascSign?: string
  moonSign?: string
  score?: number | null
  levelLabel?: string | null
  focusArea?: string | null
  dateLabel?: string
}

interface ShareCardModalProps {
  visible: boolean
  onClose: () => void
  data: ShareCardData
  tl: (pt: string, en: string, es: string, it: string) => string
}

export default function ShareCardModal({ visible, onClose, data, tl }: ShareCardModalProps) {
  const [mode, setMode] = useState<'natal' | 'status'>('natal')
  const cardRef = useRef<View>(null)

  const share = useCallback(async () => {
    try {
      const uri = await captureRef(cardRef, { format: 'png', quality: 1, result: 'tmpfile' })
      const { Share } = await import('react-native')
      const message = mode === 'natal'
        ? tl('Meu Mapa Natal na Tábula Estelar ✦', 'My Natal Chart on Tábula Estelar ✦', 'Mi Carta Natal en Tábula Estelar ✦', 'La mia Carta Natale su Tábula Estelar ✦')
        : tl('Meu céu de hoje na Tábula Estelar ✦', 'My sky today on Tábula Estelar ✦', 'Mi cielo de hoy en Tábula Estelar ✦', 'Il mio cielo di oggi su Tábula Estelar ✦')
      await Share.share(Platform.OS === 'ios' ? { url: uri, message } : { message: `${message}\n`, url: uri })
    } catch (e) {
      console.warn('[share] falhou:', e)
      Alert.alert(tl('Erro', 'Error', 'Error', 'Errore'), tl('Não consegui compartilhar agora.', 'Could not share now.', 'No pude compartir ahora.', 'Non sono riuscito a condividere.'))
    }
  }, [mode, tl])

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Toggle Natal / Status */}
          <View style={styles.toggle}>
            <TouchableOpacity style={[styles.toggleBtn, mode === 'natal' && styles.toggleActive]} onPress={() => setMode('natal')}>
              <Text style={[styles.toggleText, mode === 'natal' && styles.toggleTextActive]}>{tl('Mapa Natal', 'Natal Chart', 'Carta Natal', 'Carta Natale')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleBtn, mode === 'status' && styles.toggleActive]} onPress={() => setMode('status')}>
              <Text style={[styles.toggleText, mode === 'status' && styles.toggleTextActive]}>{tl('Meu céu hoje', 'My sky today', 'Mi cielo hoy', 'Il mio cielo oggi')}</Text>
            </TouchableOpacity>
          </View>

          {/* O CARD (capturado) */}
          <View style={styles.cardWrap}>
            <View ref={cardRef} collapsable={false} style={styles.card}>
              <LinearGradient colors={['#1a1035', '#0F0F23', '#1a1a2e']} style={styles.cardBg}>
                <Text style={styles.brand}>✦ Tábula Estelar</Text>

                {mode === 'natal' ? (
                  <>
                    {data.name ? <Text style={styles.name}>{data.name}</Text> : null}
                    <Text style={styles.cardTitle}>{tl('Meu Mapa Natal', 'My Natal Chart', 'Mi Carta Natal', 'La mia Carta Natale')}</Text>
                    <View style={styles.chipsRow}>
                      <View style={styles.chip}>
                        <Text style={styles.chipGlyph}>☉ {glyph(data.sunSign)}</Text>
                        <Text style={styles.chipLabel}>{tl('Sol', 'Sun', 'Sol', 'Sole')}</Text>
                        <Text style={styles.chipSign}>{data.sunSign || '—'}</Text>
                      </View>
                      <View style={styles.chip}>
                        <Text style={styles.chipGlyph}>ASC {glyph(data.ascSign)}</Text>
                        <Text style={styles.chipLabel}>{tl('Ascendente', 'Rising', 'Ascendente', 'Ascendente')}</Text>
                        <Text style={styles.chipSign}>{data.ascSign || '—'}</Text>
                      </View>
                      <View style={styles.chip}>
                        <Text style={styles.chipGlyph}>☽ {glyph(data.moonSign)}</Text>
                        <Text style={styles.chipLabel}>{tl('Lua', 'Moon', 'Luna', 'Luna')}</Text>
                        <Text style={styles.chipSign}>{data.moonSign || '—'}</Text>
                      </View>
                    </View>
                    <Text style={styles.tagline}>{tl('Descubra o seu mapa completo', 'Discover your full chart', 'Descubre tu carta completa', 'Scopri la tua carta completa')}</Text>
                  </>
                ) : (
                  <>
                    {data.dateLabel ? <Text style={styles.name}>{data.dateLabel}</Text> : null}
                    <Text style={styles.cardTitle}>{tl('Meu céu hoje', 'My sky today', 'Mi cielo hoy', 'Il mio cielo oggi')}</Text>
                    {typeof data.score === 'number' ? (
                      <View style={styles.scoreWrap}>
                        <Text style={styles.scoreNum}>{Math.round(data.score)}</Text>
                        <Text style={styles.scoreMax}>/100</Text>
                      </View>
                    ) : null}
                    {data.levelLabel ? <Text style={styles.level}>{data.levelLabel}</Text> : null}
                    {data.focusArea ? <Text style={styles.focus}>{tl('Área em foco', 'Focus area', 'Área en foco', 'Area in focus')}: {data.focusArea}</Text> : null}
                    <Text style={styles.skyLine}>☉ {glyph(data.sunSign)}   ASC {glyph(data.ascSign)}   ☽ {glyph(data.moonSign)}</Text>
                    <Text style={styles.tagline}>{tl('Veja o seu céu de hoje', 'See your sky today', 'Mira tu cielo de hoy', 'Guarda il tuo cielo di oggi')}</Text>
                  </>
                )}
                <Text style={styles.footer}>tabulaestelar</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Ações */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>{tl('Fechar', 'Close', 'Cerrar', 'Chiudi')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} onPress={share} activeOpacity={0.85}>
              <Ionicons name="share-social" size={18} color="#1A1A1A" />
              <Text style={styles.shareText}>{tl('Compartilhar', 'Share', 'Compartir', 'Condividi')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  sheet: { width: '100%', maxWidth: 420, alignItems: 'center' },
  toggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 22, padding: 3, marginBottom: 14 },
  toggleBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  toggleActive: { backgroundColor: '#FFD700' },
  toggleText: { color: '#C9C9D6', fontSize: 13, fontWeight: '700' },
  toggleTextActive: { color: '#1A1A1A' },
  cardWrap: { borderRadius: 20, overflow: 'hidden' },
  card: { width: 320, height: 400 },
  cardBg: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)', borderRadius: 20 },
  brand: { position: 'absolute', top: 18, color: '#FFD700', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  name: { color: '#E9D9A0', fontSize: 14, fontWeight: '600', marginBottom: 2, textAlign: 'center' },
  cardTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginBottom: 18, textAlign: 'center' },
  chipsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  chip: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 10, minWidth: 84 },
  chipGlyph: { color: '#FFD700', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  chipLabel: { color: '#9A9CB8', fontSize: 10, marginBottom: 2 },
  chipSign: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  tagline: { color: '#C9C9D6', fontSize: 13, textAlign: 'center', marginTop: 4 },
  scoreWrap: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 },
  scoreNum: { color: '#FFD700', fontSize: 56, fontWeight: '900', lineHeight: 60 },
  scoreMax: { color: '#9A9CB8', fontSize: 18, fontWeight: '700', marginBottom: 8, marginLeft: 2 },
  level: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  focus: { color: '#E9D9A0', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  skyLine: { color: '#FFD700', fontSize: 18, fontWeight: '700', marginBottom: 14, letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 16, color: '#8A8AA0', fontSize: 12, letterSpacing: 1 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  closeBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.08)' },
  closeText: { color: '#C9C9D6', fontSize: 14, fontWeight: '700' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 22, backgroundColor: '#FFD700' },
  shareText: { color: '#1A1A1A', fontSize: 14, fontWeight: '800' },
})
