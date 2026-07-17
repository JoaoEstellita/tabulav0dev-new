import React, { useMemo, useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../hooks/useSubscription'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { degToSign } from '../../astro'
import StarLoader from '../../components/StarLoader'

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀',
  Mars: '♂', Jupiter: '♃', Saturn: '♄', Uranus: '♅',
  Neptune: '♆', Pluto: '♇',
}

const SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}

function getSignSymbol(sign: string): string {
  return SIGN_SYMBOLS[sign] || ''
}

function getPlanetNatalSign(natalPlanets: any[], name: string): string {
  const p = natalPlanets?.find((x: any) => x.name === name)
  return p?.sign || ''
}

type FeatureCard = {
  key: string
  icon: keyof typeof Ionicons.glyphMap
  titlePt: string
  titleEn: string
  titleEs: string
  titleIt: string
  descPt: string
  descEn: string
  descEs: string
  descIt: string
  premium: boolean
  screen: string
  available: boolean
}

const FREE_FEATURES: FeatureCard[] = [
  {
    key: 'natal-wheel',
    icon: 'planet-outline',
    titlePt: 'Mapa Natal',
    titleEn: 'Natal Chart',
    titleEs: 'Carta Natal',
    titleIt: 'Carta Natale',
    descPt: 'Roda astrológica com planetas e casas',
    descEn: 'Astrological wheel with planets and houses',
    descEs: 'Rueda astrológica con planetas y casas',
    descIt: 'Ruota astrologica con pianeti e case',
    premium: false,
    screen: 'NatalChartWheel',
    available: true,
  },
  {
    key: 'astro-profile',
    icon: 'star-outline',
    titlePt: 'Perfil Astrológico',
    titleEn: 'Astrological Profile',
    titleEs: 'Perfil Astrológico',
    titleIt: 'Profilo Astrologico',
    descPt: 'Todos os seus planetas, casas e elementos',
    descEn: 'All your planets, houses and elements',
    descEs: 'Todos tus planetas, casas y elementos',
    descIt: 'Tutti i tuoi pianeti, case ed elementi',
    premium: false,
    screen: 'AstroProfile',
    available: true,
  },
  {
    key: 'transits',
    icon: 'git-branch-outline',
    titlePt: 'Trânsitos do Dia',
    titleEn: 'Daily Transits',
    titleEs: 'Tránsitos del Día',
    titleIt: 'Transiti del Giorno',
    descPt: 'O que o céu faz agora no seu mapa',
    descEn: 'What the sky does now in your chart',
    descEs: 'Lo que el cielo hace ahora en tu mapa',
    descIt: 'Cosa fa il cielo ora nella tua carta',
    premium: false,
    screen: 'PersonalTransits',
    available: true,
  },
  {
    key: 'timeline',
    icon: 'time-outline',
    titlePt: 'Linha do Tempo',
    titleEn: 'Timeline',
    titleEs: 'Línea de Tiempo',
    titleIt: 'Linea del Tempo',
    descPt: 'Previsões de curto, médio e longo prazo',
    descEn: 'Short, medium and long-term forecasts',
    descEs: 'Previsiones a corto, medio y largo plazo',
    descIt: 'Previsioni a breve, medio e lungo termine',
    premium: false,
    screen: 'AstrologyAnalysis',
    available: true,
  },
]

