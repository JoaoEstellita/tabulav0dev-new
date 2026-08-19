import React from "react"
import { View, Text, ScrollView, StyleSheet } from "react-native"
import Svg, { Rect, Line, Text as SvgText } from "react-native-svg"

/**
 * Efeméride gráfica das Previsões: linhas por planeta em trânsito × dias do
 * período; cada aspecto trânsito→natal vira uma BARRA (janela startAt→endAt)
 * colorida por impacto (harmônico/tenso/misto), com o glifo do aspecto+ponto
 * natal no pico (exactAt). Estilo do print que o João pediu. Só VIEW — consome
 * `data.events`/`range` que a ForecastScreen já busca (sem tocar no backend).
 */
export type EphemEvent = {
  id: string
  transitPlanet: string
  natalPoint: string
  aspect: string // 'CONJUNCTION'|'SEXTILE'|'SQUARE'|'TRINE'|'OPPOSITION'|...
  startAt: string
  exactAt: string
  endAt: string
  impact?: string // 'UP'|'DOWN'|'MIXED'
  intensity?: number
}

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇",
}
// Da mais rápida à mais lenta (ordem visual, como na efeméride clássica).
const PLANET_ORDER = ["Moon", "Mercury", "Venus", "Sun", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]
const ASPECT_SYMBOLS: Record<string, string> = {
  CONJUNCTION: "☌", SEXTILE: "✶", SQUARE: "□", TRINE: "△", OPPOSITION: "☍", QUINCUNX: "⚻",
}
const POINT_SYMBOLS: Record<string, string> = {
  ...PLANET_SYMBOLS,
  Ascendant: "Asc", ASC: "Asc", Midheaven: "MC", MC: "MC", NorthNode: "☊", SouthNode: "☋",
}
const impactColor = (impact?: string) =>
  impact === "UP" ? "#22C55E" : impact === "DOWN" ? "#EF4444" : "#D9A406" // MIXED = âmbar

const DAY_MS = 86400000
const toMs = (iso: string) => {
  const d = new Date(iso).getTime()
  return Number.isFinite(d) ? d : NaN
}

const L: Record<string, { harm: string; tense: string; mixed: string; empty: string }> = {
  "pt-BR": { harm: "harmônico", tense: "tenso", mixed: "misto", empty: "Sem trânsitos no período." },
  "en-US": { harm: "harmonic", tense: "tense", mixed: "mixed", empty: "No transits in this range." },
  "es-ES": { harm: "armonico", tense: "tenso", mixed: "mixto", empty: "Sin transitos en el periodo." },
  "it-IT": { harm: "armonico", tense: "teso", mixed: "misto", empty: "Nessun transito nel periodo." },
}

