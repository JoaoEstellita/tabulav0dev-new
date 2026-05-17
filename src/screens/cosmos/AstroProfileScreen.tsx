import React, { useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { degToSign } from '../../astro'
import StarLoader from '../../components/StarLoader'
import type { RealPlanetPosition } from '../../services/astrology/RealAstrologyEngine'

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀',
  Mars: '♂', Jupiter: '♃', Saturn: '♄', Uranus: '♅',
  Neptune: '♆', Pluto: '♇',
}

const PLANET_ORDER = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']

const SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}

const ELEMENT_COLORS: Record<string, string> = {
  fire: '#f97316',
  earth: '#84cc16',
  air: '#38bdf8',
  water: '#818cf8',
}
const ELEMENT_LABELS: Record<string, Record<string, string>> = {
  'pt-BR': { fire: 'Fogo', earth: 'Terra', air: 'Ar', water: 'Água' },
  'en-US': { fire: 'Fire', earth: 'Earth', air: 'Air', water: 'Water' },
  'es-ES': { fire: 'Fuego', earth: 'Tierra', air: 'Aire', water: 'Agua' },
  'it-IT': { fire: 'Fuoco', earth: 'Terra', air: 'Aria', water: 'Acqua' },
}

const MODALITY_LABELS: Record<string, Record<string, string>> = {
  'pt-BR': { cardinal: 'Cardeal', fixed: 'Fixo', mutable: 'Mutável' },
  'en-US': { cardinal: 'Cardinal', fixed: 'Fixed', mutable: 'Mutable' },
  'es-ES': { cardinal: 'Cardinal', fixed: 'Fijo', mutable: 'Mutable' },
  'it-IT': { cardinal: 'Cardinale', fixed: 'Fisso', mutable: 'Mutevole' },
}

function OrdinalHouse({ n, lang }: { n: number; lang: string }) {
  const suffixes: Record<string, string[]> = {
    'pt-BR': ['ª', 'ª', 'ª'],
    'en-US': ['st', 'nd', 'rd'],
    'es-ES': ['ª', 'ª', 'ª'],
    'it-IT': ['ª', 'ª', 'ª'],
  }
  const s = suffixes[lang] || suffixes['pt-BR']
  const suf = n === 1 ? s[0] : n === 2 ? s[1] : n === 3 ? s[2] : s[0]
  return <>{n}{suf}</>
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100)
  return (
    <View style={barStyles.track}>
      <View style={[barStyles.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
    </View>
  )
}

const barStyles = StyleSheet.create({
  track: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3 },
})