const PREMIUM_FEATURES: FeatureCard[] = [
  {
    key: 'pdf',
    icon: 'document-text-outline',
    titlePt: 'Relatório PDF',
    titleEn: 'PDF Report',
    titleEs: 'Informe PDF',
    titleIt: 'Rapporto PDF',
    descPt: 'Mapa natal completo para download',
    descEn: 'Complete natal chart for download',
    descEs: 'Carta natal completa para descargar',
    descIt: 'Carta natale completa da scaricare',
    premium: true,
    screen: 'PdfExport',
    available: false, // Fase 2
  },
  {
    key: 'chat',
    icon: 'chatbubbles-outline',
    titlePt: 'Chat IA',
    titleEn: 'AI Chat',
    titleEs: 'Chat IA',
    titleIt: 'Chat IA',
    descPt: 'Tire dúvidas sobre seu mapa com IA',
    descEn: 'Ask questions about your chart with AI',
    descEs: 'Resuelve dudas sobre tu mapa con IA',
    descIt: 'Chiarisci i dubbi sulla tua carta con IA',
    premium: true,
    screen: 'ChatAstro',
    available: false, // Fase 2
  },
  {
    key: 'solar-return',
    icon: 'sunny-outline',
    titlePt: 'Retorno Solar',
    titleEn: 'Solar Return',
    titleEs: 'Retorno Solar',
    titleIt: 'Ritorno Solare',
    descPt: 'Mapa do seu próximo aniversário',
    descEn: 'Chart for your next birthday year',
    descEs: 'Mapa para tu próximo año de cumpleaños',
    descIt: 'Mappa per il tuo prossimo compleanno',
    premium: true,
    screen: 'SolarReturn',
    available: false, // Fase 2
  },
  {
    key: 'synastry',
    icon: 'heart-outline',
    titlePt: 'Sinastria',
    titleEn: 'Synastry',
    titleEs: 'Sinastría',
    titleIt: 'Sinastria',
    descPt: 'Compare seu mapa com outra pessoa',
    descEn: 'Compare your chart with another person',
    descEs: 'Compara tu mapa con otra persona',
    descIt: 'Confronta la tua carta con un\'altra persona',
    premium: true,
    screen: 'Synastry',
    available: false, // Fase 3
  },
  {
    key: 'diary',
    icon: 'journal-outline',
    titlePt: 'Diário Cósmico',
    titleEn: 'Cosmic Diary',
    titleEs: 'Diario Cósmico',
    titleIt: 'Diario Cosmico',
    descPt: 'Notas linkadas aos seus trânsitos',
    descEn: 'Notes linked to your transits',
    descEs: 'Notas enlazadas a tus tránsitos',
    descIt: 'Note collegate ai tuoi transiti',
    premium: true,
    screen: 'CosmicDiary',
    available: false, // Fase 3
  },
  {
    key: 'alerts',
    icon: 'notifications-outline',
    titlePt: 'Alertas Customizados',
    titleEn: 'Custom Alerts',
    titleEs: 'Alertas Personalizadas',
    titleIt: 'Avvisi Personalizzati',
    descPt: 'Avise quando um planeta tocar seu natal',
    descEn: 'Alert when a planet touches your natal',
    descEs: 'Avisa cuando un planeta toca tu natal',
    descIt: 'Avvisa quando un pianeta tocca il tuo natale',
    premium: true,
    screen: 'CustomAlerts',
    available: false, // Fase 3
  },
]

