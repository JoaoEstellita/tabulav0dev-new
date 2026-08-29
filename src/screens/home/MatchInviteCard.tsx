import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { getMyProfile } from '../../services/DiscoveryService'

const DISMISS_KEY = 'match_invite_dismissed_v1'
const C = { card: '#1c1c34', line: '#3a2a44', magenta: '#d6409f', gold: '#e8b84b', tx: '#eaeaf5', dim: '#8892a4' }

/**
 * Convite proativo (Home) pra completar o perfil do Match — aparece só pra quem
 * NÃO preencheu (foto/gênero/preferência) e não dispensou. Fecha a lacuna de o
 * Match ser só reativo (ao abrir a aba).
 */
export default function MatchInviteCard() {
  const navigation = useNavigation<any>()
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it }[language as string] || pt)
  const [show, setShow] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const dismissed = await AsyncStorage.getItem(DISMISS_KEY)
        if (dismissed) return
        const r = await getMyProfile()
        if (r.gated) return // não-assinante nem vê (paywall cuida)
        const p: any = r.profile
        const incompleto = !((p?.photos && p.photos.length) || p?.photoURL) || !p?.gender || !p?.seeking
        if (alive && incompleto) setShow(true)
      } catch { /* silencioso */ }
    })()
    return () => { alive = false }
  }, [])

  const dismiss = () => { setShow(false); AsyncStorage.setItem(DISMISS_KEY, '1').catch(() => {}) }

  if (!show) return null
  return (
    <View style={s.card}>
      <View style={s.icon}><Ionicons name="heart" size={20} color="#fff" /></View>
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{tl('Descubra com quem você combina', 'Discover who matches you', 'Descubre con quien combinas', 'Scopri con chi combini')}</Text>
        <Text style={s.sub}>{tl('Complete seu perfil no Match e comece a dar match.', 'Complete your Match profile and start matching.', 'Completa tu perfil en Match y empieza.', 'Completa il profilo su Match e inizia.')}</Text>
        <TouchableOpacity style={s.cta} onPress={() => { dismiss(); navigation.navigate('Network') }} activeOpacity={0.9}>
          <Text style={s.ctaTx}>{tl('Completar meu perfil', 'Complete my profile', 'Completar mi perfil', 'Completa il profilo')}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={dismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}><Ionicons name="close" size={18} color={C.dim} /></TouchableOpacity>
    </View>
  )
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 14, marginHorizontal: 16, marginBottom: 12 },
  icon: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.magenta, alignItems: 'center', justifyContent: 'center' },
  title: { color: C.tx, fontSize: 15, fontWeight: '800' },
  sub: { color: C.dim, fontSize: 13, marginTop: 3, lineHeight: 18 },
  cta: { alignSelf: 'flex-start', marginTop: 10, backgroundColor: C.gold, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 9 },
  ctaTx: { color: '#1a1400', fontSize: 13, fontWeight: '800' },
})
