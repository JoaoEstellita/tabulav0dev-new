import React from "react"
import { View, Text, ScrollView, StyleSheet } from "react-native"
import Svg, { Rect, Line, Text as SvgText } from "react-native-svg"

/**
 * Efeméride gráfica das Previsões, no formato "calendário de trânsitos" clássico
 * (o 2º print que o João pediu): agrupado por PLANETA EM TRÂNSITO na ordem dos
 * regentes (Sol→Plutão); dentro de cada grupo, UMA SUB-LINHA por ponto natal
 * aspectado, rotulada à esquerda com `trânsito+aspecto+natal` (ex.: ☉⚹♄). Cada
 * aspecto ganha a própria linha → some a sobreposição de glifos, mostra tudo, e
 * dá pra distinguir qual trânsito com qual planeta. Cada barra é TOCÁVEL: abre a
 * leitura do aspecto (onSelectEvent). Só VIEW — consome `events`/`range`.
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
// Ordem clássica (regentes): Sol primeiro, Lua, e os demais até Plutão.
const PLANET_ORDER = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]
const ASPECT_SYMBOLS: Record<string, string> = {
  CONJUNCTION: "☌", SEXTILE: "✶", SQUARE: "□", TRINE: "△", OPPOSITION: "☍", QUINCUNX: "⚻",
}
const POINT_SYMBOLS: Record<string, string> = {
  ...PLANET_SYMBOLS,
  Ascendant: "Asc", ASC: "Asc", Midheaven: "MC", MC: "MC", IC: "IC",
  Descendant: "Dsc", Dsc: "Dsc", NorthNode: "☊", SouthNode: "☋",
}
// Ordem dos alvos natais dentro de um grupo (planetas, depois ângulos/nódulos).
const NATAL_ORDER = [
  ...PLANET_ORDER,
  "Ascendant", "ASC", "Descendant", "Dsc", "Midheaven", "MC", "IC", "NorthNode", "SouthNode",
]
const natalRank = (p: string) => {
  const i = NATAL_ORDER.indexOf(p)
  return i < 0 ? 999 : i
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

type SubRow = {
  key: string
  transitPlanet: string
  natalPoint: string
  aspect: string
  events: EphemEvent[]
  groupIdx: number
}

export default function ForecastEphemerisChart({
  events, rangeFrom, rangeTo, language = "pt-BR", onSelectEvent,
}: {
  events: EphemEvent[]
  rangeFrom: string // 'YYYY-MM-DD'
  rangeTo: string
  language?: string
  /** Toca numa barra → abre a leitura do aspecto (id do evento + dia do pico). */
  onSelectEvent?: (eventId: string, dateKey: string) => void
}) {
  const t = L[language] || L["pt-BR"]
  const fromMs = toMs(`${rangeFrom}T00:00:00Z`)
  const toEndMs = toMs(`${rangeTo}T00:00:00Z`)
  const totalDays = Math.max(1, Math.round((toEndMs - fromMs) / DAY_MS) + 1)

  const list = Array.isArray(events) ? events : []

  // Sub-linhas: agrupa por planeta em trânsito (ordem clássica); dentro, uma
  // linha por (ponto natal + aspecto). Grupos alternam sombra para leitura.
  const rows: SubRow[] = []
  let groupIdx = 0
  const transitOrder = [
    ...PLANET_ORDER.filter((p) => list.some((e) => e.transitPlanet === p)),
    ...Array.from(new Set(list.map((e) => e.transitPlanet))).filter((p) => !PLANET_ORDER.includes(p)),
  ]
  for (const P of transitOrder) {
    const evP = list.filter((e) => e.transitPlanet === P)
    if (!evP.length) continue
    const byPair = new Map<string, EphemEvent[]>()
    for (const e of evP) {
      const k = `${e.natalPoint}|${e.aspect}`
      const arr = byPair.get(k) || []
      arr.push(e)
      byPair.set(k, arr)
    }
    const sub = Array.from(byPair.values()).map((evs) => ({
      key: `${P}|${evs[0].natalPoint}|${evs[0].aspect}`,
      transitPlanet: P,
      natalPoint: evs[0].natalPoint,
      aspect: evs[0].aspect,
      events: evs,
      groupIdx,
    }))
    sub.sort((a, b) => natalRank(a.natalPoint) - natalRank(b.natalPoint) || a.aspect.localeCompare(b.aspect))
    rows.push(...sub)
    groupIdx += 1
  }

  if (!list.length || !rows.length || !Number.isFinite(fromMs) || !Number.isFinite(toEndMs)) {
    return <Text style={styles.empty}>{t.empty}</Text>
  }

  const dayW = totalDays > 90 ? 8 : totalDays > 45 ? 12 : totalDays > 20 ? 20 : 34
  const gutter = 48 // rótulo trânsito+aspecto+natal à esquerda
  const topAxis = 20
  const rowH = 16
  const height = topAxis + rows.length * rowH + 8
  const width = gutter + totalDays * dayW + 10

  const xOf = (iso: string) => gutter + ((toMs(iso) - fromMs) / DAY_MS) * dayW
  const labelEvery = totalDays > 90 ? 7 : totalDays > 45 ? 5 : totalDays > 20 ? 2 : 1
  const now = Date.now()

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ paddingRight: 8 }}>
        <Svg width={width} height={height}>
          {/* sombra alternada por grupo de planeta em trânsito */}
          {rows.map((r, i) =>
            r.groupIdx % 2 === 1 ? (
              <Rect key={`bg${i}`} x={0} y={topAxis + i * rowH} width={width} height={rowH} fill="rgba(255,255,255,0.025)" />
            ) : null,
          )}

          {/* grade de dias + números */}
          {Array.from({ length: totalDays }, (_, i) => {
            const x = gutter + i * dayW
            const showLabel = i % labelEvery === 0
            return (
              <React.Fragment key={`d${i}`}>
                <Line x1={x} y1={topAxis} x2={x} y2={height - 8} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                {showLabel ? (
                  <SvgText x={x + dayW / 2} y={12} fontSize={9} fill="#6a7288" textAnchor="middle">
                    {new Date(fromMs + i * DAY_MS).getUTCDate()}
                  </SvgText>
                ) : null}
              </React.Fragment>
            )
          })}

          {/* linhas de aspecto: rótulo à esquerda + barra(s) no período */}
          {rows.map((r, i) => {
            const y = topAxis + i * rowH + rowH / 2
            const label =
              (PLANET_SYMBOLS[r.transitPlanet] || r.transitPlanet.slice(0, 2)) +
              (ASPECT_SYMBOLS[r.aspect] || "") +
              (POINT_SYMBOLS[r.natalPoint] || r.natalPoint.slice(0, 2))
            return (
              <React.Fragment key={r.key}>
                <SvgText x={gutter - 5} y={y + 3.5} fontSize={11} fill="#c9cfe0" textAnchor="end">
                  {label}
                </SvgText>
                {r.events.map((e, j) => {
                  const x1 = Math.max(gutter, xOf(e.startAt))
                  const x2 = Math.min(width - 10, xOf(e.endAt))
                  const w = Math.max(4, x2 - x1)
                  const dateKey = (e.exactAt || "").slice(0, 10)
                  return (
                    <React.Fragment key={e.id + j}>
                      <Rect
                        x={x1} y={y - 4} width={w} height={8} rx={4}
                        fill={impactColor(e.impact)} opacity={0.85}
                        onPress={onSelectEvent ? () => onSelectEvent(e.id, dateKey) : undefined}
                      />
                      {/* tick no pico (exactAt) para marcar o momento exato */}
                      <Line x1={xOf(e.exactAt)} y1={y - 5} x2={xOf(e.exactAt)} y2={y + 5} stroke="#0b0a14" strokeWidth={1} opacity={0.5} />
                    </React.Fragment>
                  )
                })}
              </React.Fragment>
            )
          })}

          {/* linha de HOJE */}
          {now >= fromMs && now <= toEndMs + DAY_MS ? (
            <Line
              x1={gutter + ((now - fromMs) / DAY_MS) * dayW} y1={topAxis - 2}
              x2={gutter + ((now - fromMs) / DAY_MS) * dayW} y2={height - 8}
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
      {onSelectEvent ? (
        <Text style={styles.hint}>
          {language === "en-US" ? "Tap a bar to open the transit reading."
            : language === "es-ES" ? "Toca una barra para abrir la lectura del transito."
            : language === "it-IT" ? "Tocca una barra per aprire la lettura del transito."
            : "Toque numa barra para abrir a leitura do trânsito."}
        </Text>
      ) : null}
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
  hint: { color: "#6a7288", fontSize: 11, textAlign: "center", marginTop: 6 },
})
