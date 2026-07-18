import React, { useState, useMemo, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Svg, { Circle, Line } from 'react-native-svg'
import { getPlanetImageUri, type PlanetKey } from '../config/planetImageSource'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PLANET_ORDER: PlanetKey[] = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
]

const PLANETS_WITH_LIGHT_BG_IMAGES = new Set(['Mars', 'Jupiter', 'Saturn', 'Pluto'])

const PLANET_FALLBACK_GLYPHS: Record<PlanetKey, string> = {
  Sun: 'â˜‰',
  Moon: 'â˜½',
  Mercury: 'â˜¿',
  Venus: 'â™€',
  Mars: 'â™‚',
  Jupiter: 'â™ƒ',
  Saturn: 'â™„',
  Uranus: 'â™…',
  Neptune: 'â™†',
  Pluto: 'â™‡',
}

// ---------------------------------------------------------------------------
// MiniWheelIcon
// ---------------------------------------------------------------------------

function MiniWheelIcon({ size = 40 }: { size?: number }) {
  const cx = size / 2
  const cy = size / 2
  const rOuter = size * 0.44
  const rInner = size * 0.28
  const DEG2RAD = Math.PI / 180
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Anel externo */}
      <Circle cx={cx} cy={cy} r={rOuter} stroke="#FFD700" strokeWidth={1.5} fill="rgba(255,215,0,0.07)" />
      {/* Anel interno */}
      <Circle cx={cx} cy={cy} r={rInner} stroke="#FFD700" strokeWidth={0.8} fill="none" strokeOpacity={0.45} />
      {/* 12 divisões de casas */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = i * 30 * DEG2RAD
        const cos = Math.cos(a)
        const sin = Math.sin(a)
        return (
          <Line
            key={i}
            x1={cx + rInner * cos} y1={cy + rInner * sin}
            x2={cx + rOuter * cos} y2={cy + rOuter * sin}
            stroke="#FFD700" strokeWidth={0.7} strokeOpacity={0.45}
          />
        )
      })}
      {/* Eixo ASC/DSC */}
      <Line x1={cx - rOuter} y1={cy} x2={cx + rOuter} y2={cy} stroke="#FFD700" strokeWidth={1} strokeOpacity={0.7} />
      {/* Eixo MC/IC */}
      <Line x1={cx} y1={cy - rOuter} x2={cx} y2={cy + rOuter} stroke="#FFD700" strokeWidth={1} strokeOpacity={0.7} />
    </Svg>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type PlanetQuickNavProps = {
  /**
   * Quando fornecido, substitui o scroll por âncora DOM. Isso importa por dois
   * motivos: (1) o scroll por getElementById é web-only e não faz nada no nativo;
   * (2) as âncoras 'tabula-planet-*' são criadas na Home — como as abas ficam
   * montadas, reusá-las noutra tela faria o getElementById devolver o nó da Home
   * (oculto) e o scroll ia para o lugar errado.
   */
  onSelectPlanet?: (planet: PlanetKey) => void
  /** O atalho "Tábula Estelar" não faz sentido dentro do próprio Cosmos. */
  showCosmosEntry?: boolean
}

export default function PlanetQuickNav({ onSelectPlanet, showCosmosEntry = true }: PlanetQuickNavProps = {}) {
  const navigation = useNavigation()
  const [failedPlanetImages, setFailedPlanetImages] = useState<Record<string, boolean>>({})

  const planetItems = useMemo(
    () => PLANET_ORDER.map((planet) => ({ planet, imageUri: getPlanetImageUri(planet) })),
    [],
  )

  const scrollToPlanetInTabula = useCallback((planet: PlanetKey) => {
    try {
      if (Platform.OS !== 'web' || typeof document === 'undefined') return
      const element = document.getElementById(`tabula-planet-${planet}`)
      if (!element) return
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => {
        try { element.scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch { }
      }, 180)
    } catch { }
  }, [])

  return (
    <View style={styles.planetStripSection}>
      <View style={styles.planetStripRow}>
        {planetItems.map((planetItem) => (
          <TouchableOpacity
            key={`quick-planet-${planetItem.planet}`}
            style={styles.planetStripItem}
            activeOpacity={0.86}
            delayPressIn={0}
            onPress={() => (onSelectPlanet ? onSelectPlanet(planetItem.planet) : scrollToPlanetInTabula(planetItem.planet))}
          >
            {planetItem.imageUri && !failedPlanetImages[planetItem.planet] ? (
              <Image
                source={{ uri: planetItem.imageUri }}
                style={[
                  styles.planetStripImage,
                  PLANETS_WITH_LIGHT_BG_IMAGES.has(planetItem.planet) && styles.planetStripImageWhiteBgFix,
                  Platform.OS === 'web' && PLANETS_WITH_LIGHT_BG_IMAGES.has(planetItem.planet)
                    ? ({ mixBlendMode: 'multiply' } as any)
                    : null,
                ]}
                resizeMode="cover"
                onError={() =>
                  setFailedPlanetImages((prev) => ({ ...prev, [planetItem.planet]: true }))
                }
              />
            ) : (
              <View style={styles.planetStripFallback}>
                <Text style={styles.planetStripFallbackText}>{PLANET_FALLBACK_GLYPHS[planetItem.planet]}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão Cosmos — abaixo dos planetas, centralizado */}
      {showCosmosEntry ? (
        <TouchableOpacity
          style={styles.cosmosEntry}
          activeOpacity={0.78}
          onPress={() => (navigation as any).navigate('Cosmos')}
        >
          <MiniWheelIcon size={44} />
          <Text style={styles.cosmosEntryLabel}>Tábula Estelar</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  planetStripSection: {
    marginTop: -6,
    marginBottom: 4,
    paddingHorizontal: 10,
  },
  planetStripRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  planetStripItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 2,
    minWidth: 0,
  },
  planetStripImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.45)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  planetStripImageWhiteBgFix: {
    backgroundColor: 'rgba(8,12,30,0.92)',
  },
  planetStripFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  planetStripFallbackText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 18,
  },
  cosmosEntry: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 12,
    gap: 6,
  },
  cosmosEntryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
})
