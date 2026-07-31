/**
 * Chart Rasi (D1) no estilo SUL-INDIANO — grade 4×4, signos em posições FIXAS
 * (horário a partir de Peixes no topo-esquerda). Cada planeta aparece na célula
 * do seu signo sideral (Rashi). A Lagna (ascendente) é destacada. SVG puro.
 *
 * Só os 9 grahas védicos (Sol…Saturno + Rahu/Ketu) — Urano/Netuno/Plutão não
 * fazem parte do Jyotish e são omitidos.
 */
import React from 'react'
import { View, StyleSheet } from 'react-native'
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg'
import type { VedicChart } from '../astro/vedic'

interface Props {
  chart: VedicChart
  size?: number
  onSelectPlanet?: (name: string) => void
}

// rashiIndex (0=Áries … 11=Peixes) → célula [linha, coluna] na grade 4×4.
// Layout Sul-Indiano padrão: Peixes(11) no topo-esquerda, horário.
const CELL: Record<number, [number, number]> = {
  11: [0, 0], 0: [0, 1], 1: [0, 2], 2: [0, 3],
  10: [1, 0], 3: [1, 3],
  9: [2, 0], 4: [2, 3],
  8: [3, 0], 7: [3, 1], 6: [3, 2], 5: [3, 3],
}
const SIGN_GLYPH = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

// Grahas védicos: glifo + cor. Nomes do motor (PascalCase EN).
const GRAHA: Record<string, { glyph: string; color: string }> = {
  Sun: { glyph: '☉', color: '#FFB74D' },
  Moon: { glyph: '☽', color: '#E0E0E0' },
  Mercury: { glyph: '☿', color: '#4DD0E1' },
  Venus: { glyph: '♀', color: '#F48FB1' },
  Mars: { glyph: '♂', color: '#EF5350' },
  Jupiter: { glyph: '♃', color: '#FFD54F' },
  Saturn: { glyph: '♄', color: '#90A4AE' },
  Rahu: { glyph: '☊', color: '#9575CD' },
  Ketu: { glyph: '☋', color: '#A1887F' },
}

export default function VedicChartSouth({ chart, size = 300, onSelectPlanet }: Props) {
  const cell = size / 4
  const pad = size * 0.02

  // Agrupa os grahas por rashiIndex (só os védicos).
  const byRashi: Record<number, VedicChart['planets']> = {}
  for (const p of chart.planets) {
    if (!GRAHA[p.name]) continue
    ;(byRashi[p.rashiIndex] ||= []).push(p)
  }

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size}>
        {/* moldura + linhas da grade */}
        <Rect x={0.5} y={0.5} width={size - 1} height={size - 1} fill="#0d1018" stroke="#3a4055" strokeWidth={1.5} />
        {[1, 2, 3].map((i) => (
          <React.Fragment key={`l-${i}`}>
            <Line x1={i * cell} y1={0} x2={i * cell} y2={size} stroke="#252b38" strokeWidth={1} />
            <Line x1={0} y1={i * cell} x2={size} y2={i * cell} stroke="#252b38" strokeWidth={1} />
          </React.Fragment>
        ))}
        {/* bloco central 2×2 (esconde as linhas do meio) */}
        <Rect x={cell} y={cell} width={cell * 2} height={cell * 2} fill="#0d1018" stroke="#3a4055" strokeWidth={1.5} />
        <SvgText x={size / 2} y={size / 2 - 6} fontSize={size * 0.05} fill="#8892a4" textAnchor="middle" fontWeight="700">RASI</SvgText>
        <SvgText x={size / 2} y={size / 2 + 14} fontSize={size * 0.035} fill="#5a6072" textAnchor="middle">D1 · Jyotish</SvgText>

        {/* 12 células de signo */}
        {Object.entries(CELL).map(([idxStr, [row, col]]) => {
          const idx = Number(idxStr)
          const x = col * cell
          const y = row * cell
          const isLagna = chart.lagna.rashiIndex === idx
          const grahas = byRashi[idx] || []
          return (
            <G key={`c-${idx}`}>
              {isLagna ? (
                <Rect x={x + 1.5} y={y + 1.5} width={cell - 3} height={cell - 3} fill="none" stroke="#FFD700" strokeWidth={1.5} />
              ) : null}
              {/* símbolo do signo no canto */}
              <SvgText x={x + pad + 3} y={y + pad + 12} fontSize={size * 0.036} fill="#5a6072" textAnchor="start">{SIGN_GLYPH[idx]}</SvgText>
              {isLagna ? (
                <SvgText x={x + cell - pad - 3} y={y + pad + 12} fontSize={size * 0.03} fill="#FFD700" textAnchor="end" fontWeight="700">La</SvgText>
              ) : null}
              {/* grahas na célula */}
              {grahas.map((p, i) => {
                const g = GRAHA[p.name]
                const perRow = 3
                const gx = x + pad + 8 + (i % perRow) * (cell * 0.28)
                const gy = y + cell - pad - 6 - Math.floor(i / perRow) * (size * 0.05)
                return (
                  <G key={p.name} onPress={onSelectPlanet ? () => onSelectPlanet(p.name) : undefined}>
                    <SvgText x={gx} y={gy} fontSize={size * 0.05} fill={g.color} textAnchor="middle" fontWeight="700">
                      {g.glyph}{p.retro ? '℞' : ''}
                    </SvgText>
                  </G>
                )
              })}
            </G>
          )
        })}
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
})
