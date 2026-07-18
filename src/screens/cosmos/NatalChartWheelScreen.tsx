import React, { useMemo, useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  useWindowDimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Circle, Line, Path, Text as SvgText, G } from 'react-native-svg'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import type { LocalTransitData } from '../../services/astrology/LocalAstrologyService'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { degToSign } from '../../astro'
import StarLoader from '../../components/StarLoader'
import type { RealPlanetPosition } from '../../services/astrology/RealAstrologyEngine'

// ─── Símbolos ──────────────────────────────────────────────────────────────
const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀',
  Mars: '♂', Jupiter: '♃', Saturn: '♄', Uranus: '♅',
  Neptune: '♆', Pluto: '♇',
}
const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFD700', Moon: '#C0C0FF', Mercury: '#A0C8FF', Venus: '#FFB0C8',
  Mars: '#FF7070', Jupiter: '#FFB060', Saturn: '#D0D070', Uranus: '#70D0D0',
  Neptune: '#8080FF', Pluto: '#C080C0',
}
const ZODIAC_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']
const ZODIAC_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']

const ASPECT_COLORS: Record<string, string> = {
  conjunction: 'rgba(255,215,0,0.7)',
  sextile: 'rgba(80,200,120,0.6)',
  square: 'rgba(240,80,80,0.6)',
  trine: 'rgba(80,120,240,0.6)',
  opposition: 'rgba(240,140,80,0.6)',
  quincunx: 'rgba(180,120,240,0.5)',
}

// ─── Geometria ──────────────────────────────────────────────────────────────
const DEG2RAD = Math.PI / 180

