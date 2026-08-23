import React, { useState } from "react"
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
  const [containerW, setContainerW] = useState(0)
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

  const gutter = 56 // rótulo trânsito+aspecto+natal à esquerda
  const topAxis = 22
  const rowH = 24
  const barH = 13
  const minDayW = totalDays > 90 ? 11 : totalDays > 45 ? 16 : totalDays > 20 ? 26 : 40
  // Preenche a largura do card em períodos curtos (mede via onLayout); nos longos
  // usa o mínimo e rola na horizontal.
  const avail = containerW > 0 ? containerW - gutter - 12 : 0
  const dayW = Math.max(minDayW, avail > 0 ? avail / totalDays : minDayW)
  const height = topAxis + rows.length * rowH + 10
  // A coluna de rótulos (gutter) fica FIXA; só a área de plotagem rola na horizontal.
  const plotW = totalDays * dayW + 10

  const xOf = (iso: string) => ((toMs(iso) - fromMs) / DAY_MS) * dayW
  const labelEvery = totalDays > 90 ? 7 : totalDays > 45 ? 5 : totalDays > 20 ? 2 : 1
  const now = Date.now()

  return (
    <View
      style={styles.wrap}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width
        if (w && Math.abs(w - containerW) > 1) setContainerW(w)
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        {/* COLUNA FIXA: rótulos trânsito+aspecto+natal — não rola na horizontal.
            Envolta em View com width fixo: no RN o <Svg> solto numa row não reserva
            o espaço de layout e a coluna colapsava (labels sumiam no mobile). */}
        <View style={{ width: gutter }}>
        <Svg width={gutter} height={height}>
          {rows.map((r, i) =>
            r.groupIdx % 2 === 1 ? (
              <Rect key={`lbg${i}`} x={0} y={topAxis + i * rowH} width={gutter} height={rowH} fill="rgba(255,255,255,0.025)" />
            ) : null,
          )}
          {rows.map((r, i) => {
            const y = topAxis + i * rowH + rowH / 2
            const label =
              (PLANET_SYMBOLS[r.transitPlanet] || r.transitPlanet.slice(0, 2)) +
              (ASPECT_SYMBOLS[r.aspect] || "") +
              (POINT_SYMBOLS[r.natalPoint] || r.natalPoint.slice(0, 2))
            return (
              <SvgText key={r.key} x={gutter - 5} y={y + 4.5} fontSize={13} fill="#c9cfe0" textAnchor="end">
                {label}
              </SvgText>
            )
          })}
          {/* borda direita sutil separando a coluna fixa da área rolável */}
          <Line x1={gutter - 0.5} y1={topAxis} x2={gutter - 0.5} y2={height - 8} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        </Svg>
        </View>

        {/* ÁREA ROLÁVEL: grade de dias + barras (x começa em 0, sem o gutter) */}
        <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ paddingRight: 8 }} style={{ flex: 1 }}>
          <Svg width={plotW} height={height}>
            {/* sombra alternada por grupo (continua a faixa da coluna fixa) */}
            {rows.map((r, i) =>
              r.groupIdx % 2 === 1 ? (
                <Rect key={`bg${i}`} x={0} y={topAxis + i * rowH} width={plotW} height={rowH} fill="rgba(255,255,255,0.025)" />
              ) : null,
            )}

            {/* grade de dias + números */}
            {Array.from({ length: totalDays }, (_, i) => {
              const x = i * dayW
              const showLabel = i % labelEvery === 0
              return (
                <React.Fragment key={`d${i}`}>
                  <Line x1={x} y1={topAxis} x2={x} y2={height - 8} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                  {showLabel ? (
                    <SvgText x={x + dayW / 2} y={14} fontSize={11} fill="#8892a4" textAnchor="middle">
                      {new Date(fromMs + i * DAY_MS).getUTCDate()}
                    </SvgText>
                  ) : null}
                </React.Fragment>
              )
            })}

            {/* barra(s) por linha de aspecto */}
            {rows.map((r, i) => {
              const y = topAxis + i * rowH + rowH / 2
              return (
                <React.Fragment key={r.key}>
                  {r.events.map((e, j) => {
                    const x1 = Math.max(0, xOf(e.startAt))
                    const x2 = Math.min(plotW - 10, xOf(e.endAt))
                    const w = Math.max(5, x2 - x1)
                    const xe = xOf(e.exactAt)
                    const inRange = (d: string) => !!d && d >= rangeFrom && d <= rangeTo
                    const peakDay = (e.exactAt || "").slice(0, 10)
                    const startDay = (e.startAt || "").slice(0, 10)
                    const dateKey = inRange(peakDay) ? peakDay : inRange(startDay) ? startDay : rangeFrom
                    const hitW = Math.max(w, 18)
                    const hitX = x1 - Math.max(0, (hitW - w) / 2)
                    return (
                      <React.Fragment key={e.id + j}>
                        <Rect x={x1} y={y - barH / 2} width={w} height={barH} rx={barH / 2} fill={impactColor(e.impact)} opacity={0.85} />
                        <Line x1={xe} y1={y - barH / 2 - 1} x2={xe} y2={y + barH / 2 + 1} stroke="#0b0a14" strokeWidth={1.5} opacity={0.45} />
                        {onSelectEvent ? (
                          <Rect x={hitX} y={topAxis + i * rowH} width={hitW} height={rowH} fill="rgba(0,0,0,0)" onPress={() => onSelectEvent(e.id, dateKey)} />
                        ) : null}
                      </React.Fragment>
                    )
                  })}
                </React.Fragment>
              )
            })}

            {/* linha de HOJE */}
            {now >= fromMs && now <= toEndMs + DAY_MS ? (
              <Line
                x1={((now - fromMs) / DAY_MS) * dayW} y1={topAxis - 2}
                x2={((now - fromMs) / DAY_MS) * dayW} y2={height - 8}
                stroke="#FFD700" strokeWidth={1} strokeDasharray="3,3"
              />
            ) : null}
          </Svg>
        </ScrollView>
      </View>

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