export default function AstroProfileScreen() {
  const { transitData, loading } = useLifeAreas()
  const { language } = useAppLanguage()

  const tl = (pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }

  const ct = transitData?.currentTransits
  const natalPlanets: RealPlanetPosition[] = useMemo(
    () => ct?.natalPlanets ?? [],
    [ct?.natalPlanets]
  )
  const orderedPlanets = useMemo(
    () => PLANET_ORDER.map(name => natalPlanets.find(p => p.name === name)).filter(Boolean) as RealPlanetPosition[],
    [natalPlanets]
  )

  const elemental = ct?.chartSummary?.elemental?.natal
  const modality = ct?.chartSummary?.modality?.natal
  const natalAsc = ct?.natalAscendant ?? 0
  const natalMc = ct?.natalMidheaven ?? 0

  const ascSign = useMemo(() => {
    try { return degToSign(natalAsc) } catch { return { sign: '', degInSign: 0 } }
  }, [natalAsc])

  const mcSign = useMemo(() => {
    try { return degToSign(natalMc) } catch { return { sign: '', degInSign: 0 } }
  }, [natalMc])

  const maxElement = elemental ? Math.max(elemental.fire, elemental.earth, elemental.air, elemental.water) : 1
  const maxModality = modality ? Math.max(modality.cardinal, modality.fixed, modality.mutable) : 1

  const elLabels = ELEMENT_LABELS[language] || ELEMENT_LABELS['pt-BR']
  const modLabels = MODALITY_LABELS[language] || MODALITY_LABELS['pt-BR']

  if (loading && natalPlanets.length === 0) {
    return (
      <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
        <View style={styles.center}>
          <StarLoader size={32} color="#FFD700" />
          <Text style={styles.loadingText}>{tl('Calculando perfil…', 'Calculating profile…', 'Calculando perfil…', 'Calcolo profilo…')}</Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        {/* Ascendente + MC */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {tl('Pontos Angulares', 'Angular Points', 'Puntos Angulares', 'Punti Angolari')}
          </Text>
          <View style={styles.row}>
            <View style={styles.angularItem}>
              <Text style={styles.angularLabel}>ASC</Text>
              <Text style={styles.angularValue}>
                {SIGN_SYMBOLS[ascSign.sign] || ''} {ascSign.sign}
              </Text>
              <Text style={styles.angularDeg}>{ascSign.degInSign.toFixed(1)}°</Text>
            </View>
            <View style={styles.angularDivider} />
            <View style={styles.angularItem}>
              <Text style={styles.angularLabel}>MC</Text>
              <Text style={styles.angularValue}>
                {SIGN_SYMBOLS[mcSign.sign] || ''} {mcSign.sign}
              </Text>
              <Text style={styles.angularDeg}>{mcSign.degInSign.toFixed(1)}°</Text>
            </View>
          </View>
        </View>

        {/* Planetas natais */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {tl('Planetas Natais', 'Natal Planets', 'Planetas Natales', 'Pianeti Natali')}
          </Text>
          {orderedPlanets.map(p => (
            <View key={p.name} style={styles.planetRow}>
              <Text style={styles.planetSymbol}>{PLANET_SYMBOLS[p.name] || '●'}</Text>
              <Text style={styles.planetName}>{p.name}</Text>
              <View style={styles.planetSignWrap}>
                <Text style={styles.planetSign}>
                  {SIGN_SYMBOLS[p.sign] || ''} {p.sign}
                </Text>
                <Text style={styles.planetDeg}>{(p.degree ?? (p.longitude % 30)).toFixed(1)}°</Text>
              </View>
              <View style={styles.planetMeta}>
                <Text style={styles.planetHouse}>
                  {tl('Casa', 'House', 'Casa', 'Casa')} {p.house}
                </Text>
                {p.isRetrograde && (
                  <View style={styles.retroBadge}>
                    <Text style={styles.retroText}>℞</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Análise elemental */}
        {elemental && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {tl('Distribuição Elemental', 'Elemental Distribution', 'Distribución Elemental', 'Distribuzione Elementale')}
            </Text>
            {(['fire', 'earth', 'air', 'water'] as const).map(el => (
              <View key={el} style={styles.statRow}>
                <Text style={[styles.statLabel, { color: ELEMENT_COLORS[el] }]}>
                  {elLabels[el]}
                </Text>
                <Bar value={elemental[el]} max={maxElement} color={ELEMENT_COLORS[el]} />
                <Text style={styles.statCount}>{elemental[el]}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Análise de modalidades */}
        {modality && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {tl('Modalidades', 'Modalities', 'Modalidades', 'Modalità')}
            </Text>
            {(['cardinal', 'fixed', 'mutable'] as const).map(mod => (
              <View key={mod} style={styles.statRow}>
                <Text style={styles.statLabel}>{modLabels[mod]}</Text>
                <Bar value={modality[mod]} max={maxModality} color="#FFD700" />
                <Text style={styles.statCount}>{modality[mod]}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#8892a4', fontSize: 14 },

  card: {
    backgroundColor: '#161a22',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#252b38',
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#8892a4',
    marginBottom: 14,
  },

  row: { flexDirection: 'row', alignItems: 'center' },
  angularItem: { flex: 1, alignItems: 'center', gap: 4 },
  angularDivider: { width: 1, height: 40, backgroundColor: '#252b38' },
  angularLabel: { fontSize: 11, color: '#8892a4', fontWeight: '700' },
  angularValue: { fontSize: 16, color: '#FFD700', fontWeight: '700' },
  angularDeg: { fontSize: 11, color: '#8892a4' },

  planetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2430',
  },
  planetSymbol: {
    fontSize: 16,
    width: 26,
    color: '#FFD700',
    textAlign: 'center',
  },
  planetName: {
    width: 68,
    fontSize: 13,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  planetSignWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  planetSign: {
    fontSize: 13,
    color: '#e2e8f0',
  },
  planetDeg: {
    fontSize: 11,
    color: '#8892a4',
  },
  planetMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planetHouse: {
    fontSize: 11,
    color: '#8892a4',
  },
  retroBadge: {
    backgroundColor: 'rgba(248,113,113,0.15)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  retroText: {
    fontSize: 11,
    color: '#f87171',
    fontWeight: '700',
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  statLabel: {
    width: 72,
    fontSize: 12,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  statCount: {
    width: 20,
    fontSize: 12,
    color: '#8892a4',
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
})