/** Converte longitude eclíptica → ângulo SVG (0° = direita, sentido horário) */
function lonToSvgAngle(lon: number, ascDeg: number): number {
  // ASC fica a 180° (esquerda); planetas giram no sentido anti-horário
  return (180 - (lon - ascDeg) + 360) % 360
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = angleDeg * DEG2RAD
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

// ─── Componente principal ─────────────────────────────────────────────────
type ChartContentProps = { transitData: LocalTransitData | null; loading: boolean }

/**
 * Conteúdo da roda, SEM container próprio (nem LinearGradient nem ScrollView).
 * Recebe os dados por prop de propósito: useLifeAreas não é contexto — cada
 * chamada cria uma instância com estado próprio. Quem monta a tela chama o hook
 * uma vez e passa para cá, para o Cosmos poder embutir roda + perfil sem
 * disparar o cálculo astrológico três vezes.
 */
export function NatalChartWheelContent({ transitData, loading }: ChartContentProps) {
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const { width } = useWindowDimensions()

  const [selectedPlanet, setSelectedPlanet] = useState<RealPlanetPosition | null>(null)
  const [firestoreAscDeg, setFirestoreAscDeg] = useState<number | null>(null)
  const [firestoreCusps, setFirestoreCusps] = useState<number[] | null>(null)

  useEffect(() => {
    if (!user?.uid) return
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      const data = snap.data()
      if (typeof data?.natalAscDeg === 'number') setFirestoreAscDeg(data.natalAscDeg)
      if (Array.isArray(data?.natalCusps)) setFirestoreCusps(data.natalCusps)
    }).catch(() => {})
  }, [user?.uid])

  const tl = (pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }

  const ct = transitData?.currentTransits
  const natalPlanets: RealPlanetPosition[] = ct?.natalPlanets ?? []
  const ascDeg = firestoreAscDeg ?? ct?.natalAscendant ?? 0
  const mcDeg = ct?.natalMidheaven ?? 0
  const houseCusps: number[] = firestoreCusps ?? ct?.natalHouses ?? []
  const aspects = ct?.aspectsNatalToNatal ?? []

  // Dimensões do SVG
  const svgSize = Math.min(width - 32, 380)
  const cx = svgSize / 2
  const cy = svgSize / 2

  const R_OUTER = svgSize * 0.46   // borda externa (zodíaco)
  const R_ZODIAC_IN = svgSize * 0.38 // borda interna do zodíaco
  const R_HOUSE_OUT = svgSize * 0.36 // borda externa das casas
  const R_HOUSE_IN = svgSize * 0.28  // borda interna das casas
  const R_PLANET = svgSize * 0.21    // posição dos planetas
  const R_INNER = svgSize * 0.14     // círculo central (aspectos)

  const planetPositions = useMemo(() => {
    return natalPlanets.map(p => {
      const angle = lonToSvgAngle(p.longitude, ascDeg)
      const { x, y } = polarToXY(cx, cy, R_PLANET, angle)
      return { ...p, svgAngle: angle, sx: x, sy: y }
    })
  }, [natalPlanets, ascDeg, cx, cy, R_PLANET])

  const houseLines = useMemo(() => {
    if (houseCusps.length === 12) {
      return houseCusps.map((cusp, i) => {
        const angle = lonToSvgAngle(cusp, ascDeg)
        const inner = polarToXY(cx, cy, R_HOUSE_IN, angle)
        const outer = polarToXY(cx, cy, R_HOUSE_OUT, angle)
        return { i, angle, inner, outer }
      })
    }
    // Fallback: casas iguais (30° cada a partir do ASC)
    return Array.from({ length: 12 }, (_, i) => {
      const angle = lonToSvgAngle(ascDeg + i * 30, ascDeg)
      const inner = polarToXY(cx, cy, R_HOUSE_IN, angle)
      const outer = polarToXY(cx, cy, R_HOUSE_OUT, angle)
      return { i, angle, inner, outer }
    })
  }, [houseCusps, ascDeg, cx, cy, R_HOUSE_IN, R_HOUSE_OUT])

  const houseLabels = useMemo(() => {
    return houseLines.map((h, i) => {
      const nextAngle = houseLines[(i + 1) % 12].angle
      let midAngle = (h.angle + nextAngle) / 2
      // Corrigir quando cruzar 0°/360°
      if (Math.abs(nextAngle - h.angle) > 180) {
        midAngle = ((h.angle + nextAngle + 360) / 2) % 360
      }
      const { x, y } = polarToXY(cx, cy, (R_HOUSE_IN + R_HOUSE_OUT) / 2, midAngle)
      return { label: String(i + 1), x, y }
    })
  }, [houseLines, cx, cy, R_HOUSE_IN, R_HOUSE_OUT])

  const zodiacSections = useMemo(() => {
    return ZODIAC_SYMBOLS.map((sym, i) => {
      const startAngle = lonToSvgAngle(i * 30, ascDeg)
      const endAngle = lonToSvgAngle((i + 1) * 30, ascDeg)
      const midAngle = lonToSvgAngle(i * 30 + 15, ascDeg)
      const { x, y } = polarToXY(cx, cy, (R_ZODIAC_IN + R_OUTER) / 2, midAngle)
      return { sym, i, startAngle, endAngle, midAngle, sx: x, sy: y }
    })
  }, [ascDeg, cx, cy, R_ZODIAC_IN, R_OUTER])

  const aspectLines = useMemo(() => {
    return aspects.slice(0, 30).map(asp => {
      const p1 = natalPlanets.find(p => p.name === asp.planet1)
      const p2 = natalPlanets.find(p => p.name === asp.planet2)
      if (!p1 || !p2) return null
      const a1 = lonToSvgAngle(p1.longitude, ascDeg)
      const a2 = lonToSvgAngle(p2.longitude, ascDeg)
      const pt1 = polarToXY(cx, cy, R_INNER, a1)
      const pt2 = polarToXY(cx, cy, R_INNER, a2)
      const color = ASPECT_COLORS[asp.type] || 'rgba(200,200,200,0.3)'
      return { key: `${asp.planet1}-${asp.planet2}`, pt1, pt2, color }
    }).filter(Boolean)
  }, [aspects, natalPlanets, ascDeg, cx, cy, R_INNER])

  if (loading && natalPlanets.length === 0) {
    return (
      <View style={styles.center}>
        <StarLoader size={32} color="#FFD700" />
        <Text style={styles.loadingText}>
          {tl('Calculando mapa natal…', 'Calculating natal chart…', 'Calculando carta natal…', 'Calcolo carta natale…')}
        </Text>
      </View>
    )
  }

  return (
    <>
      {/* Roda SVG */}
        <View style={styles.wheelWrap}>
          <Svg width={svgSize} height={svgSize}>
            {/* Fundo */}
            <Circle cx={cx} cy={cy} r={R_OUTER} fill="#10131c" stroke="#252b38" strokeWidth={1} />

            {/* Anel do zodíaco */}
            <Circle cx={cx} cy={cy} r={R_ZODIAC_IN} fill="none" stroke="#252b38" strokeWidth={1} />

            {/* Símbolos dos signos */}
            {zodiacSections.map(z => (
              <SvgText
                key={z.i}
                x={z.sx}
                y={z.sy}
                fontSize={svgSize * 0.048}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="rgba(255,215,0,0.6)"
              >
                {z.sym}
              </SvgText>
            ))}

            {/* Divisões dos signos (linhas a cada 30°) */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = lonToSvgAngle(i * 30, ascDeg)
              const inner = polarToXY(cx, cy, R_ZODIAC_IN, angle)
              const outer = polarToXY(cx, cy, R_OUTER, angle)
              return (
                <Line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                  stroke="rgba(255,215,0,0.25)" strokeWidth={0.8} />
              )
            })}

            {/* Anel das casas */}
            <Circle cx={cx} cy={cy} r={R_HOUSE_OUT} fill="none" stroke="#252b38" strokeWidth={1} />
            <Circle cx={cx} cy={cy} r={R_HOUSE_IN} fill="#10131c" stroke="#252b38" strokeWidth={1} />

            {/* Linhas de cúspide das casas */}
            {houseLines.map(h => (
              <Line key={h.i}
                x1={h.inner.x} y1={h.inner.y}
                x2={h.outer.x} y2={h.outer.y}
                stroke={h.i === 0 || h.i === 3 || h.i === 6 || h.i === 9
                  ? 'rgba(255,215,0,0.7)' : 'rgba(255,255,255,0.2)'}
                strokeWidth={h.i === 0 || h.i === 3 || h.i === 6 || h.i === 9 ? 1.5 : 0.8}
              />
            ))}

            {/* Números das casas */}
            {houseLabels.map(h => (
              <SvgText key={h.label}
                x={h.x} y={h.y}
                fontSize={svgSize * 0.034}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="rgba(255,255,255,0.35)"
              >
                {h.label}
              </SvgText>
            ))}

            {/* Linhas de aspectos */}
            {aspectLines.map(l => l && (
              <Line key={l.key}
                x1={l.pt1.x} y1={l.pt1.y}
                x2={l.pt2.x} y2={l.pt2.y}
                stroke={l.color} strokeWidth={0.8}
              />
            ))}

            {/* Círculo interno (fundo aspectos) */}
            <Circle cx={cx} cy={cy} r={R_INNER} fill="#0d1018" stroke="#252b38" strokeWidth={1} />

            {/* Planetas */}
            {planetPositions.map(p => {
              const color = PLANET_COLORS[p.name] || '#fff'
              return (
                <G key={p.name} onPress={() => setSelectedPlanet(p)}>
                  <Circle cx={p.sx} cy={p.sy} r={svgSize * 0.042} fill="#161a22" stroke={color} strokeWidth={1.2} />
                  <SvgText x={p.sx} y={p.sy}
                    fontSize={svgSize * 0.038}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill={color}
                  >
                    {PLANET_SYMBOLS[p.name] || '●'}
                  </SvgText>
                  {p.isRetrograde && (
                    <SvgText
                      x={p.sx + svgSize * 0.028}
                      y={p.sy - svgSize * 0.028}
                      fontSize={svgSize * 0.022}
                      fill="#f87171"
                    >
                      ℞
                    </SvgText>
                  )}
                </G>
              )
            })}

            {/* ASC label */}
            {(() => {
              const { x, y } = polarToXY(cx, cy, R_HOUSE_OUT + 10, 180)
              return (
                <SvgText x={x} y={y} fontSize={svgSize * 0.03} textAnchor="middle"
                  alignmentBaseline="middle" fill="#FFD700" fontWeight="bold">
                  ASC
                </SvgText>
              )
            })()}
          </Svg>
        </View>

        {/* Legenda de planetas */}
        <View style={styles.legend}>
          {planetPositions.map(p => (
            <TouchableOpacity
              key={p.name}
              style={styles.legendItem}
              onPress={() => setSelectedPlanet(p)}
              activeOpacity={0.7}
            >
              <Text style={[styles.legendSymbol, { color: PLANET_COLORS[p.name] || '#fff' }]}>
                {PLANET_SYMBOLS[p.name] || '●'}
              </Text>
              <Text style={styles.legendName}>{p.name}</Text>
              <Text style={styles.legendInfo}>
                {(p.degree ?? (p.longitude % 30)).toFixed(0)}° {p.sign}
                {p.isRetrograde ? ' ℞' : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      {/* Modal de detalhe do planeta */}
      <Modal
        visible={selectedPlanet != null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPlanet(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedPlanet(null)}
        >
          {selectedPlanet && (
            <View style={styles.modalCard}>
              <Text style={[styles.modalSymbol, { color: PLANET_COLORS[selectedPlanet.name] || '#fff' }]}>
                {PLANET_SYMBOLS[selectedPlanet.name] || '●'}
              </Text>
              <Text style={styles.modalTitle}>{selectedPlanet.name}</Text>
              <Text style={styles.modalSub}>
                {(selectedPlanet.degree ?? (selectedPlanet.longitude % 30)).toFixed(1)}° {selectedPlanet.sign}
                {selectedPlanet.isRetrograde ? '  ℞ retrógrado' : ''}
              </Text>
              <Text style={styles.modalHouse}>
                {tl('Casa', 'House', 'Casa', 'Casa')} {selectedPlanet.house}
              </Text>
              <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedPlanet(null)}>
                <Text style={styles.modalCloseText}>
                  {tl('Fechar', 'Close', 'Cerrar', 'Chiudi')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </>
  )
}

/** Tela standalone (deep link /mapa) — mantém o container e o scroll próprios. */
export default function NatalChartWheelScreen() {
  const { transitData, loading } = useLifeAreas()
  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={Platform.OS === 'web'}>
        <NatalChartWheelContent transitData={transitData} loading={loading} />
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#8892a4', fontSize: 14 },
  scrollContent: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16 },

  wheelWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },

  legend: {
    width: '100%',
    backgroundColor: '#161a22',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#252b38',
    padding: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2430',
  },
  legendSymbol: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
    marginRight: 8,
  },
  legendName: {
    width: 70,
    fontSize: 13,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  legendInfo: {
    flex: 1,
    fontSize: 12,
    color: '#8892a4',
    textAlign: 'right',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#161a22',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#252b38',
    padding: 28,
    alignItems: 'center',
    minWidth: 220,
  },
  modalSymbol: { fontSize: 42, marginBottom: 8 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#e2e8f0', marginBottom: 6 },
  modalSub: { fontSize: 14, color: '#FFD700', marginBottom: 4 },
  modalHouse: { fontSize: 13, color: '#8892a4', marginBottom: 20 },
  modalClose: {
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  modalCloseText: { color: '#FFD700', fontWeight: '600', fontSize: 14 },
})
