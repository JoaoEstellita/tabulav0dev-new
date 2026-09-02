/**
 * Mapa completo de um membro do grupo — roda + interpretações natais + Védico,
 * com um atalho para os trânsitos dele. Reusa os mesmos componentes do perfil
 * próprio (NatalChartWheelContent / AstroProfileContent / VedicProfileContent),
 * alimentados pela carta do amigo (computada de member.birthData SEM cache, sem
 * escrever nada no doc dele). Privacidade: só chega aqui quem já compartilhou o
 * nascimento no grupo (o botão de entrada é gated por birthData presente).
 */
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { LocalAstrologyService, type LocalTransitData } from '../../services/astrology/LocalAstrologyService'
import { NatalChartWheelContent } from '../cosmos/NatalChartWheelScreen'
import { AstroProfileContent } from '../cosmos/AstroProfileScreen'
import { VedicProfileContent } from '../cosmos/VedicProfileContent'
import TzolkinProfileContent from '../cosmos/TzolkinProfileContent'
import ChineseProfileContent from '../cosmos/ChineseProfileContent'
import TzolkinMatchView from '../cosmos/TzolkinMatchView'
import ChineseMatchView from '../cosmos/ChineseMatchView'
import VedicMatchView from '../cosmos/VedicMatchView'
import SynastryTabs from '../../components/SynastryTabs'
import { useAuth } from '../../hooks/useAuth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { computeSynastryAspects, computeNatalChart, type SynastryAspect, type NatalChart } from '../../astro/synastry'
import { synastryScore, synastryAspectLine } from '../../astro/synastryReading'

