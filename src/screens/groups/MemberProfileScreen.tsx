/**
 * Mapa completo de um membro do grupo — roda + interpretações natais + Védico,
 * com um atalho para os trânsitos dele. Reusa os mesmos componentes do perfil
 * próprio (NatalChartWheelContent / AstroProfileContent / VedicProfileContent),
 * alimentados pela carta do amigo (computada de member.birthData SEM cache, sem
 * escrever nada no doc dele). Privacidade: só chega aqui quem já compartilhou o
 * nascimento no grupo (o botão de entrada é gated por birthData presente).
 */
import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { LocalAstrologyService, type LocalTransitData } from '../../services/astrology/LocalAstrologyService'
import { NatalChartWheelContent } from '../cosmos/NatalChartWheelScreen'
import { AstroProfileContent } from '../cosmos/AstroProfileScreen'
import { VedicProfileContent } from '../cosmos/VedicProfileContent'
import StarLoader from '../../components/StarLoader'

type SlimMember = {
  displayName?: string
  profilePhoto?: string
  birthData?: { datetime?: string; coordinates?: { latitude: number; longitude: number } }
}

export default function MemberProfileScreen() {
  const route = useRoute()
  const navigation = useNavigation<any>()
  const { language } = useAppLanguage()
  const member = (route.params as any)?.member as SlimMember | undefined
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const birth = member?.birthData
  const [data, setData] = useState<LocalTransitData | null>(null)
  const [loading, setLoading] = useState(true)

  const chartMeta = useMemo(() => {
    const bd = LocalAstrologyService.birthDataFromShared(birth)
    return { skipSelfFetch: true as const, birthDate: bd?.birthDate, birthTime: bd?.birthTime }
  }, [birth?.datetime])

  useEffect(() => {
    let cancel = false
    setLoading(true)
    const bd = LocalAstrologyService.birthDataFromShared(birth)
    if (!bd) { setLoading(false); return () => { cancel = true } }
    LocalAstrologyService.computeChartNoCache(bd)
      .then((d) => { if (!cancel) { setData(d); setLoading(false) } })
      .catch(() => { if (!cancel) setLoading(false) })
    return () => { cancel = true }
  }, [birth?.datetime])

  const firstName = member?.displayName ? String(member.displayName).split(' ')[0] : tl('o amigo', 'friend', 'el amigo', "l'amico")

  useEffect(() => {
    const t = member?.displayName
      ? tl(`Mapa de ${firstName}`, `${firstName}'s chart`, `Mapa de ${firstName}`, `Mappa di ${firstName}`)
      : tl('Mapa do membro', 'Member chart', 'Mapa del miembro', 'Mappa del membro')
    navigation.setOptions?.({ title: t })
  }, [member?.displayName, language])

  if (!birth?.datetime || !birth?.coordinates) {
    return (
      <LinearGradient colors={['#0F0F23', '#1a1a2e']} style={styles.fill}>
        <View style={styles.center}>
          <Text style={styles.msg}>
            {tl('Este membro ainda não compartilhou o mapa de nascimento.',
              'This member has not shared their birth chart yet.',
              'Este miembro aún no compartió su mapa natal.',
              'Questo membro non ha ancora condiviso la mappa natale.')}
          </Text>
        </View>
      </LinearGradient>
    )
  }

  const natalAscDeg = data?.currentTransits?.natalAscendant ?? 0

  return (
    <LinearGradient colors={['#0F0F23', '#1a1a2e']} style={styles.fill}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          {member?.profilePhoto
            ? <Image source={{ uri: member.profilePhoto }} style={styles.avatar} />
            : <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.avatarInitial}>{(firstName[0] || '?').toUpperCase()}</Text></View>}
          <Text style={styles.name}>{member?.displayName || firstName}</Text>
        </View>

        {loading || !data ? (
          <View style={styles.center}><StarLoader /></View>
        ) : (
          <>
            <TouchableOpacity style={styles.transitBtn} activeOpacity={0.85} onPress={() => navigation.navigate('PersonalTransits', { member })}>
              <Ionicons name="planet-outline" size={18} color="#0F0F23" />
              <Text style={styles.transitBtnText}>{tl(`Trânsitos de ${firstName}`, `${firstName}'s transits`, `Tránsitos de ${firstName}`, `Transiti di ${firstName}`)}</Text>
              <Ionicons name="chevron-forward" size={16} color="#0F0F23" />
            </TouchableOpacity>

            <NatalChartWheelContent transitData={data} loading={false} showLegend={false} chartMeta={{ skipSelfFetch: true }} />
            <AstroProfileContent transitData={data} loading={false} chartMeta={chartMeta} />
            <VedicProfileContent transitData={data} loading={false} natalAscDeg={natalAscDeg} chartMeta={chartMeta} />
          </>
        )}
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  msg: { color: '#C8CDE8', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.08)' },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: '#FFD700', fontSize: 20, fontWeight: '700' },
  name: { color: '#F8FAFC', fontSize: 20, fontWeight: '700', flex: 1 },
  transitBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
    backgroundColor: '#FFD700', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16,
  },
  transitBtnText: { color: '#0F0F23', fontSize: 14, fontWeight: '700' },
})