export default function ForecastEphemerisChart({
  events, rangeFrom, rangeTo, language = "pt-BR",
}: {
  events: EphemEvent[]
  rangeFrom: string // 'YYYY-MM-DD'
  rangeTo: string
  language?: string
}) {
  const t = L[language] || L["pt-BR"]
  const fromMs = toMs(`${rangeFrom}T00:00:00Z`)
  const toEndMs = toMs(`${rangeTo}T00:00:00Z`)
  const totalDays = Math.max(1, Math.round((toEndMs - fromMs) / DAY_MS) + 1)

  const list = Array.isArray(events) ? events : []
  const present = new Set(list.map((e) => e.transitPlanet))
  const rows = PLANET_ORDER.filter((p) => present.has(p))
  // planetas fora da ordem conhecida (raro) vão pro fim
  for (const p of present) if (!PLANET_ORDER.includes(p)) rows.push(p)

  if (!list.length || !rows.length || !Number.isFinite(fromMs) || !Number.isFinite(toEndMs)) {
    return <Text style={styles.empty}>{t.empty}</Text>
  }

  const dayW = totalDays > 60 ? 9 : totalDays > 40 ? 13 : totalDays > 20 ? 22 : 30
  const gutter = 30
  const topAxis = 22
  const rowH = 30
  const height = topAxis + rows.length * rowH + 10
  const width = gutter + totalDays * dayW + 10

  const xOf = (iso: string) => gutter + ((toMs(iso) - fromMs) / DAY_MS) * dayW
  const rowY = (planet: string) => {
    const i = rows.indexOf(planet)
    return i < 0 ? -100 : topAxis + i * rowH + rowH / 2
  }
  const labelEvery = totalDays > 60 ? 7 : totalDays > 40 ? 5 : totalDays > 20 ? 2 : 1
  const now = Date.now()

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ paddingRight: 8 }}>
        <Svg width={width} height={height}>
          {/* grade de dias + números */}
          {Array.from({ length: totalDays }, (_, i) => {
            const x = gutter + i * dayW
            const showLabel = i % labelEvery === 0
            return (
              <React.Fragment key={`d${i}`}>
                <Line x1={x} y1={topAxis} x2={x} y2={height - 10} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                {showLabel ? (
                  <SvgText x={x + dayW / 2} y={13} fontSize={9} fill="#6a7288" textAnchor="middle">
                    {new Date(fromMs + i * DAY_MS).getUTCDate()}
                  </SvgText>
                ) : null}
              </React.Fragment>
            )
          })}

          {/* separadores + glifo de cada linha (planeta em trânsito) */}
          {rows.map((p, i) => (
            <React.Fragment key={`row${p}`}>
              <Line x1={gutter} y1={topAxis + i * rowH} x2={width - 10} y2={topAxis + i * rowH} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
              <SvgText x={gutter - 6} y={rowY(p) + 4} fontSize={14} fill="#c9cfe0" textAnchor="end">
                {PLANET_SYMBOLS[p] || p.slice(0, 2)}
              </SvgText>
            </React.Fragment>
          ))}

          {/* barras (janelas de aspecto) + glifo no pico */}
          {list.map((e) => {
            const y = rowY(e.transitPlanet)
            if (y < 0) return null
            const x1 = Math.max(gutter, xOf(e.startAt))
            const x2 = Math.min(width - 10, xOf(e.endAt))
            const w = Math.max(3, x2 - x1)
            const xe = xOf(e.exactAt)
            return (
              <React.Fragment key={e.id}>
                <Rect x={x1} y={y - 5} width={w} height={10} rx={5} fill={impactColor(e.impact)} opacity={0.82} />
                <SvgText x={xe} y={y - 8} fontSize={10} fill="#e6e6ee" textAnchor="middle">
                  {(ASPECT_SYMBOLS[e.aspect] || "") + (POINT_SYMBOLS[e.natalPoint] || "")}
                </SvgText>
              </React.Fragment>
            )
          })}

          {/* linha de HOJE */}
          {now >= fromMs && now <= toEndMs + DAY_MS ? (
            <Line
              x1={gutter + ((now - fromMs) / DAY_MS) * dayW} y1={topAxis - 2}
              x2={gutter + ((now - fromMs) / DAY_MS) * dayW} y2={height - 10}
              stroke="#FFD700" strokeWidth={1} strokeDasharray="3,3"
            />
          ) : null}
        </Svg>
      </ScrollView>

      <View style={styles.legend}>
        <Dot c="#22C55E" label={t.harm} />
        <Dot c="#EF4444" label={t.tense} />
        <Dot c="#D9A406" label={t.mixed} />
      </View>
    </View>
  )
}

function Dot({ c, label }: { c: string; label: string }) {
  return (
    <View style={styles.dotRow}>
      <View style={[styles.dot, { backgroundColor: c }]} />
      <Text style={styles.dotLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 8 },
  empty: { color: "#8892a4", fontSize: 13, textAlign: "center", paddingVertical: 24 },
  legend: { flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 8 },
  dotRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 3 },
  dotLabel: { color: "#8892a4", fontSize: 11 },
})