const TZOLKIN_ENABLED = process.env.EXPO_PUBLIC_TZOLKIN_ENABLED !== '0'
const CHINESE_ENABLED = process.env.EXPO_PUBLIC_CHINESE_ENABLED !== '0'
const VEDIC_ENABLED = process.env.EXPO_PUBLIC_VEDIC_ENABLED !== '0'
import PersonalTransitsScreen from '../transits/PersonalTransitsScreen'
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
  const { user } = useAuth()
  const [viewerBirth, setViewerBirth] = useState<string | undefined>()
  // Nascimento COMPLETO do viewer (p/ sinastrias Chinês/Védico): data+hora+long.+Lua tropical.
  const [viewerFull, setViewerFull] = useState<{ birthDate?: string; birthTime?: string; longitude?: number; moonLon?: number } | null>(null)
  const [synAspects, setSynAspects] = useState<SynastryAspect[] | null>(null)
  useEffect(() => {
    if (!user?.uid) return
    getDoc(doc(db, 'users', user.uid)).then(async (sn) => {
      const d = sn.data() || {}
      setViewerBirth(d.birthDate)
      // Sinastria astral: precisa da carta COMPLETA do viewer (data+hora+local) e do membro.
      const loc = d.birthLocation || d.birthData?.birthLocation
      const mb = member?.birthData
      if (!d.birthDate || !loc?.latitude || !mb?.datetime || !mb?.coordinates) { setSynAspects(null); return }
      const mineBirth = { datetime: `${d.birthDate}T${d.birthTime || '12:00'}:00`, coordinates: { latitude: loc.latitude, longitude: loc.longitude } }
      try {
        const [mine, theirs] = await Promise.all([computeNatalChart(mineBirth), computeNatalChart(mb)])
        if (mine && theirs) setSynAspects(computeSynastryAspects(mine.planets, theirs.planets, 20))
        else setSynAspects(null)
        const myMoon = (mine?.planets || []).find((p: any) => p.name === 'Moon' || p.name === 'Lua')
        setViewerFull({ birthDate: d.birthDate, birthTime: d.birthTime, longitude: loc.longitude, moonLon: typeof myMoon?.longitude === 'number' ? myMoon.longitude : undefined })
      } catch { setSynAspects(null) }
    }).catch(() => { })
  }, [user?.uid, member?.birthData?.datetime])
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const birth = member?.birthData
  const [data, setData] = useState<LocalTransitData | null>(null)
  const [loading, setLoading] = useState(true)
  const [westMode, setWestMode] = useState<'natal' | 'transitos' | 'solar' | 'lunar' | 'vedico' | 'tzolkin' | 'chines'>('natal')
  // Retorno Solar do membro (no local de NASCIMENTO dele — não temos onde ele mora).
  const [srData, setSrData] = useState<any>(null)
  const [srLoading, setSrLoading] = useState(false)
  const [srMoment, setSrMoment] = useState<Date | null>(null)
  const [srError, setSrError] = useState(false)
  // Sol natal como primitivo estável (evita loop de cancel/restart do effect).
  const srSunLon = useMemo(() => {
    const s = ((data as any)?.currentTransits?.natalPlanets || []).find((p: any) => p?.name === 'Sun')
    return typeof s?.longitude === 'number' ? s.longitude : null
  }, [data])
  const srLat = birth?.coordinates?.latitude
  const srLon = birth?.coordinates?.longitude
  const srRunRef = useRef(false)
  useEffect(() => {
    if (westMode !== 'solar') return
    if (srSunLon == null || !Number.isFinite(srLat) || !Number.isFinite(srLon)) return
    if (srRunRef.current) return
    srRunRef.current = true
    let cancelled = false
    const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T> =>
      Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))])
    ;(async () => {
      setSrLoading(true); setSrError(false)
      try {
        const { LocalAstrologyService } = await import('../../services/astrology/LocalAstrologyService')
        const { data: sr, moment } = await withTimeout(
          LocalAstrologyService.computeSolarReturn(srSunLon, { latitude: srLat as number, longitude: srLon as number }),
          20000,
        )
        if (!cancelled) { setSrData(sr); setSrMoment(moment) }
      } catch (e) { console.warn('[SR-member] erro:', e); if (!cancelled) { setSrError(true); srRunRef.current = false } }
      finally { if (!cancelled) setSrLoading(false) }
    })()
    return () => { cancelled = true }
  }, [westMode, srSunLon, srLat, srLon])

  // Retorno Lunar do membro (mesma mecânica, Lua natal).
  const [lrData, setLrData] = useState<any>(null)
  const [lrLoading, setLrLoading] = useState(false)
  const [lrMoment, setLrMoment] = useState<Date | null>(null)
  const [lrError, setLrError] = useState(false)
  const lrMoonLon = useMemo(() => {
    const m = ((data as any)?.currentTransits?.natalPlanets || []).find((p: any) => p?.name === 'Moon')
    return typeof m?.longitude === 'number' ? m.longitude : null
  }, [data])
  const lrRunRef = useRef(false)
  useEffect(() => {
    if (westMode !== 'lunar') return
    if (lrMoonLon == null || !Number.isFinite(srLat) || !Number.isFinite(srLon)) return
    if (lrRunRef.current) return
    lrRunRef.current = true
    let cancelled = false
    const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T> =>
      Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))])
    ;(async () => {
      setLrLoading(true); setLrError(false)
      try {
        const { LocalAstrologyService } = await import('../../services/astrology/LocalAstrologyService')
        const { data: lr, moment } = await withTimeout(
          LocalAstrologyService.computeLunarReturn(lrMoonLon, { latitude: srLat as number, longitude: srLon as number }),
          20000,
        )
        if (!cancelled) { setLrData(lr); setLrMoment(moment) }
      } catch (e) { console.warn('[LR-member] erro:', e); if (!cancelled) { setLrError(true); lrRunRef.current = false } }
      finally { if (!cancelled) setLrLoading(false) }
    })()
    return () => { cancelled = true }
  }, [westMode, lrMoonLon, srLat, srLon])

  // Grade clicável → rola até a leitura do planeta no perfil abaixo (measureLayout,
  // robusto web+APK). Mesmo mecanismo da aba Mapa e da Home.
  const scrollRef = useRef<ScrollView>(null)
  const anchorsRef = useRef<Record<string, any>>({})
  const registerAnchor = useCallback((key: string, node: any) => {
    if (node) anchorsRef.current[key] = node
    else delete anchorsRef.current[key]
  }, [])
  const scrollToAnchor = useCallback((key: string) => {
    const node = anchorsRef.current[key]
    const scroll = scrollRef.current as any
    if (!node || !scroll) return
    try {
      const scrollNode = scroll.getScrollableNode ? scroll.getScrollableNode() : scroll
      node.measureLayout(scrollNode, (_x: number, y: number) => scroll.scrollTo({ y: Math.max(0, y - 12), animated: true }), () => { })
    } catch { }
  }, [])
  // O AstroProfileContent registra as âncoras como 'planet:Sun' (EN capitalizado).
  const PERSONAL_SET = useRef(new Set(['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'])).current
  const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)
  const handleSelectNatalAspect = useCallback((a: { planet1: string; planet2: string; type: string }) => {
    if (!a) return
    const target = PERSONAL_SET.has(a.planet1) ? a.planet1 : PERSONAL_SET.has(a.planet2) ? a.planet2 : a.planet1
    scrollToAnchor(`planet:${target}`)
  }, [scrollToAnchor, PERSONAL_SET])
  const handleSelectTransitAspect = useCallback((cellId: string) => {
    // cellId = txr-<transito>-<tipo>-<natal> (lowercase); a âncora é 'planet:Sun'.
    const natal = (cellId || '').split('-').pop() || ''
    if (natal) scrollToAnchor(`planet:${cap(natal)}`)
  }, [scrollToAnchor])

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
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
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
            {/* Abas: mapas ocidentais (Natal/Trânsitos/Solar/Lunar) + lentes (Védico/Tzolkin/Chinês). */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeToggle}>
              <TouchableOpacity style={[styles.modeBtn, westMode === 'natal' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setWestMode('natal')}>
                <Text style={[styles.modeBtnText, westMode === 'natal' && styles.modeBtnTextActive]}>{tl('Natal', 'Natal', 'Natal', 'Natale')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeBtn, westMode === 'transitos' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setWestMode('transitos')}>
                <Text style={[styles.modeBtnText, westMode === 'transitos' && styles.modeBtnTextActive]}>{tl('Trânsitos', 'Transits', 'Tránsitos', 'Transiti')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeBtn, westMode === 'solar' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setWestMode('solar')}>
                <Text style={[styles.modeBtnText, westMode === 'solar' && styles.modeBtnTextActive]}>{tl('Solar', 'Solar', 'Solar', 'Solare')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeBtn, westMode === 'lunar' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setWestMode('lunar')}>
                <Text style={[styles.modeBtnText, westMode === 'lunar' && styles.modeBtnTextActive]}>{tl('Lunar', 'Lunar', 'Lunar', 'Lunare')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeBtn, westMode === 'vedico' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setWestMode('vedico')}>
                <Text style={[styles.modeBtnText, westMode === 'vedico' && styles.modeBtnTextActive]}>{tl('Védico', 'Vedic', 'Vedico', 'Vedico')}</Text>
              </TouchableOpacity>
              {TZOLKIN_ENABLED ? (
                <TouchableOpacity style={[styles.modeBtn, westMode === 'tzolkin' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setWestMode('tzolkin')}>
                  <Text style={[styles.modeBtnText, westMode === 'tzolkin' && styles.modeBtnTextActive]}>Tzolkin</Text>
                </TouchableOpacity>
              ) : null}
              {CHINESE_ENABLED ? (
                <TouchableOpacity style={[styles.modeBtn, westMode === 'chines' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setWestMode('chines')}>
                  <Text style={[styles.modeBtnText, westMode === 'chines' && styles.modeBtnTextActive]}>{tl('Chinês', 'Chinese', 'Chino', 'Cinese')}</Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>

            {westMode === 'solar' ? (
              srLoading || (!srData && !srError) ? (
                <View style={styles.center}><StarLoader /></View>
              ) : srError || !srData ? (
                <Text style={styles.srMemberError}>{tl('Não consegui calcular o Retorno Solar agora.', 'Could not calculate the Solar Return now.', 'No pude calcular el Retorno Solar ahora.', 'Non sono riuscito a calcolare il Ritorno Solare.')}</Text>
              ) : (
                <>
                  {srMoment ? <Text style={styles.srMemberCaption}>{tl(`Retorno Solar de ${srMoment.getUTCFullYear()}`, `Solar Return ${srMoment.getUTCFullYear()}`, `Retorno Solar ${srMoment.getUTCFullYear()}`, `Ritorno Solare ${srMoment.getUTCFullYear()}`)}</Text> : null}
                  <NatalChartWheelContent transitData={srData} loading={false} showLegend={false} chartMeta={{ skipSelfFetch: true }} />
                  <AstroProfileContent transitData={srData} loading={false} chartMeta={{ skipSelfFetch: true }} interpMode="solar" />
                </>
              )
            ) : westMode === 'lunar' ? (
              lrLoading || (!lrData && !lrError) ? (
                <View style={styles.center}><StarLoader /></View>
              ) : lrError || !lrData ? (
                <Text style={styles.srMemberError}>{tl('Não consegui calcular o Retorno Lunar agora.', 'Could not calculate the Lunar Return now.', 'No pude calcular el Retorno Lunar ahora.', 'Non sono riuscito a calcolare il Ritorno Lunare.')}</Text>
              ) : (
                <>
                  {lrMoment ? <Text style={styles.srMemberCaption}>{tl(`Retorno Lunar · ${lrMoment.toLocaleDateString('pt-BR')}`, `Lunar Return · ${lrMoment.toLocaleDateString('en-US')}`, `Retorno Lunar · ${lrMoment.toLocaleDateString('es-ES')}`, `Ritorno Lunare · ${lrMoment.toLocaleDateString('it-IT')}`)}</Text> : null}
                  <NatalChartWheelContent transitData={lrData} loading={false} showLegend={false} chartMeta={{ skipSelfFetch: true }} />
                  <AstroProfileContent transitData={lrData} loading={false} chartMeta={{ skipSelfFetch: true }} interpMode="lunar" />
                </>
              )
            ) : westMode === 'vedico' ? (
              <VedicProfileContent transitData={data} loading={false} natalAscDeg={natalAscDeg} chartMeta={chartMeta} />
            ) : westMode === 'tzolkin' ? (
              chartMeta.birthDate ? (
                <View style={{ height: 640 }}>
                  <TzolkinProfileContent birthDateISO={chartMeta.birthDate} />
                </View>
              ) : null
            ) : westMode === 'chines' ? (
              chartMeta.birthDate ? (
                <View style={{ height: 720 }}>
                  <ChineseProfileContent birth={{ birthDate: chartMeta.birthDate, birthTime: chartMeta.birthTime, longitude: member?.birthData?.coordinates?.longitude }} />
                </View>
              ) : null
            ) : (
              <>
                <NatalChartWheelContent transitData={data} loading={false} showLegend={false} showTransits={westMode === 'transitos'} chartMeta={{ skipSelfFetch: true }} onSelectTransitAspect={handleSelectTransitAspect} onSelectNatalAspect={handleSelectNatalAspect} />
                {westMode === 'transitos' ? (
                  // Lista de trânsitos interpretados do MEMBRO — mesma da aba Mapa.
                  // O embedded lê route.params.member (o mesmo que abriu esta tela).
                  <PersonalTransitsScreen embedded />
                ) : null}
                <AstroProfileContent transitData={data} loading={false} chartMeta={chartMeta} registerAnchor={registerAnchor} />
              </>
            )}
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
  modeToggle: {
    flexDirection: 'row', alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 22, padding: 3, marginTop: 4, marginBottom: 12,
  },
  modeBtn: { paddingHorizontal: 22, paddingVertical: 7, borderRadius: 20 },
  modeBtnActive: { backgroundColor: '#FFD700' },
  modeBtnText: { color: '#8892a4', fontSize: 13, fontWeight: '700' },
  modeBtnTextActive: { color: '#1A1A1A' },
  srMemberCaption: { color: '#FFD700', fontSize: 12.5, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  srMemberError: { color: '#9A9CB8', fontSize: 14, textAlign: 'center', paddingVertical: 30 },
})