export default function CosmosScreen() {
  const navigation = useNavigation()
  const { user } = useAuth()
  const { subscription, isInTrial } = useSubscription()
  const { transitData, loading } = useLifeAreas()
  const { language } = useAppLanguage()

  const isPremium = subscription?.status === 'active' || isInTrial

  const natalPlanets = transitData?.currentTransits?.natalPlanets ?? []

  const [firestoreAscDeg, setFirestoreAscDeg] = useState<number | null>(null)
  useEffect(() => {
    if (!user?.uid) return
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      const val = snap.data()?.natalAscDeg
      if (typeof val === 'number') setFirestoreAscDeg(val)
    }).catch(() => {})
  }, [user?.uid])

  const natalAscDeg = firestoreAscDeg ?? transitData?.currentTransits?.natalAscendant ?? 0

  const sunSign = useMemo(() => getPlanetNatalSign(natalPlanets, 'Sun'), [natalPlanets])
  const moonSign = useMemo(() => getPlanetNatalSign(natalPlanets, 'Moon'), [natalPlanets])
  const ascSign = useMemo(() => {
    try { return degToSign(natalAscDeg).sign } catch { return '' }
  }, [natalAscDeg])

  const tl = (pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }

  const cardTitle = (f: FeatureCard) => tl(f.titlePt, f.titleEn, f.titleEs, f.titleIt)
  const cardDesc = (f: FeatureCard) => tl(f.descPt, f.descEn, f.descEs, f.descIt)

  const handleCardPress = (f: FeatureCard) => {
    // "Em breve" tem prioridade: não leva ao paywall (a feature ainda não existe).
    if (!f.available) return
    if (f.premium && !isPremium) {
      ;(navigation as any).navigate('Premium')
      return
    }
    ;(navigation as any).navigate(f.screen)
  }

  const renderCard = (f: FeatureCard) => {
    const locked = f.premium && !isPremium
    const unavailable = f.available === false
    return (
      <TouchableOpacity
        key={f.key}
        style={[styles.card, (locked || unavailable) && styles.cardLocked]}
        activeOpacity={0.78}
        onPress={() => handleCardPress(f)}
      >
        <View style={styles.cardIconWrap}>
          <Ionicons name={f.icon} size={26} color={locked || unavailable ? '#555' : '#FFD700'} />
        </View>
        <View style={styles.cardBody}>
          <Text style={[styles.cardTitle, (locked || unavailable) && styles.cardTitleLocked]} numberOfLines={1}>
            {cardTitle(f)}
          </Text>
          <Text style={[styles.cardDesc, (locked || unavailable) && styles.cardDescLocked]} numberOfLines={2}>
            {cardDesc(f)}
          </Text>
        </View>
        {unavailable ? (
          <View style={styles.soonBadge}>
            <Text style={styles.soonText}>{tl('Em breve', 'Coming soon', 'Proximamente', 'In arrivo')}</Text>
          </View>
        ) : locked ? (
          <Ionicons name="lock-closed" size={16} color="#555" style={styles.cardLockIcon} />
        ) : (
          <Ionicons name="chevron-forward" size={16} color="#FFD700" style={styles.cardLockIcon} />
        )}
      </TouchableOpacity>
    )
  }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>✦ Cosmos</Text>
          {loading && natalPlanets.length === 0 ? (
            <StarLoader size={20} color="#FFD700" />
          ) : (
            <View style={styles.heroSigns}>
              {sunSign ? (
                <View style={styles.heroSign}>
                  <Text style={styles.heroSignSymbol}>{PLANET_SYMBOLS.Sun}</Text>
                  <Text style={styles.heroSignText}>{getSignSymbol(sunSign)} {sunSign}</Text>
                </View>
              ) : null}
              {moonSign ? (
                <View style={styles.heroSign}>
                  <Text style={styles.heroSignSymbol}>{PLANET_SYMBOLS.Moon}</Text>
                  <Text style={styles.heroSignText}>{getSignSymbol(moonSign)} {moonSign}</Text>
                </View>
              ) : null}
              {ascSign ? (
                <View style={styles.heroSign}>
                  <Text style={styles.heroSignSymbol}>Asc</Text>
                  <Text style={styles.heroSignText}>{getSignSymbol(ascSign)} {ascSign}</Text>
                </View>
              ) : null}
            </View>
          )}
          <Text style={styles.heroSub}>
            {tl('Seu espaço astrológico', 'Your astrological space', 'Tu espacio astrológico', 'Il tuo spazio astrologico')}
          </Text>
        </View>

        {/* Seção gratuita */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {tl('Explorar', 'Explore', 'Explorar', 'Esplora')}
          </Text>
          {FREE_FEATURES.map(renderCard)}
        </View>

        {/* Seção premium */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>Premium</Text>
            {!isPremium && (
              <TouchableOpacity onPress={() => (navigation as any).navigate('Premium')}>
                <Text style={styles.unlockCta}>
                  {tl('Desbloquear ✦', 'Unlock ✦', 'Desbloquear ✦', 'Sblocca ✦')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {PREMIUM_FEATURES.map(renderCard)}
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  // minHeight:0 permite o ScrollView encolher e rolar no web (flexbox);
  // sem isso o conteúdo empurra o container e a tela fica estática.
  // Sem overflow:hidden — no react-native-web ele CORTA o conteúdo (a tela fica
  // estática, o ScrollView interno não rola). As outras telas do RootStack não
  // usam overflow:hidden e rolam normal. minHeight:0 basta para o flex encolher.
  container: { flex: 1, minHeight: 0 },
  scroll: { flex: 1, minHeight: 0 },
  scrollContent: { paddingBottom: 40 },

  hero: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,215,0,0.12)',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  heroSigns: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroSign: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroSignSymbol: {
    fontSize: 11,
    color: '#8892a4',
    marginBottom: 2,
  },
  heroSignText: {
    fontSize: 13,
    color: '#FFD700',
    fontWeight: '600',
  },
  heroSub: {
    fontSize: 13,
    color: '#8892a4',
    marginTop: 4,
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#8892a4',
    marginBottom: 12,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  unlockCta: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161a22',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#252b38',
    padding: 14,
    marginBottom: 10,
  },
  cardLocked: {
    opacity: 0.55,
  },
  cardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: 'rgba(255,215,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  cardTitleLocked: {
    color: '#555',
  },
  cardDesc: {
    fontSize: 12,
    color: '#8892a4',
  },
  cardDescLocked: {
    color: '#444',
  },
  cardLockIcon: {
    marginLeft: 8,
  },
  soonBadge: {
    backgroundColor: 'rgba(124,106,247,0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  soonText: {
    fontSize: 10,
    color: '#7c6af7',
    fontWeight: '700',
  },
})
